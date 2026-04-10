---
name: project-analysis
description: Analyze software project requirements to produce scope breakdown, effort estimation, risk assessment, tech stack recommendation, and feasibility reports. Use this skill when the user mentions 'phân tích dự án', 'project analysis', 'scope analysis', 'effort estimate', 'feasibility study', 'WBS', 'work breakdown structure', 'risk assessment', 'tech stack selection', 'estimate man-days', 'đánh giá dự án', or wants to evaluate a project before proposing or quoting. Output is a structured analysis document (docx or markdown) that feeds directly into proposal-builder and quotation-builder.
---

# Project Analysis Skill

**Phân tích dự án** trước khi viết proposal hoặc báo giá. Skill này là **bước trung gian** giữa việc nghe khách hàng mô tả dự án và việc viết proposal/quotation. Output của skill này là input cho `proposal-builder` và `quotation-builder`.

## Khi nào dùng

Trigger khi user nói:
- "Phân tích dự án X"
- "Estimate effort cho project này"
- "WBS cho dự án"
- "Đánh giá feasibility"
- "Risk assessment"
- "Tech stack cho project này"
- "Break down công việc"

**Thường được gọi TRƯỚC** khi user hỏi:
- "Báo giá cho dự án này" → suggest dùng `project-analysis` trước để có data
- "Tạo proposal cho khách hàng X" → suggest dùng `project-analysis` trước để hiểu scope

## Thông tin cần thu thập

Ít nhất phải có:
1. **Mục tiêu kinh doanh**: Tại sao khách hàng cần dự án này? (không phải "họ muốn một app")
2. **Target users**: Ai sẽ dùng sản phẩm?
3. **Features mong muốn**: Danh sách tính năng (càng chi tiết càng tốt)
4. **Constraints**:
   - Budget khoảng bao nhiêu?
   - Deadline khi nào?
   - Tech stack bắt buộc (nếu có)?
   - Compliance requirements (GDPR, HIPAA...)?
5. **Hệ thống hiện tại**: Có hệ thống nào cần integrate không?
6. **Scale**: Bao nhiêu user, transaction/ngày?

Nếu thiếu → dùng `AskUserQuestion` tool để hỏi từng nhóm.

## Framework phân tích (6 bước)

### Bước 1: Understanding the Business Context
Ghi nhận:
- Industry của khách hàng
- Business model (B2B/B2C/B2B2C)
- Current pain points
- Success metrics (revenue, user count, efficiency gain...)

**Output**: 1 đoạn "Business Context" trong báo cáo.

### Bước 2: Scope Definition (WBS - Work Breakdown Structure)

Chia dự án thành hierarchy:
```
Project
├── Phase 1: Discovery
│   ├── Requirements gathering
│   ├── Stakeholder interviews
│   └── Tech spec
├── Phase 2: Design
│   ├── Wireframes
│   ├── UI design
│   └── Design review
├── Phase 3: Development
│   ├── Backend
│   │   ├── Authentication module
│   │   ├── User management
│   │   ├── Business logic
│   │   ├── APIs
│   │   └── Database schema
│   ├── Frontend
│   │   ├── Landing page
│   │   ├── Dashboard
│   │   ├── User profile
│   │   └── Settings
│   └── Integrations
│       ├── Payment gateway
│       ├── Email service
│       └── Analytics
├── Phase 4: Testing
│   ├── Unit testing
│   ├── Integration testing
│   ├── UAT
│   └── Performance testing
├── Phase 5: Deployment
│   ├── Infrastructure setup
│   ├── CI/CD pipeline
│   └── Production deployment
└── Phase 6: Post-launch
    ├── Monitoring setup
    ├── Warranty period
    └── Knowledge transfer
```

**Output**: WBS tree + estimated effort per leaf node.

### Bước 3: Effort Estimation

Cho mỗi feature/module, estimate bằng **3-point estimate**:
```
Optimistic  (O):  best case
Most likely (M):  typical
Pessimistic (P):  worst case

Expected effort (E) = (O + 4M + P) / 6  [PERT formula]
Standard deviation = (P - O) / 6
```

Ví dụ:
| Module | O | M | P | E (man-days) |
|---|---|---|---|---|
| Authentication | 3 | 5 | 8 | 5.2 |
| Dashboard | 8 | 12 | 20 | 12.7 |
| User management | 4 | 6 | 10 | 6.3 |
| Payment integration | 5 | 10 | 18 | 10.5 |
| **Total** | | | | **34.7** |

**Buffer**:
- Low complexity project: +15%
- Medium: +25%
- High (unknown unknowns): +40%

**Output**: Bảng estimate với tổng effort (man-days).

### Bước 4: Risk Assessment

Dùng ma trận risk 2D (Probability × Impact):

```
         Low impact    Med impact    High impact
High     🟡           🔴            🔴🔴
Med      🟢           🟡            🔴
Low      🟢           🟢            🟡
```

Cho mỗi risk, record:
| ID | Risk | Category | Prob | Impact | Mitigation |
|---|---|---|---|---|---|
| R1 | Requirements change mid-project | Scope | High | High | Change request process, 20% contingency |
| R2 | Third-party API unreliable | Technical | Med | High | Fallback logic, SLA with provider |
| R3 | Key developer leaves | Resource | Low | High | Knowledge sharing, pair programming |
| R4 | Performance issue under load | Technical | Med | Med | Load testing in Phase 4 |
| R5 | Compliance audit fails | Legal | Low | High | Security review early |

