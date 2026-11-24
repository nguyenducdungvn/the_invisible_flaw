# THẨM ĐỊNH GDD · THE INVISIBLE FLAW (Bác Sĩ Vật Liệu)

Người thẩm định: Claude, trong vai Serious Game Designer kiêm kỹ sư NDT Level III · 24/11/2026
Đối tượng: `The_invisible_flaw.md` (GDD 5 mục) · Kèm theo: bản chơi thử v0.1 (PT, MT, UT, RT) trong repo này.

> Chỗ ghi **[CẦN KIỂM CHỨNG]** là con số tôi chưa đối chiếu được với văn bản gốc trong tay. Anh, với tư cách Responsible Level III, cần duyệt lại trước khi dùng cho đào tạo chính thức.

## Tóm tắt

| Tiêu chí | Đánh giá | Ý chính |
|---|---|---|
| 1. Chính xác chuyên môn | **Khá, cần sửa 9 điểm** | Khung vật lý đúng hướng NDE-Ed.org. Phần quy trình còn sơ lược và có vài lỗi nghề: tẩy chất thấm, UV với chất thấm màu, kV/mA với nguồn gamma, thiếu VT, chứng chỉ chưa tách theo phương pháp. |
| 2. Vòng lặp gameplay | **Nền tốt, dễ nhàm** | Vòng 4 bước đúng nghiệp vụ, nhưng học dồn ở đầu (6 phòng thí nghiệm trước khi được chơi), mỗi màn lặp y hệt, hiệu chuẩn chỉ là kéo thanh trượt cho khớp, và không có giá cho báo động giả nên người chơi sẽ học được mẹo “cứ loại hết”. |
| 3. Gamification | **Đã dựng 12 cơ chế, đề xuất thêm 7** | Cốt lõi: biến công thức thành **công cụ dự đoán** thay vì câu đố, và để quy trình sai **lộ hậu quả về sau** thay vì báo lỗi ngay. |

---

## 1. Tính chính xác chuyên môn (vật lý và quy trình NDT)

