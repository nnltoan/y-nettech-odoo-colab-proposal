---
name: contract-builder
description: Create professional service agreements, contracts, and statements of work (SOW) for software projects and consulting engagements. Use this skill when the user mentions 'hợp đồng', 'contract', 'thỏa thuận', 'service agreement', 'SOW', 'statement of work', 'MSA', 'master services agreement', 'hợp đồng dự án phần mềm', 'legal document', 'IP agreement', or 'NDA'. Supports Vietnamese contract law conventions, bilingual contracts (VN-EN), IP clauses, payment terms, warranty, liability, and termination. Always recommends lawyer review before final signing.
---

# Contract Builder Skill

Tạo **hợp đồng dự án phần mềm / dịch vụ** theo chuẩn Việt Nam hoặc quốc tế. Skill này cung cấp template và hướng dẫn các điều khoản cần có, **KHÔNG thay thế luật sư** — luôn khuyên user consult luật sư trước khi ký.

## ⚠️ Lưu ý quan trọng về pháp lý

**LUÔN nhắc user:**
> "Đây là template tham khảo. Trước khi ký hợp đồng chính thức, vui lòng cho luật sư review, đặc biệt các điều khoản về IP, bồi thường, giải quyết tranh chấp và luật áp dụng."

Skill này KHÔNG cung cấp legal advice. Chỉ giúp tạo template dựa trên các điều khoản chuẩn của ngành.

## Khi nào dùng

Trigger khi user nói:
- "Tạo hợp đồng dự án"
- "Viết contract cho khách hàng"
- "Soạn SOW"
- "Cần MSA template"
- "Hợp đồng phát triển phần mềm"
- "Service agreement"
- "NDA"

## Các loại hợp đồng phổ biến

### 1. Service Agreement / Hợp đồng dịch vụ (đơn giản)
Phù hợp cho dự án 1 lần, scope rõ ràng. Khoảng 5-10 trang.

### 2. Master Services Agreement (MSA)
Cho quan hệ dài hạn, nhiều SOW. MSA chứa terms chung, mỗi SOW là một phụ lục dự án cụ thể. Khoảng 15-25 trang.

### 3. Statement of Work (SOW)
Phụ lục của MSA, mô tả dự án cụ thể: scope, deliverables, timeline, price.

### 4. NDA (Non-Disclosure Agreement)
Thỏa thuận bảo mật, ký trước khi share thông tin dự án.

### 5. IP Assignment Agreement
Chuyển giao quyền sở hữu trí tuệ khi dự án hoàn thành.

## Thông tin cần thu thập

1. **Loại hợp đồng**: Service Agreement / MSA + SOW / NDA / IP Assignment?
2. **Các bên**:
   - Bên A (khách hàng): Tên công ty, địa chỉ, người đại diện, chức vụ, MST
   - Bên B (nhà cung cấp): Tên công ty, địa chỉ, người đại diện, chức vụ, MST
3. **Ngôn ngữ**: Tiếng Việt / Tiếng Anh / Song ngữ?
4. **Luật áp dụng**: Luật Việt Nam / Singapore / US state?
5. **Phạm vi công việc**: Mô tả sản phẩm/dịch vụ
6. **Timeline**: Ngày bắt đầu, ngày kết thúc, milestones
7. **Giá trị hợp đồng**: Tổng tiền, currency, payment schedule
8. **IP**: Ai sở hữu code/design sau khi dự án xong?
9. **Warranty**: Thời gian bảo hành
10. **Liability cap**: Giới hạn bồi thường

## Cấu trúc Service Agreement (chuẩn VN)

