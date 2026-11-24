/* academy_deep.js — phần “Đào sâu” (mức Bậc II), ví dụ tính có lời giải và câu hỏi nâng cao cho 17 chương Học viện,
 * cùng bảng thuật ngữ Việt – Anh. Gộp vào ACADEMY theo id khi nạp. Mọi đáp số dạng số được tools/check.js tính lại.
 */
(function (root) {
  'use strict';
  const DEEP = {
    atom: {
      deep: [
        ['Ba loại bức xạ khi phân rã', 'Alpha (hạt nhân heli) bị chặn bởi một tờ giấy. Beta (electron) bị chặn bởi vài milimét nhôm. Gamma (photon) cần chì hoặc thép dày mới giảm được. Trong RT chỉ dùng gamma; beta của nguồn Ir-192 bị vỏ nang thép giữ lại.'],
        ['Phổ năng lượng của Ir-192', 'Ir-192 phát nhiều vạch gamma, mạnh nhất quanh 0,30–0,47 MeV (các vạch 317 keV và 468 keV). Năng lượng trung bình như vậy hợp với thép dày khoảng 10–90 mm. Co-60 (1,17 và 1,33 MeV) dùng cho thép rất dày; Se-75 năng lượng thấp hơn, cho ảnh tương phản tốt hơn trên thép mỏng.'],
        ['Hoạt độ là gì', '1 Bq là một phân rã mỗi giây; 1 Ci = 3,7·10¹⁰ Bq = 37 GBq. Hoạt độ cho biết “lượng” bức xạ phát ra, không cho biết năng lượng. Nguồn RT hiện trường thường từ vài chục tới hơn một trăm Ci.']
      ],
      ex: [{ q: 'Chứng chỉ nguồn ghi 1850 GBq. Đổi sang Ci.', steps: ['1 Ci = 37 GBq', 'A = 1850 / 37'], a: '50 Ci' }],
      quiz: [
        { q: 'Loại bức xạ nào bị chặn hoàn toàn bởi một tờ giấy?', o: ['Alpha', 'Beta', 'Gamma', 'Tia X'], e: 'Hạt alpha nặng, mang điện +2, mất năng lượng rất nhanh.' },
        { q: 'Nguồn Ir-192 có hoạt độ 1850 GBq. Bằng bao nhiêu Ci?', num: 50, rel: 0.01, unit: 'Ci', e: '1850 / 37 = 50 Ci.' },
        { q: 'Vì sao Co-60 hợp hơn Ir-192 cho thép rất dày (trên 100 mm)?', o: ['Năng lượng gamma cao hơn (khoảng 1,2–1,3 MeV), xuyên sâu hơn', 'Chu kỳ bán rã ngắn hơn', 'Cho ảnh tương phản tốt hơn', 'Không cần rào an toàn'], e: 'Đổi lại, độ tương phản ảnh kém hơn và che chắn khó hơn.' }
      ] },

    elec: {
      deep: [
        ['Công thức thực hành cho δ', 'Khi σ tính bằng MS/m: δ (mm) ≈ 503 / √(f · μr · σ). Đổi đơn vị: σ (MS/m) = 0,58 × % IACS. Nhôm 40 % IACS (≈ 23,2 MS/m) ở 100 kHz có δ ≈ 0,33 mm.'],
        ['Chọn tần số theo mục tiêu', 'Tìm vết nứt bề mặt: chọn tần số cao (δ nhỏ, độ nhạy bề mặt tốt). Tìm ăn mòn ở mặt sau tấm mỏng: chọn tần số thấp sao cho độ dày cần “nhìn” khoảng 1δ. Vật sắt từ có μr lớn nên δ rất nhỏ; thường phải bão hòa từ hoặc dùng kỹ thuật khác.'],
        ['Hệ số lấp đầy và hiệu ứng mép', 'Với đầu dò bobbin trong ống, hệ số lấp đầy (tiết diện cuộn dây so với tiết diện lòng ống) càng gần 1 thì càng nhạy. Ở gần mép tấm hoặc lỗ, dòng xoáy bị dồn lại tạo tín hiệu mép, dễ nhầm với vết nứt.']
      ],
      ex: [{ q: 'Muốn δ = 1 mm trên nhôm 40 % IACS (μr = 1), cần tần số bao nhiêu?', steps: ['σ = 0,40 × 58 = 23,2 MS/m', 'f = (503 / (δ·√σ))² = (503 / (1 × 4,82))²', 'f ≈ 1,09·10⁴ Hz'], a: '≈ 11 kHz' }],
      quiz: [
        { q: 'Vật liệu 50 % IACS có độ dẫn điện bao nhiêu MS/m?', num: 29, rel: 0.02, unit: 'MS/m', e: '0,58 × 50 = 29 MS/m.' },
        { q: 'Tần số (kHz) để δ = 1 mm trên nhôm 40 % IACS, μr = 1?', num: 10.92, rel: 0.05, unit: 'kHz', e: 'f = 1/(π·μ₀·σ·δ²) ≈ 10,9 kHz.' },
        { q: 'Vì sao ET thông thường thấm rất nông vào thép cacbon?', o: ['Độ từ thẩm tương đối lớn làm δ rất nhỏ', 'Thép không dẫn điện', 'Thép có độ dẫn điện quá thấp', 'Thép phản xạ hết từ trường'], e: 'μr hàng trăm làm δ giảm hàng chục lần.' }
      ] },

    mag: {
      deep: [
        ['Từ trường quanh dây dẫn', 'Bên ngoài một thanh tròn mang dòng I, cường độ từ trường H = I/(2πr): mạnh nhất ở bề mặt và giảm dần ra xa. Bên trong thanh đặc, H tăng tuyến tính từ 0 ở tâm tới cực đại ở bề mặt; vì vậy head shot không phát hiện được khuyết tật ở lòng thanh.'],
        ['Dòng điện cho que dẫn (prod)', 'Theo ASME V (T-752): khoảng cách que 75–200 mm; dòng 100–125 A cho mỗi 25 mm khoảng cách que khi chi tiết dày từ 19 mm trở lên, 90–110 A cho mỗi 25 mm khi mỏng hơn 19 mm. Que dẫn có thể gây cháy hồ quang trên bề mặt: không dùng cho chi tiết nhạy cảm.'],
        ['Cuộn dây và tỉ số L/D', 'Với cuộn dây cố định, ampe-vòng cần thiết phụ thuộc tỉ số chiều dài/đường kính của chi tiết. Chi tiết ngắn (L/D nhỏ) bị khử từ mạnh ở hai đầu, phải ghép thêm khối thép nối dài. Công thức cụ thể theo hệ số lấp đầy, xem ASME V Điều 7.']
      ],
      ex: [{ q: 'Head shot 1000 A qua thanh tròn Ø50 mm. H tại bề mặt?', steps: ['r = 0,025 m', 'H = I/(2πr) = 1000/(2π × 0,025)'], a: '≈ 6366 A/m' }],
      quiz: [
        { q: 'Dòng 1000 A chạy qua thanh tròn đường kính 50 mm. H tại bề mặt (A/m)?', num: 6366, rel: 0.02, unit: 'A/m', e: 'H = 1000/(2π·0,025) ≈ 6366 A/m.' },
        { q: 'Tấm thép dày 25 mm, khoảng cách que 150 mm. Dòng que dẫn theo ASME V là bao nhiêu?', o: ['Khoảng 600–750 A', 'Khoảng 90–110 A', 'Khoảng 1500–1900 A', 'Khoảng 300–375 A'], e: '150/25 = 6 đoạn × (100–125 A) = 600–750 A (chi tiết ≥ 19 mm).' },
        { q: 'Vì sao head shot không phát hiện khuyết tật ở tâm thanh đặc?', o: ['Từ trường tròn bên trong bằng 0 ở tâm, chỉ mạnh ở bề mặt', 'Vì dòng điện chỉ chạy ở tâm', 'Vì hạt từ không lọt vào trong', 'Vì thanh bị khử từ'], e: 'H tăng tuyến tính theo bán kính bên trong vật dẫn.' }
      ] },

    waves: {
      deep: [
        ['Sóng mặt và sóng tấm', 'Sóng Rayleigh chạy dọc bề mặt với vận tốc khoảng 0,9 lần sóng ngang, thấm sâu chừng một bước sóng: rất nhạy với nứt bề mặt nhưng dễ bị dầu, nước làm tắt. Sóng Lamb lan trong tấm mỏng, vận tốc thay đổi theo tần số và chiều dày (tán sắc); là nền tảng của siêu âm sóng dẫn (guided wave) cho đường ống dài.'],
        ['Độ phân giải theo trục', 'Hai phản xạ gần nhau chỉ tách được khi xung đủ ngắn. Đầu dò giảm chấn mạnh (băng rộng) cho xung ngắn, phân giải tốt; đầu dò ít giảm chấn cho xung dài, nhạy hơn nhưng phân giải kém.'],
        ['Nhiễu hạt', 'Khi cỡ hạt tiến gần bước sóng, tán xạ tăng rất nhanh và nền nhiễu cỏ (grass) dâng lên. Vật đúc, inox austenit, mối hàn hạt thô thường phải hạ tần số hoặc dùng sóng dọc.']
      ],
      ex: [{ q: 'Sóng Rayleigh trong thép (≈ 0,92 × vS) ở 2 MHz có bước sóng bao nhiêu?', steps: ['vR ≈ 0,92 × 3240 ≈ 2981 m/s', 'λ = vR/f = 2981 / 2·10⁶'], a: '≈ 1,49 mm' }],
      quiz: [
        { q: 'Bước sóng (mm) của sóng Rayleigh trong thép ở 2 MHz, lấy vR = 2981 m/s?', num: 1.49, rel: 0.03, unit: 'mm', e: 'λ = 2981 / 2·10⁶ ≈ 1,49 mm.' },
        { q: 'Sóng Rayleigh thấm vào vật sâu khoảng bao nhiêu?', o: ['Khoảng một bước sóng', 'Toàn bộ chiều dày', 'Không thấm, chỉ trong không khí', 'Mười bước sóng'], e: 'Năng lượng tập trung trong lớp mỏng cỡ λ dưới bề mặt.' },
        { q: 'Muốn tách hai phản xạ rất gần nhau theo chiều sâu, nên chọn đầu dò thế nào?', o: ['Giảm chấn mạnh, xung ngắn (băng rộng)', 'Ít giảm chấn, xung dài', 'Tần số thấp hơn', 'Đường kính lớn hơn'], e: 'Độ phân giải theo trục phụ thuộc chiều dài xung.' }
      ] },

    sound: {
      deep: [
        ['Phản xạ ở khuyết tật chứa khí', 'Thép/không khí có hệ số phản xạ gần 100 %. Vì vậy vết nứt (mặt phân cách thép – khí) là phản xạ rất mạnh khi chùm âm gần vuông góc với nó, nhưng gần như “vô hình” nếu chùm song song với mặt nứt.'],
        ['Suy giảm đo bằng tiếng vọng đáy lặp', 'Biên độ các tiếng vọng đáy giảm dần do tản chùm, phản xạ và suy giảm vật liệu. Khi bỏ qua tản chùm (ngoài trường gần, vật liệu dày), hệ số suy giảm α ≈ ΔdB / (2 × chiều dày).'],
        ['Nhiệt độ thay đổi góc đầu dò', 'Vận tốc trong nêm Perspex giảm khi nóng lên; theo Snell, góc khúc xạ trong thép tăng. Kiểm tra trên bề mặt nóng phải dùng nêm chịu nhiệt và kiểm tra lại góc ở nhiệt độ làm việc.']
      ],
      ex: [{ q: 'Tấm dày 50 mm: tiếng vọng đáy 1 là 80 %, đáy 2 là 40 %. Suy giảm (bỏ qua tản chùm)?', steps: ['ΔdB = 20·log(80/40) = 6,02 dB', 'Quãng đường thêm = 2 × 50 = 100 mm', 'α = 6,02 / 100'], a: '≈ 0,06 dB/mm' }],
      quiz: [
        { q: 'Tấm 50 mm, đáy 1 = 80 %, đáy 2 = 40 %. Suy giảm bao nhiêu dB/mm (bỏ qua tản chùm)?', num: 0.0602, rel: 0.03, unit: 'dB/mm', e: '6,02 dB / 100 mm.' },
        { q: 'Nêm Perspex nóng lên, vận tốc trong nêm giảm. Góc khúc xạ trong thép thay đổi thế nào?', o: ['Tăng', 'Giảm', 'Không đổi', 'Về 0°'], e: 'sinθ₂ = sinθ₁·v₂/v₁: v₁ giảm thì θ₂ tăng.' },
        { q: 'Vì sao vết nứt song song với chùm âm khó phát hiện?', o: ['Âm phản xạ ra hướng khác, không quay về đầu dò', 'Vết nứt hấp thụ hết âm', 'Vì vết nứt không chứa khí', 'Vì tần số quá cao'], e: 'Phản xạ gương cần chùm gần vuông góc mặt phản xạ.' }
      ] },

    xray: {
      deep: [
        ['Ba cơ chế tương tác', 'Hiệu ứng quang điện chiếm ưu thế ở năng lượng thấp và phụ thuộc mạnh vào số Z (cho tương phản tốt). Tán xạ Compton chiếm ưu thế ở dải năng lượng RT công nghiệp. Tạo cặp chỉ xảy ra khi năng lượng photon trên 1,022 MeV.'],
        ['Lớp giảm mười lần (TVL)', '1 TVL giảm cường độ 10 lần, tương đương khoảng 3,3 HVL. Thiết kế che chắn: số HVL cần = log₂(hệ số giảm). Với chùm rộng, các HVL đầu thường dày hơn các HVL sau.'],
        ['Định luật thuận nghịch với máy X', 'Phơi sáng tỉ lệ với mA × thời gian (mA·s hay mA·phút). Giữ nguyên kV và khoảng cách: 10 mA trong 2 phút cho cùng độ đen như 5 mA trong 4 phút.']
      ],
      ex: [{ q: 'Cần giảm suất liều từ 1000 xuống 20 µSv/h bằng chì (HVL 5,1 mm). Dày bao nhiêu?', steps: ['Hệ số giảm = 1000/20 = 50', 'Số HVL = log₂(50) ≈ 5,64', 'Chiều dày = 5,64 × 5,1'], a: '≈ 28,8 mm chì' }],
      quiz: [
        { q: 'Giảm suất liều 50 lần bằng chì có HVL 5,1 mm. Cần dày bao nhiêu mm?', num: 28.78, rel: 0.03, unit: 'mm', e: 'log₂(50) × 5,1 ≈ 28,8 mm.' },
        { q: 'Máy X chụp đạt ở 10 mA, 2 phút. Hạ xuống 5 mA thì cần bao nhiêu phút?', num: 4, rel: 0.01, unit: 'phút', e: 'mA·phút giữ nguyên: 20 / 5 = 4.' },
        { q: 'Tạo cặp electron – positron chỉ xảy ra khi năng lượng photon lớn hơn bao nhiêu?', o: ['1,022 MeV', '0,511 keV', '100 keV', '10 MeV'], e: 'Bằng hai lần năng lượng nghỉ của electron.' }
      ] },

    mat: {
      deep: [
        ['Mỏi và hệ số tập trung ứng suất', 'Dưới tải lặp, vết nứt khởi phát nơi ứng suất cục bộ cao: chân mối hàn, rãnh, lỗ, vết cháy hồ quang. Đường cong S-N cho biết số chu kỳ chịu được ở mỗi biên độ ứng suất. Mài nhẵn chân mối hàn, phun bi tạo ứng suất nén đều kéo dài tuổi thọ mỏi.'],
        ['Cơ học phá hủy: kích thước tới hạn', 'Hệ số cường độ ứng suất K = Y·σ·√(πa). Khi K đạt độ dai phá hủy KIC, vết nứt phát triển không kiểm soát. Từ đó a_tới hạn = (KIC/(Y·σ))²/π. NDT phải phát hiện chắc chắn vết nứt nhỏ hơn a_tới hạn nhiều lần, có tính đến tốc độ lớn của nứt giữa hai lần kiểm tra.'],
        ['Các dạng ăn mòn và phương pháp', 'Ăn mòn đều: đo chiều dày UT. Ăn mòn rỗ: quét UT/ET, RT tiếp tuyến. Nứt do ăn mòn ứng suất (SCC): PT, MT, ET, PAUT. Ăn mòn dưới bảo ôn (CUI): dòng xoáy xung (PEC), RT tiếp tuyến, sóng dẫn.']
      ],
      ex: [{ q: 'KIC = 50 MPa√m, σ = 200 MPa, Y = 1,12. Vết nứt bề mặt tới hạn?', steps: ['a = (KIC/(Y·σ))²/π', '= (50/224)²/π = 0,0498/π'], a: '≈ 0,0159 m = 15,9 mm' }],
      quiz: [
        { q: 'KIC = 50 MPa√m, σ = 200 MPa, Y = 1,12. Chiều sâu vết nứt tới hạn bao nhiêu mm?', num: 15.86, rel: 0.03, unit: 'mm', e: 'a = (50/(1,12·200))²/π ≈ 15,9 mm.' },
        { q: 'Ăn mòn dưới lớp bảo ôn (CUI) thường được sàng lọc bằng phương pháp nào mà không cần tháo bảo ôn?', o: ['Dòng xoáy xung (PEC)', 'PT', 'MT ướt huỳnh quang', 'VT trực tiếp'], e: 'PEC đo chiều dày trung bình xuyên qua lớp bảo ôn và vỏ bọc.' },
        { q: 'Biện pháp nào kéo dài tuổi thọ mỏi của mối hàn?', o: ['Mài nhẵn chân mối hàn, tạo ứng suất nén bằng phun bi', 'Tăng chiều cao mũ mối hàn', 'Để lại vết cháy hồ quang', 'Hàn thêm lớp đắp không ngấu'], e: 'Giảm hệ số tập trung ứng suất và ứng suất kéo dư.' }
      ] },

    cap: {
      deep: [
        ['Mức độ nhạy chất thấm', 'Chất thấm huỳnh quang được phân mức độ nhạy ½ (cực thấp), 1, 2, 3, 4 (siêu cao) theo các tiêu chuẩn vật liệu PT (ví dụ SAE AMS 2644). Mức cao hơn không phải lúc nào cũng tốt: trên bề mặt thô nó gây nền sáng, nhiều chỉ thị giả.'],
        ['Huỳnh quang và mắt người', 'UV-A (320–400 nm, đỉnh khoảng 365 nm) kích thích chất màu phát ánh sáng vàng lục, vùng mắt người nhạy nhất. Trong phòng tối, một vệt sáng nhỏ trên nền đen dễ thấy hơn nhiều so với vệt đỏ trên nền trắng.'],
        ['Nhiệt độ và thời gian ngấm', 'Nhiệt độ thấp làm chất thấm nhớt hơn nên thấm chậm. Nhiệt độ cao làm dung môi bay hơi, chất thấm khô trên bề mặt. Vì vậy quy trình quy định dải nhiệt độ và phải chứng minh lại khi làm ngoài dải.']
      ],
      ex: [{ q: 'Khe 20 µm cho h ≈ 335 mm. Khe 5 µm (các yếu tố khác giữ nguyên) cho h bao nhiêu?', steps: ['h tỉ lệ nghịch với w', 'h = 335 × 20/5'], a: '≈ 1340 mm (khe càng hẹp, mao dẫn càng mạnh)' }],
      quiz: [
        { q: 'Đèn UV-A dùng cho PT huỳnh quang có bước sóng đỉnh khoảng bao nhiêu?', o: ['365 nm', '254 nm', '550 nm', '1000 nm'], e: 'UV-A 320–400 nm, đỉnh khoảng 365 nm.' },
        { q: 'Vì sao chất thấm huỳnh quang phát màu vàng lục?', o: ['Đó là vùng mắt người nhạy nhất', 'Vì rẻ nhất', 'Vì không độc', 'Vì phản xạ UV tốt'], e: 'Tối đa khả năng nhìn thấy chỉ thị mờ.' },
        { q: 'Dùng chất thấm mức nhạy 4 trên mối hàn thô ráp có thể gây ra điều gì?', o: ['Nền sáng và nhiều chỉ thị giả do khó tẩy chất thừa', 'Không thấy được vết nứt nào', 'Chất thấm không ngấm được', 'Không có ảnh hưởng gì'], e: 'Chọn mức nhạy hợp với bề mặt và yêu cầu.' }
      ] },

    vt: {
      deep: [
        ['Thị lực của người kiểm tra', 'SNT-TC-1A yêu cầu đọc được bảng Jaeger số 2 (hoặc tương đương) ở khoảng cách không dưới 30,5 cm, kiểm tra hằng năm, và kiểm tra phân biệt màu theo yêu cầu của phương pháp. ISO 9712 yêu cầu Jaeger số 1 ở không dưới 30 cm.'],
        ['Dụng cụ VT mối hàn', 'Thước đo mối hàn góc, thước cam đa năng (chiều cao mũ, cháy cạnh, góc vát), thước Hi-Lo (lệch mép trong ống), kính lúp 5–10×, gương, đèn, ống soi. Mỗi phép đo phải ghi lại dụng cụ dùng.'],
        ['Khuyết tật VT điển hình', 'Cháy cạnh, chảy tràn, mũ quá cao, rỗ bề mặt, nứt rãnh hồ quang ở cuối đường hàn, bắn tóe, lệch mép, vết cháy hồ quang trên kim loại cơ bản. Vết cháy hồ quang có thể là điểm khởi phát nứt và thường phải xử lý.']
      ],
      ex: [{ q: 'Đèn đặt cách bề mặt 1 m cho 400 lx. Đưa đèn tới 0,5 m thì độ rọi bao nhiêu (nguồn điểm)?', steps: ['Độ rọi tỉ lệ 1/d²', 'E = 400 × (1/0,5)²'], a: '1600 lx (đạt ≥ 1000 lx)' }],
      quiz: [
        { q: 'Đèn cho 400 lx ở 1 m. Đưa về 0,5 m thì độ rọi bao nhiêu lx (nguồn điểm)?', num: 1600, rel: 0.01, unit: 'lx', e: '400 × 4 = 1600 lx.' },
        { q: 'Dụng cụ nào đo lệch mép trong mối hàn ống?', o: ['Thước Hi-Lo', 'Thước đo góc mối hàn góc', 'Kính lúp', 'Máy đo độ rọi'], e: 'Thước Hi-Lo đo độ lệch giữa hai mép ống.' },
        { q: 'Theo SNT-TC-1A, thị lực gần được kiểm tra thế nào?', o: ['Jaeger số 2 ở không dưới 30,5 cm, hằng năm', 'Đọc biển số xe ở 20 m', 'Chỉ kiểm tra khi tuyển dụng', 'Không cần kiểm tra'], e: 'Kèm kiểm tra phân biệt màu theo phương pháp.' }
      ] },

    ut: {
      deep: [
        ['Tản chùm', 'Ngoài trường gần, chùm tản theo nửa góc sin(γ) ≈ 1,2·λ/D (tới điểm không). Đầu dò nhỏ, tần số thấp thì chùm tản rộng: phủ được vùng lớn nhưng định vị kém. Điều này giải thích vì sao kích thước khuyết tật đo bằng giảm 6 dB chỉ tin cậy khi khuyết tật lớn hơn chùm.'],
        ['Động học tiếng vọng', 'Quan sát biên độ khi dịch và xoay đầu dò: khuyết tật phẳng (nứt, không ngấu) cho đỉnh nhọn, rơi nhanh khi lệch góc; khuyết tật thể tích (rỗ, xỉ) cho tín hiệu ổn định hơn theo mọi hướng. Kết hợp vị trí so với bản vẽ mối hàn để phân loại.'],
        ['PAUT, TOFD và đo chiều dày', 'Mảng pha (PAUT) quét chùm điện tử, hiển thị S-scan; TOFD đo chiều cao vết nứt từ tín hiệu nhiễu xạ đầu nứt. Đo chiều dày ăn mòn dùng đầu dò song tinh thể (dual) để thấy được thành mỏng gần bề mặt, có bù đường đi chữ V.']
      ],
      ex: [{ q: 'Đầu dò 10 mm, 5 MHz, sóng dọc trong thép. Nửa góc tản chùm (tới điểm không)?', steps: ['λ = 5920 / 5·10⁶ = 1,184 mm', 'sinγ = 1,2 × 1,184 / 10 = 0,142', 'γ = arcsin(0,142)'], a: '≈ 8,2°' }],
      quiz: [
        { q: 'Đầu dò Ø10 mm, 5 MHz trên thép (vL = 5920 m/s). Nửa góc tản chùm tới điểm không là bao nhiêu độ?', num: 8.17, abs: 0.3, unit: '°', e: 'arcsin(1,2·1,184/10) ≈ 8,2°.' },
        { q: 'PAUT hiển thị chùm quét theo nhiều góc thành hình quạt gọi là gì?', o: ['S-scan', 'A-scan', 'C-scan', 'Biểu đồ DAC'], e: 'Sectorial scan.' },
        { q: 'Vì sao đo chiều dày ăn mòn thường dùng đầu dò song tinh thể?', o: ['Tách phát và thu nên thấy được thành mỏng sát bề mặt', 'Vì rẻ hơn', 'Vì không cần chất tiếp âm', 'Vì phát sóng ngang'], e: 'Tránh vùng chết của xung phát ban đầu.' }
      ] },

    mt: {
      deep: [
        ['Điều kiện soi huỳnh quang', 'Theo ASME V Điều 7: cường độ UV-A tại bề mặt tối thiểu 1000 µW/cm², ánh sáng xung quanh không quá 20 lx, người kiểm tra cho mắt thích nghi bóng tối trước khi soi; không đeo kính đổi màu.'],
        ['Kiểm tra nồng độ hạt ướt', 'Lắc đều dung dịch, lấy 100 mL vào ống ly tâm, để lắng khoảng 30 phút. Thể tích lắng thường yêu cầu 0,1–0,4 mL với hạt huỳnh quang và 1,2–2,4 mL với hạt nhìn thấy. Thấy lớp lắng tách lớp hoặc có cặn lạ là dung dịch đã nhiễm bẩn.'],
        ['Chỉ thị không liên quan và giả', 'Từ tính ghi lại (magnetic writing) khi hai chi tiết nhiễm từ chạm nhau; chỗ đổi tiết diện; ranh giới vùng ảnh hưởng nhiệt; vết gia công nguội. Cách xử lý: khử từ rồi kiểm tra lại, đối chứng bằng PT hoặc soi kỹ hình dạng chỉ thị.']
      ],
      ex: [{ q: 'Ống ly tâm 100 mL, sau 30 phút lắng được 0,6 mL hạt huỳnh quang. Kết luận?', steps: ['Dải yêu cầu thường là 0,1–0,4 mL', '0,6 mL vượt dải'], a: 'Dung dịch quá đặc: pha loãng, kiểm tra lại trước khi dùng' }],
      quiz: [
        { q: 'Khi soi MT huỳnh quang, ánh sáng xung quanh tối đa là bao nhiêu?', o: ['20 lx', '200 lx', '1000 lx', 'Không giới hạn'], e: 'Kèm UV-A ≥ 1000 µW/cm² tại bề mặt.' },
        { q: 'Thể tích lắng điển hình của hạt huỳnh quang trong ống ly tâm 100 mL là bao nhiêu?', o: ['0,1–0,4 mL', '1,2–2,4 mL', '5–10 mL', '0,01 mL'], e: 'Hạt nhìn thấy (không huỳnh quang) thường 1,2–2,4 mL.' },
        { q: 'Chỉ thị mờ, nhòe xuất hiện đúng chỗ một chiếc cờ lê nhiễm từ đã chạm vào chi tiết. Khả năng cao nhất là gì?', o: ['Từ tính ghi lại (magnetic writing), không liên quan', 'Vết nứt mỏi', 'Rỗ khí dưới bề mặt', 'Không ngấu'], e: 'Khử từ và kiểm tra lại: chỉ thị sẽ không xuất hiện lại.' }
      ] },

    et: {
      deep: [
        ['Đầu dò tuyệt đối và vi sai', 'Đầu dò tuyệt đối so cuộn dây với một chuẩn cố định: nhạy với thay đổi chậm (độ dẫn điện, ăn mòn đều) nhưng cũng nhạy với nhiệt độ, lift-off. Đầu dò vi sai so hai cuộn cạnh nhau: nhạy với thay đổi cục bộ (vết nứt, rỗ), gần như không thấy thay đổi chậm, tín hiệu hình số 8.'],
        ['Mẫu chuẩn tham chiếu', 'Mẫu cùng vật liệu, cùng nhiệt luyện với chi tiết, có rãnh EDM hoặc lỗ đáy bằng ở các độ sâu đã biết (ví dụ 20, 40, 60, 80, 100 % chiều dày thành ống). Hiệu chuẩn pha và biên độ trên mẫu này rồi so tín hiệu thật với chúng.'],
        ['Đa tần số và trộn tín hiệu', 'Kiểm tra ống trao đổi nhiệt có tấm đỡ: tín hiệu tấm đỡ che mất khuyết tật. Dùng hai tần số rồi trộn để triệt tiêu tín hiệu tấm đỡ, giữ lại tín hiệu khuyết tật.']
      ],
      ex: [{ q: 'Ống đồng thau 25 % IACS, thành 1,2 mm. Tần số cho δ bằng chiều dày thành (μr = 1)?', steps: ['σ = 0,25 × 58 = 14,5 MS/m', 'f = (503 / (1,2 × √14,5))²', 'f ≈ (503 / 4,57)²'], a: '≈ 12 kHz' }],
      quiz: [
        { q: 'Ống 25 % IACS, thành 1,2 mm. Tần số (kHz) để δ bằng chiều dày thành?', num: 12.13, rel: 0.05, unit: 'kHz', e: 'f = 1/(π·μ₀·σ·δ²) ≈ 12 kHz.' },
        { q: 'Loại đầu dò nào nhạy với vết nứt nhỏ cục bộ nhưng gần như không thấy thay đổi chậm như ăn mòn đều?', o: ['Đầu dò vi sai', 'Đầu dò tuyệt đối', 'Đầu dò bobbin tuyệt đối', 'Đầu dò EMAT'], e: 'Hai cuộn so với nhau, thay đổi chung bị triệt tiêu.' },
        { q: 'Vì sao dùng đa tần số khi kiểm tra ống trao đổi nhiệt?', o: ['Để triệt tiêu tín hiệu tấm đỡ, giữ tín hiệu khuyết tật', 'Để tăng tốc độ quét', 'Để khử từ ống', 'Để đo nhiệt độ'], e: 'Trộn tín hiệu (mix) hai tần số.' }
      ] },

    mw: {
      deep: [
        ['Bước sóng trong vật liệu', 'Trong vật liệu điện môi, bước sóng ngắn lại: λ = λ₀/√ε (bỏ qua tổn hao). Vì vậy độ phân giải và hiện tượng giao thoa nhiều lớp phụ thuộc cả tần số lẫn hằng số điện môi.'],
        ['Tổn hao điện môi', 'Hằng số điện môi phức ε = ε′ − jε″. Phần ảo (tổn hao, tanδ = ε″/ε′) cho biết vật liệu hấp thụ năng lượng vi ba. Nước có ε″ lớn nên vùng ẩm vừa phản xạ mạnh vừa hấp thụ nhiều.'],
        ['Đầu dò ống dẫn sóng hở', 'Đặt miệng ống dẫn sóng sát bề mặt và quét. Khoảng cách hở (stand-off) ảnh hưởng mạnh tín hiệu, tương tự lift-off trong ET. Trên kim loại, đầu dò này phát hiện được vết nứt mở ra bề mặt kể cả khi bị sơn phủ.']
      ],
      ex: [{ q: 'Vi ba 10 GHz đi vào composite có ε = 4. Bước sóng trong vật liệu?', steps: ['λ₀ = c/f = 30 mm', 'λ = λ₀/√ε = 30/2'], a: '15 mm' }],
      quiz: [
        { q: 'Vi ba 10 GHz trong vật liệu có ε = 4. Bước sóng trong vật liệu bao nhiêu mm?', num: 15, rel: 0.02, unit: 'mm', e: '30 mm / √4 = 15 mm.' },
        { q: 'Đại lượng nào cho biết vật liệu hấp thụ năng lượng vi ba nhiều hay ít?', o: ['Phần ảo của hằng số điện môi (tanδ)', 'Độ từ thẩm', 'Độ cứng', 'Độ dẫn nhiệt'], e: 'ε″ càng lớn, tổn hao càng lớn.' },
        { q: 'Với đầu dò ống dẫn sóng hở, biến số nào ảnh hưởng tín hiệu giống lift-off trong ET?', o: ['Khoảng cách hở tới bề mặt (stand-off)', 'Nhiệt độ phòng', 'Độ ẩm không khí', 'Màu sơn'], e: 'Phải giữ khoảng cách hở ổn định khi quét.' }
      ] },

    rt: {
      deep: [
        ['Kỹ thuật chụp mối hàn ống', 'Một thành – một ảnh (SWSI): nguồn hoặc phim đặt trong ống. Hai thành – một ảnh (DWSI): nguồn ngoài, chỉ đọc thành phía phim. Hai thành – hai ảnh (DWDI): thường cho ống nhỏ, chụp elip để thấy cả hai phía mối hàn. Mỗi kỹ thuật có số lần chụp tối thiểu để phủ hết chu vi.'],
        ['IQI lỗ và IQI dây', 'IQI lỗ: tấm có chiều dày khoảng 2 % chiều dày vật, ba lỗ 1T, 2T, 4T; độ nhạy “2-2T” nghĩa là thấy lỗ 2T trên tấm dày 2 %. IQI dây: dãy dây đường kính giảm dần; dây yêu cầu thấy được chứng tỏ độ nhạy. Chọn IQI theo chiều dày và bảng của tiêu chuẩn.'],
        ['Màn chì và phim', 'Màn chì trước và sau phim tăng cường ảnh nhờ electron thứ cấp và cắt bớt tán xạ năng lượng thấp. Phim hạt mịn cho ảnh nét nhưng cần phơi sáng lâu hơn. Ảnh số (CR, DR) cần kiểm tra thêm độ phân giải cơ bản và tỉ số tín hiệu/nhiễu chuẩn hóa.']
      ],
      ex: [{ q: 'Nguồn 2 mm, vật – phim 15 mm, nguồn – vật 500 mm. Ug bao nhiêu, có đạt giới hạn 0,51 mm không?', steps: ['Ug = F·d/D = 2 × 15 / 500', '= 0,06 mm'], a: '0,06 mm, đạt' }],
      quiz: [
        { q: 'Nguồn 2 mm, vật – phim 15 mm, nguồn – vật 500 mm. Ug bao nhiêu mm?', num: 0.06, rel: 0.02, unit: 'mm', e: '2 × 15 / 500 = 0,06 mm.' },
        { q: 'Độ nhạy IQI “2-2T” nghĩa là gì?', o: ['Thấy được lỗ đường kính 2T trên tấm IQI dày 2 % chiều dày vật', 'Chụp 2 lần, mỗi lần 2 phút', 'Hai IQI đặt hai phía', 'Phim dày 2 lớp'], e: 'T là chiều dày tấm IQI.' },
        { q: 'Mối hàn ống nhỏ Ø60 mm chụp hai thành – hai ảnh thường bố trí thế nào?', o: ['Lệch nguồn để ảnh mối hàn thành hình elip', 'Đặt nguồn trong ống', 'Chụp thẳng góc, hai phía chồng lên nhau', 'Không chụp được'], e: 'Elip tách ảnh thành gần nguồn và thành gần phim.' }
      ] },

    pt: {
      deep: [
        ['Bốn phương pháp loại bỏ', 'A: rửa nước (nhanh, dễ rửa quá tay). B: nhũ hóa ưa dầu. C: tẩy bằng dung môi (cơ động, cho hiện trường). D: nhũ hóa ưa nước (kiểm soát tốt, nhạy cao). Phương pháp nhũ hóa cho phép kiểm soát thời gian nhũ hóa để không rửa trôi chất thấm trong vết nứt nông, rộng.'],
        ['Kiểm tra hệ thống', 'Dùng tấm mẫu có vết nứt biết trước (ví dụ panel PSM-5 hay tấm TAM) để kiểm tra định kỳ toàn bộ hệ thống: chất thấm, chất tẩy, chất hiện hình, đèn. So số và độ sáng chỉ thị với ảnh chuẩn của tấm mẫu.'],
        ['Chỉ thị giả', 'Chất thấm đọng ở rãnh, ren, khe lắp ghép; dấu vân tay, xơ vải; chất thấm từ găng tay. Cách nhận biết: lau và hiện hình lại, xem hình dạng và vị trí so với hình học chi tiết.']
      ],
      ex: [{ q: 'Quy trình: ngấm tối thiểu 5 phút, hiện hình tối thiểu 10 phút, nhiệt độ 5–52 °C. Bề mặt đo được 3 °C. Làm gì?', steps: ['3 °C nằm ngoài dải 5–52 °C', 'Không được làm theo quy trình hiện hành'], a: 'Làm ấm chi tiết vào dải, hoặc dùng quy trình đã chứng minh cho nhiệt độ thấp' }],
      quiz: [
        { q: 'Phương pháp loại bỏ nào cơ động nhất, hay dùng ở hiện trường?', o: ['C – tẩy bằng dung môi', 'A – rửa nước', 'B – nhũ hóa ưa dầu', 'D – nhũ hóa ưa nước'], e: 'Chỉ cần bình xịt và giẻ.' },
        { q: 'Tấm mẫu có vết nứt biết trước (PSM-5, TAM) dùng để làm gì?', o: ['Kiểm tra định kỳ hiệu năng của cả hệ thống PT', 'Đo chiều sâu vết nứt', 'Hiệu chuẩn đèn UV', 'Làm sạch trước'], e: 'Phát hiện vật tư xuống cấp trước khi bỏ sót khuyết tật thật.' },
        { q: 'Bề mặt chỉ 3 °C mà quy trình quy định 5–52 °C. Xử lý đúng là gì?', o: ['Làm ấm vào dải hoặc dùng quy trình đã chứng minh cho nhiệt độ thấp', 'Kéo dài ngấm gấp đôi rồi làm luôn', 'Làm bình thường', 'Bỏ bước hiện hình'], e: 'Ngoài dải phải chứng minh lại quy trình.' }
      ] },

    ae: {
      deep: [
        ['Ngưỡng và tiếng ồn', 'Hệ thống chỉ ghi “hit” khi tín hiệu vượt ngưỡng (thường 40–45 dBAE với cảm biến 150 kHz). Ngưỡng quá thấp thì ghi cả tiếng bơm, mưa, cọ xát; quá cao thì bỏ sót nguồn yếu. Bộ lọc thời gian và lọc theo vị trí giúp loại tiếng ồn.'],
        ['Cảm biến và tần số', 'Cảm biến cộng hưởng khoảng 150 kHz phổ biến cho bồn chứa kim loại; cảm biến băng rộng dùng cho nghiên cứu dạng sóng. Gắn cảm biến bằng chất tiếp âm và kẹp từ; kiểm tra độ nhạy mỗi kênh bằng cách bẻ ruột chì (nguồn Hsu-Nielsen).'],
        ['Định vị vùng và định vị điểm', 'Định vị vùng: cảm biến nhận đầu tiên cho biết nguồn nằm trong vùng của nó. Định vị tuyến tính (2 cảm biến) và định vị phẳng (≥ 3 cảm biến) tính vị trí từ hiệu thời gian đến; độ chính xác phụ thuộc vận tốc sóng và hình học.']
      ],
      ex: [{ q: 'Lần thử trước tới 10 bar. Lần này AE xuất hiện mạnh từ 8 bar. Tỉ số Felicity?', steps: ['Felicity = tải bắt đầu phát / tải cực đại trước', '= 8 / 10'], a: '0,8: có dấu hiệu hư hỏng, cần điều tra' }],
      quiz: [
        { q: 'Áp lần trước 10 bar; lần này AE xuất hiện từ 8 bar. Tỉ số Felicity?', num: 0.8, rel: 0.01, unit: '', e: '8/10 = 0,8 < 1.' },
        { q: 'Kiểm tra độ nhạy từng kênh AE ngoài hiện trường thường dùng gì?', o: ['Bẻ ruột chì (nguồn Hsu-Nielsen)', 'Búa tạ', 'Nguồn phóng xạ', 'Đèn UV'], e: 'Tạo xung đàn hồi chuẩn, lặp lại được.' },
        { q: 'Đặt ngưỡng AE quá thấp dẫn tới điều gì?', o: ['Ghi cả tiếng ồn cơ khí, môi trường', 'Bỏ sót mọi nguồn', 'Cảm biến hỏng', 'Không định vị được vì quá ít hit'], e: 'Cần cân bằng ngưỡng với nền ồn đo trước khi gia tải.' }
      ] },

    ir: {
      deep: [
        ['Định luật Stefan – Boltzmann', 'Công suất bức xạ trên đơn vị diện tích P = ε·σ·T⁴ (T tính bằng kelvin). Vì T mũ 4, một chênh lệch nhiệt nhỏ cho thay đổi bức xạ đáng kể. Bề mặt phát xạ thấp (kim loại bóng) phát ít và phản xạ nhiều bức xạ từ xung quanh.'],
        ['Dải sóng camera', 'Camera sóng dài (LWIR, khoảng 8–14 µm) phổ biến cho kiểm tra điện, tòa nhà. Camera sóng trung (MWIR, 3–5 µm) nhanh và nhạy hơn, hay dùng cho nhiệt ảnh flash, lock-in trong nghiên cứu và hàng không.'],
        ['Lock-in và pha xung', 'Lock-in: kích thích nhiệt theo hàm sin, đo pha và biên độ ở mỗi điểm; ảnh pha ít chịu ảnh hưởng của độ phát xạ không đều. Pha xung (PPT): biến đổi Fourier chuỗi ảnh sau flash để có ảnh pha theo tần số, gắn với độ sâu.']
      ],
      ex: [{ q: 'Bề mặt nóng từ 300 K lên 330 K (ε không đổi). Bức xạ tăng bao nhiêu phần trăm?', steps: ['P tỉ lệ T⁴', '(330/300)⁴ = 1,1⁴ = 1,4641'], a: '≈ 46 %' }],
      quiz: [
        { q: 'Nhiệt độ bề mặt tăng từ 300 K lên 330 K (ε không đổi). Bức xạ tăng bao nhiêu %?', num: 46.41, rel: 0.02, unit: '%', e: '(1,1)⁴ − 1 ≈ 0,464.' },
        { q: 'Kiểm tra tủ điện bằng camera cầm tay thường dùng dải sóng nào?', o: ['Sóng dài khoảng 8–14 µm (LWIR)', 'Tia X', 'UV-A', 'Sóng milimét'], e: 'Rẻ, không cần làm lạnh, hợp nhiệt độ thường.' },
        { q: 'Ưu điểm của ảnh pha trong nhiệt ảnh lock-in là gì?', o: ['Ít bị ảnh hưởng bởi độ phát xạ không đều và gia nhiệt không đều', 'Không cần nguồn nhiệt', 'Đo được nhiệt độ tuyệt đối chính xác hơn', 'Xuyên qua kim loại dày'], e: 'Pha phản ánh thời gian trễ của sóng nhiệt, gắn với độ sâu.' }
      ] }
  };

  const GLOSSARY = [
    ['A-scan', 'A-scan', 'Màn hình biên độ tín hiệu siêu âm theo thời gian bay tại một vị trí đầu dò.'],
    ['Bất liên tục', 'Discontinuity', 'Sự gián đoạn trong cấu trúc vật liệu. Chỉ gọi là khuyết tật khi vượt tiêu chí chấp nhận.'],
    ['Bước nhảy', 'Skip distance', 'Khoảng cách bề mặt mà chùm đầu dò góc đi được sau một lần xuống đáy và lên lại: 2T·tanθ.'],
    ['Chất hiện hình', 'Developer', 'Lớp bột mịn hút chất thấm ra khỏi bất liên tục và tạo nền tương phản.'],
    ['Chất tiếp âm', 'Couplant', 'Chất lỏng hay gel thay lớp không khí giữa đầu dò và bề mặt.'],
    ['Chỉ thị', 'Indication', 'Dấu hiệu quan sát được từ một phép kiểm tra; có thể liên quan, không liên quan hoặc giả.'],
    ['Chỉ thị không liên quan', 'Non-relevant indication', 'Chỉ thị thật nhưng do hình học hay tính chất vật liệu gây ra, không phải bất liên tục cần đánh giá.'],
    ['Chỉ thị chất lượng ảnh', 'IQI / Penetrameter', 'Dụng cụ chuẩn (lỗ hoặc dây) đặt khi chụp để chứng minh độ nhạy của ảnh bức xạ.'],
    ['Chu kỳ bán rã', 'Half-life', 'Thời gian để hoạt độ của đồng vị giảm còn một nửa (Ir-192: 73,8 ngày).'],
    ['Cháy cạnh', 'Undercut', 'Rãnh lõm ở mép mối hàn trên kim loại cơ bản do hồ quang ăn mòn mà không được điền đầy.'],
    ['DAC', 'Distance Amplitude Correction', 'Đường biểu diễn biên độ của cùng một phản xạ chuẩn theo khoảng cách; mức tham chiếu để đánh giá.'],
    ['Độ đen phim', 'Film density', 'D = log₁₀(I₀/It); đo bằng máy đo độ đen.'],
    ['Độ nhòe hình học', 'Geometric unsharpness (Ug)', 'Viền mờ của ảnh do nguồn có kích thước: Ug = F·d/D.'],
    ['Độ phát xạ', 'Emissivity', 'Tỉ lệ bức xạ của bề mặt so với vật đen cùng nhiệt độ, từ 0 tới 1.'],
    ['Độ sâu thấm chuẩn', 'Standard depth of penetration (δ)', 'Độ sâu mà mật độ dòng xoáy còn 37 % so với bề mặt.'],
    ['Độ từ dư', 'Retentivity / Residual magnetism', 'Từ trường còn lại trong vật sau khi cắt dòng từ hóa.'],
    ['Độ từ thẩm', 'Permeability (μ)', 'Mức dễ dàng vật liệu cho từ thông đi qua: μ = B/H.'],
    ['Đồng vị', 'Isotope', 'Các nguyên tử cùng số proton, khác số neutron.'],
    ['Đường truyền âm', 'Sound path (SP)', 'Quãng đường chùm âm đi từ điểm ra chùm tới phản xạ.'],
    ['Góc tới hạn', 'Critical angle', 'Góc tới mà sóng khúc xạ đạt 90° và không còn truyền vào vật.'],
    ['Hiệu ứng bề mặt', 'Skin effect', 'Dòng điện xoay chiều và dòng xoáy tập trung gần bề mặt vật dẫn.'],
    ['Hiệu ứng Kaiser', 'Kaiser effect', 'Vật lành không phát xạ âm cho tới khi tải vượt mức cực đại trước đó.'],
    ['Hoạt độ', 'Activity', 'Số phân rã mỗi giây của nguồn (Bq, Ci).'],
    ['Khử từ', 'Demagnetization', 'Đưa từ dư về gần 0 bằng từ trường đổi chiều, giảm dần.'],
    ['Lift-off', 'Lift-off', 'Khoảng cách giữa cuộn dây ET và bề mặt dẫn điện; tạo tín hiệu đặc trưng trên mặt phẳng trở kháng.'],
    ['Lớp giảm một nửa', 'Half-value layer (HVL)', 'Chiều dày vật liệu làm cường độ bức xạ giảm một nửa.'],
    ['Mặt phẳng trở kháng', 'Impedance plane', 'Màn hình ET vẽ thành phần điện trở và cảm kháng của cuộn dây.'],
    ['Mẫu chuẩn', 'Calibration / Reference block', 'Khối có đặc điểm biết trước để hiệu chuẩn thiết bị và đặt độ nhạy.'],
    ['Ngậm xỉ', 'Slag inclusion', 'Xỉ hàn bị kẹt lại trong kim loại mối hàn.'],
    ['Nứt', 'Crack', 'Bất liên tục phẳng, đầu nhọn, do đứt gãy cục bộ.'],
    ['Không ngấu', 'Lack of fusion (LOF)', 'Kim loại hàn không nóng chảy liên kết với kim loại cơ bản hoặc với lớp hàn trước.'],
    ['Không thấu', 'Incomplete penetration (IP)', 'Kim loại hàn không xuyên hết chân mối nối.'],
    ['Phát xạ âm', 'Acoustic emission (AE)', 'Sóng đàn hồi do chính vật liệu phát ra khi bị biến dạng hay nứt dưới tải.'],
    ['Quy trình bằng văn bản', 'Written procedure', 'Tài liệu nêu cụ thể cách tiến hành một phép kiểm tra, được Level III phê duyệt.'],
    ['Rỗ khí', 'Porosity', 'Lỗ hổng chứa khí trong kim loại đông đặc.'],
    ['Suy giảm', 'Attenuation', 'Sự giảm năng lượng của sóng khi truyền qua vật do tán xạ và hấp thụ.'],
    ['Tách lớp', 'Delamination', 'Các lớp vật liệu (composite, tấm cán) tách rời nhau.'],
    ['Thời gian ngấm', 'Dwell time', 'Thời gian chất thấm nằm trên bề mặt trước khi loại bỏ.'],
    ['Tiêu chí chấp nhận', 'Acceptance criteria', 'Giới hạn trong tiêu chuẩn hay đặc tính kỹ thuật để quyết định Đạt hay Loại bỏ.'],
    ['Trở kháng âm', 'Acoustic impedance (Z)', 'Z = ρ·v; chênh lệch Z quyết định mức phản xạ ở mặt phân cách.'],
    ['Trường gần', 'Near field', 'Vùng sát đầu dò, biên độ dao động thất thường: N = D²f/(4v).'],
    ['Từ thông rò', 'Flux leakage', 'Từ thông thoát ra ngoài vật tại bất liên tục, giữ hạt từ lại.'],
    ['Văn bản thực hành', 'Written practice', 'Tài liệu của đơn vị quy định đào tạo, kinh nghiệm, thi và chứng nhận nhân sự NDT.'],
    ['Vùng kiểm soát', 'Controlled area', 'Khu vực rào lại khi chụp bức xạ, nơi suất liều có thể vượt giới hạn cho công chúng.']
  ];

  function merge() {
    const A = root.ACADEMY; if (!A) return;
    for (const c of A) { const d = DEEP[c.id]; if (!d || c._deep) continue; c.deep = d.deep; c.ex = d.ex; c.quiz = c.quiz.concat(d.quiz); c._deep = true; }
  }
  const api = { DEEP, GLOSSARY, merge };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else { root.DEEP = DEEP; root.GLOSSARY = GLOSSARY; merge(); }
})(this);
