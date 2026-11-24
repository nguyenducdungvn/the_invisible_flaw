/* m_mt.js — Kiểm tra hạt từ (MT) bằng ách AC, hạt ướt nhìn thấy trên nền sơn tương phản. Căn cứ: ASME V Điều 7 (T-750, T-762, T-764, T-777). */
(function (root) {
  'use strict';
  const { h, fmt, toast, addTime, safetyHit, METHODS } = root.Game; const P = root.Physics;

  METHODS.MT = {
    prep(el, M, next) {
      const q = M.q = { sens: 1, light: 1, plan2: true };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị & hiệu chuẩn MT'), h('p', { class: 'dim' }, 'Ách điện từ xoay chiều, hạt từ ướt màu đen trên nền sơn trắng tương phản. Hiện trường cảng: sàn ướt, gió biển.')));
      root.Decide(el, [
        { t: 'An toàn điện', o: [
          { l: 'Kiểm tra vỏ dây, ổ cắm có tiếp địa, đi dây trên chỗ khô, có thiết bị chống dòng rò', ok: true, time: 4 },
          { l: 'Kéo dây nối dài băng qua vũng nước cho gần', lure: 'Tiết kiệm 4 phút', safety: 'Dây điện ách từ đi qua vũng nước trên cầu cảng' }] },
        { t: 'Chuẩn bị bề mặt', d: 'Chân giá có lớp sơn chống gỉ dày khoảng 200 µm, bong tróc cục bộ.', o: [
          { l: 'Tẩy sơn vùng kiểm tra, làm sạch, phun lớp sơn trắng tương phản mỏng', ok: true, time: 12 },
          { l: 'Kiểm tra xuyên qua lớp sơn chống gỉ cho nhanh', lure: 'Khách không muốn sơn lại', time: 0, fx: () => { q.sens *= 0.45; }, why: 'Lớp phủ dày làm yếu từ trường rò ở bề mặt, vết nứt khít có thể không hiện.' }] },
        { t: 'Kiểm tra lực nâng của ách (T-762)', d: 'Ách AC dùng hôm nay, khoảng cách cực sẽ dùng là 100 mm.', timer: 20, o: [
          { l: 'Nhấc tấm thép thử 4,5 kg (10 lb) ở đúng khoảng cách cực sẽ dùng', ok: true, time: 3 },
          { l: 'Nhấc tấm 2 kg cho chắc chắn đạt', lure: 'Không bao giờ trượt', time: 3, why: 'Ách AC phải nâng được tối thiểu 4,5 kg (10 lb) ở khoảng cách cực lớn nhất sẽ dùng.' },
          { l: 'Bỏ qua, ách mới hiệu chuẩn năm ngoái', lure: 'Có tem kiểm định', time: 0, fx: () => { q.sens *= 0.8; }, why: 'Từ ấn bản 2015, ASME V yêu cầu kiểm tra lực nâng mỗi ngày trước khi dùng.' }] },
        { t: 'Xác nhận cường độ và hướng từ trường', o: [
          { l: 'Đặt chỉ thị trường từ (pie gauge) trên bề mặt và quan sát các vạch hiện rõ', ok: true, time: 3 },
          { l: 'Không cần, ách đã đạt lực nâng', time: 0, why: 'Lực nâng không cho biết hướng và độ đủ của từ trường tại bề mặt chi tiết.' }] },
        { t: 'Kế hoạch từ hóa', o: [
          { l: 'Mỗi đoạn kiểm tra 2 lần, đường sức gần vuông góc nhau, các lần đặt chồng lấn', ok: true, time: 0 },
          { l: 'Một lượt đặt ách dọc mối hàn là đủ', lure: 'Nhanh gấp đôi', time: 0, fx: () => { q.plan2 = false; } }] },
        { t: 'Chiếu sáng khi đánh giá', o: [
          { l: 'Đèn trắng ≥ 1000 lux tại bề mặt', ok: true, time: 2 },
          { l: 'Đèn pin điện thoại', lure: 'Có sẵn', time: 0, fx: () => { q.light = 0.6; } }] }
      ], s => { M.proc = s; next(); });
    },

    inspect(el, M, next) {
      const q = M.q, L = M.lvl.weldLen, inds = M.inds, seg = 20, N = L / seg; const cov = Array.from({ length: N }, () => ({ a: false, c: false }));
      let orient = 'c'; // 'a' = ách dọc → từ trường dọc 0°; 'c' = ách cắt ngang → từ trường 90°
      const show = new Set(); let last = null;
      const ob = h('div', { class: 'row' });
      const setO = o => { orient = o; ob.innerHTML = ''; ob.append(
        h('button', { class: 'btn sm' + (o === 'a' ? '' : ' ghost'), onclick: () => setO('a') }, 'Ách đặt DỌC mối hàn (từ trường 0°)'),
        h('button', { class: 'btn sm' + (o === 'c' ? '' : ' ghost'), onclick: () => setO('c') }, 'Ách đặt CẮT NGANG (từ trường 90°)')); };
      setO('c');
      const covEl = h('div', { class: 'mono', style: 'font-size:.85rem' });
      const updCov = () => { covEl.textContent = 'Phủ: ' + cov.map((c, i) => `[${c.a ? '═' : '·'}${c.c ? '║' : '·'}]`).join(''); };
      const surf = root.Surface.view(el, {
        length: L, band: 30, rulerColor: 'rgba(40,40,40,.8)',
        head: h('div', null, h('h2', null, 'Từ hóa & quan sát'), h('p', { class: 'dim' }, 'Chạm vào một đoạn mối hàn để đặt ách (+2 phút mỗi lần). Chọn hướng đặt ách bằng hai nút bên dưới. Hạt từ chỉ tụ lại ở vết nứt bị đường sức cắt ngang. Sau đó kéo thước đo các chỉ thị như ở PT.'), ob, covEl),
        drawBg(ctx, toPx, g, W, H) {
          const lv = 0.6 + 0.4 * q.light; ctx.fillStyle = `rgb(${236 * lv | 0},${236 * lv | 0},${230 * lv | 0})`; ctx.fillRect(0, 0, W, H);
          const [, y1] = toPx(0, -5), [, y2] = toPx(0, 5); ctx.fillStyle = 'rgba(170,170,165,.55)'; ctx.fillRect(0, y1, W, y2 - y1);
          const [, y3] = toPx(0, 6); ctx.fillStyle = 'rgba(120,120,118,.35)'; ctx.fillRect(0, y3, W, 3);
          ctx.font = '11px "Be Vietnam Pro"'; ctx.fillStyle = 'rgba(60,60,60,.8)';
          for (let i = 0; i < N; i++) { const [px] = toPx(i * seg, 0); ctx.fillRect(px, 0, 1, 10); ctx.fillText(`Đ${i + 1}`, px + 3, 10); }
          if (last) { const [px, py] = toPx(last.x, 0); ctx.strokeStyle = 'rgba(67,120,200,.9)'; ctx.lineWidth = 3; ctx.beginPath();
            if (last.o === 'a') { ctx.moveTo(px - 40, py - 26); ctx.lineTo(px - 40, py - 34); ctx.lineTo(px + 40, py - 34); ctx.lineTo(px + 40, py - 26); }
            else { ctx.moveTo(px - 12, py - 40); ctx.lineTo(px - 18, py - 40); ctx.lineTo(px - 18, py + 40); ctx.lineTo(px - 12, py + 40); }
            ctx.stroke(); }
        },
        drawInds(ctx, toPx) {
          for (const i of inds) { if (!show.has(i)) continue; const [px, py] = toPx(i.x, i.y); const r = i.angle * Math.PI / 180;
            const [ax] = toPx(i.x - i.len / 2, 0), [bx] = toPx(i.x + i.len / 2, 0); const half = (bx - ax) / 2;
            ctx.fillStyle = i.kind === 'nonrel' ? 'rgba(40,40,40,.35)' : 'rgba(15,15,15,.9)';
            for (let k = 0; k < (i.kind === 'nonrel' ? 160 : 90); k++) { const s = (Math.random() * 2 - 1) * half, w = i.kind === 'nonrel' ? 6 : 2; ctx.fillRect(px + Math.cos(r) * s + (Math.random() - .5) * w, py + Math.sin(r) * s + (Math.random() - .5) * w, 1.6, 1.6); } }
        },
        classes: [['linear', 'Dạng đường'], ['rounded', 'Dạng tròn'], ['nonrel', 'Không liên quan']],
        verify: { label: 'Đối chứng bằng PT', fn: (m, rr) => { addTime(10, 'đối chứng bằng PT'); const p = root.Surface.match([m], inds)[0];
          if (p.i && p.i.kind === 'nonrel') toast(`${m.label}: PT không có chỉ thị → từ thông rò do hình học, không liên quan`, 'ok');
          else if (p.i) toast(`${m.label}: PT cũng thấy → vết nứt hở bề mặt`, 'hi'); else toast(`${m.label}: không có gì ở đây`); rr(); } }
      });
      // Bấm vào dải mối hàn khi đang ở chế độ đặt ách
      let mode = 'yoke'; const modeBtn = h('button', { class: 'btn sm ghost' });
      const setMode = m => { mode = m; modeBtn.textContent = m === 'yoke' ? 'Đang: ĐẶT ÁCH (bấm để chuyển sang đo)' : 'Đang: ĐO CHỈ THỊ (bấm để chuyển sang đặt ách)'; };
      modeBtn.onclick = () => setMode(mode === 'yoke' ? 'ruler' : 'yoke'); setMode('yoke');
      surf.cv.addEventListener('pointerdown', e => {
        if (mode !== 'yoke') return; e.stopImmediatePropagation();
        const r = surf.cv.getBoundingClientRect(); const W = surf.cv.clientWidth; const ppm = Math.max(5.5, Math.min(9, W / L)); const span = Math.min(L, W / ppm);
        const pan = surf.cv.parentElement.querySelector('input[type=range]'); const x0 = (L - span) * (+pan.value / 1000); const x = (e.clientX - r.left) / ppm + x0;
        const k = Math.max(0, Math.min(N - 1, Math.floor(x / seg))); const cx = k * seg + seg / 2; const field = orient === 'a' ? 0 : 90;
        addTime(2, 'đặt ách và phun hạt từ'); cov[k][orient] = true; last = { x: cx, o: orient }; updCov();
        for (const i of inds) if (Math.abs(i.x - cx) <= seg / 2 + 8) {
          const f = i.kind === 'nonrel' ? 1 : P.leakageFactor(field, i.angle) * q.sens;
          if (f >= P.MT_DETECT) { if (!show.has(i)) toast(`Đ${k + 1}: hạt từ tụ thành chỉ thị!`, 'hi'); show.add(i); }
        }
        surf.draw();
      }, true);
      updCov(); M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, modeBtn, h('span', { class: 'spacer' }), h('button', { class: 'btn', onclick: () => {
        const miss = cov.filter(c => !(c.a && c.c)).length; M.coverMiss = miss;
        if (miss) { M.proc *= q.plan2 ? 0.8 : 0.6; toast(`${miss} đoạn chưa được từ hóa đủ hai hướng`, 'bad'); }
        addTime(6, 'khử từ không cần (ách AC), vệ sinh'); M.marks = surf.marks; next(); } }, 'Xong, lập biên bản')));
    },

    report(el, M, finish) {
      const tr = { crack: 'linear', nonrel: 'nonrel' };
      root.Surface.report(el, M, {
        truth: i => ({ cls: tr[i.kind], relevant: i.kind === 'crack', alt: [] }),
        crit: i => ({ type: 'linear', len: i.len, x: i.x }),
        name: i => i.kind === 'crack' ? (i.angle === 0 ? 'vết nứt dọc mối hàn' : 'vết nứt ngang mối hàn') : 'chỉ thị do đổi tiết diện',
        label: c => ({ linear: 'Dạng đường', rounded: 'Dạng tròn', nonrel: 'Không liên quan' })[c] || '—',
        playerRelevant: m => m.cls !== 'nonrel', playerType: c => c,
        extraNotes: M => M.coverMiss ? [`${M.coverMiss} đoạn chưa được kiểm tra đủ hai hướng vuông góc (ASME V T-750). Vết nứt theo hướng còn thiếu có thể bị bỏ sót.`] : []
      }, finish);
    }
  };
})(this);
