/* academy_sims.js — mô phỏng tương tác của Học viện NDE. Mỗi hàm SIMS[id](el) vẽ vào el.
 * Các mô hình vật liệu ghi “tham khảo” là giá trị minh họa cho học tập, không thay số liệu vật liệu thực.
 */
(function (root) {
  'use strict';
  const { h, fmt, fitCanvas, slider, toast, parseNum, numMsg } = root.Game; const P = root.Physics;
  const ink = '#e8eef2', dim = '#9fb0bc', hi = '#ffc531', cy = '#43c6f0', ok = '#3ddc97', bad = '#ff5d5d';
  const font = (px, w = 400) => `${w} ${px}px "Be Vietnam Pro"`;
  const card = (...k) => h('div', { class: 'card' }, ...k);
  const sel = (opts, val, on) => { const s = h('select', { class: 'f' }, opts.map(([v, t]) => h('option', { value: v }, t))); s.value = val; s.onchange = () => on(s.value); return s; };
  const out = () => h('div', { class: 'mono', style: 'margin-top:6px' });
  const redrawOnResize = fn => { const ro = new ResizeObserver(() => fn()); return ro; };

  const SIMS = {
    /* ---- Nguyên tử ---- */
    atom(el) {
      let Z = 26, N = 30; const cv = h('canvas'), o = out();
      const SYM = { 1: 'H', 2: 'He', 6: 'C', 7: 'N', 8: 'O', 13: 'Al', 14: 'Si', 22: 'Ti', 24: 'Cr', 26: 'Fe', 27: 'Co', 28: 'Ni', 29: 'Cu', 34: 'Se', 55: 'Cs', 74: 'W', 77: 'Ir', 82: 'Pb', 92: 'U' };
      const RT = { '27-60': 'Co-60: nguồn gamma năng lượng cao, thép dày', '34-75': 'Se-75: nguồn gamma cho thép mỏng – trung bình', '77-192': 'Ir-192: nguồn gamma phổ biến nhất ở hiện trường', '55-137': 'Cs-137: nguồn gamma (ít dùng trong RT công nghiệp hiện nay)' };
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 240); ctx.clearRect(0, 0, W, H); const cx = Math.min(W / 2, 170), cy0 = H / 2;
        const shells = [2, 8, 18, 32, 32, 18, 8]; let left = Z;
        shells.forEach((cap, i) => { if (left <= 0) return; const n = Math.min(cap, left); left -= n; const r = 34 + i * 14;
          ctx.strokeStyle = 'rgba(159,176,188,.35)'; ctx.beginPath(); ctx.arc(cx, cy0, r, 0, 7); ctx.stroke();
          ctx.fillStyle = cy; for (let k = 0; k < n; k++) { const a = k / n * 6.283 + i; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy0 + Math.sin(a) * r, 2.2, 0, 7); ctx.fill(); } });
        const tot = Z + N, rN = 6 + Math.cbrt(tot) * 3;
        for (let k = 0; k < Math.min(tot, 260); k++) { const a = k * 2.399, rr = rN * Math.sqrt(k / Math.min(tot, 260)); ctx.fillStyle = k % (tot / Z) < 1 ? bad : '#9aa6af'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy0 + Math.sin(a) * rr, 2.4, 0, 7); ctx.fill(); }
        ctx.fillStyle = ink; ctx.font = font(22, 700); const sym = SYM[Z] || `Z=${Z}`; ctx.fillText(`${sym}-${Z + N}`, Math.min(W - 150, cx + 140), 60);
        ctx.font = font(13); ctx.fillStyle = dim; ctx.fillText('đỏ: proton · xám: neutron · xanh: electron', Math.min(W - 260, cx + 140), 84);
        const key = `${Z}-${Z + N}`; o.innerHTML = ''; o.append(h('div', null, `Z = ${Z} proton · N = ${N} neutron · A = ${Z + N} · ${Z} electron (nguyên tử trung hòa)`), RT[key] ? h('div', { class: 'hi' }, '★ ' + RT[key]) : h('div', { class: 'dim' }, 'Thử tạo Ir-192, Co-60 hoặc Se-75: các nguồn gamma của RT.'));
      };
      el.append(card(h('h3', null, 'Lắp ráp nguyên tử'), cv, slider('Proton Z', 1, 92, 1, Z, '', v => { Z = v; draw(); }), slider('Neutron N', 0, 146, 1, N, '', v => { N = v; draw(); }), o));
      setTimeout(draw);
    },

    /* ---- Hiệu ứng bề mặt ---- */
    skin(el) {
      const MATS = { cu: ['Đồng ủ', 100, 1], al: ['Hợp kim nhôm 6061-T6 (≈ 40 % IACS, tham khảo)', 40, 1], ss: ['Inox 304 (≈ 2.5 % IACS, tham khảo)', 2.5, 1], cs: ['Thép cacbon (≈ 10 % IACS, μr ≈ 100, tham khảo)', 10, 100] };
      let m = 'al', lf = 5; const cv = h('canvas'), o = out();
      const draw = () => {
        const [nm, iacs, mur] = MATS[m], f = Math.pow(10, lf), sig = iacs / 100 * P.IACS, d = P.skinDepth(f, sig, mur);
        const { ctx, W, H } = fitCanvas(cv, 210); ctx.clearRect(0, 0, W, H); const max = Math.max(3 * d, 1e-4), X = x => 40 + (W - 60) * x / max;
        ctx.fillStyle = '#3a434b'; ctx.fillRect(40, 30, W - 60, H - 70);
        for (let i = 0; i < 60; i++) { const x = max * i / 60, J = P.currentDensityAt(x, d); ctx.fillStyle = `rgba(255,197,49,${J})`; ctx.fillRect(X(x), 30, (W - 60) / 60 + 1, H - 70); }
        ctx.strokeStyle = cy; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const x = max * i / 100; const y = 30 + (H - 70) * (1 - P.currentDensityAt(x, d)); i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); } ctx.stroke();
        [1, 2, 3].forEach(k => { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(k * d), 26); ctx.lineTo(X(k * d), H - 36); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = ink; ctx.font = font(12); ctx.fillText(`${k}δ`, X(k * d) - 8, 22); });
        ctx.fillStyle = dim; ctx.fillText('bề mặt', 40, H - 18); ctx.fillText(`độ sâu → ${fmt(max * 1000, 2)} mm`, W - 150, H - 18);
        o.innerHTML = ''; o.append(h('div', null, `${nm} · f = ${f >= 1e6 ? fmt(f / 1e6, 2) + ' MHz' : fmt(f / 1e3, 1) + ' kHz'}`), h('div', { class: 'hi' }, `δ = ${fmt(d * 1000, 3)} mm · tại 1δ: 37 % · tại 3δ: ${fmt(P.currentDensityAt(3 * d, d) * 100, 0)} %`));
      };
      el.append(card(h('h3', null, 'Dòng xoáy vào sâu được bao nhiêu?'), h('div', { class: 'formula' }, 'δ = 1/√(π·f·μ·σ)'), sel(Object.entries(MATS).map(([k, v]) => [k, v[0]]), m, v => { m = v; draw(); }), cv,
        slider('Tần số (log₁₀ Hz)', 3, 7, 0.05, lf, '', v => { lf = v; draw(); }), o));
      setTimeout(draw);
    },

    /* ---- Vòng từ trễ ---- */
    hysteresis(el) {
      const T = { soft: ['Thép từ mềm (Hc nhỏ)', 0.25, 1.6, 0.35], hard: ['Thép từ cứng (Hc, Br lớn)', 1.1, 1.4, 0.45] };
      let m = 'soft', demag = null; const cv = h('canvas'), o = out();
      const Bof = (Hx, up, p) => p[2] * Math.tanh((Hx + (up ? -p[1] : p[1])) / p[3]);
      const draw = (amp = 3) => {
        const p = T[m]; const { ctx, W, H } = fitCanvas(cv, 260); ctx.clearRect(0, 0, W, H); const cx = W / 2, cyy = H / 2, sx = (W - 60) / 8, sy = (H - 40) / 4;
        ctx.strokeStyle = '#4a5966'; ctx.beginPath(); ctx.moveTo(30, cyy); ctx.lineTo(W - 30, cyy); ctx.moveTo(cx, 10); ctx.lineTo(cx, H - 10); ctx.stroke();
        ctx.fillStyle = dim; ctx.font = font(12); ctx.fillText('H (từ trường)', W - 110, cyy - 6); ctx.fillText('B (cảm ứng từ)', cx + 6, 20);
        const loop = (A, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const Hx = -A + 2 * A * i / 120; const y = Bof(Hx, true, p) * Math.min(1, A / 3); i ? ctx.lineTo(cx + Hx * sx, cyy - y * sy) : ctx.moveTo(cx + Hx * sx, cyy - y * sy); }
          for (let i = 0; i <= 120; i++) { const Hx = A - 2 * A * i / 120; const y = Bof(Hx, false, p) * Math.min(1, A / 3); ctx.lineTo(cx + Hx * sx, cyy - y * sy); } ctx.stroke(); };
        loop(amp, hi);
        if (amp >= 3) { const Br = Bof(0, false, p); ctx.fillStyle = ok; ctx.beginPath(); ctx.arc(cx, cyy - Br * sy, 5, 0, 7); ctx.fill(); ctx.fillText(`Br ≈ ${fmt(Br, 2)} T`, cx + 8, cyy - Br * sy - 6);
          ctx.fillStyle = bad; ctx.beginPath(); ctx.arc(cx - p[1] * sx, cyy, 5, 0, 7); ctx.fill(); ctx.fillText('−Hc', cx - p[1] * sx - 30, cyy + 16); }
        o.innerHTML = ''; o.append(h('div', null, p[0]), h('div', { class: 'dim' }, 'Mô hình minh họa dạng tanh; đơn vị H tương đối.'));
      };
      const dm = () => { cancelAnimationFrame(demag); let A = 3; const step = () => { A *= 0.96; draw(A); if (A > 0.05) demag = requestAnimationFrame(step); else toast('Đã khử từ: Br → 0', 'ok'); }; step(); };
      el.append(card(h('h3', null, 'Vòng từ trễ và khử từ'), sel(Object.entries(T).map(([k, v]) => [k, v[0]]), m, v => { m = v; draw(); }), cv, o,
        h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: dm }, 'Khử từ (trường đổi chiều, giảm dần)'), h('button', { class: 'btn sm ghost', onclick: () => draw() }, 'Vẽ lại vòng đầy đủ'))));
      setTimeout(() => draw());
    },

    /* ---- Bước sóng ---- */
    wavelength(el) {
      const V = { sL: ['Thép – sóng dọc', 5920], sS: ['Thép – sóng ngang', 3240], aL: ['Nhôm – sóng dọc', 6320], w: ['Nước', 1480], p: ['Perspex – sóng dọc', 2730] };
      let m = 'sL', f = 5, d = 0.8; const cv = h('canvas'), o = out();
      const draw = () => {
        const v = V[m][1], lam = P.wavelength(v, f * 1e6) * 1000; const { ctx, W, H } = fitCanvas(cv, 170); ctx.clearRect(0, 0, W, H);
        const span = 12, X = x => 20 + (W - 40) * x / span; ctx.strokeStyle = cy; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 600; i++) { const x = span * i / 600; const y = 70 + 40 * Math.sin(2 * Math.PI * x / lam); i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); } ctx.stroke();
        ctx.fillStyle = d >= lam / 2 ? ok : bad; ctx.beginPath(); ctx.arc(X(6), 140, Math.max(2, (W - 40) * d / span / 2), 0, 7); ctx.fill();
        ctx.fillStyle = ink; ctx.font = font(12); ctx.fillText(`khuyết tật ${fmt(d, 2)} mm`, X(6) + 14, 144); ctx.fillStyle = dim; ctx.fillText('thang ngang: 12 mm', W - 130, 16);
        o.innerHTML = ''; o.append(h('div', null, `λ = v/f = ${v} / ${fmt(f, 1)}·10⁶ = ${fmt(lam, 2)} mm · λ/2 = ${fmt(lam / 2, 2)} mm`), h('div', { class: d >= lam / 2 ? 'ok' : 'bad' }, d >= lam / 2 ? 'Khuyết tật ≥ λ/2: có khả năng phát hiện' : 'Khuyết tật < λ/2: dễ lọt'));
      };
      el.append(card(h('h3', null, 'Tần số, bước sóng và khuyết tật nhỏ nhất'), sel(Object.entries(V).map(([k, v]) => [k, v[0]]), m, v => { m = v; draw(); }), cv,
        slider('Tần số', 0.5, 15, 0.5, f, 'MHz', v => { f = v; draw(); }), slider('Cỡ khuyết tật', 0.1, 3, 0.05, d, 'mm', v => { d = v; draw(); }), o));
      setTimeout(draw);
    },

    /* ---- Trở kháng âm ---- */
    acimp(el) {
      const Z = { air: ['Không khí', 0.0004], water: ['Nước', 1.48], gly: ['Glycerin (chất tiếp âm)', 2.42], per: ['Perspex', 3.2], al: ['Nhôm', 17.1], st: ['Thép', 46.5] };
      let a = 'per', b = 'st'; const o = out(); const bars = h('div');
      const draw = () => { const R = P.reflectionCoef(Z[a][1], Z[b][1]), T = 1 - R; bars.innerHTML = '';
        [['Phản xạ', R, bad], ['Truyền qua', T, ok]].forEach(([n, v, c]) => bars.append(h('div', { style: 'margin:6px 0' }, h('div', { class: 'row' }, h('span', null, n), h('span', { class: 'spacer' }), h('span', { class: 'mono' }, fmt(v * 100, v < 0.01 ? 3 : 1) + ' %')), h('div', { class: 'bar', style: 'height:12px' }, h('i', { style: `width:${Math.max(0.5, v * 100)}%;background:${c}` })))));
        o.textContent = `Z₁ = ${Z[a][1]} MRayl · Z₂ = ${Z[b][1]} MRayl · R = ((Z₂ − Z₁)/(Z₂ + Z₁))²`; };
      el.append(card(h('h3', null, 'Âm đi qua mặt phân cách'), h('div', { class: 'grid g2' }, h('div', null, h('label', { class: 'f' }, 'Môi trường 1'), sel(Object.entries(Z).map(([k, v]) => [k, v[0]]), a, v => { a = v; draw(); })),
        h('div', null, h('label', { class: 'f' }, 'Môi trường 2'), sel(Object.entries(Z).map(([k, v]) => [k, v[0]]), b, v => { b = v; draw(); }))), bars, o,
        h('p', { class: 'dim' }, 'Thử Không khí → Thép rồi Glycerin → Thép để thấy vì sao phải bôi chất tiếp âm. Giá trị Z tham khảo.')));
      setTimeout(draw);
    },

    /* ---- Suy giảm bức xạ ---- */
    atten(el) {
      let mu = 0.07, x = 10, void_ = 3; const cv = h('canvas'), o = out();
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 200); ctx.clearRect(0, 0, W, H); const hv = P.hvlFromMu(mu), xmax = 60, X = t => 40 + (W - 60) * t / xmax, Y = r => 20 + (H - 50) * (1 - r);
        ctx.strokeStyle = '#4a5966'; ctx.strokeRect(40, 20, W - 60, H - 50);
        ctx.strokeStyle = hi; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const t = xmax * i / 120; i ? ctx.lineTo(X(t), Y(P.linearAtten(1, mu, t))) : ctx.moveTo(X(t), Y(1)); } ctx.stroke();
        for (let k = 1; k * hv <= xmax; k++) { ctx.fillStyle = dim; ctx.font = font(11); ctx.fillText(`${k} HVL`, X(k * hv) - 14, Y(Math.pow(0.5, k)) - 6); ctx.beginPath(); ctx.arc(X(k * hv), Y(Math.pow(0.5, k)), 3, 0, 7); ctx.fill(); }
        ctx.fillStyle = cy; ctx.beginPath(); ctx.arc(X(x), Y(P.linearAtten(1, mu, x)), 5, 0, 7); ctx.fill();
        ctx.fillStyle = ink; ctx.fillText('I/I₀', 6, 26); ctx.fillText('chiều dày (mm)', W - 110, H - 8);
        const I = P.linearAtten(1, mu, x), Iv = P.linearAtten(1, mu, Math.max(0, x - void_));
        o.innerHTML = ''; o.append(h('div', null, `HVL = 0.693/μ = ${fmt(hv, 1)} mm · I/I₀ qua ${fmt(x, 0)} mm = ${fmt(I * 100, 1)} %`), h('div', { class: 'hi' }, `Có rỗ cao ${fmt(void_, 1)} mm: I/I₀ = ${fmt(Iv * 100, 1)} % → nhiều hơn ${fmt((Iv / I - 1) * 100, 0)} %, nên ảnh rỗ đen hơn nền`));
      };
      el.append(card(h('h3', null, 'Bức xạ đi qua vật'), h('div', { class: 'formula' }, 'I = I₀·e^(−μx) · HVL = ln2/μ'), cv,
        slider('Hệ số suy giảm μ', 0.02, 0.2, 0.005, mu, '/mm', v => { mu = v; draw(); }), slider('Chiều dày vật', 1, 60, 1, x, 'mm', v => { x = v; draw(); }), slider('Chiều cao rỗ khí', 0, 8, 0.5, void_, 'mm', v => { void_ = v; draw(); }), o));
      setTimeout(draw);
    },

    /* ---- Ứng suất – biến dạng ---- */
    stress(el) {
      const E = 200000, Sy = 250, Su = 400, ey = Sy / E, eu = 0.15, ef = 0.22; let e = 0.001; const cv = h('canvas'), o = out();
      const sig = x => x <= ey ? E * x : x <= eu ? Sy + (Su - Sy) * Math.sqrt((x - ey) / (eu - ey)) : Su - (Su - 300) * ((x - eu) / (ef - eu)) ** 2;
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 230); ctx.clearRect(0, 0, W, H); const X = x => 50 + (W - 70) * Math.sqrt(x / ef), Y = s => H - 30 - (H - 50) * s / 450;
        ctx.strokeStyle = '#4a5966'; ctx.strokeRect(50, 20, W - 70, H - 50); ctx.strokeStyle = hi; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 300; i++) { const x = ef * (i / 300) ** 2; i ? ctx.lineTo(X(x), Y(sig(x))) : ctx.moveTo(X(x), Y(0)); } ctx.stroke();
        const s = sig(e); ctx.fillStyle = cy; ctx.beginPath(); ctx.arc(X(e), Y(s), 5, 0, 7); ctx.fill();
        const perm = Math.max(0, e - s / E); if (perm > 0) { ctx.setLineDash([4, 4]); ctx.strokeStyle = cy; ctx.beginPath(); ctx.moveTo(X(e), Y(s)); ctx.lineTo(X(perm), Y(0)); ctx.stroke(); ctx.setLineDash([]); }
        ctx.fillStyle = dim; ctx.font = font(11); ctx.fillText('σ (MPa)', 6, 16); ctx.fillText('ε (trục căn bậc hai để thấy vùng đàn hồi)', W - 250, H - 8);
        const zone = e <= ey ? ['Đàn hồi: bỏ tải là trở về', 'ok'] : e <= eu ? ['Dẻo: còn biến dạng dư sau khi bỏ tải', 'hi'] : ['Thắt cổ: sắp đứt', 'bad'];
        o.innerHTML = ''; o.append(h('div', null, `ε = ${fmt(e * 100, 3)} % · σ = ${fmt(s, 0)} MPa` + (e <= ey ? ` = E·ε` : '')), h('div', { class: zone[1] }, zone[0] + (perm > 0 ? ` · biến dạng dư ≈ ${fmt(perm * 100, 2)} %` : '')),
          h('div', { class: 'dim' }, 'Thép kết cấu minh họa: E = 200 GPa, giới hạn chảy 250 MPa, bền kéo 400 MPa.'));
      };
      el.append(card(h('h3', null, 'Kéo một mẫu thép'), cv, slider('Biến dạng ε', 0, 0.22, 0.0005, e, '', v => { e = v; draw(); }), o)); setTimeout(draw);
    },

    /* ---- Mặt phẳng trở kháng ET ---- */
    etplane(el) {
      let rot = 0; const base = 25; const traces = ['lift', 'shallow']; const cv = h('canvas'), o = out();
      const SIG = { lift: ['Nhấc đầu dò (lift-off)', 0, 1.0], shallow: ['Vết nứt nông', 40, 0.7], deep: ['Vết nứt sâu hơn', 95, 0.45], cond: ['Vùng độ dẫn thấp hơn', 150, 0.5] };
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 260); ctx.clearRect(0, 0, W, H); const cx = W / 2, cyy = H / 2, R = Math.min(W, H) * 0.42;
        ctx.strokeStyle = '#1f3d2a'; ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H);
        const gs = R / 4; for (let x = cx % gs; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = cyy % gs; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        for (const t of traces) { const [nm, ang, amp] = SIG[t]; const a = (base + ang + rot) * Math.PI / 180; ctx.strokeStyle = t === 'lift' ? hi : t === 'cond' ? cy : '#7dff9b'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cyy);
          for (let i = 0; i <= 40; i++) { const s = Math.sin(Math.PI * i / 40) * amp * R; ctx.lineTo(cx + Math.cos(a) * s, cyy - Math.sin(a) * s); } ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.font = font(12);
          ctx.fillText(nm, cx + Math.cos(a) * amp * R * 1.02 + 4, cyy - Math.sin(a) * amp * R * 1.02); }
        ctx.fillStyle = '#7dff9b'; ctx.beginPath(); ctx.arc(cx, cyy, 4, 0, 7); ctx.fill();
        const lo = ((base + rot) % 360 + 360) % 360; o.textContent = `Pha hiển thị: ${fmt(rot, 0)}° · lift-off đang nghiêng ${fmt(lo > 180 ? lo - 360 : lo, 0)}° so với phương ngang`;
      };
      el.append(card(h('h3', null, 'Màn hình mặt phẳng trở kháng'), h('p', { class: 'dim' }, 'Tạo từng tín hiệu, rồi xoay pha cho lift-off nằm ngang. Góc giữa các tín hiệu là mô hình minh họa: khuyết tật càng sâu, tín hiệu càng xoay (độ trễ pha β = x/δ).'), cv,
        h('div', { class: 'row' }, Object.entries(SIG).map(([k, v]) => h('button', { class: 'btn sm ghost', onclick: () => { if (!traces.includes(k)) traces.push(k); draw(); } }, v[0])), h('button', { class: 'btn sm ghost', onclick: () => { traces.length = 0; draw(); } }, 'Xóa màn hình')),
        slider('Xoay pha', -180, 180, 1, rot, '°', v => { rot = v; draw(); }), o,
        h('button', { class: 'btn sm', onclick: () => { const lo = (((base + rot) % 180) + 180) % 180; const okk = lo <= 5 || lo >= 175; toast(okk ? 'Chuẩn: lift-off nằm ngang, vết nứt tách lên trên' : 'Chưa nằm ngang: xoay tiếp', okk ? 'ok' : 'bad'); } }, 'Kiểm tra cài đặt pha')));
      setTimeout(draw);
    },

    /* ---- Vi ba ---- */
    microwave(el) {
      let m = 0, f = 10; const o = out(), cv = h('canvas'); const eDry = 4.5, eW = 80;
      const draw = () => { const eps = (1 - m / 100) * eDry + m / 100 * eW, G = P.mwGamma(eps); const { ctx, W, H } = fitCanvas(cv, 160); ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = `rgb(${60 - m},${90 + m * 3},${140 + m * 4})`; ctx.fillRect(W / 2, 20, W / 2 - 20, H - 40); ctx.fillStyle = ink; ctx.font = font(12); ctx.fillText(`composite, ε ≈ ${fmt(eps, 1)}`, W / 2 + 8, 36);
        const lam = 3e8 / (f * 1e9) * 1000; ctx.strokeStyle = cy; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 20; x < W / 2; x++) { const y = 60 + 22 * Math.sin((x - 20) / 22 * 6.283 * 10 / lam); x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
        ctx.strokeStyle = hi; ctx.beginPath(); for (let x = 20; x < W / 2; x++) { const y = 120 + 22 * Math.abs(G) * Math.sin((x - 20) / 22 * 6.283 * 10 / lam); x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
        ctx.fillStyle = dim; ctx.fillText('sóng tới', 22, 30); ctx.fillText('sóng phản xạ', 22, 150);
        o.innerHTML = ''; o.append(h('div', null, `f = ${f} GHz → λ = ${fmt(lam, 1)} mm trong không khí`), h('div', { class: 'hi' }, `|Γ| = ${fmt(Math.abs(G), 3)} · công suất phản xạ |Γ|² = ${fmt(G * G * 100, 1)} %`), h('div', { class: 'dim' }, 'Hằng số điện môi trộn tuyến tính: mô hình minh họa.')); };
      el.append(card(h('h3', null, 'Độ ẩm làm composite “sáng” lên dưới vi ba'), h('div', { class: 'formula' }, 'Γ = (1 − √ε)/(1 + √ε)  (tới vuông góc từ không khí)'), cv,
        slider('Độ ẩm theo thể tích', 0, 20, 0.5, m, '%', v => { m = v; draw(); }), slider('Tần số', 1, 100, 1, f, 'GHz', v => { f = v; draw(); }), o)); setTimeout(draw);
    },

    /* ---- Định vị phát xạ âm ---- */
    aeloc(el) {
      const D = 2, v = 3000; let src = 0, dt = 0, tries = 0; const cv = h('canvas'), o = out(), inp = h('input', { class: 'f', inputmode: 'decimal', style: 'max-width:140px' });
      const newEv = () => { src = Math.round((0.15 + Math.random() * 1.7) * 100) / 100; dt = (src - (D - src)) / v; tries = 0; inp.value = ''; draw(false); };
      const draw = reveal => { const { ctx, W, H } = fitCanvas(cv, 150); ctx.clearRect(0, 0, W, H); const X = x => 40 + (W - 80) * x / D;
        ctx.fillStyle = '#566069'; ctx.fillRect(X(0), 60, X(D) - X(0), 22); [0, D].forEach((x, i) => { ctx.fillStyle = hi; ctx.fillRect(X(x) - 8, 48, 16, 12); ctx.fillStyle = ink; ctx.font = font(12); ctx.fillText(`S${i + 1}`, X(x) - 8, 42); });
        ctx.fillStyle = dim; ctx.fillText('0 m', X(0) - 6, 104); ctx.fillText('2 m', X(D) - 10, 104);
        if (reveal) { ctx.fillStyle = bad; ctx.beginPath(); ctx.arc(X(src), 71, 7, 0, 7); ctx.fill(); }
        o.innerHTML = ''; o.append(h('div', null, `Vận tốc sóng 3000 m/s · khoảng cách S1–S2 = 2 m`), h('div', { class: 'hi' }, `Δt = t₁ − t₂ = ${fmt(dt * 1000, 3)} ms`)); };
      el.append(card(h('h3', null, 'Tìm vết nứt đang “kêu” trên thanh giằng cầu'), h('div', { class: 'formula' }, 'x = (D + v·Δt)/2  (tính từ S1)'), cv, o,
        h('div', { class: 'row' }, inp, h('span', null, 'm'), h('button', { class: 'btn sm', onclick: () => { const x = parseNum(inp.value); if (isNaN(x)) return toast(numMsg(inp.value), 'bad');
          tries++; const good = Math.abs(x - src) <= 0.03; toast(good ? `Chính xác: nguồn ở ${fmt(src, 2)} m` : `Chưa đúng (lần ${tries})`, good ? 'ok' : 'bad'); if (good || tries >= 2) draw(true); } }, 'Định vị'),
          h('button', { class: 'btn sm ghost', onclick: newEv }, 'Sự kiện mới'))));
      setTimeout(newEv);
    },

    /* ---- Nhiệt ảnh flash ---- */
    thermo(el) {
      const alpha = 4e-7; let t = 0.5; const defs = [{ x: 0.25, y: 0.35, z: 0.5e-3, n: 'A' }, { x: 0.6, y: 0.6, z: 1e-3, n: 'B' }, { x: 0.82, y: 0.3, z: 2e-3, n: 'C' }];
      const cv = h('canvas'), o = out();
      const contrast = (z, tt) => { const ti = P.thermalTime(z, alpha); return (0.5e-3 / z) * (1 - Math.exp(-tt / ti)) * Math.exp(-tt / (8 * ti)); };
      const draw = () => { const { ctx, W, H } = fitCanvas(cv, 220); const img = ctx.createImageData(Math.round(W), 220); const bg = 1 / Math.sqrt(t + 0.2);
        for (let py = 0; py < 220; py++) for (let px = 0; px < Math.round(W); px++) { let v = 0.35 * bg; for (const d of defs) { const dx = px / W - d.x, dy = py / 220 - d.y; v += 0.6 * contrast(d.z, t) * Math.exp(-(dx * dx * 60 + dy * dy * 30)); }
          v = Math.max(0, Math.min(1, v)); const k = (py * Math.round(W) + px) * 4; img.data[k] = 255 * Math.min(1, v * 2); img.data[k + 1] = 255 * Math.max(0, v * 2 - 0.6); img.data[k + 2] = 80 * (1 - v); img.data[k + 3] = 255; }
        const dpr = cv.width / W; ctx.setTransform(1, 0, 0, 1, 0, 0); const tmp = document.createElement('canvas'); tmp.width = Math.round(W); tmp.height = 220; tmp.getContext('2d').putImageData(img, 0, 0); ctx.drawImage(tmp, 0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = ink; ctx.font = font(12); defs.forEach(d => ctx.fillText(d.n, d.x * W - 4, d.y * 220 - 20));
        o.innerHTML = ''; o.append(h('div', null, `t = ${fmt(t, 1)} s sau flash · α = 4·10⁻⁷ m²/s (CFRP, tham khảo)`), h('div', { class: 'dim' }, defs.map(d => `${d.n}: hiện rõ khoảng ${fmt(P.thermalTime(d.z, alpha), 1)} s`).join(' · ') + ' (bật “Đáp án” để xem)'));
        o.lastChild.style.display = showAns ? '' : 'none'; };
      let showAns = false;
      el.append(card(h('h3', null, 'Flash một tấm composite'), h('p', { class: 'dim' }, 'Ba tách lớp A, B, C ở ba độ sâu khác nhau. Kéo thời gian, ghi lại lúc mỗi điểm nóng hiện rõ nhất, rồi đoán thứ tự độ sâu.'), cv,
        slider('Thời gian sau flash', 0.1, 30, 0.1, t, 's', v => { t = v; draw(); }), o, h('button', { class: 'btn sm ghost', onclick: () => { showAns = !showAns; draw(); } }, 'Đáp án'))); setTimeout(draw);
    },

    /* ---- Điều kiện VT ---- */
    vt(el) {
      let d = 800, a = 20, lx = 600; const o = out();
      const draw = () => { const c = [[d <= 600, `Khoảng cách mắt ${d} mm ≤ 600 mm`], [a >= 30, `Góc nhìn ${a}° ≥ 30°`], [lx >= 1000, `Độ rọi ${lx} lx ≥ 1000 lx`]]; o.innerHTML = '';
        c.forEach(([g, t]) => o.append(h('div', { class: g ? 'ok' : 'bad' }, (g ? '✓ ' : '✗ ') + t))); const all = c.every(x => x[0]);
        o.append(h('div', { class: 'callout ' + (all ? 'ok' : 'bad') }, all ? 'Đạt điều kiện quan sát trực tiếp (ASME V T-952).' : 'Chưa đạt: điều chỉnh, hoặc dùng gương, kính lúp, ống soi đã chứng minh độ phân giải.')); };
      el.append(card(h('h3', null, 'Bạn có đang nhìn đúng cách?'), slider('Khoảng cách mắt – bề mặt', 100, 1500, 50, d, 'mm', v => { d = v; draw(); }), slider('Góc nhìn so với bề mặt', 5, 90, 5, a, '°', v => { a = v; draw(); }), slider('Độ rọi', 100, 2000, 50, lx, 'lx', v => { lx = v; draw(); }), o)); setTimeout(draw);
    },

    /* ---- Động học xung theo loại khuyết tật ---- */
    echodyn(el) {
      const T = { crack: ['Nứt', 'nhiều đỉnh, chân rộng, lởm chởm; đổi mạnh khi xoay đầu dò', 40, 6], lof: ['Không ngấu vách', 'một đỉnh sắc, rất cao khi chùm vuông góc vách; rơi nhanh khi lệch góc', 95, 10], ip: ['Không thấu chân', 'cao ở độ sâu ≈ T, thấy từ cả hai phía; lệch nhẹ khỏi tâm', 80, 5],
        slag: ['Ngậm xỉ', 'biên độ vừa, vài đỉnh; ít phụ thuộc hướng', 45, 1.5], pore: ['Rỗ khí', 'các xung nhỏ, thấp, nhấp nháy khi dời đầu dò', 22, 0.5], geom: ['Gờ chân (hình học)', 'độ sâu đúng bằng T, chạy liên tục dọc mối hàn; không phải khuyết tật', 60, 2] };
      let k = 'crack', skew = 0, t = 0, raf = 0; const top = h('canvas', { class: 'screen' }), bot = h('canvas', { class: 'screen' }), o = out();
      const amp = (type, x, sk) => { const d = T[type], dir = Math.pow(Math.cos(sk * Math.PI / 180), d[3]); const base = d[2] * dir;
        if (type === 'crack') return base * Math.max(0, Math.exp(-x * x / 60) * (0.75 + 0.25 * Math.sin(x * 1.9) * Math.sin(x * 0.7)));
        if (type === 'lof') return base * Math.exp(-x * x / 18);
        if (type === 'ip' || type === 'geom') return base * (Math.abs(x) < 14 ? 1 - 0.1 * Math.abs(Math.sin(x)) : Math.exp(-((Math.abs(x) - 14) ** 2) / 4));
        if (type === 'slag') return base * Math.exp(-x * x / 40) * (0.8 + 0.2 * Math.sin(x * 1.3));
        return base * Math.exp(-x * x / 30) * (0.5 + 0.5 * Math.abs(Math.sin(x * 2.7)));
      };
      const draw = () => { if (!top.isConnected) return cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); t += 0.016; const x = 16 * Math.sin(t * 0.7);
        { const { ctx, W, H } = fitCanvas(top, 150); ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); const X = mm => 20 + (W - 30) * mm / 100, Y = v => H - 14 - (H - 24) * Math.min(1.05, v / 100);
          ctx.strokeStyle = '#123821'; for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(X(i * 10), 6); ctx.lineTo(X(i * 10), H - 14); ctx.stroke(); }
          const a = amp(k, x, skew), pos = k === 'ip' || k === 'geom' ? 50 : 42; ctx.strokeStyle = '#7dff9b'; ctx.lineWidth = 1.2; ctx.beginPath();
          for (let i = 0; i <= W - 30; i++) { const mm = 100 * i / (W - 30); let v = mm < 3 ? 100 : 2 + Math.random() * 3;
            if (k === 'crack') { for (const [o2, w] of [[-2.2, .7], [-1, 1], [0.4, .85], [1.8, .6]]) v += a * w * Math.exp(-((mm - pos - o2) ** 2) / 0.35); }
            else if (k === 'slag') { for (const [o2, w] of [[-1.2, .8], [0, 1], [1.3, .7]]) v += a * w * Math.exp(-((mm - pos - o2) ** 2) / 0.5); }
            else if (k === 'pore') { for (const [o2, w] of [[-1.5, .6], [0, 1], [1.6, .7]]) v += a * w * (0.6 + 0.4 * Math.sin(t * 9 + o2 * 3)) * Math.exp(-((mm - pos - o2) ** 2) / 0.4); }
            else v += a * Math.exp(-((mm - pos) ** 2) / 0.8);
            i ? ctx.lineTo(X(mm), Y(v)) : ctx.moveTo(X(mm), Y(v)); } ctx.stroke(); ctx.fillStyle = '#9fb0bc'; ctx.font = '11px "Be Vietnam Pro"'; ctx.fillText('A-scan tại vị trí đầu dò hiện tại', 24, 16); }
        { const { ctx, W, H } = fitCanvas(bot, 120); ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); const X = xx => 20 + (W - 30) * (xx + 20) / 40, Y = v => H - 14 - (H - 24) * Math.min(1.05, v / 100);
          ctx.strokeStyle = 'rgba(255,93,93,.6)'; ctx.beginPath(); ctx.moveTo(20, Y(50)); ctx.lineTo(W - 10, Y(50)); ctx.stroke();
          ctx.strokeStyle = '#ffc531'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let xx = -20; xx <= 20; xx += 0.2) { const v = amp(k, xx, skew); xx === -20 ? ctx.moveTo(X(xx), Y(v)) : ctx.lineTo(X(xx), Y(v)); } ctx.stroke();
          ctx.fillStyle = '#43c6f0'; ctx.beginPath(); ctx.arc(X(x), Y(amp(k, x, skew)), 4, 0, 7); ctx.fill();
          ctx.fillStyle = '#9fb0bc'; ctx.font = '11px "Be Vietnam Pro"'; ctx.fillText('Động học xung: biên độ đỉnh theo vị trí đầu dò (±20 mm)', 24, 14); }
      };
      const setK = v => { k = v; o.innerHTML = ''; o.append(h('div', { class: 'hi' }, `${T[v][0]}: ${T[v][1]}`), h('div', { class: 'dim' }, 'Xoay đầu dò để thấy khuyết tật phẳng (nứt, không ngấu) rơi biên độ nhanh hơn khuyết tật thể tích (xỉ, rỗ). Mô hình định tính.')); };
      el.append(card(h('h3', null, 'Nhận dạng khuyết tật qua động học xung'), h('div', { class: 'row' }, Object.entries(T).map(([kk, v]) => h('button', { class: 'btn sm ghost', onclick: () => setK(kk) }, v[0]))), top, bot,
        slider('Xoay đầu dò (skew)', 0, 40, 1, skew, '°', v => { skew = v; }), o)); setK('crack'); raf = requestAnimationFrame(draw);
    },

    /* ---- Tính suất liều, liều, bán kính hàng rào ---- */
    dosecalc(el) {
      let ci = 20, d = 20, coll = 10, th = 10, tmin = 90; const o = out();
      const calc = () => { const A = ci * 37, r = P.attenuate(P.doseRate(A, d) * 1000 / coll, th, P.IR192.hvlSteel), dose = r * tmin / 60;
        const rad = lim => Math.sqrt(P.IR192.gamma * 1000 * A * Math.pow(0.5, th / P.IR192.hvlSteel) / (coll * lim));
        const okB = r <= 7.5, okW = r <= 10; o.innerHTML = '';
        o.append(h('div', { class: 'formula' }, `Ḣ = 0.13 × ${fmt(A, 0)} / ${fmt(d, 1)}² ÷ ${coll} × 0.5^(${th}/12.7) × 1000 = ${fmt(r, 2)} µSv/h`),
          h('div', { class: 'grid g3' },
            h('div', { class: 'card', style: 'margin:0' }, h('div', { class: 'dim' }, 'Suất liều tại điểm'), h('div', { class: 'big ' + (okB ? 'ok' : okW ? 'hi' : 'bad'), style: 'font-size:1.6rem' }, `${fmt(r, 1)} µSv/h`),
              h('div', { class: okB ? 'ok' : 'bad' }, okB ? '✓ ≤ 7.5: đặt được hàng rào' : '✗ > 7.5: phải ở trong rào'), h('div', { class: okW ? 'ok' : 'bad' }, okW ? '✓ ≤ 10: đứng điều khiển được' : '✗ > 10: không đứng điều khiển')),
            h('div', { class: 'card', style: 'margin:0' }, h('div', { class: 'dim' }, `Liều nếu có mặt ${tmin} phút phát tia`), h('div', { class: 'big', style: 'font-size:1.6rem' }, `${fmt(dose, 1)} µSv`), h('div', { class: 'dim' }, `= ${fmt(dose / 1000, 3)} mSv · ${fmt(dose / 10, 1)} % giới hạn công chúng năm`)),
            h('div', { class: 'card', style: 'margin:0' }, h('div', { class: 'dim' }, 'Bán kính với cùng che chắn'), h('div', { class: 'mono' }, `7.5 µSv/h: ${fmt(rad(7.5), 1)} m`), h('div', { class: 'mono' }, `10 µSv/h: ${fmt(rad(10), 1)} m`), h('div', { class: 'dim' }, 'Nguồn điểm, chùm hẹp, chưa tính tích lũy và tán xạ.'))),
          h('p', { class: 'dim', style: 'font-size:.85rem' }, 'Thử: 20 Ci, ống chuẩn trực ÷10, không vách → bán kính 7.5 µSv/h khoảng 36 m; thêm vách thép 10 mm → khoảng 27 m; 20 mm → khoảng 21 m.')); };
      const sel2 = (lab, opts, v, on) => h('div', { class: 'sl' }, h('span', null, lab), sel(opts, String(v), x => { on(+x); calc(); }), h('span'));
      el.append(card(h('h3', null, 'Máy tính an toàn bức xạ Ir-192'), slider('Hoạt độ', 1, 100, 0.5, ci, 'Ci', v => { ci = v; calc(); }), slider('Khoảng cách', 1, 80, 0.5, d, 'm', v => { d = v; calc(); }),
        sel2('Ống chuẩn trực', [['1', 'Không'], ['10', 'Giảm 10 lần'], ['16', 'Giảm 16 lần']], coll, v => coll = v), slider('Vách thép', 0, 60, 1, th, 'mm', v => { th = v; calc(); }), slider('Thời gian phát tia', 1, 240, 1, tmin, 'phút', v => { tmin = v; calc(); }), o)); setTimeout(calc);
    },

    /* ---- Sắp xếp quy trình PT ---- */
    ptorder(el) {
      const steps = ['Làm sạch trước và làm khô', 'Phủ chất thấm, chờ ngấm', 'Loại bỏ chất thấm thừa', 'Phủ lớp hiện hình mỏng, đều', 'Chờ thời gian hiện hình', 'Quan sát dưới ánh sáng phù hợp, đánh giá', 'Làm sạch sau kiểm tra'];
      const box = h('div'), done = h('ol'); let next = 0, errs = 0;
      const render = () => { box.innerHTML = ''; steps.map((s, i) => ({ s, i })).filter(x => x.i >= next).sort(() => Math.random() - 0.5).forEach(({ s, i }) => box.append(h('button', { class: 'opt', onclick: () => {
        if (i === next) { done.append(h('li', null, s)); next++; if (next === steps.length) { box.innerHTML = ''; box.append(h('div', { class: 'callout ok' }, `Hoàn chỉnh quy trình với ${errs} lần chọn sai.`)); } else render(); }
        else { errs++; toast('Chưa đúng thứ tự', 'bad'); } } }, s))); };
      el.append(card(h('h3', null, 'Xếp đúng thứ tự quy trình PT'), h('p', { class: 'dim' }, 'Chọn bước tiếp theo.'), done, box)); render();
    }
  };
  root.SIMS = SIMS;
})(this);
