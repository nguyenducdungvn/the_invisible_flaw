/* levels_more.js — 5 hợp đồng hiện trường bổ sung: VT, ET, AE, nhiệt ảnh (IR), vi ba (MW). Dữ liệu thuần, công ty và công trình đều hư cấu.
 * `group`: các chỉ thị cùng nhóm cùng có mặt hoặc cùng vắng (xử lý trong m_more.js). Tiêu chí ghi rõ nguồn và chỗ rút gọn.
 */
(function (root) {
  'use strict';
  const LEVELS_MORE = [
    {
      id: 'vt1', method: 'VT', order: 5, title: 'Chân cột nhà kho mới',
      client: 'Công ty Kết cấu thép Sông Cầu (Bắc Ninh)', contact: 'Anh Quân – quản đốc xưởng hàn',
      part: 'Mối hàn góc 8 mm chân cột với bản đế, thép SS400 dày 12 mm, đoạn dài 300 mm. Kết cấu chịu tải tĩnh.',
      material: 'Thép kết cấu SS400 (sắt từ)', temp: 31, budget: 10, downtime: 90, t: 12, weldLen: 300,
      briefing: 'Hợp đồng yêu cầu kiểm tra bằng mắt 100 % mối hàn trước khi sơn và trước mọi phương pháp NDT khác. Tiêu chí: AWS D1.1 Bảng 8.1, kết cấu không phải ống, chịu tải tĩnh. Xưởng muốn sơn ngay chiều nay.',
      methods: [
        { id: 'VT', label: 'Kiểm tra bằng mắt có dụng cụ đo (VT)', cost: 1.5, time: 30, ok: true,
          why: 'Đúng yêu cầu hợp đồng. VT phát hiện và đo được nứt bề mặt, cháy cạnh, rỗ bề mặt, kích thước và biên dạng mối hàn: những thứ PT, UT hay RT không đo được.' },
        { id: 'PT', label: 'Thẩm thấu màu (PT)', cost: 4, time: 45, ok: false, lure: 'Thấy vết nứt rõ hơn',
          why: 'PT chỉ làm khi VT nghi ngờ nứt hoặc khi hợp đồng yêu cầu. PT không đo được cháy cạnh, kích thước chân mối hàn, biên dạng.' },
        { id: 'UT', label: 'Siêu âm đầu dò góc (UT)', cost: 9, time: 80, ok: false, lure: 'Thiết bị hiện đại nhất trên xe',
          why: 'UT dành cho khuyết tật bên trong mối hàn ngấu hoàn toàn; không thay được VT. Mối hàn góc 8 mm lại rất khó siêu âm.' },
        { id: 'PHOTO', label: 'Chụp ảnh điện thoại gửi tư vấn giám sát tự xem', cost: 0.3, time: 5, ok: false, lure: 'Nhanh nhất, khỏi ngồi soi',
          why: 'Ảnh chụp không đo được độ sâu cháy cạnh, không đủ ánh sáng xiên; người ký biên bản phải trực tiếp kiểm tra theo quy trình VT.' }
      ],
      lab: 'visual', criteria: 'AWS-D11-VT',
      indications: [
        { id: 'A', kind: 'crack', x: 291, y: 0.5, len: 4, jitter: 3, faint: 0.5, atlas: 'cratercrack', optional: 0.5 },
        { id: 'B', kind: 'undercut', x: 60, y: -3.6, len: 40, depth: 1.4, jitter: 15, atlas: 'undercut' },
        { id: 'C', kind: 'undercut', x: 185, y: -3.6, len: 25, depth: 1.2, jitter: 15, atlas: 'undercut', optional: 0.5 },
        { id: 'D1', kind: 'pore', x: 128, y: 1.2, len: 1.5, jitter: 0, atlas: 'pore' }, { id: 'D2', kind: 'pore', x: 136, y: -0.6, len: 1.2, jitter: 0, atlas: 'pore' }, { id: 'D3', kind: 'pore', x: 143, y: 0.8, len: 2.0, jitter: 0, atlas: 'pore' },
        { id: 'E1', kind: 'pore', x: 236, y: 0.4, len: 3.0, group: 'E', optional: 0.5, atlas: 'pore' }, { id: 'E2', kind: 'pore', x: 243, y: -1.0, len: 3.5, group: 'E', atlas: 'pore' }, { id: 'E3', kind: 'pore', x: 251, y: 1.0, len: 4.0, group: 'E', atlas: 'pore' },
        { id: 'F', kind: 'spatter', x: 100, y: 6.5, len: 1.6, jitter: 20, atlas: 'spatter' }, { id: 'G', kind: 'spatter', x: 210, y: -7, len: 1.3, jitter: 20, atlas: 'spatter' }
      ],
      after: {
        correctReject: 'Hai tuần sau: các đoạn cháy cạnh được hàn đắp và mài, rỗ được khoét và hàn lại, VT lại đạt. Nhà kho lắp dựng đúng tiến độ.',
        wrongAccept: 'Hai tuần sau: lớp sơn bong đúng chỗ cháy cạnh và rỗ; đơn vị tư vấn giám sát lập biên bản không phù hợp, cả lô cột phải cạo sơn kiểm tra lại.',
        wrongReject: 'Hai tuần sau: không có vấn đề gì, nhưng xưởng đã phải sửa một mối hàn đạt yêu cầu. Anh Quân không vui.',
        correctAccept: 'Hai tuần sau: cột được sơn và lắp dựng, không có ý kiến gì từ tư vấn giám sát.'
      }
    },
    {
      id: 'et1', method: 'ET', order: 6, title: 'Lỗ đinh tán vỏ cánh máy bay huấn luyện',
      client: 'Trường bay Cánh Diều (hư cấu)', contact: 'Anh Long – trưởng ca kỹ thuật',
      part: 'Hàng 8 đinh tán đầu chìm trên tấm vỏ hợp kim nhôm 2024-T3 dày 1,6 mm, có lớp sơn khoảng 50–100 µm. Vùng hay nứt mỏi quanh lỗ.',
      material: 'Hợp kim nhôm 2024-T3 (≈ 30 % IACS, không nhiễm từ)', temp: 28, budget: 15, downtime: 120,
      briefing: 'Đợt kiểm tra định kỳ yêu cầu tìm nứt mỏi bề mặt xuất phát từ lỗ đinh tán, không tháo đinh, không bóc sơn. Tiêu chí: quy trình NDT của xưởng (hư cấu, viết theo kiểu sổ tay NDT máy bay). Máy bay có lịch bay sáng mai.',
      methods: [
        { id: 'ET', label: 'Dòng điện xoáy bề mặt, đầu dò bút chì tần số cao (ET)', cost: 5, time: 50, ok: true,
          why: 'Đúng: ET phát hiện nứt bề mặt trên kim loại dẫn điện qua lớp sơn mỏng, không cần bóc sơn, không cần tháo đinh, cho kết quả ngay.' },
        { id: 'PT', label: 'Thẩm thấu màu (PT)', cost: 4, time: 60, ok: false, lure: 'Rẻ, quen tay',
          why: 'PT cần bóc sơn đến kim loại trần, và vết nứt mỏi khít dưới mũ đinh vẫn khó lộ ra. Hợp đồng yêu cầu không bóc sơn.' },
        { id: 'MT', label: 'Hạt từ (MT)', cost: 3, time: 30, ok: false, lure: 'Nhanh nhất',
          why: 'Nhôm không nhiễm từ: MT không dùng được.' },
        { id: 'RT', label: 'Chụp X-quang (RT)', cost: 12, time: 120, ok: false, lure: 'Thấy được dưới mũ đinh',
          why: 'Nứt mỏi rất khít, nằm vuông góc mặt tấm, dễ lọt khi chụp; phải phong tỏa nhà chứa máy bay. Không hợp với nứt bề mặt nhỏ.' }
      ],
      lab: 'eddy', criteria: 'ET-AL-SURF', sigmaIACS: 30,
      indications: [
        { id: 'A', kind: 'crack', hole: 2, ang: 90, depth: 0.6, jitter: 0, atlas: 'fatigue', optional: 0.4 },
        { id: 'B', kind: 'crack', hole: 5, ang: 270, depth: 0.3, jitter: 0, atlas: 'fatigue', optional: 0.5 },
        { id: 'C', kind: 'liftoff', hole: 3, ang: 200, jitter: 0, atlas: 'liftoff' },
        { id: 'D', kind: 'cond', hole: 7, ang: 0, jitter: 0, atlas: 'condchange' }
      ],
      after: {
        correctReject: 'Một tháng sau: lỗ có nứt được doa rộng, kiểm tra lại sạch nứt và lắp đinh lớn hơn theo hướng dẫn sửa chữa. Máy bay bay an toàn.',
        wrongAccept: 'Một tháng sau: vết nứt mỏi lan sang lỗ bên cạnh, phát hiện khi một học viên thấy vệt dầu lạ trên cánh. Máy bay nằm đất ba tuần, cơ quan quản lý vào cuộc.',
        wrongReject: 'Một tháng sau: kiểm tra lại cho thấy không có nứt. Lịch bay bị hủy một ngày oan uổng.',
        correctAccept: 'Một tháng sau: không có vấn đề gì. Hồ sơ NDT sạch sẽ cho đợt bảo dưỡng tiếp theo.'
      }
    },
    {
      id: 'ae1', method: 'AE', order: 7, title: 'Bồn LPG kiểm định định kỳ',
      client: 'Kho LPG Cửa Biển (Đà Nẵng)', contact: 'Chị Ngân – phụ trách an toàn kho',
      part: 'Bồn trụ nằm ngang chứa LPG, thép cacbon, dài 12 m, đặt trên 2 gối đỡ ở 2,0 m và 10,0 m. Bọc cách nhiệt, chỉ hở các ô cửa cảm biến.',
      material: 'Thép bình áp lực (sắt từ), có lớp cách nhiệt', budget: 26, downtime: 240,
      briefing: 'Kiểm định định kỳ: thử thủy lực có giám sát phát xạ âm để nghe toàn bộ thân bồn khi tăng áp, sau đó chỉ kiểm tra bổ sung tại các vùng nghi ngờ. Tiêu chí: quy trình AE của đơn vị (rút gọn theo cách tiếp cận của ASME V Điều 12). Kho đang thiếu chỗ chứa, muốn đưa bồn vào lại sớm.',
      methods: [
        { id: 'AE', label: 'Phát xạ âm khi thử thủy lực (AE)', cost: 12, time: 120, ok: true,
          why: 'Đúng: AE nghe cả thân bồn trong một lần tăng áp, chỉ cần mở vài ô cách nhiệt để gắn cảm biến; vết nứt đang phát triển dưới tải tự “lên tiếng”.' },
        { id: 'UT', label: 'Siêu âm toàn bộ đường hàn (UT)', cost: 30, time: 900, ok: false, lure: 'Thấy từng milimét đường hàn',
          why: 'Phải bóc toàn bộ cách nhiệt, nhiều ngày công. Hợp lý hơn là AE trước, rồi UT đúng chỗ nghi ngờ.' },
        { id: 'VT', label: 'Kiểm tra bằng mắt bên ngoài (VT)', cost: 2, time: 60, ok: false, lure: 'Rẻ nhất',
          why: 'Thân bồn bọc cách nhiệt, VT bên ngoài không thấy vết nứt trong mối hàn hay ở mặt trong.' },
        { id: 'RT', label: 'Chụp bức xạ (RT)', cost: 40, time: 1200, ok: false, lure: 'Có phim làm bằng chứng',
          why: 'Hàng trăm phim, phong tỏa kho nhiều ngày; không thực tế cho cả thân bồn.' }
      ],
      lab: 'aeloc', criteria: 'AE-VESSEL', L: 12, sensors: [0, 4, 8, 12], vTrue: 3050,
      indications: [
        { id: 'A', kind: 'active', x: 5.3, jitter: 0.8, atlas: 'aeactive', optional: 0.35 },
        { id: 'B', kind: 'active', x: 8.9, weak: true, jitter: 0.5, atlas: 'aeactive', optional: 0.6 },
        { id: 'S1', kind: 'friction', x: 2.0, atlas: 'aefriction' }, { id: 'S2', kind: 'friction', x: 10.0, atlas: 'aefriction' },
        { id: 'P', kind: 'noise', x: 11.6, atlas: 'aenoise' }
      ],
      after: {
        correctReject: 'Một tuần sau: UT và MT tại vùng phát xạ tìm thấy vết nứt chân mối hàn dài 35 mm; bồn được sửa, thử lại đạt. Chị Ngân gửi lời cảm ơn.',
        wrongAccept: 'Sáu tháng sau: vết nứt xuyên thành, LPG rò rỉ, cả kho phải sơ tán. May mắn không có tia lửa.',
        wrongReject: 'Một tuần sau: UT bổ sung không tìm thấy gì ở vùng bạn khoanh; bồn nằm chờ oan một tuần.',
        correctAccept: 'Một tuần sau: bồn vận hành bình thường, hồ sơ AE lưu làm mốc cho lần kiểm định sau.'
      }
    },
    {
      id: 'ir1', method: 'IR', order: 8, title: 'Nắp khoang composite sau va đập',
      client: 'Xưởng sửa chữa composite Sao Mai (hư cấu)', contact: 'Chị Mai – kỹ sư vật liệu',
      part: 'Tấm CFRP dày 4 mm, 200 × 50 mm vùng quan tâm, có gân tăng cứng dán ở mặt sau. Dụng cụ rơi trúng nhưng mặt ngoài gần như không thấy vết.',
      material: 'Composite sợi carbon (CFRP), sơn mờ; α theo chiều dày ≈ 4·10⁻⁷ m²/s', temp: 27, budget: 14, downtime: 120,
      briefing: 'Va đập năng lượng thấp trên composite thường để lại tách lớp bên trong mà bề mặt gần như nguyên vẹn. Cần khoanh vùng và đo đường kính tách lớp. Tiêu chí: tài liệu sửa chữa của xưởng (hư cấu): tách lớp đường kính > 10 mm phải sửa.',
      methods: [
        { id: 'IR', label: 'Nhiệt ảnh xung (đèn flash + camera hồng ngoại)', cost: 6, time: 40, ok: true,
          why: 'Đúng: nhiệt ảnh xung chụp cả vùng một lần, không tiếp xúc, rất hợp với tách lớp nông trong composite mỏng.' },
        { id: 'MT', label: 'Hạt từ (MT)', cost: 3, time: 30, ok: false, lure: 'Nhanh, rẻ',
          why: 'CFRP không nhiễm từ: MT không dùng được.' },
        { id: 'PT', label: 'Thẩm thấu màu (PT)', cost: 3, time: 45, ok: false, lure: 'Có sẵn bình xịt',
          why: 'Tách lớp nằm bên trong, không hở ra bề mặt; chất thấm còn có thể ngấm vào nhựa và làm hỏng mối sửa chữa sau này.' },
        { id: 'RT', label: 'Chụp X-quang (RT)', cost: 12, time: 120, ok: false, lure: 'Thấy xuyên qua vật',
          why: 'Tách lớp là khe mỏng song song mặt tấm, gần như không đổi độ dày xuyên tia: RT gần như không thấy.' }
      ],
      lab: 'thermal', criteria: 'IR-CFRP', thick: 4, alpha: 4e-7, band: 50, length: 200,
      indications: [
        { id: 'A', kind: 'delam', x: 48, y: 4, len: 14, depth: 0.5, jitter: 10, atlas: 'delam', optional: 0.45 },
        { id: 'B', kind: 'delam', x: 105, y: -8, len: 8, depth: 1.5, jitter: 10, atlas: 'delam' },
        { id: 'C', kind: 'delam', x: 160, y: 6, len: 18, depth: 2.5, jitter: 10, atlas: 'delam', optional: 0.5 },
        { id: 'D', kind: 'emis', x: 78, y: -14, len: 9, jitter: 6, atlas: 'emis' },
        { id: 'E', kind: 'rib', x: 100, y: 17, len: 200, w: 6, jitter: 0, atlas: 'rib' }
      ],
      after: {
        correctReject: 'Ba ngày sau: vùng tách lớp được mài vát và vá theo tài liệu sửa chữa; nhiệt ảnh lại cho thấy sạch. Chị Mai đưa bản đồ của bạn vào hồ sơ.',
        wrongAccept: 'Ba tháng sau: tách lớp lan rộng dưới rung động, tấm mất độ cứng và phải thay cả tấm.',
        wrongReject: 'Ba ngày sau: xưởng mở tấm ra sửa nhưng không thấy tách lớp đáng kể. Tốn công và vật liệu.',
        correctAccept: 'Ba ngày sau: tấm được lắp lại; tách lớp nhỏ ghi vào hồ sơ để theo dõi định kỳ.'
      }
    },
    {
      id: 'mw1', method: 'MW', order: 9, title: 'Mối hàn nhiệt ống HDPE cấp nước',
      client: 'Công ty Cấp nước Sông Hậu (hư cấu)', contact: 'Anh Phúc – chỉ huy trưởng công trường',
      part: 'Mối hàn đối đầu bằng nhiệt ống HDPE PE100 D315, thành dày 28,6 mm. Quét dải 300 mm theo chu vi, mặt nóng chảy nằm ở giữa dải.',
      material: 'Polyetylen mật độ cao PE100 (ε ≈ 2,3, tổn hao thấp)', temp: 33, budget: 16, downtime: 150, eps: 2.3,
      briefing: 'Ống sắp chôn dưới đường. Chủ đầu tư muốn kiểm tra thể tích mối hàn nhiệt trước khi lấp. Ống nhựa nên RT và UT thông thường gặp khó; vi ba đi xuyên được vật liệu điện môi. Tiêu chí: quy trình nghiệm thu của chủ đầu tư (hư cấu).',
      methods: [
        { id: 'MW', label: 'Quét vi ba / sóng milimét (MW)', cost: 9, time: 60, ok: true,
          why: 'Đúng: HDPE là điện môi tổn hao thấp, vi ba đi xuyên và phản xạ ở chỗ hằng số điện môi thay đổi (lỗ rỗng, tạp chất, không ngấu); không cần chất tiếp âm, không có bức xạ ion hóa.' },
        { id: 'MT', label: 'Hạt từ (MT)', cost: 3, time: 30, ok: false, lure: 'Nhanh nhất',
          why: 'Nhựa không nhiễm từ.' },
        { id: 'ET', label: 'Dòng điện xoáy (ET)', cost: 5, time: 40, ok: false, lure: 'Không cần chất tiếp âm',
          why: 'ET cần vật liệu dẫn điện; HDPE là chất cách điện.' },
        { id: 'VT', label: 'Chỉ đo gờ hàn bằng mắt (VT)', cost: 1, time: 15, ok: false, lure: 'Gờ đẹp là mối hàn tốt',
          why: 'Gờ hàn đều là cần nhưng không đủ: không ngấu và tạp chất nằm bên trong mặt nóng chảy.' }
      ],
      lab: 'microwave', criteria: 'MW-HDPE', band: 60, length: 300,
      indications: [
        { id: 'A', kind: 'lof', x: 90, y: 0, len: 40, jitter: 40, atlas: 'coldfusion', optional: 0.45 },
        { id: 'B', kind: 'void', x: 170, y: 1.5, len: 2.5, jitter: 30, atlas: 'pore' },
        { id: 'C', kind: 'incl', x: 230, y: -1.5, len: 5, jitter: 25, atlas: 'inclusion', optional: 0.5 },
        { id: 'M', kind: 'metal', x: 280, y: -20, len: 12, jitter: 5, atlas: 'metal', removable: true }
      ],
      after: {
        correctReject: 'Hôm sau: mối hàn bị cắt bỏ và hàn lại với quy trình làm sạch tốt hơn; mẫu cắt cho thấy đúng vùng bạn khoanh. Ống được lấp đúng hạn.',
        wrongAccept: 'Một năm sau: mối hàn nứt dọc vùng không ngấu khi áp lực nước dao động; phải đào đường để sửa, cả khu dân cư mất nước hai ngày.',
        wrongReject: 'Hôm sau: mối hàn bị cắt bỏ, thử kéo mẫu cắt cho thấy nó đạt. Tốn một mối hàn và nửa ngày.',
        correctAccept: 'Hôm sau: đoạn ống được lấp; bản đồ vi ba lưu vào hồ sơ hoàn công.'
      }
    }
  ];

  const ATLAS_MORE = {
    cratercrack: { name: 'Nứt miệng hàn (nứt crater)', note: 'Nứt hình sao hoặc đường ngắn ở điểm kết thúc đường hàn, do kim loại co ngót khi không lấp đầy miệng hàn. AWS D1.1 cấm mọi vết nứt.' },
    undercut: { name: 'Cháy cạnh', note: 'Rãnh khuyết ở mép kim loại cơ bản dọc chân mối hàn, do dòng hàn hoặc góc que không đúng. Đo độ sâu bằng thước đo mối hàn; ánh sáng chiếu xiên làm rãnh đổ bóng rõ hơn.' },
    spatter: { name: 'Bắn tóe (không liên quan)', note: 'Hạt kim loại bắn ra khi hàn, dính trên bề mặt. Gõ hoặc cạo là bong; làm sạch trước khi sơn nhưng không phải khuyết tật của mối hàn.' },
    fatigue: { name: 'Nứt mỏi quanh lỗ đinh tán', note: 'Nứt xuất phát từ mép lỗ, hướng vuông góc với ứng suất chính. Trên mặt phẳng trở kháng là vòng tín hiệu dựng đứng, khác hẳn hướng nhấc đầu dò.' },
    liftoff: { name: 'Thay đổi khoảng nhấc (sơn dày)', note: 'Lớp sơn dày lên hoặc đầu dò bị nghiêng làm tín hiệu chạy theo phương nhấc đầu dò (đã xoay về nằm ngang). Không phải khuyết tật.' },
    condchange: { name: 'Thay đổi độ dẫn điện', note: 'Vùng tấm vá, hợp kim khác hoặc bị nung nóng làm tín hiệu trôi xiên chậm, không có vòng sắc. Ghi nhận, không phải nứt; nếu nghi hư hỏng do nhiệt thì đo độ dẫn điện riêng.' },
    aeactive: { name: 'Nguồn phát xạ âm hoạt động', note: 'Phát xạ tập trung tại một vị trí, tăng theo áp suất và vẫn tiếp diễn khi giữ áp: dấu hiệu của khuyết tật đang phát triển. Phải kiểm tra bổ sung bằng UT/MT tại đó.' },
    aefriction: { name: 'Ma sát ở gối đỡ', note: 'Thân bồn giãn ra khi tăng áp và cọ vào gối đỡ: phát xạ xuất hiện khi áp tăng, dừng khi giữ áp, nằm đúng vị trí gối đỡ. Ghi nhận, không phải lý do loại.' },
    aenoise: { name: 'Tiếng ồn bơm, dòng chảy', note: 'Biên độ thấp, thời gian tăng dài, liên tục, đến cảm biến bảo vệ trước. Loại khỏi phân tích bằng cảm biến bảo vệ và bộ lọc.' },
    delam: { name: 'Tách lớp do va đập', note: 'Các lớp sợi tách nhau sau va đập. Nhiệt ảnh xung: vùng nóng hơn xuất hiện ở thời điểm t ≈ z²/α; càng sâu càng hiện muộn, mờ và loang rộng.' },
    emis: { name: 'Khác biệt độ phát xạ / phản xạ', note: 'Nhãn bóng, băng dính, chỗ đánh bóng: tương phản có ngay từ khung hình đầu và giữ nguyên theo thời gian, biên sắc. Không phải khuyết tật.' },
    rib: { name: 'Gân tăng cứng mặt sau', note: 'Kết cấu dày hơn hút nhiệt nên hiện thành dải lạnh hơn, muộn, thẳng đúng vị trí trên bản vẽ. Không phải khuyết tật.' },
    coldfusion: { name: 'Không ngấu (mối hàn nhiệt nguội)', note: 'Mặt nóng chảy không liên kết do nhiệt độ, thời gian hoặc áp lực ép không đủ, hay bề mặt bẩn. Nguy hiểm vì mối hàn trông bình thường từ bên ngoài.' },
    inclusion: { name: 'Tạp chất trong mặt nóng chảy', note: 'Cát, bụi, phoi kẹt giữa hai mặt ống khi hàn, do không lau sạch sau khi bào mặt.' },
    metal: { name: 'Vật kim loại gần vùng quét', note: 'Kim loại phản xạ gần như toàn phần vi ba (|Γ| ≈ 1): đốm rất sáng, che khuất mọi thứ phía sau. Tháo đai, băng nhôm trước khi quét hoặc ghi vào sơ đồ.' }
  };

  const CRITERIA_MORE = {
    'AWS-D11-VT': {
      name: 'AWS D1.1 – Bảng 8.1, kiểm tra bằng mắt, kết cấu không phải ống chịu tải tĩnh (rút gọn)',
      rules: [
        'Nứt: không cho phép, bất kể kích thước hay vị trí.',
        'Cháy cạnh (kim loại cơ bản dày < 25 mm): sâu không quá 1 mm; được phép tới 2 mm nếu tổng chiều dài các đoạn sâu hơn 1 mm không quá 50 mm trong 300 mm mối hàn.',
        'Rỗ ống nhìn thấy (đường kính ≥ 1 mm) ở mối hàn góc: tổng đường kính không quá 10 mm trong mỗi 25 mm chiều dài, không quá 19 mm trong 300 mm.',
        'Bắn tóe: làm sạch trước khi sơn, không phải khuyết tật của mối hàn.',
        'Bỏ qua trong game: kích thước chân, biên dạng lồi, lấp đầy miệng hàn.'
      ],
      evaluate(inds) {
        const why = [];
        for (const i of inds) if (i.type === 'crack') why.push(`${i.label}: vết nứt → loại bỏ`);
        const uc = inds.filter(i => i.type === 'undercut' && i.depth != null);
        for (const u of uc) if (u.depth > 2) why.push(`${u.label}: cháy cạnh sâu ${u.depth.toFixed(1)} mm > 2 mm`);
        const over1 = uc.filter(u => u.depth > 1 && u.depth <= 2), sum = over1.reduce((s, u) => s + u.len, 0);
        if (sum > 50) why.push(`Tổng chiều dài cháy cạnh sâu 1–2 mm = ${sum.toFixed(0)} mm > 50 mm trong 300 mm`);
        const pores = inds.filter(i => i.type === 'pore' && i.len >= 1).sort((a, b) => a.x - b.x);
        for (const p of pores) { const w = pores.filter(q => q.x >= p.x && q.x < p.x + 25).reduce((s, q) => s + q.len, 0); if (w > 10) { why.push(`Rỗ: tổng đường kính ${w.toFixed(1)} mm > 10 mm trong 25 mm (từ x ≈ ${p.x.toFixed(0)} mm)`); break; } }
        const tot = pores.reduce((s, q) => s + q.len, 0); if (tot > 19) why.push(`Rỗ: tổng đường kính ${tot.toFixed(1)} mm > 19 mm trong 300 mm`);
        return { accept: why.length === 0, why };
      }
    },
    'ET-AL-SURF': {
      name: 'Quy trình ET bề mặt quanh lỗ đinh tán của xưởng (hư cấu)',
      rules: [
        'Chuẩn trên mẫu nhôm cùng hợp kim có rãnh EDM sâu 0,2 – 0,5 – 1,0 mm; rãnh 0,5 mm đặt cao 50 % màn hình.',
        'Tín hiệu nhấc đầu dò xoay về nằm ngang; chỉ thị nứt là tín hiệu dựng đứng, lặp lại khi quét lại.',
        'Mọi chỉ thị nứt có đáp ứng bằng hoặc lớn hơn rãnh 0,2 mm → báo cáo, chi tiết không được chấp nhận, chuyển kỹ thuật đánh giá sửa chữa.',
        'Thay đổi khoảng nhấc (sơn) và thay đổi độ dẫn điện: ghi nhận, không phải nứt.'
      ],
      evaluate(inds) { const why = inds.filter(i => i.type === 'crack' && i.depth >= 0.2).map(i => `${i.label}: nứt sâu ≈ ${i.depth.toFixed(1)} mm → loại bỏ`); return { accept: why.length === 0, why }; }
    },
    'AE-VESSEL': {
      name: 'Quy trình AE thử thủy lực bồn chứa của đơn vị (rút gọn theo cách tiếp cận của ASME V Điều 12)',
      rules: [
        'Nguồn hoạt động: phát xạ tập trung tại một vị trí và vẫn tiếp diễn trong thời gian giữ áp → bồn chưa được chấp nhận, phải kiểm tra bổ sung (UT, MT) tại vị trí đó.',
        'Phát xạ chỉ xuất hiện khi tăng áp, dừng khi giữ áp, đúng vị trí gối đỡ: ma sát cơ học, ghi nhận.',
        'Tín hiệu biên độ thấp, thời gian tăng dài, đến cảm biến bảo vệ trước: tiếng ồn, loại khỏi phân tích.',
        'Bỏ qua trong game: tiêu chí số đếm, năng lượng, tỷ số Felicity theo từng cảm biến.'
      ],
      evaluate(inds) { const why = inds.filter(i => i.type === 'active').map(i => `${i.label}: nguồn hoạt động, phát xạ tiếp diễn khi giữ áp → kiểm tra bổ sung trước khi cho vận hành`); return { accept: why.length === 0, why }; }
    },
    'IR-CFRP': {
      name: 'Tài liệu sửa chữa composite của xưởng (hư cấu)',
      rules: [
        'Tách lớp đường kính tương đương > 10 mm → phải sửa chữa (không chấp nhận).',
        'Tách lớp ≤ 10 mm → ghi vào hồ sơ, kiểm tra lại ở đợt bảo dưỡng sau.',
        'Khác biệt độ phát xạ, gân tăng cứng: ghi nhận, không phải khuyết tật.'
      ],
      evaluate(inds) { const why = inds.filter(i => i.type === 'delam' && i.len > 10).map(i => `${i.label}: tách lớp Ø ${i.len.toFixed(1)} mm > 10 mm → sửa chữa`); return { accept: why.length === 0, why }; }
    },
    'MW-HDPE': {
      name: 'Quy trình nghiệm thu mối hàn nhiệt HDPE của chủ đầu tư (hư cấu)',
      rules: [
        'Không ngấu ở mặt nóng chảy: không cho phép, bất kể kích thước.',
        'Lỗ rỗng hoặc tạp chất đơn lẻ > 3 mm: không cho phép; ≤ 3 mm ghi nhận.',
        'Vật kim loại bên ngoài: ghi vào sơ đồ, không phải khuyết tật của mối hàn.'
      ],
      evaluate(inds) { const why = [];
        for (const i of inds) { if (i.type === 'lof') why.push(`${i.label}: không ngấu → loại bỏ`); else if ((i.type === 'void' || i.type === 'incl') && i.len > 3) why.push(`${i.label}: ${i.type === 'void' ? 'lỗ rỗng' : 'tạp chất'} ${i.len.toFixed(1)} mm > 3 mm`); }
        return { accept: why.length === 0, why }; }
    }
  };

  const PREREQ_MORE = { vt1: ['vt'], et1: ['elec', 'et'], ae1: ['ae'], ir1: ['ir'], mw1: ['mw'] };
  const api = { LEVELS_MORE, ATLAS_MORE, CRITERIA_MORE, PREREQ_MORE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.LEVELS.push(...LEVELS_MORE); Object.assign(root.ATLAS, ATLAS_MORE); Object.assign(root.CRITERIA, CRITERIA_MORE); if (root.PREREQ) Object.assign(root.PREREQ, PREREQ_MORE); }
})(this);
