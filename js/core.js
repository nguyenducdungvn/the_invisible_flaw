/* core.js — trạng thái, lưu game, HUD, sổ tay công thức, atlas, trung tâm hợp đồng và vòng lặp nhiệm vụ. */
(function (root) {
  'use strict';
  const P = root.Physics;

  /* ---------- tiện ích DOM ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(9)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  const $ = s => document.querySelector(s);
  const fmt = (x, d = 1) => (+x).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt0 = x => fmt(x, 0);
  function parseNum(s) { if (s == null) return NaN; return parseFloat(String(s).trim().replace(/\s/g, '').replace(',', '.')); }
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function slider(label, min, max, step, val, unit, oninput) {
    const out = h('span', null, ''); const inp = h('input', { type: 'range', min, max, step, value: val });
    const upd = () => { const v = +inp.value; out.textContent = fmt(v, step < 1 ? (step < 0.1 ? 2 : 1) : 0) + (unit ? ' ' + unit : ''); oninput && oninput(v); };
    inp.addEventListener('input', upd); setTimeout(upd);
    const wrap = h('div', { class: 'sl' }, h('span', null, label), inp, out); wrap.input = inp; return wrap;
  }
  function fitCanvas(cv, hpx) {
    const dpr = Math.min(2, window.devicePixelRatio || 1); const w = cv.clientWidth || cv.parentElement.clientWidth || 600;
    cv.width = Math.round(w * dpr); cv.height = Math.round(hpx * dpr); cv.style.height = hpx + 'px';
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { ctx, W: w, H: hpx };
  }

  /* ---------- trạng thái & lưu ---------- */
  const KEY = 'invisible-flaw-v1';
  const fresh = () => ({ name: '', money: 50, rep: 30, certs: {}, done: {}, atlas: {}, cards: {}, acad: {}, runs: 0, log: [] });
  let S = fresh();
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) S = Object.assign(fresh(), s); } catch (e) { /* bỏ qua */ } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* trình duyệt chặn lưu */ } }

  /* ---------- sổ tay công thức (thẻ mở khóa trong phòng thí nghiệm) ---------- */
  const CARDS = {
    capillary: { t: 'Mao dẫn trong khe hẹp', f: 'h = 2·γ·cosθ / (ρ·g·w)', lab: 'capillary',
      ins: [['γ', 'Sức căng bề mặt (N/m)', 0.03], ['θ', 'Góc tiếp xúc (°)', 10], ['ρ', 'Khối lượng riêng (kg/m³)', 900], ['w', 'Độ rộng khe (µm)', 20]],
      calc: v => `h = ${fmt(P.capillaryRiseSlit(v[0], v[1], v[2], v[3] * 1e-6) * 1000, 1)} mm` },
    washburn: { t: 'Thời gian thấm (Washburn, khe)', f: 't = 3·η·L² / (γ·w·cosθ)', lab: 'capillary',
      ins: [['η', 'Độ nhớt (mPa·s)', 5], ['L', 'Độ sâu cần thấm (mm)', 2], ['γ', 'Sức căng bề mặt (N/m)', 0.03], ['w', 'Độ rộng khe (µm)', 1], ['θ', 'Góc tiếp xúc (°)', 10]],
      calc: v => `t = ${fmt(P.washburnTimeSlit(v[0] * 1e-3, v[1] * 1e-3, v[2], v[3] * 1e-6, v[4]), 2)} s` },
    leakage: { t: 'Từ thông rò theo góc', f: 'Φrò ∝ |sin(α_trường − α_nứt)|  ·  phát hiện tốt khi ≥ sin45° = 0,71', lab: 'magnet',
      ins: [['α_trường', 'Hướng đường sức (°)', 0], ['α_nứt', 'Hướng vết nứt (°)', 30]],
      calc: v => { const k = P.leakageFactor(v[0], v[1]); return `|sinΔ| = ${fmt(k, 2)} → ${k >= P.MT_DETECT ? 'phát hiện tốt' : 'dễ bỏ sót'}`; } },
    snell: { t: 'Định luật Snell', f: 'sinθ₁ / v₁ = sinθ₂ / v₂', lab: 'snell',
      ins: [['θ₁', 'Góc tới (°)', 45], ['v₁', 'Vận tốc môi trường 1 (m/s)', 2730], ['v₂', 'Vận tốc môi trường 2 (m/s)', 3240]],
      calc: v => { const r = P.snell(v[0], v[1], v[2]); return r == null ? 'Vượt góc tới hạn: sóng không truyền qua' : `θ₂ = ${fmt(r, 1)}°`; } },
    anglebeam: { t: 'Hình học đầu dò góc', f: 'độ sâu = SP·cosθ (chân 1) · 2T − SP·cosθ (chân 2) · khoảng cách bề mặt = SP·sinθ', lab: 'snell',
      ins: [['SP', 'Đường truyền âm (mm)', 50], ['θ', 'Góc khúc xạ (°)', 60], ['T', 'Chiều dày (mm)', 25]],
      calc: v => { const r = P.angleBeam(v[0], v[1], v[2]); return `chân ${r.leg} · độ sâu ${fmt(r.depth, 1)} mm · khoảng cách bề mặt ${fmt(r.surf, 1)} mm · bước nhảy ${fmt(P.skipDistance(v[2], v[1]), 1)} mm`; } },
    decibel: { t: 'Decibel', f: 'ΔdB = 20·log₁₀(A₂ / A₁)', lab: 'snell',
      ins: [['A₂', 'Biên độ 2 (%)', 40], ['A₁', 'Biên độ 1 (%)', 80]],
      calc: v => `ΔdB = ${fmt(P.dB(v[0], v[1]), 1)} dB` },
    decay: { t: 'Phân rã phóng xạ', f: 'A = A₀ · 0,5^(t / T½)   (Ir-192: T½ = 73,83 ngày)', lab: 'radiation',
      ins: [['A₀', 'Hoạt độ ban đầu (GBq)', 1000], ['t', 'Thời gian (ngày)', 30]],
      calc: v => `A = ${fmt(P.decay(v[0], v[1]), 0)} GBq` },
    inverse: { t: 'Suất liều & nghịch đảo bình phương', f: 'Ḣ = Γ·A / d²   (Γ Ir-192 ≈ 0,13 mSv·m²/(h·GBq))', lab: 'radiation',
      ins: [['A', 'Hoạt độ (GBq)', 800], ['d', 'Khoảng cách (m)', 10], ['k', 'Hệ số giảm che chắn (lần)', 1]],
      calc: v => `Ḣ = ${fmt(P.doseRate(v[0], v[1]) * 1000 / v[2], 1)} µSv/h` },
    exposure: { t: 'Thời gian chiếu', f: 't = E₁ₘ · SFD² / A   (E₁ₘ: GBq·h quy về 1 m)', lab: 'radiation',
      ins: [['E₁ₘ', 'Phơi sáng yêu cầu (GBq·h)', 220], ['SFD', 'Nguồn – phim (m)', 0.5], ['A', 'Hoạt độ (GBq)', 800]],
      calc: v => `t = ${fmt(P.exposureMinutes(v[0], v[1], v[2]), 1)} phút` },
    /* thẻ mở từ Học viện */
    impedance: { t: 'Trở kháng cuộn dây', f: 'XL = 2πfL · Z = √(R² + XL²) · tanφ = XL/R', lab: 'academy',
      ins: [['R', 'Điện trở (Ω)', 3], ['f', 'Tần số (kHz)', 100], ['L', 'Độ tự cảm (µH)', 6.4]],
      calc: v => { const XL = P.inductiveReactance(v[1] * 1e3, v[2] * 1e-6); return `XL = ${fmt(XL, 2)} Ω · Z = ${fmt(P.impedanceZ(v[0], XL), 2)} Ω · φ = ${fmt(P.phaseDeg(v[0], XL), 1)}°`; } },
    skindepth: { t: 'Độ sâu thấm chuẩn', f: 'δ = 1/√(π·f·μ₀μr·σ) · trễ pha β = x/δ', lab: 'academy',
      ins: [['f', 'Tần số (kHz)', 100], ['σ', 'Độ dẫn điện (% IACS)', 40], ['μr', 'Độ từ thẩm tương đối', 1]],
      calc: v => `δ = ${fmt(P.skinDepth(v[0] * 1e3, v[1] / 100 * P.IACS, v[2]) * 1000, 3)} mm · 3δ = ${fmt(3 * P.skinDepth(v[0] * 1e3, v[1] / 100 * P.IACS, v[2]) * 1000, 3)} mm` },
    wavelength: { t: 'Bước sóng', f: 'λ = v/f · khuyết tật nhỏ nhất ≈ λ/2', lab: 'academy',
      ins: [['v', 'Vận tốc (m/s)', 5920], ['f', 'Tần số (MHz)', 5]],
      calc: v => `λ = ${fmt(P.wavelength(v[0], v[1] * 1e6) * 1000, 3)} mm · λ/2 = ${fmt(P.wavelength(v[0], v[1] * 1e6) * 500, 3)} mm` },
    acimp: { t: 'Trở kháng âm & phản xạ', f: 'Z = ρ·v · R = ((Z₂ − Z₁)/(Z₂ + Z₁))² · T = 1 − R', lab: 'academy',
      ins: [['Z₁', 'Trở kháng 1 (MRayl)', 1.48], ['Z₂', 'Trở kháng 2 (MRayl)', 46.5]],
      calc: v => `R = ${fmt(P.reflectionCoef(v[0], v[1]) * 100, 2)} % · T = ${fmt(P.transmissionCoef(v[0], v[1]) * 100, 2)} %` },
    nearfield: { t: 'Trường gần đầu dò', f: 'N = D²·f / (4v)', lab: 'academy',
      ins: [['D', 'Đường kính biến tử (mm)', 10], ['f', 'Tần số (MHz)', 5], ['v', 'Vận tốc (m/s)', 5920]],
      calc: v => `N = ${fmt(P.nearField(v[0], v[1], v[2]), 1)} mm` },
    hvlmu: { t: 'Suy giảm tuyến tính', f: 'I = I₀·e^(−μx) · HVL = 0,693/μ', lab: 'academy',
      ins: [['μ', 'Hệ số suy giảm (/mm)', 0.0693], ['x', 'Chiều dày (mm)', 20]],
      calc: v => `HVL = ${fmt(P.hvlFromMu(v[0]), 2)} mm · I/I₀ = ${fmt(P.linearAtten(1, v[0], v[1]) * 100, 2)} %` },
    hooke: { t: 'Định luật Hooke', f: 'σ = E·ε (vùng đàn hồi)', lab: 'academy',
      ins: [['E', 'Mô đun đàn hồi (GPa)', 200], ['ε', 'Biến dạng', 0.001]],
      calc: v => `σ = ${fmt(P.hooke(v[0] * 1000, v[1]), 1)} MPa` },
    aeloc: { t: 'Định vị nguồn phát xạ âm', f: 'x = (D + v·Δt)/2, Δt = t₁ − t₂, x tính từ cảm biến 1', lab: 'academy',
      ins: [['D', 'Khoảng cách cảm biến (m)', 2], ['v', 'Vận tốc sóng (m/s)', 3000], ['Δt', 'Δt (ms)', -0.4]],
      calc: v => `x = ${fmt(P.aeLocate(v[0], v[1], v[2] / 1000), 3)} m` },
    irdepth: { t: 'Độ sâu theo thời gian (nhiệt ảnh)', f: 'z ≈ √(α·t)', lab: 'academy',
      ins: [['α', 'Khuếch tán nhiệt (×10⁻⁷ m²/s)', 4], ['t', 'Thời gian (s)', 10]],
      calc: v => `z ≈ ${fmt(P.thermalDepth(v[1], v[0] * 1e-7) * 1000, 2)} mm` },
    mwgamma: { t: 'Phản xạ vi ba', f: 'Γ = (1 − √ε)/(1 + √ε) · λ = c/f', lab: 'academy',
      ins: [['ε', 'Hằng số điện môi', 4.5], ['f', 'Tần số (GHz)', 10]],
      calc: v => `|Γ| = ${fmt(Math.abs(P.mwGamma(v[0])), 3)} · công suất ${fmt(P.mwGamma(v[0]) ** 2 * 100, 1)} % · λ₀ = ${fmt(300 / v[1], 1)} mm` }
  };
  function cardView(id, calcable) {
    const c = CARDS[id], have = !!S.cards[id];
    const box = h('div', { class: 'fcard' + (have ? '' : ' locked') }, h('b', null, c.t), h('div', { class: 'formula' }, have ? c.f : '— chưa mở khóa —'));
    if (have && calcable) {
      const inputs = c.ins.map(([k, lab, def]) => h('input', { class: 'f', value: String(def).replace('.', ','), 'aria-label': lab, title: lab }));
      const out = h('div', { class: 'mono ok' }, '');
      const grid = h('div', { class: 'grid g4' }, c.ins.map(([k, lab], i) => h('div', null, h('label', { class: 'f' }, `${k} · ${lab}`), inputs[i])));
      const go = h('button', { class: 'btn sm', onclick: () => { const v = inputs.map(i => parseNum(i.value)); out.textContent = v.some(isNaN) ? 'Nhập số hợp lệ' : c.calc(v); if (Game.M) addTime(1, 'tra sổ tay'); } }, 'Tính (+1 phút)');
      box.append(grid, h('div', { class: 'row', style: 'margin-top:8px' }, go, out));
    }
    return box;
  }
  function openNotebook() {
    modal(h('div', null, h('h2', null, 'Sổ tay công thức'),
      h('p', { class: 'dim' }, 'Thẻ công thức mở khóa khi bạn qua phòng thí nghiệm. Trong nhiệm vụ, tự tính bằng tay thì miễn phí; dùng máy tính của sổ tay mất 1 phút dừng máy.'),
      Object.keys(CARDS).map(id => cardView(id, true))));
  }
  function openAtlas() {
    const A = root.ATLAS;
    modal(h('div', null, h('h2', null, 'Atlas khuyết tật'),
      h('p', { class: 'dim' }, `Đã sưu tầm ${Object.keys(S.atlas).length}/${Object.keys(A).length}. Mỗi mục mở khi bạn phân loại đúng nó lần đầu.`),
      h('div', { class: 'atlas' }, Object.entries(A).map(([k, a]) => h('div', { class: 'a' + (S.atlas[k] ? '' : ' no') },
        h('b', null, S.atlas[k] ? a.name : '???'), h('p', { class: 'dim', style: 'font-size:.88rem' }, S.atlas[k] ? a.note : 'Chưa gặp'))))));
  }

  /* ---------- modal & toast ---------- */
  function modal(content, onclose) {
    const m = $('#modal'), b = m.querySelector('.body'); b.innerHTML = ''; b.append(content); m.classList.add('on');
    const close = () => { m.classList.remove('on'); onclose && onclose(); };
    m.querySelector('.x').onclick = close; m.onclick = e => { if (e.target === m) close(); }; return close;
  }
  function ask(msg, yes) { const close = modal(h('div', null, h('p', { class: 'serif', style: 'font-size:1.05rem' }, msg), h('div', { class: 'row' }, h('button', { class: 'btn danger', onclick: () => { close(); yes(); } }, 'Đồng ý'), h('button', { class: 'btn ghost', onclick: () => close() }, 'Thôi')))); }
  function toast(msg, cls = '') { const d = h('div', { class: cls }, msg); $('#toast').append(d); setTimeout(() => d.remove(), 3700); }

  /* ---------- HUD ---------- */
  function hud() {
    const M = Game.M, el = $('#hud'); el.innerHTML = '';
    el.append(h('div', { class: 'brand', onclick: () => { const go = () => { if (Game.M) clearInterval(Game.M.tick); Game.M = null; hub(); }; M ? ask('Bỏ nhiệm vụ đang làm và về trung tâm?', go) : go(); } }, 'The Invisible Flaw', h('small', null, 'Bác Sĩ Vật Liệu')));
    el.append(h('div', { class: 'stat' }, 'Quỹ', h('b', null, fmt(S.money, 1)), 'tr₫'));
    el.append(h('div', { class: 'stat' }, 'Uy tín', h('b', null, fmt0(S.rep))));
    if (M) {
      const over = M.clock > M.lvl.downtime;
      el.append(h('div', { class: 'stat' + (over ? ' danger' : M.clock > M.lvl.downtime * 0.8 ? ' warn' : '') }, 'Dừng máy', h('b', null, `${fmt0(M.clock)}/${M.lvl.downtime}`), 'phút'));
      el.append(h('div', { class: 'stat', title: 'Thẻ an toàn: vi phạm mất một thẻ, hết thẻ là dừng nhiệm vụ' }, 'An toàn',
        h('span', { class: 'shields' }, [0, 1, 2].map(i => h('span', { class: i < M.safety ? '' : 'off' }, i < M.safety ? '◆' : '◇')))));
    }
    el.append(h('button', { class: 'hbtn', onclick: openNotebook }, 'Sổ tay'), h('button', { class: 'hbtn', onclick: openAtlas }, 'Atlas'));
  }

  /* ---------- tài nguyên trong nhiệm vụ ---------- */
  function addTime(min, why) { const M = Game.M; if (!M) return; M.clock += min; M.events.push(`+${min} phút: ${why}`); hud(); }
  function spend(tr, why) { S.money -= tr; if (Game.M) Game.M.spent += tr; save(); hud(); toast(`−${fmt(tr, 1)} tr₫: ${why}`); }
  function safetyHit(why, critical) {
    const M = Game.M; if (!M) return; M.safety = critical ? 0 : M.safety - 1; M.violations.push(why);
    toast((critical ? 'SỰ CỐ AN TOÀN NGHIÊM TRỌNG: ' : 'Vi phạm an toàn: ') + why, 'bad'); hud();
    $('#hud').classList.add('flash'); setTimeout(() => $('#hud').classList.remove('flash'), 700);
    if (M.safety <= 0) setTimeout(() => safetyFail(), 400);
  }
  function safetyFail() {
    const M = Game.M; clearInterval(M && M.tick);
    S.rep = Math.max(0, S.rep - 15); save();
    page(h('div', null, h('div', { class: 'card' }, h('h2', { class: 'bad' }, 'Nhiệm vụ bị đình chỉ vì an toàn'),
      h('ul', null, M.violations.map(v => h('li', null, v))),
      h('p', { class: 'serif' }, 'Trong nghề NDT, không có kết quả kiểm tra nào đáng giá bằng một ca làm việc không ai bị thương. Đội trưởng thu lại giấy phép làm việc của bạn trong hôm nay.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => startMission(M.lvl.id) }, 'Làm lại nhiệm vụ'), h('button', { class: 'btn ghost', onclick: () => { Game.M = null; hub(); } }, 'Về trung tâm')))));
    Game.M = null; hud();
  }

  /* ---------- trang ---------- */
  function page(node) { const a = $('#app'); a.innerHTML = ''; a.append(node); window.scrollTo(0, 0); }
  function stepper(cur) {
    const names = ['Hồ sơ & phương pháp', 'Phòng thí nghiệm', 'Chuẩn bị & hiệu chuẩn', 'Kiểm tra', 'Đánh giá & biên bản', 'Kết quả'];
    return h('div', { class: 'stepper' }, names.map((n, i) => h('div', { class: i < cur ? 'done' : i === cur ? 'on' : '' }, `${i + 1}. ${n}`)));
  }

  function title() {
    Game.M = null; hud();
    const name = h('input', { placeholder: 'Tên kỹ sư tập sự', value: S.name || '', maxlength: 30 });
    page(h('div', null,
      h('div', { class: 'hero' }, h('h1', null, 'The Invisible Flaw'), h('div', { class: 'sub' }, 'Bác Sĩ Vật Liệu: tìm vết thương mà không làm đau người bệnh'),
        h('p', { class: 'dim', style: 'max-width:640px;margin:18px auto' }, 'Bạn là kỹ sư tập sự ở một trung tâm giám định an toàn công nghiệp. Mỗi hợp đồng là một “ca bệnh vật liệu”: chọn phương pháp, làm đúng quy trình, đọc tín hiệu, đối chiếu tiêu chuẩn rồi ký Đạt hay Loại bỏ. Và sáu tháng sau, bạn sẽ biết mình đúng hay sai.'),
        h('div', { class: 'row', style: 'justify-content:center' }, name,
          h('button', { class: 'btn', onclick: () => { S.name = name.value.trim().normalize('NFC') || 'Kỹ sư tập sự'; save(); hub(); } }, S.name ? 'Tiếp tục' : 'Nhận việc')),
        S.name ? h('p', null, h('button', { class: 'btn ghost sm', style: 'margin-top:14px', onclick: () => ask('Xóa toàn bộ tiến trình và chơi lại từ đầu?', () => { S = fresh(); save(); title(); }) }, 'Chơi lại từ đầu')) : null),
      h('div', { class: 'grid g3' },
        h('div', { class: 'card' }, h('h3', null, 'Học đúng lúc cần'), h('p', { class: 'dim' }, 'Phòng thí nghiệm mở ra ngay trước nhiệm vụ cần đến nó. Muốn học kỹ hơn thì vào Học viện NDE: 17 chương từ nguyên tử tới nhiệt ảnh.')),
        h('div', { class: 'card' }, h('h3', null, 'Dự đoán rồi mới đo'), h('p', { class: 'dim' }, 'Bạn tính trước bằng công thức, máy chỉ xác nhận. Dự đoán trúng được thưởng; đoán bừa thì tốn thời gian dừng máy.')),
        h('div', { class: 'card' }, h('h3', null, 'Hậu quả có thật'), h('p', { class: 'dim' }, 'Bỏ sót, báo động giả và vi phạm an toàn đều có giá. Cái sai nguy hiểm nhất thường là lựa chọn hấp dẫn nhất.')))));
  }

  function certName(m) { const c = S.certs[m] || 0; return c === 0 ? 'Thực tập' : c === 1 ? 'Bậc I' : 'Bậc II'; }
  function unlocked(lvl) { if (lvl.order === 1) return true; const prev = root.LEVELS.find(l => l.order === lvl.order - 1); return !!(S.done[prev.id] && S.done[prev.id].stars > 0); }
  function stars(n) { return h('span', { class: 'stars' }, [0, 1, 2].map(i => h('span', { class: i < n ? '' : 'e' }, i < n ? '★' : '☆'))); }

  function hub() {
    Game.M = null; hud();
    const L = root.LEVELS;
    const allDone = L.every(l => S.done[l.id] && S.done[l.id].stars > 0);
    page(h('div', null,
      h('div', { class: 'row' }, h('h2', { style: 'margin:0' }, `Trung tâm Giám định · ${S.name}`), h('span', { class: 'spacer' }),
        ['PT', 'MT', 'UT', 'RT'].map(m => h('span', { class: 'chip' + (S.certs[m] ? ' ok' : '') }, `${m}: ${certName(m)}`))),
      h('p', { class: 'dim' }, 'Chứng chỉ tính theo từng phương pháp, giống thực tế (SNT-TC-1A, ISO 9712): có Bậc II UT không có nghĩa là được ký kết quả RT.'),
      (() => { const AC = root.ACADEMY || [], n = AC.filter(c => Game.mastered && Game.mastered(c.id)).length;
        return h('div', { class: 'card contract', onclick: () => Game.academy(), style: 'border-color:#2d5c48' }, h('div', { class: 'row' }, h('span', { class: 'meth', style: 'color:var(--ok)' }, 'HV'),
          h('div', null, h('h3', { style: 'margin:0' }, 'Học viện NDE'), h('div', { class: 'dim', style: 'font-size:.88rem' }, `8 chương vật lý nền tảng · 9 chương phương pháp (VT, UT, MT, ET, vi ba, RT, PT, AE, nhiệt ảnh) · đã thành thạo ${n}/${AC.length}`)),
          h('span', { class: 'spacer' }), h('span', { class: 'btn sm' }, 'Vào học'))); })(),
      allDone ? h('div', { class: 'callout ok' }, 'Bạn đã hoàn thành cả 4 hợp đồng của bản chơi thử. Chơi lại để lấy 3 sao: vị trí khuyết tật thay đổi mỗi lần.') : null,
      h('div', { class: 'grid g2' }, L.map(l => {
        const ok = unlocked(l), d = S.done[l.id];
        return h('div', { class: 'card contract' + (ok ? '' : ' locked'), onclick: () => ok ? startMission(l.id) : toast('Hoàn thành hợp đồng trước để mở khóa') },
          h('div', { class: 'row' }, h('span', { class: 'meth' }, l.method), h('div', null, h('h3', { style: 'margin:0' }, l.title), h('div', { class: 'dim', style: 'font-size:.88rem' }, l.client)),
            h('span', { class: 'spacer' }), d ? stars(d.stars) : h('span', { class: 'chip' + (ok ? ' hi' : '') }, ok ? 'Mới' : 'Khóa')),
          h('p', { class: 'dim', style: 'margin-top:8px' }, l.part),
          root.PREREQ && root.PREREQ[l.id] ? h('div', { class: 'row', style: 'font-size:.82rem;margin-bottom:6px' }, h('span', { class: 'dim' }, 'Nên học:'), root.PREREQ[l.id].map(cid => { const c = root.ACADEMY.find(x => x.id === cid); const m = Game.mastered && Game.mastered(cid); return h('span', { class: 'chip' + (m ? ' ok' : ''), title: 'Học viện NDE' }, (m ? '✓ ' : '') + c.title); })) : null,
          h('div', { class: 'row', style: 'font-size:.85rem' }, h('span', { class: 'chip' }, `Hợp đồng ${l.budget} tr₫`), h('span', { class: 'chip' }, `Cho phép dừng máy ${l.downtime} phút`), d ? h('span', { class: 'chip' }, `Điểm cao nhất ${d.score}`) : null));
      })),
      h('div', { class: 'card flat' }, h('h3', null, 'Lộ trình bản đầy đủ (theo GDD)'),
        h('p', { class: 'dim' }, 'Bản chơi thử gồm 4 hợp đồng PT → MT → UT → RT và Học viện 17 chương. Hợp đồng hiện trường cho ET, AE, nhiệt ảnh và vi ba sẽ dùng chung khung dữ liệu (thêm vào levels.js); hiện các phương pháp này đã có bài học và mô phỏng trong Học viện.'))));
  }

  /* ---------- vòng lặp nhiệm vụ ---------- */
  function startMission(id) {
    const lvl = root.LEVELS.find(l => l.id === id); S.runs++; save();
    const rng = mulberry32((Date.now() ^ (S.runs * 7919)) >>> 0);
    const jit = arr => arr && arr.filter(o => !(o.optional && rng() < o.optional)).map(o => { const c = JSON.parse(JSON.stringify(o)); const j = (rng() * 2 - 1) * (o.jitter || 0); if ('x' in c) c.x = Math.round((c.x + j) * 10) / 10; if ('x1' in c) { c.x1 = Math.round(c.x1 + j); c.x2 = Math.round(c.x2 + j); } return c; });
    Game.M = { lvl, rng, clock: 0, safety: 3, spent: 0, events: [], violations: [], methodTries: 0,
      lab: 0, proc: 0, det: 0, falseCalls: 0, missed: 0, verdictOK: false, preds: [], newAtlas: [], notes: [],
      inds: jit(lvl.indications), refl: jit(lvl.reflectors) };
    brief();
  }

  function brief() {
    const M = Game.M, l = M.lvl; hud();
    let left = 25; const tEl = h('span', { class: 'timer' }, '25 s'), bar = h('i', { style: 'width:100%' });
    clearInterval(M.tick);
    M.tick = setInterval(() => {
      left--; tEl.textContent = `${left} s`; bar.style.width = (left / 25 * 100) + '%';
      if (left <= 0) { addTime(15, 'khách gọi điện hối thúc, bạn mất thời gian giải thích'); toast(`${l.contact}: “Bao giờ mới xong hả em?” (+15 phút)`, 'hi'); left = 25; }
    }, 1000);
    const opts = h('div', null);
    const pick = (o, btn) => {
      M.methodTries++; spend(o.cost * 0.3, `chuẩn bị ${o.id}`); addTime(Math.round(o.time * 0.2), `huy động ${o.id}`);
      if (!o.ok) {
        btn.classList.add('picked-bad'); btn.disabled = true; S.rep = Math.max(0, S.rep - 3); save();
        opts.prepend(h('div', { class: 'callout bad' }, h('b', null, 'Sai phương pháp. '), o.why, ' (−3 uy tín, mất chi phí huy động)'));
        return;
      }
      clearInterval(M.tick); btn.classList.add('picked-ok'); M.methodOK = M.methodTries === 1; spend(o.cost * 0.7, `vật tư ${o.id}`); addTime(Math.round(o.time * 0.3), 'bố trí hiện trường');
      M.chosen = o; setTimeout(lab, 500);
    };
    const shuffled = l.methods.slice().sort(() => M.rng() - 0.5);
    shuffled.forEach(o => { const b = h('button', { class: 'opt' }, h('b', null, o.label), o.lure ? h('span', { class: 'lure' }, `· ${o.lure}`) : null, h('small', null, `Chi phí ~${o.cost} tr₫ · ~${o.time} phút`)); b.onclick = () => pick(o, b); opts.append(b); });
    page(h('div', null, stepper(0),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'chip hi' }, `Hợp đồng ${l.method}`), h('span', { class: 'dim' }, l.client)),
          h('h2', { style: 'margin-top:8px' }, l.title), h('p', { class: 'brief' }, l.briefing),
          h('dl', { class: 'kv' }, h('dt', null, 'Đối tượng'), h('dd', null, l.part), h('dt', null, 'Vật liệu'), h('dd', null, l.material),
            l.temp != null ? [h('dt', null, 'Nhiệt độ bề mặt'), h('dd', null, `${l.temp} °C`)] : null,
            h('dt', null, 'Tiêu chí'), h('dd', null, root.CRITERIA[l.criteria].name))),
        h('div', { class: 'card' }, h('div', { class: 'row' }, h('h3', { style: 'margin:0' }, 'Chọn phương pháp'), h('span', { class: 'spacer' }), h('span', { class: 'dim' }, 'Khách đang chờ:'), tEl),
          h('div', { class: 'bar', style: 'margin:6px 0' }, bar),
          h('p', { class: 'dim', style: 'font-size:.88rem' }, 'Gợi ý màu cam là lời khách hoặc đồng nghiệp nói. Hấp dẫn, nhưng chưa chắc đúng.'), opts))));
  }

  function lab() {
    const M = Game.M, id = M.lvl.lab; hud();
    const have = Object.keys(CARDS).filter(k => CARDS[k].lab === id).every(k => S.cards[k]);
    const wrap = h('div', null, stepper(1));
    const done = (score) => {
      M.lab = score; Object.keys(CARDS).filter(k => CARDS[k].lab === id).forEach(k => { if (!S.cards[k]) { S.cards[k] = 1; toast(`Mở khóa thẻ công thức: ${CARDS[k].t}`, 'ok'); } }); save();
      const go = METHODS[M.lvl.method].prep; go(cont(2), M, () => METHODS[M.lvl.method].inspect(cont(3), M, () => METHODS[M.lvl.method].report(cont(4), M, finish)));
    };
    if (have) wrap.append(h('div', { class: 'callout cy' }, 'Bạn đã có thẻ công thức của phòng thí nghiệm này. Có thể làm lại để lấy điểm dự đoán, hoặc bỏ qua (nhận 70 % điểm phòng thí nghiệm).',
      h('div', { class: 'row', style: 'margin-top:6px' }, h('button', { class: 'btn ghost sm', onclick: () => done(0.7) }, 'Bỏ qua'))));
    const body = h('div'); wrap.append(body); page(wrap);
    root.LABS[id](body, done);
  }
  function cont(step) { const w = h('div', null, stepper(step)); const b = h('div'); w.append(b); page(w); hud(); return b; }

  /* ---------- tổng kết ---------- */
  // r: { proc 0..1, det 0..1, falseCalls, missed, playerAccept, trueAccept, why[], atlas[] }
  function finish(r) {
    const M = Game.M, l = M.lvl; clearInterval(M.tick);
    const verdictOK = r.playerAccept === r.trueAccept;
    const parts = [
      ['Chọn phương pháp đúng ngay lần đầu', M.methodOK ? 10 : 0, 10],
      ['Phòng thí nghiệm (dự đoán)', Math.round(M.lab * 10), 10],
      ['Quy trình / hiệu chuẩn', Math.round(r.proc * 25), 25],
      ['Phát hiện & phân loại', Math.max(0, Math.round(r.det * 35 - r.falseCalls * 6)), 35],
      ['Kết luận Đạt / Loại bỏ', verdictOK ? 20 : 0, 20]
    ];
    let score = parts.reduce((s, p) => s + p[1], 0);
    const over = Math.max(0, M.clock - l.downtime); const penalty = Math.round(over * 0.1 * 10) / 10;
    if (M.safety < 3) score -= (3 - M.safety) * 5; score = Math.max(0, Math.min(100, score));
    const starsN = !verdictOK ? 0 : score >= 85 ? 3 : score >= 65 ? 2 : 1;
    S.money += l.budget * (verdictOK ? 1 : 0.4) - penalty;
    S.rep = Math.max(0, Math.min(100, S.rep + (verdictOK ? starsN * 5 : -10)));
    const prev = S.done[l.id]; if (!prev || score > prev.score || starsN > prev.stars) S.done[l.id] = { stars: Math.max(starsN, prev ? prev.stars : 0), score: Math.max(score, prev ? prev.score : 0) };
    const cOld = S.certs[l.method] || 0; const cNew = starsN >= 3 ? 2 : starsN >= 1 ? 1 : 0; if (cNew > cOld) S.certs[l.method] = cNew;
    const newA = [...new Set(r.atlas || [])].filter(k => !S.atlas[k]); newA.forEach(k => S.atlas[k] = 1);
    save();
    const after = verdictOK ? (r.trueAccept ? l.after.correctAccept : l.after.correctReject) : (r.playerAccept ? l.after.wrongAccept : l.after.wrongReject);
    const w = h('div', null, stepper(5),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('div', { class: 'row' }, h('div', { class: 'big' }, score), h('div', null, stars(starsN), h('div', { class: 'dim' }, verdictOK ? 'Kết luận đúng' : 'Kết luận SAI'))),
          h('table', { class: 't' }, parts.map(p => h('tr', null, h('td', null, p[0]), h('td', { class: 'mono' }, `${p[1]}/${p[2]}`))),
            r.falseCalls ? h('tr', null, h('td', { class: 'bad' }, `Báo động giả × ${r.falseCalls}`), h('td', { class: 'mono bad' }, `−${r.falseCalls * 6}`)) : null,
            M.safety < 3 ? h('tr', null, h('td', { class: 'bad' }, `Vi phạm an toàn × ${3 - M.safety}`), h('td', { class: 'mono bad' }, `−${(3 - M.safety) * 5}`)) : null),
          h('p', { class: 'dim', style: 'margin-top:8px' }, `Thời gian dừng máy: ${fmt0(M.clock)}/${l.downtime} phút` + (penalty ? ` → phạt chậm ${fmt(penalty, 1)} tr₫` : '') + `. Chứng chỉ ${l.method}: ${certName(l.method)}.`),
          newA.length ? h('div', { class: 'callout ok' }, 'Atlas mới: ', newA.map(k => root.ATLAS[k].name).join(', ')) : null),
        h('div', null,
          h('div', { class: 'card' }, h('h3', null, 'Đáp án của hệ thống'), h('p', null, r.trueAccept ? h('b', { class: 'ok' }, 'ĐẠT') : h('b', { class: 'bad' }, 'LOẠI BỎ / SỬA CHỮA'), ' theo ', root.CRITERIA[l.criteria].name),
            r.why && r.why.length ? h('ul', null, r.why.map(x => h('li', null, x))) : h('p', { class: 'dim' }, 'Không có chỉ thị vượt tiêu chí.'),
            r.notes && r.notes.length ? h('div', { class: 'callout' }, h('b', null, 'Nhận xét của Bậc III: '), h('ul', { style: 'margin:4px 0' }, r.notes.map(n => h('li', null, n)))) : null),
          h('div', { class: 'after' }, after))),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: hub }, 'Về trung tâm'), h('button', { class: 'btn ghost', onclick: () => startMission(l.id) }, 'Chơi lại (khuyết tật đổi vị trí)')));
    page(w); Game.M = null; hud();
  }

  const METHODS = {};
  const Game = { M: null, S: () => S, boot, h, $, fmt, fmt0, parseNum, slider, fitCanvas, modal, toast, hud, addTime, spend, safetyHit, METHODS, CARDS, cardView, page, hub, finish };
  async function boot() {
    load();
    try { await Promise.all(['400 16px "Be Vietnam Pro"', '700 16px "Be Vietnam Pro"', '400 16px "Roboto Mono"', 'italic 400 16px "Noto Serif"'].map(f => document.fonts.load(f, 'Tiếng Việt ễ ậ ỗ'))); } catch (e) { /* vẫn chạy */ }
    title();
  }
  root.Game = Game;
})(this);