```
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
────────────────────

HỢP ĐỒNG DỊCH VỤ PHÁT TRIỂN PHẦN MỀM
Số: [số hợp đồng]

Hôm nay, ngày [DD] tháng [MM] năm [YYYY], tại [địa điểm],

CHÚNG TÔI GỒM:

BÊN A (KHÁCH HÀNG):
Tên: ...
Địa chỉ: ...
Mã số thuế: ...
Đại diện: ...
Chức vụ: ...
Điện thoại: ...
Email: ...

BÊN B (NHÀ CUNG CẤP):
Tên: ...
Địa chỉ: ...
Mã số thuế: ...
Đại diện: ...
Chức vụ: ...

Hai bên thống nhất ký kết hợp đồng với các điều khoản sau:

ĐIỀU 1. NỘI DUNG CÔNG VIỆC
[Mô tả chi tiết scope]

ĐIỀU 2. THỜI GIAN THỰC HIỆN
Bên B cam kết hoàn thành công việc trong thời gian [X] tháng, kể từ ngày [date].
Timeline chi tiết theo phụ lục 1.

ĐIỀU 3. GIÁ TRỊ HỢP ĐỒNG
Tổng giá trị: [số tiền] VND/USD (đã/chưa bao gồm VAT)
(Bằng chữ: ...)

ĐIỀU 4. PHƯƠNG THỨC THANH TOÁN
- Đợt 1: 30% sau khi ký hợp đồng
- Đợt 2: 40% sau khi hoàn thành phase X
- Đợt 3: 30% sau khi nghiệm thu cuối
Hình thức: Chuyển khoản ngân hàng.
Tài khoản: ...

ĐIỀU 5. TRÁCH NHIỆM CỦA BÊN A
- Cung cấp đầy đủ tài liệu, thông tin cần thiết
- Nghiệm thu và phản hồi trong vòng [X] ngày
- Thanh toán đúng hạn
- Cung cấp môi trường test/production nếu cần

ĐIỀU 6. TRÁCH NHIỆM CỦA BÊN B
- Thực hiện công việc theo đúng scope và timeline
- Đảm bảo chất lượng theo yêu cầu kỹ thuật
- Bảo mật thông tin của Bên A
- Chuyển giao toàn bộ sản phẩm sau khi nghiệm thu

ĐIỀU 7. QUYỀN SỞ HỮU TRÍ TUỆ
Toàn bộ source code, tài liệu, thiết kế do Bên B phát triển theo hợp đồng này
sẽ thuộc sở hữu của Bên A sau khi Bên A thanh toán đủ 100% giá trị hợp đồng.
Bên B được quyền sử dụng kinh nghiệm và know-how có được từ dự án cho các
dự án khác không cạnh tranh trực tiếp.

ĐIỀU 8. BẢO MẬT
Hai bên cam kết giữ bí mật tất cả thông tin kinh doanh, kỹ thuật của bên kia
được biết trong quá trình thực hiện hợp đồng, kể cả sau khi hợp đồng chấm dứt.
Thời hạn bảo mật: [X] năm.

ĐIỀU 9. BẢO HÀNH
Bên B bảo hành sản phẩm trong vòng [X] tháng kể từ ngày nghiệm thu cuối.
Phạm vi bảo hành: sửa lỗi phần mềm do Bên B phát triển.
KHÔNG bao gồm: thay đổi yêu cầu, bug do môi trường khách hàng, third-party.

ĐIỀU 10. THAY ĐỔI YÊU CẦU (CHANGE REQUEST)
Mọi thay đổi scope phải được lập bằng văn bản và ký xác nhận bởi hai bên.
Bên B sẽ báo giá bổ sung cho các change request.

ĐIỀU 11. CHẤM DỨT HỢP ĐỒNG
Hợp đồng có thể chấm dứt trong các trường hợp:
- Hai bên thỏa thuận
- Một bên vi phạm nghiêm trọng nghĩa vụ
- Sự kiện bất khả kháng kéo dài > 30 ngày
Bên chấm dứt phải thông báo trước ít nhất [X] ngày.

ĐIỀU 12. BỒI THƯỜNG THIỆT HẠI
Mức bồi thường tối đa không vượt quá tổng giá trị hợp đồng.
Không bao gồm thiệt hại gián tiếp, mất lợi nhuận, mất dữ liệu.

ĐIỀU 13. BẤT KHẢ KHÁNG
Các sự kiện bất khả kháng (thiên tai, dịch bệnh, chiến tranh, lệnh chính phủ)
không cấu thành vi phạm hợp đồng.

ĐIỀU 14. GIẢI QUYẾT TRANH CHẤP
Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng.
Nếu không thành, sẽ được giải quyết tại [Tòa án / Trọng tài VIAC] theo
luật Việt Nam.

ĐIỀU 15. ĐIỀU KHOẢN CHUNG
- Hợp đồng có hiệu lực từ ngày ký
- Hợp đồng lập thành [X] bản, mỗi bên giữ [X] bản, có giá trị pháp lý như nhau
- Các phụ lục kèm theo là một phần không thể tách rời của hợp đồng

ĐẠI DIỆN BÊN A                    ĐẠI DIỆN BÊN B
(Ký, họ tên, đóng dấu)           (Ký, họ tên, đóng dấu)


PHỤ LỤC 1: SCOPE OF WORK CHI TIẾT
[...]

PHỤ LỤC 2: TIMELINE CHI TIẾT
[...]

PHỤ LỤC 3: YÊU CẦU KỸ THUẬT
[...]
```

