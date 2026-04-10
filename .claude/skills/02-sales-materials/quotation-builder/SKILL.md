---
name: quotation-builder
description: Create professional quotations and pricing documents (báo giá) for software projects, services, and products. Use this skill when the user mentions 'báo giá', 'quotation', 'quote', 'bảng giá', 'pricing document', 'estimate', 'cost breakdown', 'bảng báo giá', 'price list', or 'chi phí dự án'. Supports fixed-price, time-and-material (T&M), retainer, and hybrid pricing models. Outputs can be Excel (.xlsx) with formulas or Word (.docx) with formatted tables, plus optional PDF export. Commonly used alongside proposal-builder for complete sales package.
---

# Quotation Builder Skill

Tạo **báo giá chuyên nghiệp** cho dự án phần mềm, dịch vụ tư vấn, hoặc sản phẩm. Skill này tập trung vào **cấu trúc báo giá chuẩn Việt Nam/quốc tế**, **công thức tính chính xác**, và **cách trình bày rõ ràng**.

## Khi nào dùng

Trigger khi user nói:
- "Tạo báo giá cho dự án X"
- "Làm quotation gửi khách"
- "Cần bảng giá chi tiết"
- "Estimate chi phí dự án"
- "Break down cost cho project"

**KHÔNG** dùng khi:
- User cần chiến lược giá (tier design, positioning) → dùng `pricing-strategy`
- User cần proposal đầy đủ (không chỉ giá) → dùng `proposal-builder`

## Thông tin cần thu thập

1. **Loại báo giá**:
   - Fixed-price (giá cố định cho scope xác định)
   - Time & Material (theo giờ/ngày công)
   - Retainer (monthly/quarterly)
   - Hybrid (fixed phase + T&M extension)
2. **Đơn vị tiền tệ**: VND, USD, EUR? Có thuế VAT không?
3. **Phạm vi công việc**: Danh sách module/feature cần estimate
4. **Team & rate**: Junior/Mid/Senior developers, rate/hour hoặc /day
5. **Timeline**: Bao nhiêu tháng, bao nhiêu sprints
6. **Khách hàng**: Tên công ty, người nhận, ngành nghề
7. **Format đầu ra**: Excel với công thức hay Word/PDF để in?

## Cấu trúc báo giá chuẩn

### Header
- Logo công ty + thông tin liên hệ
- **Quotation No.**: QT-2026-XXX
- **Date**: Ngày phát hành
- **Valid until**: 30 ngày (standard)
- **Prepared for**: Tên công ty khách + người nhận
- **Prepared by**: Sales/Account manager

### Summary Section
Tóm tắt 1 bảng nhỏ:
| Item | Value |
|---|---|
| Project | Tên dự án |
| Duration | X tháng |
| Team size | X người |
| Total investment | XXX VND (+ VAT) |

### Detailed Breakdown

**Option A — Fixed price by module:**
| # | Module | Description | Effort (man-day) | Rate | Amount |
|---|---|---|---|---|---|
| 1 | User Authentication | Login, register, password recovery | 8 | $400 | $3,200 |
| 2 | Dashboard | Admin dashboard with charts | 12 | $400 | $4,800 |
| ... | ... | ... | ... | ... | ... |
| | **Subtotal** | | **120** | | **$48,000** |

**Option B — Fixed price by phase:**
| Phase | Duration | Deliverables | Price |
|---|---|---|---|
| Phase 1: Discovery & Design | 2 weeks | Wireframes, tech spec | $5,000 |
| Phase 2: MVP Development | 8 weeks | Core features, alpha release | $30,000 |
| Phase 3: Testing & Launch | 2 weeks | QA, deployment, training | $8,000 |

**Option C — Time & Material:**
| Role | Quantity | Rate/day | Days | Amount |
|---|---|---|---|---|
| Tech Lead | 1 | $600 | 60 | $36,000 |
| Senior Developer | 2 | $400 | 60 | $48,000 |
| Mid Developer | 2 | $250 | 60 | $30,000 |
| QA Engineer | 1 | $250 | 40 | $10,000 |
| UI/UX Designer | 1 | $400 | 20 | $8,000 |
| Project Manager | 1 | $500 | 60 | $30,000 |

### Optional Add-ons
Liệt kê các item tùy chọn không bao gồm trong giá chính:
| Item | Description | Price |
|---|---|---|
| Extra support (6 months) | Bug fix, hotfix | $500/month |
| Additional training | On-site training | $1,000/day |
| Server setup & DevOps | Deploy + CI/CD | $3,000 one-time |

