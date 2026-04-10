# Case Study: FCC Vietnam Smart Factory Production Report System

Case study tham khảo từ dự án thật, áp dụng cho các dự án tương tự.

## Bối cảnh

- **Khách hàng**: FCC Vietnam — nhà máy Nhật tại Việt Nam, sản xuất phụ tùng ô tô (brake, clutch, gear, piston).
- **Partners**: DanaExperts (ERP/Odoo) × Y-nettech (IoT/Automation).
- **Phase**: Proposal → Demo → Detailed quote → Contract → Phase 1.
- **Mục tiêu dự án**: Số hóa báo cáo sản xuất hằng ngày, thay thế báo cáo giấy, tự động phát hiện bất thường.

## Pain points ban đầu (As-Is)

1. **Báo cáo giấy đa dòng**: operator viết tay cuối ca, dễ sai sót, khó đọc, mất thời gian.
2. **Tổng hợp Excel thủ công**: tổ trưởng sao chép lại vào Excel, 1-2 giờ/ngày.
3. **Phê duyệt chậm**: Chief ký duyệt tập thể, không chia theo ca, khó truy vết trách nhiệm.
4. **Không phát hiện bất thường kịp thời**: NG cao hoặc downtime dài chỉ phát hiện khi cuối tuần tổng kết.
5. **OT không có lý do rõ ràng**: khó kiểm soát chi phí OT.
6. **Không đồng bộ với IFS**: product code, lot number phải gõ tay, dễ sai.
7. **Khó làm analytics**: dữ liệu phân tán, không có dashboard.

## Giải pháp (To-Be) — key decisions

### Quyết định 1: Cấu trúc 1 máy × 1 ngày × 3 ca
Thay vì 1 báo cáo = 1 line-day với nhiều dòng, chuyển sang 1 báo cáo = 1 máy trong 1 ngày, có 3 ca con bên trong. Điều này phản ánh đúng cách vận hành thật (operator đứng 1 máy).

### Quyết định 2: Team-based user model
9 teams × 5 people = 45 user. Mỗi team gắn với 1 dept × 1 shift. Sub Leader kiêm Operator (quan trọng — không tổ trưởng nào chỉ ngồi không). Dữ liệu khởi tạo từ một constant `TEAMS_DEF` duy nhất, giúp dễ maintain.

### Quyết định 3: Per-shift approval
Mỗi ca do Sub Leader của ca đó duyệt riêng. Khi cả 3 ca xong → chuyển Ast/Chief duyệt cấp 2. Lý do: Sub Leader Ca 1 không thể đánh giá đúng ca đêm vì không có mặt.

### Quyết định 4: Auto-flag abnormality
- NG Rate > 5% → chặn gửi duyệt (blocking)
- Downtime > 60 phút → cảnh báo nhưng không chặn
- OT bật mà không điền lý do → chặn gửi duyệt (blocking)

### Quyết định 5: Bulk Approval với Normal/Abnormal
Giảm thời gian phê duyệt cuối ca. "Chọn tất cả" chỉ chọn Normal. Abnormal phải tick thủ công.

### Quyết định 6: seedFromPlan từ Monthly Plan + IFS
Khi chọn Máy + Ngày, hệ thống tự điền Product, Target, Operator, Sub Leader. Operator chỉ cần nhập số liệu thực tế.

### Quyết định 7: Tablet-first UI
Operator nhập trực tiếp trên tablet tại shop floor. Number Wheel Picker + Time Picker tối ưu cho ngón tay.

### Quyết định 8: Đa ngôn ngữ VI/JA
Operator/Sub Leader người Việt → tiếng Việt. Section Manager/Chief/Director người Nhật → tiếng Nhật. Toggle ngay trên navbar.

## Deliverables đã tạo trong proposal/demo phase

1. **BA Document (.docx)** — phân tích nghiệp vụ, to-be design, process maps.
2. **Demo React App** (`demo-app/src/App.jsx` ~6500 dòng) — full workflow interactive.
3. **User Manual (.docx) v1, v2, v3** — hướng dẫn sử dụng tiếng Việt.
4. **Proposal slides (.pptx)** — cho buổi pitching đầu tiên.
5. **Monthly Plan Excel template** — cho Chief/Director nhập kế hoạch.