| # | Mục GDD | Vấn đề | Đề xuất sửa | Căn cứ |
|---|---|---|---|---|
| 1.1 | §1.1, §2 “Cấp 1…6” và “Thực tập sinh → Bậc I → II → III” | Cấp bậc đang **chung cho mọi phương pháp**. Trong thực tế, chứng chỉ cấp theo từng phương pháp: có Bậc II UT không có nghĩa là được ký RT. Thêm nữa, chữ “Cấp 1–6” cho phương pháp dễ nhầm với “Bậc” của chứng chỉ. | Chứng chỉ tính theo từng phương pháp (đã làm trong bản chơi thử). Đổi “Cấp 1–6” thành “Chương 1–6”. Ghi rõ: chứng chỉ trong game không thay chứng chỉ thật (cần thi chung, thi riêng, thi thực hành và đủ giờ kinh nghiệm theo written practice). | SNT-TC-1A; ISO 9712; PTC.TDD.NDT.P01 Written Practice |
| 1.2 | §2 bảng 8 phương pháp | **Thiếu VT**, là phương pháp đầu tiên và bắt buộc trước mọi phương pháp khác. Thiếu LT, trong khi anh đã có chương trình T07 LT. | Thêm Chương 0 “VT – con mắt nghề”, có thể làm màn hướng dẫn. LT để ở chương chuyên sâu. | Chương trình T06 VT, T07 LT của PHATECO |
| 1.3 | §2 Mao dẫn: “độ nhớt… khả năng tự thấm” | Độ nhớt hầu như **không** quyết định khả năng thấm (chiều cao cân bằng h = 2γcosθ/ρgw không chứa η). Độ nhớt chỉ quyết định **tốc độ** thấm (Washburn: t ∝ η). | Sửa câu kiến thức. Bản chơi thử đã có câu dự đoán riêng cho ý này. | NDE-Ed.org, PT – Penetrant Properties |
| 1.4 | §2 PT “quy trình 4 bước” | Thiếu các bước: làm sạch trước và chờ khô, thời gian hiện hình, làm sạch sau. **“Rửa sạch chất thừa”** chỉ đúng với loại rửa nước; với loại tẩy bằng dung môi thì **cấm xả dung môi trực tiếp**, phải lau bằng giẻ thấm ẩm. **“Đèn UV”** chỉ dùng cho chất thấm huỳnh quang; chất thấm màu soi bằng ánh sáng trắng ≥ 1000 lx. | Quy trình 7 bước, có tham số: nhiệt độ 5–52 °C, ngấm ≥ 5 phút, hiện hình ≥ 10 phút, chiếu sáng. Bản chơi thử đã dựng đủ. | ASME V Điều 6: T-652, Bảng T-672, T-673.3, T-676 |
| 1.5 | §2 MT | Nên gọi là **chỉ thị** (tích tụ hạt từ), không phải “đám mây từ”. Thiếu ba yêu cầu: kiểm tra lực nâng của ách (AC ≥ 4,5 kg, **hằng ngày** từ ấn bản 2015), xác nhận trường từ bằng chỉ thị (pie gauge/shim), kiểm tra **2 lần với đường sức gần vuông góc**. Thiếu khử từ khi đặc tính kỹ thuật yêu cầu. | Đã dựng trong bản chơi thử: lực nâng, chỉ thị trường, bản đồ phủ 2 hướng theo từng đoạn. Ách DC hoặc nam châm vĩnh cửu ≥ 18 kg (40 lb) ở khoảng cách cực lớn nhất: đã đối chiếu (v0.4). | ASME V Điều 7: T-750, T-762, T-764 |
| 1.6 | §2 ECT | Đúng hướng. Nên ghi công thức độ sâu thấm chuẩn δ = 1/√(πfμσ). Đo chiều dày lớp phủ bằng lift-off chỉ áp dụng cho **lớp phủ không dẫn điện trên nền dẫn điện**. Kiểm tra ống trao đổi nhiệt dùng đầu dò bobbin, phân tích góc pha trên mẫu chuẩn ống, khác với dò bề mặt tấm nhôm. | Tách thành 2 hợp đồng ET khác nhau. `physics.js` đã có `skinDepth()`. | NDE-Ed.org ET; ASME V Điều 8 |
| 1.7 | §2 UT, §3 bước 2 | “Hiệu chuẩn trên mẫu chuẩn” đang gộp 2 việc khác nhau: (a) **thang đo, điểm ra, góc** trên IIW V1/V2; (b) **độ nhạy và DAC** trên mẫu chuẩn cơ sở có lỗ khoan cạnh. Thanh trượt “tần số” không phải núm hiệu chuẩn: tần số do đầu dò quyết định. Thiếu các bước quét ở mức +6 dB so với mức chuẩn, điều tra chỉ thị > 20 % DAC, đo chiều dài bằng phương pháp giảm 6 dB. | Bản chơi thử: dự đoán SP → chỉnh V và Z → mức chuẩn 80 % FSH → 6 điểm DAC (chân sóng 1 và 2) → quét +6 dB → người chơi tự tính độ sâu và vị trí → đối chiếu tiêu chí Phụ lục 12. Số mục quy định quét +6 dB **[CẦN KIỂM CHỨNG]**. | ASME V Điều 4; ASME VIII Phụ lục 12; T02 UT Rev.5 mục 3.2, 5.4, 6.4, 7.1 |
| 1.8 | §2 RT “tính kV, mA và thời gian” | Chỉ đúng với **máy phát tia X**. Nguồn gamma (Ir-192, Se-75, Co-60) không có kV hay mA: các biến là **hoạt độ (phân rã theo thời gian)**, SFD và thời gian chiếu. Cần thêm: độ đen 2,0–4,0 (gamma), vị trí IQI phía nguồn, độ nhòe hình học Ug, liều kế, máy đo suất liều, ranh giới vùng kiểm soát. | Bản chơi thử: tính hoạt độ hôm nay → tự tính bán kính rào (máy đo réo nếu sai) → IQI → thời gian chiếu → độ đen → đọc phim. Γ ≈ 0,13 mSv·m²/(h·GBq) và HVL (chì 5,1 mm, thép 13 mm) đã đối chiếu với số liệu tham khảo (v0.4). Giới hạn rào 20 µSv/h vẫn là dữ liệu màn chơi **[CẦN KIỂM CHỨNG theo quy trình an toàn bức xạ của đơn vị và quy định Việt Nam hiện hành]**. | ASME V Điều 2: T-277, T-282; ASME VIII UW-51 |
| 1.9 | §1.1, §3 bước 4 “đối chiếu tiêu chuẩn” | GDD lấy NDE-Ed.org làm nguồn học thuật. Nguồn này tốt cho vật lý, **nhưng không có tiêu chí chấp nhận**. Tiêu chí phải lấy từ bộ luật chế tạo (ASME VIII, B31.3, AWS D1.1, ISO 5817…) và mỗi màn phải ghi rõ bộ luật nào. | `criteria.js`: mỗi bộ tiêu chí ghi tên, nguồn, và chỗ nào đã rút gọn. | ASME VIII Phụ lục 6, 8, 12; UW-51 |