## Cấu trúc Service Agreement (chuẩn quốc tế - English)

```
SOFTWARE DEVELOPMENT SERVICES AGREEMENT

This Software Development Services Agreement ("Agreement") is entered into
as of [Date] ("Effective Date") by and between:

CLIENT: [Name], a company organized under the laws of [Jurisdiction],
with address at [Address] ("Client")

SERVICE PROVIDER: [Name], a company organized under the laws of [Jurisdiction],
with address at [Address] ("Provider")

(each a "Party" and collectively the "Parties")

1. SERVICES
Provider shall provide the software development services described in Exhibit A
("Services") in accordance with the terms of this Agreement.

2. DELIVERABLES
Provider shall deliver the items listed in Exhibit B ("Deliverables") according
to the schedule set forth therein.

3. FEES AND PAYMENT
3.1 Fees. Client shall pay Provider the fees set forth in Exhibit C.
3.2 Payment Terms. Invoices are due within [30] days of receipt.
3.3 Late Payment. Overdue amounts bear interest at [1.5]% per month.
3.4 Taxes. Fees exclude applicable taxes, which Client shall bear.

4. INTELLECTUAL PROPERTY
4.1 Work Product. Upon full payment, all deliverables become the
exclusive property of Client.
4.2 Pre-existing IP. Provider retains ownership of its pre-existing tools,
libraries, and know-how used in the Services.
4.3 License to Pre-existing IP. Provider grants Client a perpetual, worldwide,
royalty-free license to use Provider's pre-existing IP incorporated into
the deliverables.

5. CONFIDENTIALITY
Each Party shall maintain the confidentiality of the other Party's
confidential information for [3] years after termination.

6. WARRANTY
Provider warrants that the deliverables will conform to specifications
for [90] days after delivery. Provider's sole obligation is to correct
non-conformities.

7. LIMITATION OF LIABILITY
EXCEPT FOR BREACH OF CONFIDENTIALITY OR IP INFRINGEMENT, EACH PARTY'S
LIABILITY IS LIMITED TO THE FEES PAID UNDER THIS AGREEMENT. NEITHER
PARTY IS LIABLE FOR INDIRECT, CONSEQUENTIAL, OR LOST PROFITS.

8. TERM AND TERMINATION
This Agreement commences on the Effective Date and continues until
the Services are completed. Either party may terminate for material breach
with [30] days' written notice.

9. FORCE MAJEURE
Neither Party is liable for delays caused by events beyond its reasonable
control (natural disasters, pandemics, government actions, etc.).

10. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement is governed by the laws of [Jurisdiction]. Disputes
shall be resolved by [arbitration at SIAC / courts of Ho Chi Minh City].

11. GENERAL PROVISIONS
11.1 Entire Agreement
11.2 Amendments in writing
11.3 Assignment (no assignment without consent)
11.4 Notices
11.5 Severability

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the
Effective Date.

CLIENT: _________________        PROVIDER: _________________
Name:                            Name:
Title:                           Title:
Date:                            Date:
```

## Template NDA (ngắn gọn)

```
MUTUAL NON-DISCLOSURE AGREEMENT

This NDA is entered into on [date] between [Party A] and [Party B].

1. CONFIDENTIAL INFORMATION means any non-public information disclosed
by one Party to the other, whether in oral, written, or electronic form.

2. OBLIGATIONS. Each Party agrees to:
   (a) maintain strict confidentiality;
   (b) use Confidential Information solely for evaluating potential
       business relationships;
   (c) not disclose to third parties without prior written consent.

3. EXCEPTIONS. This NDA does not apply to information that:
   (a) is publicly available;
   (b) was known before disclosure;
   (c) is independently developed;
   (d) must be disclosed by law.

4. TERM. Obligations continue for [2] years from the date of disclosure.

5. RETURN OF INFORMATION. Upon request, each Party shall return or destroy
all Confidential Information.

6. NO LICENSE. No license or rights are granted except as expressly stated.

7. GOVERNING LAW. [Jurisdiction].

Signatures: _______________
```

## Điều khoản đặc biệt cần lưu ý

### IP Clauses (quan trọng nhất)
- **Work-for-hire**: Code viết theo hợp đồng thuộc về khách
- **Background IP**: Tool, library, framework nhà cung cấp dùng trước đó — giữ quyền sở hữu
- **Open source**: Nêu rõ dùng MIT/Apache... có thể không transfer được

