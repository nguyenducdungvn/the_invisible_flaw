# BÀN GIAO · The Invisible Flaw (v0.8, 24/11/2026)

## 1. Trạng thái
- 9 hợp đồng (PT, MT, UT, RT, VT, ET, AE, nhiệt ảnh, vi ba) **chơi được hết luồng**: kiểm thử Playwright ở 1366 px và 390 px, không lỗi JS, không tràn ngang. 
- **v0.2: Học viện NDE** 17 chương (8 vật lý + 9 phương pháp), cấu trúc theo NDE-Ed.org Physics và NDE Techniques; 13 mô phỏng mới; 10 thẻ công thức mới. Kiểm thử Playwright: làm hết 17 bài kiểm tra ở cả 1366 px và 390 px, không lỗi. `check.js`: 591/591.
- **v0.3:** 8 mô hình 3D (Three.js r128 trong `js/vendor/`, tự dừng khi rời trang) hiện ở 14 chương Học viện và ở hồ sơ 4 hợp đồng; trang Giới thiệu (miễn trừ, cảm ơn, QR BIDV mời cà phê, chia sẻ); nút Giới thiệu trên thanh trên cùng và lời mời ở cuối mỗi kết quả.
- **v0.4:** rà soát nội dung (HVL Ir-192: chì 5.1 mm, thép 13 mm; dải Ir-192 10–90 mm; gông DC ≥ 18 kg đã đối chiếu; mục quyền riêng tư nhắc Cloudflare Analytics). `js/academy_deep.js`: mỗi chương thêm 3 mục “Đào sâu” mức Bậc II, 1 ví dụ tính có lời giải, 3 câu nâng cao (tổng 51 + 17 + 51); trang Thuật ngữ Việt – Anh 45 mục. 3D: khởi tạo WebGL khi cuộn tới, dừng khi tab ẩn, giải phóng texture; A-scan đồng bộ trong cảnh UT; 5 cảnh mới (kiểu sóng, mạng tinh thể BCC/FCC, từ hóa tròn/dọc, điều kiện VT, vi ba) → 13 cảnh, phủ cả 17 chương. `check.js`: 697/697.
- **v0.5:** đổi “ách từ” → “gông từ”. RT: hàng rào ≤ 7.5 µSv/h, vị trí thợ chụp ≤ 10 µSv/h (bước mới chọn vị trí quay nguồn: chỉ “cáp 15 m sau vách thép 25 mm” đạt ≈ 7.3 µSv/h) và bước mới đo xác nhận nguồn đã về; HVL thép 12.7 mm. Chương mới `ut2` UT nâng cao (V1/V2, DAC ASME V T-434.2.1, bù truyền âm, kiểm tra lại T-466, động học xung, ASTM E797, cấu tạo đầu dò) và `rs` An toàn bức xạ (Luật 94/2025/QH15, NĐ 332/2025, TT 59/2025, vùng kiểm soát/giám sát, ICRP 103/118, ứng phó sự cố) trong `js/academy_more.js`; 2 mô phỏng (động học xung, máy tính liều), 2 cảnh 3D (đầu dò tách rời, bản đồ suất liều 7.5/10 µSv/h) → 15 cảnh; A-scan hợp đồng UT có đường 100/50/20 % DAC; thêm 13 thuật ngữ. PREREQ: ut1 cần ut2, rt1 cần rs. `check.js`: 799/799.
- **v0.6:** 5 hợp đồng mới trong `js/levels_more.js` (dữ liệu, tiêu chí, atlas, PREREQ) và `js/m_more.js` (5 phòng thí nghiệm dùng lại SIMS + challenges; METHODS.VT/ET/AE/IR/MW; báo cáo chung `judge` cho ET, AE; VT, IR, MW dùng Surface). Thứ tự mở khóa 5 → 9 sau RT. Thẻ gợi ý nghề nghiệp (`Game.careerLine`, PHATECO, PNIC, NDE Vinatom) sau mỗi hợp đồng ≥ 1 sao và mục “Muốn làm NDT thật?” ở trang Giới thiệu. Mức quét +6 dB đã được anh Dũng xác nhận. `check.js`: 932/932; Playwright `new5.js` chơi hết 5 hợp đồng mới ở 1366 và 390 px.
- **v0.7: Phòng Bậc III** (`js/level3.js`): 5 tài liệu soát xét (quy trình UT, phiếu kỹ thuật và biên bản RT, quy trình MT, quy trình PT, hồ sơ nhân sự SNT-TC-1A / ISO 9712), mỗi tài liệu 7–10 dòng có bản đúng, bản sai, 3 cách sửa, giải thích và căn cứ. Mỗi lượt cài ngẫu nhiên 3–5 lỗi. Chấm: sửa đúng 2, chỉ đánh dấu 1, đánh dấu nhầm −1; ≥ 80 % → `certs[m] = 3` (Bậc III). Mở khi có Bậc II ở ≥ 1 phương pháp; từng tài liệu cần Bậc II đúng phương pháp (hồ sơ nhân sự cần Bậc II ở 2 phương pháp). `check.js`: 1075/1075; Playwright `l3.js`.
- **v0.8: số thập phân dùng dấu chấm.** 366 chỗ trong nội dung (bài học, câu hỏi, lời giải, tiêu chí, quy trình) đổi 0,5 → 0.5 (chỉ trong chuỗi ký tự, không đụng mã và màu rgba). `Game.fmt` không còn dùng locale vi-VN: dấu chấm thập phân, nhóm nghìn bằng khoảng trắng hẹp từ 10 000, dấu âm “−”. `Game.parseNum` chỉ nhận dấu chấm: có dấu phẩy thì trả NaN, không chấm điểm, hiện thông báo `Game.numMsg`. Mọi ô `inputmode=decimal` tự hiện cảnh báo đỏ ngay khi gõ dấu phẩy; dưới mỗi câu hỏi số có dòng “Quy tắc nhập số”. `check.js` có kiểm tra không còn dấu phẩy thập phân trong `js/`. Rà soát: thẻ gợi ý nghề nghiệp chuyển lên trên hàng nút; README cập nhật cấu trúc tệp. `check.js`: 1076/1076; Playwright play, new5, l3, acad, v3d, deep, comma đều đạt.
- Repo có tên miền riêng `hvflaw.hlvsuckhoe.com` (tệp CNAME) và Cloudflare Web Analytics trong index.html: giữ nguyên khi sửa.
- Thẩm định GDD: `docs/THAM_DINH_GDD.md`.
- Bản chơi thử: https://claude.ai/artifact/DRwkCPNZ2H7wADVdUT7LHU · Thư mục máy: `D:\New App 2026\The_invisible_FLAW\the_invisible_flaw`
- Repo: github.com/nguyenducdungvn/the_invisible_flaw (anh Dũng cho phép tự cập nhật).

