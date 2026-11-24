/* m_ut.js — Siêu âm mối hàn bằng đầu dò góc 60°. Căn cứ: ASME V Điều 4 (mẫu chuẩn cơ sở có lỗ khoan cạnh, DAC), ASME VIII Phụ lục 12.
 * Mô hình tín hiệu (đơn giản hóa có chủ đích):
 *  - biên độ (%FSH) = 80·10^((G − G0 + dacDb(SP) + R)/20) · hệ số chùm ngang · hệ số chùm dọc
 *  - dacDb(SP) = −0.2·(SP − 12.5) dB: suy giảm + tản chùm gộp; lỗ khoan cạnh có R = 0 theo định nghĩa
 *  - vị trí hiển thị = (t − Z)·V/2, với t = 2·SP/vS + trễ nêm: người chơi phải hiệu chuẩn V và Z
 */
(function (root) {
  'use strict';
  const { h, fmt, toast, addTime, METHODS, parseNum, fitCanvas, slider, numMsg } = root.Game; const P = root.Physics;
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const dacDb = sp => -0.2 * (sp - 12.5);

  function ctx0(M) {
    const l = M.lvl, th = l.probe.angle, T = l.T, vS = P.MAT.steel.vS;
    const U = M.ut || (M.ut = { V: 3000, Z: 0, G: 30, ref: null, dac: [], boost: 0, recs: [], cursor: null, preds: 0 });
    const tof = sp => 2 * sp / vS * 1000 + l.probe.delayUs;            // µs
    const disp = sp => (tof(sp) - U.Z) * U.V / 2000;                      // mm hiển thị
    const amp = (sp, R, G) => 80 * Math.pow(10, (G - l.probe.trueGain + dacDb(sp) + R) / 20);
    const tan = Math.tan(th * P.D2R), cos = Math.cos(th * P.D2R), sin = Math.sin(th * P.D2R);
    const sig = sp => 2.5 + 0.04 * sp;
    const dacRec = sp => { // dB so với mức chuẩn, nội suy tuyến tính trên các điểm đã ghi
      const d = U.dac.slice().sort((a, b) => a.sp - b.sp); if (d.length < 2) return dacDb(sp);
      if (sp <= d[0].sp) return d[0].db; if (sp >= d[d.length - 1].sp) return d[d.length - 1].db;
      for (let i = 0; i < d.length - 1; i++) if (sp <= d[i + 1].sp) { const f = (sp - d[i].sp) / (d[i + 1].sp - d[i].sp); return d[i].db + f * (d[i + 1].db - d[i].db); }
    };
    return { l, th, T, U, tof, disp, amp, tan, cos, sin, sig, dacRec };
  }

  function drawAscan(cv, C, echoes, opts) {
    const { ctx, W, H } = fitCanvas(cv, opts.h || 200); const R = opts.range, U = C.U;
    ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H);
    const X = mm => 30 + (W - 40) * mm / R, Y = a => H - 22 - (H - 34) * Math.min(1.1, a / 100);
    ctx.strokeStyle = '#123821'; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(X(R * i / 10), 8); ctx.lineTo(X(R * i / 10), H - 22); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, Y(i * 10)); ctx.lineTo(W - 10, Y(i * 10)); ctx.stroke(); }
    ctx.fillStyle = '#3ddc97'; ctx.font = '10px "Roboto Mono"'; for (let i = 0; i <= 10; i += 2) ctx.fillText(fmt(R * i / 10, 0), X(R * i / 10) - 6, H - 8);
    ctx.fillText('%FSH', 2, 14); [20, 50, 80].forEach(a => ctx.fillText(a, 4, Y(a) + 3));
    if (opts.marks) { ctx.strokeStyle = '#ffc531'; ctx.setLineDash([3, 3]); opts.marks.forEach(m => { ctx.beginPath(); ctx.moveTo(X(m), 8); ctx.lineTo(X(m), H - 22); ctx.stroke(); }); ctx.setLineDash([]); }
    if (opts.dac && U.ref != null && U.dac.length >= 2) {
      [[1, '#ff5d5d', [], 'DAC'], [0.5, '#ffc531', [6, 4], '50 %'], [0.2, '#43c6f0', [2, 4], '20 %']].forEach(([f, col, dash, name], li) => {
        ctx.strokeStyle = col; ctx.lineWidth = li ? 1.1 : 1.5; ctx.setLineDash(dash); ctx.beginPath(); let first = true, lx = 0, ly = 0;
        for (let s = 0; s <= R * 1.2; s += 1) { const a = f * 80 * Math.pow(10, (U.G - U.ref + C.dacRec(s)) / 20); const x = X(C.disp(s)); if (x < 30 || x > W - 10) continue; first ? ctx.moveTo(x, Y(a)) : ctx.lineTo(x, Y(a)); first = false; lx = x; ly = Y(a); }
        ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; if (!first) ctx.fillText(name, Math.min(lx, W - 40) - 30, Math.max(12, ly - 4));
      });
    }
    // vết sóng
    const N = Math.round(W - 40); const ys = new Float32Array(N);
    for (let k = 0; k < N; k++) { const mm = R * k / N; ys[k] = 2 + Math.random() * 3 * Math.pow(10, (U.G - 40) / 40); const ip = 1 - C.disp(0); if (mm < 3 + Math.max(0, C.disp(0))) ys[k] = 100; }
    for (const e of echoes) { const c = C.disp(e.sp); const w = 0.9; for (let k = Math.max(0, Math.floor((c - 3) / R * N)); k < Math.min(N, (c + 3) / R * N); k++) { const mm = R * k / N; ys[k] += e.a * Math.exp(-((mm - c) ** 2) / (2 * w * w)) * (0.55 + 0.45 * Math.cos((mm - c) * 6)); } }
    ctx.strokeStyle = '#7dff9b'; ctx.lineWidth = 1.3; ctx.beginPath();
    for (let k = 0; k < N; k++) { const x = 30 + k, y = Y(Math.abs(ys[k])); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    if (opts.cursor != null) { ctx.strokeStyle = '#43c6f0'; ctx.beginPath(); ctx.moveTo(X(opts.cursor), 8); ctx.lineTo(X(opts.cursor), H - 22); ctx.stroke(); }
    return { X, R, W };
  }

  /* ---------- HIỆU CHUẨN ---------- */
  METHODS.UT = {
    prep(el, M, next) {
      const C = ctx0(M), U = C.U, T = C.T; const holes = [T / 4, T / 2, 3 * T / 4]; const hx = [90, 130, 170];
      let u = 20; const scores = { pred: 0, vz: 0, gain: 0, dac: 0 }; let vzTries = 0;
      const head = h('div', { class: 'card' }, h('h2', null, 'Hiệu chuẩn trên mẫu chuẩn cơ sở'), h('p', { class: 'dim' }, `Mẫu thép dày T = ${T} mm, lỗ khoan cạnh ở T/4, T/2, 3T/4 (ASME V Điều 4). Đầu dò 60°. Máy đang để vận tốc 3000 m/s và điểm 0 = 0 µs: vị trí trên màn hình đang SAI.`));
      const stage = h('div'); el.append(head, stage);
      // A. dự đoán
      const predBox = h('div', { class: 'card' }, h('h3', null, 'A. Dự đoán đường truyền âm (SP) tới từng lỗ, chân sóng thứ nhất'), h('div', { class: 'formula' }, 'SP = độ sâu / cosθ'));
      const ins = holes.map(d => h('input', { class: 'f', inputmode: 'decimal', placeholder: 'mm' }));
      predBox.append(h('div', { class: 'grid g3' }, holes.map((d, i) => h('div', null, h('label', { class: 'f' }, `Lỗ ở độ sâu ${fmt(d, 2)} mm`), ins[i]))),
        h('div', { class: 'dim', style: 'font-size:.82rem;margin-top:4px' }, 'Quy tắc nhập số: ' + root.Game.NUM_RULE),
        h('button', { class: 'btn', style: 'margin-top:8px', onclick: () => {
          if (ins.some(i => isNaN(parseNum(i.value)))) return toast(numMsg(ins.map(i => i.value).join('')), 'bad');
          const ok = holes.map((d, i) => Math.abs(parseNum(ins[i].value) - d / C.cos) <= 0.5);
          scores.pred = ok.filter(Boolean).length / 3; U.preds = scores.pred;
          predBox.append(h('div', { class: 'callout ' + (scores.pred === 1 ? 'ok' : 'bad') }, `Đúng ${ok.filter(Boolean).length}/3. Đáp án: ${holes.map(d => fmt(d / C.cos, 1)).join(' · ')} mm (cos60° = 0.5 → SP = 2 × độ sâu). Các vạch vàng trên màn hình là vị trí bạn cần đưa tiếng vọng về.`));
          stepB();
        } }, 'Chốt dự đoán'));
      stage.append(predBox);

      function stepB() {
        const cv = h('canvas', { class: 'screen' }), blk = h('canvas');
        const ech = () => { const out = []; holes.forEach((d, i) => [1, 2].forEach(leg => { const de = leg === 1 ? d : 2 * T - d; const sp = de / C.cos; const off = (hx[i] - u) - de * C.tan; const f = Math.exp(-off * off / (2 * C.sig(sp) ** 2)); out.push({ sp, a: C.amp(sp, leg === 1 ? 0 : 0, U.G) * f, f, leg, d, i }); })); return out; };
        const read = h('div', { class: 'mono' });
        const draw = () => {
          const e = ech(); drawAscan(cv, C, e, { range: 100, marks: holes.map(d => d / C.cos).concat(holes.map(d => (2 * T - d) / C.cos)).filter(x => x <= 100), dac: true });
          const { ctx, W, H } = fitCanvas(blk, 120); ctx.fillStyle = '#3a434b'; const sx = W / 200; ctx.fillRect(0, 20, W, T * 3); ctx.fillStyle = '#0b1014';
          holes.forEach((d, i) => { ctx.beginPath(); ctx.arc(hx[i] * sx, 20 + d * 3, 4, 0, 7); ctx.fill(); });
          ctx.fillStyle = '#ffc531'; ctx.fillRect(u * sx - 10, 6, 20, 14); ctx.strokeStyle = 'rgba(255,197,49,.5)'; ctx.beginPath(); ctx.moveTo(u * sx, 20); ctx.lineTo((u + T * C.tan) * sx, 20 + T * 3); ctx.lineTo((u + 2 * T * C.tan) * sx, 20); ctx.stroke();
          ctx.fillStyle = '#e8eef2'; ctx.font = '11px "Be Vietnam Pro"'; ctx.fillText('Mẫu chuẩn cơ sở (nhìn cạnh, phóng đại theo chiều dày)', 4, 112);
          const top = e.slice().sort((a, b) => b.a - a.a)[0];
          read.textContent = `Đầu dò tại u = ${fmt(u, 0)} mm · gain ${fmt(U.G, 0)} dB · tiếng vọng cao nhất: ${fmt(top.a, 0)} %FSH ở ${fmt(C.disp(top.sp), 1)} mm hiển thị`;
        };
        const card = h('div', { class: 'card' }, h('h3', null, 'B. Chỉnh vận tốc (V) và điểm 0 (Z) để tiếng vọng rơi đúng vạch vàng'),
          h('p', { class: 'dim' }, 'Di đầu dò để thấy tiếng vọng lỗ T/4 và 3T/4. V co giãn cả thang; Z dịch cả thang. Đúng vật lý: V = vận tốc sóng ngang trong thép, Z = thời gian trễ trong nêm.'),
          blk, slider('Vị trí đầu dò u', 0, 160, 0.2, u, 'mm', v => { u = v; draw(); }), cv,
          slider('Vận tốc V', 2800, 3600, 5, U.V, 'm/s', v => { U.V = v; draw(); }), slider('Điểm 0 Z', 0, 10, 0.05, U.Z, 'µs', v => { U.Z = v; draw(); }),
          slider('Gain', 10, 70, 0.5, U.G, 'dB', v => { U.G = v; draw(); }), read);
        const ctl = h('div'); card.append(ctl); stage.append(card); setTimeout(draw);
        ctl.append(h('button', { class: 'btn', onclick: () => {
          vzTries++; addTime(2, 'kiểm tra thang đo'); const e1 = Math.abs(C.disp(holes[0] / C.cos) - holes[0] / C.cos), e3 = Math.abs(C.disp(holes[2] / C.cos) - holes[2] / C.cos);
          if (e1 <= 0.5 && e3 <= 0.5) { scores.vz = vzTries <= 2 ? 1 : 0.6; toast('Thang đo chuẩn: T/4 và 3T/4 đều lệch ≤ 0.5 mm', 'ok'); ctl.innerHTML = ''; stepC(ctl, draw); }
          else toast(`Còn lệch: T/4 ${fmt(e1, 1)} mm, 3T/4 ${fmt(e3, 1)} mm (cần ≤ 0.5)`, 'bad');
        } }, 'Kiểm tra thang đo'));
        function stepC(ctl, draw) {
          ctl.append(h('div', { class: 'callout cy' }, h('b', null, 'C. Mức chuẩn: '), 'đưa đầu dò lên đỉnh tiếng vọng lỗ T/4, chỉnh Gain để đỉnh đạt 80 % FSH, rồi chốt.'),
            h('button', { class: 'btn', onclick: () => {
              const e = ech().filter(x => x.i === 0 && x.leg === 1)[0];
              if (e.f < 0.89) return toast('Chưa ở đỉnh lỗ T/4: di đầu dò tới khi tiếng vọng lỗ T/4 cao nhất');
              const a = C.amp(e.sp, 0, U.G);
              if (a < 75 || a > 85) return toast(`Đỉnh đang ${fmt(a, 0)} % FSH, cần 80 ± 5 %`, 'bad');
              U.ref = U.G; scores.gain = 1; toast(`Mức chuẩn = ${fmt(U.G, 1)} dB`, 'ok'); ctl.innerHTML = ''; stepD(ctl, draw);
            } }, 'Chốt mức chuẩn'));
        }
        function stepD(ctl, draw) {
          const info = h('div', { class: 'mono' }); const upd = () => { info.textContent = `Điểm DAC đã ghi: ${U.dac.length}/6 · ` + U.dac.map(d => `${fmt(d.sp, 1)} mm: ${fmt(d.db, 1)} dB`).join(' | '); draw(); };
          ctl.append(h('div', { class: 'callout cy' }, h('b', null, 'D. Dựng DAC: '), 'ghi đỉnh của cả 3 lỗ ở chân sóng 1 và chân sóng 2 (6 điểm). Đường DAC đỏ sẽ hiện trên màn hình. Không chỉnh gain giữa chừng.'), info,
            h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => {
              const e = ech().filter(x => x.f >= 0.89).sort((a, b) => b.a - a.a)[0];
              if (!e) return toast('Chưa ở đỉnh của lỗ nào (cần trong khoảng 1 dB của đỉnh)');
              if (U.G !== U.ref) return toast('Đưa gain về đúng mức chuẩn trước khi ghi DAC', 'bad');
              if (U.dac.some(d => Math.abs(d.sp - e.sp) < 1)) return toast('Điểm này đã ghi rồi');
              U.dac.push({ sp: e.sp, db: P.dB(C.amp(e.sp, 0, U.G), 80) }); addTime(1, 'ghi điểm DAC'); upd();
            } }, 'Ghi điểm DAC'), h('button', { class: 'btn', onclick: () => {
              if (U.dac.length < 4) return toast('Cần ít nhất 4 điểm, nên đủ 6');
              scores.dac = U.dac.length / 6; M.proc = 0.25 * scores.pred + 0.25 * scores.vz + 0.2 * scores.gain + 0.3 * scores.dac;
              if (Math.max(...U.dac.map(d => d.sp)) < 80) toast('DAC chưa phủ hết vùng chân sóng 2: tín hiệu xa sẽ đánh giá theo ngoại suy', 'hi');
              next();
            } }, 'Hoàn tất hiệu chuẩn → ra mối hàn')));
          upd();
        }
      }
    },

    /* ---------- QUÉT ---------- */
    inspect(el, M, next) {
      const C = ctx0(M), U = C.U, l = C.l, T = C.T; U.G = U.ref; let xp = 20, yp = 40; const PH = () => window.innerWidth < 820 ? 180 : 210;
      const half = l.rootGap / 2 + T * Math.tan(l.bevel * P.D2R);
      const fusionY = d => l.rootGap / 2 + (T - d) * Math.tan(l.bevel * P.D2R);
      const refl = M.refl.map(r => Object.assign({}, r, { yf: r.side === 'near' ? fusionY(r.depth) : 0 }));
      M.refl = refl;
      function echoes() {
        const out = [];
        const add = (yf, d, R1, R2, fx) => [1, 2].forEach(leg => { const R = leg === 1 ? R1 : R2; if (R == null) return; const de = leg === 1 ? d : 2 * T - d; const sp = de / C.cos; const off = (yp - yf) - de * C.tan; const fy = Math.exp(-off * off / (2 * C.sig(sp) ** 2)); if (fy < 0.01) return; out.push({ sp, a: C.amp(sp, R, U.G) * fy * fx, fy, fx }); });
        for (const r of refl) { const sx = 2; const fx = 0.5 * (erf((r.x2 - xp) / (Math.SQRT2 * sx)) - erf((r.x1 - xp) / (Math.SQRT2 * sx)));
          if (r.type === 'lof') add(r.yf, r.depth, r.rel - 14, r.rel, fx); else add(r.yf, r.depth, r.rel, r.rel - 2, fx); }
        add(l.rootGap / 2, T, 2, null, 1); // gờ chân mối hàn: liên tục dọc mối hàn
        return out;
      }
      const plan = h('canvas'), scr = h('canvas', { class: 'screen' }); const read = h('div', { class: 'mono' }); const cur = h('div', { class: 'mono hi' });
      let last = null;
      function draw() {
        const E = echoes(); const mob = window.innerWidth < 820; last = drawAscan(scr, C, E, { range: 125, dac: true, cursor: U.cursor, h: mob ? 170 : 210 });
        const { ctx, W, H } = fitCanvas(plan, PH()); const sx = (W - 20) / 200, sy = (H - 30) / 120, X = x => 10 + x * sx, Y = y => 10 + (y + 15) * sy;
        ctx.fillStyle = '#3a434b'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#566069'; ctx.fillRect(X(0), Y(-half), 200 * sx, (2 * half) * sy);
        ctx.strokeStyle = '#8a949c'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(200), Y(0)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#e8eef2'; ctx.font = '11px "Be Vietnam Pro"'; ctx.fillText('tâm mối hàn', X(2), Y(0) - 3); ctx.fillText('mũ mối hàn', X(170), Y(half) - 4);
        ctx.font = '10px "Roboto Mono"'; for (let x = 0; x <= 200; x += 20) { ctx.fillText(x, X(x) - 6, H - 4); } for (let y = 20; y <= 100; y += 20) ctx.fillText('y' + y, 0, Y(y) + 3);
        ctx.fillStyle = '#ffc531'; ctx.fillRect(X(xp) - 9, Y(yp), 18, 22); ctx.fillStyle = '#1a1300'; ctx.fillText('▲', X(xp) - 4, Y(yp) + 9);
        ctx.strokeStyle = 'rgba(255,197,49,.35)'; ctx.beginPath(); ctx.moveTo(X(xp), Y(yp)); ctx.lineTo(X(xp), Y(Math.max(-15, yp - 2 * T * C.tan))); ctx.stroke();
        read.textContent = `Đầu dò: x = ${fmt(xp, 1)} mm (dọc mối hàn) · y = ${fmt(yp, 1)} mm (điểm ra chùm tới tâm mối hàn) · gain ${fmt(U.G, 1)} dB (${U.G > U.ref ? '+' + fmt(U.G - U.ref, 0) + ' dB quét' : 'mức chuẩn'})`;
        if (U.cursor != null) {
          const pk = E.filter(e => Math.abs(C.disp(e.sp) - U.cursor) < 2.5).sort((a, b) => b.a - a.a)[0];
          if (pk) { const dac = 80 * Math.pow(10, (U.G - U.ref + C.dacRec(pk.sp)) / 20); const sp = C.disp(pk.sp); U.reading = { sp, a: pk.a, pct: pk.a / dac * 100 };
            cur.textContent = `Cổng đo: SP = ${fmt(sp, 1)} mm · biên độ ${fmt(Math.min(pk.a, 110), 0)} % FSH · ${fmt(pk.a / dac * 100, 0)} % DAC (${fmt(P.dB(pk.a, dac), 1)} dB)`; }
          else { U.reading = null; cur.textContent = `Cổng đo ở ${fmt(U.cursor, 1)} mm: không có đỉnh`; }
        } else cur.textContent = 'Chạm vào màn hình A-scan để đặt cổng đo lên một đỉnh.';
      }
      const toPlan = e => { const r = plan.getBoundingClientRect(); const W = plan.clientWidth, H = PH(); const sx = (W - 20) / 200, sy = (H - 30) / 120; return [(e.clientX - r.left - 10) / sx, (e.clientY - r.top - 10) / sy - 15]; };
      let dragging = false, raf = 0; const mv = e => { const [x, y] = toPlan(e); xp = Math.max(0, Math.min(200, x)); yp = Math.max(half + 6, Math.min(105, y)); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
      plan.addEventListener('pointerdown', e => { dragging = true; plan.setPointerCapture(e.pointerId); mv(e); }); plan.addEventListener('pointermove', e => dragging && mv(e)); plan.addEventListener('pointerup', () => { dragging = false; addTime(0.5, 'quét'); });
      scr.addEventListener('pointerdown', e => { const r = scr.getBoundingClientRect(); U.cursor = Math.max(0, (e.clientX - r.left - 30) / (scr.clientWidth - 40) * 125); draw(); });
      const nudge = (dx, dy) => { xp = Math.max(0, Math.min(200, xp + dx)); yp = Math.max(half + 6, Math.min(105, yp + dy)); draw(); };
      const pad = h('div', { class: 'row' }, h('span', { class: 'dim' }, 'Nhích đầu dò:'), [['x −1', -1, 0], ['x +1', 1, 0], ['y −1', 0, -1], ['y +1', 0, 1]].map(([t, a, b]) => h('button', { class: 'btn sm ghost', onclick: () => nudge(a, b) }, t)),
        h('span', { class: 'spacer' }), h('button', { class: 'btn sm ghost', onclick: () => { U.G = U.ref; draw(); } }, 'Gain mức chuẩn'), h('button', { class: 'btn sm', onclick: () => { U.G = U.ref + 6; U.boosted = true; draw(); } }, 'Quét +6 dB'));
      // phiếu ghi chỉ thị
      const fx1 = h('input', { class: 'f', inputmode: 'decimal' }), fx2 = h('input', { class: 'f', inputmode: 'decimal' }), fd = h('input', { class: 'f', inputmode: 'decimal' }), fy = h('input', { class: 'f', inputmode: 'decimal' });
      const ftype = h('select', { class: 'f' }, [['', '— chọn —'], ['lof', 'Không ngấu thành vát'], ['slag', 'Ngậm xỉ'], ['crack', 'Nứt'], ['pore', 'Rỗ khí'], ['geom', 'Tín hiệu hình học (không liên quan)']].map(([v, t]) => h('option', { value: v }, t)));
      const recList = h('div');
      const renderRecs = () => { recList.innerHTML = ''; if (!U.recs.length) return; recList.append(h('table', { class: 't' }, h('tr', null, ['#', 'x đầu–cuối', 'SP', 'Độ sâu', 'Cách tâm', '%DAC', 'Loại', ''].map(t => h('th', null, t))),
        U.recs.map((r, i) => h('tr', null, h('td', null, 'U' + (i + 1)), h('td', { class: 'mono' }, `${fmt(r.x1, 0)}–${fmt(r.x2, 0)}`), h('td', { class: 'mono' }, fmt(r.sp, 1)), h('td', { class: 'mono' }, fmt(r.d, 1)), h('td', { class: 'mono' }, fmt(r.y, 1)), h('td', { class: 'mono' }, fmt(r.pct, 0)), h('td', null, ftype.querySelector(`option[value="${r.type}"]`).textContent),
          h('td', null, h('button', { class: 'btn sm ghost', onclick: () => { U.recs.splice(i, 1); renderRecs(); } }, 'Xóa')))))); };
      const save = () => {
        if (!U.reading) return toast('Đặt cổng đo lên đỉnh tín hiệu trước');
        const v = [fx1, fx2, fd, fy].map(i => parseNum(i.value)); if (v.some(isNaN)) return toast(numMsg([fx1, fx2, fd, fy].map(i => i.value).join('')), 'bad'); if (!ftype.value) return toast('Chọn loại chỉ thị');
        if (U.G !== U.ref) return toast('Đánh giá biên độ ở mức chuẩn: bấm “Gain mức chuẩn” rồi đọc lại đỉnh', 'bad');
        U.recs.push({ x1: Math.min(v[0], v[1]), x2: Math.max(v[0], v[1]), d: v[2], y: v[3], sp: U.reading.sp, pct: U.reading.pct, type: ftype.value }); addTime(3, 'ghi phiếu chỉ thị');
        [fx1, fx2, fd, fy].forEach(i => i.value = ''); ftype.value = ''; renderRecs(); toast('Đã ghi chỉ thị', 'ok');
      };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Quét mối hàn'),
        h('p', { class: 'dim' }, 'Kéo đầu dò trên mặt bằng (vàng). Quét ở +6 dB để tìm, rồi về mức chuẩn để đánh giá. Máy KHÔNG tự tính lượng giác: bạn tự tính độ sâu và vị trí từ SP đọc được. Đo chiều dài bằng phương pháp giảm 6 dB: dịch dọc x tới khi đỉnh còn một nửa, ghi lại x ở hai đầu.'),
        h('div', { class: 'ut-grid' }, h('div', null, plan, pad, read), h('div', { class: 'ascan' }, scr, cur))),
        h('div', { class: 'grid g2' },
          h('div', { class: 'card' }, h('h3', null, 'Phiếu ghi chỉ thị'), h('div', { class: 'grid g2' },
            h('div', null, h('label', { class: 'f' }, 'x đầu (giảm 6 dB), mm'), fx1), h('div', null, h('label', { class: 'f' }, 'x cuối (giảm 6 dB), mm'), fx2),
            h('div', null, h('label', { class: 'f' }, 'Độ sâu (bạn tính), mm'), fd), h('div', null, h('label', { class: 'f' }, 'Cách tâm mối hàn (bạn tính), mm'), fy)),
            h('label', { class: 'f' }, 'Phân loại'), ftype, h('div', { class: 'row', style: 'margin-top:8px' }, h('button', { class: 'btn', onclick: save }, 'Ghi chỉ thị (đọc tại cổng đo)')), recList),
          h('div', { class: 'card' }, h('h3', null, 'Bản vẽ mối hàn & công thức'),
            h('dl', { class: 'kv' }, h('dt', null, 'Chiều dày T'), h('dd', null, `${T} mm`), h('dt', null, 'Vát chữ V'), h('dd', null, `${l.bevel}° mỗi bên, khe chân ${l.rootGap} mm`), h('dt', null, 'Góc đầu dò'), h('dd', null, `${C.th}° (sin = 0.866; cos = 0.5)`), h('dt', null, 'Bước nhảy'), h('dd', null, `${fmt(P.skipDistance(T, C.th), 1)} mm`)),
            h('div', { class: 'formula' }, 'Chân 1 (SP ≤ 50): độ sâu = SP·cos60°'), h('div', { class: 'formula' }, 'Chân 2 (50 < SP ≤ 100): độ sâu = 2T − SP·cos60°'),
            h('div', { class: 'formula' }, 'Cách tâm mối hàn = y − SP·sin60°'), h('div', { class: 'formula' }, `Mặt vát phía đầu dò ở độ sâu d: cách tâm = ${l.rootGap / 2} + (${T} − d)·tan${l.bevel}°`),
            h('p', { class: 'dim', style: 'font-size:.88rem' }, 'Gợi ý của Bậc III: một tín hiệu ở đúng độ sâu T, ngay sát tâm, kéo dài suốt mối hàn thường là gờ chân. Khuyết tật nằm đúng trên mặt vát gợi ý không ngấu thành vát.'))),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { if (!U.boosted) { M.proc *= 0.85; toast('Bạn chưa quét ở mức +6 dB như quy trình', 'bad'); } next(); } }, 'Xong, lập biên bản')));
      setTimeout(draw); window.addEventListener('resize', draw);
    },

    report(el, M, finish) {
      const C = ctx0(M), U = C.U, T = C.T, l = C.l; const crit = root.CRITERIA[l.criteria];
      const verdict = acc => {
        let det = 0, falseCalls = 0; const notes = [], atlas = []; const used = new Set();
        for (const r of M.refl) {
          const rec = U.recs.find(q => !used.has(q) && q.x2 >= r.x1 - 4 && q.x1 <= r.x2 + 4 && Math.abs(q.d - r.depth) <= 3);
          if (!rec) { notes.push(`Bỏ sót ${root.TYPE[r.type]} ở x ${r.x1}–${r.x2} mm, sâu ${r.depth} mm.`); continue; } used.add(rec);
          let s = 0.4; const tl = r.x2 - r.x1, ml = rec.x2 - rec.x1;
          if (Math.abs(rec.d - r.depth) <= 1.5) s += 0.15; else notes.push(`Độ sâu ${fmt(rec.d, 1)} mm, thực tế ${r.depth} mm.`);
          if (Math.abs(rec.y - r.yf) <= 2.5) s += 0.15; else notes.push(`Vị trí ngang ${fmt(rec.y, 1)} mm, thực tế ${fmt(r.yf, 1)} mm so với tâm.`);
          if (Math.abs(ml - tl) <= 4) s += 0.15; else notes.push(`Chiều dài ${fmt(ml, 0)} mm, thực tế ${tl} mm (giảm 6 dB).`);
          if (rec.type === r.type) { s += 0.15; atlas.push(r.atlas); } else notes.push(`Phân loại “${root.TYPE[rec.type]}”, thực tế là ${root.TYPE[r.type]}.`);
          det += s;
        }
        for (const q of U.recs) if (!used.has(q)) {
          if (Math.abs(q.d - T) <= 2 && Math.abs(q.y) <= 5) { if (q.type === 'geom') atlas.push('geom'); else { falseCalls++; notes.push('Bạn báo gờ chân mối hàn là khuyết tật (báo động giả). Độ sâu = T và nằm ở tâm → tín hiệu hình học.'); } }
          else { falseCalls++; notes.push(`Chỉ thị ở x ${fmt(q.x1, 0)}–${fmt(q.x2, 0)}, sâu ${fmt(q.d, 1)} mm không khớp khuyết tật nào.`); }
        }
        const ev = crit.evaluate(M.refl.map(r => ({ label: `x ${r.x1}–${r.x2}`, type: r.type, len: r.x2 - r.x1, overDAC: r.rel > 0 })), T);
        finish({ proc: M.proc, det: det / M.refl.length, falseCalls, playerAccept: acc, trueAccept: ev.accept, why: ev.why, atlas, notes });
      };
      const mine = crit.evaluate(U.recs.filter(r => r.type !== 'geom' && r.pct > 20).map((r, i) => ({ label: 'U' + (i + 1), type: r.type, len: r.x2 - r.x1, overDAC: r.pct > 100 })), T);
      el.append(h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'Biên bản UT của bạn'),
          U.recs.length ? h('table', { class: 't' }, h('tr', null, ['#', 'x', 'Sâu', 'Cách tâm', '%DAC', 'Loại'].map(t => h('th', null, t))),
            U.recs.map((r, i) => h('tr', null, h('td', null, 'U' + (i + 1)), h('td', { class: 'mono' }, `${fmt(r.x1, 0)}–${fmt(r.x2, 0)}`), h('td', { class: 'mono' }, fmt(r.d, 1)), h('td', { class: 'mono' }, fmt(r.y, 1)), h('td', { class: 'mono' }, fmt(r.pct, 0)), h('td', null, root.TYPE[r.type])))) : h('p', { class: 'dim' }, 'Chưa ghi chỉ thị nào.'),
          h('div', { class: 'callout ' + (mine.accept ? 'ok' : 'bad') }, h('b', null, `Áp tiêu chí lên số liệu của bạn (t = ${T} mm → giới hạn ${fmt(mine.limit, 1)} mm): `), mine.accept ? 'không có gì vượt.' : h('ul', { style: 'margin:4px 0' }, mine.why.map(w => h('li', null, w))))),
        h('div', { class: 'card' }, h('h3', null, crit.name), h('ul', null, crit.rules.map(r => h('li', null, r))),
          h('div', { class: 'row' }, h('button', { class: 'btn', style: 'background:var(--ok)', onclick: () => verdict(true) }, 'ĐẠT (ACCEPT)'), h('button', { class: 'btn danger', onclick: () => verdict(false) }, 'LOẠI BỎ / SỬA CHỮA')))));
    }
  };
})(this);
