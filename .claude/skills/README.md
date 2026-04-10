# Skills Library — Cấu trúc theo Use-Case

Thư viện skill này được tổ chức theo **use-case** để Claude có thể chọn đúng skill khi làm việc. Cấu trúc chia thành 2 nhóm chính: **skill dùng chung** (01-07, _meta) và **skill riêng cho DanaExperts** (08).

**Ngày tái cấu trúc**: 2026-04-09

---

## Tổng quan cấu trúc

```
.claude/skills/
│
├── 01-core-documents/          [DÙNG CHUNG - File Operations]
│   ├── docx/                   Tạo/sửa file Word
│   ├── xlsx/                   Tạo/sửa file Excel
│   ├── pptx/                   Tạo/sửa file PowerPoint
│   └── pdf/                    Xử lý PDF (merge, split, extract, form fill)
│
├── 02-sales-materials/         [DÙNG CHUNG - Bán hàng & Khách hàng]
│   ├── proposal-builder/       ⭐NEW  Proposal dạng Word (.docx)
│   ├── proposal-html-pdf/      ⭐NEW  Proposal HTML đẹp → PDF
│   ├── quotation-builder/      ⭐NEW  Báo giá (Excel/Word)
│   ├── contract-builder/       ⭐NEW  Hợp đồng dự án (template VN/EN)
│   ├── project-analysis/       ⭐NEW  Phân tích scope, risk, estimate
│   └── pricing-strategy/       Chiến lược giá (tier, value-based)
│
├── 03-product-docs/            [DÙNG CHUNG - Tài liệu sản phẩm]
│   └── user-manual/            ⭐NEW  User manual / HDSD
│
├── 04-web-projects/            [DÙNG CHUNG - Web Development]
│   ├── landing-page/           ⭐NEW  Landing page công ty (HTML/React)
│   ├── cms-admin-seo/          ⭐NEW  Admin CMS + SEO tools
│   └── demo-webapp/            ⭐NEW  Demo web app (clickable prototype)
│
├── 05-design-ui/               [DÙNG CHUNG - Thiết kế & UI]
│   ├── design/                 Logo, CIP, banner, icon generation
│   ├── design-system/          Token architecture, component specs
│   └── ui-ux-pro-max-skill/    Design intelligence toolkit (BM25 search, 67 styles, 161 palettes)
│
├── 06-roles-expertise/         [DÙNG CHUNG - Chuyên môn theo vai trò]
│   ├── business-analyst/       Proposal, PRD, user stories, SWOT
│   ├── product-owner/          Roadmap, sprint, backlog, release notes
│   ├── factory-ba/             BA chuyên cho nhà máy Nhật (workflows, RBAC)
│   └── prompt-engineer/        Advanced prompting techniques
│
├── 07-workflow-process/        [DÙNG CHUNG - Quy trình tư duy]
│   ├── architecture/           Architectural decision framework, ADR
│   ├── brainstorming/          Design facilitation, idea validation
│   └── executing-plans/        Batch execution of implementation plans
│
├── 08-danaexperts-pitching/    [RIÊNG - Chỉ cho DanaExperts]
│   ├── ceo-pitching.skill      Pitch deck cấp C-level (zip)
│   ├── team-introduction.skill Giới thiệu team (zip)
│   ├── ba-case-study.skill     Case study dự án DanaExperts (zip)
│   ├── erp-workflow-demo/      Reference ERP demo (React)
│   └── odoo-demo/              Reference Odoo demo (webapp)
│
├── _meta/                      [META - Quản trị skill]
│   ├── skill-creator/          Tạo/sửa/evaluate skills
│   └── schedule/               Scheduled tasks
│
├── _archive/                   [ARCHIVE - Skill cũ không dùng]
│   ├── ui-ux-pro-max/          (replaced by ui-ux-pro-max-skill project)
│   └── uiux-pro-max/           (replaced by ui-ux-pro-max-skill project)
│
└── README.md                   (file này)
```

---

## Tra cứu nhanh: "Tôi cần làm X, dùng skill nào?"

