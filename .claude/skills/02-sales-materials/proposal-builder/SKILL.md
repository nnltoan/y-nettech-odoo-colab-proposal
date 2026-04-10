---
name: proposal-builder
description: Create professional project proposal documents in Word (.docx) format for software projects, consulting engagements, and service offerings. Use this skill when the user mentions 'proposal', 'đề xuất dự án', 'project proposal', 'tài liệu đề xuất', 'đề xuất giải pháp', 'bid document', 'RFP response', 'proposal docx', or wants to create a formal written proposal to win a client. Covers structure, tone, pricing tables, team introductions, timeline, scope of work, and closing CTAs. Combines with docx skill for file generation and with project-analysis skill when scope needs to be analyzed first.
---

# Proposal Builder Skill

Tạo **proposal chuyên nghiệp dạng Word (.docx)** để win khách hàng. Skill này tập trung vào **cấu trúc, nội dung và tone** của một proposal thắng thầu — không phải việc xử lý file docx cơ bản (cái đó dùng `docx` skill).

## Khi nào dùng skill này

Trigger khi user nói:
- "Tạo proposal cho dự án X"
- "Viết đề xuất dự án"
- "Soạn tài liệu đề xuất giải pháp"
- "Làm proposal để gửi khách hàng"
- "Phản hồi RFP"
- "Proposal docx / Word document"

**KHÔNG** dùng khi user muốn proposal đẹp dạng HTML để xuất PDF → dùng `proposal-html-pdf` skill.

## Thông tin cần thu thập trước khi viết

Hỏi user các câu hỏi sau (dùng AskUserQuestion tool):

1. **Khách hàng**: Tên công ty, ngành nghề, quy mô, người nhận proposal (CEO, PM, IT Director)?
2. **Dự án**: Tên dự án, mục tiêu kinh doanh (KHÔNG phải mục tiêu kỹ thuật), pain point chính?
3. **Phạm vi**: Đây là fixed-price hay time & material? Có scope rõ ràng chưa?
4. **Ngân sách & timeline**: Khung giá khách đã có? Deadline mong muốn?
5. **Độ dài**: Proposal ngắn (5-10 trang) hay chi tiết (20-40 trang)?
6. **Ngôn ngữ**: Tiếng Việt, tiếng Anh, hay song ngữ?
7. **Công ty phát proposal**: Tên, logo path, thông tin liên hệ?

## Cấu trúc chuẩn của Proposal

Một proposal thắng thầu thường có các section sau (theo thứ tự):

### 1. Cover Page
- Logo công ty (center hoặc top-right)
- Tên proposal: "Proposal for [Tên dự án] — Prepared for [Khách hàng]"
- Ngày phát hành, version
- Người chuẩn bị
- Confidentiality notice (nếu cần)

### 2. Cover Letter (1 trang)
Thư ngỏ cá nhân hoá, viết bởi account manager/sales. Ngắn gọn:
- Cảm ơn cơ hội
- Tóm tắt 2-3 điểm bạn hiểu về pain point của khách
- Câu chốt: tại sao công ty bạn là lựa chọn tốt
- Ký tên + contact

### 3. Executive Summary (1-2 trang) ⭐ QUAN TRỌNG NHẤT
Đây là section CEO khách hàng sẽ đọc đầu tiên và có thể là duy nhất. Phải:
- Mô tả ngắn gọn pain point (1 đoạn)
- Giải pháp đề xuất (1 đoạn)
- Key benefits/outcomes (3-5 bullet points — business metrics, không phải technical features)
- Estimated timeline & investment (con số cụ thể)
- Call-to-action (bước tiếp theo)

**Tip**: Viết Executive Summary CUỐI CÙNG sau khi đã hoàn thành các section khác.

### 4. Understanding of Requirements (2-3 trang)
Chứng minh bạn hiểu khách hàng:
- Bối cảnh business của khách hàng
- Pain points và challenges hiện tại
- Business objectives mà họ muốn đạt được
- Success criteria (KPIs)

### 5. Proposed Solution (3-8 trang)
Phần chính — giải pháp đề xuất:
- High-level architecture (kèm diagram)
- Key features/modules (chia theo phase nếu cần)
- Technology stack (với lý do chọn)
- Integration points với hệ thống hiện tại
- Non-functional requirements (performance, security, scalability)

### 6. Approach & Methodology (1-2 trang)
Cách bạn sẽ thực hiện:
- Development methodology (Agile/Scrum, Waterfall, Hybrid)
- Phases & milestones
- Communication plan (daily standup? weekly demo?)
- Quality assurance approach
- Risk management