**Nhận xét nhỏ khác:**
- Nhiệt ảnh “tủ điện” thuộc giám sát tình trạng thiết bị. Nên thêm tách lớp composite, đúng với tinh thần NDT của GDD.
- Phát xạ âm (AE) là phương pháp **thụ động, cần gia tải** (thử áp, hiệu ứng Kaiser/Felicity). Đây là gameplay rất hay: người chơi điều khiển việc tăng áp và lắng nghe.
- Vi ba khá ngách. Nên để làm màn thưởng.

## 2. Tính hấp dẫn và cân bằng của vòng lặp gameplay

**Điểm mạnh:** vòng 4 bước bám đúng nghiệp vụ; có 4 chỉ số tạo được giằng co (tiền, thời gian, an toàn, uy tín); dữ liệu màn dạng JSON dễ mở rộng; có hậu quả trực quan.

| # | Vấn đề | Vì sao gây nhàm hoặc mất cân bằng | Cách xử lý trong bản chơi thử |
|---|---|---|---|
| 2.1 | Học dồn ở đầu: phải qua 6 phòng thí nghiệm vật lý rồi mới được ra hiện trường | Người chơi gặp lý thuyết khi chưa có lý do để cần nó, nên rời game ở giờ đầu | **Học đúng lúc:** mỗi phòng thí nghiệm mở ngay trước hợp đồng cần đến nó, dài khoảng 60 giây, kết thúc bằng 2 câu dự đoán |
| 2.2 | Mọi màn lặp y hệt 4 bước | Từ màn thứ 3 trở đi, người chơi chạy theo thói quen | Mỗi phương pháp có **động từ riêng**: PT chọn thời gian, MT phủ 2 hướng theo từng đoạn, UT quét đầu dò và đọc A-scan, RT dựng rào và xử lý sự cố |
| 2.3 | Hiệu chuẩn bằng cách “kéo thanh trượt cho khớp ngưỡng” | Thử-sai tình cờ cũng qua được, người chơi bỏ qua vật lý | **Dự đoán trước, đo sau:** phải tính SP của từng lỗ rồi mới chỉnh V và Z; máy **không** tự tính lượng giác |
| 2.4 | Không có giá cho báo động giả; tất cả màn đều có khuyết tật | Chiến thuật trội là “thấy gì cũng loại” | Chấm theo **phát hiện / bỏ sót / báo động giả**. Khuyết tật quyết định **có thể vắng mặt** (xác suất 35–45 %), khi đó đáp án đúng là ĐẠT |
| 2.5 | Vi phạm an toàn là Game Over ngay lập tức | Người chơi học sợ chứ không học phán đoán; lại dễ bỏ cuộc | **3 thẻ an toàn** cho lỗi thường; chỉ lỗi nghiêm trọng (tiếp tục chiếu khi máy đo réo) mới dừng ngay |
| 2.6 | Uy tín chỉ tăng khi đúng 100 % | Thang điểm nhị phân, không thưởng tiến bộ | Điểm 100 chia 5 phần, 1–3 sao; Bậc I khi kết luận đúng, Bậc II khi đạt 3 sao |
| 2.7 | Phương án sai thường lộ liễu | Không có giằng co thật | **Phương án sai là phương án hấp dẫn nhất** (rẻ, nhanh, “chắc ăn”), có lời khách gợi ý kèm đồng hồ đếm ngược |
| 2.8 | Tọa độ khuyết tật cố định trong JSON | Chơi lại thì nhớ đáp án | `jitter` và `optional`: mỗi lần chơi đổi vị trí và đổi cả đáp án |
| 2.9 | Hậu quả chỉ có kiểu “nổ” | Không phân biệt được bỏ sót và loại oan | Thẻ **“Sáu tháng sau”** cho 4 trường hợp: đúng/sai × đạt/loại. Loại oan cũng có giá |
| 2.10 | §5 dùng Tailwind/React | Thêm bước build và phụ thuộc mạng, không cần thiết | Bản chơi thử dùng HTML/JS thuần, font tự host, chạy được qua `file://` |