## 2. Kiến trúc
- HTML/JS thuần, không build. Thứ tự script: three.min + OrbitControls → physics → criteria → levels → academy_data → academy_deep → academy_more → levels_more → core → labs → surface → m_pt → m_mt → m_ut → m_rt → m_more → level3 → academy_sims → academy → scene3d → about.
- Giao diện mỗi phương pháp: `Game.METHODS.X = { prep(el,M,next), inspect(el,M,next), report(el,M,finish) }`. `finish({proc, det, falseCalls, playerAccept, trueAccept, why, atlas, notes})`.
- Điểm (100): phương pháp 10 · phòng thí nghiệm 10 · quy trình 25 · phát hiện 35 (−6 cho mỗi báo động giả) · kết luận 20; −5 cho mỗi thẻ an toàn mất. Sao: kết luận sai = 0; ≥ 85 = 3; ≥ 65 = 2; còn lại = 1. Bậc I khi ≥ 1 sao, Bậc II khi 3 sao.
- `optional: p` trên khuyết tật = xác suất vắng mặt, để đáp án có thể là ĐẠT. `jitter` = dịch vị trí ngẫu nhiên.
- Lưu: localStorage khóa `invisible-flaw-v1`, có bọc try/catch.

## 3. Quy tắc cố định
- Số thập phân viết bằng dấu chấm (0.5) cả trong nội dung lẫn ô nhập; nhóm nghìn bằng khoảng trắng (17 500).
- Tiếng Việt: font tự host có subset vietnamese; line-height ≥ 1.6; không dùng uppercase hay letter-spacing cho chữ có dấu; canvas chỉ vẽ sau `document.fonts.load`.
- Mọi con số lấy từ `physics.js` hoặc `criteria.js`, có nguồn; chưa chắc thì ghi [CẦN KIỂM CHỨNG].
- Phương án sai phải hấp dẫn nhất (rẻ hoặc nhanh hơn); `check.js` kiểm tra điều này.

## 4. Việc tiếp theo
1. Đã chốt: hàng rào 7.5 µSv/h, vị trí thợ chụp 10 µSv/h (v0.5), quét +6 dB (v0.6). Còn có thể soát: tiêu chí hư cấu của ET, nhiệt ảnh, vi ba; thông số AE.
2. Hợp đồng nâng cao cho từng phương pháp (ET ống trao đổi nhiệt bằng đầu dò bobbin, UT mảng pha, RT số).
2b. NDE-Ed.org chặn công cụ tải trang tự động; muốn đọc thêm trang con thì dùng trình duyệt tích hợp của ứng dụng desktop.
3. Hợp đồng trùm MT + UT; Bậc III mở rộng: viết phiếu kỹ thuật từ đầu, soát xét quy trình cho VT, ET, AE.
4. Âm thanh WebAudio: tiếng tích tắc của máy đo liều, tiếng bíp của cổng đo.
