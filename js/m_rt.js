/* m_rt.js — Chụp bức xạ gamma Ir-192 ở hiện trường. Căn cứ: ASME V Điều 2 (T-277 vị trí IQI, T-282 độ đen phim), ASME VIII UW-51.
 * Γ, HVL, giới hạn rào và biểu đồ phơi sáng là dữ liệu của màn chơi, không thay quy trình an toàn bức xạ của đơn vị.
 */
(function (root) {
  'use strict';
  const { h, fmt, toast, addTime, safetyHit, spend, METHODS, parseNum, slider } = root.Game; const P = root.Physics;

  METHODS.RT = {
    prep(el, M, next) {
      const s = M.lvl.source, A = P.decay(s.A0, s.days), dReq = P.barrierDistance(A, s.limit, s.shield);
      const q = M.q = { A, dReq, rope: 0, iqi: 'src', density: 0, scores: [] };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị chụp: an toàn trước, phim sau'),
        h('dl', { class: 'kv' }, h('dt', null, 'Nguồn'), h('dd', null, `Ir-192, ${s.A0} GBq ngày đo, cách nay ${s.days} ngày, kích thước tiêu điểm ${s.size} mm`),
          h('dt', null, 'Giới hạn'), h('dd', null, `hàng rào ≤ ${fmt(s.limit, 1)} µSv/h · vị trí thợ chụp ≤ ${s.opLimit} µSv/h · ống chuẩn trực giảm ${s.shield} lần`),
          h('dt', null, 'Biểu đồ phơi sáng'), h('dd', null, `Thép ${M.lvl.t} mm, phim loại mịn: E = ${s.E1m} GBq·h quy về SFD 1 m để đạt độ đen ~2,6 (dữ liệu màn)`),
          h('dt', null, 'Bố trí'), h('dd', null, 'SFD = 0,5 m'))));
      const stage = h('div'); el.append(stage);
      const step = (title, body) => { stage.innerHTML = ''; stage.append(h('div', { class: 'card' }, h('h3', null, title), body)); };

      // 1. liều kế
      step('1. Thiết bị an toàn cá nhân', h('div', null, ...[
        { l: 'Liều kế cá nhân, liều kế đọc trực tiếp có báo động, máy đo suất liều đã thử pin và nguồn kiểm', ok: true },
        { l: 'Liều kế để quên ở xe, ca này ngắn thôi', lure: 'Đỡ mất 10 phút quay lại xe', bad: true }
      ].sort(() => Math.random() - 0.5).map(o => h('button', { class: 'opt', onclick: () => { if (o.bad) safetyHit('Làm việc với nguồn phóng xạ không đeo liều kế'); else addTime(3, 'kiểm tra thiết bị'); q.scores.push(o.ok ? 1 : 0); s2(); } }, h('b', null, o.l), o.lure ? h('span', { class: 'lure' }, '· ' + o.lure) : null))));

      function s2() {
        const inp = h('input', { class: 'f', inputmode: 'decimal', style: 'max-width:180px' });
        step('2. Hoạt độ nguồn hôm nay', h('div', null, h('div', { class: 'formula' }, 'A = A₀ · 0,5^(t / 73,83 ngày)'), h('div', { class: 'row' }, inp, h('span', null, 'GBq'),
          h('button', { class: 'btn sm', onclick: () => { const v = parseNum(inp.value); if (isNaN(v)) return toast('Nhập số');
            const ok = Math.abs(v - A) <= A * 0.03; q.scores.push(ok ? 1 : 0); toast(ok ? `Đúng: ${fmt(A, 0)} GBq` : `Chưa đúng. Hoạt độ hôm nay ≈ ${fmt(A, 0)} GBq`, ok ? 'ok' : 'bad'); setTimeout(s3, 900); } }, 'Chốt'))));
      }
      function s3() {
        let d = 10; const out = h('div', { class: 'dim' });
        const sl = slider('Bán kính rào', 5, 40, 0.5, d, 'm', v => { d = v; out.textContent = `Chu vi rào ≈ ${fmt(2 * Math.PI * v, 0)} m dây và biển báo. Rào càng rộng càng tốn công dựng (+${fmt(v * 0.6, 0)} phút).`; });
        step('3. Dựng hàng rào (≤ 7,5 µSv/h)', h('div', null, h('div', { class: 'formula' }, 'd = √(Γ·A / (k·Ḣ_giới hạn))   ·   Γ = 0,13 mSv·m²/(h·GBq) = 130 µSv·m²/(h·GBq)'),
          h('p', { class: 'dim' }, 'Tự tính bán kính rồi đặt rào. Máy đo suất liều chỉ kiểm chứng được khi đã bắt đầu chiếu.'), sl, out,
          h('button', { class: 'btn', onclick: () => { q.rope = d; addTime(Math.round(d * 0.6), 'dựng rào'); s3b(); } }, 'Dựng rào ở bán kính này')));
      }
      function s3b() {
        // Vị trí thợ chụp đứng quay nguồn: suất liều ≤ opLimit. Người chơi tự tính, không hiện suất liều trên nút.
        const OPTS = [{ l: 'Đứng ở đầu cáp điều khiển 7,6 m, ngoài trời', d: 7.6, w: 0 }, { l: 'Dùng cáp 15 m, đứng ngoài trời', d: 15, w: 0, lure: 'Xa gấp đôi là đủ' },
          { l: 'Dùng cáp 15 m, đứng sau vách thép 25 mm của nhà bơm', d: 15, w: s.wall }, { l: 'Cáp 7,6 m, đứng sau vách thép 25 mm', d: 7.6, w: s.wall, lure: 'Có che chắn rồi' }];
        const rate = o => P.attenuate(P.doseRate(A, o.d) * 1000 / s.shield, o.w, P.IR192.hvlSteel);
        step('4. Chọn vị trí đứng quay nguồn', h('div', null, h('div', { class: 'formula' }, `Ḣ = Γ·A/(k·d²) × 0,5^(x/HVL) · HVL thép = ${fmt(P.IR192.hvlSteel, 1)} mm · cần ≤ ${s.opLimit} µSv/h`),
          h('p', { class: 'dim' }, 'Tự tính suất liều tại từng vị trí trước khi chọn. Ở vị trí này bạn sẽ đứng suốt thời gian chiếu.'),
          ...OPTS.slice().sort(() => Math.random() - 0.5).map(o => h('button', { class: 'opt', onclick: () => {
            const r = rate(o); q.op = { ...o, r }; addTime(2, 'bố trí cáp điều khiển');
            if (r > s.opLimit) { safetyHit(`Vị trí thợ chụp ≈ ${fmt(r, 1)} µSv/h, vượt ${s.opLimit} µSv/h`); q.scores.push(0); toast('Chọn lại vị trí', 'bad'); return; }
            q.scores.push(1); toast(`Đạt: ≈ ${fmt(r, 1)} µSv/h tại vị trí đứng`, 'ok'); s4(); } }, h('b', null, o.l), o.lure ? h('span', { class: 'lure' }, '· ' + o.lure) : null))));
      }
      function s4() {
        step('5. Đặt chỉ thị chất lượng ảnh (IQI)', h('div', null, ...[
          { l: 'IQI dây đặt phía nguồn, ngang qua mối hàn', k: 'src', ok: true },
          { l: 'IQI đặt phía phim, trong lòng ống, không kèm chữ “F”', k: 'film', lure: 'Dễ đặt hơn, khỏi trèo giá ống' }
        ].sort(() => Math.random() - 0.5).map(o => h('button', { class: 'opt', onclick: () => { q.iqi = o.k; q.scores.push(o.ok ? 1 : 0); addTime(4, 'đặt IQI, chữ chì, phim'); s5(); } }, h('b', null, o.l), o.lure ? h('span', { class: 'lure' }, '· ' + o.lure) : null))));
      }
      function s5() {
        const inp = h('input', { class: 'f', inputmode: 'decimal', style: 'max-width:180px' });
        step('6. Thời gian chiếu', h('div', null, h('div', { class: 'formula' }, 't = E₁ₘ · SFD² / A'), h('p', { class: 'dim' }, 'Phim đạt khi độ đen trong vùng quan tâm từ 2,0 đến 4,0 với nguồn gamma (ASME V T-282.1).'),
          h('div', { class: 'row' }, inp, h('span', null, 'phút'), h('button', { class: 'btn', onclick: () => { const v = parseNum(inp.value); if (!(v > 0)) return toast('Nhập thời gian'); expose(v); } }, 'Bắt đầu chiếu'))));
      }
      function expose(tmin) {
        const tReq = P.exposureMinutes(s.E1m, 0.5, A); const atRope = P.doseRate(A, q.rope) * 1000 / s.shield;
        let left = 8, intruder = M.rng() < 0.65 ? 3 + Math.floor(M.rng() * 3) : -1, stopped = false, iv;
        const meter = h('div', { class: 'big ' + (atRope > s.limit ? 'bad' : 'ok') }, `${fmt(atRope, 1)} µSv/h`);
        const alarm = h('div'); const cnt = h('span', { class: 'timer' });
        step('Đang chiếu', h('div', null, h('p', null, 'Máy đo suất liều ở mép rào:'), meter, cnt, alarm));
        if (atRope > s.limit) {
          alarm.append(h('div', { class: 'callout bad' }, `Máy đo réo: suất liều ở rào vượt ${s.limit} µSv/h!`,
            h('div', { class: 'row', style: 'margin-top:6px' }, h('button', { class: 'btn danger', onclick: () => { safetyHit(`Rào đặt ở ${fmt(q.rope, 1)} m, nhỏ hơn bán kính cần ${fmt(dReq, 1)} m`); addTime(15, 'thu nguồn, nới rào'); q.scores.push(0); s3(); } }, 'Thu nguồn, nới rào'))));
          setTimeout(() => { if (alarm.isConnected && !stopped) { stopped = true; safetyHit('Tiếp tục chiếu khi rào không đủ xa', true); } }, 6000);
          return;
        }
        q.scores.push(1);
        iv = setInterval(() => {
          if (!cnt.isConnected) return clearInterval(iv); left--; cnt.textContent = `Còn ${left} s (mô phỏng ${fmt(tmin, 1)} phút)`;
          if (left === intruder) {
            intruder = -1;
            let rx = 3; const ab = h('div', { class: 'callout bad' }, 'Một công nhân bảo trì đang đi thẳng về phía rào!', h('span', { class: 'timer' }, ''),
              h('div', { class: 'row', style: 'margin-top:6px' }, h('button', { class: 'btn danger', onclick: () => { rx = 99; ab.remove(); addTime(5, 'thu nguồn khẩn, nhắc người vào vùng'); toast('Đã thu nguồn kịp thời. Chiếu tiếp.', 'ok'); } }, 'THU NGUỒN KHẨN CẤP')));
            alarm.append(ab); const t2 = setInterval(() => { rx--; if (rx > 10) return clearInterval(t2); ab.querySelector('.timer').textContent = ` ${rx} s`; if (rx <= 0) { clearInterval(t2); ab.remove(); safetyHit('Để người không phận sự vào vùng kiểm soát khi nguồn đang mở'); } }, 1000);
            left += 2;
          }
          if (left <= 0) {
            clearInterval(iv); addTime(Math.round(tmin), 'chiếu');
            const opDose = q.op ? q.op.r * tmin / 60 : 0;
            step('Đã quay nguồn về: bước tiếp theo?', h('div', null, h('p', { class: 'serif' }, `Hết giờ chiếu, bạn đã quay tay quay đủ vòng. Liều ước tính tại vị trí đứng trong lần chiếu này ≈ ${fmt(opDose, 2)} µSv.`),
              ...[{ l: 'Tiến lại với máy đo trên tay, xác nhận suất liều tại projector và ống dẫn về mức bình thường rồi mới tới thay phim', ok: true },
                { l: 'Đã nghe tiếng “cạch” khóa nguồn, đi thẳng tới thay phim cho kịp tiến độ', lure: 'Tiết kiệm 2 phút mỗi phim' }].sort(() => Math.random() - 0.5).map(o => h('button', { class: 'opt', onclick: () => {
                if (!o.ok) { safetyHit('Không đo xác nhận nguồn đã về: đây là nguyên nhân của phần lớn tai nạn chụp bức xạ nghiêm trọng', true); return; }
                q.scores.push(1); addTime(12, 'đo xác nhận, thay và tráng phim'); spend(0.4, 'phim và hóa chất'); film(); } }, h('b', null, o.l), o.lure ? h('span', { class: 'lure' }, '· ' + o.lure) : null))));
          }
        }, 1000);
        function film() {
            q.density = P.filmDensity(tmin / tReq); const ok = q.density >= 2.0 && q.density <= 4.0;
            step('Phim đã tráng', h('div', null, h('p', null, 'Máy đo độ đen tại vùng mối hàn:'), h('div', { class: 'big ' + (ok ? 'ok' : 'bad') }, `D = ${fmt(q.density, 2)}`),
              ok ? h('p', { class: 'ok' }, q.iqi === 'src' ? 'Độ đen đạt, IQI thấy rõ dây yêu cầu.' : 'Độ đen đạt. Lưu ý: IQI phía phim mà không có chữ “F”.') : h('p', { class: 'bad' }, `Ngoài dải 2,0–4,0: phim không đạt, phải chụp lại. Thời gian cần ≈ ${fmt(tReq, 1)} phút.`),
              ok ? h('button', { class: 'btn', onclick: () => { q.scores.push(1); M.proc = q.scores.reduce((a, b) => a + b, 0) / q.scores.length * (q.iqi === 'src' ? 1 : 0.8); next(); } }, 'Đưa phim lên đèn đọc')
                : h('button', { class: 'btn', onclick: () => { q.scores.push(0); s5(); } }, 'Chụp lại')));
        }
      }
    },

    inspect(el, M, next) {
      const q = M.q, inds = M.inds, D = q.density; const contrast = Math.max(0.35, 1 - Math.abs(D - 2.8) / 2.5);
      const surf = root.Surface.view(el, {
        length: 180, band: 30, rulerColor: 'rgba(230,230,230,.8)', height: 230,
        head: h('div', null, h('h2', null, 'Đọc phim'), h('p', { class: 'dim' }, 'Vùng sáng ở giữa là mối hàn (dày hơn nên ít đen hơn). Kéo thước đo từng chỉ thị và phân loại. Nghi vết trên bề mặt phim thì “Soi đèn xiên” (+3 phút).')),
        drawBg(ctx, toPx, g, W, H) {
          const base = Math.max(10, 70 - D * 12); ctx.fillStyle = `rgb(${base},${base + 2},${base + 4})`; ctx.fillRect(0, 0, W, H);
          const [, y1] = toPx(0, -6), [, y2] = toPx(0, 6); const wv = base + 40 * contrast;
          const gr = ctx.createLinearGradient(0, y1, 0, y2); gr.addColorStop(0, `rgb(${base},${base},${base})`); gr.addColorStop(0.5, `rgb(${wv},${wv},${wv + 4})`); gr.addColorStop(1, `rgb(${base},${base},${base})`);
          ctx.fillStyle = gr; ctx.fillRect(0, y1 - 6, W, y2 - y1 + 12);
          for (let k = 0; k < 900; k++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1); }
          if (q.iqi === 'src') { ctx.strokeStyle = 'rgba(220,220,220,.5)'; for (let k = 0; k < 7; k++) { const [px, py] = toPx(8 + k * 1.4, -12); ctx.lineWidth = 2 - k * 0.22; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 70); ctx.stroke(); } }
          ctx.fillStyle = 'rgba(230,230,230,.7)'; ctx.font = '12px "Roboto Mono"'; const [lx, ly] = toPx(170, -13); ctx.fillText('W-112  A', lx - 30, ly);
        },
        drawInds(ctx, toPx) {
          const a = 0.35 + 0.5 * contrast;
          for (const i of inds) {
            const [px, py] = toPx(i.x, i.y); const [ax] = toPx(i.x - i.len / 2, 0), [bx] = toPx(i.x + i.len / 2, 0); const half = (bx - ax) / 2;
            ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.strokeStyle = ctx.fillStyle;
            if (i.kind === 'crack') { ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax, py); for (let s = ax; s <= bx; s += 4) ctx.lineTo(s, py + Math.sin(s * 1.7) * 2); ctx.stroke(); }
            else if (i.kind === 'slag') { ctx.beginPath(); ctx.ellipse(px, py, half, 2.6, 0.05, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(px + half * 0.4, py + 1, half * 0.4, 2, 0, 0, 7); ctx.fill(); }
            else if (i.kind === 'pore') { ctx.beginPath(); ctx.arc(px, py, half, 0, 7); ctx.fill(); }
            else { ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = 1.4; const br = (x, y, ang, len, d) => { if (d > 4) return; const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke(); br(ex, ey, ang - 0.5, len * 0.65, d + 1); br(ex, ey, ang + 0.45, len * 0.6, d + 1); }; br(ax, py, -0.25, half * 0.8, 0); }
          }
        },
        classes: [['crack', 'Nứt'], ['slag', 'Ngậm xỉ'], ['pore', 'Rỗ khí'], ['artifact', 'Khuyết tật phim']],
        verify: { label: 'Soi đèn xiên', fn: (m, rr) => { addTime(3, 'soi đèn xiên'); const p = root.Surface.match([m], inds)[0];
          if (p.i && p.i.kind === 'artifact') toast(`${m.label}: vết nằm trên lớp nhũ tương, hình cành cây → khuyết tật phim`, 'ok'); else if (p.i) toast(`${m.label}: không thấy trên bề mặt phim → ảnh của vật thể`, 'hi'); else toast('Không có gì ở đây'); rr(); } }
      });
      M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(8, 'đọc phim'); next(); } }, 'Xong, lập biên bản')));
    },

    report(el, M, finish) {
      root.Surface.report(el, M, {
        truth: i => ({ cls: i.kind, relevant: i.kind !== 'artifact', alt: [] }),
        crit: i => ({ type: i.kind, len: i.len, x: i.x }),
        name: i => root.TYPE[i.kind] || i.kind,
        label: c => ({ crack: 'Nứt', slag: 'Ngậm xỉ', pore: 'Rỗ khí', artifact: 'Khuyết tật phim' })[c] || '—',
        playerRelevant: m => m.cls !== 'artifact', playerType: c => c,
        extraNotes: M => M.q.iqi !== 'src' ? ['IQI đặt phía phim mà không có chữ “F”: theo ASME V T-277.1, IQI phải đặt phía nguồn; chỉ được đặt phía phim khi phía nguồn không tiếp cận được, và phải kèm chữ chì “F”.'] : []
      }, finish);
    }
  };
})(this);