## 3. Cải tiến cơ chế và gamification để không nhàm khi học công thức

**Nguyên tắc:** công thức phải là **công cụ để thắng**, không phải câu hỏi để qua màn. Người chơi tính vì kết quả tính giúp họ làm nhanh hơn, an toàn hơn, ít tốn tiền hơn.

### Đã dựng trong bản chơi thử v0.1

| Cơ chế | Hoạt động thế nào | Vì sao chống nhàm |
|---|---|---|
| Dự đoán trước, đo sau | Tính SP, góc nêm, hoạt độ, bán kính rào trước; mô phỏng chỉ xác nhận | Tạo khoảnh khắc “mình đoán đúng!”; công thức có mục đích |
| Máy không tự tính lượng giác | Từ SP đọc được, người chơi tự ra độ sâu và vị trí, rồi so với mặt vát để phân loại | Toán học trở thành công cụ phân biệt khuyết tật thật với tín hiệu hình học |
| Sổ tay công thức có máy tính | Thẻ mở khóa ở phòng thí nghiệm; tự tính tay thì miễn phí, dùng máy tính tốn 1 phút dừng máy | Thưởng người nhớ công thức nhưng không chặn người chưa nhớ |
| Quy trình sai thì hậu quả hiện ra lúc soi | Xả dung môi trực tiếp hay ngấm 3 phút không báo lỗi ngay; vết nứt chỉ đơn giản là mờ đi hoặc biến mất | Giống thực tế: lỗi quy trình là lỗi “vô hình”, đúng tên game |
| Phương án sai hấp dẫn kèm áp lực khách | Gợi ý màu cam, đồng hồ 25 giây, quá giờ +15 phút | Có giằng co thật giữa tốc độ và đúng quy trình |
| Tín hiệu không liên quan phải xác minh | PT lau và hiện hình lại; MT đối chứng bằng PT; RT soi đèn xiên; UT gờ chân ở độ sâu = T | Dạy kỹ năng Bậc II quan trọng nhất: phân biệt thật và giả |
| Báo động giả bị phạt, đáp án có thể là ĐẠT | Xem 2.4 | Không còn chiến thuật “loại hết” |
| “Trên DAC chưa chắc loại” | Xỉ 6 mm vượt DAC nhưng vẫn đạt (giới hạn t/3 = 8,3 mm) | Phá ngộ nhận phổ biến của học viên |
| Sự cố ngẫu nhiên có đếm ngược | Có người đi vào vùng kiểm soát: 3 giây để thu nguồn | Tạo nhịp nhanh, chậm, nhanh; dạy phản xạ an toàn |
| Atlas khuyết tật | Mỗi loại mở khi phân loại đúng lần đầu | Động lực sưu tầm, ôn kiến thức nhẹ nhàng |
| Thẻ “Sáu tháng sau” và nhận xét Bậc III | Kết luận sai thì thấy hậu quả; nhận xét chỉ ra đúng chỗ sai | Phản hồi có cảm xúc mà vẫn sư phạm |
| Chơi lại có biến thể | Vị trí và sự có mặt của khuyết tật đổi mỗi lần | Lý do để chơi lại lấy 3 sao |

