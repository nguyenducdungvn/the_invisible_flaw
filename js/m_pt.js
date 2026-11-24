/* m_pt.js — Kiểm tra thẩm thấu (PT) loại nhìn thấy, tẩy bằng dung môi. Căn cứ: ASME V Điều 6 (T-652, T-672, T-673.3, T-676). */
(function (root) {
  'use strict';
  const { h, fmt, toast, addTime, safetyHit, METHODS } = root.Game;

  /* Chuỗi quyết định quy trình dùng chung (PT, MT, RT). Mỗi bước: {t, d, o:[{l, ok, lure, time, fx, why, safety}]} hoặc {slider} */
  function Decide(el, steps, done) {
    let k = 0, good = 0; const box = h('div', { class: 'card' }); el.append(box);
    const next = () => {
      box.innerHTML = ''; if (k >= steps.length) return done(good / steps.length);
      const s = steps[k]; let left = s.timer || 0; let iv = null;
      const tEl = h('span', { class: 'timer' });
      const go = (ok, why, extra) => { clearInterval(iv); if (ok) good++; if (why) toast(why, ok ? 'ok' : 'bad'); k++; setTimeout(next, extra || 350); };
      box.append(h('div', { class: 'row' }, h('span', { class: 'chip hi' }, `Bước ${k + 1}/${steps.length}`), h('h3', { style: 'margin:0' }, s.t), h('span', { class: 'spacer' }), s.timer ? tEl : null), s.d ? h('p', { class: 'serif' }, s.d) : null);
      if (s.timer) {
        tEl.textContent = left + ' s';
        const tick = () => { if (!box.isConnected) return clearInterval(iv); left--; tEl.textContent = left + ' s'; if (left <= 0) { addTime(5, 'chần chừ'); toast('Hết giờ suy nghĩ: +5 phút, khách càng sốt ruột', 'hi'); left = s.timer; } };
        iv = setInterval(tick, 1000);
      }
      if (s.slider) {
        const sl = s.slider; let v = sl.val; const out = h('span', { class: 'mono' });
        const inp = h('input', { type: 'range', min: sl.min, max: sl.max, step: sl.step, value: v });
        const upd = () => { v = +inp.value; out.textContent = `${fmt(v, sl.step < 1 ? 1 : 0)} ${sl.unit}`; }; inp.oninput = upd; upd();
        box.append(h('div', { class: 'sl' }, h('span', null, sl.label), inp, out), sl.hint ? h('p', { class: 'dim' }, sl.hint) : null,
          h('button', { class: 'btn', onclick: () => { const r = sl.apply(v); addTime(r.time || 0, s.t); go(r.ok, r.why); } }, 'Thực hiện'));
      } else {
        s.o.map((o, i) => ({ o, i })).sort(() => Math.random() - 0.5).forEach(({ o }) => box.append(h('button', { class: 'opt', onclick: () => {
          addTime(o.time || 0, s.t); if (o.fx) o.fx(); if (o.safety) safetyHit(o.safety, o.critical); go(!!o.ok, o.why, o.ok ? 350 : 900);
        } }, h('b', null, o.l), o.lure ? h('span', { class: 'lure' }, `· ${o.lure}`) : null, o.time ? h('small', null, `${o.time} phút`) : null)));
      }
    };
    next();
  }
  root.Decide = Decide;

  METHODS.PT = {
    prep(el, M, next) {
      const q = M.q = { crack: 1, small: 1, extraBleed: false, light: 1 };
      el.append(h('div', { class: 'card' }, h('h2', null, 'Chuẩn bị & quy trình PT'), h('p', { class: 'dim' }, `Nhiệt độ bề mặt ${M.lvl.temp} °C, trong dải chuẩn 5–52 °C của ASME V (T-652, các ấn bản mới). Mỗi lựa chọn đều có thời gian dừng máy; lựa chọn sai không báo ngay đâu, hậu quả hiện ra khi soi.`)));
      Decide(el, [
        { t: 'Bảo hộ & phòng cháy', d: 'Bình xịt chất thấm, chất tẩy và chất hiện hình đều chứa dung môi dễ cháy.', o: [
          { l: 'Găng nitrile, kính, thông gió; đặt bình xa máy mài và nguồn nhiệt', ok: true, time: 3 },
          { l: 'Làm luôn cho nhanh, chỉ khoảng 30 phút thôi', lure: 'Tiết kiệm 3 phút', safety: 'Phun dung môi dễ cháy không bảo hộ, gần máy mài đang chạy' }] },
        { t: 'Làm sạch trước', d: 'Mối hàn có vệt dầu và cặn oxit nhẹ.', o: [
          { l: 'Lau bằng dung môi tẩy rửa, chờ bay hơi hết rồi mới phun', ok: true, time: 6 },
          { l: 'Mài bóng mối hàn bằng đá mài cho đẹp rồi phun ngay', lure: 'Bề mặt trông sạch nhất', time: 4, fx: () => { q.crack *= 0.35; }, why: 'Mài có thể miết kim loại lấp miệng vết nứt. Chất thấm khó vào hơn.' },
          { l: 'Bỏ qua, nhìn đã sạch', lure: 'Nhanh nhất', time: 0, fx: () => { q.crack *= 0.5; q.extraBleed = true; } }] },
        { t: 'Thời gian ngấm (dwell)', timer: 25, d: `${M.lvl.contact}: “Phun xong 2–3 phút là được rồi em, bên chị chờ lâu lắm rồi.”`, slider: { label: 'Thời gian ngấm', min: 1, max: 30, step: 1, val: 3, unit: 'phút', hint: 'Tra Bảng T-672 (mối hàn, mọi dạng bất liên tục, 10–52 °C).',
          apply: v => { if (v < 5) q.crack *= v / 5 * 0.7; return { ok: v >= 5 && v <= 30, time: v, why: v < 5 ? `Ngấm ${v} phút < 5 phút tối thiểu của Bảng T-672: chất thấm chưa vào hết vết nứt khít.` : 'Đúng Bảng T-672: tối thiểu 5 phút.' }; } } },
        { t: 'Loại bỏ chất thấm thừa', d: 'Chất thấm loại tẩy bằng dung môi.', o: [
          { l: 'Lau bằng giẻ khô, sau đó lau bằng giẻ thấm ẩm dung môi, KHÔNG xịt trực tiếp', ok: true, time: 8 },
          { l: 'Xịt thẳng dung môi lên bề mặt rồi lau một lượt', lure: 'Nhanh hơn 6 phút, sạch bóng', time: 2, fx: () => { q.crack *= 0.15; q.small *= 0.3; }, why: 'T-673.3 cấm xả dung môi trực tiếp: nó rửa trôi chất thấm khỏi chính vết nứt.' },
          { l: 'Chỉ lau bằng giẻ khô', time: 4, fx: () => { q.extraBleed = true; q.small *= 0.7; } }] },
        { t: 'Phun chất hiện hình', o: [
          { l: 'Lắc kỹ bình, phun một lớp mỏng, đều', ok: true, time: 2 },
          { l: 'Phun dày cho chắc ăn, phủ trắng hẳn', lure: 'Nhìn rõ nền trắng', time: 2, fx: () => { q.small *= 0.3; q.crack *= 0.6; }, why: 'Lớp hiện hình dày che lấp chỉ thị nhỏ.' }] },
        { t: 'Thời gian hiện hình', timer: 25, slider: { label: 'Chờ hiện hình', min: 0, max: 30, step: 1, val: 2, unit: 'phút', hint: 'Bảng T-672: thời gian hiện hình tối thiểu cho chất hiện hình.',
          apply: v => { if (v < 10) { q.crack *= Math.max(0.3, v / 10); q.small *= Math.max(0.2, v / 10); } return { ok: v >= 10, time: v, why: v < 10 ? 'Chưa đủ 10 phút hiện hình theo T-672: chỉ thị chưa kịp “rỉ” lên.' : 'Đủ thời gian hiện hình (≥ 10 phút).' }; } } },
        { t: 'Chiếu sáng khi đánh giá', d: 'Chất thấm màu đỏ, nhìn bằng ánh sáng trắng.', o: [
          { l: 'Đèn trắng, đo ≥ 1000 lux tại bề mặt (T-676.3)', ok: true, time: 2 },
          { l: 'Đèn pin điện thoại', lure: 'Có sẵn trong túi', time: 0, fx: () => { q.light = 0.55; } },
          { l: 'Đèn UV-A', time: 1, fx: () => { q.light = 0.3; }, why: 'UV-A dành cho chất thấm huỳnh quang, không phải chất thấm màu.' }] }
      ], score => { M.proc = score; next(); });
    },

    inspect(el, M, next) {
      const q = M.q, inds = M.inds;
      if (q.extraBleed) inds.push({ id: 'E', kind: 'bleed', x: 15 + M.rng() * 130, y: -3.4, len: 5, wid: 2, atlas: 'bleed' });
      const vis = i => i.cleared ? 0 : i.kind === 'crack' ? q.crack * (i.faint || 1) * q.light : i.kind === 'pore' ? (i.len < 1.5 ? q.small * q.light : Math.min(1, q.small * 1.4) * q.light) : 0.9 * q.light;
      const surf = root.Surface.view(el, {
        length: 160, band: 26, head: h('div', null, h('h2', null, 'Soi chỉ thị'), h('p', { class: 'dim' }, 'Kéo thước dọc theo mỗi vết đỏ để đo chiều dài, rồi phân loại. Thấy nghi ngờ thì “Lau & hiện hình lại” (+8 phút): chỉ thị thật sẽ hiện lại, vệt chất thấm đọng thì không.')),
        rulerColor: 'rgba(40,40,40,.8)',
        drawBg(ctx, toPx, g, W, H) {
          ctx.fillStyle = `rgb(${Math.round(240 * (0.6 + 0.4 * q.light))},${Math.round(238 * (0.6 + 0.4 * q.light))},${Math.round(232 * (0.6 + 0.4 * q.light))})`; ctx.fillRect(0, 0, W, H);
          const [, y1] = toPx(0, -4), [, y2] = toPx(0, 4); ctx.fillStyle = 'rgba(190,188,180,.5)'; ctx.fillRect(0, y1, W, y2 - y1);
          ctx.strokeStyle = 'rgba(150,148,140,.5)'; for (let x = Math.floor(g.x0); x < g.x0 + g.span; x += 3) { const [px, py] = toPx(x, -4); ctx.beginPath(); ctx.arc(px, py + (y2 - y1) / 2, (y2 - y1) / 2, -1.2, 1.2); ctx.stroke(); }
        },
        drawInds(ctx, toPx) {
          for (const i of inds) {
            const a = vis(i); if (a < 0.18) continue; const [px, py] = toPx(i.x, i.y);
            ctx.fillStyle = `rgba(210,20,30,${Math.min(0.95, a)})`; ctx.strokeStyle = ctx.fillStyle;
            if (i.kind === 'crack') { const [ax] = toPx(i.x - i.len / 2, 0), [bx] = toPx(i.x + i.len / 2, 0); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, py - 2); ctx.quadraticCurveTo((ax + bx) / 2, py + 4, bx, py + 1); ctx.stroke(); ctx.globalAlpha = 0.25; ctx.lineWidth = 7; ctx.stroke(); ctx.globalAlpha = 1; }
            else { const [ax] = toPx(i.x - i.len / 2, 0), [bx] = toPx(i.x + i.len / 2, 0); const r = (bx - ax) / 2; ctx.beginPath(); ctx.ellipse(px, py, r, i.kind === 'bleed' ? r * 0.35 : r, 0, 0, 7); ctx.fill(); }
          }
        },
        classes: [['linear', 'Dạng đường'], ['rounded', 'Dạng tròn'], ['nonrel', 'Không liên quan']],
        verify: { label: 'Lau & hiện hình lại', fn: (m, rr) => {
          addTime(8, 'lau và hiện hình lại'); const p = root.Surface.match([m], inds)[0];
          if (p.i && p.i.kind === 'bleed') { p.i.cleared = true; toast(`${m.label}: không xuất hiện lại → vệt chất thấm đọng, không liên quan`, 'ok'); }
          else if (p.i) toast(`${m.label}: chỉ thị xuất hiện lại → bất liên tục thật`, 'hi'); else toast(`${m.label}: không có gì ở đây`); surf.draw(); rr();
        } }
      });
      M.marks = surf.marks;
      el.append(h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { addTime(10, 'soi và ghi chỉ thị'); next(); } }, 'Xong, lập biên bản')));
    },

    report(el, M, finish) {
      const tr = { crack: 'linear', pore: 'rounded', bleed: 'nonrel' };
      root.Surface.report(el, M, {
        truth: i => ({ cls: tr[i.kind], relevant: i.kind !== 'bleed' && i.len > 1.5, alt: ['nonrel'] }),
        crit: i => ({ type: tr[i.kind], len: i.len, x: i.x }),
        name: i => ({ crack: 'vết nứt (chỉ thị dạng đường)', pore: 'rỗ (chỉ thị tròn)', bleed: 'vệt chất thấm đọng' })[i.kind],
        label: c => ({ linear: 'Dạng đường', rounded: 'Dạng tròn', nonrel: 'Không liên quan' })[c] || '—',
        playerRelevant: m => m.cls !== 'nonrel', playerType: c => c,
        extraNotes: M => M.q.crack < 0.4 ? ['Quy trình làm vết nứt mờ đi rất nhiều (làm sạch, thời gian ngấm hoặc cách tẩy). Xem lại T-643, T-672, T-673.3.'] : []
      }, finish);
    }
  };
})(this);
