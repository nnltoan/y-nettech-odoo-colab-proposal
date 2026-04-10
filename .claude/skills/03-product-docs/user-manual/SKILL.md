---
name: user-manual
description: Create user manuals, product documentation, user guides, and help documentation for software products and applications. Use this skill when the user mentions 'user manual', 'tài liệu hướng dẫn', 'HDSD', 'hướng dẫn sử dụng', 'user guide', 'product documentation', 'help docs', 'quickstart guide', 'onboarding docs', 'how-to guide', or 'tutorial documentation'. Supports multiple output formats (docx, HTML, PDF, Markdown), structured for easy navigation with screenshots, step-by-step instructions, troubleshooting, and FAQ sections.
---

# User Manual Skill

Tạo **tài liệu hướng dẫn sử dụng sản phẩm** (user manual / HDSD) chuyên nghiệp. Skill này tập trung vào **cấu trúc thông tin, cách viết hướng dẫn dễ hiểu**, và **quản lý screenshots**.

## Khi nào dùng

Trigger khi user nói:
- "Tạo user manual"
- "Viết tài liệu hướng dẫn sử dụng"
- "HDSD cho phần mềm X"
- "User guide"
- "Onboarding docs"
- "Help documentation"
- "Quickstart guide"

## Phân loại user manual

### 1. Quick Start Guide (5-15 trang)
Cho người mới. Chỉ cover 20% tính năng quan trọng nhất để user có thể bắt đầu.

### 2. Full User Manual (50-200 trang)
Tài liệu chi tiết, cover toàn bộ tính năng. Thường cho enterprise software.

### 3. Feature Guide (10-30 trang)
Tập trung vào một nhóm tính năng cụ thể (e.g., "Reports & Analytics Guide").

### 4. Administrator Guide (30-80 trang)
Cho system admin: cài đặt, cấu hình, bảo mật, backup, troubleshooting.

### 5. Developer Guide (20-100 trang)
Cho developers: API docs, SDK usage, webhooks, integration examples.

**Hỏi user**: Loại nào? Có thể kết hợp nhiều loại trong cùng document.

## Thông tin cần thu thập

1. **Product**: Tên sản phẩm, version, target platform (web/mobile/desktop)
2. **Target audience**: End user không rành công nghệ? Power user? Admin? Dev?
3. **Loại manual**: Quick Start / Full / Feature / Admin / Dev?
4. **Features cần document**: Danh sách các tính năng (hoặc reference đến spec)
5. **Format output**:
   - `.docx` để in và share
   - `.pdf` để phân phối
   - HTML cho web-based help (giống Notion/GitBook)
   - Markdown cho GitHub wiki
6. **Ngôn ngữ**: Tiếng Việt / English / song ngữ?
7. **Branding**: Logo, màu, font?
8. **Screenshots**: Có sẵn chưa hay cần Claude generate mockup?

## Cấu trúc chuẩn của User Manual

### Front Matter
- Cover page (logo, tên sản phẩm, version, logo công ty)
- Table of Contents (auto-generated, clickable)
- Copyright notice
- Document version history

### 1. Introduction (1-3 trang)
- Giới thiệu sản phẩm là gì
- Sản phẩm dành cho ai
- Benefits chính
- System requirements (nếu có)
- Supported platforms

### 2. Getting Started (3-10 trang) ⭐ QUAN TRỌNG
Đây là section user đọc đầu tiên. Phải:
- Installation / signup (nếu cần)
- First login
- Onboarding wizard
- Initial setup
- Your first [action] in 5 minutes

**Template "5-minute quick start"**:
```
1. Truy cập https://app.example.com
2. Đăng ký tài khoản bằng email
3. Xác nhận email qua hộp thư
4. Đăng nhập lần đầu
5. Hoàn thành setup wizard
6. Tạo [item] đầu tiên
```

### 3. Interface Overview (2-5 trang)
- Main navigation
- Key UI elements
- Keyboard shortcuts
- Settings menu

**Cần screenshots**: labeled với numbers (1), (2), (3) → giải thích bên dưới.

### 4. Features (main section, nhiều trang)
Mỗi feature là một chapter, cấu trúc:
```
## [Feature Name]

### Overview
[1-2 đoạn giải thích feature làm gì và khi nào dùng]

### How to [action]

1. Step 1 with screenshot
2. Step 2 with screenshot
3. ...

### Tips & Best Practices
- Tip 1
- Tip 2

### Common Issues
- Issue: ... → Solution: ...
```

### 5. Advanced Features (cho power users)
- Integrations (Slack, Zapier, Google Workspace)
- API usage
- Bulk operations
- Automation rules

### 6. Administration (nếu applicable)
- User management
- Permissions & roles
- Billing & subscriptions
- Data export/import
- Backup

### 7. Troubleshooting (3-10 trang)
FAQ format:
```
### Q: Tôi không đăng nhập được.
A: Kiểm tra các bước sau:
1. Đảm bảo caps lock tắt
2. Click "Forgot password" nếu quên mật khẩu
3. Liên hệ support nếu vẫn không được
```

Error codes list:
| Error Code | Meaning | Solution |
|---|---|---|
| E001 | Invalid credentials | Check email/password |
| E002 | Account locked | Wait 15 min or contact admin |

### 8. FAQ (2-5 trang)
Câu hỏi thường gặp, không theo category. Top 15-20 câu hỏi phổ biến nhất.

### 9. Glossary
Giải thích các thuật ngữ kỹ thuật / domain-specific.

### 10. Contact & Support
- Support email / hotline
- Knowledge base link
- Community forum
- Status page

### Back Matter
- Index (auto-generated)
- Changelog (optional)
- Legal notices

## Cách viết instruction tốt

