/* about.js — Giới thiệu, miễn trừ trách nhiệm, lời cảm ơn, mời cà phê và chia sẻ. */
(function (root) {
  'use strict';
  const G = root.Game, { h, toast, page, hud } = G;
  const REPO = 'https://github.com/nguyenducdungvn/the_invisible_flaw';
  const ACC = { name: 'NGUYEN DUC DUNG', no: '3210256468', bank: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)' };
  const SITE = 'https://hvflaw.hlvsuckhoe.com/';
  const shareURL = () => SITE;
  async function copy(text, what) {
    try { await navigator.clipboard.writeText(text); toast(`Đã sao chép ${what}`, 'ok'); }
    catch (e) { try { const t = h('textarea', { style: 'position:fixed;opacity:0' }); t.value = text; document.body.append(t); t.select(); const okk = document.execCommand('copy'); t.remove(); toast(okk ? `Đã sao chép ${what}` : `Hãy chép tay: ${text}`, okk ? 'ok' : 'hi'); } catch (e2) { toast(`Hãy chép tay: ${text}`, 'hi'); } }
  }
  const st = () => G.S();

  function about() {
    G.M = null; hud(); const s = st(); const nDone = Object.values(s.done || {}).filter(d => d.stars > 0).length, nCh = Object.values(s.acad || {}).filter(v => v >= 0.8).length;
    const msg = 'The Invisible Flaw – game học NDT (PT, MT, UT, RT, ET, AE, nhiệt ảnh…) bằng tiếng Việt, có mô phỏng 3D. Chơi thử nhé:';
    page(h('div', { class: 'about' },
      h('div', { class: 'row' }, h('button', { class: 'btn ghost sm', onclick: () => s.name ? G.hub() : G.title() }, '← Quay lại'), h('h1', { style: 'margin:0' }, 'Giới thiệu')),
      h('div', { class: 'grid g2', style: 'margin-top:14px' },
        h('div', { class: 'card' }, h('h2', null, 'Cảm ơn bạn đã chơi và đã học!'),
          h('p', { class: 'serif', style: 'font-size:1.05rem' }, s.name ? `${s.name} ơi, ` : '', `cảm ơn bạn đã dành thời gian cho “The Invisible Flaw · Bác Sĩ Vật Liệu”. ${nDone || nCh ? `Bạn đã hoàn thành ${nDone} hợp đồng và thành thạo ${nCh} chương Học viện.` : ''} Mỗi vết nứt được phát hiện đúng lúc là một chi tiết, một công trình, có khi là một con người được giữ an toàn.`),
          h('p', null, 'Game được làm với mong muốn để người học NDT ở Việt Nam có thêm một cách vừa chơi vừa luyện: chọn phương pháp, làm đúng quy trình, hiểu vật lý đằng sau, đọc tín hiệu và dám ký kết luận.'),
          h('p', { class: 'dim' }, 'Ý tưởng và chuyên môn NDT: Nguyễn Đức Dũng (NDT Level III). Thiết kế và lập trình cùng Claude (Anthropic).'),
          h('p', null, 'Mã nguồn: ', h('a', { href: REPO, target: '_blank', rel: 'noopener' }, 'github.com/nguyenducdungvn/the_invisible_flaw'))),
        h('div', { class: 'card', style: 'text-align:center' }, h('h2', null, 'Thấy hay? Mời tác giả một ly cà phê'),
          h('p', { class: 'dim' }, 'Game miễn phí. Nếu bạn thấy hữu ích, một ly cà phê sẽ tiếp thêm động lực làm thêm màn chơi mới. Hoàn toàn tự nguyện.'),
          h('img', { class: 'qr', src: 'assets/qr-bidv.jpg', alt: `Mã VietQR BIDV: ${ACC.name}, số tài khoản ${ACC.no}` }),
          h('div', { style: 'margin-top:8px' }, h('b', null, ACC.name), h('div', { class: 'mono big', style: 'font-size:1.4rem' }, ACC.no), h('div', { class: 'dim' }, ACC.bank)),
          h('div', { class: 'row', style: 'justify-content:center;margin-top:8px' }, h('button', { class: 'btn sm', onclick: () => copy(ACC.no, 'số tài khoản') }, 'Sao chép số tài khoản')),
          h('p', { class: 'dim', style: 'font-size:.85rem' }, 'Mở ứng dụng ngân hàng, chọn quét mã QR. Gợi ý nội dung chuyển khoản: “Cafe Invisible Flaw”.'))),
      h('div', { class: 'card' }, h('h2', null, 'Chia sẻ cho bạn bè, đồng nghiệp'),
        h('p', null, 'Nếu bạn biết ai đang học NDT, đang ôn thi Bậc I, Bậc II, hay chỉ tò mò vì sao người ta “nhìn” được vết nứt bên trong thép, hãy gửi game cho họ.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onclick: async () => { const u = shareURL(); if (navigator.share) { try { await navigator.share({ title: 'The Invisible Flaw', text: msg, url: u }); return; } catch (e) { /* người dùng hủy hoặc bị chặn */ } } copy(`${msg} ${u}`, 'lời mời và đường dẫn'); } }, 'Chia sẻ'),
          h('button', { class: 'btn ghost', onclick: () => copy(shareURL(), 'đường dẫn') }, 'Sao chép đường dẫn'),
          h('a', { class: 'btn ghost', href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareURL()), target: '_blank', rel: 'noopener', style: 'text-decoration:none' }, 'Chia sẻ lên Facebook'))),
      h('div', { class: 'card' }, h('h2', null, 'Muốn làm NDT thật?'),
        h('p', null, 'Nếu bạn thấy yêu thích công việc kiểm tra không phá hủy: muốn áp dụng một phương pháp cho nhà máy, công trình của mình, hãy tìm tới các công ty làm dịch vụ NDT ở Việt Nam, ví dụ ', h('a', { href: 'https://phateco.com/', target: '_blank', rel: 'noopener' }, 'Công ty Cổ phần Dịch vụ Kỹ thuật PHATECO'), '. Muốn học bài bản và có chứng chỉ thực sự, hãy tìm tới ', h('a', { href: 'https://www.pnic.vn/', target: '_blank', rel: 'noopener' }, 'PNIC – Trung tâm chứng nhận NDT và kiểm định công nghiệp'), ' (chứng nhận theo ISO 9712) hoặc các đơn vị đào tạo khác ở Việt Nam.'),
        h('p', { class: 'dim', style: 'font-size:.88rem' }, 'Chứng chỉ trong game chỉ là mô phỏng, không có giá trị pháp lý.')),
      h('div', { class: 'card' }, h('h2', null, 'Miễn trừ trách nhiệm'),
        h('ul', null,
          h('li', null, 'Đây là sản phẩm **giáo dục và giải trí**. Nội dung không phải tài liệu đào tạo hay thi chứng nhận chính thức, và không thay thế: quy trình kiểm tra bằng văn bản, written practice của đơn vị, tiêu chuẩn và bộ luật áp dụng, chỉ dẫn của người có chứng chỉ Level III, các quy định về an toàn bức xạ, hóa chất và điện.'.replace(/\*\*/g, '')),
          h('li', null, 'Các mô phỏng được đơn giản hóa có chủ đích để dễ học. Số liệu ghi “tham khảo” hoặc “minh họa” không dùng cho tính toán kỹ thuật, thiết kế, lập quy trình hay đánh giá an toàn thực tế.'),
          h('li', null, 'Các tiêu chuẩn (ASME BPVC Section V, Section VIII…) được nhắc tới để học tập; phần tiêu chí trong game có chỗ rút gọn. Luôn dùng ấn bản hiện hành do tổ chức ban hành phát hành. Bản quyền tiêu chuẩn thuộc tổ chức ban hành.'),
          h('li', null, 'Điểm số, “chứng chỉ” Bậc I, II, III trong game không có giá trị pháp lý hay giá trị chứng nhận nhân sự (SNT-TC-1A, ISO 9712 hay bất kỳ hệ thống nào).'),
          h('li', null, 'Mọi công ty, công trình, nhân vật và tình huống trong game đều hư cấu; nếu trùng tên là ngẫu nhiên.'),
          h('li', null, 'Cấu trúc Học viện tham khảo mục lục của NDE-Ed.org (Iowa State University). Nội dung đã viết lại bằng tiếng Việt; game không liên kết và không được NDE-Ed.org bảo trợ.'),
          h('li', null, 'Tác giả không chịu trách nhiệm cho thiệt hại phát sinh từ việc sử dụng nội dung ngoài mục đích học tập.'),
          h('li', null, 'Quyền riêng tư: tiến độ, tên và điểm chỉ lưu trên trình duyệt của bạn (localStorage), không gửi về máy chủ nào. Trang dùng Cloudflare Web Analytics để đếm lượt xem ẩn danh (không cookie, không lưu IP).')),
        h('p', { class: 'dim', style: 'font-size:.88rem' }, 'Phần mềm nguồn mở sử dụng: Three.js r128 (giấy phép MIT); phông Be Vietnam Pro, Noto Serif, Roboto Mono (SIL Open Font License) qua @fontsource.'))));
  }
  G.about = about;
  // chân trang nhỏ dùng ở nhiều nơi
  G.coffeeLine = () => h('p', { class: 'dim', style: 'font-size:.88rem;margin-top:14px' }, 'Thấy game hữu ích? ', h('a', { href: '#', onclick: e => { e.preventDefault(); about(); } }, 'Mời tác giả ly cà phê và chia sẻ cho bạn bè'), '.');
})(this);
