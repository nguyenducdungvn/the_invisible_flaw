/* academy.js — Học viện NDE: danh mục chương, trang chương (bài học → mô phỏng → kiểm tra), tiến độ và thẻ công thức. */
(function (root) {
  'use strict';
  const G = root.Game, { h, fmt, toast, page, hud } = G;
  const A = () => root.ACADEMY;
  const S = () => G.S();
  const PASS = 0.8;
  const best = id => (S().acad && S().acad[id]) || 0;
  const mastered = id => best(id) >= PASS;
  function saveS() { try { localStorage.setItem('invisible-flaw-v1', JSON.stringify(S())); } catch (e) { /* bỏ qua */ } }

  function badge(id) { const b = best(id); return b >= PASS ? h('span', { class: 'chip ok' }, `Thành thạo ${Math.round(b * 100)} %`) : b > 0 ? h('span', { class: 'chip hi' }, `${Math.round(b * 100)} %`) : h('span', { class: 'chip' }, 'Chưa học'); }

  function academy() {
    G.M = null; hud(); const s = S(); s.acad = s.acad || {};
    const n = A().filter(c => mastered(c.id)).length;
    const track = t => h('div', null, h('h2', { style: 'margin-top:18px' }, root.TRACKS[t]),
      h('div', { class: 'grid g3' }, A().filter(c => c.track === t).map((c, i) => h('div', { class: 'card contract', onclick: () => chapter(c.id) },
        h('div', { class: 'row' }, h('span', { class: 'meth', style: 'font-size:1.15rem' }, `${t === 'phys' ? 'P' : 'M'}${i + 1}`), h('span', { class: 'spacer' }), badge(c.id)),
        h('h3', { style: 'margin:6px 0 2px' }, c.title), h('div', { class: 'dim', style: 'font-size:.85rem' }, c.en),
        h('p', { class: 'dim', style: 'font-size:.88rem;margin-top:6px' }, `${c.lessons.length} bài · ${(c.deep || []).length} mục đào sâu · ${c.quiz.length} câu hỏi` + (root.View3D && root.View3D.FOR_CHAPTER[c.id] ? ' · 3D' : ''))))));
    page(h('div', null,
      h('div', { class: 'row' }, h('button', { class: 'btn ghost sm', onclick: G.hub }, '← Trung tâm'), h('h2', { style: 'margin:0' }, 'Học viện NDE'), h('span', { class: 'spacer' }), h('button', { class: 'btn sm ghost', onclick: glossary }, 'Thuật ngữ Việt – Anh'), h('span', { class: 'chip ok' }, `Thành thạo ${n}/${A().length} chương`)),
      h('p', { class: 'dim' }, 'Cấu trúc theo NDE-Ed.org (Iowa State University), viết lại bằng tiếng Việt, bổ sung căn cứ tiêu chuẩn. Đạt ≥ 80 % bài kiểm tra để thành thạo chương và mở khóa thẻ công thức. Học bất kỳ lúc nào; hợp đồng hiện trường sẽ gợi ý chương nên học trước.'),
      h('div', { class: 'bar', style: 'height:8px' }, h('i', { style: `width:${n / A().length * 100}%;background:var(--ok)` })),
      track('phys'), track('tech')));
  }

  function chapter(id) {
    const list = A(), c = list.find(x => x.id === id), idx = list.indexOf(c); G.M = null; hud();
    const quizBox = h('div'); const simBox = h('div');
    const startQuiz = () => {
      quizBox.innerHTML = ''; quizBox.append(h('h2', null, 'Bài kiểm tra chương'));
      quizBox.append(root.challenges(c.quiz, sc => finishCh(sc), 'Xem kết quả'));
      quizBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const finishCh = sc => {
      const s = S(); s.acad = s.acad || {}; const was = mastered(id); s.acad[id] = Math.max(best(id), sc);
      const newCards = (c.cards || []).filter(k => !s.cards[k]);
      if (sc >= PASS) { newCards.forEach(k => { s.cards[k] = 1; toast(`Mở khóa thẻ công thức: ${G.CARDS[k].t}`, 'ok'); }); if (!was) { s.rep = Math.min(100, s.rep + 2); toast('Thành thạo chương mới: +2 uy tín', 'ok'); } }
      saveS(); hud();
      quizBox.innerHTML = ''; quizBox.append(h('div', { class: 'card' }, h('div', { class: 'row' }, h('div', { class: 'big' }, `${Math.round(sc * 100)} %`), h('div', null, sc >= PASS ? h('b', { class: 'ok' }, 'Thành thạo chương!') : h('b', { class: 'bad' }, 'Chưa đạt 80 %'), h('div', { class: 'dim' }, `Điểm cao nhất: ${Math.round(best(id) * 100)} %`))),
        h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'btn ghost', onclick: startQuiz }, 'Làm lại'),
          list[idx + 1] ? h('button', { class: 'btn', onclick: () => chapter(list[idx + 1].id) }, `Chương tiếp: ${list[idx + 1].title}`) : null, h('button', { class: 'btn ghost', onclick: academy }, 'Danh mục chương'))));
    };
    page(h('div', null,
      h('div', { class: 'row' }, h('button', { class: 'btn ghost sm', onclick: academy }, '← Học viện'), h('span', { class: 'chip' }, root.TRACKS[c.track]), h('span', { class: 'spacer' }), badge(id)),
      h('h1', { style: 'margin-top:10px' }, c.title), h('p', { class: 'dim' }, c.en),
      h('div', { class: 'grid g2' }, c.lessons.map(([t, b], i) => h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'chip hi' }, `Bài ${i + 1}`), h('h3', { style: 'margin:0' }, t)), h('p', { class: 'serif', style: 'margin-top:8px' }, b)))),
      c.deep ? h('div', { class: 'deep' }, h('h2', null, 'Đào sâu ', h('span', { class: 'chip hi', style: 'vertical-align:middle' }, 'mức Bậc II')),
        h('div', { class: 'grid g3' }, c.deep.map(([t, b]) => h('div', { class: 'card', style: 'border-left:3px solid var(--cy)' }, h('h3', null, t), h('p', { style: 'margin-top:6px' }, b))))) : null,
      c.ex ? h('div', null, h('h2', null, 'Ví dụ tính'), c.ex.map(x => { const sol = h('div', { class: 'hidden' }, h('ol', null, x.steps.map(s => h('li', { class: 'mono' }, s))), h('div', { class: 'callout ok' }, h('b', null, 'Đáp số: '), x.a));
        return h('div', { class: 'card' }, h('p', { class: 'serif', style: 'font-size:1.05rem' }, x.q), h('button', { class: 'btn sm ghost', onclick: e => { sol.classList.toggle('hidden'); e.target.textContent = sol.classList.contains('hidden') ? 'Tự tính rồi xem lời giải' : 'Ẩn lời giải'; } }, 'Tự tính rồi xem lời giải'), sol); })) : null,
      c.cards && c.cards.length ? h('div', { class: 'card flat' }, h('h3', null, 'Thẻ công thức của chương'), h('p', { class: 'dim' }, 'Mở khóa khi đạt ≥ 80 %. Thẻ đã mở có máy tính trong Sổ tay.'), c.cards.map(k => G.cardView(k, false))) : null,
      h('div', { id: 'ch3d' }), h('h2', null, 'Mô phỏng'), simBox,
      h('div', { class: 'row', style: 'margin:10px 0 18px' }, h('button', { class: 'btn', onclick: startQuiz }, `Làm bài kiểm tra (${c.quiz.length} câu)`)),
      quizBox,
      h('p', { class: 'dim', style: 'font-size:.85rem;margin-top:20px' }, 'Nguồn tham khảo: ', h('a', { href: root.NDE + c.src, target: '_blank', rel: 'noopener' }, `NDE-Ed.org – ${c.en}`), '. Nội dung đã viết lại và rút gọn cho game; số liệu vật liệu ghi “tham khảo” là giá trị minh họa.')));
    if (root.View3D && root.View3D.FOR_CHAPTER[id]) root.View3D.mount(document.getElementById('ch3d'), root.View3D.FOR_CHAPTER[id]);
    if (c.sim.startsWith('lab:')) root.LABS[c.sim.slice(4)](simBox, () => { toast('Xong phần mô phỏng'); startQuiz(); }, { btn: 'Sang bài kiểm tra chương' });
    else root.SIMS[c.sim](simBox);
  }

  function glossary() {
    G.M = null; hud(); const q = h('input', { class: 'f', placeholder: 'Tìm thuật ngữ (Việt hoặc Anh)…', style: 'max-width:420px' }); const list = h('div');
    const draw = () => { const k = q.value.trim().toLowerCase().normalize('NFC'); list.innerHTML = '';
      const rows = (root.GLOSSARY || []).filter(r => !k || r.join(' ').toLowerCase().includes(k)).sort((a, b) => a[0].localeCompare(b[0], 'vi'));
      list.append(h('table', { class: 't stack' }, h('thead', null, h('tr', null, h('th', null, 'Thuật ngữ'), h('th', null, 'Tiếng Anh'), h('th', null, 'Giải thích'))),
        h('tbody', null, rows.map(r => h('tr', null, h('td', null, h('b', null, r[0])), h('td', { class: 'dim' }, r[1]), h('td', null, r[2]))))), h('p', { class: 'dim' }, `${rows.length} thuật ngữ`)); };
    q.oninput = draw;
    page(h('div', null, h('div', { class: 'row' }, h('button', { class: 'btn ghost sm', onclick: academy }, '← Học viện'), h('h2', { style: 'margin:0' }, 'Thuật ngữ NDT Việt – Anh')),
      h('p', { class: 'dim' }, 'Các thuật ngữ dùng trong game, viết ngắn gọn để tra nhanh. Định nghĩa chính thức xem ASME V Điều 1 (Glossary), ASTM E1316 hoặc ISO 9712 tùy hệ thống áp dụng.'), q, list)); draw();
  }
  G.academy = academy; G.chapter = chapter; G.mastered = mastered; G.glossary = glossary;
})(this);