## Bài học áp dụng cho dự án tương tự

### Bài học 1: Không bắt đầu từ UI, bắt đầu từ team structure
Khi khách hàng nói "làm hệ thống báo cáo sản xuất", câu hỏi đầu tiên phải là:
- Có bao nhiêu bộ phận? Bao nhiêu ca? Bao nhiêu đội?
- Tổ trưởng có kiêm operator không?
- Phê duyệt theo ca hay theo toàn ngày?
- Số ngày tối đa được nhập lùi?

### Bài học 2: Per-shift approval không phải feature phụ
Đây là điểm khác biệt lớn với hệ thống cổ điển. Phải thiết kế data model và filter logic từ đầu. Sửa sau rất tốn.

### Bài học 3: Abnormality thresholds phải có tên trong code
Đừng hard-code 5% trong formula. Đặt thành constants `NG_THRESHOLD_PERCENT`, `DOWNTIME_THRESHOLD_MIN` ở đầu file để khách hàng dễ đổi khi phase 2.

### Bài học 4: Mock data phải sinh từ constants, không hard-code
`TEAMS_DEF` → `generateMockUsers()` → `generateMockReports()`. Khi khách yêu cầu "thêm 1 đội", chỉ thêm 1 dòng vào constant, không phải edit 40 chỗ.

### Bài học 5: Single-file App.jsx ổn cho demo < 8000 dòng
Không cần React Router, Redux, hay multi-file structure. Một file dễ grep, dễ review, dễ chia sẻ qua email. Khi dự án chính thức thì mới tách.

### Bài học 6: Vercel deployment cần Root Directory
Nếu `package.json` không ở repo root (demo nằm trong subfolder `demo-app/`), phải set Root Directory trong Vercel settings — nếu không build fail.

### Bài học 7: User Manual nên xuất từ docx-js, không viết tay
Dùng Node.js + docx-js để generate văn bản, bảng, header/footer, pagination. Khi demo thay đổi, rebuild manual nhanh.

### Bài học 8: Demo phải có kịch bản end-to-end
Đừng chỉ show từng màn hình rời. Viết kịch bản 9 bước:
1. Login Operator → 2. Tạo báo cáo → 3. Nhập NG cao → 4. Bị chặn → 5. Thêm note → 6. Submit → 7. Login Sub Leader → 8. Duyệt → 9. Login Chief → duyệt cấp 2.

### Bài học 9: Phải có i18n từ đầu
Nếu định thêm tiếng Nhật sau, code sẽ dính nhiều string hard-code VI. Tạo `translations = { vi, ja }` ngay từ phút đầu và dùng `t('key')` everywhere.

## Các "gotcha" cần tránh

- **Cross-midnight shift**: Ca 3 (22:00 → 06:00 hôm sau) dễ sai nếu không cẩn thận với math thời gian. Test kỹ.
- **Downtime ngoài ca**: validation cần chặn operator nhập downtime 05:00 cho Ca 1 (bắt đầu 06:00).
- **Hard-coded operator ID**: trong generate mock, tránh fallback `'op01'` — nếu refactor sau, ID không còn tồn tại.
- **Sub Leader không có machineId**: nếu quên gán, dropdown operator không có Sub Leader → Sub Leader không tự nhập được.
- **Auto-approve logic sai**: phải check cả `dept`, `shiftNumber`, `role === 'sub_leader'`, không chỉ `role`.
- **Bulk approval "select all" chọn Abnormal**: user sẽ bỏ qua ca bất thường. Chỉ select-all Normal.

## Ước tính effort (tham khảo)

| Hạng mục | Effort |
|---|---|
| BA + tài liệu proposal | 5 ngày |
| Demo React app (full workflow) | 15 ngày |
| User Manual docx v1/v2/v3 | 2 ngày × 3 bản |
| Deploy Vercel + test tablet | 1 ngày |
| Training Chief/Director dùng demo | 1 ngày |
| **Tổng proposal phase** | ~30 ngày (1 BA + 1 dev) |
