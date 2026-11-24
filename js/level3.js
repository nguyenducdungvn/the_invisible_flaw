/* level3.js — Phòng Bậc III: soát xét quy trình, phiếu kỹ thuật, biên bản và hồ sơ nhân sự có lỗi cài sẵn.
 * Mỗi lượt chơi chọn ngẫu nhiên 3–5 dòng bị cài lỗi. Người chơi đánh dấu dòng sai và chọn cách sửa đúng.
 * Căn cứ: ASME V Điều 2, 4, 6, 7; ASME VIII-1 Phụ lục 6, 8, 12; SNT-TC-1A; ISO 9712. Phần rút gọn được ghi rõ.
 */
(function (root) {
  'use strict';
  const CASES = [
    { id: 'l3ut', method: 'UT', title: 'Quy trình UT mối hàn giáp mép dày 20 mm',
      doc: 'QT-UT-07, bản trình duyệt lần 2 do Bậc II soạn. Áp dụng: ASME V Điều 4; nghiệm thu ASME VIII-1 Phụ lục 12.',
      lines: [
        { ok: 'Mẫu chuẩn cơ bản: cùng nhóm vật liệu, dày 19 mm (hoặc t), lỗ khoan cạnh Ø2.4 mm.', bad: 'Mẫu chuẩn cơ bản: cùng nhóm vật liệu, dày 38 mm, lỗ khoan cạnh Ø3.2 mm.',
          fix: ['Mối hàn ≤ 25 mm: mẫu dày 19 mm (hoặc t), lỗ Ø2.4 mm', 'Dùng mẫu V2 để dựng DAC', 'Giữ mẫu 38 mm, chỉ giảm gain 6 dB'], ref: 'ASME V Hình T-434.2.1', why: 'Mẫu 38 mm (hoặc t) với lỗ Ø3.2 mm dành cho mối hàn dày trên 25 đến 50 mm.' },
        { ok: 'Nhiệt độ mẫu chuẩn và vật kiểm chênh nhau không quá 14 °C (25 °F).', bad: 'Mẫu chuẩn để trong phòng 25 °C, vật kiểm phơi nắng 60 °C: không cần bù nhiệt độ.',
          fix: ['Đưa mẫu chuẩn và vật kiểm về chênh lệch ≤ 14 °C rồi mới hiệu chuẩn', 'Tăng thêm 2 dB là đủ', 'Ghi nhiệt độ vào báo cáo là đủ'], ref: 'ASME V Điều 4, yêu cầu nhiệt độ khi hiệu chuẩn', why: 'Vận tốc âm trong nêm Perspex và suy giảm thay đổi đáng kể theo nhiệt độ: góc khúc xạ và độ nhạy đều lệch.' },
        { ok: 'DAC dựng từ lỗ ¼T, ½T, ¾T và các điểm chân sóng 2; lỗ cho đáp ứng cao nhất đặt ở 80 % FSH.', bad: 'DAC dựng chỉ từ lỗ ½T; các độ sâu khác nội suy theo luật bình phương ngược.',
          fix: ['Đo trực tiếp các lỗ ở nhiều độ sâu, bao phủ toàn bộ đường âm sẽ dùng', 'Dùng mức 80 % FSH cố định, không cần DAC', 'Dựng DAC trên lỗ Ø1.5 mm của mẫu V1'], ref: 'ASME V Điều 4, dựng DAC trên mẫu chuẩn cơ bản', why: 'Suy giảm và trường gần làm biên độ không theo luật bình phương ngược; DAC phải đo thực tế.' },
        { ok: 'Quét ở mức chuẩn + 6 dB (ít nhất gấp đôi mức chuẩn).', bad: 'Quét ở đúng mức chuẩn để màn hình sạch nhiễu.',
          fix: ['Quét ở ít nhất mức chuẩn + 6 dB', 'Quét ở mức chuẩn − 6 dB', 'Quét ở mức chuẩn + 20 dB'], ref: 'ASME V Điều 4, mức quét', why: 'Phản xạ lệch hướng hoặc nằm giữa hai đường quét cho biên độ thấp hơn; quét ở mức chuẩn dễ bỏ sót.' },
        { ok: 'Mọi chỉ thị vượt 20 % DAC được điều tra để xác định hình dạng, bản chất và vị trí.', bad: 'Chỉ điều tra chỉ thị vượt 50 % DAC.',
          fix: ['Điều tra mọi chỉ thị vượt 20 % DAC', 'Chỉ điều tra chỉ thị vượt 100 % DAC', 'Chỉ ghi chỉ thị vượt 80 % FSH'], ref: 'ASME VIII-1 Phụ lục 12', why: 'Nứt hoặc không ngấu có thể cho biên độ thấp nếu chùm không vuông góc; ngưỡng điều tra là 20 % mức chuẩn.' },
        { ok: 'Tốc độ di chuyển đầu dò ≤ 150 mm/s; các đường quét chồng nhau ≥ 10 % kích thước biến tử.', bad: 'Tốc độ di chuyển đầu dò ≤ 500 mm/s; không yêu cầu chồng lấn.',
          fix: ['≤ 150 mm/s, chồng lấn ≥ 10 % kích thước biến tử', 'Tốc độ tùy ý nếu máy có ghi dữ liệu', 'Chồng lấn 1 % là đủ'], ref: 'ASME V Điều 4, kỹ thuật quét', why: 'Quét nhanh hoặc không chồng lấn để lọt vùng giữa hai đường quét.' },
        { ok: 'Kiểm tra lại hiệu chuẩn khi đổi đầu dò, cáp, người và khi kết thúc; độ nhạy giảm quá 2 dB thì hủy dữ liệu từ lần kiểm tra hợp lệ trước và kiểm tra lại vùng đó.', bad: 'Kiểm tra lại hiệu chuẩn cuối ca; độ nhạy lệch 4 dB thì ghi chú vào báo cáo.',
          fix: ['Lệch quá 2 dB: hiệu chỉnh; độ nhạy giảm thì hủy dữ liệu và kiểm tra lại vùng đã quét', 'Tăng gain 4 dB cho phần còn lại', 'Không cần kiểm tra lại nếu máy mới hiệu chuẩn'], ref: 'ASME V Điều 4 (T-466)', why: 'Độ nhạy giảm nghĩa là mọi vùng quét từ lần kiểm tra hợp lệ trước có thể đã bỏ sót.' },
        { ok: 'Ví dụ trong quy trình: xỉ vượt 100 % DAC dài 6 mm trong mối hàn 20 mm → đạt (giới hạn t/3 ≈ 6.7 mm).', bad: 'Ví dụ trong quy trình: xỉ vượt 100 % DAC dài 7 mm trong mối hàn 20 mm → đạt.',
          fix: ['7 mm > t/3 ≈ 6.7 mm → không đạt', 'Đạt, vì giới hạn là t/2 = 10 mm', 'Đạt, vì xỉ không bao giờ bị loại'], ref: 'ASME VIII-1 Phụ lục 12', why: 'Chiều dày 20 mm nằm trong dải áp dụng t/3: 20/3 ≈ 6.7 mm.' },
        { ok: 'Chỉ thị xác định là nứt, không ngấu hoặc không thấu: không chấp nhận, bất kể chiều dài.', bad: 'Không ngấu dài dưới 6 mm được chấp nhận nếu biên độ dưới 100 % DAC.',
          fix: ['Nứt, không ngấu, không thấu: không chấp nhận bất kể chiều dài', 'Nứt dưới 3 mm được chấp nhận', 'Không thấu được chấp nhận nếu dưới 20 % DAC'], ref: 'ASME VIII-1 Phụ lục 12', why: 'Giới hạn chiều dài chỉ áp cho các khuyết tật khác như xỉ, rỗ.' },
        { ok: 'Người thực hiện và đánh giá có chứng chỉ UT còn hiệu lực theo quy trình chứng nhận của đơn vị.', bad: 'Người thực hiện có chứng chỉ UT đã hết hạn 3 tháng, đang chờ gia hạn: vẫn được ký kết quả.',
          fix: ['Chỉ người có chứng chỉ còn hiệu lực được thực hiện và ký kết quả', 'Được ký nếu Bậc III ký kèm', 'Được ký trong 6 tháng chờ gia hạn'], ref: 'SNT-TC-1A / ISO 9712', why: 'Chứng chỉ hết hạn thì không còn được công nhận năng lực.' }
      ] },
    { id: 'l3rt', method: 'RT', title: 'Phiếu kỹ thuật và biên bản đọc phim RT, Ir-192, thép dày 25 mm',
      doc: 'PKT-RT-12 và biên bản đọc phim đợt 3. Áp dụng: ASME V Điều 2; an toàn theo NĐ 332/2025 và tiêu chí dự án.',
      lines: [
        { ok: 'Mật độ phim trong vùng quan tâm: 2.0 – 4.0 (nguồn gamma, xem từng phim riêng).', bad: 'Mật độ phim tối thiểu 1.5 là đạt.',
          fix: ['Gamma: mật độ 2.0 – 4.0', 'Tối thiểu 1.0 là đủ', 'Không giới hạn nếu thấy IQI'], ref: 'ASME V T-282.1', why: 'Mật độ thấp làm giảm độ tương phản phim; nguồn gamma yêu cầu tối thiểu 2.0 khi xem từng phim.' },
        { ok: 'Mật độ trong vùng quan tâm lệch không quá −15 % / +30 % so với mật độ qua thân IQI; vượt thì đặt thêm IQI.', bad: 'Mật độ trong vùng quan tâm được lệch ± 50 % so với IQI.',
          fix: ['Trong khoảng −15 % / +30 %; vượt thì thêm IQI', 'Không cần so với IQI', 'Lệch bao nhiêu cũng được nếu dây thiết yếu hiện'], ref: 'ASME V T-282.2', why: 'IQI chỉ chứng minh độ nhạy ở mật độ gần mật độ thân IQI.' },
        { ok: 'Nguồn 3.0 mm, khoảng cách nguồn – mặt vật 300 mm, vật dày 25 mm: Ug = 3 × 25 / 300 = 0.25 mm.', bad: 'Nguồn 3.0 mm, khoảng cách nguồn – mặt vật 100 mm, vật dày 25 mm: Ug = 0.75 mm, đạt.',
          fix: ['0.75 mm vượt 0.51 mm thường áp cho vật < 50 mm: tăng khoảng cách nguồn', 'Đạt, Ug không bị giới hạn', 'Giảm thời gian chụp để giảm Ug'], ref: 'ASME V T-274.2 (kiểm tra theo phiên bản bộ luật áp dụng)', why: 'Ug = F·d/D; tăng D là cách trực tiếp nhất để giảm nhòe hình học.' },
        { ok: 'Chữ chì “B” sau cassette: không thấy hoặc thấy tối hơn nền → không có tán xạ ngược quá mức.', bad: 'Chữ chì “B” hiện sáng hơn nền trên phim: chấp nhận, ghi chú.',
          fix: ['B sáng hơn nền: tán xạ ngược quá mức, chụp lại với che chắn phía sau tốt hơn', 'Chấp nhận nếu IQI vẫn đạt', 'Bỏ chữ B ở lần chụp sau'], ref: 'ASME V T-223, T-284', why: 'Ảnh B sáng nghĩa là bức xạ tán xạ từ phía sau đủ mạnh để làm đen phim quanh chữ chì.' },
        { ok: 'Phim không có vết xước, nếp gấp, vết tĩnh điện trong vùng quan tâm.', bad: 'Phim có vết tĩnh điện trong vùng quan tâm: chấp nhận vì không phải khuyết tật mối hàn.',
          fix: ['Chụp lại: vết giả trong vùng quan tâm có thể che hoặc bị nhầm với khuyết tật', 'Chấp nhận nếu người đọc phim ghi chú', 'Xem dưới đèn sáng hơn là đủ'], ref: 'ASME V T-281', why: 'Vết tĩnh điện có thể giống nứt, hoặc che khuyết tật thật.' },
        { ok: 'IQI đặt phía nguồn; chỉ đặt phía phim khi không tiếp cận được phía nguồn, kèm chữ chì “F”.', bad: 'IQI đặt phía phim cho tiện, không cần ký hiệu.',
          fix: ['Đặt phía nguồn; phía phim chỉ khi không tiếp cận được và có chữ “F”', 'Không cần IQI nếu thấy rõ mối hàn', 'Đặt ở bất kỳ đâu trên phim'], ref: 'ASME V T-277.1', why: 'IQI phía phim cho hình ảnh rõ hơn thực tế, làm độ nhạy bị đánh giá cao.' },
        { ok: 'Hàng rào đặt nơi suất liều ≤ 7.5 µSv/h khi đang chiếu, xác định bằng máy đo ở lần chiếu đầu; vị trí thợ chụp ≤ 10 µSv/h.', bad: 'Hàng rào đặt theo bán kính tính toán, không cần đo.',
          fix: ['Tính để đặt sơ bộ, rồi đo xác nhận ≤ 7.5 µSv/h ở lần chiếu đầu', 'Rào ở 20 µSv/h là đủ', 'Không cần rào nếu chụp ban đêm'], ref: 'NĐ 332/2025; tiêu chí dự án', why: 'Tính toán không tính tán xạ và chùm thực; chỉ máy đo mới xác nhận được.' },
        { ok: 'Đo xác nhận nguồn đã về bằng máy đo sau mỗi lần chiếu.', bad: 'Nghe tiếng khóa của projector là đủ xác nhận nguồn đã về.',
          fix: ['Đo bằng máy đo sau mỗi lần chiếu, tiến lại gần với máy đo trên tay', 'Đo một lần cuối ca', 'Nhìn đèn báo trên tay quay'], ref: 'Quy trình an toàn bức xạ; IAEA SSG-11', why: 'Phần lớn tai nạn nghiêm trọng xảy ra khi không đo và không biết nguồn chưa về.' },
        { ok: 'Đọc phim trong phòng ánh sáng dịu, đèn đọc đủ sáng để thấy dây thiết yếu của IQI ở dải mật độ quy định, che sáng quanh mép phim.', bad: 'Đọc phim ngoài hiện trường, áp phim vào cửa sổ có nắng.',
          fix: ['Phòng ánh sáng dịu, đèn đọc phim đủ cường độ, che sáng mép', 'Đọc ngoài trời nắng cho sáng', 'Dùng đèn pin điện thoại'], ref: 'ASME V T-234', why: 'Ánh sáng lọt quanh mép phim làm mắt không phân biệt được chênh lệch mật độ nhỏ.' }
      ] },
    { id: 'l3mt', method: 'MT', title: 'Quy trình MT gông từ cho mối hàn góc',
      doc: 'QT-MT-03. Áp dụng: ASME V Điều 7; nghiệm thu ASME VIII-1 Phụ lục 6.',
      lines: [
        { ok: 'Gông AC có lực nâng ≥ 4.5 kg, gông DC ≥ 18 kg, ở khoảng cách cực lớn nhất sẽ dùng.', bad: 'Gông AC nâng được 2.5 kg ở khoảng cách cực lớn nhất: đạt.',
          fix: ['AC ≥ 4.5 kg (DC ≥ 18 kg) ở khoảng cách cực lớn nhất', 'Chỉ kiểm tra lực nâng khi mua mới', 'Gông AC cần nâng 18 kg'], ref: 'ASME V T-762', why: 'Lực nâng là bằng chứng gông tạo đủ từ trường.' },
        { ok: 'Mỗi vùng kiểm tra ít nhất hai lần, lần hai với đường sức từ gần vuông góc lần một.', bad: 'Kiểm tra một lần, gông đặt dọc theo mối hàn.',
          fix: ['Hai lần, hướng từ trường vuông góc nhau', 'Hai lần cùng hướng cho chắc', 'Một lần là đủ với hạt huỳnh quang'], ref: 'ASME V Điều 7', why: 'Vết nứt song song với đường sức từ hầu như không tạo từ trường rò.' },
        { ok: 'Hạt màu: ánh sáng trắng ≥ 1000 lux tại bề mặt.', bad: 'Hạt màu: ánh sáng xưởng khoảng 300 lux là đủ.',
          fix: ['≥ 1000 lux tại bề mặt, đo bằng máy đo lux', 'Tùy người kiểm tra', '≥ 100 lux'], ref: 'ASME V Điều 7', why: 'Chỉ thị nhỏ không thấy được dưới ánh sáng yếu.' },
        { ok: 'Hạt huỳnh quang: UV-A ≥ 1000 µW/cm² tại bề mặt, ánh sáng nền ≤ 20 lux, thích nghi bóng tối ít nhất 5 phút.', bad: 'Hạt huỳnh quang: phòng khoảng 200 lux là đủ tối, không cần thích nghi bóng tối.',
          fix: ['Nền ≤ 20 lux, UV-A ≥ 1000 µW/cm², thích nghi bóng tối ≥ 5 phút', 'Chỉ cần đèn UV mạnh hơn', 'Kiểm tra ngoài trời ban ngày'], ref: 'ASME V Điều 7', why: 'Ánh huỳnh quang yếu bị ánh sáng nền lấn át.' },
        { ok: 'Chỉ thị liên quan: kích thước lớn hơn 1.6 mm; dạng đường khi dài lớn hơn 3 lần rộng.', bad: 'Mọi vệt hạt nhìn thấy đều là chỉ thị liên quan, kể cả 0.5 mm.',
          fix: ['Liên quan khi > 1.6 mm; dạng đường khi dài > 3 lần rộng', 'Chỉ chỉ thị > 5 mm là liên quan', 'Không cần phân loại'], ref: 'ASME VIII-1 Phụ lục 6', why: 'Định nghĩa rõ giúp các kỹ thuật viên đánh giá như nhau.' },
        { ok: 'Chỉ thị dạng đường liên quan: không chấp nhận.', bad: 'Chỉ thị dạng đường dài 3 mm: chấp nhận vì nhỏ hơn 4.8 mm.',
          fix: ['Dạng đường dài 3 mm (> 1.6 mm) là liên quan: không chấp nhận', 'Chấp nhận nếu dưới 5 mm', 'Chấp nhận nếu chỉ có một'], ref: 'ASME VIII-1 Phụ lục 6', why: 'Giới hạn 4.8 mm chỉ áp cho chỉ thị tròn.' },
        { ok: 'Chỉ thị tròn lớn hơn 4.8 mm: không chấp nhận.', bad: 'Chỉ thị tròn 5 mm: chấp nhận.',
          fix: ['5 mm > 4.8 mm: không chấp nhận', 'Chấp nhận nếu không phải dạng đường', 'Chấp nhận nếu nằm ở chân mối hàn'], ref: 'ASME VIII-1 Phụ lục 6', why: 'Ngưỡng tròn 4.8 mm (3/16 in).' },
        { ok: 'Bốn chỉ thị tròn trở lên thẳng hàng, cách nhau ≤ 1.6 mm (mép tới mép): không chấp nhận.', bad: 'Bốn chỉ thị tròn 2 mm thẳng hàng, cách nhau 1 mm: chấp nhận vì từng cái đều < 4.8 mm.',
          fix: ['Bốn chỉ thị thẳng hàng cách ≤ 1.6 mm: không chấp nhận', 'Chấp nhận nếu tổng dưới 10 mm', 'Chấp nhận nếu cách nhau trên 0.5 mm'], ref: 'ASME VIII-1 Phụ lục 6', why: 'Chuỗi rỗ thẳng hàng hoạt động như một vết nứt.' },
        { ok: 'Chỉ thị nghi không liên quan (biên vùng từ hóa, đổi tiết diện) phải được xác minh bằng kiểm tra lại hoặc phương pháp khác.', bad: 'Chỉ thị nào không chắc thì coi là không liên quan.',
          fix: ['Xác minh bằng làm lại hoặc phương pháp khác trước khi kết luận', 'Coi là liên quan và loại bỏ luôn', 'Bỏ qua, không ghi'], ref: 'ASME V Điều 7', why: '“Không chắc” không phải là một kết luận.' }
      ] },
    { id: 'l3pt', method: 'PT', title: 'Quy trình PT dung môi, chất thấm màu',
      doc: 'QT-PT-02. Áp dụng: ASME V Điều 6; nghiệm thu ASME VIII-1 Phụ lục 8.',
      lines: [
        { ok: 'Nhiệt độ bề mặt và chất thấm trong khoảng 5 – 52 °C; ngoài khoảng này phải chứng minh quy trình.', bad: 'Bề mặt 70 °C ngay sau hàn: cứ phun chất thấm cho kịp tiến độ.',
          fix: ['Chờ về 5 – 52 °C, hoặc dùng quy trình đã chứng minh ở nhiệt độ đó', 'Kéo dài thời gian thấm gấp đôi', 'Phun nhiều chất thấm hơn'], ref: 'ASME V Điều 6', why: 'Chất thấm bay hơi, khô trên bề mặt nóng, không vào được vết nứt.' },
        { ok: 'Thời gian thấm tối thiểu 5 phút (mối hàn, theo bảng của quy trình).', bad: 'Thời gian thấm 1 phút vì chất thấm thế hệ mới.',
          fix: ['Tối thiểu 5 phút theo bảng thời gian thấm', '30 giây là đủ', 'Không quy định'], ref: 'ASME V Bảng T-672', why: 'Vết nứt khít cần thời gian để chất thấm đi vào bằng mao dẫn.' },
        { ok: 'Lau phần dư bằng khăn khô, rồi khăn thấm ẩm dung môi; cấm xịt dung môi trực tiếp lên bề mặt.', bad: 'Xịt dung môi trực tiếp lên bề mặt để rửa sạch nhanh.',
          fix: ['Khăn khô, rồi khăn ẩm dung môi; không xịt trực tiếp', 'Rửa bằng nước áp lực', 'Không cần lau'], ref: 'ASME V Điều 6', why: 'Xịt dung môi trực tiếp rửa luôn chất thấm trong vết nứt.' },
        { ok: 'Phun lớp hiện mỏng, đều.', bad: 'Phun lớp hiện thật dày để chỉ thị rõ hơn.',
          fix: ['Lớp hiện mỏng, đều', 'Lớp hiện càng dày càng tốt', 'Không cần lớp hiện'], ref: 'ASME V Điều 6', why: 'Lớp hiện dày che khuất chỉ thị nhỏ.' },
        { ok: 'Đánh giá cuối cùng trong khoảng 10 – 60 phút sau khi lớp hiện khô.', bad: 'Đọc kết quả sau 2 giờ để chỉ thị hiện đủ.',
          fix: ['Đánh giá trong 10 – 60 phút sau khi lớp hiện khô', 'Đọc ngay khi vừa phun lớp hiện', 'Để qua đêm'], ref: 'ASME V Điều 6', why: 'Để quá lâu chỉ thị loang rộng, chập vào nhau, sai kích thước.' },
        { ok: 'Ánh sáng trắng ≥ 1000 lux tại bề mặt khi đánh giá chất thấm màu.', bad: 'Ánh sáng xưởng khoảng 300 lux khi đánh giá chất thấm màu.',
          fix: ['≥ 1000 lux tại bề mặt', '≥ 100 lux', 'Không quy định'], ref: 'ASME V Điều 6', why: 'Chỉ thị đỏ nhỏ trên nền trắng cần đủ ánh sáng mới phân biệt được.' },
        { ok: 'Chỉ thị dạng đường liên quan (> 1.6 mm): không chấp nhận; chỉ thị tròn > 4.8 mm: không chấp nhận.', bad: 'Chỉ thị dạng đường 2 mm: chấp nhận vì nhỏ hơn 4.8 mm.',
          fix: ['Dạng đường > 1.6 mm là liên quan: không chấp nhận', 'Chấp nhận nếu dưới 5 mm', 'Chấp nhận nếu chỉ có một'], ref: 'ASME VIII-1 Phụ lục 8', why: 'Giới hạn 4.8 mm chỉ áp cho chỉ thị tròn.' },
        { ok: 'Làm sạch chất thấm và chất hiện sau kiểm tra khi chúng có thể ảnh hưởng đến bước tiếp theo.', bad: 'Để nguyên lớp hiện rồi sơn phủ luôn.',
          fix: ['Làm sạch sau kiểm tra trước khi sơn, hàn hoặc vận hành', 'Sơn đè lên là được', 'Không cần làm sạch'], ref: 'ASME V Điều 6', why: 'Cặn chất thấm, chất hiện làm bong sơn, nhiễm bẩn khi hàn tiếp.' }
      ] },
    { id: 'l3per', method: 'QA', title: 'Hồ sơ nhân sự và chứng nhận NDT',
      doc: 'Sổ tay chất lượng, mục Nhân sự NDT. Áp dụng: SNT-TC-1A (chứng nhận do người sử dụng lao động) và ISO 9712 (chứng nhận bên thứ ba).',
      lines: [
        { ok: 'Thị lực gần (Jaeger J1 hoặc tương đương, ở khoảng cách ≥ 30 cm) kiểm tra hằng năm.', bad: 'Thị lực gần kiểm tra 3 năm một lần.',
          fix: ['Kiểm tra thị lực gần hằng năm', '5 năm một lần, khi gia hạn', 'Chỉ khi cấp lần đầu'], ref: 'SNT-TC-1A; ISO 9712', why: 'Thị lực thay đổi theo thời gian; người đọc chỉ thị cần thị lực được xác nhận gần đây.' },
        { ok: 'Kiểm tra phân biệt màu theo yêu cầu của phương pháp.', bad: 'Không cần kiểm tra phân biệt màu cho nhân viên PT hạt màu.',
          fix: ['Kiểm tra phân biệt màu, nhất là PT, MT', 'Chỉ cần với RT', 'Không cần với ai'], ref: 'SNT-TC-1A; ISO 9712', why: 'PT, MT dùng tương phản màu; người không phân biệt được sẽ bỏ sót chỉ thị.' },
        { ok: 'Chứng chỉ ISO 9712 hiệu lực tối đa 5 năm; gia hạn cần bằng chứng làm việc liên tục.', bad: 'Chứng chỉ ISO 9712 có giá trị vĩnh viễn sau khi thi đạt.',
          fix: ['Hiệu lực tối đa 5 năm, phải gia hạn hoặc chứng nhận lại', 'Có giá trị vĩnh viễn', 'Hiệu lực 1 năm'], ref: 'ISO 9712', why: 'Năng lực phải được duy trì và chứng minh định kỳ.' },
        { ok: 'Theo SNT-TC-1A, chứng nhận do người sử dụng lao động cấp theo quy trình viết (written practice) của đơn vị.', bad: 'Theo SNT-TC-1A, chứng chỉ do ASNT cấp trực tiếp cho từng người và có giá trị ở mọi công ty.',
          fix: ['SNT-TC-1A: người sử dụng lao động chứng nhận theo written practice', 'ASNT cấp và có giá trị mọi nơi', 'Cơ quan nhà nước cấp'], ref: 'SNT-TC-1A', why: 'SNT-TC-1A là khuyến nghị thực hành cho người sử dụng lao động; chuyển công ty thì công ty mới phải chứng nhận lại.' },
        { ok: 'ISO 9712: chứng nhận do tổ chức chứng nhận độc lập cấp, được công nhận theo ISO/IEC 17024.', bad: 'ISO 9712: công ty tự cấp chứng chỉ cho nhân viên của mình.',
          fix: ['Tổ chức chứng nhận bên thứ ba (công nhận ISO/IEC 17024) cấp', 'Công ty tự cấp', 'Trung tâm đào tạo nào cũng cấp được'], ref: 'ISO 9712; ISO/IEC 17024', why: 'Đây là khác biệt cốt lõi giữa ISO 9712 và SNT-TC-1A.' },
        { ok: 'Bậc I: thực hiện hiệu chuẩn, kiểm tra và đánh giá cụ thể theo hướng dẫn bằng văn bản, dưới sự giám sát của Bậc II hoặc III.', bad: 'Bậc I: tự chọn phương pháp và kỹ thuật, ký báo cáo cuối cùng một cách độc lập.',
          fix: ['Bậc I làm theo hướng dẫn bằng văn bản, dưới giám sát', 'Bậc I được tự chọn kỹ thuật nếu có 5 năm kinh nghiệm', 'Bậc I được phê duyệt quy trình'], ref: 'SNT-TC-1A; ISO 9712', why: 'Chọn kỹ thuật và chịu trách nhiệm kết quả cuối thuộc Bậc II, III.' },
        { ok: 'Bậc III: xây dựng và phê duyệt quy trình, diễn giải bộ luật, chọn phương pháp và kỹ thuật.', bad: 'Bậc II: phê duyệt quy trình kiểm tra của công ty.',
          fix: ['Phê duyệt quy trình là trách nhiệm của Bậc III', 'Bậc I phê duyệt được', 'Không cần ai phê duyệt'], ref: 'SNT-TC-1A; ISO 9712', why: 'Bậc II soạn hướng dẫn công việc; Bậc III thiết lập và phê duyệt quy trình.' }
      ] }
  ];

  const pickBad = (n, rng) => { const k = 3 + Math.floor(rng() * Math.min(3, n - 3)); const idx = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return new Set(idx.slice(0, k)); };
  const shuffle = (a, rng) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* Chấm: dòng sai được đánh dấu + sửa đúng = 2; đánh dấu nhưng sửa sai = 1; đánh dấu nhầm dòng đúng = −1 */
  function score(c, bad, flags) {
    let pts = 0, max = 2 * bad.size, falseFlags = 0, hit = 0, fixed = 0;
    c.lines.forEach((l, i) => { const f = flags[i]; if (bad.has(i)) { if (f) { hit++; if (f.fix === 0) { pts += 2; fixed++; } else pts += 1; } } else if (f) { pts -= 1; falseFlags++; } });
    return { pct: Math.max(0, Math.min(1, pts / max)), hit, fixed, falseFlags, nBad: bad.size };
  }

  function install(G) {
    const { h, toast } = G;
    const S = () => G.S();
    const canOpen = c => c.method === 'QA' ? Object.values(S().certs).filter(v => v >= 2).length >= 2 : (S().certs[c.method] || 0) >= 2;
    const need = c => c.method === 'QA' ? 'Cần Bậc II ở ít nhất 2 phương pháp' : `Cần Bậc II ${c.method}`;

    G.level3 = function () {
      const s = S(); s.l3 = s.l3 || {};
      G.page(h('div', null,
        h('div', { class: 'row' }, h('h2', { style: 'margin:0' }, 'Phòng Bậc III · Soát xét'), h('span', { class: 'spacer' }), h('button', { class: 'btn sm ghost', onclick: () => G.hub() }, '← Trung tâm')),
        h('div', { class: 'card' }, h('p', null, 'Bậc III không còn cầm đầu dò mỗi ngày. Việc của bạn là đọc quy trình, phiếu kỹ thuật, biên bản và hồ sơ người khác viết, tìm chỗ sai trước khi nó thành một mối hàn hỏng được ký “ĐẠT”.'),
          h('p', { class: 'dim' }, 'Mỗi tài liệu có 3–5 dòng bị cài lỗi, thay đổi mỗi lần mở. Đánh dấu dòng sai và chọn cách sửa. Sửa đúng được 2 điểm, chỉ đánh dấu được 1 điểm, đánh dấu nhầm dòng đúng bị trừ 1. Đạt từ 80 % thì được Bậc III của phương pháp đó (trong game).')),
        CASES.map(c => { const ok = canOpen(c), best = s.l3[c.id];
          return h('div', { class: 'card contract' + (ok ? '' : ' locked'), onclick: () => ok ? G.level3Case(c.id) : toast(need(c)) },
            h('div', { class: 'row' }, h('span', { class: 'meth' }, c.method === 'QA' ? 'HS' : c.method), h('div', null, h('h3', { style: 'margin:0' }, c.title), h('div', { class: 'dim', style: 'font-size:.88rem' }, ok ? c.doc : need(c))),
              h('span', { class: 'spacer' }), best != null ? h('span', { class: 'chip' + (best >= 0.8 ? ' ok' : '') }, `Tốt nhất ${Math.round(best * 100)} %`) : null, h('span', { class: 'btn sm' + (ok ? '' : ' ghost') }, ok ? 'Soát xét' : 'Khóa'))); })));
    };

    G.level3Case = function (id) {
      const c = CASES.find(x => x.id === id), rng = Math.random, bad = pickBad(c.lines.length, rng), flags = {};
      const opts = c.lines.map(l => shuffle(l.fix.map((t, k) => [t, k]), rng));
      G.Game3 = { c, bad, flags };
      const rows = c.lines.map((l, i) => {
        const box = h('div', { class: 'l3line' }), sel = h('div', { class: 'l3fix', style: 'display:none' }, h('div', { class: 'dim', style: 'font-size:.85rem' }, 'Chọn cách sửa:'),
          opts[i].map(([t, k]) => h('label', null, h('input', { type: 'radio', name: 'fx' + i, value: k, onchange: () => { if (flags[i]) flags[i].fix = k; } }), h('span', null, t))));
        const flag = h('button', { class: 'btn sm ghost' }, 'Đánh dấu sai');
        flag.onclick = () => { if (flags[i]) { delete flags[i]; sel.style.display = 'none'; sel.querySelectorAll('input').forEach(x => { x.checked = false; }); flag.textContent = 'Đánh dấu sai'; box.classList.remove('flag'); } else { flags[i] = { fix: -1 }; sel.style.display = ''; flag.textContent = 'Bỏ đánh dấu'; box.classList.add('flag'); } };
        box.append(h('div', { class: 'row', style: 'align-items:flex-start;flex-wrap:nowrap' }, h('span', { class: 'mono dim', style: 'min-width:2.2em' }, `${i + 1}.`), h('div', { style: 'flex:1' }, bad.has(i) ? l.bad : l.ok), flag), sel);
        return box;
      });
      G.page(h('div', null,
        h('div', { class: 'row' }, h('h2', { style: 'margin:0' }, c.title), h('span', { class: 'spacer' }), h('button', { class: 'btn sm ghost', onclick: () => G.level3() }, '← Phòng Bậc III')),
        h('div', { class: 'card' }, h('div', { class: 'dim' }, c.doc), h('p', { class: 'serif', style: 'margin-bottom:0' }, 'Tài liệu này được trình bạn ký phê duyệt. Dòng nào sai?')),
        h('div', { class: 'card' }, rows),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => result() }, 'Nộp kết quả soát xét'))));
      function result() {
        const r = score(c, bad, flags), s = S(); s.l3 = s.l3 || {}; s.l3[c.id] = Math.max(s.l3[c.id] || 0, r.pct);
        let cert = ''; if (r.pct >= 0.8 && c.method !== 'QA' && (s.certs[c.method] || 0) < 3) { s.certs[c.method] = 3; cert = `Chúc mừng: bạn đạt Bậc III ${c.method} (trong game).`; }
        if (r.pct >= 0.8 && c.method === 'QA') cert = 'Hồ sơ nhân sự: đạt.';
        G.save();
        G.page(h('div', null,
          h('div', { class: 'card', style: 'text-align:center' }, h('div', { class: 'big ' + (r.pct >= 0.8 ? 'ok' : r.pct >= 0.5 ? 'hi' : 'bad') }, `${Math.round(r.pct * 100)} %`),
            h('p', null, `Tìm ra ${r.hit}/${r.nBad} dòng sai, sửa đúng ${r.fixed}; đánh dấu nhầm ${r.falseFlags} dòng đúng.`), cert ? h('div', { class: 'callout ok' }, cert) : r.pct < 0.8 ? h('p', { class: 'dim' }, 'Cần từ 80 % để đạt. Mở lại để soát một bản khác: lỗi cài ở các dòng khác.') : null),
          h('div', { class: 'card' }, h('h3', null, 'Đáp án từng dòng'), c.lines.map((l, i) => { const isBad = bad.has(i), f = flags[i];
            const st = isBad ? (f ? (f.fix === 0 ? ['ok', '✓ Tìm ra và sửa đúng'] : ['hi', '◐ Tìm ra nhưng sửa chưa đúng']) : ['bad', '✗ Bỏ sót']) : (f ? ['bad', '✗ Đánh dấu nhầm: dòng này đúng'] : ['dim', 'Đúng']);
            return h('div', { class: 'l3line' + (isBad ? ' flag' : '') }, h('div', null, h('b', null, `${i + 1}. `), isBad ? l.bad : l.ok), h('div', { class: st[0] }, st[1]),
              isBad ? h('div', null, h('b', null, 'Sửa: '), l.fix[0]) : null, isBad ? h('div', { class: 'dim' }, l.why) : null, h('div', { class: 'dim', style: 'font-size:.82rem' }, 'Căn cứ: ' + l.ref)); })),
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => G.level3Case(c.id) }, 'Soát một bản khác'), h('button', { class: 'btn ghost', onclick: () => G.level3() }, 'Phòng Bậc III'), h('button', { class: 'btn ghost', onclick: () => G.hub() }, 'Trung tâm'))));
        G.hud && G.hud();
      }
    };
  }

  const api = { CASES, score, pickBad };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.L3CASES = CASES; install(root.Game); }
})(this);
