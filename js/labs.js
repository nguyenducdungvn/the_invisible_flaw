/* labs.js — “Phòng thí nghiệm 60 giây”: mỗi phòng có mô phỏng kéo-thả và 2 câu dự đoán. Đúng ngay lần đầu = trọn điểm. */
(function (root) {
  'use strict';
  const { h, fmt, parseNum, slider, fitCanvas, toast } = root.Game; const P = root.Physics;

  function challenges(list, done, btn) {
    let i = 0, pts = 0; const box = h('div', { class: 'card' });
    const next = () => {
      box.innerHTML = '';
      if (i >= list.length) { const sc = pts / list.length; box.append(h('h3', null, `Kết quả dự đoán: ${Math.round(sc * 100)} %`), h('p', { class: 'dim' }, 'Thẻ công thức đã vào sổ tay. Bạn có thể mở “Sổ tay” trên thanh trên cùng bất cứ lúc nào.'), h('button', { class: 'btn', onclick: () => done(sc) }, btn || 'Ra hiện trường')); return; }
      const q = list[i]; let tries = 0; const fb = h('div');
      box.append(h('div', { class: 'row' }, h('span', { class: 'chip hi' }, `Dự đoán ${i + 1}/${list.length}`), h('span', { class: 'dim' }, 'Tính trước, mô phỏng phía trên dùng để kiểm chứng')), h('p', { class: 'serif', style: 'font-size:1.05rem' }, q.q));
      const ok = (good, expl) => {
        tries++;
        if (good) { if (tries === 1) pts++; fb.innerHTML = ''; fb.append(h('div', { class: 'callout ok' }, tries === 1 ? 'Chính xác ngay lần đầu! ' : 'Đúng. ', expl)); setTimeout(() => { i++; next(); }, 1700); }
        else if (tries >= 2) { fb.innerHTML = ''; fb.append(h('div', { class: 'callout bad' }, 'Chưa đúng. ', expl, h('div', null, h('button', { class: 'btn sm', style: 'margin-top:6px', onclick: () => { i++; next(); } }, 'Tiếp')))); }
        else { fb.innerHTML = ''; fb.append(h('div', { class: 'callout bad' }, 'Chưa đúng, thử lại một lần (dùng mô phỏng để kiểm tra).')); }
      };
      if (q.num != null) {
        const inp = h('input', { class: 'f', style: 'max-width:180px', inputmode: 'decimal', placeholder: q.unit });
        const chk = () => { const v = parseNum(inp.value); if (isNaN(v)) return toast('Nhập một số'); const err = q.abs ? Math.abs(v - q.num) <= q.abs : Math.abs(v - q.num) <= Math.abs(q.num) * (q.rel || 0.05); ok(err, q.e); };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') chk(); });
        box.append(h('div', { class: 'row' }, inp, h('span', null, q.unit), h('button', { class: 'btn sm', onclick: chk }, 'Chốt')));
      } else {
        q.o.map((t, k) => ({ t, k })).sort(() => Math.random() - 0.5).forEach(({ t, k }) => box.append(h('button', { class: 'opt', onclick: () => ok(k === 0, q.e) }, t)));
      }
      box.append(fb);
    };
    next(); return box;
  }
  function labHead(title, sub, f) { return h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'chip hi' }, 'Phòng thí nghiệm 60 giây'), h('h2', { style: 'margin:0' }, title)), h('p', { class: 'dim' }, sub), f ? h('div', { class: 'formula' }, f) : null); }

  const LABS = {
    capillary(el, done, opt) {
      let th = 10, w = 20, eta = 5; const cv = h('canvas'); const read = h('div', { class: 'mono' });
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 230); ctx.clearRect(0, 0, W, H);
        const hm = P.capillaryRiseSlit(0.03, th, 900, w * 1e-6); const t = P.washburnTimeSlit(eta * 1e-3, 2e-3, 0.03, w * 1e-6, th);
        const base = H - 30, gapPx = Math.max(4, Math.min(60, w * 1.2)), cx = W / 2;
        ctx.fillStyle = '#2a8fd6'; ctx.fillRect(40, base, W - 80, 24);
        ctx.fillStyle = '#5f7380'; ctx.fillRect(cx - gapPx / 2 - 22, 18, 22, base - 8); ctx.fillRect(cx + gapPx / 2, 18, 22, base - 8);
        const rise = hm > 0 ? Math.min(base - 22, Math.log10(1 + hm * 1000) * 60) : -12;
        ctx.fillStyle = 'rgba(255,60,60,.85)'; ctx.fillRect(cx - gapPx / 2, base - Math.max(0, rise), gapPx, Math.max(0, rise) + 4);
        ctx.fillStyle = '#e8eef2'; ctx.font = '13px "Be Vietnam Pro"';
        ctx.fillText(P.wets(th) ? 'Chất thấm ướt bề mặt (θ < 90°): dâng vào khe' : 'θ ≥ 90°: chất lỏng KHÔNG thấm, bị đẩy ra khỏi khe', 12, 14);
        ctx.fillText('khe ' + fmt(w, 0) + ' µm (vẽ phóng đại)', cx + gapPx / 2 + 30, base - 10);
        read.innerHTML = ''; read.append(h('div', null, `h = 2γcosθ/(ρgw) = ${hm > 0 ? fmt(hm * 1000, 1) + ' mm' : 'âm (không dâng)'}`), h('div', null, `Thời gian thấm sâu 2 mm (Washburn): ${isFinite(t) ? fmt(t, 3) + ' s' : '∞'}`));
      };
      el.append(labHead('Mao dẫn: vì sao chất thấm “chui” được vào vết nứt?', 'Kéo các thanh trượt. Để ý: độ nhớt làm thay đổi THỜI GIAN thấm, nhưng không đổi chiều cao cân bằng. Đây là lý do ASME V quy định thời gian ngấm tối thiểu thay vì “đổ nhiều cho chắc”.', 'h = 2·γ·cosθ / (ρ·g·w)     ·     t = 3·η·L² / (γ·w·cosθ)'),
        h('div', { class: 'card' }, cv, slider('Góc tiếp xúc θ', 0, 120, 1, th, '°', v => { th = v; draw(); }), slider('Độ rộng khe w', 1, 60, 1, w, 'µm', v => { w = v; draw(); }), slider('Độ nhớt η', 1, 20, 1, eta, 'mPa·s', v => { eta = v; draw(); }), read),
        challenges([
          { q: 'Chất thấm có γ = 0,030 N/m, θ = 10°, ρ = 900 kg/m³. Khe nứt rộng 20 µm. Chiều cao mao dẫn cân bằng h là bao nhiêu milimét?', num: P.capillaryRiseSlit(0.03, 10, 900, 20e-6) * 1000, rel: 0.05, unit: 'mm', e: `h = 2·0,03·cos10° / (900·9,81·20·10⁻⁶) ≈ ${fmt(P.capillaryRiseSlit(0.03, 10, 900, 20e-6) * 1000, 0)} mm. Lực mao dẫn rất mạnh so với kích thước vết nứt.` },
          { q: 'Đổi sang chất thấm có độ nhớt gấp đôi (các thông số khác giữ nguyên). Điều gì xảy ra?', o: ['Chiều cao cân bằng không đổi, thời gian thấm gấp đôi', 'Chiều cao giảm một nửa, thời gian không đổi', 'Cả chiều cao và thời gian đều giảm một nửa', 'Không thấm được nữa'], e: 'h không có η; Washburn cho t tỉ lệ thuận với η. Độ nhớt chỉ quyết định tốc độ (theo NDE-Ed.org: độ nhớt ít ảnh hưởng tới khả năng thấm, chủ yếu tới tốc độ).' }
        ], done, opt && opt.btn));
      setTimeout(draw);
    },

    magnet(el, done, opt) {
      let fd = 0, cd = 30; const cv = h('canvas'); const read = h('div', { class: 'mono' });
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 240); ctx.clearRect(0, 0, W, H); const cx = W / 2, cy = H / 2;
        const fr = fd * Math.PI / 180, cr = cd * Math.PI / 180;
        ctx.strokeStyle = 'rgba(67,198,240,.55)'; ctx.lineWidth = 1;
        for (let k = -8; k <= 8; k++) { const ox = -Math.sin(fr) * k * 16, oy = Math.cos(fr) * k * 16; ctx.beginPath(); ctx.moveTo(cx + ox - Math.cos(fr) * 400, cy + oy - Math.sin(fr) * 400); ctx.lineTo(cx + ox + Math.cos(fr) * 400, cy + oy + Math.sin(fr) * 400); ctx.stroke(); }
        const k = P.leakageFactor(fd, cd);
        ctx.strokeStyle = '#ffc531'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - Math.cos(cr) * 70, cy - Math.sin(cr) * 70); ctx.lineTo(cx + Math.cos(cr) * 70, cy + Math.sin(cr) * 70); ctx.stroke();
        ctx.fillStyle = `rgba(20,20,20,${0.15 + 0.85 * k})`; for (let j = 0; j < 140 * k; j++) { const s = (Math.random() * 2 - 1) * 70; ctx.fillRect(cx + Math.cos(cr) * s + (Math.random() - .5) * 8 * k, cy + Math.sin(cr) * s + (Math.random() - .5) * 8 * k, 2, 2); }
        ctx.fillStyle = '#e8eef2'; ctx.font = '13px "Be Vietnam Pro"'; ctx.fillText('Đường sức từ (xanh) · vết nứt (vàng) · bột từ tụ lại khi có từ thông rò', 10, 16);
        read.innerHTML = ''; read.append(h('div', { class: k >= P.MT_DETECT ? 'ok' : 'bad' }, `Góc lệch Δ = ${fmt(Math.abs(((fd - cd) % 180 + 180) % 180), 0)}° · |sinΔ| = ${fmt(k, 2)} → ${k >= P.MT_DETECT ? 'chỉ thị rõ' : 'chỉ thị yếu/không có'}`));
      };
      el.append(labHead('Từ thông rò: vết nứt phải “cắt ngang” đường sức', 'Xoay hướng từ trường và vết nứt. Bột từ chỉ tụ lại khi đường sức bị vết nứt chặn ngang; song song thì gần như không có rò.', 'Φ_rò ∝ |sin(α_trường − α_nứt)| · tốt nhất khi vuông góc, chấp nhận được khi lệch ≥ 45°'),
        h('div', { class: 'card' }, cv, slider('Hướng từ trường', 0, 180, 5, fd, '°', v => { fd = v; draw(); }), slider('Hướng vết nứt', 0, 180, 5, cd, '°', v => { cd = v; draw(); }), read),
        challenges([
          { q: 'Mối hàn nằm ngang (0°). Có một vết nứt chéo 30° so với trục mối hàn. Ách từ đặt hai chân DỌC theo mối hàn tạo từ trường 0°; đặt CẮT NGANG mối hàn tạo từ trường 90°. Cách nào phát hiện tốt vết nứt?', o: ['Chỉ cách đặt cắt ngang (từ trường 90°)', 'Chỉ cách đặt dọc (từ trường 0°)', 'Cả hai như nhau', 'Không cách nào'], e: 'Từ trường 0° lệch 30° → |sin30°| = 0,5 < 0,71; từ trường 90° lệch 60° → 0,87. Vì không biết trước hướng nứt, phải kiểm tra hai lần với đường sức gần vuông góc nhau.' },
          { q: 'Vì sao quy trình MT (ASME V Điều 7) yêu cầu mỗi vùng phải kiểm tra ít nhất hai lần với đường sức gần vuông góc nhau?', o: ['Để vết nứt theo mọi hướng đều bị cắt ngang ít nhất một lần', 'Để bột từ bám đều hơn', 'Để khử từ dư', 'Để tăng gấp đôi cường độ từ trường'], e: 'Một hướng từ hóa chỉ “thấy” vết nứt lệch ≥ 45° so với nó; hai hướng vuông góc phủ được mọi hướng.' }
        ], done, opt && opt.btn));
      setTimeout(draw);
    },

    snell(el, done, opt) {
      let t1 = 40; const cv = h('canvas'); const read = h('div', { class: 'mono' }); const m1 = P.MAT.perspex, m2 = P.MAT.steel;
      const c1 = P.criticalAngle(m1.vL, m2.vL), c2 = P.criticalAngle(m1.vL, m2.vS);
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 260); ctx.clearRect(0, 0, W, H); const cx = W / 2, cy = 120;
        ctx.fillStyle = '#23323d'; ctx.fillRect(0, 0, W, cy); ctx.fillStyle = '#3a434b'; ctx.fillRect(0, cy, W, H - cy);
        ctx.fillStyle = '#9fb0bc'; ctx.font = '13px "Be Vietnam Pro"'; ctx.fillText('Nêm Perspex · vL = 2730 m/s', 10, 18); ctx.fillText('Thép · vL = 5920, vS = 3240 m/s', 10, H - 10);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = '#6c7f8c'; ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, H - 20); ctx.stroke(); ctx.setLineDash([]);
        const ray = (ang, len, col, down, lab) => { const r = ang * Math.PI / 180; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); const ex = cx + Math.sin(r) * len * (down ? 1 : -1), ey = cy + Math.cos(r) * len * (down ? 1 : -1); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = col; ctx.fillText(lab, ex + 4, ey + (down ? 10 : -4)); };
        ray(t1, 110, '#ffc531', false, `tới ${fmt(t1, 1)}°`);
        const L = P.snell(t1, m1.vL, m2.vL), S = P.snell(t1, m1.vL, m2.vS);
        if (L != null) ray(L, 120, '#43c6f0', true, `L ${fmt(L, 1)}°`);
        if (S != null) ray(S, 120, '#3ddc97', true, `S ${fmt(S, 1)}°`);
        read.innerHTML = '';
        read.append(h('div', null, `Sóng dọc: ${L == null ? 'không còn (vượt góc tới hạn I)' : fmt(L, 1) + '°'} · Sóng ngang: ${S == null ? 'không còn (vượt góc tới hạn II → sóng mặt)' : fmt(S, 1) + '°'}`),
          h('div', { class: 'dim' }, `Góc tới hạn I = ${fmt(c1, 1)}° · góc tới hạn II = ${fmt(c2, 1)}°. Đầu dò góc làm việc giữa hai góc này để trong thép chỉ còn sóng ngang.`));
      };
      el.append(labHead('Định luật Snell: chế tạo một đầu dò 60°', 'Đầu dò góc gồm biến tử gắn trên nêm Perspex. Kéo góc tới: tìm vùng chỉ còn sóng ngang trong thép, đó là vùng làm việc của đầu dò góc.', 'sinθ₁ / v₁ = sinθ₂ / v₂'),
        h('div', { class: 'card' }, cv, slider('Góc tới trong nêm', 0, 80, 0.5, t1, '°', v => { t1 = v; draw(); }), read),
        challenges([
          { q: 'Cần góc khúc xạ sóng ngang 60° trong thép (vS = 3240 m/s) từ nêm Perspex (vL = 2730 m/s). Góc nêm (góc tới) phải là bao nhiêu độ?', num: P.incidentFor(60, m1.vL, m2.vS), abs: 0.6, unit: '°', e: `sinθ₁ = sin60° × 2730/3240 → θ₁ ≈ ${fmt(P.incidentFor(60, m1.vL, m2.vS), 1)}°.` },
          { q: 'Góc tới hạn thứ nhất (sóng dọc trong thép biến mất) giữa Perspex và thép là bao nhiêu độ?', num: c1, abs: 0.6, unit: '°', e: `θc1 = arcsin(2730/5920) ≈ ${fmt(c1, 1)}°.` }
        ], done, opt && opt.btn));
      setTimeout(draw);
    },

    radiation(el, done, opt) {
      let d = 10, pb = 0; const A = 800; const cv = h('canvas'); const read = h('div', { class: 'mono' });
      const draw = () => {
        const { ctx, W, H } = fitCanvas(cv, 220); ctx.clearRect(0, 0, W, H);
        const rate = P.attenuate(P.doseRate(A, d) * 1000, pb, P.IR192.hvlLead);
        for (let r = 200; r > 0; r -= 20) { ctx.fillStyle = `rgba(255,${120 + r / 2},40,${0.05 + (200 - r) / 900})`; ctx.beginPath(); ctx.arc(40, H / 2, r * 2, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#ffc531'; ctx.beginPath(); ctx.arc(40, H / 2, 7, 0, 7); ctx.fill();
        const x = 40 + Math.min(W - 80, d * (W - 80) / 40);
        if (pb > 0) { ctx.fillStyle = '#7b8a96'; ctx.fillRect(x - 18 - pb, H / 2 - 40, pb + 4, 80); }
        ctx.fillStyle = rate > 20 ? '#ff5d5d' : '#3ddc97'; ctx.fillRect(x - 8, H / 2 - 14, 16, 28);
        ctx.fillStyle = '#e8eef2'; ctx.font = '13px "Be Vietnam Pro"'; ctx.fillText(`Ir-192 · ${A} GBq`, 14, 18); ctx.fillText('máy đo liều', x - 30, H / 2 + 32);
        read.innerHTML = ''; read.append(h('div', { class: rate > 20 ? 'bad' : 'ok' }, `Suất liều tại ${fmt(d, 1)} m sau ${fmt(pb, 0)} mm chì: ${fmt(rate, 1)} µSv/h` + (rate > 20 ? ' (trên 20 µSv/h)' : '')));
      };
      el.append(labHead('Bức xạ: khoảng cách, che chắn và thời gian', 'Gấp đôi khoảng cách thì suất liều còn 1/4. Mỗi lớp giảm một nửa (HVL) thì còn 1/2. Đây là hai công cụ chính để vẽ rào an toàn khi chụp hiện trường.', 'Ḣ = Γ·A/d² · I = I₀·0,5^(x/HVL) · A = A₀·0,5^(t/T½)'),
        h('div', { class: 'card' }, cv, slider('Khoảng cách', 1, 40, 0.5, d, 'm', v => { d = v; draw(); }), slider('Chì che chắn', 0, 20, 1, pb, 'mm', v => { pb = v; draw(); }), read,
          h('p', { class: 'dim', style: 'font-size:.85rem' }, 'Γ(Ir-192) ≈ 0,13 mSv·m²/(h·GBq), HVL chì ≈ 4,8 mm: giá trị tham khảo cho game [CẦN KIỂM CHỨNG theo chứng chỉ nguồn và quy trình an toàn bức xạ của đơn vị].')),
        challenges([
          { q: `Nguồn Ir-192 hoạt độ 800 GBq, không che chắn. Suất liều ở 10 m là bao nhiêu µSv/h? (Γ = 0,13 mSv·m²/(h·GBq))`, num: P.doseRate(800, 10) * 1000, rel: 0.05, unit: 'µSv/h', e: `0,13 × 800 / 10² = 1,04 mSv/h = ${fmt(P.doseRate(800, 10) * 1000, 0)} µSv/h.` },
          { q: 'Nguồn Ir-192 có 1000 GBq. Sau 147,7 ngày (hai chu kỳ bán rã) còn bao nhiêu GBq?', num: P.decay(1000, 147.66), rel: 0.03, unit: 'GBq', e: 'Hai chu kỳ bán rã: 1000 → 500 → 250 GBq. Nguồn yếu đi thì thời gian chiếu phải tăng.' }
        ], done, opt && opt.btn));
      setTimeout(draw);
    }
  };
  root.LABS = LABS; root.challenges = challenges;
})(this);