### Đề xuất cho các bản sau

1. **Hợp đồng “trùm” kết hợp nhiều phương pháp:** MT phát hiện vết nứt chân, UT đo độ sâu, người chơi đề xuất mài hay hàn lại. Dạy tư duy chọn phương pháp bổ trợ.
2. **Chế độ Bậc III:** soát xét một quy trình có lỗi cài sẵn (ví dụ ngấm 3 phút, IQI phía phim, DAC chỉ 2 điểm), viết bảng kỹ thuật, duyệt biên bản của “Bậc I” đồng nghiệp. Phù hợp với hướng bậc 3 trong Toolkit đào tạo của anh.
3. **ET với mặt phẳng trở kháng:** xoay pha để tách tín hiệu lift-off và tín hiệu vết nứt; chọn tần số theo δ để “nhìn” đúng độ sâu ăn mòn.
4. **AE:** người chơi điều khiển việc tăng áp theo từng bậc, nghe sự kiện, nhận ra hiệu ứng Felicity.
5. **Khách hàng quay lại:** quyết định ở hợp đồng trước ảnh hưởng hợp đồng sau. Ví dụ đã chấp nhận sai mối hàn W-07 thì Màn 5 là điều tra sự cố rò rỉ.
6. **Ca trực hằng ngày:** một hợp đồng sinh ngẫu nhiên mỗi ngày, có bảng xếp hạng theo tỉ lệ phát hiện và báo động giả.
7. **Liên thông với NDT Training Control:** điểm phòng thí nghiệm và hợp đồng có thể làm bài tập bổ trợ. Dùng mã mục riêng (ví dụ `game:G-PT1`) để không trùng mã hiện có. Cần anh quyết định có dùng hay không.

## 4. Giới hạn của bản chơi thử

- Mô hình tín hiệu UT, độ đen phim RT và độ hiện của chỉ thị PT/MT được **đơn giản hóa có chủ đích**; xem chú thích đầu mỗi tệp `js/m_*.js`. Đây là mô phỏng số cho đào tạo, không phải ảnh hay dữ liệu thiết bị thật.
- Tiêu chí RT đã rút gọn: bỏ quy tắc nhóm thẳng hàng 12t và bảng mật độ rỗ của Phụ lục 4.
- Chứng chỉ và điểm trong game là bằng chứng luyện tập, không thay thi chứng nhận.

## Nguồn đã dùng
- Tài liệu của anh: PTC.TDD.NDT.T02 UT Training Programme Rev.5 (Drive); BAN_GIAO_Kinh_nghiem_va_Toolkit_dao_tao_NDT.md (Drive); `claude/ndt-game-khoi-dong.md`, `claude/quy-tac-tieng-viet.md`, `claude/kiem-dem-ca-dem-handoff.md` (Project App GAME).
- ASME BPVC Section V Điều 2, 4, 6, 7; Section VIII Div.1 Phụ lục 6, 8, 12 và UW-51. Đã đối chiếu các con số dùng trong game qua bản trích dẫn công khai; cần soát lại theo ấn bản đang áp dụng.
- NDE-Ed.org (Iowa State University): phần vật lý nền tảng.

---

## Cập nhật v0.2 (24/11/2026): Học viện NDE theo NDE-Ed.org