### Payment milestones
- Không bao giờ làm 100% sau khi xong — rủi ro cao
- Tiêu chuẩn: 30/40/30 hoặc 40/30/30
- Rush project: 50/50 hoặc 100% advance

### Liability cap
- Mức chuẩn: = tổng giá trị hợp đồng
- Tránh unlimited liability (nguy hiểm)
- Exclude indirect damages, loss of profits

### Termination
- Termination for convenience: bên nào cũng được terminate với X ngày notice
- Termination for cause: khi bên kia vi phạm nghiêm trọng
- Cần rõ: sau termination, bên A trả tiền cho công việc đã làm? Code đã viết thuộc về ai?

## Workflow chuẩn

1. **CẢNH BÁO user trước**: Template chỉ tham khảo, cần luật sư review
2. Đọc `docx` skill — `/sessions/eager-confident-dijkstra/mnt/.claude/skills/docx/SKILL.md`
3. Hỏi user các thông tin cần thiết (10 câu hỏi ở trên)
4. Chọn template phù hợp (VN / EN / Song ngữ)
5. Fill in thông tin các bên, scope, giá
6. Highlight các điều khoản user cần review kỹ (IP, liability, termination)
7. Tạo file docx với format chuẩn
8. Generate PDF preview
9. Save và share với user + nhắc lại: **cần luật sư review**

## Red flags cần warn user

Nếu user muốn các điều khoản sau, CẢNH BÁO:
- **"Unlimited liability"** → rủi ro pháp lý cao
- **"100% payment after delivery"** → rủi ro không thu được tiền
- **"No warranty, as-is"** → khách hàng không chấp nhận
- **"Client owns all IP including pre-existing"** → mất know-how
- **"Termination without cause, no payment for work done"** → không fair
- **"Exclusive work for X months"** → ảnh hưởng kinh doanh

Luôn suggest các điều khoản cân bằng, fair cho cả 2 bên.

---

# Patterns từ hợp đồng IT Outsourcing thực tế (Enterprise-grade)

Các pattern bên dưới được chưng cất từ một hợp đồng phát triển phần mềm trị giá 520 triệu VND giữa một client Việt Nam và DanaExperts. Dùng cho **enterprise deals**, dự án có **nhiều workstream song song** (dev mới + maintenance + warranty), hoặc client có legal team khắt khe.

## 1. Contract number format chuẩn VN

```
Số: [STT]/HĐPTPM/[YEAR]/[CLIENT_CODE]-[VENDOR_CODE]
Ví dụ: 001/HĐPTPM/2026/QT-DE
```
- **HĐPTPM** = Hợp đồng phát triển phần mềm
- **HĐDV** = Hợp đồng dịch vụ
- **HĐMSA** = Master Services Agreement
- Client code / Vendor code là 2-4 ký tự

## 2. Multi-workstream contract pattern

Khi dự án có **nhiều dòng công việc song song**, structure Điều 1 (Phạm vi) như sau:

```
ĐIỀU 1. PHẠM VI CÔNG VIỆC

1.1 Bên B thực hiện đồng thời ba (03) dòng công việc:

(a) PHÁT TRIỂN MỚI (New Development)
    Phát triển các module/tính năng mới theo đặc tả tại Phụ lục A.
    Deliverables: source code, tài liệu kỹ thuật, unit test, user manual.

(b) DUY TRÌ & NÂNG CẤP HỆ THỐNG HIỆN HỮU (Legacy Maintenance)
    Tiếp nhận, vận hành, sửa lỗi, nâng cấp hệ thống đang chạy.
    Deliverables: báo cáo vận hành hàng tuần, patch/release theo yêu cầu.

(c) BẢO HÀNH SAU NGHIỆM THU (Post-Acceptance Warranty)
    Bảo hành các module đã nghiệm thu theo SLA tại Điều 9.
    Deliverables: hotfix trong thời gian cam kết.

1.2 Ba dòng công việc trên diễn ra song song trong thời gian hiệu lực
    của hợp đồng, không loại trừ lẫn nhau.
```

**Lưu ý**: Pattern này chỉ dùng khi client thực sự cần cả 3. Không cần thiết phải complex nếu chỉ có 1 workstream.

## 3. SLA Tiers (P1-P4) — template chuẩn

Đưa vào phần Trách nhiệm Bên B hoặc Phụ lục riêng:

```
PHỤ LỤC: MỨC ĐỘ DỊCH VỤ (SLA)

Bên B cam kết response time và resolution time theo mức độ ưu tiên
của sự cố như sau:

┌────────┬─────────────────────────┬──────────────┬───────────────┐
│ Mức    │ Mô tả                   │ Response     │ Resolution    │
├────────┼─────────────────────────┼──────────────┼───────────────┤
│ P1     │ Critical — toàn hệ      │ ≤ 01 giờ     │ ≤ 04 giờ      │
│ Urgent │ thống không hoạt động,  │              │               │
│        │ ảnh hưởng business      │              │               │
│        │ continuity              │              │               │
├────────┼─────────────────────────┼──────────────┼───────────────┤
│ P2     │ High — chức năng chính  │ ≤ 02 giờ     │ ≤ 01 ngày     │
│ High   │ lỗi, có workaround      │              │  làm việc     │
├────────┼─────────────────────────┼──────────────┼───────────────┤
│ P3     │ Medium — chức năng phụ  │ ≤ 04 giờ     │ ≤ 03 ngày     │
│ Medium │ lỗi, không block        │              │  làm việc     │
│        │ business                │              │               │
├────────┼─────────────────────────┼──────────────┼───────────────┤
│ P4     │ Low — cosmetic, gợi ý   │ ≤ 08 giờ     │ ≤ 05 ngày     │
│ Low    │ cải tiến                │  làm việc    │  làm việc     │
└────────┴─────────────────────────┴──────────────┴───────────────┘

Thời gian làm việc: 08:30 – 17:30, Thứ Hai đến Thứ Sáu (trừ P1 — 24/7).

PHẠT VI PHẠM SLA (áp dụng cho resolution time):
- Vượt ≤ 50% thời gian cam kết: khấu trừ 5% phí SLA tháng đó
- Vượt 50% – 100%: khấu trừ 10%
- Vượt > 100%: khấu trừ 15%

Tổng mức khấu trừ/tháng tối đa: 15% phí SLA tháng đó.
```

## 4. Escalation Matrix (4-level)

```
PHỤ LỤC: QUY TRÌNH ESCALATION

Khi sự cố không được xử lý đúng SLA, vấn đề được leo thang theo 4 cấp:

Level 1 — PROJECT LEVEL
  Bên A: Project Manager
  Bên B: Project Manager / Tech Lead
  Xử lý: vấn đề kỹ thuật, scope nhỏ, communication hàng ngày
  Timebox: 24 giờ

Level 2 — DEPARTMENT LEVEL
  Bên A: Department Head / CTO
  Bên B: Delivery Manager
  Xử lý: SLA bị vi phạm, resource shortage, blocker kỹ thuật lớn
  Timebox: 48 giờ

Level 3 — EXECUTIVE LEVEL
  Bên A: COO / Managing Director
  Bên B: Director of Operations
  Xử lý: vi phạm hợp đồng, xung đột về scope/payment
  Timebox: 72 giờ

Level 4 — LEGAL / TERMINATION
  Bên A: CEO + Legal
  Bên B: CEO + Legal
  Xử lý: tranh chấp nghiêm trọng, chuẩn bị chấm dứt hợp đồng
  Action: thương lượng → Tòa án theo Điều [X]
```

## 5. Payment milestones với trigger events cụ thể

Đừng viết "30% sau khi ký", hãy gắn payment vào **sự kiện đo đếm được**:

