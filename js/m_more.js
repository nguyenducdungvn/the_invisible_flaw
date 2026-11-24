/* m_more.js — 5 hợp đồng hiện trường bổ sung: VT, ET, AE, nhiệt ảnh (IR), vi ba (MW); phòng thí nghiệm của chúng; lời gợi ý nghề nghiệp sau mỗi hợp đồng.
 * Dữ liệu màn trong levels_more.js. Dùng chung Decide (m_pt.js), Surface (surface.js), SIMS (academy_sims.js), challenges (labs.js).
 */
(function (root) {
  'use strict';
  const G = root.Game, { h, fmt, fitCanvas, toast, addTime, METHODS } = G, P = root.Physics;
  const Decide = (...a) => root.Decide(...a);
  const font = (px, w = 400) => `${w} ${px}px "Be Vietnam Pro"`;
  const gauss = rng => { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v); };

  /* Các chỉ thị cùng `group` phải cùng có mặt hoặc cùng vắng */
  function groupFix(M) {
    const gs = {}; for (const i of M.lvl.indications) if (i.group) (gs[i.group] = gs[i.group] || []).push(i.id);
    for (const [g, ids] of Object.entries(gs)) if (!ids.every(id => M.inds.some(x => x.id === id))) M.inds = M.inds.filter(x => x.group !== g);
  }

  /* ---------------- Phòng thí nghiệm ---------------- */
  const labHead = (title, sub, f) => h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'chip hi' }, 'Phòng thí nghiệm 60 giây'), h('h2', { style: 'margin:0' }, title)), h('p', { class: 'dim' }, sub), f ? h('div', { class: 'formula' }, f) : null);
  const mkLab = (title, sub, f, sim, list) => (el, done, opt) => { el.append(labHead(title, sub, f)); const s = h('div'); el.append(s); if (root.SIMS && root.SIMS[sim]) root.SIMS[sim](s); el.append(root.challenges(list(), done, opt && opt.btn)); };
  const sig30 = 0.30 * P.IACS;
  Object.assign(root.LABS, {
    visual: mkLab('Ánh sáng, bóng đổ và góc nhìn', 'Rãnh cháy cạnh nông gần như biến mất dưới ánh sáng chiếu thẳng, nhưng đổ bóng dài khi chiếu xiên. Độ rọi giảm theo bình phương khoảng cách.', 'bóng ≈ độ sâu / tan(góc chiếu so với mặt) · E₂ = E₁·(d₁/d₂)²', 'vt', () => [
      { q: 'Rãnh cháy cạnh sâu 1.0 mm. Đèn pin chiếu xiên, tia sáng nghiêng 15° so với mặt tấm. Bóng đổ dài khoảng bao nhiêu mm?', num: 1 / Math.tan(15 * Math.PI / 180), rel: 0.05, unit: 'mm', e: '1 / tan15° ≈ 3.7 mm: dài gấp gần 4 lần độ sâu nên rất dễ thấy.' },
      { q: 'Đèn cho 4000 lux tại bề mặt khi cách 0.5 m. Dời ra 1.0 m thì còn bao nhiêu lux (coi như nguồn điểm)?', num: P.inverseSquare(4000, 0.5, 1), rel: 0.03, unit: 'lux', e: '4000 × (0.5/1)² = 1000 lux: vừa đúng mức tối thiểu của ASME V T-952.' }]),
    eddy: mkLab('Tần số và độ sâu thấm', 'Dòng xoáy tập trung sát bề mặt. Tần số càng cao, lớp dòng càng mỏng: nhạy với nứt bề mặt nhỏ, kém với khuyết tật sâu.', 'δ = 1/√(π·f·μ₀·μr·σ) · 100 % IACS = 5.8·10⁷ S/m', 'etplane', () => [
      { q: 'Nhôm 2024-T3 (≈ 30 % IACS, μr = 1). Độ sâu thấm chuẩn δ ở 200 kHz là bao nhiêu mm?', num: P.skinDepth(2e5, sig30, 1) * 1000, rel: 0.04, unit: 'mm', e: `δ ≈ ${fmt(P.skinDepth(2e5, sig30, 1) * 1000, 2)} mm: dòng xoáy tập trung trong vài phần mười milimét ngoài cùng.` },
      { q: 'Muốn δ = 0.2 mm trên cùng vật liệu thì cần tần số khoảng bao nhiêu kHz?', num: 1 / (Math.PI * 4e-7 * Math.PI * sig30 * 4e-8) / 1000, rel: 0.05, unit: 'kHz', e: 'f = 1/(π·μ₀·σ·δ²) ≈ 364 kHz.' }]),
    aeloc: mkLab('Định vị nguồn phát xạ âm', 'Sóng từ một nguồn tới hai cảm biến lệch nhau Δt. Biết vận tốc sóng thì tính được vị trí; vận tốc sai thì mọi vị trí đều lệch.', 'x = (D + v·Δt)/2, Δt = t₁ − t₂, x tính từ cảm biến 1', 'aeloc', () => [
      { q: 'Bẻ ruột chì tại x = 1.0 m, giữa hai cảm biến cách nhau D = 4.0 m. Sóng tới cảm biến 1 sớm hơn cảm biến 2 là 0.656 ms (Δt = −0.656 ms). Vận tốc sóng là bao nhiêu m/s?', num: 2 / 0.656e-3, rel: 0.03, unit: 'm/s', e: 'v = (2x − D)/Δt = (2 − 4)/(−0.000656) ≈ 3050 m/s: sóng bản mỏng trong thành bồn, chậm hơn sóng dọc khối 5920 m/s.' },
      { q: 'Cùng cặp cảm biến, v = 3050 m/s, một tín hiệu có Δt = +0.40 ms. Nguồn cách cảm biến 1 bao nhiêu m?', num: P.aeLocate(4, 3050, 0.4e-3), rel: 0.03, unit: 'm', e: 'x = (4 + 3050 × 0.0004)/2 ≈ 2.61 m.' }]),
    thermal: mkLab('Thời điểm hiện hình và độ sâu', 'Sau chớp sáng, nhiệt khuếch tán vào trong; chỗ tách lớp chặn dòng nhiệt nên bề mặt phía trên nóng hơn. Khuyết tật càng sâu càng hiện muộn.', 't ≈ z²/α · z ≈ √(α·t)', 'thermo', () => [
      { q: 'CFRP có α = 4·10⁻⁷ m²/s. Tách lớp ở độ sâu 1.0 mm hiện rõ nhất khoảng sau bao nhiêu giây?', num: P.thermalTime(1e-3, 4e-7), rel: 0.03, unit: 's', e: '(10⁻³)² / 4·10⁻⁷ = 2.5 s.' },
      { q: 'Một vết đạt tương phản cực đại ở t = 9 s. Độ sâu ước tính là bao nhiêu mm?', num: P.thermalDepth(9, 4e-7) * 1000, rel: 0.03, unit: 'mm', e: '√(4·10⁻⁷ × 9) ≈ 1.9 mm.' }]),
    microwave: mkLab('Bước sóng và phản xạ trong điện môi', 'Trong vật liệu có hằng số điện môi ε, bước sóng ngắn lại √ε lần. Độ phân giải cỡ nửa bước sóng; chỗ ε thay đổi gây phản xạ.', 'λ = c/(f·√ε) · Γ = (1 − √ε)/(1 + √ε)', 'microwave', () => [
      { q: 'Bước sóng của vi ba 24 GHz trong HDPE (ε = 2.3) là bao nhiêu mm?', num: 300 / 24 / Math.sqrt(2.3), rel: 0.03, unit: 'mm', e: '12.5 mm / √2.3 ≈ 8.2 mm, nên phân giải cỡ 4 mm.' },
      { q: 'Độ lớn hệ số phản xạ |Γ| khi sóng từ không khí tới vuông góc mặt HDPE (ε = 2.3)?', num: Math.abs(P.mwGamma(2.3)), rel: 0.03, unit: '', e: '|1 − 1.517| / 2.517 ≈ 0.21. Lỗ rỗng (không khí trong nhựa) phản xạ với độ lớn tương tự nhưng ngược pha.' }])
  });

  /* ---------------- Báo cáo chung cho hợp đồng tự đánh dấu (ET, AE) ---------------- */
  function judge(el, M, cfg, finish) {
    const C = root.CRITERIA[M.lvl.criteria], marks = cfg.marks;
    const verdict = acc => {
      let det = 0, n = 0, falseCalls = 0; const notes = [], atlas = [], used = new Set();
      const pairs = marks.map(m => { const i = cfg.pair(m, used); if (i) used.add(i); return { m, i }; });
      for (const i of M.inds.filter(i => cfg.truth(i).relevant)) {
        n++; const p = pairs.find(p => p.i === i);
        if (!p || (cfg.isNone && cfg.isNone(p.m))) { notes.push(`Bỏ sót ${cfg.name(i)}.`); continue; }
        const good = p.m.cls === cfg.truth(i).cls; det += good ? 1 : 0.5;
        if (good) atlas.push(i.atlas); else notes.push(`${p.m.label}: là ${cfg.name(i)}, bạn ghi “${cfg.label(p.m.cls)}”.`);
      }
      for (const p of pairs) {
        if (cfg.isNone && cfg.isNone(p.m)) { if (p.i && cfg.truth(p.i).relevant) { /* đã tính bỏ sót ở trên */ } continue; }
        if (!p.i) { falseCalls++; notes.push(`${p.m.label}: không có gì ở đó (báo động giả).`); continue; }
        const t = cfg.truth(p.i); if (t.relevant) continue;
        if (p.m.cls === t.cls) atlas.push(p.i.atlas); else if (cfg.relevantCls.includes(p.m.cls)) { falseCalls++; notes.push(`${p.m.label}: ${cfg.name(p.i)}, không phải khuyết tật (báo động giả).`); }
      }
      const ev = C.evaluate(M.inds.filter(i => cfg.truth(i).relevant).map(i => Object.assign({ label: cfg.where(i) }, cfg.crit(i))));
      finish({ proc: M.proc, det: n ? det / n : 1, falseCalls, playerAccept: acc, trueAccept: ev.accept, why: ev.why, atlas, notes: notes.concat(cfg.extraNotes ? cfg.extraNotes(M) : []) });
    };
    const mine = C.evaluate(marks.filter(m => cfg.relevantCls.includes(m.cls)).map(m => Object.assign({ label: m.label }, cfg.playerCrit(m))));
    el.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h3', null, 'Biên bản của bạn'),
        marks.length ? h('table', { class: 't' }, h('tr', null, h('th', null, 'Vị trí'), h('th', null, 'Phân loại')), marks.map(m => h('tr', null, h('td', null, m.label), h('td', null, cfg.label(m.cls))))) : h('p', { class: 'dim' }, 'Bạn chưa ghi gì.'),
        h('div', { class: 'callout' + (mine.accept ? ' ok' : ' bad') }, h('b', null, 'Nếu áp tiêu chí lên chính biên bản của bạn: '), mine.accept ? 'không có gì vượt tiêu chí.' : h('ul', { style: 'margin:4px 0' }, mine.why.map(w => h('li', null, w))))),
      h('div', { class: 'card' }, h('h3', null, C.name), h('ul', null, C.rules.map(r => h('li', null, r))),
        h('p', { class: 'serif' }, 'Ký biên bản. Chữ ký của bạn quyết định số phận của chi tiết này.'),
        h('div', { class: 'row' }, h('button', { class: 'btn', style: 'background:var(--ok)', onclick: () => verdict(true) }, 'ĐẠT (ACCEPT)'), h('button', { class: 'btn danger', onclick: () => verdict(false) }, 'LOẠI BỎ / SỬA CHỮA')))));
  }

  /* ================= VT ================= */
  METHODS.VT = {
    prep(el, M, next) {
      groupFix(M); const q = M.q = { clean: 1, light: 1, oblique: 0.25, dist: 1, gauge: false, hot: false };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị & quy trình VT'), h('p', { class: 'dim' }, 'VT là phương pháp rẻ nhất nhưng cũng dễ làm ẩu nhất. Điều kiện nhìn quyết định bạn thấy gì: ánh sáng, góc chiếu, khoảng cách, độ sạch và dụng cụ đo.')));
      Decide(el, [
        { t: 'Làm sạch mối hàn', d: 'Mối hàn còn xỉ và hạt bắn tóe. Thợ phụ cầm búa gõ xỉ đứng bên cạnh.', o: [
          { l: 'Đeo kính bảo hộ, gõ xỉ, chải bàn chải sắt dọc mối hàn và hai bên mép', ok: true, time: 8 },
          { l: 'Gõ xỉ luôn, không cần kính, vài phút thôi', lure: 'Kính bị mờ mồ hôi', time: 6, safety: 'Gõ xỉ không đeo kính: mảnh xỉ nóng bắn vào mắt' },
          { l: 'Kiểm tra luôn, xỉ để thợ sơn cạo sau', lure: 'Nhanh nhất', time: 0, fx: () => { q.clean = 0.45; }, why: 'Xỉ còn bám che đúng chỗ hay có cháy cạnh và rỗ ở chân mối hàn.' }] },
        { t: 'Thời điểm kiểm tra', d: `${M.lvl.contact}: “Vừa hàn xong đấy em, xem luôn đi cho kịp sơn.”`, o: [
          { l: 'Chờ mối hàn nguội về nhiệt độ môi trường rồi mới kiểm tra', ok: true, time: 15 },
          { l: 'Kiểm tra ngay khi mối hàn còn nóng', lure: 'Kịp tiến độ sơn', time: 0, fx: () => { q.hot = true; q.light *= 0.85; }, why: 'AWS D1.1 Bảng 8.1: kiểm tra bằng mắt khi mối hàn đã nguội về nhiệt độ môi trường. Nứt nguội có thể chưa kịp xuất hiện, và kim loại nóng phát sáng làm khó nhìn.' }] },
        { t: 'Chiếu sáng', d: 'Ánh sáng xưởng khoảng 300 lux; trên xe có đèn LED cầm tay và máy đo lux.', o: [
          { l: 'Dùng đèn cầm tay, đo ≥ 1000 lux tại bề mặt (ASME V T-952)', ok: true, time: 2 },
          { l: 'Ánh sáng xưởng là đủ, mắt quen rồi', lure: 'Không phải cầm đèn', time: 0, fx: () => { q.light = 0.55; } }] },
        { t: 'Hướng chiếu sáng', o: [
          { l: 'Thêm một đèn chiếu xiên thấp dọc theo chân mối hàn để rãnh và gợn đổ bóng', ok: true, time: 2, fx: () => { q.oblique = 1; } },
          { l: 'Chiếu thẳng từ trên xuống cho sáng đều', lure: 'Sáng nhất, không có bóng', time: 0, why: 'Ánh sáng vuông góc làm mất bóng đổ: cháy cạnh nông gần như biến mất.' }] },
        { t: 'Khoảng cách và góc nhìn', d: 'Mối hàn ở sát sàn, phải ngồi xổm mới nhìn gần được.', o: [
          { l: 'Ngồi xuống, mắt cách bề mặt ≤ 600 mm, góc nhìn ≥ 30° so với mặt (ASME V T-952)', ok: true, time: 3 },
          { l: 'Đứng nhìn từ trên xuống, cách khoảng 1.6 m', lure: 'Đỡ mỏi lưng', time: 0, fx: () => { q.dist = 0.55; }, why: 'Quá xa và góc nhìn quá dẹt: các chi tiết nhỏ không còn phân biệt được.' }] },
        { t: 'Dụng cụ', o: [
          { l: 'Thước đo mối hàn đa năng (đo chân, độ lồi, độ sâu cháy cạnh), kính lúp ×5, gương soi', ok: true, time: 1, fx: () => { q.gauge = true; } },
          { l: 'Ước lượng bằng mắt, kinh nghiệm 10 năm rồi', lure: 'Nhẹ người', time: 0, why: 'Không đo thì không áp được tiêu chí 1 mm và 2 mm của cháy cạnh.' }] }
      ], s => { M.proc = s; next(); });
    },
    inspect(el, M, next) {
      const q = M.q, inds = M.inds;
      const vis = i => i.kind === 'spatter' ? 1 : i.kind === 'undercut' ? q.oblique * q.light * q.clean * q.dist : i.kind === 'crack' ? q.light * q.clean * q.dist * (i.faint || 1) * (q.gauge ? 1.2 : 1) : q.light * q.clean * q.dist;
      const surf = root.Surface.view(el, {
        length: 300, band: 24, height: 230,
        head: h('div', null, h('h2', null, 'Soi mối hàn'), h('p', { class: 'dim' }, 'Kéo thước dọc theo chỉ thị để đo chiều dài (rỗ: đo đường kính), rồi phân loại. “Đo bằng thước” (+2 phút) cho độ sâu cháy cạnh và xác nhận bằng kính lúp.')),
        rulerColor: 'rgba(230,230,230,.8)',
        drawBg(ctx, toPx, g, W, H) {
          const L = q.light * (q.hot ? 0.9 : 1); ctx.fillStyle = `rgb(${Math.round(70 + 50 * L)},${Math.round(74 + 50 * L)},${Math.round(80 + 50 * L)})`; ctx.fillRect(0, 0, W, H);
          const [, a] = toPx(0, -4), [, b] = toPx(0, 4); const gr = ctx.createLinearGradient(0, a, 0, b);
          gr.addColorStop(0, `rgba(60,60,66,${0.6 + 0.3 * q.oblique})`); gr.addColorStop(0.5, `rgba(${150 + 60 * L},${150 + 60 * L},${155 + 60 * L},1)`); gr.addColorStop(1, `rgba(55,55,60,${0.5 + 0.3 * q.oblique})`);
          ctx.fillStyle = gr; ctx.fillRect(0, a, W, b - a); ctx.strokeStyle = `rgba(40,40,45,${0.25 + 0.4 * q.oblique})`; ctx.lineWidth = 1;
          for (let x = Math.floor(g.x0 / 2.5) * 2.5; x < g.x0 + g.span; x += 2.5) { const [px] = toPx(x, 0); ctx.beginPath(); ctx.moveTo(px - 6, a + 2); ctx.quadraticCurveTo(px + 4, (a + b) / 2, px - 6, b - 2); ctx.stroke(); }
          if (q.clean < 1) { ctx.fillStyle = 'rgba(40,30,20,.55)'; for (let x = 4; x < 300; x += 17) { const [px, py] = toPx(x, -3.2 + (x % 7)); ctx.fillRect(px, py, 30, 6); } }
        },
        drawInds(ctx, toPx) {
          for (const i of inds) {
            const a = vis(i); if (a < 0.15) continue; const [px, py] = toPx(i.x, i.y); const [x1] = toPx(i.x - i.len / 2, 0), [x2] = toPx(i.x + i.len / 2, 0);
            if (i.kind === 'crack') { ctx.strokeStyle = `rgba(15,15,18,${Math.min(0.95, a)})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x1, py); ctx.lineTo((x1 + x2) / 2, py + 2); ctx.lineTo(x2, py - 1); ctx.stroke(); }
            else if (i.kind === 'undercut') { ctx.fillStyle = `rgba(10,10,12,${Math.min(0.85, a * 0.8)})`; ctx.fillRect(x1, py - 2, x2 - x1, 3.5 + i.depth * 1.5 * q.oblique); }
            else if (i.kind === 'pore') { const r = Math.max(2, (x2 - x1) / 2); ctx.fillStyle = `rgba(12,12,14,${Math.min(0.95, a)})`; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); ctx.strokeStyle = `rgba(220,220,220,${a * 0.5})`; ctx.beginPath(); ctx.arc(px - 0.6, py - 0.6, r, 3.6, 5.4); ctx.stroke(); }
            else { ctx.fillStyle = 'rgba(205,205,210,.95)'; ctx.beginPath(); ctx.arc(px, py, Math.max(2.5, (x2 - x1) / 2), 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(40,40,40,.5)'; ctx.beginPath(); ctx.arc(px + 1, py + 1, 1.2, 0, 7); ctx.fill(); }
          }
        },
        classes: [['crack', 'Nứt'], ['undercut', 'Cháy cạnh'], ['pore', 'Rỗ'], ['nonrel', 'Bắn tóe / không liên quan']],
        verify: { label: 'Đo bằng thước', fn: (m, rr) => {
          addTime(2, 'đo bằng thước và kính lúp'); if (!q.gauge) { toast('Bạn không mang thước đo mối hàn: chỉ ước lượng được bằng mắt', 'bad'); return; }
          const p = root.Surface.match([m], inds)[0], i = p.i;
          if (!i) toast(`${m.label}: không có gì ở đây`);
          else if (i.kind === 'undercut') { m.depth = Math.round(i.depth * 10) / 10; toast(`${m.label}: cháy cạnh sâu ${fmt(m.depth, 1)} mm`, 'hi'); }
          else if (i.kind === 'pore') toast(`${m.label}: rỗ ống Ø ≈ ${fmt(i.len, 1)} mm`, 'hi');
          else if (i.kind === 'crack') toast(`${m.label}: kính lúp ×5 cho thấy đường mảnh, đầu nhọn, nằm ở miệng hàn → nứt`, 'hi');
          else toast(`${m.label}: hạt kim loại bắn tóe, cạo là bong`, 'ok'); rr();
        } }
      });
      M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(10, 'soi và ghi chỉ thị'); next(); } }, 'Xong, lập biên bản')));
    },
    report(el, M, finish) {
      const tr = { crack: 'crack', undercut: 'undercut', pore: 'pore', spatter: 'nonrel' };
      root.Surface.report(el, M, {
        truth: i => ({ cls: tr[i.kind], relevant: i.kind !== 'spatter' }),
        crit: i => ({ type: i.kind, len: i.len, x: i.x, depth: i.depth }),
        name: i => ({ crack: 'nứt miệng hàn', undercut: `cháy cạnh sâu ${fmt(i.depth || 0, 1)} mm`, pore: 'rỗ', spatter: 'bắn tóe' })[i.kind],
        label: c => ({ crack: 'Nứt', undercut: 'Cháy cạnh', pore: 'Rỗ', nonrel: 'Không liên quan' })[c] || '—',
        playerRelevant: m => m.cls !== 'nonrel', playerType: c => c,
        extraNotes: M => [].concat(M.q.oblique < 1 ? ['Không chiếu xiên: cháy cạnh nông rất khó thấy dưới ánh sáng vuông góc.'] : [], !M.q.gauge ? ['Không có thước đo thì không áp được giới hạn 1 mm / 2 mm của cháy cạnh.'] : [], M.q.hot ? ['Kiểm tra khi mối hàn còn nóng: AWS D1.1 yêu cầu chờ nguội về nhiệt độ môi trường.'] : [])
      }, finish);
    }
  };

  /* ================= ET ================= */
  const ET_HOLES = 8, holeX = k => 15 + 30 * k;
  METHODS.ET = {
    prep(el, M, next) {
      const q = M.q = { cal: 1, f: 200e3, rot: 0, gain: 1, noise: 1, template: true };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị & hiệu chuẩn ET'), h('p', { class: 'dim' }, 'Máy dòng xoáy chỉ cho biết “có gì đó khác với mẫu chuẩn”. Hiệu chuẩn đúng thì nứt, sơn dày và đổi độ dẫn điện đi theo các hướng khác nhau trên mặt phẳng trở kháng.')));
      Decide(el, [
        { t: 'Mẫu chuẩn', o: [
          { l: 'Mẫu nhôm cùng hợp kim, cùng độ dẫn, có rãnh EDM sâu 0.2 – 0.5 – 1.0 mm', ok: true, time: 3 },
          { l: 'Mẫu thép có rãnh EDM đang có sẵn trên xe', lure: 'Có sẵn, đỡ phải mượn', time: 1, fx: () => { q.cal = 0.45; }, why: 'Thép nhiễm từ, độ dẫn khác hẳn: đáp ứng của rãnh trên thép không dùng để chuẩn cho nhôm được.' }] },
        { t: 'Tần số', slider: { label: 'Tần số', min: 1, max: 1000, step: 1, val: 10, unit: 'kHz', hint: 'δ = 1/√(π·f·μ₀·σ); 2024-T3 ≈ 30 % IACS. Nứt bề mặt nhỏ cần lớp dòng mỏng (δ cỡ vài phần mười milimét). Tần số quá cao thì nhạy với sơn, nhám và nhiễu.',
          apply: v => { q.f = v * 1000; const d = P.skinDepth(q.f, sig30, 1) * 1000; if (v > 500) q.noise = 1 + (v - 500) / 150; return { ok: v >= 100 && v <= 500, time: 2, why: v < 100 ? `δ ≈ ${fmt(d, 2)} mm: lớp dòng quá dày, nứt nông chỉ chiếm phần nhỏ, tín hiệu yếu.` : v > 500 ? `δ ≈ ${fmt(d, 2)} mm nhưng nhiễu sơn và nhám tăng mạnh.` : `δ ≈ ${fmt(d, 2)} mm: phù hợp cho nứt bề mặt.` }; } } },
        { t: 'Cân bằng và xoay pha', o: [
          { l: 'Cân bằng (null) trên vùng lành của mẫu, nhấc đầu dò lên xuống, xoay pha cho tín hiệu nhấc đầu dò nằm ngang sang trái', ok: true, time: 3 },
          { l: 'Giữ góc pha mặc định của máy', lure: 'Máy đã cài sẵn từ hãng', time: 0, fx: () => { q.rot = 40; }, why: 'Nhấc đầu dò không nằm ngang thì sơn dày và nứt lẫn vào nhau, khó tách bằng mắt.' }] },
        { t: 'Độ khuếch đại', o: [
          { l: 'Chỉnh để rãnh 0.5 mm cao 50 % màn hình', ok: true, time: 2 },
          { l: 'Tăng gain tối đa cho nhạy', lure: 'Không bỏ sót gì', time: 0, fx: () => { q.gain = 2.4; q.noise *= 1.8; }, why: 'Tín hiệu bão hòa, nhiễu sơn cũng to lên: không còn so được với rãnh chuẩn.' },
          { l: 'Gain thấp cho màn hình sạch', lure: 'Ít báo động giả', time: 0, fx: () => { q.gain = 0.35; } }] },
        { t: 'Bề mặt', d: 'Sơn còn tốt, chỗ dày chỗ mỏng.', o: [
          { l: 'Lau sạch bụi dầu, giữ nguyên sơn; ghi nhận vùng sơn dày bằng máy đo chiều dày lớp phủ', ok: true, time: 4 },
          { l: 'Cạo sơn quanh mũ đinh bằng dao để đầu dò tiếp xúc tốt', lure: 'Tín hiệu rõ hơn', time: 10, why: 'Cạo làm xước nhôm, tạo vết giống nứt, phá lớp phủ chống ăn mòn; hợp đồng yêu cầu không bóc sơn.' }] },
        { t: 'Cách quét quanh lỗ', o: [
          { l: 'Dùng dưỡng tròn giữ đầu dò cách tâm lỗ không đổi, quét chậm trọn 360°', ok: true, time: 2 },
          { l: 'Quét tự do bằng tay quanh mũ đinh', lure: 'Không phải mang dưỡng', time: 0, fx: () => { q.template = false; }, why: 'Khoảng cách tới mép lỗ thay đổi liên tục: hiệu ứng mép tạo tín hiệu lớn che mất nứt nhỏ.' }] }
      ], s => { M.proc = s * (0.6 + 0.4 * q.cal); next(); });
    },
    inspect(el, M, next) {
      const q = M.q, delta = P.skinDepth(q.f, sig30, 1) * 1000, rng = M.rng;
      const marks = M.etMarks = []; const scanned = new Set(); let cur = -1, trace = [];
      const panel = h('canvas'), plane = h('canvas', { class: 'screen' }), strip = h('canvas', { class: 'screen' }), act = h('div'), list = h('div');
      const rot = (x, y) => { const a = q.rot * Math.PI / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
      const sens = d => (1 - Math.exp(-d / (0.5 * delta))) * q.cal;
      const sig = (k, th) => {
        let x = gauss(rng) * 0.035 * q.noise, y = gauss(rng) * 0.035 * q.noise;
        if (!q.template) { const e = 0.6 * Math.sin(th * 3 * Math.PI / 180 + k) + 0.3 * Math.sin(th * 7 * Math.PI / 180); x += -0.7 * e; y += -0.35 * e; }
        for (const i of M.inds.filter(i => i.hole === k)) {
          const dth = Math.abs(((th - i.ang + 540) % 360) - 180);
          if (i.kind === 'crack') { const w = Math.exp(-((dth / 6) ** 2)) * sens(i.depth) / sens(0.5) * Math.pow(i.depth / 0.5, 0.7), a = (70 + 25 * Math.min(1, i.depth / delta)) * Math.PI / 180; x += w * Math.cos(a); y += w * Math.sin(a); }
          else if (i.kind === 'liftoff') { const w = Math.exp(-((dth / 25) ** 2)) * 1.3; x -= w; }
          else if (i.kind === 'cond') { const w = Math.exp(-((dth / 55) ** 2)) * 0.8, a = 158 * Math.PI / 180; x += w * Math.cos(a); y += w * Math.sin(a); }
        }
        return rot(x * q.gain, y * q.gain);
      };
      const drawPanel = () => { const { ctx, W, H } = fitCanvas(panel, 120); ctx.fillStyle = '#8d97a0'; ctx.fillRect(0, 0, W, H); const s = (W - 20) / 240;
        ctx.fillStyle = '#7a848d'; ctx.fillRect(0, H / 2 + 26, W, 4);
        for (let k = 0; k < ET_HOLES; k++) { const x = 10 + holeX(k) * s; ctx.fillStyle = k === cur ? '#ffc531' : '#cfd6dc'; ctx.beginPath(); ctx.arc(x, H / 2, 11, 0, 7); ctx.fill(); ctx.strokeStyle = '#4a545c'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#1b2229'; ctx.font = font(12, 700); ctx.textAlign = 'center'; ctx.fillText(String(k + 1), x, H / 2 + 4);
          const m = marks.find(m => m.hole === k); ctx.font = font(11); ctx.fillStyle = m ? (m.cls === 'crack' ? '#b00000' : '#0b3d5c') : scanned.has(k) ? '#2d3a44' : '#59636b';
          ctx.fillText(m ? ({ none: 'sạch', crack: 'NỨT', liftoff: 'sơn', cond: 'dẫn điện' })[m.cls] : scanned.has(k) ? 'đã quét' : 'chưa quét', x, H / 2 - 18); }
        ctx.textAlign = 'left'; };
      const drawPlane = (pts) => { const { ctx, W, H } = fitCanvas(plane, 240); ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); const cx = W / 2, cy = H / 2, s = H / 4;
        ctx.strokeStyle = '#123821'; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(cx + i * s / 2, 0); ctx.lineTo(cx + i * s / 2, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, cy + i * s / 2); ctx.lineTo(W, cy + i * s / 2); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(255,197,49,.5)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(0, cy - s * 1); ctx.lineTo(W, cy - s * 1); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#9fb0bc'; ctx.font = font(11); ctx.fillText('Mặt phẳng trở kháng · vạch cam: mức rãnh chuẩn 0.5 mm (50 % màn hình)', 8, 14);
        ctx.strokeStyle = '#7dff9b'; ctx.lineWidth = 1.4; ctx.beginPath(); pts.forEach(([x, y], i) => { const X = Math.max(2, Math.min(W - 2, cx + x * s)), Y = Math.max(2, Math.min(H - 2, cy - y * s)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); };
      const drawStrip = (pts) => { const { ctx, W, H } = fitCanvas(strip, 120); ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); const s = H / 4;
        ctx.strokeStyle = '#123821'; for (let a = 0; a <= 360; a += 45) { const x = 10 + (W - 20) * a / 360; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); ctx.fillStyle = '#5c7466'; ctx.font = font(10); ctx.fillText(a + '°', x + 2, H - 3); }
        ctx.strokeStyle = '#43c6f0'; ctx.lineWidth = 1.3; ctx.beginPath(); pts.forEach(([, y], i) => { const X = 10 + (W - 20) * i / 180, Y = Math.max(2, Math.min(H - 2, H / 2 - y * s)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
        ctx.fillStyle = '#9fb0bc'; ctx.font = font(11); ctx.fillText('Thành phần đứng theo góc quét quanh lỗ', 12, 14); };
      const scan = k => { cur = k; scanned.add(k); renderList(); addTime(2, `quét lỗ ${k + 1}`); trace = []; for (let th = 0; th < 360; th += 2) trace.push(sig(k, th)); drawPanel();
        let n = 0; const anim = () => { if (!plane.isConnected) return; n = Math.min(trace.length, n + 6); drawPlane(trace.slice(0, n)); drawStrip(trace.slice(0, n)); if (n < trace.length) requestAnimationFrame(anim); }; anim();
        act.innerHTML = ''; act.append(h('div', { class: 'callout cy' }, h('b', null, `Lỗ ${k + 1}: `), 'phân loại sau khi xem tín hiệu', h('div', { class: 'row', style: 'margin-top:6px' },
          [['none', 'Không có chỉ thị'], ['crack', 'Nứt'], ['liftoff', 'Sơn dày / nhấc đầu dò'], ['cond', 'Thay đổi độ dẫn điện']].map(([c, t]) => h('button', { class: 'btn sm ghost', onclick: () => {
            const i = marks.findIndex(m => m.hole === k); if (i >= 0) marks.splice(i, 1); marks.push({ hole: k, cls: c, label: `Lỗ ${k + 1}` }); marks.sort((a, b) => a.hole - b.hole); drawPanel(); renderList(); toast(`Lỗ ${k + 1}: ${t}`); } }, t))))); };
      const renderList = () => { list.innerHTML = ''; list.append(h('p', { class: 'dim' }, `Đã quét ${scanned.size}/${ET_HOLES} lỗ · đã ghi ${marks.length}/${ET_HOLES}`)); };
      panel.addEventListener('pointerdown', e => { const r = panel.getBoundingClientRect(), s = (r.width - 20) / 240, x = (e.clientX - r.left - 10) / s; const k = Math.round((x - 15) / 30); if (k >= 0 && k < ET_HOLES && Math.abs(x - holeX(k)) < 12) scan(k); });
      el.append(h('div', { class: 'card' }, h('h2', null, 'Quét quanh 8 lỗ đinh tán'), h('p', { class: 'dim' }, `Bấm vào một lỗ để quét quanh lỗ (+2 phút). Tần số ${fmt(q.f / 1000, 0)} kHz, δ ≈ ${fmt(delta, 2)} mm. Nứt: vòng tín hiệu dựng đứng, hẹp theo góc. Sơn dày: chạy ngang sang trái. Độ dẫn điện: trôi xiên, rộng theo góc.`),
        panel, h('div', { class: 'grid g2', style: 'margin-top:8px' }, plane, strip), act, list));
      setTimeout(() => { drawPanel(); drawPlane([]); drawStrip([]); renderList(); });
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(5, 'ghi chép'); next(); } }, 'Xong, lập biên bản')));
    },
    report(el, M, finish) {
      const marks = M.etMarks || [];
      judge(el, M, {
        marks, relevantCls: ['crack'], isNone: m => m.cls === 'none',
        pair: (m, used) => { const i = M.inds.find(i => i.hole === m.hole && !used.has(i)); return i || null; },
        truth: i => ({ cls: i.kind, relevant: i.kind === 'crack' }),
        name: i => ({ crack: `nứt mỏi sâu ≈ ${fmt(i.depth, 1)} mm ở lỗ ${i.hole + 1}`, liftoff: `vùng sơn dày ở lỗ ${i.hole + 1}`, cond: `vùng đổi độ dẫn điện (tấm vá) ở lỗ ${i.hole + 1}` })[i.kind],
        where: i => `Lỗ ${i.hole + 1}`, label: c => ({ none: 'Không có chỉ thị', crack: 'Nứt', liftoff: 'Sơn dày / nhấc đầu dò', cond: 'Thay đổi độ dẫn điện' })[c] || '—',
        crit: i => ({ type: i.kind, depth: i.depth }), playerCrit: m => ({ type: 'crack', depth: 0.5 }),
        extraNotes: M => { const n = []; const un = ET_HOLES - new Set(marks.map(m => m.hole)).size; if (un) n.push(`${un} lỗ chưa có kết luận: quy trình yêu cầu quét và ghi cho 100 % số lỗ.`);
          if (M.q.rot) n.push('Pha chưa xoay: tín hiệu nhấc đầu dò không nằm ngang nên khó tách sơn dày với nứt.'); if (!M.q.template) n.push('Quét không dưỡng: hiệu ứng mép lỗ lấn át tín hiệu nứt nhỏ.'); return n; }
      }, finish);
    }
  };

  /* ================= AE ================= */
  const pressureAt = (t, hold) => hold ? (t < 10 ? t * 5 : t < 14 ? 50 : t < 20 ? 50 + (t - 14) * 5 : t < 24 ? 80 : t < 28 ? 80 + (t - 24) * 5 : 100) : (t < 30 ? t * 100 / 30 : Math.max(0, 100 - (t - 30) * 10));
  const rising = (t, hold) => hold ? (t < 10 || (t >= 14 && t < 20) || (t >= 24 && t < 28)) : t < 30;
  const AE_T = 40;
  METHODS.AE = {
    prep(el, M, next) {
      const q = M.q = { dead: false, v: 5920, thr: 40, hold: true, noiseCtl: true, wrench: false };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị thử thủy lực có giám sát AE'), h('p', { class: 'dim' }, 'AE không tìm khuyết tật nằm yên: nó nghe khuyết tật đang hoạt động khi kết cấu chịu tải. Vì vậy chương trình tăng áp, ngưỡng và tiếng ồn quan trọng như bản thân cảm biến.')));
      Decide(el, [
        { t: 'An toàn khi thử áp', o: [
          { l: 'Thử bằng nước sau khi đã xả hết LPG và làm sạch khí; khoanh vùng, không ai đứng trước mặt bích và nắp', ok: true, time: 10 },
          { l: 'Thử bằng khí nén cho đỡ phải bơm và xả nước', lure: 'Nhanh, sạch sẽ', time: 0, safety: 'Thử áp bằng khí nén: năng lượng tích trữ lớn hơn nước rất nhiều, nổ vỡ cực kỳ nguy hiểm' }] },
        { t: 'Kiểm tra đáp ứng cảm biến', d: 'Đã gắn 4 cảm biến tại 0, 4, 8, 12 m dọc thân bồn, thêm 1 cảm biến bảo vệ gần bơm.', o: [
          { l: 'Bẻ ruột chì 0.5 mm (nguồn Hsu-Nielsen) cạnh từng cảm biến, so biên độ giữa các kênh, gắn lại kênh lệch', ok: true, time: 10 },
          { l: 'Bỏ qua, cảm biến mới hiệu chuẩn tuần trước', lure: 'Tiết kiệm 10 phút', time: 0, fx: () => { q.dead = true; }, why: 'Kênh 3 (8 m) tiếp âm kém: các nguồn giữa 4 và 12 m bị định vị sai lệch nhiều.' }] },
        { t: 'Vận tốc sóng cho phần mềm định vị', slider: { label: 'Vận tốc', min: 2000, max: 6500, step: 10, val: 5920, unit: 'm/s', hint: 'Bẻ ruột chì tại x = 1.0 m giữa S1 (0 m) và S2 (4.0 m): sóng tới S1 sớm hơn S2 0.656 ms. Vị trí x = (D + v·Δt)/2 với Δt = t₁ − t₂. Giá trị mặc định 5920 m/s là sóng dọc trong thép khối.',
          apply: v => { q.v = v; const ok = Math.abs(v - M.lvl.vTrue) <= 150; return { ok, time: 5, why: ok ? 'Đúng: v = (2x − D)/Δt ≈ 3050 m/s.' : `Sai vận tốc: vị trí nguồn sẽ lệch về giữa mỗi cặp cảm biến theo tỉ lệ ${fmt(v / M.lvl.vTrue, 2)}.` }; } } },
        { t: 'Ngưỡng phát hiện', d: 'Nhiễu nền đo được khoảng 30–35 dBAE.', o: [
          { l: 'Ngưỡng cố định 40 dBAE, cao hơn nhiễu nền', ok: true, time: 1 },
          { l: 'Hạ ngưỡng 25 dBAE để không bỏ sót', lure: 'Nhạy nhất', time: 0, fx: () => { q.thr = 25; }, why: 'Thấp hơn nhiễu nền: kênh ngập tín hiệu rác, nguồn thật bị chìm.' },
          { l: 'Nâng ngưỡng 70 dBAE cho dữ liệu sạch', lure: 'Ít nhiễu', time: 0, fx: () => { q.thr = 70; }, why: 'Ngưỡng quá cao: bỏ sót nguồn yếu.' }] },
        { t: 'Chương trình tăng áp', o: [
          { l: 'Tăng áp theo nấc 50 – 80 – 100 %, giữ áp ở mỗi nấc và giữ lâu ở mức cao nhất', ok: true, time: 0 },
          { l: 'Tăng liên tục một mạch tới áp thử, không giữ', lure: 'Nhanh hơn 20 phút', time: 0, fx: () => { q.hold = false; }, why: 'Không có giai đoạn giữ áp thì không phân biệt được nguồn hoạt động với ma sát gối đỡ.' }] },
        { t: 'Tiếng ồn hiện trường', d: `${M.lvl.contact}: “Tổ bảo dưỡng muốn tranh thủ siết lại bulông mặt bích lúc thử.”`, o: [
          { l: 'Bơm đặt xa, nối ống mềm; bật cảm biến bảo vệ; dừng mọi việc gõ, siết trên bồn trong lúc thử', ok: true, time: 5 },
          { l: 'Cứ để tổ bảo dưỡng làm song song', lure: 'Tiết kiệm nửa ca', time: 0, fx: () => { q.wrench = true; q.noiseCtl = false; } }] }
      ], s => { M.proc = s; next(); });
    },
    inspect(el, M, next) {
      const q = M.q, l = M.lvl, rng = M.rng, hits = [];
      if (q.wrench) M.inds.push({ id: 'W', kind: 'noise', x: 6.4, atlas: 'aenoise', wrench: true });
      const locate = x => { const xi = Math.min(8, Math.floor(x / 4) * 4), mid = xi + 2; let xl = mid + (q.v / l.vTrue) * (x - mid); return xl; };
      for (const i of M.inds) i.xl = locate(i.x);
      const add = (i, t, amp, sc) => { if (amp < q.thr) return; let x = i.xl + gauss(rng) * sc; if (q.dead && i.x > 4 && i.x < 12) x += gauss(rng) * 0.9; hits.push({ t, x: Math.max(0, Math.min(l.L, x)), amp, src: i }); };
      for (let t = 0; t < AE_T; t += 0.05) {
        const p = pressureAt(t, q.hold), up = rising(t, q.hold), unload = !q.hold && t >= 30;
        for (const i of M.inds) {
          let rate = 0, a0 = 0, a1 = 0;
          if (i.kind === 'active') { const on = p > (i.weak ? 75 : 60) && !unload; rate = on ? (up ? (i.weak ? 2.5 : 6) : (i.weak ? 1.3 : 3)) : 0; a0 = i.weak ? 44 : 55; a1 = i.weak ? 62 : 82; }
          else if (i.kind === 'friction') { rate = up && p > 20 && !unload ? 3 : 0; a0 = 45; a1 = 66; }
          else if (i.kind === 'noise' && i.wrench) { rate = (Math.sin(t * 1.7) > 0.6) ? 5 : 0; a0 = 58; a1 = 76; }
          else if (i.kind === 'noise') { rate = q.noiseCtl ? 0.6 : 2.5; a0 = 36; a1 = 48; }
          if (rng() < rate * 0.05) add(i, t, a0 + (a1 - a0) * rng(), i.kind === 'noise' && !i.wrench ? 0.35 : 0.12);
        }
        if (q.thr < 30 && rng() < 0.6) hits.push({ t, x: rng() * l.L, amp: 25 + rng() * 12, src: null });
      }
      let now = 0, cursor = 6, playing = false; const marks = M.aeMarks = [];
      const map = h('canvas'), chart = h('canvas', { class: 'screen' }), info = h('div', { class: 'mono' }), act = h('div'), list = h('div');
      const X = (W, x) => 30 + (W - 50) * x / l.L;
      const drawMap = () => { const { ctx, W, H } = fitCanvas(map, 200); ctx.fillStyle = '#0d1820'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#56636e'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X(W, 0) - 12, 14, X(W, l.L) - X(W, 0) + 24, 34, 17) : ctx.rect(X(W, 0) - 12, 14, X(W, l.L) - X(W, 0) + 24, 34); ctx.fill();
        ctx.fillStyle = '#3a4650'; [2, 10].forEach(x => { ctx.fillRect(X(W, x) - 8, 48, 16, 14); });
        ctx.fillStyle = '#43c6f0'; ctx.font = font(11, 700); l.sensors.forEach((x, k) => { ctx.beginPath(); ctx.arc(X(W, x), 31, 5, 0, 7); ctx.fill(); ctx.fillText('S' + (k + 1), X(W, x) - 7, 12); });
        ctx.fillStyle = '#9fb0bc'; ctx.font = font(10); ctx.fillText('gối đỡ', X(W, 2) + 11, 60); ctx.fillText('gối đỡ', X(W, 10) + 11, 60);
        const bins = new Array(Math.round(l.L / 0.2)).fill(0); hits.filter(e => e.t <= now).forEach(e => { bins[Math.min(bins.length - 1, Math.floor(e.x / 0.2))]++; });
        const mx = Math.max(8, ...bins), base = H - 18, top = 86; bins.forEach((b, k) => { const x0 = X(W, k * 0.2), x1 = X(W, (k + 1) * 0.2); ctx.fillStyle = Math.abs(k * 0.2 + 0.1 - cursor) < 0.45 ? '#ffc531' : '#7dff9b'; ctx.fillRect(x0, base - (base - top) * b / mx, x1 - x0 - 1, (base - top) * b / mx); });
        ctx.strokeStyle = '#2b3a44'; ctx.beginPath(); ctx.moveTo(X(W, 0), base); ctx.lineTo(X(W, l.L), base); ctx.stroke(); ctx.fillStyle = '#9fb0bc';
        for (let x = 0; x <= l.L; x += 2) ctx.fillText(x + ' m', X(W, x) - 8, H - 4);
        ctx.strokeStyle = '#ffc531'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(W, cursor), top - 4); ctx.lineTo(X(W, cursor), base); ctx.stroke(); ctx.setLineDash([]);
        marks.forEach(m => { ctx.fillStyle = m.cls === 'active' ? '#ff5d5d' : '#9fb0bc'; ctx.beginPath(); ctx.moveTo(X(W, m.x), top - 2); ctx.lineTo(X(W, m.x) - 5, top - 10); ctx.lineTo(X(W, m.x) + 5, top - 10); ctx.fill(); });
        };
      const drawChart = () => { const { ctx, W, H } = fitCanvas(chart, 200); ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); const tx = t => 34 + (W - 44) * t / AE_T, py = p => H - 20 - (H - 34) * p / 100, ay = a => H - 20 - (H - 34) * (a - 20) / 80;
        ctx.strokeStyle = '#123821'; for (let a = 20; a <= 100; a += 20) { ctx.beginPath(); ctx.moveTo(34, ay(a)); ctx.lineTo(W - 10, ay(a)); ctx.stroke(); }
        ctx.fillStyle = '#5c7466'; ctx.font = font(10); for (let a = 20; a <= 100; a += 20) ctx.fillText(a + ' dB', 2, ay(a) + 3);
        ctx.strokeStyle = 'rgba(67,198,240,.9)'; ctx.lineWidth = 2; ctx.beginPath(); for (let t = 0; t <= Math.min(now, AE_T); t += 0.2) { const y = py(pressureAt(t, q.hold)); t ? ctx.lineTo(tx(t), y) : ctx.moveTo(tx(t), y); } ctx.stroke();
        for (const e of hits) { if (e.t > now) continue; const near = Math.abs(e.x - cursor) < 0.45; ctx.fillStyle = near ? '#ffc531' : 'rgba(125,255,155,.18)'; ctx.fillRect(tx(e.t) - 1.5, ay(e.amp) - 1.5, near ? 3.5 : 2.5, near ? 3.5 : 2.5); }
        if (q.hold) { ctx.fillStyle = 'rgba(255,255,255,.05)'; [[10, 14], [20, 24], [28, 40]].forEach(([a, b]) => ctx.fillRect(tx(a), 10, tx(b) - tx(a), H - 30)); ctx.fillStyle = '#9fb0bc'; ctx.fillText('giữ áp', tx(10) + 2, H - 26); ctx.fillText('giữ áp', tx(20) + 2, H - 26); ctx.fillText('giữ áp ở áp thử', tx(29), H - 26); }
        ctx.fillStyle = '#9fb0bc'; ctx.fillText('xanh lam: áp suất (% áp thử) · chấm vàng: tín hiệu định vị gần con trỏ (± 0.45 m)', 36, H - 4); };
      const redraw = () => { drawMap(); drawChart(); const near = hits.filter(e => e.t <= now && Math.abs(e.x - cursor) < 0.45), inHold = near.filter(e => !rising(e.t, q.hold) && e.t > 10);
        info.textContent = `Con trỏ x = ${fmt(cursor, 1)} m · ${near.length} tín hiệu gần đó · ${inHold.length} tín hiệu trong lúc giữ áp · biên độ lớn nhất ${near.length ? fmt(Math.max(...near.map(e => e.amp)), 0) : '–'} dB`; };
      map.addEventListener('pointerdown', e => { const r = map.getBoundingClientRect(); cursor = Math.max(0, Math.min(l.L, (e.clientX - r.left - 30) / (r.width - 50) * l.L)); redraw(); });
      const play = () => { if (playing || now >= AE_T) return; playing = true; addTime(q.hold ? 100 : 70, 'tăng áp và giữ áp'); const t0 = performance.now(); const step = () => { if (!map.isConnected) return; now = Math.min(AE_T, (performance.now() - t0) / 250); redraw(); if (now < AE_T) requestAnimationFrame(step); else { playing = false; act.style.display = ''; toast('Đã hoàn tất chương trình áp. Bấm lên biểu đồ để đặt con trỏ và ghi nguồn.', 'ok'); } }; step(); };
      const renderList = () => { list.innerHTML = ''; if (!marks.length) return; list.append(h('table', { class: 't' }, h('tr', null, h('th', null, 'Vị trí'), h('th', null, 'Phân loại'), h('th', null, '')),
        marks.map(m => h('tr', null, h('td', { class: 'mono' }, m.label), h('td', null, CLS_AE[m.cls]), h('td', null, h('button', { class: 'btn sm ghost', onclick: () => { marks.splice(marks.indexOf(m), 1); renderList(); redraw(); } }, 'Xóa')))))); };
      act.append(h('div', { class: 'row' }, h('span', { class: 'dim' }, 'Ghi nguồn tại con trỏ:'), Object.entries(CLS_AE).map(([c, t]) => h('button', { class: 'btn sm ghost', onclick: () => { marks.push({ x: cursor, cls: c, label: `x ≈ ${fmt(cursor, 1)} m` }); renderList(); redraw(); } }, t)))); act.style.display = 'none';
      el.append(h('div', { class: 'card' }, h('h2', null, 'Thử áp và nghe bồn'), h('p', { class: 'dim' }, 'Bấm “Bắt đầu tăng áp”. Sau đó bấm lên biểu đồ vị trí để xem tín hiệu ở từng vùng: nguồn hoạt động vẫn phát xạ khi giữ áp; ma sát gối đỡ chỉ xuất hiện khi áp đang tăng; tiếng ồn biên độ thấp và rải rác.'),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: play }, 'Bắt đầu tăng áp')), map, h('p', { class: 'dim', style: 'font-size:.82rem;margin:2px 0 6px' }, 'Trên: sơ đồ bồn, cảm biến S1–S4, gối đỡ; cột xanh là số tín hiệu định vị được theo vị trí (mỗi cột 0.2 m). Dưới: áp suất và biên độ từng tín hiệu theo thời gian.'), chart, info, act, list));
      setTimeout(redraw);
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { if (now < AE_T) return toast('Chưa chạy xong chương trình áp'); addTime(10, 'phân tích dữ liệu'); next(); } }, 'Xong, lập biên bản')));
    },
    report(el, M, finish) {
      const marks = M.aeMarks || [];
      judge(el, M, {
        marks, relevantCls: ['active'],
        pair: (m, used) => { let best = null, bd = 0.7; for (const i of M.inds) { const d = Math.abs(i.xl - m.x); if (d < bd && !used.has(i)) { best = i; bd = d; } } return best; },
        truth: i => ({ cls: i.kind, relevant: i.kind === 'active' }),
        name: i => ({ active: `nguồn hoạt động ở x ≈ ${fmt(i.x, 1)} m`, friction: `ma sát gối đỡ ở x = ${fmt(i.x, 1)} m`, noise: i.wrench ? `tiếng siết bulông ở x ≈ ${fmt(i.x, 1)} m` : 'tiếng ồn bơm ở đầu bồn' })[i.kind],
        where: i => `Vùng x ≈ ${fmt(i.x, 1)} m`, label: c => CLS_AE[c] || '—',
        crit: i => ({ type: i.kind }), playerCrit: m => ({ type: m.cls }),
        extraNotes: M => [].concat(Math.abs(M.q.v - M.lvl.vTrue) > 150 ? [`Vận tốc đặt ${fmt(M.q.v, 0)} m/s, thực tế ≈ ${M.lvl.vTrue} m/s: các vị trí định vị lệch về giữa mỗi cặp cảm biến.`] : [], !M.q.hold ? ['Không giữ áp: mất bằng chứng quan trọng nhất để phân biệt nguồn hoạt động với ma sát.'] : [], M.q.wrench ? ['Siết bulông trong lúc thử tạo tín hiệu biên độ cao ngay cả khi giữ áp, rất dễ nhầm với nguồn hoạt động.'] : [])
      }, finish);
    }
  };
  const CLS_AE = { active: 'Nguồn hoạt động', friction: 'Ma sát gối đỡ', noise: 'Tiếng ồn' };

  /* ================= Nhiệt ảnh xung ================= */
  METHODS.IR = {
    prep(el, M, next) {
      const q = M.q = { emis: 1, longPulse: false, rec: 10, reflect: false, alphaK: 1 };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị nhiệt ảnh xung'), h('p', { class: 'dim' }, 'Camera hồng ngoại đo bức xạ phát ra từ bề mặt, không phải nhiệt độ trực tiếp. Bề mặt bóng, phản xạ môi trường và cách kích thích nhiệt đều làm sai bức tranh.')));
      Decide(el, [
        { t: 'An toàn đèn flash', d: 'Bộ đèn flash xenon dùng tụ điện cao áp.', o: [
          { l: 'Đeo kính bảo vệ, báo người xung quanh trước mỗi lần chớp, không mở hộp tụ', ok: true, time: 2 },
          { l: 'Mở nắp hộp tụ kiểm tra dây ngay sau khi tắt máy', lure: 'Đèn chớp hơi yếu', time: 3, safety: 'Mở hộp tụ cao áp khi chưa xả: điện giật' }] },
        { t: 'Bề mặt và độ phát xạ', d: 'Tấm sơn mờ, có một nhãn kim loại bóng dán gần vùng va đập.', o: [
          { l: 'Giữ sơn mờ (ε cao); ghi vị trí nhãn bóng vào sơ đồ', ok: true, time: 2 },
          { l: 'Lau bóng bề mặt bằng dung dịch đánh bóng cho sạch', lure: 'Bề mặt sạch đẹp', time: 6, fx: () => { q.emis = 0.5; }, why: 'Bề mặt bóng có độ phát xạ thấp, phản xạ môi trường: tương phản nhiệt giảm mạnh.' }] },
        { t: 'Cách kích thích nhiệt', o: [
          { l: 'Đèn flash xung ngắn (vài ms), camera ghi ngay từ trước khi chớp', ok: true, time: 2 },
          { l: 'Sấy bằng súng nhiệt 2 phút cho nóng đều rồi mới chụp', lure: 'Không cần đèn flash', time: 4, fx: () => { q.longPulse = true; }, why: 'Xung dài làm nhòe theo độ sâu, khuyết tật nông mất tương phản; còn có nguy cơ nung nhựa quá nhiệt độ chuyển hóa thủy tinh.' }] },
        { t: 'Thời gian ghi sau chớp', slider: { label: 'Ghi trong', min: 1, max: 60, step: 1, val: 5, unit: 's', hint: 't ≈ z²/α với α ≈ 4·10⁻⁷ m²/s. Tấm dày 4 mm; tách lớp do va đập có thể nằm ở bất kỳ độ sâu nào.',
          apply: v => { q.rec = v; return { ok: v >= 20, time: Math.ceil(v / 20), why: v < 20 ? `Ghi ${v} s chỉ thấy khuyết tật nông hơn √(α·t) ≈ ${fmt(Math.sqrt(4e-7 * v) * 1000, 1)} mm.` : `Ghi ${v} s: thấy tới độ sâu khoảng ${fmt(Math.min(4, Math.sqrt(4e-7 * v) * 1000), 1)} mm.` }; } } },
        { t: 'Phản xạ môi trường', o: [
          { l: 'Tắt đèn halogen gần đó, không đứng chắn trước tấm, đặt camera lệch góc nhỏ để không thấy ảnh phản chiếu của chính nó', ok: true, time: 3 },
          { l: 'Để nguyên đèn xưởng cho sáng', lure: 'Nhìn rõ hơn', time: 0, fx: () => { q.reflect = true; } }] },
        { t: 'Kiểm chứng trên mẫu chuẩn', o: [
          { l: 'Chụp mẫu CFRP cùng lớp xếp có lỗ đáy bằng ở các độ sâu đã biết để kiểm chứng α', ok: true, time: 8 },
          { l: 'Dùng α trong sổ tay là đủ', lure: 'Tiết kiệm 8 phút', time: 0, fx: () => { q.alphaK = 1.6; }, why: 'α thay đổi theo lớp xếp và tỉ lệ nhựa; không kiểm chứng thì ước tính độ sâu sai.' }] }
      ], s => { M.proc = s; next(); });
    },
    inspect(el, M, next) {
      const q = M.q, l = M.lvl, inds = M.inds, a = l.alpha; let t = 0.4;
      if (q.reflect) inds.push({ id: 'R', kind: 'emis', x: 20 + M.rng() * 160, y: -15 + M.rng() * 30, len: 7, atlas: 'emis', reflect: true });
      const tau = i => (i.depth * 1e-3) ** 2 / a;
      const con = (i, tt) => { if (i.kind === 'delam') { const r = tt / tau(i); let c = 0.8 / Math.pow(i.depth, 0.6) * r * r * Math.exp(2 * (1 - r)) * q.emis; if (q.longPulse) c *= i.depth < 1 ? 0.35 : 0.7; return c; }
        if (i.kind === 'emis') return i.reflect ? 0.7 : 0.55; if (i.kind === 'rib') return -0.45 * Math.min(1, Math.max(0, (tt - 6) / 8)); return 0; };
      const spec = []; for (let k = 0; k < 220; k++) spec.push([M.rng() * 200, (M.rng() - 0.5) * 50, M.rng()]);
      const col = c => { const v = Math.max(0, Math.min(1, 0.2 + 0.8 * c)); const r = Math.round(255 * Math.min(1, v * 1.5)), g = Math.round(255 * Math.max(0, Math.min(1, (v - 0.35) * 1.8))), b = Math.round(255 * Math.max(0, Math.min(1, v < 0.3 ? 0.18 + v : v < 0.5 ? 0.48 - (v - 0.3) * 2.4 : (v - 0.75) * 3))); return [r, g, b]; };
      const tLab = h('span', { class: 'mono' }); const tSl = h('input', { type: 'range', min: 0, max: 1000, value: 0 });
      const setT = () => { t = 0.05 * Math.pow(q.rec / 0.05, +tSl.value / 1000); tLab.textContent = `t = ${fmt(t, t < 1 ? 2 : 1)} s`; surf.draw(); };
      const surf = root.Surface.view(el, {
        length: l.length, band: l.band, height: 324,
        head: h('div', null, h('h2', null, 'Đọc chuỗi ảnh nhiệt'), h('p', { class: 'dim' }, 'Kéo thanh thời gian để xem bề mặt nguội đi sau chớp. Màu là tương phản so với vùng lành. Đo đường kính vết ở thời điểm tương phản vừa đạt cực đại; chờ lâu vết sẽ loang rộng. “Đường cong nguội” (+1 phút) cho thời điểm cực đại tại điểm đo.'),
          h('div', { class: 'sl' }, h('span', null, 'Thời gian sau chớp'), tSl, tLab)),
        rulerColor: 'rgba(255,255,255,.85)',
        drawBg(ctx, toPx, g, W, H) { const [r0, g0, b0] = col(0); ctx.fillStyle = `rgb(${r0},${g0},${b0})`; ctx.fillRect(0, 0, W, H);
          for (const [x, y, n] of spec) { const [px, py] = toPx(x, y); ctx.fillStyle = `rgba(${n > 0.5 ? '255,255,255' : '0,0,0'},.05)`; ctx.fillRect(px, py, 3, 3); } },
        drawInds(ctx, toPx) {
          for (const i of inds) { const c = con(i, t); if (Math.abs(c) < 0.03) continue; const [r, g2, b] = col(c);
            if (i.kind === 'rib') { const [, y1] = toPx(0, i.y - i.w / 2), [, y2] = toPx(0, i.y + i.w / 2), [x0] = toPx(0, 0), [x1] = toPx(200, 0); const gr = ctx.createLinearGradient(0, y1 - 8, 0, y2 + 8); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, `rgba(${r},${g2},${b},.95)`); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(x0, y1 - 8, x1 - x0, y2 - y1 + 16); continue; }
            const [px, py] = toPx(i.x, i.y), [ex] = toPx(i.x + 1, i.y), ppm = ex - px;
            if (i.kind === 'emis') { const s = i.len * ppm; ctx.fillStyle = `rgb(${r},${g2},${b})`; i.reflect ? (ctx.beginPath(), ctx.arc(px, py, s / 2, 0, 7), ctx.fill()) : ctx.fillRect(px - s / 2, py - s * 0.35, s, s * 0.7); continue; }
            const R = (i.len / 2 + 0.5 * Math.sqrt(a * t) * 1000 + (q.longPulse ? 3 : 0)) * ppm, gr = ctx.createRadialGradient(px, py, 0, px, py, R * 1.3);
            gr.addColorStop(0, `rgba(${r},${g2},${b},1)`); gr.addColorStop(0.6, `rgba(${r},${g2},${b},.9)`); gr.addColorStop(1, `rgba(${r},${g2},${b},0)`); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, R * 1.3, 0, 7); ctx.fill(); }
          ctx.fillStyle = '#fff'; ctx.font = font(12, 600); ctx.fillText(`t = ${fmt(t, t < 1 ? 2 : 1)} s`, 8, 16);
        },
        classes: [['delam', 'Tách lớp'], ['emis', 'Độ phát xạ / phản xạ'], ['geom', 'Gân / kết cấu']],
        verify: { label: 'Đường cong nguội', fn: (m, rr) => { addTime(1, 'phân tích đường cong nguội'); const i = root.Surface.match([m], inds)[0].i;
          if (!i) return toast(`${m.label}: đường cong nguội trùng với vùng lành`);
          if (i.kind === 'delam') { const tp = tau(i); if (tp > q.rec) return toast(`${m.label}: tương phản còn đang tăng khi hết thời gian ghi (${q.rec} s)`, 'hi'); const z = Math.sqrt(a * q.alphaK * tp) * 1000; m.depthEst = z; toast(`${m.label}: tương phản cực đại ở t ≈ ${fmt(tp, 1)} s → z ≈ √(α·t) ≈ ${fmt(z, 1)} mm`, 'hi'); }
          else if (i.kind === 'emis') toast(`${m.label}: tương phản có ngay từ khung hình đầu và không đổi theo thời gian → do bề mặt, không phải khuyết tật`, 'ok');
          else toast(`${m.label}: vùng lạnh hơn, xuất hiện muộn (sau khoảng 8 s), thẳng hàng dọc tấm → trùng gân tăng cứng trên bản vẽ`, 'ok'); rr(); } }
      });
      tSl.oninput = setT; setTimeout(setT); M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(10, 'đọc ảnh và lập sơ đồ'); next(); } }, 'Xong, lập biên bản')));
    },
    report(el, M, finish) {
      const tr = { delam: 'delam', emis: 'emis', rib: 'geom' };
      root.Surface.report(el, M, {
        truth: i => ({ cls: tr[i.kind], relevant: i.kind === 'delam' }),
        crit: i => ({ type: i.kind, len: i.len, x: i.x }),
        name: i => ({ delam: `tách lớp Ø ${fmt(i.len, 0)} mm ở độ sâu ${fmt(i.depth, 1)} mm`, emis: i.reflect ? 'ảnh phản xạ của đèn' : 'nhãn bóng (độ phát xạ thấp)', rib: 'gân tăng cứng' })[i.kind],
        label: c => ({ delam: 'Tách lớp', emis: 'Độ phát xạ / phản xạ', geom: 'Gân / kết cấu' })[c] || '—',
        playerRelevant: m => m.cls === 'delam', playerType: c => c,
        extraNotes: M => [].concat(M.q.rec < 20 ? [`Chỉ ghi ${M.q.rec} s: khuyết tật sâu hơn ${fmt(Math.sqrt(4e-7 * M.q.rec) * 1000, 1)} mm chưa kịp hiện.`] : [], M.q.longPulse ? ['Kích thích bằng súng nhiệt: mất tương phản ở khuyết tật nông.'] : [], M.q.alphaK !== 1 ? ['Không kiểm chứng α trên mẫu chuẩn: độ sâu ước tính bị lệch.'] : [])
      }, finish);
    }
  };

  /* ================= Vi ba ================= */
  METHODS.MW = {
    prep(el, M, next) {
      const q = M.q = { f: 24, so: 5, step: 1, cal: 1, noise: 0 };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị quét vi ba'), h('p', { class: 'dim' }, 'Vi ba phản xạ ở nơi hằng số điện môi thay đổi. Tần số quyết định bước sóng và độ phân giải; khoảng cách và bước quét quyết định ảnh có rõ hay nhòe.')));
      Decide(el, [
        { t: 'An toàn đường ống', o: [
          { l: 'Xác nhận đoạn ống đã cô lập và xả áp trước khi lắp bộ quét', ok: true, time: 5 },
          { l: 'Lắp bộ quét khi ống đang thử áp 6 bar', lure: 'Không phải chờ xả', time: 0, safety: 'Thao tác sát mối hàn chưa nghiệm thu khi ống đang có áp' }] },
        { t: 'Tần số', o: [
          { l: '24 GHz (λ trong HDPE ≈ 8.2 mm)', ok: true, time: 2 },
          { l: '10 GHz', lure: 'Xuyên sâu hơn', time: 2, fx: () => { q.f = 10; }, why: 'λ trong HDPE ≈ 19.8 mm: phân giải cỡ 10 mm, lỗ rỗng nhỏ bị bỏ sót.' },
          { l: '100 GHz', lure: 'Phân giải cao nhất', time: 40, fx: () => { q.f = 100; q.noise = 0.35; }, why: 'Rất nhạy với nhám bề mặt và gờ hàn, vùng phủ nhỏ nên quét rất lâu.' }] },
        { t: 'Khoảng cách đầu dò (standoff)', slider: { label: 'Khoảng cách', min: 1, max: 30, step: 1, val: 20, unit: 'mm', hint: 'Đầu dò hở: xa quá thì chùm loe rộng, ảnh nhòe; sát quá thì gờ hàn chạm đầu dò.',
          apply: v => { q.so = v; return { ok: v >= 2 && v <= 10, time: 1, why: v > 10 ? 'Xa quá: chùm loe, ảnh nhòe.' : v < 2 ? 'Sát quá: chạm gờ hàn, tín hiệu dao động.' : 'Khoảng cách phù hợp.' }; } } },
        { t: 'Bước quét', slider: { label: 'Bước quét', min: 0.5, max: 10, step: 0.5, val: 5, unit: 'mm', hint: 'Bước quét nên nhỏ hơn khoảng một phần tư bước sóng trong vật liệu để không bỏ sót chi tiết.',
          apply: v => { q.step = v; const lam = 300 / q.f / Math.sqrt(2.3); return { ok: v <= lam / 4 + 0.01, time: Math.round(20 / v), why: v > lam / 4 ? `Bước ${fmt(v, 1)} mm > λ/4 ≈ ${fmt(lam / 4, 1)} mm: chi tiết nhỏ rơi vào giữa hai đường quét.` : 'Bước quét đủ mịn.' }; } } },
        { t: 'Vật kim loại', d: 'Có một đai thép giữ ống và băng nhôm đánh dấu gần vùng quét.', o: [
          { l: 'Tháo đai và băng nhôm khỏi vùng quét; ghi nhận những gì không tháo được', ok: true, time: 4, fx: () => { M.inds = M.inds.filter(i => !i.removable); } },
          { l: 'Để nguyên, nó nằm ngoài mặt nóng chảy', lure: 'Tiết kiệm 4 phút', time: 0 }] },
        { t: 'Kiểm chứng trên mẫu', o: [
          { l: 'Quét mẫu HDPE cùng chiều dày có lỗ khoan Ø3 mm và màng chèn mô phỏng không ngấu', ok: true, time: 10 },
          { l: 'Dùng thông số mặc định của máy', lure: 'Tiết kiệm 10 phút', time: 0, fx: () => { q.cal = 0.6; } }] }
      ], s => { M.proc = s; next(); });
    },
    inspect(el, M, next) {
      const q = M.q, l = M.lvl, inds = M.inds; const lam = 300 / q.f / Math.sqrt(l.eps), res = Math.max(lam / 2, q.step) * (1 + Math.max(0, q.so - 10) / 8);
      const base = { lof: 0.55, void: 1, incl: 0.75, metal: 3 };
      const amp = i => base[i.kind] * (i.kind === 'lof' ? Math.min(1, 6 / res) : Math.min(1, i.len / res)) * q.cal;
      const noise = []; for (let k = 0; k < 400; k++) noise.push([M.rng() * l.length, (M.rng() - 0.5) * l.band, M.rng()]);
      const surf = root.Surface.view(el, {
        length: l.length, band: l.band, height: 330,
        head: h('div', null, h('h2', null, 'Ảnh quét C-scan biên độ phản xạ'), h('p', { class: 'dim' }, `λ trong HDPE ≈ ${fmt(lam, 1)} mm · độ phân giải hiệu dụng ≈ ${fmt(res, 1)} mm. Đường sáng mờ ở giữa là gờ hàn trong và ngoài (luôn có). Kéo thước để đo, “Quét chi tiết” (+4 phút) để xem pha và kích thước thật.`)),
        rulerColor: 'rgba(255,255,255,.85)',
        drawBg(ctx, toPx, g, W, H) { ctx.fillStyle = '#0b1d3a'; ctx.fillRect(0, 0, W, H); const [, y1] = toPx(0, -2.5), [, y2] = toPx(0, 2.5); const gr = ctx.createLinearGradient(0, y1, 0, y2); gr.addColorStop(0, 'rgba(60,110,170,0)'); gr.addColorStop(0.5, 'rgba(60,110,170,.55)'); gr.addColorStop(1, 'rgba(60,110,170,0)'); ctx.fillStyle = gr; ctx.fillRect(0, y1, W, y2 - y1);
          for (const [x, y, n] of noise) { const [px, py] = toPx(x, y); ctx.fillStyle = `rgba(120,170,230,${0.05 + q.noise * n})`; ctx.fillRect(px, py, 3, 3); } },
        drawInds(ctx, toPx) {
          for (const i of inds) { const A = Math.min(1.2, amp(i)); if (A < 0.12) continue; const [px, py] = toPx(i.x, i.y), [ex, ey] = toPx(i.x + 1, i.y + 1), sx = ex - px, sy = ey - py;
            const rx = (i.len / 2 + res / 2) * sx, ry = (i.kind === 'lof' ? 1.2 + res / 2 : i.len / 2 + res / 2) * sy, hot = Math.min(1, A);
            const c = i.kind === 'metal' ? '255,255,255' : `${Math.round(80 + 175 * hot)},${Math.round(200 + 55 * hot)},${Math.round(255 - 200 * hot)}`;
            ctx.save(); ctx.translate(px, py); ctx.scale(1, ry / rx); const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(${c},${Math.min(1, A)})`); gr.addColorStop(0.65, `rgba(${c},${Math.min(1, A) * 0.7})`); gr.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore(); }
        },
        classes: [['lof', 'Không ngấu'], ['void', 'Lỗ rỗng'], ['incl', 'Tạp chất'], ['nonrel', 'Kim loại / không liên quan']],
        verify: { label: 'Quét chi tiết', fn: (m, rr) => { addTime(4, 'quét chi tiết bước 0.5 mm'); const i = root.Surface.match([m], inds)[0].i;
          if (!i) return toast(`${m.label}: không có phản xạ khác nền`);
          toast(`${m.label}: ` + ({ void: `pha ngược với phản xạ từ vật có ε cao → vùng ε thấp (không khí): lỗ rỗng Ø ≈ ${fmt(i.len, 1)} mm`, incl: `pha cùng chiều phản xạ từ vật có ε cao hơn nhựa → tạp chất (cát, bụi), Ø ≈ ${fmt(i.len, 1)} mm`, lof: `phản xạ yếu, mỏng, kéo dài ${fmt(i.len, 0)} mm đúng trên mặt nóng chảy → không ngấu`, metal: '|Γ| ≈ 1, bão hòa, nằm ngoài mặt nóng chảy → vật kim loại' })[i.kind], 'hi'); rr(); } }
      });
      M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(15, 'quét toàn dải và lập bản đồ'); next(); } }, 'Xong, lập biên bản')));
    },
    report(el, M, finish) {
      root.Surface.report(el, M, {
        truth: i => ({ cls: i.kind === 'metal' ? 'nonrel' : i.kind, relevant: i.kind !== 'metal' }),
        crit: i => ({ type: i.kind, len: i.len, x: i.x }),
        name: i => ({ lof: `vùng không ngấu dài ${fmt(i.len, 0)} mm`, void: `lỗ rỗng Ø ${fmt(i.len, 1)} mm`, incl: `tạp chất Ø ${fmt(i.len, 1)} mm`, metal: 'đai kim loại' })[i.kind],
        label: c => ({ lof: 'Không ngấu', void: 'Lỗ rỗng', incl: 'Tạp chất', nonrel: 'Không liên quan' })[c] || '—',
        playerRelevant: m => m.cls !== 'nonrel', playerType: c => c,
        extraNotes: M => { const lam = 300 / M.q.f / Math.sqrt(2.3); return [].concat(M.q.f === 10 ? [`10 GHz: λ ≈ ${fmt(lam, 1)} mm trong HDPE, chi tiết nhỏ hơn khoảng ${fmt(lam / 2, 0)} mm bị nhòe mất.`] : [], M.q.step > lam / 4 ? ['Bước quét thô: chi tiết nhỏ rơi giữa hai đường quét.'] : [], M.q.so > 10 ? ['Đầu dò đặt xa: ảnh nhòe.'] : []); }
      }, finish);
    }
  };

  /* ---------------- Gợi ý nghề nghiệp sau mỗi hợp đồng ---------------- */
  const MNAME = { PT: 'thẩm thấu (PT)', MT: 'hạt từ (MT)', UT: 'siêu âm (UT)', RT: 'chụp ảnh bức xạ (RT)', VT: 'kiểm tra bằng mắt (VT)', ET: 'dòng điện xoáy (ET)', AE: 'phát xạ âm (AE)', IR: 'nhiệt ảnh hồng ngoại (IR)', MW: 'vi ba (MW)' };
  const COMMON = ['PT', 'MT', 'UT', 'RT', 'VT', 'ET'];
  const link = (href, txt) => h('a', { href, target: '_blank', rel: 'noopener' }, txt);
  G.careerLine = (m) => h('div', { class: 'card', style: 'border-color:#2d5c48;margin-top:14px' },
    h('h3', null, `Bạn thấy thích công việc ${MNAME[m] || m}?`),
    h('p', null, 'Ngoài đời, đây là một nghề thật, với chứng chỉ thật và trách nhiệm thật: chữ ký của người kiểm tra quyết định một mối hàn, một chiếc bồn hay một cánh máy bay có được đưa vào sử dụng hay không.'),
    h('ul', null,
      h('li', null, h('b', null, 'Muốn áp dụng phương pháp này cho nhà máy, công trình của bạn: '), 'tìm tới các công ty làm dịch vụ NDT ở Việt Nam, ví dụ ', link('https://phateco.com/', 'Công ty Cổ phần Dịch vụ Kỹ thuật PHATECO'), '.'),
      h('li', null, h('b', null, 'Muốn học bài bản và có chứng chỉ thực sự: '), 'tìm tới ', link('https://www.pnic.vn/', 'PNIC – Trung tâm chứng nhận NDT và kiểm định công nghiệp'), ' (chứng nhận theo ISO 9712), hoặc các đơn vị đào tạo khác ở Việt Nam như ', link('https://nde.com.vn/', 'Trung tâm Đánh giá không phá hủy (NDE, Vinatom)'), '.' + (COMMON.includes(m) ? '' : ' Phương pháp này ít đơn vị mở lớp hơn; hãy hỏi trước về khóa học và kỳ thi.'))),
    h('p', { class: 'dim', style: 'font-size:.85rem' }, 'Chứng chỉ Bậc I, II, III trong game chỉ là mô phỏng, không có giá trị pháp lý. Tên đơn vị nêu trên chỉ để bạn tham khảo; hãy tự tìm hiểu và so sánh trước khi chọn.'));
})(this);
