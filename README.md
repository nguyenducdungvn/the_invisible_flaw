# The Invisible Flaw · Bác Sĩ Vật Liệu

Game mô phỏng kiểm tra không phá hủy (NDT) chạy trên trình duyệt. Người chơi là kỹ sư tập sự nhận hợp đồng kiểm tra: chọn phương pháp, làm đúng quy trình, hiệu chuẩn, đọc tín hiệu, đối chiếu tiêu chí chấp nhận và ký **Đạt / Loại bỏ**.

**Phiên bản v0.6:** 9 hợp đồng hiện trường (thêm VT, dòng điện xoáy, phát xạ âm, nhiệt ảnh, vi ba) và gợi ý học, thi chứng chỉ NDT thật sau mỗi hợp đồng. **v0.5:** thêm chương UT nâng cao và An toàn bức xạ (hàng rào 7,5 µSv/h, vị trí thợ chụp 10 µSv/h), 15 mô hình 3D tương tác, phần Đào sâu mức Bậc II, ví dụ tính, thuật ngữ Việt – Anh, trang Giới thiệu. Chơi tại https://hvflaw.hlvsuckhoe.com/.  9 hợp đồng hiện trường PT → MT → UT → RT → VT → ET → AE → nhiệt ảnh → vi ba, kèm **Học viện NDE** gồm 19 chương: 8 chương vật lý nền tảng, 10 chương phương pháp (VT, UT, UT nâng cao, MT, ET, vi ba, RT, PT, AE, nhiệt ảnh) và An toàn bức xạ, cấu trúc theo NDE-Ed.org.

👉 **Chơi tại: https://hvflaw.hlvsuckhoe.com/**

## Chạy
- Mở `index.html` trực tiếp (chạy được qua `file://`), hoặc
- `python3 -m http.server` rồi vào http://localhost:8000
- GitHub Pages: Settings → Pages → Deploy from branch `main` / thư mục gốc. Tên miền riêng `hvflaw.hlvsuckhoe.com` (tệp `CNAME`; bản ghi CNAME `hvflaw` trên Cloudflare trỏ về `nguyenducdungvn.github.io`).

## Cấu trúc
| Tệp | Vai trò |
|---|---|
| `js/physics.js` | Mọi công thức (nguồn duy nhất cho mô phỏng, đáp án, sổ tay, kiểm thử) |
| `js/criteria.js` | Tiêu chí chấp nhận ASME VIII Phụ lục 6, 8, 12, UW-51 (có ghi chỗ rút gọn) |
| `js/levels.js` | Dữ liệu hợp đồng dạng JSON + Atlas khuyết tật |
| `js/core.js` | Trạng thái, lưu (localStorage), HUD, sổ tay, vòng lặp nhiệm vụ, chấm điểm |
| `js/labs.js` | Phòng thí nghiệm: mao dẫn, từ thông rò, Snell, bức xạ |
| `js/academy_data.js` | Nội dung Học viện: bài học, câu hỏi, chương nên học trước mỗi hợp đồng |
| `js/academy_deep.js` | Phần Đào sâu (mức Bậc II), ví dụ tính có lời giải, câu hỏi nâng cao, bảng thuật ngữ Việt – Anh |
| `js/academy_sims.js` | 13 mô phỏng của Học viện (nguyên tử, độ sâu thấm, từ trễ, bước sóng, trở kháng âm, suy giảm, ứng suất – biến dạng, mặt phẳng trở kháng, vi ba, định vị AE, nhiệt ảnh, VT, quy trình PT) |
| `js/scene3d.js` | 13 mô hình 3D tương tác (UT kèm A-scan, MT, từ hóa tròn/dọc, PT, RT, ET, AE, nhiệt ảnh, nguyên tử, kiểu sóng, mạng tinh thể, VT, vi ba) dựng bằng Three.js r128 tự host trong `js/vendor/` |
| `js/about.js` | Trang Giới thiệu: miễn trừ trách nhiệm, cảm ơn, mời cà phê (QR trong `assets/`), chia sẻ |
| `js/academy.js` | Giao diện Học viện, tiến độ, mở khóa thẻ công thức |
| `js/surface.js` | Khung soi bề mặt dùng chung cho PT, MT, RT (thước đo, phân loại, biên bản) |
| `js/m_pt.js` `m_mt.js` `m_ut.js` `m_rt.js` | Quy trình và mô phỏng từng phương pháp |
| `tools/check.js` | `node tools/check.js`: kiểm tra vật lý, dữ liệu màn, tiêu chí, biên jitter, và tính lại mọi đáp số của Học viện |
| `docs/THAM_DINH_GDD.md` | Bản thẩm định GDD theo 3 tiêu chí |
| `docs/HANDOFF.md` | Bàn giao để làm tiếp |

## Thêm hợp đồng mới
Thêm một object vào `LEVELS` trong `js/levels.js` (phương pháp đã có). Phương pháp mới thì thêm `js/m_xx.js` đăng ký `Game.METHODS.XX = { prep, inspect, report }` và một phòng thí nghiệm trong `labs.js`. Chạy `node tools/check.js` trước khi đẩy lên.

## Lưu ý
Mọi công ty, công trình, nhân vật là hư cấu. Mô hình tín hiệu được đơn giản hóa cho mục đích đào tạo. Điểm và chứng chỉ trong game không thay chứng nhận nhân sự NDT. Các giá trị đánh dấu [CẦN KIỂM CHỨNG] phải được Level III soát xét.

Font: Be Vietnam Pro, Noto Serif, Roboto Mono (@fontsource, giấy phép SIL OFL).
