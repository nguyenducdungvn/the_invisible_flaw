/* academy_data.js — Học viện NDE. Cấu trúc chương theo NDE-Ed.org (Physics; NDE Techniques), nội dung viết lại bằng tiếng Việt,
 * bổ sung căn cứ tiêu chuẩn khi cần. Câu hỏi: { q, o:[đáp án ĐÚNG đặt đầu, …], e } hoặc { q, num, rel|abs, unit, e }.
 * Mọi đáp số dạng số được tools/check.js tính lại bằng physics.js.
 */
(function (root) {
  'use strict';
  const NDE = 'https://www.nde-ed.org';
  const ACADEMY = [
    /* ================= VẬT LÝ NỀN TẢNG ================= */
    { id: 'atom', track: 'phys', title: 'Nguyên tử & nguyên tố', en: 'The Atom and Elements', src: '/Physics/AtomElements/index.xhtml', sim: 'atom', cards: [],
      lessons: [
        ['Ba hạt cơ bản', 'Nguyên tử gồm hạt nhân (proton mang điện dương, neutron không mang điện) và các electron mang điện âm bao quanh. Gần như toàn bộ khối lượng nằm ở hạt nhân.'],
        ['Số Z quyết định nguyên tố', 'Số proton Z (số hiệu nguyên tử) quyết định đó là nguyên tố gì: Z = 26 là sắt, Z = 77 là iridi. Số khối A = Z + N, với N là số neutron.'],
        ['Đồng vị và phóng xạ', 'Cùng Z nhưng khác N là các đồng vị. Một số đồng vị không bền: hạt nhân tự phân rã và phát bức xạ. Ir-192, Se-75, Co-60 là các đồng vị gamma dùng trong chụp bức xạ công nghiệp.'],
        ['Electron tự do và ion hóa', 'Electron lớp ngoài cùng của kim loại liên kết lỏng lẻo nên dễ di chuyển: đó là lý do kim loại dẫn điện, và là nền tảng của kiểm tra dòng xoáy. Bức xạ đủ năng lượng để bứt electron khỏi nguyên tử gọi là bức xạ ion hóa; nó phá vỡ liên kết hóa học trong mô sống, nên phải kiểm soát liều.']
      ],
      quiz: [
        { q: 'Điều gì quyết định một nguyên tử là nguyên tố nào?', o: ['Số proton trong hạt nhân', 'Số neutron', 'Số electron lớp ngoài', 'Khối lượng nguyên tử'], e: 'Z = số proton là “chứng minh thư” của nguyên tố.' },
        { q: 'Iridi có Z = 77. Hạt nhân Ir-192 có bao nhiêu neutron?', num: 115, abs: 0, unit: 'neutron', e: 'N = A − Z = 192 − 77 = 115.' },
        { q: 'Hai đồng vị của cùng một nguyên tố khác nhau ở điểm nào?', o: ['Số neutron', 'Số proton', 'Tính chất hóa học cơ bản', 'Điện tích hạt nhân'], e: 'Cùng Z, khác N, nên khác số khối A.' },
        { q: 'Vì sao kim loại dẫn điện tốt?', o: ['Có nhiều electron hóa trị liên kết lỏng lẻo, di chuyển tự do', 'Hạt nhân có nhiều neutron', 'Có cấu trúc tinh thể trong suốt', 'Electron bị giữ chặt trong liên kết cộng hóa trị'], e: 'Electron tự do mang dòng điện: cơ sở của ET và đo độ dẫn điện.' },
        { q: 'Vì sao tia X và tia gamma nguy hiểm cho cơ thể?', o: ['Chúng ion hóa nguyên tử, phá vỡ liên kết hóa học trong tế bào', 'Chúng làm nóng cơ thể như lò vi sóng', 'Chúng làm nhiễm từ máu', 'Chúng chỉ nguy hiểm khi nhìn thấy được'], e: 'Bức xạ ion hóa gây tổn thương ADN; không nhìn, không nghe, không cảm thấy được.' }
      ] },

    { id: 'elec', track: 'phys', title: 'Điện học & hiệu ứng bề mặt', en: 'Electricity', src: '/Physics/Electricity/index.xhtml', sim: 'skin', cards: ['impedance', 'skindepth'],
      lessons: [
        ['Dòng điện, điện áp, điện trở', 'Định luật Ohm: V = I·R. Điện trở dây dẫn R = ρ·L/A tăng theo chiều dài, giảm theo tiết diện. Độ dẫn điện σ = 1/ρ thường biểu diễn theo % IACS (100 % IACS = 5,8·10⁷ S/m, đồng ủ tiêu chuẩn).'],
        ['Cảm ứng và cảm kháng', 'Dòng xoay chiều trong cuộn dây tạo từ trường biến thiên; từ trường đó cảm ứng điện áp ngược lại trong chính cuộn dây (tự cảm) và trong vật dẫn ở gần (hỗ cảm). Cảm kháng XL = 2πfL.'],
        ['Trở kháng và góc pha', 'Với mạch có R và XL, trở kháng Z = √(R² + XL²) và góc pha tanφ = XL/R. Thiết bị ET vẽ chính cặp (R, XL) này lên “mặt phẳng trở kháng”.'],
        ['Hiệu ứng bề mặt (skin effect)', 'Dòng xoáy tập trung ở gần bề mặt và giảm theo hàm mũ khi vào sâu. Độ sâu thấm chuẩn δ = 1/√(πfμσ): tại δ mật độ dòng còn khoảng 37 %. Tăng tần số, độ dẫn điện hoặc độ từ thẩm thì δ giảm. Ngoài khoảng 3δ (≈ 5 %), dòng xoáy gần như không còn để “thấy” khuyết tật.']
      ],
      quiz: [
        { q: 'Mạch có điện áp 12 V, điện trở 4 Ω. Cường độ dòng điện bằng bao nhiêu ampe?', num: 3, abs: 0.01, unit: 'A', e: 'I = V/R = 12/4 = 3 A.' },
        { q: 'Cuộn dây có R = 3 Ω và XL = 4 Ω. Trở kháng Z bằng bao nhiêu ôm?', num: 5, abs: 0.01, unit: 'Ω', e: 'Z = √(3² + 4²) = 5 Ω (tam giác 3-4-5).' },
        { q: 'Muốn dòng xoáy “nhìn” sâu hơn vào tấm nhôm, cần làm gì?', o: ['Giảm tần số', 'Tăng tần số', 'Tăng độ dẫn điện của tấm', 'Dùng vật liệu có độ từ thẩm cao hơn'], e: 'δ = 1/√(πfμσ): giảm f thì δ tăng.' },
        { q: 'Tại độ sâu bằng một độ sâu thấm chuẩn (1δ), mật độ dòng xoáy còn khoảng bao nhiêu phần trăm so với bề mặt?', num: 37, abs: 1.5, unit: '%', e: 'J/J₀ = e⁻¹ ≈ 0,368 → khoảng 37 %.' },
        { q: '100 % IACS tương ứng độ dẫn điện bao nhiêu?', o: ['5,8·10⁷ S/m', '1,0·10⁷ S/m', '3,5·10⁷ S/m', '1,0·10⁶ S/m'], e: 'Chuẩn IACS dựa trên đồng ủ: 5,8·10⁷ S/m.' }
      ] },

    { id: 'mag', track: 'phys', title: 'Từ học & vòng từ trễ', en: 'Magnetism', src: '/Physics/Magnetism/index.xhtml', sim: 'hysteresis', cards: [],
      lessons: [
        ['Miền từ', 'Trong vật liệu sắt từ (thép cacbon, niken, coban), các nguyên tử có mômen từ xếp thành từng miền. Khi chưa từ hóa, các miền hướng ngẫu nhiên; từ trường ngoài làm chúng xoay theo một hướng.'],
        ['Sắt từ, thuận từ, nghịch từ', 'Chỉ vật liệu sắt từ bị hút mạnh và dùng được MT. Thép không gỉ austenit (304, 316) có cấu trúc FCC, gần như không nhiễm từ: không dùng MT được.'],
        ['Vòng từ trễ', 'Đồ thị B theo H tạo thành vòng. Độ từ dư Br là từ trường còn lại khi cắt dòng; lực kháng từ Hc là từ trường ngược cần để đưa B về 0. Vật liệu “cứng” (Br, Hc lớn) giữ từ tốt, hợp cho phương pháp từ dư. Độ từ thẩm μ = B/H.'],
        ['Từ trường tròn và từ trường dọc', 'Cho dòng điện chạy qua chi tiết (head shot) hoặc qua thanh dẫn trung tâm tạo từ trường tròn: phát hiện vết nứt dọc. Đặt chi tiết trong cuộn dây tạo từ trường dọc: phát hiện vết nứt ngang. Vết nứt gần vuông góc với đường sức tạo từ thông rò mạnh nhất.'],
        ['Khử từ', 'Từ dư có thể ảnh hưởng gia công, hàn hoặc thiết bị đo. Khử từ bằng từ trường đổi chiều liên tục và giảm dần về 0 (hoặc nung trên nhiệt độ Curie).']
      ],
      quiz: [
        { q: 'Vì sao không dùng MT cho mối hàn thép không gỉ 316L?', o: ['316L là austenit, gần như không nhiễm từ', 'Bề mặt quá bóng', 'Bột từ ăn mòn inox', 'Vì mối hàn quá mỏng'], e: 'Không có từ thông rò nếu vật liệu không sắt từ.' },
        { q: 'Phương pháp từ dư (residual) đòi hỏi vật liệu như thế nào?', o: ['Độ từ dư và lực kháng từ cao (vật liệu từ cứng)', 'Độ từ thẩm rất thấp', 'Không nhiễm từ', 'Độ dẫn điện cao'], e: 'Phải giữ được từ trường đủ mạnh sau khi cắt dòng.' },
        { q: 'Cho dòng điện chạy dọc qua một thanh tròn (head shot). Vết nứt hướng nào được phát hiện tốt?', o: ['Vết nứt dọc theo trục thanh', 'Vết nứt vòng quanh chu vi', 'Rỗ khí ở tâm thanh', 'Mọi hướng như nhau'], e: 'Dòng dọc trục sinh từ trường tròn, cắt ngang vết nứt dọc.' },
        { q: 'Cách khử từ phổ biến nhất là gì?', o: ['Từ trường đổi chiều và giảm dần về 0', 'Tăng dòng DC lên cực đại rồi cắt', 'Phun nước lạnh', 'Gõ búa'], e: 'Mỗi chu kỳ đổi chiều với biên độ nhỏ dần kéo vòng từ trễ về gốc.' },
        { q: 'Độ từ thẩm μ được định nghĩa là gì?', o: ['Tỉ số B/H', 'Tích B·H', 'Hiệu Br − Hc', 'Điện trở suất nhân tần số'], e: 'μ = B/H, cho biết vật liệu “dẫn” từ thông dễ đến đâu.' }
      ] },

    { id: 'waves', track: 'phys', title: 'Sóng & bước sóng', en: 'Waves', src: '/Physics/Waves/index.xhtml', sim: 'wavelength', cards: ['wavelength'],
      lessons: [
        ['Các kiểu sóng cơ', 'Sóng dọc: hạt dao động cùng phương truyền, đi được trong rắn, lỏng, khí. Sóng ngang: hạt dao động vuông góc phương truyền, chỉ đi trong chất rắn. Ngoài ra có sóng mặt (Rayleigh) và sóng tấm (Lamb).'],
        ['Bước sóng', 'λ = v/f. Cùng tần số, vật liệu có vận tốc lớn thì bước sóng dài. Quy tắc kinh nghiệm: khuyết tật phải lớn hơn khoảng λ/2 mới có khả năng phát hiện.'],
        ['Độ nhạy, độ phân giải, suy giảm', 'Tần số cao hơn cho độ nhạy và độ phân giải tốt hơn, nhưng sóng bị tán xạ và hấp thụ nhiều hơn (nhất là ở vật liệu hạt thô), nên đi được ít sâu hơn. Chọn tần số là đánh đổi.'],
        ['Khúc xạ và chuyển đổi dạng sóng', 'Sóng tới xiên qua mặt phân cách bị bẻ hướng theo định luật Snell và có thể sinh ra cả sóng dọc lẫn sóng ngang. Đầu dò góc khai thác điều này để chỉ còn sóng ngang trong thép.'],
        ['Tỉ số tín hiệu trên nhiễu', 'Khuyết tật chỉ “thấy” được khi tín hiệu của nó nổi rõ trên nền nhiễu (nhiễu hạt, nhiễu điện). Tăng gain làm to cả hai, không cải thiện tỉ số.']
      ],
      quiz: [
        { q: 'Sóng dọc trong thép (v = 5920 m/s), đầu dò 5 MHz. Bước sóng bằng bao nhiêu milimét?', num: 1.184, rel: 0.03, unit: 'mm', e: 'λ = 5920 / 5·10⁶ = 1,18·10⁻³ m ≈ 1,18 mm.' },
        { q: 'Theo quy tắc kinh nghiệm, với λ = 1,2 mm, khuyết tật nhỏ nhất có khả năng phát hiện vào khoảng bao nhiêu?', o: ['Khoảng 0,6 mm', 'Khoảng 2,4 mm', 'Khoảng 0,06 mm', 'Bất kỳ kích thước nào'], e: 'Khoảng λ/2.' },
        { q: 'Sóng ngang không truyền được trong môi trường nào?', o: ['Chất lỏng và chất khí', 'Thép', 'Nhôm', 'Perspex'], e: 'Chất lưu không chịu được ứng suất cắt.' },
        { q: 'Tăng tần số đầu dò từ 2 MHz lên 10 MHz khi kiểm tra vật đúc hạt thô. Điều gì dễ xảy ra?', o: ['Nhiễu hạt tăng, sóng suy giảm mạnh, khó xuyên sâu', 'Sóng xuyên sâu hơn', 'Không thay đổi gì', 'Sóng ngang biến thành sóng dọc'], e: 'Tần số cao tán xạ mạnh ở biên hạt.' },
        { q: 'Tăng gain thêm 12 dB thì tỉ số tín hiệu/nhiễu hạt thay đổi thế nào?', o: ['Gần như không đổi: cả tín hiệu lẫn nhiễu đều to lên', 'Tăng 4 lần', 'Giảm một nửa', 'Tăng 12 lần'], e: 'Gain khuếch đại tất cả những gì máy nhận được.' }
      ] },

    { id: 'sound', track: 'phys', title: 'Âm học & trở kháng âm', en: 'Sound', src: '/Physics/Sound/index.xhtml', sim: 'acimp', cards: ['acimp'],
      lessons: [
        ['Âm cần môi trường', 'Âm là dao động cơ học lan truyền qua các hạt vật chất. Không có môi trường (chân không) thì không có âm. Siêu âm là âm có tần số trên 20 kHz; UT công nghiệp thường dùng 0,5–15 MHz.'],
        ['Vận tốc phụ thuộc vật liệu', 'Vận tốc âm phụ thuộc độ cứng đàn hồi và khối lượng riêng; nó cũng thay đổi theo nhiệt độ. Trong cùng vật liệu, sóng dọc nhanh hơn sóng ngang (thép: khoảng 5920 và 3240 m/s).'],
        ['Trở kháng âm', 'Z = ρ·v (đơn vị Rayl). Hai vật liệu có Z càng chênh lệch thì phản xạ ở mặt phân cách càng mạnh. Hệ số phản xạ năng lượng R = ((Z₂ − Z₁)/(Z₂ + Z₁))², truyền qua T = 1 − R.'],
        ['Vì sao cần chất tiếp âm', 'Không khí có Z rất nhỏ so với thép, nên gần như toàn bộ năng lượng bị phản xạ ở lớp khí mỏng giữa đầu dò và bề mặt. Chất tiếp âm (gel, dầu, nước) thay lớp khí đó để âm vào được vật.']
      ],
      quiz: [
        { q: 'Thép có ρ = 7850 kg/m³, vL = 5920 m/s. Trở kháng âm (MRayl, tức 10⁶ kg/m²s) bằng bao nhiêu?', num: 46.47, rel: 0.02, unit: 'MRayl', e: 'Z = 7850 × 5920 ≈ 46,5·10⁶ Rayl.' },
        { q: 'Nước (Z ≈ 1,48 MRayl) tiếp xúc thép (Z ≈ 46,5 MRayl). Bao nhiêu phần trăm năng lượng bị phản xạ?', num: 88, abs: 1.5, unit: '%', e: 'R = ((46,5 − 1,48)/(46,5 + 1,48))² ≈ 0,88.' },
        { q: 'Vì sao phải bôi chất tiếp âm?', o: ['Để thay lớp không khí, vốn phản xạ gần như toàn bộ năng lượng', 'Để làm mát đầu dò', 'Để tăng tần số', 'Để chống gỉ'], e: 'Chênh lệch trở kháng thép/khí rất lớn.' },
        { q: 'Trong thép, loại sóng nào nhanh hơn?', o: ['Sóng dọc', 'Sóng ngang', 'Bằng nhau', 'Tùy tần số'], e: 'vL ≈ 5920, vS ≈ 3240 m/s.' },
        { q: 'Siêu âm là âm có tần số như thế nào?', o: ['Trên khoảng 20 kHz, ngoài ngưỡng nghe của người', 'Dưới 20 Hz', 'Đúng 1 MHz', 'Truyền được trong chân không'], e: 'UT công nghiệp thường ở dải MHz.' }
      ] },

    { id: 'xray', track: 'phys', title: 'Tia X, tia gamma & suy giảm', en: 'X-Rays', src: '/Physics/X-Ray/index.xhtml', sim: 'atten', cards: ['hvlmu', 'decay', 'inverse'],
      lessons: [
        ['Hai nguồn bức xạ xuyên thấu', 'Tia X sinh ra khi electron tốc độ cao bị hãm trong bia của ống phát; tắt máy là hết bức xạ. Tia gamma phát ra từ hạt nhân đồng vị phân rã; nguồn luôn phát, chỉ che chắn được, không “tắt” được.'],
        ['kV, mA và hoạt độ', 'Với máy X: kV quyết định năng lượng (khả năng xuyên thấu và độ tương phản); mA nhân thời gian quyết định lượng bức xạ. Với nguồn gamma: năng lượng do đồng vị quyết định; lượng bức xạ do hoạt độ (Bq, Ci; 1 Ci = 37 GBq) và thời gian. Hoạt độ giảm theo chu kỳ bán rã.'],
        ['Suy giảm khi đi qua vật', 'I = I₀·e^(−μx), với μ là hệ số suy giảm tuyến tính. Lớp giảm một nửa HVL = ln2/μ ≈ 0,693/μ. Khuyết tật (rỗ, xỉ) ít đặc hơn kim loại nên để lọt nhiều bức xạ hơn và hiện đen hơn trên phim.'],
        ['Tán xạ và độ nhòe', 'Ở dải năng lượng công nghiệp, tán xạ Compton chiếm ưu thế; bức xạ tán xạ làm mờ ảnh, nên dùng màn chì và che chắn. Độ nhòe hình học Ug = F·d/D (F: kích thước nguồn, d: vật-phim, D: nguồn-vật).'],
        ['An toàn bức xạ', 'Ba nguyên tắc: thời gian ngắn, khoảng cách xa (nghịch đảo bình phương), che chắn dày. Luôn đeo liều kế và dùng máy đo suất liều.']
      ],
      quiz: [
        { q: 'Khác biệt thực tế quan trọng nhất giữa máy phát tia X và nguồn Ir-192 về an toàn là gì?', o: ['Máy X tắt là hết bức xạ; nguồn gamma phát liên tục', 'Nguồn gamma không gây ion hóa', 'Máy X không cần rào', 'Tia X không suy giảm qua chì'], e: 'Nguồn gamma phải được thu về container che chắn.' },
        { q: 'Vật liệu có μ = 0,0693 /mm. Lớp giảm một nửa HVL bằng bao nhiêu milimét?', num: 10, rel: 0.02, unit: 'mm', e: 'HVL = 0,693/0,0693 = 10 mm.' },
        { q: '1 Ci bằng bao nhiêu GBq?', num: 37, abs: 0, unit: 'GBq', e: '1 Ci = 3,7·10¹⁰ Bq = 37 GBq.' },
        { q: 'Nguồn 3 mm, vật-phim 12 mm, nguồn-vật 600 mm. Độ nhòe hình học Ug bằng bao nhiêu milimét?', num: 0.06, rel: 0.03, unit: 'mm', e: 'Ug = 3 × 12 / 600 = 0,06 mm.' },
        { q: 'Với máy phát tia X, thông số nào chủ yếu quyết định khả năng xuyên thấu?', o: ['Điện áp kV', 'Dòng mA', 'Thời gian chiếu', 'Kích thước phim'], e: 'kV quyết định năng lượng photon; mA·s quyết định lượng.' }
      ] },

    { id: 'mat', track: 'phys', title: 'Vật liệu & cơ chế hư hỏng', en: 'Materials and Processes', src: '/Physics/Materials/index.xhtml', sim: 'stress', cards: ['hooke'],
      lessons: [
        ['Bốn nhóm vật liệu', 'Kim loại (dẻo, dẫn điện), gốm (cứng, giòn, chịu nhiệt), polyme (nhẹ, cách điện), composite (cốt sợi trong nền nhựa hoặc kim loại). Mỗi nhóm hợp với những phương pháp NDT khác nhau.'],
        ['Cấu trúc tinh thể', 'Thép ferit có mạng BCC và nhiễm từ; thép austenit có mạng FCC và gần như không nhiễm từ. Vật liệu dị hướng (composite, mối hàn austenit hạt cột) làm chùm siêu âm bị lệch và suy giảm.'],
        ['Đàn hồi và dẻo', 'Dưới giới hạn chảy, biến dạng đàn hồi: σ = E·ε (thép E ≈ 200 GPa), bỏ tải thì trở về. Vượt giới hạn chảy là biến dạng dẻo, không hồi phục. Phát xạ âm sinh ra chủ yếu ở vùng biến dạng dẻo cục bộ.'],
        ['Mỏi, ăn mòn, rão', 'Vết nứt mỏi thường khởi phát ở bề mặt, tại chỗ tập trung ứng suất (chân mối hàn, rãnh, lỗ) dưới tải lặp, rồi phát triển dần. Ăn mòn làm mỏng thành; rão xảy ra ở nhiệt độ cao. NDT giúp bắt hư hỏng trước khi đạt kích thước tới hạn.']
      ],
      quiz: [
        { q: 'Thép E = 200 GPa, biến dạng đàn hồi ε = 0,001. Ứng suất bằng bao nhiêu MPa?', num: 200, rel: 0.01, unit: 'MPa', e: 'σ = 200 000 MPa × 0,001 = 200 MPa.' },
        { q: 'Vết nứt mỏi thường khởi phát ở đâu?', o: ['Ở bề mặt, tại chỗ tập trung ứng suất', 'Ở chính giữa chiều dày, nơi ứng suất nhỏ nhất', 'Ngẫu nhiên, không có quy luật', 'Chỉ trong vật liệu gốm'], e: 'Vì vậy PT, MT, ET rất quan trọng trong kiểm tra định kỳ.' },
        { q: 'Vì sao mối hàn austenit khó kiểm tra bằng UT?', o: ['Hạt thô, dị hướng làm chùm âm lệch hướng và suy giảm', 'Không dẫn âm', 'Quá mỏng', 'Bề mặt quá sáng'], e: 'Cần đầu dò sóng dọc góc, tần số thấp và mẫu chuẩn cùng vật liệu.' },
        { q: 'Composite gồm những thành phần nào?', o: ['Pha cốt (sợi, hạt) và pha nền liên kết', 'Chỉ một loại polyme', 'Kim loại nguyên chất', 'Gốm xốp'], e: 'Ví dụ CFRP: sợi cacbon trong nền epoxy.' },
        { q: 'Biến dạng dẻo khác biến dạng đàn hồi ở điểm nào?', o: ['Không hồi phục khi bỏ tải', 'Tỉ lệ thuận với ứng suất theo E', 'Chỉ xảy ra ở chất lỏng', 'Không phát ra năng lượng'], e: 'Vượt giới hạn chảy thì để lại biến dạng vĩnh viễn.' }
      ] },

    { id: 'cap', track: 'phys', title: 'Mao dẫn & chất thấm', en: 'Capillary Action', src: '/Physics/CapillaryAction/index.xhtml', sim: 'lab:capillary', cards: ['capillary', 'washburn'],
      lessons: [
        ['Năng lượng bề mặt', 'Phân tử ở bề mặt chất lỏng chịu lực kéo vào trong, tạo sức căng bề mặt γ. Chất lỏng làm ướt bề mặt rắn khi góc tiếp xúc θ < 90°.'],
        ['Mao dẫn', 'Trong khe hẹp, chất lỏng làm ướt tự dâng lên: h = 2γcosθ/(ρgw). Khe càng hẹp, lực mao dẫn càng mạnh: đó là cách chất thấm đi vào vết nứt rất nhỏ.'],
        ['Độ nhớt', 'Độ nhớt gần như không ảnh hưởng khả năng thấm, chỉ quyết định tốc độ: chất thấm nhớt hơn cần thời gian ngấm dài hơn.'],
        ['Tỉ trọng', 'Chất thấm thường có tỉ trọng nhỏ hơn 1, nên nước lẫn vào bồn sẽ chìm xuống đáy thay vì trộn lẫn làm hỏng chất thấm.']
      ],
      quiz: [
        { q: 'Chất lỏng thấm được vào khe khi góc tiếp xúc như thế nào?', o: ['θ < 90°', 'θ > 90°', 'θ = 180°', 'Không phụ thuộc θ'], e: 'cosθ > 0 thì h > 0.' },
        { q: 'Khe nứt hẹp đi một nửa (các thông số khác giữ nguyên). Chiều cao mao dẫn thay đổi thế nào?', o: ['Tăng gấp đôi', 'Giảm một nửa', 'Không đổi', 'Tăng bốn lần'], e: 'h tỉ lệ nghịch với w.' },
        { q: 'Vì sao chất thấm thường có tỉ trọng nhỏ hơn 1?', o: ['Nước nhiễm vào sẽ chìm xuống đáy, không trộn lẫn', 'Để bay hơi nhanh', 'Để phát quang mạnh hơn', 'Để rẻ hơn'], e: 'Giữ chất thấm trong bồn không bị nhiễm bẩn.' },
        { q: 'Độ nhớt cao ảnh hưởng gì?', o: ['Cần thời gian ngấm dài hơn', 'Không thấm được vào vết nứt', 'Tăng chiều cao mao dẫn', 'Làm vết nứt rộng ra'], e: 'Washburn: t tỉ lệ thuận với η.' },
        { q: 'Đại lượng nào là động lực chính kéo chất thấm vào vết nứt?', o: ['Sức căng bề mặt kết hợp với khả năng làm ướt', 'Trọng lực', 'Áp suất phun của bình xịt', 'Từ trường'], e: 'Đó là mao dẫn; áp lực phun không đáng kể.' }
      ] },

    /* ================= PHƯƠNG PHÁP KIỂM TRA ================= */
    { id: 'vt', track: 'tech', title: 'VT – Kiểm tra bằng mắt', en: 'Visual Testing', src: '/NDETechniques/PenetrantTest/Introduction/visualacuity.xhtml', sim: 'vt', cards: [],
      lessons: [
        ['Phương pháp đầu tiên', 'Mọi kiểm tra đều bắt đầu bằng mắt: hình dạng mối hàn, cháy cạnh, nứt bề mặt, bắn tóe, lệch mép, ăn mòn. VT rẻ, nhanh, nhưng chỉ thấy những gì lộ ra bề mặt và phụ thuộc thị lực, ánh sáng, góc nhìn.'],
        ['Điều kiện quan sát trực tiếp', 'Theo ASME V Điều 9 (T-952): mắt cách bề mặt không quá 600 mm, góc nhìn không nhỏ hơn 30° so với bề mặt, độ rọi tối thiểu 1000 lx. Không đạt thì dùng gương, kính lúp, ống soi.'],
        ['Kiểm tra từ xa', 'Ống soi mềm (borescope, videoscope), camera, drone dùng khi không tiếp cận được. Hệ thống phải chứng minh độ phân giải ít nhất tương đương quan sát trực tiếp.'],
        ['Thị lực người kiểm tra', 'Người làm NDT phải kiểm tra thị lực gần và khả năng phân biệt màu định kỳ theo written practice. Mắt cần thời gian thích nghi bóng tối trước khi soi huỳnh quang.']
      ],
      quiz: [
        { q: 'Theo ASME V T-952, quan sát trực tiếp cần điều kiện nào?', o: ['Mắt ≤ 600 mm, góc ≥ 30°, độ rọi ≥ 1000 lx', 'Mắt ≤ 2 m, góc bất kỳ, 500 lx', 'Chỉ cần đèn pin', 'Mắt ≤ 300 mm, góc 90°, 200 lx'], e: 'Ngoài các điều kiện này phải dùng dụng cụ hỗ trợ.' },
        { q: 'Vì sao VT luôn làm trước PT, MT, UT, RT?', o: ['Phát hiện lỗi hình học, bề mặt rẻ nhất và chuẩn bị cho phương pháp sau', 'Vì quy định chỉ cho phép thế', 'Vì VT chính xác nhất', 'Vì VT thấy được khuyết tật bên trong'], e: 'Mối hàn bị cháy cạnh lớn thì không cần UT mới biết là phải sửa.' },
        { q: 'Kiểm tra bằng ống soi từ xa phải chứng minh điều gì?', o: ['Độ phân giải ít nhất tương đương quan sát trực tiếp', 'Có màn hình màu', 'Có ghi hình', 'Không cần gì'], e: 'Thường chứng minh bằng một vạch chuẩn trên bề mặt.' },
        { q: 'Trước khi soi PT huỳnh quang trong phòng tối, người kiểm tra cần làm gì?', o: ['Cho mắt thích nghi bóng tối vài phút', 'Đeo kính râm', 'Bật đèn trắng mạnh', 'Không cần gì'], e: 'Mắt chưa thích nghi sẽ bỏ sót chỉ thị mờ.' }
      ] },

    { id: 'ut', track: 'tech', title: 'UT – Siêu âm', en: 'Ultrasonic Testing', src: '/NDETechniques/Ultrasonics/index.xhtml', sim: 'lab:snell', cards: ['snell', 'anglebeam', 'decibel', 'nearfield'],
      lessons: [
        ['Xung – phản hồi', 'Đầu dò áp điện phát xung siêu âm vào vật; khuyết tật và mặt đáy phản xạ tiếng vọng về. Thời gian bay cho biết khoảng cách, biên độ cho biết mức độ phản xạ. Ngoài ra còn kỹ thuật truyền qua (hai đầu dò hai phía).'],
        ['Đầu dò và chùm âm', 'Trường gần N = D²f/(4v): trong vùng này biên độ dao động thất thường, khó đánh giá. Ngoài trường gần, chùm tản ra; tần số cao và đầu dò lớn thì chùm hẹp hơn.'],
        ['Cách hiển thị', 'A-scan: biên độ theo thời gian tại một điểm. B-scan: mặt cắt. C-scan: hình chiếu bằng từ trên xuống. Kiểm tra ngâm nước và quét tự động cho C-scan đẹp, lặp lại tốt.'],
        ['Hiệu chuẩn', 'Mẫu IIW V1/V2 cho thang đo, điểm ra chùm tia và góc; mẫu chuẩn cơ sở có lỗ khoan cạnh để dựng đường DAC (biên độ theo khoảng cách). TOFD dùng sóng nhiễu xạ ở đầu vết nứt để đo chiều cao. EMAT tạo sóng bằng điện từ, không cần chất tiếp âm.']
      ],
      quiz: [
        { q: 'Đầu dò thẳng đường kính 10 mm, 5 MHz trên thép (vL = 5920 m/s). Trường gần N bằng bao nhiêu milimét?', num: 21.1, rel: 0.03, unit: 'mm', e: 'N = 10² × 5 / (4 × 5,92) ≈ 21,1 mm (D tính mm, f tính MHz, v tính mm/µs).' },
        { q: 'Kiểu hiển thị nào cho hình chiếu bằng của khuyết tật trên toàn vùng quét?', o: ['C-scan', 'A-scan', 'B-scan', 'Màn hình dao động thường'], e: 'C-scan nhìn từ trên xuống.' },
        { q: 'Kỹ thuật nào dùng sóng nhiễu xạ ở hai đầu vết nứt để đo chiều cao?', o: ['TOFD', 'Truyền qua', 'Xung – phản hồi đầu dò thẳng', 'EMAT'], e: 'Đo hiệu thời gian bay của tín hiệu đầu trên và đầu dưới vết nứt.' },
        { q: 'Ưu điểm nổi bật của đầu dò EMAT là gì?', o: ['Không cần chất tiếp âm', 'Rẻ nhất', 'Biên độ tín hiệu lớn nhất', 'Không cần điện'], e: 'Sóng được sinh trực tiếp trong vật dẫn bằng lực điện từ.' },
        { q: 'Đường DAC dùng để làm gì?', o: ['Bù biên độ theo khoảng cách, để so các phản xạ ở độ sâu khác nhau', 'Đo vận tốc âm', 'Xác định góc đầu dò', 'Đo nhiệt độ'], e: 'Cùng một phản xạ, ở xa thì tín hiệu nhỏ hơn.' }
      ] },

    { id: 'mt', track: 'tech', title: 'MT – Hạt từ', en: 'Magnetic Particle Testing', src: '/NDETechniques/MagParticle/index.xhtml', sim: 'lab:magnet', cards: ['leakage'],
      lessons: [
        ['Nguyên lý', 'Từ hóa chi tiết sắt từ; tại vết nứt bề mặt hoặc gần bề mặt, từ thông rò ra ngoài và giữ hạt từ lại thành chỉ thị nhìn thấy được.'],
        ['Thiết bị và dòng từ hóa', 'Ách từ, que dẫn dòng (prod), máy cố định có cuộn dây và đầu kẹp. Dòng AC tập trung ở bề mặt (hiệu ứng bề mặt): tốt cho nứt bề mặt. DC hoặc DC chỉnh lưu nửa sóng thấm sâu hơn: tốt hơn cho khuyết tật gần bề mặt.'],
        ['Hạt khô, hạt ướt, huỳnh quang', 'Hạt khô dùng tốt trên bề mặt thô, nóng. Hạt ướt huỳnh quang soi dưới UV-A trong phòng tối nhạy nhất với vết nứt mảnh. Phải kiểm tra nồng độ hạt và độ nhiễm bẩn của dung dịch.'],
        ['Liên tục và từ dư', 'Phương pháp liên tục: phun hạt khi đang có dòng, nhạy hơn. Phương pháp từ dư: phun sau khi cắt dòng, chỉ dùng cho vật liệu giữ từ tốt. Chỉ thị trường (pie gauge, shim) xác nhận hướng và độ đủ của từ trường.']
      ],
      quiz: [
        { q: 'Để phát hiện khuyết tật nằm hơi dưới bề mặt, nên chọn dòng nào?', o: ['DC hoặc DC chỉnh lưu nửa sóng', 'AC tần số cao', 'Không dòng, chỉ nam châm vĩnh cửu', 'Dòng nào cũng như nhau'], e: 'AC bị hiệu ứng bề mặt giới hạn ở lớp mỏng.' },
        { q: 'Kỹ thuật MT nào nhạy nhất với vết nứt mỏi rất mảnh?', o: ['Hạt ướt huỳnh quang, soi UV-A', 'Hạt khô màu xám', 'Kiểm tra bằng mắt', 'Hạt khô đỏ trên bề mặt thô'], e: 'Hạt nhỏ, linh động trong chất lỏng, tương phản cao dưới UV.' },
        { q: 'Chỉ thị trường từ hình bánh (pie gauge) cho biết điều gì?', o: ['Hướng và độ đủ của từ trường tại bề mặt', 'Chiều sâu vết nứt', 'Nhiệt độ chi tiết', 'Độ dẫn điện'], e: 'Không đo được cường độ chính xác, chỉ là chỉ thị định tính.' },
        { q: 'Phương pháp liên tục khác phương pháp từ dư ở điểm nào?', o: ['Phun hạt trong khi đang từ hóa', 'Phun hạt sau khi đã khử từ', 'Không dùng dòng điện', 'Chỉ dùng cho thép không gỉ'], e: 'Từ trường lúc đang có dòng mạnh hơn từ dư.' }
      ] },

    { id: 'et', track: 'tech', title: 'ET – Dòng điện xoáy', en: 'Eddy Current Testing', src: '/NDETechniques/EddyCurrent/index.xhtml', sim: 'etplane', cards: ['skindepth', 'impedance'],
      lessons: [
        ['Nguyên lý', 'Cuộn dây mang dòng xoay chiều cảm ứng dòng xoáy khép kín trong vật dẫn. Vết nứt, thay đổi độ dẫn điện, độ từ thẩm hoặc chiều dày làm dòng xoáy bị cản trở, khiến trở kháng của cuộn dây thay đổi.'],
        ['Mặt phẳng trở kháng', 'Màn hình vẽ điểm (R, XL) của cuộn dây. Mỗi nguyên nhân dịch điểm theo một hướng đặc trưng: nhấc đầu dò (lift-off), vết nứt, độ dẫn điện. Người kiểm tra xoay pha để tín hiệu lift-off nằm ngang, khi đó tín hiệu vết nứt tách ra theo hướng khác.'],
        ['Độ trễ pha', 'Dòng xoáy ở độ sâu x trễ pha β = x/δ (radian) so với bề mặt. Nhờ vậy, góc của tín hiệu cho biết khuyết tật nằm nông hay sâu.'],
        ['Ứng dụng', 'Nứt bề mặt quanh lỗ đinh tán máy bay; đo độ dẫn điện để kiểm tra nhiệt luyện nhôm; đo chiều dày lớp phủ không dẫn điện trên nền dẫn điện; kiểm tra ống trao đổi nhiệt bằng đầu dò bobbin. Ống sắt từ dùng kỹ thuật trường xa (RFT); ăn mòn dưới bảo ôn dùng dòng xoáy xung (PEC).']
      ],
      quiz: [
        { q: 'Khuyết tật nằm ở độ sâu đúng bằng một độ sâu thấm chuẩn δ. Độ trễ pha là bao nhiêu độ?', num: 57.3, abs: 1, unit: '°', e: 'β = x/δ = 1 rad ≈ 57,3°.' },
        { q: 'Vì sao người kiểm tra xoay pha cho tín hiệu lift-off nằm ngang?', o: ['Để tín hiệu vết nứt tách ra theo phương khác, dễ nhận biết', 'Để tăng độ sâu thấm', 'Để khử từ', 'Để tăng tần số'], e: 'Tách các biến số theo hướng trên mặt phẳng trở kháng.' },
        { q: 'Kiểm tra độ cứng sau nhiệt luyện của tấm nhôm hàng không có thể dùng ET đo đại lượng nào?', o: ['Độ dẫn điện (% IACS)', 'Độ từ dư', 'Vận tốc âm', 'Độ đen phim'], e: 'Trạng thái nhiệt luyện của hợp kim nhôm làm thay đổi độ dẫn điện.' },
        { q: 'Ống trao đổi nhiệt bằng thép cacbon (sắt từ) nên dùng kỹ thuật nào?', o: ['Trường xa (RFT)', 'Đầu dò bobbin thông thường', 'PT', 'Đo độ dẫn điện'], e: 'Độ từ thẩm cao làm ET thường thấm rất nông.' },
        { q: 'Đo chiều dày lớp sơn trên nền nhôm bằng ET dựa vào hiệu ứng nào?', o: ['Lift-off: khoảng cách cuộn dây tới nền dẫn điện', 'Độ trễ pha trong lớp sơn', 'Từ thông rò', 'Phản xạ âm'], e: 'Lớp sơn không dẫn điện đóng vai “khoảng hở”.' }
      ] },

    { id: 'mw', track: 'tech', title: 'Vi ba & sóng milimét', en: 'Microwave and Millimeter Wave Testing', src: '/NDETechniques/Microwaves/index.xhtml', sim: 'microwave', cards: ['mwgamma'],
      lessons: [
        ['Dải tần', 'Vi ba khoảng 300 MHz – 30 GHz (bước sóng 1 m – 10 mm); sóng milimét 30 – 300 GHz (10 – 1 mm).'],
        ['Đi xuyên vật liệu điện môi', 'Sóng vi ba xuyên qua vật liệu không dẫn điện (composite sợi thủy tinh, gốm, nhựa, bê tông, lớp sơn) nhưng phản xạ gần như toàn phần ở bề mặt kim loại. Không dùng để nhìn vào bên trong kim loại.'],
        ['Đo cái gì', 'Thiết bị đo hệ số phản xạ hoặc truyền qua; từ đó suy ra hằng số điện môi phức, rồi suy ra độ ẩm, độ rỗ, mức đóng rắn, chiều dày lớp phủ, tách lớp.'],
        ['Ứng dụng', 'Độ ẩm trong composite, mái che radar (radome), lớp phủ nhiệt; nứt bề mặt kim loại dưới lớp sơn bằng đầu dò ống dẫn sóng hở; chụp ảnh vi ba; nhiệt ảnh vi ba chủ động.']
      ],
      quiz: [
        { q: 'Bước sóng của vi ba 10 GHz trong không khí (c = 3·10⁸ m/s) bằng bao nhiêu milimét?', num: 30, rel: 0.02, unit: 'mm', e: 'λ = c/f = 3·10⁸ / 10¹⁰ = 0,03 m.' },
        { q: 'Vì sao vi ba không dùng để tìm rỗ khí bên trong mối hàn thép?', o: ['Kim loại phản xạ gần như toàn bộ sóng vi ba', 'Vi ba quá đắt', 'Rỗ khí không chứa không khí', 'Thép trong suốt với vi ba'], e: 'Vi ba hợp với vật liệu điện môi.' },
        { q: 'Composite bị ngấm nước, hằng số điện môi thay đổi thế nào?', o: ['Tăng mạnh, vì nước có hằng số điện môi rất lớn (≈ 80)', 'Giảm về 1', 'Không đổi', 'Trở thành âm'], e: 'Vì thế vi ba rất nhạy với độ ẩm.' },
        { q: 'Dải sóng milimét nằm trong khoảng nào?', o: ['30 – 300 GHz', '300 MHz – 3 GHz', '3 – 30 MHz', 'Trên 1 THz'], e: 'Bước sóng 10 mm tới 1 mm.' }
      ] },

    { id: 'rt', track: 'tech', title: 'RT – Chụp bức xạ', en: 'Radiography Testing', src: '/NDETechniques/Radiography/index.xhtml', sim: 'lab:radiation', cards: ['decay', 'inverse', 'exposure'],
      lessons: [
        ['Ảnh bóng', 'Bức xạ đi qua vật lên phim hoặc tấm ghi. Nơi vật mỏng hơn hoặc có khuyết tật ít đặc (rỗ, xỉ, không ngấu) để lọt nhiều bức xạ hơn, nên ảnh đen hơn. Vết nứt chỉ thấy rõ khi mặt phẳng của nó gần song song với chùm tia.'],
        ['Chất lượng ảnh', 'Độ đen D = log₁₀(I₀/It); D = 2 nghĩa là chỉ 1 % ánh sáng đèn đọc phim lọt qua. Độ tương phản đến từ vật thể và từ phim; độ nét phụ thuộc độ nhòe hình học, tán xạ, cỡ hạt phim. IQI chứng minh độ nhạy của ảnh, không dùng để đo khuyết tật.'],
        ['Phim, CR, DR, CT', 'Bên cạnh phim, có chụp số dùng tấm phosphor nhớ (CR) và tấm phẳng số (DR) cho ảnh nhanh, xử lý được. Chụp cắt lớp (CT) dựng lại mặt cắt từ nhiều góc chiếu. Chụp thời gian thực (RTR) cho xem ảnh ngay trên màn hình.'],
        ['Tính toán phơi sáng', 'Lượng phơi sáng tỉ lệ với hoạt độ (hoặc mA) nhân thời gian, chia bình phương khoảng cách nguồn – phim. Dùng biểu đồ phơi sáng của vật liệu và loại phim.']
      ],
      quiz: [
        { q: 'Phim có độ đen D = 2. Bao nhiêu phần trăm ánh sáng đèn đọc phim lọt qua?', num: 1, rel: 0.02, unit: '%', e: 'It/I₀ = 10⁻² = 1 %.' },
        { q: 'IQI (chỉ thị chất lượng ảnh) dùng để làm gì?', o: ['Chứng minh độ nhạy và chất lượng của ảnh chụp', 'Đo chiều dài khuyết tật', 'Đo liều bức xạ', 'Đánh dấu vị trí mối hàn'], e: 'Thấy được lỗ hoặc dây yêu cầu thì ảnh đạt độ nhạy.' },
        { q: 'Vì sao RT có thể bỏ sót vết nứt?', o: ['Vết nứt mảnh nằm nghiêng so với chùm tia gần như không làm thay đổi chiều dày xuyên qua', 'Vết nứt chứa kim loại nặng', 'Phim không nhạy với thép', 'Vì RT chỉ thấy bề mặt'], e: 'Hướng của vết nứt so với chùm tia rất quan trọng.' },
        { q: 'Tăng khoảng cách nguồn – phim từ 0,5 m lên 1 m, giữ nguyên hoạt độ. Thời gian chiếu phải tăng mấy lần?', num: 4, abs: 0, unit: 'lần', e: '(1/0,5)² = 4.' }
      ] },

    { id: 'pt', track: 'tech', title: 'PT – Thẩm thấu', en: 'Penetrant Testing', src: '/NDETechniques/PenetrantTest/index.xhtml', sim: 'ptorder', cards: [],
      lessons: [
        ['Quy trình', 'Làm sạch trước và làm khô → phủ chất thấm, ngấm → loại bỏ chất thấm thừa → phủ chất hiện hình → chờ hiện hình → quan sát, đánh giá → làm sạch sau. Chất hiện hình hoạt động như giấy thấm, hút chất thấm ra khỏi vết nứt thành chỉ thị.'],
        ['Màu hay huỳnh quang', 'Chất thấm màu (đỏ) quan sát dưới ánh sáng trắng. Chất thấm huỳnh quang soi bằng UV-A trong phòng tối, nhạy hơn. Có bốn cách loại bỏ: rửa nước, nhũ hóa ưa dầu, tẩy dung môi, nhũ hóa ưa nước.'],
        ['Kim loại bị miết (smear)', 'Mài, phun bi, gia công có thể miết kim loại lấp miệng vết nứt, nhất là kim loại mềm như nhôm. Khi đó phải tẩy axit (etch) trước khi PT.'],
        ['Giới hạn và an toàn', 'Chỉ phát hiện bất liên tục hở ra bề mặt, trên vật liệu không xốp. Hóa chất dễ cháy, gây kích ứng: thông gió, găng tay, kính, tránh nguồn lửa.']
      ],
      quiz: [
        { q: 'Chất hiện hình hoạt động như thế nào?', o: ['Như giấy thấm, hút chất thấm ra khỏi bất liên tục và tạo nền tương phản', 'Phản ứng hóa học làm vết nứt đổi màu', 'Làm vết nứt rộng ra', 'Hút ẩm khỏi bề mặt'], e: 'Đó là lý do lớp hiện hình phải mỏng và đều.' },
        { q: 'Chi tiết nhôm vừa phun bi xong. Cần làm gì trước khi PT?', o: ['Tẩy axit để loại lớp kim loại bị miết', 'PT ngay', 'Phun bi thêm lần nữa', 'Sơn lót'], e: 'Lớp miết che miệng vết nứt.' },
        { q: 'PT không dùng được cho vật liệu nào?', o: ['Vật liệu xốp như gốm chưa tráng men, gang xốp', 'Thép không gỉ', 'Nhôm', 'Titan'], e: 'Chất thấm ngấm khắp nơi, nền đỏ hoàn toàn.' },
        { q: 'Kỹ thuật nào thường nhạy hơn: chất thấm màu hay huỳnh quang?', o: ['Huỳnh quang', 'Chất thấm màu', 'Như nhau', 'Tùy màu sơn'], e: 'Chấm sáng trên nền tối dễ thấy hơn chấm đỏ trên nền trắng.' }
      ] },

    { id: 'ae', track: 'tech', title: 'AE – Phát xạ âm', en: 'Acoustic Emission Testing', src: '/NDETechniques/AcousticEmission/index.xhtml', sim: 'aeloc', cards: ['aeloc'],
      lessons: [
        ['Phương pháp “lắng nghe”', 'Khi vật chịu tải, vết nứt phát triển hoặc vùng biến dạng dẻo cục bộ giải phóng năng lượng thành sóng đàn hồi. Cảm biến áp điện gắn trên bề mặt nghe những “tiếng răng rắc” đó. AE là phương pháp thụ động: phải có tải (thử áp, thử tải) mới có tín hiệu.'],
        ['Hiệu ứng Kaiser và Felicity', 'Kaiser: vật lành không phát AE cho tới khi tải vượt mức tải lớn nhất trước đó. Felicity: vật đã hư hỏng phát AE ngay ở tải thấp hơn mức cũ; tỉ số Felicity (tải bắt đầu phát / tải cực đại trước) nhỏ hơn 1 là dấu hiệu hư hỏng đáng kể.'],
        ['Đặc trưng tín hiệu', 'Mỗi “hit” có biên độ (dB), số đếm, thời gian kéo dài, thời gian tăng, năng lượng. Phân tích các đặc trưng này giúp phân biệt nguồn thật với tiếng ồn cơ khí.'],
        ['Định vị nguồn', 'Dùng nhiều cảm biến và hiệu thời gian đến. Định vị tuyến tính với hai cảm biến cách nhau D: x = (D + v·Δt)/2, với Δt = t₁ − t₂, x tính từ cảm biến 1. AE cho biết vùng đang “hoạt động”; kích thước khuyết tật phải đo lại bằng phương pháp khác.']
      ],
      quiz: [
        { q: 'Hai cảm biến cách nhau 2 m, vận tốc sóng 3000 m/s. Cảm biến 1 nhận sớm hơn cảm biến 2 là 0,4 ms (Δt = −0,4 ms). Nguồn cách cảm biến 1 bao nhiêu mét?', num: 0.4, abs: 0.02, unit: 'm', e: 'x = (2 + 3000 × (−0,0004))/2 = (2 − 1,2)/2 = 0,4 m.' },
        { q: 'Hiệu ứng Kaiser nói gì?', o: ['Vật lành không phát AE cho tới khi tải vượt mức cực đại trước đó', 'AE tăng tuyến tính theo tải', 'Vật đã nứt không phát AE', 'AE chỉ xuất hiện khi dỡ tải'], e: 'Vì vậy thử AE thường gia tải vượt mức vận hành.' },
        { q: 'Tỉ số Felicity bằng 0,7 cho biết điều gì?', o: ['Có hư hỏng đáng kể: AE xuất hiện ở tải thấp hơn mức cũ', 'Vật hoàn toàn lành', 'Cảm biến hỏng', 'Tải quá nhỏ'], e: 'Tỉ số < 1 là dấu hiệu Felicity.' },
        { q: 'Vì sao AE được gọi là phương pháp thụ động?', o: ['Không phát năng lượng vào vật; nó nghe năng lượng do chính khuyết tật phát ra khi chịu tải', 'Vì không cần điện', 'Vì cảm biến không cần tiếp âm', 'Vì chỉ dùng ban đêm'], e: 'Khác UT là phương pháp chủ động.' },
        { q: 'Sau khi AE định vị được một vùng hoạt động mạnh trên bồn, bước tiếp theo hợp lý là gì?', o: ['Kiểm tra bổ sung bằng UT, MT hoặc PT tại vùng đó để xác định và đo khuyết tật', 'Kết luận bồn phải hủy', 'Bỏ qua', 'Sơn lại bồn'], e: 'AE cho biết “ở đâu”, không cho biết “to bao nhiêu”.' }
      ] },

    { id: 'ir', track: 'tech', title: 'Nhiệt ảnh hồng ngoại', en: 'Thermography', src: '/NDETechniques/Thermography/index.xhtml', sim: 'thermo', cards: ['irdepth'],
      lessons: [
        ['Ba cách truyền nhiệt', 'Dẫn nhiệt (trong rắn), đối lưu (chất lưu chuyển động), bức xạ (sóng điện từ, đi được cả trong chân không). Camera hồng ngoại đo bức xạ nhiệt phát ra từ bề mặt.'],
        ['Độ phát xạ', 'Bề mặt kim loại bóng có độ phát xạ thấp: phản xạ nhiều, phát xạ ít, nên camera đọc nhiệt độ thấp hơn thực. Phải nhập đúng độ phát xạ hoặc dán băng, sơn có độ phát xạ biết trước.'],
        ['Thụ động và chủ động', 'Thụ động: quan sát vật tự nóng (tủ điện, ổ trục, đường ống). Chủ động: kích thích nhiệt bằng đèn flash, halogen, siêu âm, cảm ứng, rồi xem nhiệt lan vào vật. Khuyết tật cản dòng nhiệt (tách lớp, rỗ) tạo điểm nóng hoặc lạnh.'],
        ['Độ sâu và thời gian', 'Với flash, khuyết tật càng sâu thì hiện lên càng muộn và càng mờ; thời điểm xuất hiện tăng theo bình phương độ sâu (t ≈ z²/α, với α là hệ số khuếch tán nhiệt). Nhiệt ảnh hợp nhất với khuyết tật song song bề mặt như tách lớp composite; kém với vết nứt mảnh vuông góc bề mặt.']
      ],
      quiz: [
        { q: 'Tấm CFRP có α = 4·10⁻⁷ m²/s. Một điểm nóng xuất hiện sau 10 s kể từ khi flash. Theo mô hình t ≈ z²/α, tách lớp nằm sâu khoảng bao nhiêu milimét?', num: 2, rel: 0.03, unit: 'mm', e: 'z = √(4·10⁻⁷ × 10) = 2·10⁻³ m.' },
        { q: 'Camera đo một thanh cái đồng sáng bóng, đặt độ phát xạ mặc định 0,95. Kết quả có xu hướng thế nào?', o: ['Thấp hơn nhiệt độ thật', 'Cao hơn nhiệt độ thật', 'Chính xác', 'Không đo được gì'], e: 'Bề mặt bóng phát xạ ít hơn giả định.' },
        { q: 'Hai tách lớp giống nhau ở độ sâu 1 mm và 2 mm. Tách lớp 2 mm hiện lên sau tách lớp 1 mm khoảng mấy lần thời gian?', num: 4, abs: 0, unit: 'lần', e: 't tỉ lệ z²: (2/1)² = 4.' },
        { q: 'Nhiệt ảnh chủ động phù hợp nhất với loại khuyết tật nào?', o: ['Tách lớp, rỗ song song bề mặt trong composite', 'Vết nứt mảnh vuông góc bề mặt trong thép dày', 'Rỗ khí sâu 50 mm trong thép', 'Khuyết tật trong vật liệu đang chìm dưới nước'], e: 'Khuyết tật phải cản trở dòng nhiệt đi vào trong.' }
      ] }
  ];
  const TRACKS = { phys: 'Vật lý nền tảng', tech: 'Các phương pháp kiểm tra' };
  // Chương nên học trước mỗi hợp đồng
  const PREREQ = { pt1: ['cap', 'pt'], mt1: ['mag', 'mt'], ut1: ['waves', 'sound', 'ut'], rt1: ['atom', 'xray', 'rt'] };
  const api = { ACADEMY, TRACKS, PREREQ, NDE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else Object.assign(root, api);
})(this);