### DO ✅
- **Ngắn gọn, rõ ràng**: "Click Save" không phải "Vui lòng nhấn nút có nhãn Save để lưu thay đổi"
- **Động từ hành động**: "Click", "Type", "Select", "Drag"
- **Numbered steps**: Mỗi bước một action
- **Screenshots**: Sau mỗi bước phức tạp
- **Consistent terminology**: Dùng cùng tên cho cùng một thứ
- **Second person**: "Bạn" hoặc "You", không dùng "Chúng ta" hay "The user"

### DON'T ❌
- **Jargon**: Tránh từ kỹ thuật nếu user không phải dev
- **Walls of text**: Chia nhỏ thành steps
- **Ambiguity**: "Click the button" - nút nào?
- **Tense shifts**: Dùng present tense xuyên suốt
- **Assume knowledge**: User không biết hết, giải thích từng bước

### Template cho một step
```
**Bước 3: Tạo tài liệu mới**

1. Từ dashboard, click nút **"+ New Document"** ở góc trên bên phải.
   [SCREENSHOT: dashboard with arrow pointing to New Document button]

2. Trong dialog hiện ra, nhập tên tài liệu vào ô **"Document Name"**.

3. Chọn template từ dropdown **"Template"** (mặc định: Blank).

4. Click **"Create"** để tạo.

> **💡 Tip**: Bạn cũng có thể dùng keyboard shortcut `Ctrl+N` (hoặc `⌘+N` trên Mac).

> **⚠️ Lưu ý**: Tên tài liệu không được chứa ký tự đặc biệt như `/`, `\`, `:`.
```

## Screenshots guidelines

### Khi nào cần screenshot
- Bước đầu tiên của một flow mới
- Khi UI phức tạp (nhiều button, dropdown)
- Khi cần show kết quả (before/after)
- Error messages

### Cách screenshot đúng
- **Resolution**: 1920x1080 minimum, 2x cho retina
- **Crop tight**: Chỉ show phần liên quan, không cả màn hình
- **Highlight**: Dùng arrow đỏ / box vàng để point đến element
- **Numbering**: Nếu có nhiều elements, dùng (1), (2), (3)
- **Redact data**: Che thông tin nhạy cảm (email thật, personal data)
- **Consistent theme**: Luôn dùng cùng theme (light/dark) xuyên suốt
- **No cursor**: Trừ khi cần show drag

### File naming
```
01-dashboard-overview.png
02-new-document-button.png
03-document-settings-dialog.png
```

### Image sizing trong document
- Inline screenshot: width ~600px
- Full-page: 1200px
- Thumbnail: 200px
- DPI: 150 cho print, 72 cho web

## Output formats

### Option A — Markdown (cho GitHub wiki, GitBook, VitePress)
- Fastest to write
- Easy to version control
- Convert to HTML/PDF later
- Use `docx` skill if need .docx later

### Option B — .docx (cho in và share qua email)
- Professional appearance
- Easy for client to edit
- Use `docx` skill — đọc `/sessions/eager-confident-dijkstra/mnt/.claude/skills/docx/SKILL.md`
- Include: auto TOC, page numbers, headers/footers, styles

### Option C — HTML + CSS (cho help center trên web)
- Interactive (search, collapsible sections)
- Responsive
- Linkable sections
- Consider: GitBook, Docusaurus, VitePress structure

### Option D — PDF (final delivery)
- Generate from HTML (via Puppeteer) or from docx
- Bookmark navigation
- Searchable text
- Print-friendly

## Navigation & Searchability

### TOC (Table of Contents)
- Hierarchical (max 3 levels deep)
- Clickable (hyperlinked to sections)
- Show page numbers in print version

### Cross-references
- "See Chapter 5 for details"
- Make clickable in digital version

### Index (for long manuals)
- Auto-generate from headings
- Include key terms

### Search
- HTML version: include search bar (Algolia, Lunr.js)
- PDF: searchable text (not scanned images)

## Tone examples

### Tiếng Việt
**Nói chuyện với user** (dùng "bạn"):
```
Để tạo một tài liệu mới, bạn thực hiện như sau:
1. Nhấn nút "+ Tạo mới" ở góc trên bên phải.
2. Nhập tên tài liệu.
3. Chọn template phù hợp.
4. Nhấn "Tạo" để hoàn tất.
```

**Công ty viết** (formal):
```
Người dùng thực hiện các bước sau để tạo tài liệu mới:
1. Nhấn nút "+ Tạo mới"...
```

**Khuyến nghị**: Dùng "bạn" — friendly hơn, dễ đọc.

### English
```
To create a new document:
1. Click the "+ New Document" button in the top-right corner.
2. Enter a document name.
3. Choose a template.
4. Click "Create".
```

## Workflow chuẩn

1. Đọc skill phù hợp với format output:
   - `docx` nếu Word
   - `pdf` nếu xuất PDF
2. Hỏi user các thông tin (product, audience, features, format)
3. Tạo outline (TOC) trước, review với user
4. Viết từng chapter một
5. Collect / generate screenshots
6. Insert screenshots với captions
7. Review flow: đi theo user journey thực tế
8. Tạo file output
9. Test: một người chưa biết gì đọc có hiểu không?
10. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link

## Checklist chất lượng

Trước khi deliver:
- [ ] TOC đầy đủ, không thiếu section
- [ ] Mọi link nội bộ hoạt động
- [ ] Screenshots clear, có caption, có highlight
- [ ] Consistent terminology (một thứ một tên)
- [ ] Không có typo (spell check)
- [ ] Step-by-step rõ ràng, không nhảy bước
- [ ] Code examples (nếu có) đã test
- [ ] FAQ cover top user questions
- [ ] Contact info đúng
- [ ] Version number & date correct
- [ ] Print preview check layout không vỡ
