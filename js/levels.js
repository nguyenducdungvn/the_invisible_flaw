/* levels.js — dữ liệu hợp đồng (JSON thuần, không chứa hàm). Thêm màn mới = thêm một object.
 * Mọi công ty, công trình, nhân vật đều hư cấu. Vị trí khuyết tật có `jitter` để mỗi lần chơi lại một khác.
 * `optional: p` = xác suất khuyết tật đó VẮNG MẶT ở lần chơi này → đáp án có thể là ĐẠT, chống chiến thuật “cứ loại hết”.
 */
(function (root) {
  'use strict';
  const LEVELS = [
    {
      id: 'pt1', method: 'PT', order: 1, title: 'Ống inox của nhà máy sữa',
      client: 'Công ty Sữa Đồng Xanh (Bình Dương)', contact: 'Chị Hạnh – trưởng ca bảo trì',
      part: 'Mối hàn giáp mép ống inox 316L, DN100, dày 6 mm, đường cấp sữa tiệt trùng',
      material: 'Thép không gỉ austenit 316L', temp: 30, budget: 18, downtime: 120,
      briefing: 'Sau một đợt rò rỉ nhỏ, khách yêu cầu kiểm tra bề mặt 100 % mối hàn W-07 trước khi chạy lại dây chuyền. Tiêu chí: ASME VIII Div.1 Phụ lục 8. Dây chuyền đang dừng: mỗi phút đều tốn tiền.',
      methods: [
        { id: 'MT', label: 'Hạt từ dùng gông (MT)', cost: 3, time: 20, ok: false,
          lure: 'Rẻ nhất, nhanh nhất – gông đã có sẵn trên xe',
          why: 'Inox 316L là thép austenit, gần như không nhiễm từ: không tạo được từ thông rò, MT không dùng được.' },
        { id: 'RT', label: 'Chụp bức xạ (RT)', cost: 14, time: 90, ok: false,
          lure: 'Có phim lưu hồ sơ, “chắc ăn” nhất',
          why: 'RT kém nhạy với vết nứt bề mặt khít nằm lệch hướng chùm tia, lại tốn kém, phải phong tỏa khu vực. Không phải phương pháp cho yêu cầu “bề mặt 100 %”.' },
        { id: 'PT', label: 'Thẩm thấu màu (PT, loại tẩy bằng dung môi)', cost: 5, time: 45, ok: true,
          why: 'Phù hợp: phát hiện bất liên tục hở ra bề mặt trên vật liệu không xốp, kể cả không nhiễm từ.' },
        { id: 'VT', label: 'Chỉ kiểm tra bằng mắt (VT)', cost: 1, time: 10, ok: false,
          lure: 'Nhanh, khách đang sốt ruột',
          why: 'VT là bước bắt buộc trước tiên nhưng không thay được PT khi hợp đồng yêu cầu PT; vết nứt khít không thấy bằng mắt thường.' }
      ],
      lab: 'capillary', criteria: 'ASME8-App8',
      indications: [
        { id: 'A', kind: 'crack', x: 38, y: 0.2, len: 9, wid: 0.6, angle: 8, jitter: 15, faint: 0.55, atlas: 'crack', optional: 0.35 },
        { id: 'B', kind: 'pore', x: 70, y: -0.8, len: 2.4, wid: 2.2, jitter: 8, atlas: 'pore' },
        { id: 'C', kind: 'pore', x: 102, y: 0.6, len: 1.2, wid: 1.1, jitter: 8, atlas: 'pore' },
        { id: 'D', kind: 'bleed', x: 125, y: 3.2, len: 6, wid: 1.8, jitter: 6, atlas: 'bleed' }
      ],
      after: {
        correctReject: 'Sáu tháng sau: mối hàn W-07 được mài, hàn lại và PT lại đạt. Dây chuyền chạy ổn định, không còn rò rỉ. Chị Hạnh gửi lời cảm ơn.',
        wrongAccept: 'Sáu tháng sau: vết nứt ở W-07 lan qua thành ống dưới tác động của chu kỳ nhiệt khi vệ sinh CIP. Sữa rò ra, cả lô bị hủy; đoàn kiểm tra an toàn thực phẩm vào cuộc.',
        wrongReject: 'Sáu tháng sau: không có sự cố, nhưng khách đã phải cắt và hàn lại một mối hàn hoàn toàn đạt. Chi phí thừa bị trừ vào uy tín của bạn.',
        correctAccept: 'Sáu tháng sau: không có sự cố.'
      }
    },
    {
      id: 'mt1', method: 'MT', order: 2, title: 'Giá treo cẩu ở cảng',
      client: 'Cảng Container Bến Lạch (Hải Phòng)', contact: 'Anh Tùng – kỹ sư thiết bị nâng',
      part: 'Mối hàn góc chân giá treo palăng, thép S355, chiều dài đường hàn 160 mm',
      material: 'Thép kết cấu S355 (sắt từ)', temp: 27, budget: 16, downtime: 100,
      briefing: 'Thợ vận hành nghe tiếng “tách” khi nâng tải 8 tấn. Cần kiểm tra vết nứt bề mặt và gần bề mặt ở mối hàn chân giá trước khi cho cẩu chạy lại. Tiêu chí: ASME VIII Div.1 Phụ lục 6 (theo đặc tính kỹ thuật của khách).',
      methods: [
        { id: 'VT', label: 'Kiểm tra bằng mắt và kính lúp (VT)', cost: 1, time: 10, ok: false,
          lure: 'Nhanh nhất, cẩu chạy lại sớm',
          why: 'Không phát hiện được vết nứt gần bề mặt hoặc nứt khít bị sơn che.' },
        { id: 'MT', label: 'Hạt từ ướt, gông điện xoay chiều (MT)', cost: 4, time: 40, ok: true,
          why: 'Thép S355 là sắt từ; MT phát hiện cả bất liên tục bề mặt và gần bề mặt, nhanh hơn PT trên bề mặt sơn mỏng đã làm sạch.' },
        { id: 'UT', label: 'Siêu âm đầu dò góc (UT)', cost: 9, time: 80, ok: false,
          lure: 'Thiết bị “xịn” nhất trên xe',
          why: 'UT mạnh với khuyết tật bên trong; với mối hàn góc nhỏ và nứt chân bề mặt, MT nhanh và chắc hơn.' },
        { id: 'RT', label: 'Chụp bức xạ (RT)', cost: 14, time: 120, ok: false,
          lure: 'Có phim làm bằng chứng',
          why: 'Mối hàn góc khó bố trí phim, nứt bề mặt khít dễ lọt; phải dừng cả khu vực cảng để chiếu.' }
      ],
      lab: 'magnet', criteria: 'ASME8-App6',
      weldLen: 160,
      indications: [
        { id: 'A', kind: 'crack', x: 52, y: 0, len: 12, wid: 0.5, angle: 0, jitter: 30, atlas: 'crack', optional: 0.45 },   // dọc mối hàn
        { id: 'B', kind: 'crack', x: 118, y: 0, len: 6, wid: 0.5, angle: 90, jitter: 20, atlas: 'crack', optional: 0.45 },  // ngang mối hàn
        { id: 'C', kind: 'nonrel', x: 145, y: 6, len: 8, wid: 3, angle: 90, jitter: 5, atlas: 'mtwriting' }
      ],
      after: {
        correctReject: 'Sáu tháng sau: chân giá được gia cố và hàn lại. Cẩu chạy 3 ca/ngày không sự cố.',
        wrongAccept: 'Sáu tháng sau: vết nứt chân giá lan dài dưới tải lặp. Giá treo gãy khi đang nâng container, may mắn không có người bên dưới.',
        wrongReject: 'Sáu tháng sau: cẩu dừng thêm 2 ngày để sửa một mối hàn không có lỗi.',
        correctAccept: 'Sáu tháng sau: không có sự cố.'
      }
    },
    {
      id: 'ut1', method: 'UT', order: 3, title: 'Dầm cầu thép đêm thứ Sáu',
      client: 'Ban QLDA Cầu Phú Lợi (hư cấu)', contact: 'Chú Bảy – giám sát hiện trường',
      part: 'Mối hàn giáp mép vát chữ V một phía, tấm cánh dầm dày 25 mm',
      material: 'Thép cầu cacbon (vS = 3240 m/s)', T: 25, bevel: 30, rootGap: 2, weldLen: 200, budget: 30, downtime: 180,
      briefing: 'Mối hàn nối dầm cần kiểm tra thể tích 100 %. Ban QLDA KHÔNG cho phong tỏa giao thông (không chiếu xạ). Tiêu chí: ASME VIII Div.1 Phụ lục 12 (theo yêu cầu kỹ thuật dự án). Thiết bị: máy dò khuyết tật, đầu dò góc 60°, mẫu chuẩn cơ sở T = 25 mm có lỗ khoan cạnh ở T/4, T/2, 3T/4.',
      methods: [
        { id: 'RT', label: 'Chụp bức xạ (RT)', cost: 18, time: 200, ok: false,
          lure: 'Quen thuộc, có phim lưu hồ sơ',
          why: 'Hợp đồng cấm phong tỏa giao thông; RT cần vùng kiểm soát bức xạ. Ngoài ra RT kém nhạy với không ngấu thành vát nằm nghiêng.' },
        { id: 'UTA', label: 'Siêu âm đầu dò góc 60° (UT)', cost: 8, time: 120, ok: true,
          why: 'Đúng: kiểm tra thể tích mối hàn giáp mép, không cần phong tỏa, nhạy với khuyết tật phẳng như không ngấu.' },
        { id: 'UTN', label: 'Siêu âm đầu dò thẳng (0°)', cost: 6, time: 60, ok: false,
          lure: 'Hiệu chuẩn nhanh, dễ đọc',
          why: 'Mặt mối hàn còn gờ (cap) nên không đặt đầu dò lên trên được; khuyết tật thành vát song song chùm tia 0° gần như không phản xạ về.' },
        { id: 'PT', label: 'Thẩm thấu (PT)', cost: 4, time: 40, ok: false,
          lure: 'Rẻ nhất',
          why: 'PT chỉ thấy bất liên tục hở ra bề mặt; yêu cầu là kiểm tra thể tích.' }
      ],
      lab: 'snell', criteria: 'ASME8-App12',
      probe: { angle: 60, delayUs: 5.2, trueGain: 44 },
      reflectors: [
        { id: 'A', type: 'lof', x1: 60, x2: 75, depth: 8, side: 'near', rel: 4, jitter: 40, atlas: 'lof', optional: 0.35 },
        { id: 'B', type: 'slag', x1: 140, x2: 146, depth: 14, side: 'center', rel: 2, jitter: 20, atlas: 'slag' }
      ],
      after: {
        correctReject: 'Sáu tháng sau: hai mối hàn đã sửa được UT lại đạt. Cầu thông xe đúng hạn, kiểm định tải trọng đạt.',
        wrongAccept: 'Sáu tháng sau: vết không ngấu thành vát phát triển thành nứt mỏi dưới tải xe tải nặng; cầu phải hạn chế tải trọng khẩn cấp.',
        wrongReject: 'Sáu tháng sau: ban QLDA phải sửa thêm một đoạn hàn không cần sửa, chậm tiến độ 3 ngày.',
        correctAccept: 'Sáu tháng sau: không có sự cố.'
      }
    },
    {
      id: 'rt1', method: 'RT', order: 4, title: 'Đường ống khí lúc nửa đêm',
      client: 'Nhà máy điện khí Long Sơn (hư cấu)', contact: 'Chị Ngân – QA/QC chủ đầu tư',
      part: 'Mối hàn giáp mép ống thép, thành dày 12 mm, chụp một thành – một ảnh (phim đặt trong)',
      material: 'Thép API 5L X52', t: 12, budget: 28, downtime: 150,
      briefing: 'Đặc tính kỹ thuật của chủ đầu tư yêu cầu RT có phim lưu trữ cho mối hàn W-112. Nguồn Ir-192 có chứng chỉ hoạt độ 1850 GBq, đo ngày 26/08/2026 (cách hôm nay 90 ngày). Tiêu chí vận hành an toàn bức xạ của dự án: hàng rào đặt nơi suất liều ≤ 7.5 µSv/h khi đang chiếu; vị trí thợ chụp đứng điều khiển ≤ 10 µSv/h. Ống chuẩn trực giảm 16 lần theo các hướng ngoài chùm. Thợ chụp có cáp điều khiển 7.6 m hoặc 15 m; hiện trường có vách thép 25 mm của nhà bơm để đứng sau. Tiêu chí: ASME VIII UW-51 (rút gọn).',
      methods: [
        { id: 'UT', label: 'Siêu âm thay chụp (UT)', cost: 8, time: 100, ok: false,
          lure: 'Không phải dựng rào, an toàn hơn',
          why: 'Đặc tính kỹ thuật của chủ đầu tư yêu cầu RT có phim lưu trữ; đổi phương pháp cần chấp thuận bằng văn bản, không được tự ý.' },
        { id: 'RTX', label: 'Máy phát tia X 200 kV', cost: 12, time: 150, ok: false,
          lure: 'Tắt máy là hết bức xạ',
          why: 'Máy phát tia X có thể dùng, nhưng hiện trường không có nguồn điện ổn định và máy không đi vào được giá ống. Hồ sơ kỹ thuật chỉ định Ir-192.' },
        { id: 'RTG', label: 'Nguồn gamma Ir-192', cost: 14, time: 130, ok: true,
          why: 'Đúng theo đặc tính kỹ thuật: Ir-192 dùng cho thép dày khoảng 10–90 mm (ISO 5579), cơ động ở hiện trường.' }
      ],
      lab: 'radiation', criteria: 'ASME8-UW51',
      source: { A0: 1850, days: 90, size: 3.0, limit: 7.5, opLimit: 10, shield: 16, E1m: 220, wall: 25 },
      indications: [
        { id: 'A', kind: 'crack', x: 55, y: 0.5, len: 7, wid: 0.4, jitter: 20, atlas: 'crack', optional: 0.35 },
        { id: 'B', kind: 'slag', x: 100, y: -1, len: 4.5, wid: 1.0, jitter: 15, atlas: 'slag' },
        { id: 'C', kind: 'pore', x: 140, y: 1, len: 1.6, wid: 1.6, jitter: 10, atlas: 'pore' },
        { id: 'D', kind: 'artifact', x: 160, y: 9, len: 9, wid: 3, jitter: 6, atlas: 'artifact' }
      ],
      after: {
        correctReject: 'Sáu tháng sau: W-112 đã được khoét, hàn lại và chụp lại đạt. Ống chạy áp lực thiết kế không sự cố.',
        wrongAccept: 'Sáu tháng sau: vết nứt chân ở W-112 gây rò khí khi thử áp vận hành. Nhà máy dừng tổ máy 4 ngày.',
        wrongReject: 'Sáu tháng sau: một mối hàn đạt bị khoét bỏ; chủ đầu tư phàn nàn về chi phí.',
        correctAccept: 'Sáu tháng sau: không có sự cố.'
      }
    }
  ];

  const ATLAS = {
    crack:     { name: 'Nứt', note: 'Bất liên tục phẳng, đầu nhọn. Nguy hiểm nhất vì tập trung ứng suất; hầu hết tiêu chuẩn loại bỏ bất kể kích thước.' },
    pore:      { name: 'Rỗ khí', note: 'Lỗ tròn do khí bị giữ lại khi kim loại đông đặc. Trên PT/MT hiện là chỉ thị tròn; trên phim là chấm đen tròn rõ biên.' },
    bleed:     { name: 'Chất thấm đọng (không liên quan)', note: 'Chất thấm còn sót ở rãnh chân mối hàn do lau chưa sạch. Lau và hiện hình lại thì biến mất: không phải bất liên tục.' },
    mtwriting: { name: 'Chỉ thị không liên quan ở chỗ đổi tiết diện', note: 'Bột từ bám mờ, rộng ở chỗ thay đổi tiết diện đột ngột vì từ thông rò do hình học, không phải vết nứt.' },
    lof:       { name: 'Không ngấu thành vát', note: 'Kim loại hàn không nóng chảy với mép vát. Phản xạ mạnh khi chùm tia vuông góc mặt vát; được coi là khuyết tật phẳng, loại bỏ bất kể chiều dài theo ASME VIII Phụ lục 12.' },
    slag:      { name: 'Ngậm xỉ', note: 'Xỉ hàn bị kẹt giữa các lớp. Bề mặt gồ ghề nên tín hiệu UT thấp hơn và “nhiều đỉnh”; đánh giá theo biên độ và chiều dài.' },
    geom:      { name: 'Tín hiệu hình học (chân mối hàn)', note: 'Phản xạ từ gờ chân mối hàn ở độ sâu đúng bằng chiều dày, chạy liên tục dọc mối hàn. Không phải khuyết tật.' },
    artifact:  { name: 'Vết phóng tĩnh điện trên phim', note: 'Vệt đen phân nhánh như cành cây, có thể nằm cả ngoài vùng mối hàn: lỗi xử lý phim, không phải khuyết tật.' }
  };

  const api = { LEVELS, ATLAS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else { root.LEVELS = LEVELS; root.ATLAS = ATLAS; }
})(this);
