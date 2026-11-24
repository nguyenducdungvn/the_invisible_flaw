/* surface.js — khung xem dải mối hàn dùng chung cho PT, MT, RT: kéo thước để đo, phân loại chỉ thị, báo cáo và chấm điểm. */
(function (root) {
  'use strict';
  const { h, fmt, fitCanvas, toast } = root.Game;

  function view(el, o) {
    const cv = h('canvas', { 'aria-label': 'Vùng kiểm tra: kéo để đo chỉ thị' });
    const pan = h('input', { type: 'range', min: 0, max: 1000, value: 0 });
    const pending = h('div'); const list = h('div');
    const marks = []; let st = null, drag = null;
    const band = o.band || 30, L = o.length, H = o.height || 220;
    const geom = () => { const W = cv.clientWidth || 600; const ppm = Math.max(5.5, Math.min(9, W / L)); const span = Math.min(L, W / ppm); const x0 = (L - span) * (+pan.value / 1000); return { W, ppm, span, x0, ppmy: (H - 24) / band }; };
    const toPx = (x, y) => { const g = geom(); return [(x - g.x0) * g.ppm, 12 + (y + band / 2) * g.ppmy]; };
    const toMM = (px, py) => { const g = geom(); return [px / g.ppm + g.x0, (py - 12) / g.ppmy - band / 2]; };
    function draw() {
      st = fitCanvas(cv, H); const { ctx, W } = st; const g = geom(); ctx.clearRect(0, 0, W, H);
      o.drawBg(ctx, toPx, g, W, H); o.drawInds(ctx, toPx, g);
      ctx.font = '11px "Roboto Mono"'; ctx.fillStyle = o.rulerColor || 'rgba(0,0,0,.6)';
      for (let x = Math.ceil(g.x0 / 10) * 10; x <= g.x0 + g.span; x += 10) { const [px] = toPx(x, 0); ctx.fillRect(px, H - 10, 1, 10); ctx.fillText(x + '', px + 2, H - 2); }
      for (const m of marks.concat(drag ? [drag] : [])) {
        const [a, b] = toPx(m.x1, m.y1), [c, d] = toPx(m.x2, m.y2);
        ctx.strokeStyle = m.cls ? '#43c6f0' : '#ffc531'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle; ctx.font = '12px "Be Vietnam Pro"'; ctx.fillText((m.label || '') + ' ' + fmt(m.len, 1) + ' mm', Math.min(a, c), Math.min(b, d) - 4);
      }
    }
    const pos = e => { const r = cv.getBoundingClientRect(); return toMM(e.clientX - r.left, e.clientY - r.top); };
    cv.addEventListener('pointerdown', e => { if (o.onTap && o.onTap(pos(e))) return; cv.setPointerCapture(e.pointerId); const [x, y] = pos(e); drag = { x1: x, y1: y, x2: x, y2: y, len: 0 }; draw(); });
    cv.addEventListener('pointermove', e => { if (!drag) return; const [x, y] = pos(e); drag.x2 = x; drag.y2 = y; drag.len = Math.hypot(x - drag.x1, y - drag.y1); draw(); });
    cv.addEventListener('pointerup', () => {
      if (!drag) return; const m = drag; drag = null;
      if (m.len < 0.4) { draw(); return toast('Kéo thước từ đầu này tới đầu kia của chỉ thị để đo'); }
      m.x = (m.x1 + m.x2) / 2; m.y = (m.y1 + m.y2) / 2; m.label = 'M' + (marks.length + 1); marks.push(m); draw(); classify(m);
    });
    pan.addEventListener('input', draw); window.addEventListener('resize', () => draw());
    function classify(m) {
      pending.innerHTML = '';
      pending.append(h('div', { class: 'callout cy' }, h('b', null, `${m.label}: dài ${fmt(m.len, 1)} mm. `), 'Bạn phân loại là gì?',
        h('div', { class: 'row', style: 'margin-top:6px' }, o.classes.map(([k, lab]) => h('button', { class: 'btn sm ghost', onclick: () => { m.cls = k; pending.innerHTML = ''; renderList(); draw(); } }, lab)),
          h('button', { class: 'btn sm danger', onclick: () => { marks.splice(marks.indexOf(m), 1); marks.forEach((q, i) => q.label = 'M' + (i + 1)); pending.innerHTML = ''; renderList(); draw(); } }, 'Xóa vạch'))));
    }
    function renderList() {
      list.innerHTML = ''; if (!marks.length) return;
      list.append(h('table', { class: 't' }, h('tr', null, h('th', null, 'Vạch'), h('th', null, 'Vị trí x'), h('th', null, 'Dài'), h('th', null, 'Phân loại'), h('th', null, '')),
        marks.map(m => h('tr', null, h('td', null, m.label), h('td', { class: 'mono' }, fmt(m.x, 0) + ' mm'), h('td', { class: 'mono' }, fmt(m.len, 1) + ' mm'),
          h('td', null, (o.classes.find(c => c[0] === m.cls) || [0, '— chưa chọn —'])[1]),
          h('td', null, o.verify ? h('button', { class: 'btn sm ghost', onclick: () => o.verify.fn(m, renderList) }, o.verify.label) : null, ' ',
            h('button', { class: 'btn sm ghost', onclick: () => classify(m) }, 'Sửa'))))));
    }
    el.append(h('div', { class: 'card' }, o.head || null, cv, h('div', { class: 'row', style: 'margin-top:6px' }, h('span', { class: 'dim' }, 'Dịch khung nhìn'), h('div', { style: 'flex:1' }, pan)), pending, list));
    setTimeout(draw);
    return { marks, draw, toPx, cv };
  }

  // Ghép vạch đo với chỉ thị thật (theo khoảng cách tâm)
  function match(marks, inds) {
    const used = new Set(), pairs = [];
    for (const m of marks) {
      let best = null, bd = 1e9;
      for (const i of inds) { const d = Math.hypot(m.x - i.x, (m.y - (i.y || 0)) * 0.5); if (d < Math.max(4, i.len / 2 + 3) && d < bd && !used.has(i)) { best = i; bd = d; } }
      if (best) used.add(best); pairs.push({ m, i: best });
    }
    return pairs;
  }

  /* Báo cáo chung. cfg: { truth(i)→{cls, relevant, crit}, critInd(i)→object cho criteria, atlasOf(i), extraNotes } */
  function report(el, M, cfg, finish) {
    const C = root.CRITERIA[M.lvl.criteria], marks = M.marks || [];
    const unc = marks.filter(m => !m.cls);
    const verdict = acc => {
      if (unc.length) return toast('Còn vạch chưa phân loại');
      const pairs = match(marks, M.inds); let det = 0, n = 0, falseCalls = 0; const notes = [], atlas = [];
      const real = M.inds.filter(i => cfg.truth(i).relevant);
      for (const i of real) {
        n++; const p = pairs.find(p => p.i === i);
        if (!p) { notes.push(`Bỏ sót ${cfg.name(i)} ở x ≈ ${fmt(i.x, 0)} mm.`); continue; }
        const good = p.m.cls === cfg.truth(i).cls; det += good ? 1 : 0.6;
        if (good) atlas.push(i.atlas); else notes.push(`${p.m.label}: là ${cfg.name(i)}, bạn ghi “${cfg.label(p.m.cls)}”.`);
      }
      for (const p of pairs) {
        if (!p.i) { falseCalls++; notes.push(`${p.m.label} ở x ≈ ${fmt(p.m.x, 0)} mm: không có bất liên tục (báo động giả).`); continue; }
        const t = cfg.truth(p.i);
        if (!t.relevant) { if (p.m.cls === t.cls || (t.alt || []).includes(p.m.cls)) atlas.push(p.i.atlas); else { falseCalls++; notes.push(`${p.m.label}: ${cfg.name(p.i)}, không phải chỉ thị liên quan (báo động giả).`); } }
      }
      const ev = C.evaluate(M.inds.filter(i => cfg.truth(i).relevant).map(i => Object.assign({ label: `Chỉ thị tại x≈${fmt(i.x, 0)}` }, cfg.crit(i))), M.lvl.t || M.lvl.T);
      finish({ proc: M.proc, det: n ? det / n : 1, falseCalls, playerAccept: acc, trueAccept: ev.accept, why: ev.why, atlas, notes: notes.concat(cfg.extraNotes ? cfg.extraNotes(M) : []) });
    };
    const myEval = C.evaluate(marks.filter(m => cfg.playerRelevant(m)).map(m => ({ label: m.label, type: cfg.playerType(m.cls), len: m.len, x: m.x, depth: m.depth })), M.lvl.t || M.lvl.T);
    el.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h3', null, 'Biên bản chỉ thị của bạn'),
        marks.length ? h('table', { class: 't' }, h('tr', null, h('th', null, 'Vạch'), h('th', null, 'x'), h('th', null, 'Dài'), h('th', null, 'Phân loại')),
          marks.map(m => h('tr', null, h('td', null, m.label), h('td', { class: 'mono' }, fmt(m.x, 0)), h('td', { class: 'mono' }, fmt(m.len, 1) + ' mm'), h('td', null, cfg.label(m.cls))))) : h('p', { class: 'dim' }, 'Bạn không ghi chỉ thị nào.'),
        h('div', { class: 'callout' + (myEval.accept ? ' ok' : ' bad') }, h('b', null, 'Nếu áp tiêu chí lên chính số liệu của bạn: '), myEval.accept ? 'không có gì vượt tiêu chí.' : h('ul', { style: 'margin:4px 0' }, myEval.why.map(w => h('li', null, w))))),
      h('div', { class: 'card' }, h('h3', null, C.name), h('ul', null, C.rules.map(r => h('li', null, r))),
        h('p', { class: 'serif' }, 'Ký biên bản. Chữ ký của bạn quyết định số phận của chi tiết này.'),
        h('div', { class: 'row' }, h('button', { class: 'btn', style: 'background:var(--ok)', onclick: () => verdict(true) }, 'ĐẠT (ACCEPT)'), h('button', { class: 'btn danger', onclick: () => verdict(false) }, 'LOẠI BỎ / SỬA CHỮA')))));
  }
  root.Surface = { view, match, report };
})(this);