```
ĐIỀU 4. GIÁ TRỊ VÀ PHƯƠNG THỨC THANH TOÁN

4.1 Tổng giá trị hợp đồng: [số] VND (đã bao gồm VAT 10%)
    (Bằng chữ: [...])

4.2 Lịch thanh toán:

ĐỢT 1 — 30% — Tạm ứng khởi động
  Trigger: Sau khi ký hợp đồng VÀ Bên B nhận được đầy đủ tài liệu
  khởi động tại Phụ lục B (access môi trường, credentials, spec cuối).
  Số tiền: [...] VND
  Hạn thanh toán: trong vòng 07 ngày làm việc kể từ ngày trigger.

ĐỢT 2 — 40% — Mốc giữa kỳ
  Trigger: Sau khi Bên B hoàn thành và Bên A nghiệm thu ĐẠT các module:
    (a) [Module X]
    (b) [Module Y]
  theo tiêu chí tại Phụ lục C, và Biên bản nghiệm thu được ký bởi cả 2 bên.
  Số tiền: [...] VND
  Hạn thanh toán: trong vòng 10 ngày làm việc kể từ ngày ký Biên bản.

ĐỢT 3 — 30% — Nghiệm thu cuối cùng
  Trigger: Sau khi Bên B hoàn thành toàn bộ scope và Biên bản nghiệm thu
  cuối cùng được ký. Bên A xác nhận không còn lỗi P1/P2 tồn đọng.
  Số tiền: [...] VND
  Hạn thanh toán: trong vòng 15 ngày làm việc kể từ ngày ký Biên bản.

4.3 Phạt thanh toán trễ (áp dụng cho Bên A):
    - Trễ ≤ 07 ngày: nhắc nhở bằng email
    - Trễ 08 – 15 ngày: Bên B có quyền TẠM DỪNG công việc
    - Trễ 16 – 30 ngày: lãi suất 0.05%/ngày trên số tiền trễ
    - Trễ > 30 ngày: Bên B có quyền đơn phương CHẤM DỨT hợp đồng
      và yêu cầu thanh toán toàn bộ công việc đã hoàn thành.

4.4 Phạt giao hàng trễ (áp dụng cho Bên B):
    - Trễ ≤ 01 tuần: nhắc nhở
    - Trễ > 01 tuần: phạt 0.5% giá trị hợp đồng / tuần trễ
    - Mức phạt tối đa: 08% tổng giá trị hợp đồng
    - Trễ > 16 tuần: Bên A có quyền CHẤM DỨT hợp đồng
```

## 6. Liability cap với Exceptions

Quan trọng: **exceptions là phần nhiều client bỏ qua**. Đừng để cap bao phủ mọi trường hợp:

```
ĐIỀU 12. GIỚI HẠN BỒI THƯỜNG

12.1 Trừ các trường hợp ngoại lệ tại Điều 12.2, tổng trách nhiệm bồi thường
     của mỗi bên theo hợp đồng này KHÔNG VƯỢT QUÁ:
     (a) Tổng giá trị hợp đồng (trong thời gian thực hiện); hoặc
     (b) 50% tổng giá trị hợp đồng (trong thời gian bảo hành).

12.2 Giới hạn tại Điều 12.1 KHÔNG áp dụng trong các trường hợp:
     (a) Cố ý vi phạm hoặc sơ suất nghiêm trọng (gross negligence);
     (b) Vi phạm nghĩa vụ bảo mật (Điều 8);
     (c) Vi phạm quyền sở hữu trí tuệ của bên thứ ba;
     (d) Các thiệt hại do sự cố bảo mật (security breach) do lỗi của Bên B;
     (e) Các trường hợp pháp luật không cho phép giới hạn trách nhiệm.

12.3 Không bên nào chịu trách nhiệm về các thiệt hại gián tiếp, thiệt hại
     hệ quả, mất lợi nhuận kỳ vọng, hoặc mất cơ hội kinh doanh, trừ khi
     có hành vi cố ý.
```

## 7. Security Incident Notification (24h/72h rule)

Điều khoản này ngày càng quan trọng do compliance (GDPR-like):

```
ĐIỀU [X]. SỰ CỐ BẢO MẬT

[X].1 "Sự cố bảo mật" bao gồm nhưng không giới hạn ở: data breach,
      unauthorized access, ransomware, mã độc, leak credentials,
      hoặc bất kỳ sự kiện nào ảnh hưởng đến tính bảo mật, toàn vẹn,
      khả dụng của hệ thống/dữ liệu của Bên A.

[X].2 Khi phát hiện sự cố bảo mật, bên phát hiện phải:
      (a) THÔNG BÁO sơ bộ cho bên kia qua email + điện thoại trong
          vòng 24 GIỜ kể từ khi phát hiện;
      (b) CUNG CẤP báo cáo chi tiết trong vòng 72 GIỜ, bao gồm:
          - Thời điểm xảy ra và thời điểm phát hiện
          - Phạm vi ảnh hưởng (dữ liệu, người dùng bị ảnh hưởng)
          - Nguyên nhân ban đầu
          - Biện pháp mitigation đã thực hiện
          - Kế hoạch khắc phục và ngăn ngừa tái diễn
      (c) HỢP TÁC toàn diện trong quá trình điều tra.

[X].3 Chi phí khắc phục sự cố do bên gây ra sự cố chịu, kể cả:
      - Chi phí thông báo cho người dùng bị ảnh hưởng
      - Chi phí audit bảo mật độc lập
      - Tiền phạt từ cơ quan quản lý (nếu có)
```

## 8. No-Poaching / Non-Solicitation (mutual)