Theo yêu cầu bổ sung, “Giai đoạn 1: Học viện Vật lý” của GDD được dựng thành **Học viện NDE**. Học viện **không chặn** việc ra hiện trường (giữ nguyên khuyến nghị 2.1), nhưng mỗi hợp đồng gợi ý chương nên học trước.

| Nhánh | Chương (theo mục lục NDE-Ed.org) | Mô phỏng |
|---|---|---|
| Vật lý nền tảng | Nguyên tử & nguyên tố · Điện học & hiệu ứng bề mặt · Từ học & vòng từ trễ · Sóng · Âm học & trở kháng âm · Tia X/gamma & suy giảm · Vật liệu & hư hỏng · Mao dẫn | Lắp ráp đồng vị; dòng xoáy theo độ sâu; vòng từ trễ và khử từ; bước sóng so với cỡ khuyết tật; phản xạ/truyền qua; I = I₀e^(−μx); kéo mẫu thép; mao dẫn |
| Phương pháp | VT · UT · MT · ET · Vi ba · RT · PT · AE · Nhiệt ảnh | Điều kiện quan sát T-952; Snell; từ thông rò; mặt phẳng trở kháng; độ ẩm composite; bức xạ; xếp quy trình PT; định vị nguồn AE; flash nhiệt ảnh |

So với GDD: thêm **VT** (không có trong mục lục kỹ thuật của NDE-Ed.org nhưng là phương pháp bắt buộc đầu tiên) và đưa **ET, AE, nhiệt ảnh, vi ba** vào dạng bài học có mô phỏng trước khi làm hợp đồng hiện trường. Các giá trị vật liệu trong mô phỏng ghi “tham khảo” là giá trị minh họa. Mô hình mặt phẳng trở kháng, nhiệt ảnh và hằng số điện môi trộn tuyến tính là mô hình định tính cho học tập.

---

## Cập nhật v0.4 (24/11/2026): rà soát và đào sâu

**Đã đối chiếu và sửa:**
- Ách từ: AC ≥ 4,5 kg (10 lb), DC hoặc nam châm vĩnh cửu ≥ 18 kg (40 lb) ở khoảng cách cực lớn nhất; kiểm tra trước mỗi ngày sử dụng.
- Ir-192: hằng số suất liều ≈ 0,13 mSv·m²/(h·GBq) (5,6 mrem/h ở 30 cm cho 1 mCi); HVL chùm rộng: chì ≈ 5,1 mm, thép ≈ 13 mm (trước đây ghi 4,8 và 12,7); dải thép 10–90 mm theo ISO 5579 (trước ghi 10–60).
- Quyền riêng tư: bổ sung việc trang dùng Cloudflare Web Analytics (đếm lượt xem ẩn danh).
- Còn lại cần Level III soát: giới hạn rào 20 µSv/h theo quy định Việt Nam hiện hành; số mục ASME V quy định quét +6 dB.

**Bổ sung kiến thức:** mỗi chương Học viện có 3 mục “Đào sâu” (ví dụ: công thức thực hành δ(mm) ≈ 503/√(f·μr·σ[MS/m]); dòng que dẫn 90–125 A/25 mm theo ASME V; cơ học phá hủy a_tới hạn = (KIC/Yσ)²/π; điều kiện soi huỳnh quang UV-A ≥ 1000 µW/cm², ánh sáng xung quanh ≤ 20 lx; nồng độ hạt ướt 0,1–0,4 mL/100 mL; IQI 2-2T; bốn phương pháp loại bỏ chất thấm A–D; ngưỡng AE và nguồn Hsu-Nielsen; Stefan – Boltzmann và nhiệt ảnh lock-in), 1 ví dụ tính có lời giải, 3 câu hỏi nâng cao; bảng 45 thuật ngữ Việt – Anh.

**Minh họa:** 13 cảnh 3D phủ cả 17 chương; cảnh UT có A-scan chạy đồng bộ (gờ chân SP 50 mm, không ngấu SP 84 mm), giúp người học nối hình học chùm tia với tín hiệu trên màn hình.
