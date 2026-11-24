# The Invisible Flaw · Bác Sĩ Vật Liệu

Game mô phỏng kiểm tra không phá hủy (NDT) chạy trên trình duyệt. Người chơi là kỹ sư tập sự nhận hợp đồng kiểm tra: chọn phương pháp, làm đúng quy trình, hiệu chuẩn, đọc tín hiệu, đối chiếu tiêu chí chấp nhận và ký **Đạt / Loại bỏ**.

**Bản chơi thử v0.2:** 4 hợp đồng hiện trường PT → MT → UT → RT, kèm **Học viện NDE** gồm 17 chương: 8 chương vật lý nền tảng và 9 chương phương pháp (VT, UT, MT, ET, vi ba, RT, PT, AE, nhiệt ảnh), cấu trúc theo NDE-Ed.org.

## Chạy
- Mở `index.html` trực tiếp (chạy được qua `file://`), hoặc
- `python3 -m http.server` rồi vào http://localhost:8000
- GitHub Pages: Settings → Pages → Deploy from branch `main` / thư mục gốc.

## Cấu trúc
| Tệp | Vai trò |
|---|---|
| `js/physics.js` | Mọi công thức (nguồn duy nhất cho mô phỏng, đáp án, sổ tay, kiểm thử) |
| `js/criteria.js` | Tiêu chí chấp nhận ASME VIII Phụ lục 6, 8, 12, UW-51 (có ghi chỗ rút gọn) |
| `js/levels.js` | Dữ liệu hợp đồng dạng JSON + Atlas khuyết tật |
| `js/core.js` | Trạng thái, lưu (localStorage), HUD, sổ tay, vòng lặp nhiệm vụ, chấm điểm |
| `js/labs.js` | Phòng thí nghiệm: mao dẫn, từ thông rò, Snell, bức xạ |
| `js/academy_data.js` | Nội dung Học viện: bài học, câu hỏi, chương nên học trước mỗi hợp đồng |
| `js/academy_sims.js` | 13 mô phỏng của Học viện (nguyên tử, độ sâu thấm, từ trễ, bước sóng, trở kháng âm, suy giảm, ứng suất – biến dạng, mặt phẳng trở kháng, vi ba, định vị AE, nhiệt ảnh, VT, quy trình PT) |
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