```
ĐIỀU [X]. KHÔNG CHIÊU MỘ NHÂN SỰ

[X].1 Trong thời gian thực hiện hợp đồng và 12 THÁNG sau khi hợp đồng
      chấm dứt, mỗi bên cam kết KHÔNG trực tiếp hoặc gián tiếp tuyển dụng,
      chiêu mộ, hoặc ký hợp đồng với bất kỳ nhân viên nào của bên kia
      đã tham gia vào dự án theo hợp đồng này.

[X].2 Ngoại lệ: nhân viên đã tự nguyện nghỉ việc ≥ 06 tháng,
      hoặc được bên kia đồng ý bằng văn bản.

[X].3 Vi phạm điều khoản này: bên vi phạm trả phí bồi thường tương đương
      12 THÁNG lương của nhân viên bị chiêu mộ.
```

## 9. Independent Contractor Status

Quan trọng để tránh bị coi là quan hệ lao động (đặc biệt khi outsource cho cá nhân):

```
ĐIỀU [X]. TƯ CÁCH NHÀ THẦU ĐỘC LẬP

[X].1 Bên B là nhà thầu độc lập. Không có điều khoản nào trong hợp đồng
      này tạo ra quan hệ lao động, đại diện, đối tác, hoặc liên doanh
      giữa hai bên.

[X].2 Nhân viên của Bên B không phải là nhân viên của Bên A và không được
      hưởng bất kỳ quyền lợi lao động nào từ Bên A (lương, bảo hiểm, nghỉ
      phép, thưởng...).

[X].3 Bên B tự chịu trách nhiệm về:
      (a) Lương và quyền lợi của nhân viên Bên B;
      (b) Thuế thu nhập cá nhân của nhân viên Bên B;
      (c) Bảo hiểm xã hội, y tế, thất nghiệp của nhân viên Bên B;
      (d) An toàn lao động.

[X].4 Bên B có toàn quyền quyết định cách thức, phương pháp, công cụ
      thực hiện công việc, miễn sao đạt được kết quả cam kết.

[X].5 Bên B không đại diện cho Bên A trong bất kỳ giao dịch nào với
      bên thứ ba, trừ khi có ủy quyền bằng văn bản.
```

## 10. Force Majeure — 60-day termination right

```
ĐIỀU [X]. SỰ KIỆN BẤT KHẢ KHÁNG

[X].1 "Sự kiện bất khả kháng" là sự kiện khách quan, không thể lường trước
      và không thể khắc phục dù đã áp dụng mọi biện pháp cần thiết, bao gồm:
      thiên tai, dịch bệnh, chiến tranh, bạo động, lệnh chính phủ cấm hoặc
      hạn chế, sự cố cơ sở hạ tầng internet/điện diện rộng.

[X].2 KHÔNG được coi là bất khả kháng: thiếu resource, lỗi đội ngũ của
      một bên, vấn đề tài chính nội bộ, lỗi của nhà cung cấp thứ ba.

[X].3 Bên bị ảnh hưởng phải thông báo cho bên kia trong 07 ngày và cung
      cấp bằng chứng (giấy xác nhận của cơ quan có thẩm quyền nếu có).

[X].4 Thời hạn thực hiện hợp đồng sẽ được gia hạn tương ứng.

[X].5 Nếu sự kiện bất khả kháng kéo dài trên 60 NGÀY, một trong hai bên
      có quyền đơn phương chấm dứt hợp đồng bằng văn bản mà không phải
      bồi thường. Các khoản đã thanh toán cho công việc đã hoàn thành
      không được hoàn trả.
```

## 11. Data Return on Termination

```
ĐIỀU [X]. CHẤM DỨT VÀ BÀN GIAO

[X].1 Trong vòng 07 NGÀY LÀM VIỆC kể từ ngày chấm dứt hợp đồng, Bên B phải:
      (a) Trả lại toàn bộ dữ liệu, tài liệu, credentials của Bên A;
      (b) Bàn giao source code, documentation, build artifacts;
      (c) Xóa toàn bộ dữ liệu Bên A khỏi hệ thống của Bên B (trừ bản
          lưu trữ bắt buộc theo luật);
      (d) Cung cấp Biên bản xác nhận đã xóa/bàn giao.

[X].2 Bên A có nghĩa vụ thanh toán cho toàn bộ công việc đã hoàn thành
      và nghiệm thu trước ngày chấm dứt.
```

## 12. Acceptance Record template (Phụ lục E / Biên bản nghiệm thu)

Đây là phụ lục gần như bắt buộc cho dự án Việt Nam. Template:

```
BIÊN BẢN NGHIỆM THU
Số: [số]/BBNT/[năm]/[client]-[vendor]

Căn cứ Hợp đồng số [...] ký ngày [...] giữa:
- Bên A: [tên]
- Bên B: [tên]

Hôm nay, ngày [DD/MM/YYYY], tại [địa điểm], hai bên tiến hành nghiệm thu:

1. ĐỐI TƯỢNG NGHIỆM THU
   Module / Tính năng / Deliverable: [...]
   Phiên bản: [...]
   Thuộc Đợt thanh toán: [Đợt 1 / Đợt 2 / Đợt 3]

2. TIÊU CHÍ NGHIỆM THU
   Theo Phụ lục C của hợp đồng, bao gồm:
   □ Functional requirements đạt (checklist attached)
   □ Non-functional (performance, security) đạt
   □ Unit test coverage ≥ [X]%
   □ Không còn lỗi P1, P2
   □ User manual / API doc đầy đủ
   □ Source code đã được bàn giao lên Git

3. KẾT QUẢ KIỂM TRA
   □ Test 1: [mô tả] — PASS / FAIL
   □ Test 2: [mô tả] — PASS / FAIL
   [...]

4. KẾT LUẬN
   □ ĐẠT — nghiệm thu hoàn toàn, Bên A tiếp nhận và kích hoạt thanh toán đợt [X]
   □ ĐẠT CÓ ĐIỀU KIỆN — nghiệm thu với các điểm lưu ý cần khắc phục:
     - Điểm 1: [...] — deadline: [...]
     - Điểm 2: [...] — deadline: [...]
   □ KHÔNG ĐẠT — phải chỉnh sửa và nghiệm thu lại:
     - Lý do: [...]
     - Ngày tái nghiệm thu dự kiến: [...]

5. GHI CHÚ KHÁC
   [...]

6. CAM KẾT
   Biên bản này là cơ sở để thanh toán theo Điều 4 của hợp đồng.

ĐẠI DIỆN BÊN A                    ĐẠI DIỆN BÊN B
(Ký, họ tên, đóng dấu)           (Ký, họ tên, đóng dấu)
```

## 13. Checklist các phụ lục cần có cho contract enterprise

| Phụ lục | Nội dung |
|---------|----------|
| A       | Đặc tả hệ thống / Spec chi tiết |
| B       | Điều kiện bàn giao khởi động (access, credentials, tài liệu) |
| C       | Tiêu chí nghiệm thu (chi tiết từng module) |
| D       | Thông tin thanh toán (bank account, hoá đơn) |
| E       | Biên bản nghiệm thu — template |
| F       | Quy trình báo cáo và xử lý sự cố + escalation matrix |
| G       | SLA tiers (P1-P4) và bảng phạt |
| H       | Change Request process & template |
| I       | Danh sách nhân sự key của cả 2 bên |

## 14. Contract drafting workflow (enterprise)

1. **Discovery call với legal/procurement của client**: hiểu các điều khoản bắt buộc của họ
2. Dựng **cấu trúc 15 điều** từ template ở trên
3. **Fill Điều 1 (Phạm vi)** kỹ nhất — đây là phần hay bị dispute nhất
4. **Draft SLA** phụ lục (nếu có component maintenance/support)
5. **Tính liability cap** dựa trên contract value — đề xuất 100% contract value là balanced
6. **Review với nội bộ** trước khi gửi client
7. **Track changes** trong Word version để client legal team dễ review
8. **Redline 2-3 vòng** là bình thường cho enterprise contract
9. Ký **04 bản gốc** (2 cho mỗi bên) — theo thông lệ VN

## 15. Cảnh báo bổ sung về "gotchas"

- **"Không giới hạn số lượng change request"** trong scope → nguy hiểm, luôn cap
- **"Acceptance trong vòng 7 ngày, quá hạn coi như đã nghiệm thu"** → client legal thường chấp nhận 14-30 ngày
- **"Exclusivity với khách hàng"** → tránh trừ khi deal cực lớn
- **"Bên B cung cấp bảo hành vĩnh viễn miễn phí"** → không bền vững
- **"Bên A có quyền dùng tên Bên B trong marketing không cần xin phép"** → nên mutual
- **"IP chuyển giao ngay khi deliverable"** → nên chuyển giao ON FULL PAYMENT
- **"Late payment không có penalty"** → luôn có interest/suspension right
- **"Không có escrow cho source code"** → với enterprise deal nên có code escrow