### 📄 Tạo tài liệu
| Task | Skill |
|------|-------|
| Tạo Word document | `01-core-documents/docx` |
| Tạo Excel spreadsheet | `01-core-documents/xlsx` |
| Tạo PowerPoint | `01-core-documents/pptx` |
| Xử lý PDF | `01-core-documents/pdf` |

### 💼 Bán hàng & Khách hàng
| Task | Skill |
|------|-------|
| Viết proposal (Word) | `02-sales-materials/proposal-builder` |
| Proposal đẹp HTML→PDF | `02-sales-materials/proposal-html-pdf` |
| Báo giá cho khách | `02-sales-materials/quotation-builder` |
| Soạn hợp đồng | `02-sales-materials/contract-builder` |
| Phân tích dự án/estimate | `02-sales-materials/project-analysis` |
| Thiết kế pricing tier | `02-sales-materials/pricing-strategy` |

### 📘 Tài liệu sản phẩm
| Task | Skill |
|------|-------|
| User manual / HDSD | `03-product-docs/user-manual` |

### 🌐 Web Development
| Task | Skill |
|------|-------|
| Landing page công ty | `04-web-projects/landing-page` |
| Admin CMS quản lý blog + SEO | `04-web-projects/cms-admin-seo` |
| Demo web app (prototype) | `04-web-projects/demo-webapp` |

### 🎨 Thiết kế
| Task | Skill |
|------|-------|
| Logo, banner, icon, CIP | `05-design-ui/design` |
| Design system (tokens, components) | `05-design-ui/design-system` |
| UI inspiration, palettes, fonts | `05-design-ui/ui-ux-pro-max-skill` |

### 👥 Chuyên môn theo vai trò
| Task | Skill |
|------|-------|
| Business analyst work | `06-roles-expertise/business-analyst` |
| Product owner work | `06-roles-expertise/product-owner` |
| BA cho nhà máy Nhật | `06-roles-expertise/factory-ba` |
| Advanced prompting | `06-roles-expertise/prompt-engineer` |

### ⚙️ Quy trình tư duy
| Task | Skill |
|------|-------|
| Architectural decisions | `07-workflow-process/architecture` |
| Brainstorm & validate ideas | `07-workflow-process/brainstorming` |
| Execute plans step-by-step | `07-workflow-process/executing-plans` |

### 🏢 DanaExperts (chỉ dùng khi pitch DanaExperts)
| Task | Skill |
|------|-------|
| CEO pitch deck | `08-danaexperts-pitching/ceo-pitching.skill` |
| Team introduction | `08-danaexperts-pitching/team-introduction.skill` |
| Case study dự án | `08-danaexperts-pitching/ba-case-study.skill` |
| Reference ERP demo | `08-danaexperts-pitching/erp-workflow-demo` |
| Reference Odoo demo | `08-danaexperts-pitching/odoo-demo` |

---

## Combo thường gặp

### Combo 1: Sales Package (proposal + báo giá + hợp đồng)
```
project-analysis          → Phân tích dự án trước
    ↓
proposal-builder          → Viết proposal Word
    hoặc
proposal-html-pdf         → Proposal đẹp dạng HTML→PDF
    ↓
quotation-builder         → Báo giá chi tiết
    ↓
contract-builder          → Hợp đồng khi khách đồng ý
```

### Combo 2: Full Website Package
```
landing-page              → Trang chủ marketing
    ↓
cms-admin-seo             → Admin panel quản lý content + SEO
    ↓
demo-webapp               → Nếu cần thêm web app tính năng
```

### Combo 3: Product Launch Documentation
```
user-manual               → HDSD cho end users
    +
landing-page              → Trang product launch
    +
proposal-html-pdf         → Sales deck cho enterprise clients
```

### Combo 4: DanaExperts Partnership Pitch
```
ceo-pitching (.skill)     → Mở đầu: chúng tôi là ai
    ↓
team-introduction (.skill) → Ai sẽ làm việc
    ↓
ba-case-study (.skill)    → Chúng tôi đã làm gì
    ↓
proposal-html-pdf         → Đề xuất cụ thể cho partner
```

---

## Skills dùng chung vs Skills riêng

