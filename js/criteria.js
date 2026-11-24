/* criteria.js — tiêu chí chấp nhận dùng trong game. Mỗi bộ ghi nguồn; chỗ đơn giản hóa ghi rõ. */
(function (root) {
  'use strict';
  const CRITERIA = {
    'ASME8-App8': {
      name: 'ASME VIII Div.1 – Phụ lục bắt buộc 8 (PT)',
      rules: [
        'Chỉ thị có kích thước lớn nhất > 1,5 mm mới được coi là liên quan.',
        'Chỉ thị dạng đường: dài > 3 lần rộng.',
        'Loại bỏ: mọi chỉ thị dạng đường liên quan.',
        'Loại bỏ: chỉ thị tròn liên quan > 5 mm (3/16 in).',
        'Loại bỏ: từ 4 chỉ thị tròn liên quan trở lên nằm trên một đường, cách nhau ≤ 1,5 mm (mép tới mép).'
      ],
      evaluate(inds) { return surfaceEval(inds); }
    },
    'ASME8-App6': {
      name: 'ASME VIII Div.1 – Phụ lục bắt buộc 6 (MT)',
      rules: [
        'Chỉ thị có kích thước lớn nhất > 1,5 mm mới được coi là liên quan.',
        'Loại bỏ: mọi chỉ thị dạng đường liên quan; chỉ thị tròn liên quan > 5 mm; 4 chỉ thị tròn thẳng hàng cách ≤ 1,5 mm.'
      ],
      evaluate(inds) { return surfaceEval(inds); }
    },
    'ASME8-App12': {
      name: 'ASME VIII Div.1 – Phụ lục bắt buộc 12 (UT mối hàn)',
      rules: [
        'Chỉ thị có biên độ > 20 % mức chuẩn (DAC) phải được điều tra: hình dạng, bản chất, vị trí.',
        'Loại bỏ bất kể chiều dài: nứt, không ngấu (thiếu nóng chảy), không thấu.',
        'Khuyết tật khác bị loại nếu biên độ VƯỢT mức chuẩn VÀ chiều dài > 6 mm (t ≤ 19 mm); > t/3 (19 < t ≤ 57 mm); > 19 mm (t > 57 mm).'
      ],
      evaluate(inds, t) {
        const lim = t <= 19 ? 6 : t <= 57 ? t / 3 : 19; const why = [];
        for (const i of inds) {
          if (['crack', 'lof', 'ip'].includes(i.type)) why.push(`${i.label}: ${TYPE[i.type]} → loại bỏ bất kể chiều dài`);
          else if (i.overDAC && i.len > lim) why.push(`${i.label}: ${TYPE[i.type]} vượt DAC và dài ${i.len.toFixed(1)} mm > ${lim.toFixed(1)} mm`);
        }
        return { accept: why.length === 0, why, limit: lim };
      }
    },
    'ASME8-UW51': {
      name: 'ASME VIII Div.1 – UW-51(b) (RT toàn phần) · rút gọn cho game',
      rules: [
        'Loại bỏ: chỉ thị là nứt, không ngấu hoặc không thấu.',
        'Loại bỏ: chỉ thị kéo dài khác dài > 6 mm (t ≤ 19 mm); > t/3 (19 < t ≤ 57 mm); > 19 mm (t > 57 mm).',
        'Chỉ thị tròn đánh giá theo Phụ lục 4 (game rút gọn: rỗ đơn lẻ ≤ min(t/4; 4 mm) được chấp nhận).',
        'Bỏ qua trong game: quy tắc nhóm thẳng hàng 12t và bảng mật độ rỗ của Phụ lục 4.'
      ],
      evaluate(inds, t) {
        const lim = t <= 19 ? 6 : t <= 57 ? t / 3 : 19, pore = Math.min(t / 4, 4); const why = [];
        for (const i of inds) {
          if (['crack', 'lof', 'ip'].includes(i.type)) why.push(`${i.label}: ${TYPE[i.type]} → loại bỏ`);
          else if (i.type === 'slag' && i.len > lim) why.push(`${i.label}: xỉ dài ${i.len.toFixed(1)} mm > ${lim.toFixed(1)} mm`);
          else if (i.type === 'pore' && i.len > pore) why.push(`${i.label}: rỗ ${i.len.toFixed(1)} mm > ${pore.toFixed(1)} mm`);
        }
        return { accept: why.length === 0, why, limit: lim };
      }
    }
  };
  function surfaceEval(inds) {
    const rel = inds.filter(i => i.len > 1.5), why = [];
    for (const i of rel) {
      if (i.type === 'linear') why.push(`${i.label}: chỉ thị dạng đường dài ${i.len.toFixed(1)} mm → loại bỏ`);
      else if (i.type === 'rounded' && i.len > 5) why.push(`${i.label}: chỉ thị tròn ${i.len.toFixed(1)} mm > 5 mm`);
    }
    const rounds = rel.filter(i => i.type === 'rounded').sort((a, b) => a.x - b.x);
    for (let k = 0; k + 3 < rounds.length; k++) {
      const grp = rounds.slice(k, k + 4);
      if (grp.every((r, j) => j === 0 || (r.x - r.len / 2) - (grp[j - 1].x + grp[j - 1].len / 2) <= 1.5)) {
        why.push('Nhóm ≥ 4 chỉ thị tròn thẳng hàng cách ≤ 1,5 mm'); break;
      }
    }
    return { accept: why.length === 0, why };
  }
  const TYPE = { linear: 'chỉ thị dạng đường', rounded: 'chỉ thị tròn', crack: 'nứt', lof: 'không ngấu (thiếu nóng chảy)',
    ip: 'không thấu', slag: 'ngậm xỉ', pore: 'rỗ khí', geom: 'tín hiệu hình học', artifact: 'khuyết tật phim (giả)', nonrel: 'không liên quan' };
  const api = { CRITERIA, TYPE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else { root.CRITERIA = CRITERIA; root.TYPE = TYPE; }
})(this);