### Totals
```
Subtotal:          $48,000
Discount (10%):    -$4,800
Net amount:        $43,200
VAT (10%):         $4,320
─────────────────────────
TOTAL:             $47,520
```

### Payment Terms
- 30% advance upon contract signing
- 40% upon Phase 2 completion
- 30% upon final delivery & UAT
- Payment due within 15 days of invoice
- Bank details: [STK, ngân hàng, swift code]

### Terms & Conditions
- Quotation valid for 30 days
- Prices exclude/include VAT (nêu rõ)
- Currency: USD/VND (specify)
- Excludes: hosting, third-party licenses, travel
- Change requests will be quoted separately
- Warranty: 3 months post-launch

### Signature Block
```
Prepared by:              Accepted by:
________________          ________________
[Name]                    [Client name]
[Title]                   [Title]
[Date]                    [Date]
```

## Excel Implementation (khuyến nghị cho T&M)

Dùng công thức tự động để dễ update:
```
B5 = Junior rate/day
B6 = Mid rate/day
B7 = Senior rate/day
B8 = Tech Lead rate/day

D11 = Junior days
D12 = Mid days
D13 = Senior days
D14 = Tech Lead days

E11 = B5 * D11
...

E15 (Subtotal) = SUM(E11:E14)
E16 (Discount) = E15 * 0.1
E17 (Net) = E15 - E16
E18 (VAT) = E17 * 0.1
E19 (Total) = E17 + E18
```

**Tạo bằng `xlsx` skill** — đọc `/sessions/eager-confident-dijkstra/mnt/.claude/skills/xlsx/SKILL.md` trước.

## Word/PDF Implementation

Dùng cho báo giá in ấn, ký số:
- Header có logo + thông tin công ty
- Tables với border nhẹ, zebra stripe
- Phần tổng bold + background nhạt
- Footer có page number + "Confidential"

**Tạo bằng `docx` skill** — đọc `/sessions/eager-confident-dijkstra/mnt/.claude/skills/docx/SKILL.md` trước.

## Các rate tham khảo (để estimate)

Rate outsourcing Việt Nam (2026, USD/day, 8h):
- Junior Developer (0-2 năm): $150-$250
- Mid Developer (2-5 năm): $250-$400
- Senior Developer (5+ năm): $400-$600
- Tech Lead: $500-$800
- Designer (UI/UX): $300-$500
- QA Engineer: $200-$350
- DevOps Engineer: $350-$550
- Project Manager: $400-$700
- Business Analyst: $350-$550

Rate cho nội địa VN (VND/ngày):
- Junior: 1.500.000 - 2.500.000
- Mid: 2.500.000 - 4.000.000
- Senior: 4.000.000 - 6.500.000
- PM/Lead: 5.000.000 - 8.000.000

**Lưu ý**: Đây là guideline. Final rate phụ thuộc vào khách hàng (budget), thời gian dự án (discount cho long-term), complexity, và negotiation.

## Formulas cho common calculations

**Buffer margin** (cho risk):
```
Buffered effort = Base effort × (1 + risk factor)
Low risk:    factor = 1.15 (15% buffer)
Medium risk: factor = 1.25
High risk:   factor = 1.40
```

**Volume discount**:
```
<$20k:   0% discount
$20-50k: 5% discount
$50-100k: 10% discount
>$100k:  15% discount
```

**Rush fee** (nếu timeline gấp):
```
Normal:  0% surcharge
-20% timeline: +15% fee
-40% timeline: +30% fee
```

## Lỗi thường gặp cần tránh

- **Không estimate buffer**: Luôn cộng 15-25% buffer cho unknown unknowns
- **Quên overhead**: Meeting, standup, code review cũng tính effort
- **Rate không consistent**: Junior/Senior phải có rate khác nhau rõ ràng
- **Không có "excludes"**: Phải nêu rõ cái gì KHÔNG có trong giá
- **Format số sai**: VND dùng dấu chấm (1.000.000), USD dùng dấu phẩy (1,000)
- **Thiếu validity date**: Giá có thể đổi, phải có "valid until"
- **Không có payment schedule**: Khách không biết khi nào trả

## Workflow chuẩn

1. Đọc skill liên quan:
   - `xlsx` nếu output Excel
   - `docx` nếu output Word
   - `proposal-html-pdf` nếu báo giá là phần của proposal đẹp
2. Hỏi user: loại báo giá, currency, scope, timeline, team
3. Estimate effort cho từng module/phase
4. Tính rate × effort cho từng item
5. Áp dụng buffer + discount + VAT
6. Tạo file output theo format chọn
7. Review với user (đặc biệt tổng số tiền)
8. Export PDF nếu cần in/gửi email
9. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link