**Output**: Risk register table + top 3 risks cần focus.

### Bước 5: Tech Stack Recommendation

Dựa trên:
- Requirements (scale, performance, complexity)
- Budget (open-source vs enterprise)
- Team skills (tránh học tech mới nếu tight deadline)
- Khách hàng preferences

Template tech stack:

**Web App (general purpose)**:
- Frontend: React / Next.js (SEO) / Vue.js
- Backend: Node.js (Express/NestJS) / Python (FastAPI/Django) / Go
- Database: PostgreSQL (relational) / MongoDB (document)
- Cache: Redis
- Search: Elasticsearch / Meilisearch
- Queue: RabbitMQ / AWS SQS
- Auth: Auth0 / Supabase Auth / custom JWT
- Hosting: AWS / GCP / Vercel (static)

**Mobile App**:
- Cross-platform: React Native / Flutter
- Native: Swift (iOS) / Kotlin (Android)
- Backend: same as web

**Data-heavy App**:
- Database: PostgreSQL + TimescaleDB / ClickHouse
- ETL: Airflow / Dagster
- Visualization: Metabase / Superset / custom D3

**Enterprise (compliance, audit)**:
- Backend: Java (Spring) / .NET Core
- Database: PostgreSQL / Oracle / SQL Server
- Hosting: On-premise / private cloud

**Output**: Tech stack table with justification per component.

### Bước 6: Feasibility & Recommendations

Kết luận:
- ✅ **Go** / ⚠️ **Go with conditions** / ❌ **No-go**
- Nếu Go with conditions: những gì cần làm rõ trước khi commit

Ví dụ:
> **Recommendation: Go with conditions**
>
> Dự án khả thi với timeline 6 tháng và team 5 người. Tuy nhiên:
> - ⚠️ Cần client confirm quyết định cuối về tech stack (React vs Next.js) trong tuần 1
> - ⚠️ Cần signed NDA với bên third-party payment gateway trước khi bắt đầu Phase 3
> - ⚠️ Cần dedicated QA từ Phase 3, không phải Phase 4 (do complexity)

## Output format

Output là document có các section:

```markdown
# Project Analysis: [Project Name]
**Prepared for**: [Client]
**Prepared by**: [Your company]
**Date**: [Date]

## 1. Business Context
[Paragraph describing the business reason for this project]

## 2. Scope Summary
[1 paragraph describing what's in scope and what's NOT in scope]

## 3. Work Breakdown Structure
[Hierarchical list or mindmap]

## 4. Effort Estimation
[Table with modules and man-days, total]

**Total estimated effort**: X man-days
**Buffered estimate**: Y man-days (+Z%)
**Team size recommendation**: N people
**Timeline recommendation**: M months

## 5. Risk Assessment
[Risk table]

**Top risks to mitigate**:
1. ...
2. ...
3. ...

## 6. Tech Stack Recommendation
[Table with components and justification]

## 7. Feasibility & Recommendation
[Go / Go with conditions / No-go + explanation]

## 8. Next Steps
- [ ] Stakeholder meeting to validate scope
- [ ] Sign NDA
- [ ] Finalize tech stack
- [ ] Kick-off discovery phase
```

## Estimation cheat sheet

**Authentication**: 3-7 days
- Basic email/password: 3 days
- OAuth (Google, Facebook): +2 days
- 2FA: +2 days
- SSO: +5 days

**CRUD module**: 2-5 days per entity
- Simple (5-10 fields): 2 days
- Complex (relations, validation): 5 days

**Dashboard with charts**: 8-15 days
- Basic: 8 days
- Complex (filters, drill-down): 15 days

**Payment integration**: 8-15 days
- Single provider (Stripe): 8 days
- Multiple providers + webhooks: 15 days

**Real-time feature (chat, notification)**: 10-20 days
- Polling: 10 days
- WebSocket: 15 days
- Full real-time with presence: 20 days

**Admin panel**: 15-30 days depending on features

**Mobile app from scratch**: 60-120 days

**Cộng thêm**:
- Project management (10-15% of dev effort)
- Code review (included in dev effort)
- Testing (20-30% of dev effort)
- Deployment (5-10 days)
- Documentation (3-5 days)

## Workflow chuẩn

1. Hỏi user các thông tin cần thiết (dùng AskUserQuestion)
2. Nếu thiếu info quan trọng → hỏi thêm, không guess
3. Chạy 6 bước phân tích theo framework
4. Nếu đây là bước chuẩn bị proposal → suggest next step: `proposal-builder` hoặc `proposal-html-pdf`
5. Nếu đây là bước chuẩn bị báo giá → suggest next step: `quotation-builder`
6. Tạo output document (markdown cho nhanh, docx nếu user muốn gửi khách)
7. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link

## Lỗi thường gặp cần tránh

- **Estimate bằng cảm tính**: Luôn dùng 3-point PERT hoặc reference data cũ
- **Quên buffer**: Project nào cũng có unknowns, luôn cộng 15-40%
- **Tech stack theo hot trend**: Chọn theo requirements, không theo "hôm nay có React 19"
- **Không consider team skills**: Stack tốt nhưng team không biết → deadline chết
- **Risk assessment qua loa**: Phải có mitigation cụ thể cho top risks
- **Không có "NOT in scope"**: Scope phải rõ cả cái in và out