### 7. Project Timeline (1-2 trang)
Gantt chart hoặc bảng timeline theo tuần/tháng:
- Phase 1: Discovery & Planning (tuần 1-2)
- Phase 2: Design (tuần 3-4)
- Phase 3: Development (tuần 5-12)
- Phase 4: Testing (tuần 13-14)
- Phase 5: Deployment & Training (tuần 15-16)
- Phase 6: Warranty & Support

### 8. Team Structure (1-2 trang)
Ai sẽ làm việc:
- Project Manager (bio ngắn, ảnh nếu có)
- Tech Lead
- Developers, Designers, QA
- Org chart đơn giản

### 9. Investment / Pricing (1-2 trang)
Bảng giá rõ ràng:
- Breakdown theo phase hoặc theo module
- Các gói tùy chọn (Basic / Standard / Premium)
- Payment schedule (thường 30/40/30 hoặc theo milestone)
- Thuế VAT, chi phí khác
- Điều kiện thanh toán

**Nếu cần báo giá chi tiết** → dùng thêm `quotation-builder` skill.

### 10. Why Choose Us (1-2 trang)
- Track record / case studies (links/summaries)
- Team expertise
- Company certifications
- Partnership & awards
- Testimonials từ khách hàng cũ

### 11. Assumptions & Constraints (0.5 trang)
Liệt kê những gì bạn assume:
- "Khách hàng cung cấp tài khoản AWS"
- "API documentation có sẵn từ tuần 2"
- "Final design được approve trong vòng 5 ngày làm việc"

### 12. Terms & Conditions (0.5-1 trang)
Tóm tắt terms chính. Hợp đồng chi tiết sẽ ký sau.

### 13. Next Steps / CTA (0.5 trang)
- Timeline ký hợp đồng
- Discovery meeting proposal
- Contact info

### 14. Appendix (tùy chọn)
- Detailed technical specs
- Full team bios
- Extended case studies
- Company profile

## Tone & Style

- **Confident, không arrogant**: "Chúng tôi sẽ triển khai..." thay vì "Chúng tôi hy vọng có thể..."
- **Business-first**: Mô tả theo business outcome, không theo technical feature
- **Khách hàng làm trung tâm**: Dùng "Quý công ty" và "chúng tôi" — nhiều "Quý công ty" hơn "chúng tôi"
- **Cụ thể**: Số liệu, % cải thiện, thời gian, thay vì từ chung chung
- **Ngắn gọn**: Mỗi đoạn không quá 4 câu. Dùng bullet points khi có thể

## Workflow khi tạo proposal

1. **Đọc `docx` skill trước** — `/sessions/eager-confident-dijkstra/mnt/.claude/skills/docx/SKILL.md`
2. Hỏi user các thông tin cần thiết (xem phần "Thông tin cần thu thập")
3. Nếu scope chưa rõ → suggest dùng `project-analysis` skill trước
4. Tạo outline proposal theo cấu trúc chuẩn, adjust theo yêu cầu
5. Viết từng section một, review với user sau mỗi section lớn
6. Tạo file docx với formatting chuyên nghiệp (header/footer, page numbers, TOC)
7. Insert logos, team photos, diagrams nếu có
8. Generate PDF preview nếu cần
9. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link

## Các lỗi thường gặp cần tránh

- **Quá technical**: Khách hàng cấp C-level không care về tech stack cụ thể
- **Too generic**: "Chúng tôi có nhiều năm kinh nghiệm" — vô nghĩa. Dùng con số
- **Không có CTA rõ ràng**: Phải nói rõ bước tiếp theo
- **Pricing mơ hồ**: Con số phải cụ thể, tránh "từ 10k USD"
- **Sai tên khách hàng**: Check 3 lần tên công ty, người nhận
- **Copy template cứng**: Mỗi proposal phải custom cho khách đó

## Templates có sẵn

Khi user yêu cầu template, hãy generate proposal với các phong cách:
- **Modern/Clean**: Ít màu, nhiều whitespace, sans-serif (Inter, Roboto)
- **Corporate/Formal**: Màu navy, serif headers, layout cổ điển
- **Creative/Bold**: Màu accent mạnh, typography lớn, cho agency/creative
- **DanaExperts branded**: Dùng màu và logo của DanaExperts (xem trong `08-danaexperts-pitching/`)