### ✅ Dùng chung cho MỌI PROJECT (các nhóm 01-07)
Các skill này không phụ thuộc vào công ty hay dự án cụ thể — dùng được cho bất kỳ client nào:
- **01-core-documents**: Xử lý file Word/Excel/PPT/PDF
- **02-sales-materials**: Proposal, báo giá, hợp đồng, phân tích
- **03-product-docs**: User manual
- **04-web-projects**: Landing page, CMS, demo
- **05-design-ui**: Design, design system
- **06-roles-expertise**: Chuyên môn theo vai trò (BA, PO, Prompt Engineer)
- **07-workflow-process**: Quy trình tư duy (architecture, brainstorming)

### 🎯 RIÊNG cho DanaExperts (nhóm 08)
Các skill này có **nội dung cứng về DanaExperts** (vision, track record, team, case studies):
- **08-danaexperts-pitching**: CEO pitch, team intro, case study, reference demos

**Nếu bạn có project cho công ty khác**, đừng dùng nhóm 08 — dùng các skill tương đương trong nhóm 02 (proposal-builder, proposal-html-pdf) để tạo tài liệu tùy chỉnh.

---

## 9 Skills mới được tạo (2026-04-09)

| # | Skill | Nhóm | Mục đích |
|---|-------|------|----------|
| 1 | proposal-builder | 02-sales-materials | Proposal Word chuyên nghiệp |
| 2 | proposal-html-pdf | 02-sales-materials | Proposal HTML đẹp → PDF |
| 3 | quotation-builder | 02-sales-materials | Báo giá Excel/Word |
| 4 | contract-builder | 02-sales-materials | Hợp đồng dự án (VN/EN) |
| 5 | project-analysis | 02-sales-materials | Phân tích scope, risk, estimate |
| 6 | user-manual | 03-product-docs | Tài liệu HDSD |
| 7 | landing-page | 04-web-projects | Landing page công ty (HTML/React) |
| 8 | cms-admin-seo | 04-web-projects | Admin CMS + SEO |
| 9 | demo-webapp | 04-web-projects | Demo web app prototype |

---

## Nguyên tắc tổ chức

### 1. Prefix số (01-, 02-, ...)
- Claude quét theo thứ tự alphabet → prefix số đảm bảo các nhóm chính hiển thị đầu tiên
- Nhóm `_meta` và `_archive` có `_` ở đầu → xuống cuối danh sách

### 2. Skill name không đổi
- Dù skill đã được move vào thư mục con, **tên skill trong SKILL.md frontmatter không đổi**
- Điều này đảm bảo Claude vẫn trigger đúng bằng keywords cũ

### 3. Description giàu trigger keywords
- Mỗi SKILL.md có description chứa **cả tiếng Việt và tiếng Anh**
- Dùng các từ khóa phong phú để maximize trigger rate

### 4. Cross-reference giữa các skill
- Các skill liên quan reference lẫn nhau trong SKILL.md
- Ví dụ: `proposal-builder` nhắc đến `project-analysis` và `quotation-builder`

### 5. Tôn trọng skill built-in
- Các skill built-in tại `/sessions/eager-confident-dijkstra/mnt/.claude/skills/` **KHÔNG bị đụng đến**
- Workspace skills là extension/customization, không override built-in

---

## Maintenance

### Khi muốn thêm skill mới:
1. Xác định nhóm phù hợp (01-08 hoặc _meta)
2. Tạo thư mục con với tên kebab-case
3. Tạo file `SKILL.md` với frontmatter (name, description)
4. Cập nhật README này (thêm vào mục "Tra cứu nhanh")

### Khi muốn sửa skill:
1. Edit file `SKILL.md` trong thư mục skill đó
2. Giữ `name` field không đổi nếu không muốn break trigger

### Khi muốn xóa skill:
1. Move vào `_archive/` thay vì xóa trực tiếp
2. Cập nhật README

---

## Liên kết đến built-in skills

Các skill built-in vẫn có sẵn và tiếp tục hoạt động song song:
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/docx`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/xlsx`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/pptx`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/pdf`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/schedule`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/skill-creator`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/setup-cowork`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/ba-case-study`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/ceo-pitching`
- `/sessions/eager-confident-dijkstra/mnt/.claude/skills/team-introduction`
