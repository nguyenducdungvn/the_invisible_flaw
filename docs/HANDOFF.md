# BÀN GIAO · The Invisible Flaw (v0.1, 24/11/2026)

## 1. Trạng thái
- Bản chơi thử 4 hợp đồng (PT, MT, UT, RT) **chơi được hết luồng**: kiểm thử Playwright ở 1366 px và 390 px, không lỗi JS, không tràn ngang. `node tools/check.js`: 123/123 đạt.
- Thẩm định GDD: `docs/THAM_DINH_GDD.md`.
- Bản chơi thử: https://claude.ai/artifact/DRwkCPNZ2H7wADVdUT7LHU · Thư mục máy: `D:\New App 2026\The_invisible_FLAW\the_invisible_flaw`
- Repo: github.com/nguyenducdungvn/the_invisible_flaw (**chỉ đẩy khi anh Dũng duyệt**).

## 2. Kiến trúc
- HTML/JS thuần, không build. Thứ tự script: physics → criteria → levels → core → labs → surface → m_pt → m_mt → m_ut → m_rt.
- Giao diện mỗi phương pháp: `Game.METHODS.X = { prep(el,M,next), inspect(el,M,next), report(el,M,finish) }`. `finish({proc, det, falseCalls, playerAccept, trueAccept, why, atlas, notes})`.
- Điểm (100): phương pháp 10 · phòng thí nghiệm 10 · quy trình 25 · phát hiện 35 (−6 cho mỗi báo động giả) · kết luận 20; −5 cho mỗi thẻ an toàn mất. Sao: kết luận sai = 0; ≥ 85 = 3; ≥ 65 = 2; còn lại = 1. Bậc I khi ≥ 1 sao, Bậc II khi 3 sao.
- `optional: p` trên khuyết tật = xác suất vắng mặt, để đáp án có thể là ĐẠT. `jitter` = dịch vị trí ngẫu nhiên.
- Lưu: localStorage khóa `invisible-flaw-v1`, có bọc try/catch.

## 3. Quy tắc cố định
- Tiếng Việt: font tự host có subset vietnamese; line-height ≥ 1,6; không dùng uppercase hay letter-spacing cho chữ có dấu; canvas chỉ vẽ sau `document.fonts.load`.
- Mọi con số lấy từ `physics.js` hoặc `criteria.js`, có nguồn; chưa chắc thì ghi [CẦN KIỂM CHỨNG].
- Phương án sai phải hấp dẫn nhất (rẻ hoặc nhanh hơn); `check.js` kiểm tra điều này.

## 4. Việc tiếp theo
1. Anh Dũng soát các điểm [CẦN KIỂM CHỨNG]: Γ và HVL của Ir-192, giới hạn rào 20 µSv/h, số mục quy định quét +6 dB, yêu cầu ách DC.
2. Thêm Chương 0 VT và hợp đồng ET (mặt phẳng trở kháng).
3. Hợp đồng trùm MT + UT; chế độ Bậc III (soát xét quy trình có lỗi cài sẵn).
4. Âm thanh WebAudio: tiếng tích tắc của máy đo liều, tiếng bíp của cổng đo.
