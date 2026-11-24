/* academy_more.js — chương bổ sung: UT nâng cao (hiệu chuẩn & đánh giá) và An toàn bức xạ.
 * Nguồn nội dung: PHATECO UT Lab (ASME V Art.4, ASME VIII-1 App.12, quy trình PTC.NSRP.UT.01, ASTM E797) và
 * ứng dụng đào tạo An toàn bức xạ Ir-192 (Luật 94/2025/QH15, NĐ 332/2025/NĐ-CP, TT 59/2025/TT-BKHCN, ICRP 103/118, IAEA SSG-11, UNI-S-06).
 * Nạp sau academy_data.js và academy_deep.js; tự chèn vào ACADEMY.
 */
(function (root) {
  'use strict';
  const UT2 = { id: 'ut2', track: 'tech', title: 'UT nâng cao: hiệu chuẩn & đánh giá', en: 'Ultrasonic Calibration and Evaluation', src: '/NDETechniques/Ultrasonics/CalibrationMeth/calibrationmethods.xhtml', sim: 'echodyn', cards: ['decibel', 'anglebeam'],
    lessons: [
      ['Chuẩn đầu dò thẳng trên mẫu V1', 'Đặt vận tốc sóng dọc thép 5920 m/s. Trên mặt dày 25 mm của V1 (ISO 2400), dùng 4 xung đáy 25 – 50 – 75 – 100 mm: probe delay (zero) dịch đều mọi xung, velocity co giãn khoảng cách giữa các xung. Dải hiển thị tối thiểu gấp đôi chiều dày. Mức chuẩn: xung đáy thứ nhất ở 80 % ± 5 % FSH. Kiểm tra độ phân giải bằng ba mặt phản xạ 85 – 91 – 100 mm.'],
      ['Chuẩn đầu dò góc trên V2 và V1', 'Trên V2 (ISO 7963), hướng về cung R25 thì xung xuất hiện ở 25 – 100 – 175 mm; hướng R50 ở 50 – 125 – 200 mm. Dò cực đại xung R25 để tìm điểm ra tia (X-value). Góc khúc xạ thực đo trên V1 (lỗ Ø1,5 cho 45°, 60°; lỗ Ø50 cho 70°); sai ≤ 1° là đạt. Nêm mòn theo thời gian nên phải chuẩn lại.'],
      ['Dựng DAC theo ASME V (T-434.2.1)', 'Mối hàn t ≤ 25 mm dùng mẫu 19 mm (hoặc t) với lỗ khoan cạnh Ø2,4 mm; 25 < t ≤ 50 mm dùng mẫu 38 mm (hoặc t) lỗ Ø3,2 mm. Cực đại lỗ ¼T, đưa lên 80 % FSH rồi giữ nguyên gain, ghi lỗ ½T, ¾T và các điểm chân 2. Vẽ ba đường 100 %, 50 % (−6 dB) và 20 % (−14 dB). Đoạn DAC rơi dưới 20 % FSH phải dùng DAC chia đoạn.'],
      ['Bù truyền âm và độ nhạy quét', 'Mẫu chuẩn và vật kiểm khác nhau về độ nhám, độ cong, suy giảm. Đo bù truyền âm (T-434.1.3) bằng hai đầu dò cùng loại đặt đối nhau một bước nhảy, trên mẫu rồi trên vật: hiệu gain là lượng bù. Quét ở gain ít nhất bằng mức chuẩn + 6 dB; điều tra mọi chỉ thị vượt 20 % DAC. Tốc độ quét không quá 150 mm/s, các đường quét chồng nhau ít nhất 10 % kích thước biến tử.'],
      ['Kiểm tra lại hiệu chuẩn', 'Kiểm tra lại trên mẫu chuẩn khi đổi đầu dò, cáp, người, sau một khoảng thời gian và khi kết thúc. Biên độ lệch quá 20 % (2 dB) hoặc điểm khoảng cách lệch quá 10 % số đọc hay 5 % toàn thang thì phải hiệu chỉnh. Nếu độ nhạy giảm, mọi dữ liệu từ lần kiểm tra hợp lệ trước bị hủy và vùng đó phải kiểm tra lại (T-466).']
    ],
    deep: [
      ['Động học xung để phân loại', 'Nứt: xung nhiều đỉnh, chân rộng, lởm chởm, biên độ đổi mạnh khi xoay đầu dò. Không ngấu vách: xung sắc một đỉnh, rất cao khi chùm vuông góc vách vát. Không thấu chân: cao ở độ sâu ≈ T, thấy từ cả hai phía, phải phân biệt với gờ chân. Ngậm xỉ: biên độ vừa, vài đỉnh, ít phụ thuộc hướng. Rỗ khí: các xung nhỏ, nhấp nháy khi dời đầu dò.'],
      ['Chọn góc đầu dò theo mối nối', 'Ưu tiên góc để chùm vuông góc vách vát: vát 30° thì dùng đầu dò 60°. Tấm mỏng thường dùng 70° để chân sóng đủ dài. Mối hàn vát kép (X) quét từ cả hai mặt. Mối hàn chữ T: đầu dò 70° từ bản bụng, kèm đầu dò thẳng từ mặt ngoài bản cánh để tìm không ngấu ở mặt bản cánh.'],
      ['Đo chiều dày theo ASTM E797', 'Dùng đầu dò kép TR và cổng đo theo sườn (điểm cắt ngưỡng đầu tiên). Hiệu chuẩn hai điểm bằng một chiều dày mỏng và một chiều dày dày bao dải đo. Sai vận tốc 1 % thì số đo 12 mm sai 0,12 mm. Cẩn thận nhầm xung đáy thứ hai thành chiều dày gấp đôi; rỗ ăn mòn hẹp hơn chùm tia dễ bị đọc dày hơn thực.'],
      ['Cấu tạo đầu dò', 'Biến tử áp điện (PZT phổ biến nhất) dày khoảng λ/2 quyết định tần số. Lớp giảm chấn phía sau làm xung ngắn lại (phân giải tốt, kém nhạy hơn). Lớp phối hợp phía trước dày khoảng λ/4. Nêm Perspex tạo góc tới, đuôi nêm có vật liệu tiêu âm. Nung quá nhiệt độ Curie thì gốm mất tính áp điện.']
    ],
    ex: [{ q: 'Đo bù truyền âm: tín hiệu chữ V đạt 80 % ở 42,0 dB trên mẫu chuẩn và ở 46,0 dB trên tấm thật. Lượng bù?', steps: ['Bù = gain trên vật − gain trên mẫu', '= 46,0 − 42,0'], a: '+4,0 dB, cộng vào gain quét' },
      { q: 'Đầu dò 60° trên tấm 20 mm. Bước nhảy và đường âm một bước nhảy?', steps: ['Bước nhảy = 2T·tanθ = 2 × 20 × 1,732', 'Đường âm một bước nhảy = 2T/cosθ = 40/0,5'], a: '≈ 69,3 mm; 80 mm (dải hiển thị phải ≥ 80 mm)' }],
    quiz: [
      { q: 'Trên mẫu V2, đầu dò góc hướng về cung R25 cho các xung ở đâu?', o: ['25, 100, 175 mm', '25, 50, 75 mm', '50, 125, 200 mm', '25, 75, 125 mm'], e: 'Hướng R50 cho 50, 125, 200 mm.' },
      { q: 'Mối hàn dày 20 mm theo ASME V Hình T-434.2.1 dùng mẫu chuẩn cơ bản nào?', o: ['Dày 19 mm (hoặc t), lỗ Ø2,4 mm', 'Dày 38 mm, lỗ Ø3,2 mm', 'Dày 50 mm, lỗ Ø4,8 mm', 'Mẫu V1'], e: 't ≤ 25 mm: mẫu 19 mm hoặc t, lỗ Ø2,4 mm.' },
      { q: 'Đường 20 % DAC thấp hơn đường DAC bao nhiêu dB?', num: 13.98, abs: 0.2, unit: 'dB', e: '20·log₁₀(0,2) ≈ −14 dB.' },
      { q: 'Kiểm tra lại thấy độ nhạy giảm 3 dB. Phải làm gì?', o: ['Hiệu chỉnh, hủy dữ liệu từ lần kiểm tra hợp lệ trước và kiểm tra lại vùng đó', 'Tăng gain 3 dB rồi làm tiếp', 'Ghi chú vào báo cáo, không cần làm lại', 'Chỉ kiểm tra lại các chỉ thị đã ghi'], e: 'Lệch quá 2 dB; độ nhạy giảm thì dữ liệu trước đó không còn tin cậy.' },
      { q: 'Tín hiệu chữ V đạt 80 % ở 42 dB trên mẫu và 46 dB trên vật. Lượng bù truyền âm (dB)?', num: 4, abs: 0.05, unit: 'dB', e: '46 − 42 = 4 dB.' },
      { q: 'Bước nhảy (mm) của đầu dò 60° trên tấm 20 mm?', num: 69.28, rel: 0.01, unit: 'mm', e: '2 × 20 × tan60° ≈ 69,3 mm.' },
      { q: 'Xỉ vượt 100 % DAC trong mối hàn dày 30 mm. Chiều dài tối đa cho phép theo ASME VIII-1 Phụ lục 12 (mm)?', num: 10, rel: 0.01, unit: 'mm', e: '19 < t ≤ 57 mm: t/3 = 10 mm.' },
      { q: 'Tốc độ di chuyển đầu dò khi quét tối đa là bao nhiêu?', o: ['150 mm/s', '500 mm/s', '15 mm/s', 'Không giới hạn'], e: 'Kèm chồng lấn ≥ 10 % kích thước biến tử.' },
      { q: 'Chuẩn đầu dò thẳng trên V1: các xung đáy cách đều nhưng tất cả lệch 1,5 mm sang phải. Chỉnh gì?', o: ['Probe delay (zero)', 'Velocity', 'Gain', 'Range'], e: 'Delay dịch đều mọi xung; velocity đổi khoảng cách giữa các xung.' },
      { q: 'Xung sắc một đỉnh, rất cao khi chùm 60° vuông góc vách vát 30°, thấp khi quét từ phía đối diện. Khả năng cao nhất?', o: ['Không ngấu vách', 'Rỗ khí', 'Ngậm xỉ', 'Gờ chân mối hàn'], e: 'Phản xạ gương mạnh từ mặt phẳng nằm trên đường vát.' }
    ] };

  const RS = { id: 'rs', track: 'safe', title: 'An toàn bức xạ trong chụp ảnh công nghiệp', en: 'Radiation Safety (Ir-192 field radiography)', src: '/Physics/X-Ray/radiationsafety.xhtml', sim: 'dosecalc', cards: ['decay', 'inverse'],
    lessons: [
      ['Bức xạ ion hóa và chiếu xạ ngoài', 'Tia gamma của Ir-192 đủ năng lượng bứt electron khỏi nguyên tử trong cơ thể. Không nhìn, nghe, ngửi hay cảm thấy được; chỉ máy đo mới phát hiện. Nguồn chụp ảnh là nguồn kín, nhỏ hơn hạt gạo. Đứng gần khi chụp là chiếu xạ ngoài: không làm người, quần áo, thức ăn bị nhiễm phóng xạ; nguồn về máy là hết bức xạ. Liều nền tự nhiên trung bình khoảng 2,4 mSv/năm (UNSCEAR 2008).'],
      ['Bốn đại lượng hay bị nhầm', 'Hoạt độ (Bq, Ci): nguồn mạnh hay yếu. Suất liều (µSv/h): ở chỗ này mỗi giờ nhận bao nhiêu, máy đo hiển thị số này. Liều hấp thụ (Gy): năng lượng cơ thể hấp thụ. Liều hiệu dụng (Sv): quy về rủi ro cho cả cơ thể, giới hạn liều dùng đơn vị này. Liều = suất liều × thời gian. Luôn hỏi lại micro (µ) hay milli (m): nhầm là sai 1000 lần. 1 rem = 10 mSv.'],
      ['Khung pháp lý Việt Nam từ 2026', 'Từ 01/01/2026: Luật Năng lượng nguyên tử số 94/2025/QH15, Nghị định 332/2025/NĐ-CP, Thông tư 59/2025/TT-BKHCN. Giới hạn liều: nhân viên bức xạ 20 mSv/năm lấy trung bình 5 năm và không quá 50 mSv trong một năm; công chúng 1 mSv/năm. Người làm việc tại công trường nhưng không phải nhân viên bức xạ được tính như công chúng.'],
      ['Phân vùng, hàng rào, vị trí thợ chụp', 'Vùng kiểm soát: nơi liều có thể từ 6 mSv/năm trở lên, chỉ nhân viên bức xạ được vào. Vùng giám sát: trên 1 đến dưới 6 mSv/năm (NĐ 332/2025 Điều 5). Tiêu chí vận hành: hàng rào đặt nơi suất liều ≤ 7,5 µSv/h khi đang chiếu, xác định bằng máy đo; vị trí thợ chụp đứng điều khiển ≤ 10 µSv/h. Giới hạn là mức không được vượt; mục tiêu luôn là thấp nhất có thể (ALARA).'],
      ['Quy trình an toàn hiện trường', 'Thông báo lịch chụp, có giấy phép làm việc, rào chắn có biển ba lá vàng đen và đèn ở mọi lối vào, rà soát không còn người, cố định chắc projector, ống dẫn, ống chuẩn trực. Thợ chụp đeo liều kế, mang máy đo đang bật, đo dọc hàng rào ở lần chiếu đầu và khi đổi vị trí, đo xác nhận nguồn đã về sau MỖI phim. Liều kế được đánh giá ít nhất 3 tháng một lần; hồ sơ liều lưu 30 năm sau khi thôi làm công việc bức xạ.']
    ],
    deep: [
      ['Hiệu ứng tất định và ngẫu nhiên', 'Hiệu ứng tất định (bỏng da, giảm bạch cầu, đục thủy tinh thể) chỉ xảy ra khi liều vượt ngưỡng trong thời gian ngắn; ngưỡng cho mô tạo máu và thủy tinh thể khoảng 0,5 Gy (ICRP 118). Hiệu ứng ngẫu nhiên (ung thư) được giả định không có ngưỡng: hệ số rủi ro danh nghĩa 5,7 % mỗi Sv (ICRP 103), tức 1 mSv ≈ 1 trên 17 500. Đây là công cụ quản lý thận trọng, không phải dự báo.'],
      ['Ứng phó khi nguồn không về', 'Sự cố hay gặp nhất: ống dẫn bị dập, cáp kẹt, nguồn tuột khỏi đầu cáp. Lùi xa, lập lại hàng rào ≤ 7,5 µSv/h bằng máy đo, báo RSO và chỉ huy công trường. Thử quay nguồn về tối đa 3 lần; nếu không được, đưa nguồn ra đầu ống chuẩn trực để giảm liều xung quanh. Chỉ cắt cáp, dùng kẹp gắp dài và container chì khi RSO đã duyệt; chia sẻ liều giữa người ứng phó, ghi liều từng người, báo cơ quan quản lý.'],
      ['Người không phải nhân viên bức xạ', 'Chỉ có bốn việc: lùi xa, báo ngay, không tự xử lý, không chạm vật lạ. Một mẩu kim loại nhỏ lạ gần khu chụp có thể chính là nguồn bị tuột; cầm nguồn vài phút có thể gây bỏng phóng xạ nặng. Mất nguồn phải báo công an và Sở KH&CN địa phương.'],
      ['Độ lớn thật của rủi ro', '20 Ci Ir-192 cho khoảng 96 mSv/h ở 1 m: đứng sát nguồn trần 10 phút nhận khoảng 16 mSv. Ống chuẩn trực giảm khoảng 10 lần ngoài chùm chính; vách thép 10 mm cho qua khoảng 58 %. Ngoài hàng rào, liều tính bằng µSv, thấp hơn ngưỡng tất định hàng nghìn lần. Rủi ro thật nằm ở liều cao và ở việc chạm vào nguồn.']
    ],
    ex: [{ q: 'Nguồn 20 Ci (740 GBq), ống chuẩn trực giảm 10 lần, không vách che. Bán kính hàng rào 7,5 µSv/h?', steps: ['Ḣ = Γ·A/(k·d²) ≤ 7,5 µSv/h', 'd = √(130 × 740 / (10 × 7,5))', '= √1283'], a: '≈ 35,8 m (đo xác nhận ở lần chiếu đầu)' },
      { q: 'Đứng nơi máy đo chỉ 10 µSv/h trong 30 phút. Liều nhận?', steps: ['Liều = suất liều × thời gian', '= 10 × 0,5 h'], a: '5 µSv' }],
    quiz: [
      { q: 'Máy đo suất liều hiển thị đại lượng nào?', o: ['Suất liều, thường µSv/h', 'Hoạt độ nguồn (GBq)', 'Liều tích lũy cả năm', 'Năng lượng photon (keV)'], e: 'Liều = suất liều × thời gian.' },
      { q: 'Đứng nơi suất liều 10 µSv/h trong 30 phút. Liều nhận bao nhiêu µSv?', num: 5, rel: 0.01, unit: 'µSv', e: '10 × 0,5 = 5 µSv.' },
      { q: 'Giới hạn liều hiệu dụng cho công chúng theo NĐ 332/2025?', o: ['1 mSv/năm', '20 mSv/năm', '6 mSv/năm', '50 mSv/năm'], e: 'Nhân viên bức xạ: 20 mSv/năm trung bình 5 năm, ≤ 50 mSv trong 1 năm.' },
      { q: 'Hàng rào chụp ảnh hiện trường được đặt ở nơi suất liều khi đang chiếu không quá bao nhiêu?', o: ['7,5 µSv/h, xác định bằng máy đo', '10 µSv/h', '20 µSv/h', '1 mSv/h'], e: 'Vị trí thợ chụp: ≤ 10 µSv/h.' },
      { q: 'Vị trí thợ chụp đứng quay nguồn phải đạt suất liều không quá bao nhiêu?', o: ['10 µSv/h', '7,5 µSv/h', '100 µSv/h', '1 µSv/h'], e: 'Tiêu chí vận hành của dự án.' },
      { q: 'Nguồn 740 GBq, ống chuẩn trực giảm 10 lần, không vách. Bán kính (m) để suất liều xuống 7,5 µSv/h?', num: 35.82, rel: 0.02, unit: 'm', e: 'd = √(130·740/(10·7,5)) ≈ 35,8 m.' },
      { q: 'Vách thép 10 mm (HVL 12,7 mm) cho qua bao nhiêu phần trăm tia Ir-192 (chùm hẹp)?', num: 57.9, rel: 0.02, unit: '%', e: '0,5^(10/12,7) ≈ 0,58.' },
      { q: 'Vùng kiểm soát theo NĐ 332/2025 là nơi liều có thể từ bao nhiêu trở lên?', o: ['6 mSv/năm', '1 mSv/năm', '20 mSv/năm', '0,1 mSv/năm'], e: 'Vùng giám sát: trên 1 đến dưới 6 mSv/năm.' },
      { q: 'Nguồn bị kẹt trong ống dẫn, không quay về được. Cách xử lý ưu tiên?', o: ['Lùi xa, lập lại hàng rào, báo RSO; quay nguồn về projector theo kế hoạch RSO', 'Dùng tay đưa nguồn vào hộp chì', 'Tiếp tục chụp phim tiếp theo', 'Chờ nguồn tự phân rã'], e: 'Cắt cáp, dùng kẹp gắp chỉ khi RSO duyệt.' },
      { q: 'Thấy một mẩu kim loại nhỏ lạ trên sàn gần khu chụp. Bạn nên làm gì?', o: ['Không chạm, lùi xa, báo ngay thợ chụp hoặc RSO', 'Nhặt lên mang cho thợ chụp', 'Đá ra khỏi lối đi', 'Chụp ảnh rồi để đó'], e: 'Có thể là nguồn bị tuột.' },
      { q: 'Vì sao phải đo xác nhận nguồn đã về sau mỗi phim?', o: ['Phần lớn tai nạn nghiêm trọng xảy ra khi không đo và không biết nguồn chưa về', 'Để ghi số liệu cho đẹp báo cáo', 'Để kiểm tra pin máy đo', 'Không cần thiết nếu nghe tiếng khóa'], e: 'Máy đo trên tay khi tiến lại gần projector và ống dẫn.' },
      { q: 'Theo mô hình ICRP, rủi ro danh nghĩa ứng với 1 mSv xấp xỉ bao nhiêu?', o: ['1 trên 17 500', '1 trên 100', '1 trên 1 000 000 000', 'Bằng 0'], e: '5,7 %/Sv × 0,001 Sv ≈ 5,7·10⁻⁵.' }
    ] };

  const MORE_GLOSSARY = [
    ['Suất liều', 'Dose rate', 'Liều nhận được trong một đơn vị thời gian tại một vị trí (µSv/h). Máy đo suất liều hiển thị đại lượng này.'],
    ['Liều hiệu dụng', 'Effective dose (Sv)', 'Liều quy về rủi ro cho toàn cơ thể; giới hạn liều dùng đơn vị này.'],
    ['Vùng giám sát', 'Supervised area', 'Nơi liều có thể trên 1 đến dưới 6 mSv/năm (NĐ 332/2025 Điều 5).'],
    ['Hàng rào an toàn', 'Barrier / boundary', 'Ranh giới khi chụp hiện trường, đặt nơi suất liều ≤ 7,5 µSv/h khi đang chiếu, xác định bằng máy đo.'],
    ['ALARA', 'As Low As Reasonably Achievable', 'Nguyên tắc giữ liều thấp nhất có thể đạt được một cách hợp lý.'],
    ['RSO', 'Radiation Safety Officer', 'Người phụ trách an toàn bức xạ: duyệt bố trí, kiểm tra liều, chỉ huy ứng phó sự cố.'],
    ['Ống chuẩn trực', 'Collimator', 'Khối kim loại nặng bao đầu nguồn, chỉ để lộ chùm chính, giảm bức xạ các hướng khác.'],
    ['Projector', 'Exposure device / Gamma camera', 'Thiết bị che chắn chứa nguồn gamma; nguồn được đẩy ra qua ống dẫn bằng cáp điều khiển.'],
    ['Hiệu ứng tất định', 'Deterministic effect', 'Tổn thương mô chỉ xảy ra khi liều vượt ngưỡng; liều càng cao càng nặng.'],
    ['Hiệu ứng ngẫu nhiên', 'Stochastic effect', 'Ảnh hưởng (ung thư) có xác suất tăng theo liều, giả định không có ngưỡng.'],
    ['Bù truyền âm', 'Transfer correction', 'Lượng gain bù cho chênh lệch tiếp âm, suy giảm giữa mẫu chuẩn và vật kiểm.'],
    ['Điểm ra tia', 'Probe index / X-value', 'Điểm chùm tia trung tâm rời nêm đi vào vật; xác định lại trên mẫu V1/V2.'],
    ['Gông từ', 'Yoke', 'Nam châm điện hình chữ U dùng để từ hóa cục bộ trong MT; AC nâng ≥ 4,5 kg, DC ≥ 18 kg.']
  ];

  function install(R) {
    R = R || root; const A = R.ACADEMY; if (!A || A.some(c => c.id === 'ut2')) return;
    const i = A.findIndex(c => c.id === 'ut'); A.splice(i + 1, 0, UT2); A.push(RS);
    R.TRACKS.safe = 'An toàn bức xạ';
    if (R.PREREQ) { R.PREREQ.ut1 = ['waves', 'sound', 'ut', 'ut2']; R.PREREQ.rt1 = ['atom', 'xray', 'rt', 'rs']; }
    if (R.GLOSSARY) for (const g of MORE_GLOSSARY) if (!R.GLOSSARY.some(x => x[0] === g[0])) R.GLOSSARY.push(g);
  }
  const api = { UT2, RS, MORE_GLOSSARY, install };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else { install(); }
})(this);
