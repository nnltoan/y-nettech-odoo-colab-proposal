---
name: proposal-html-pdf
description: Create beautifully designed proposal documents as HTML with custom CSS, then export to PDF for client delivery. Use this skill when the user wants a visually stunning proposal that goes beyond plain Word documents — mentions include 'proposal đẹp', 'proposal HTML', 'proposal PDF design', 'đẹp mắt proposal', 'branded proposal', 'pitch deck PDF', 'HTML to PDF proposal', 'designer proposal', or 'proposal with custom design'. Ideal for high-value clients, premium services, or when design quality is critical to winning the deal. Combines HTML/CSS design with PDF export workflows (Puppeteer, WeasyPrint, wkhtmltopdf).
---

# Proposal HTML-to-PDF Skill

Tạo **proposal đẹp dạng HTML** với design custom và **export ra PDF** để gửi khách hàng quan trọng. Skill này dành cho các proposal cần chất lượng thiết kế cao mà Word document không thể đạt được.

## Khi nào dùng skill này (thay vì proposal-builder)

**Dùng proposal-html-pdf khi:**
- Khách hàng là enterprise/premium — proposal đẹp ảnh hưởng đến quyết định
- Deal value cao (>$50k)
- Cần brand consistency (màu, font, spacing chuẩn)
- Muốn có animation preview (khi khách xem trên web)
- Cần responsive (khách xem trên mobile)
- Công ty có brand guidelines cần tuân thủ nghiêm ngặt

**Dùng proposal-builder (docx) khi:**
- Khách hàng yêu cầu định dạng Word để edit
- Proposal cần ký số trực tiếp trên file
- Quy trình khách hàng yêu cầu docx
- Deal nhỏ, cần nhanh

## Thông tin cần thu thập

1. **Brand**: Màu primary/secondary, font chính, logo (SVG/PNG path)?
2. **Style preference**:
   - Modern minimal (Apple/Linear style)?
   - Corporate (Deloitte/McKinsey style)?
   - Creative bold (agency style)?
   - Tech startup (Stripe/Notion style)?
3. **Sections cần có**: Giống proposal thông thường + có cần video embed / interactive elements không?
4. **PDF export method**: Print-friendly CSS có đủ không hay cần Puppeteer cho độ chính xác cao?
5. **Ngôn ngữ**: Tiếng Việt cần font hỗ trợ (Inter, Be Vietnam Pro, Roboto)

## Kỹ thuật & Workflow

### Bước 1: Design system
Thiết lập trước khi code HTML:
```css
:root {
  /* Primary brand colors */
  --primary: #0A2540;
  --primary-light: #1E3A5F;
  --accent: #00D4FF;

  /* Neutrals */
  --text-primary: #0A2540;
  --text-secondary: #5A6B80;
  --bg: #FFFFFF;
  --bg-soft: #F6F9FC;
  --border: #E3E8EE;

  /* Typography */
  --font-heading: 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  /* Spacing - 8px grid */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;

  /* Page for PDF */
  --page-width: 210mm;  /* A4 */
  --page-height: 297mm;
  --page-margin: 20mm;
}
```

### Bước 2: Print-friendly CSS
**CRITICAL** — CSS cho print quyết định chất lượng PDF:
```css
@page {
  size: A4;
  margin: 20mm;
}

@media print {
  .page-break {
    page-break-after: always;
  }

  .no-print {
    display: none !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Avoid orphans/widows */
  h1, h2, h3 { page-break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
}
```

### Bước 3: HTML structure
Dùng section-based layout, mỗi section là 1 "page" visual:
```html
<section class="page cover">
  <header class="brand-header">
    <img src="logo.svg" class="logo" />
  </header>
  <div class="hero">
    <p class="kicker">PROPOSAL</p>
    <h1>Project Title</h1>
    <p class="client">Prepared for [Client Name]</p>
    <p class="date">April 2026</p>
  </div>
  <footer class="page-footer">
    <span>Confidential</span>
    <span>Page 1</span>
  </footer>
</section>

<section class="page exec-summary">
  <!-- ... -->
</section>
```

### Bước 4: Typography scale
Để proposal trông chuyên nghiệp, giới hạn typography scale:
- H1 (cover): 56px, weight 700, tight leading
- H1 (section): 40px, weight 600
- H2: 28px, weight 600
- H3: 20px, weight 600
- Body: 16px, weight 400, line-height 1.6
- Caption: 13px, weight 400, color secondary

### Bước 5: Visual elements
- **Icons**: Dùng Lucide, Heroicons (inline SVG)
- **Charts**: Chart.js cho HTML view, rasterize khi export PDF
- **Tables**: Tuyệt đối không dùng border đậm, dùng zebra striping nhạt
- **Pull quotes**: Testimonials với big quote mark
- **Image placeholders**: Dùng placeholder.com hoặc unsplash.com cho mockup

### Bước 6: Export PDF

**Option A — Puppeteer (khuyến nghị — độ chính xác cao)**:
```bash
pip install pyppeteer --break-system-packages
```
```python
import asyncio
from pyppeteer import launch

async def html_to_pdf(html_file, pdf_file):
    browser = await launch(args=['--no-sandbox'])
    page = await browser.newPage()
    await page.goto(f'file://{html_file}', {'waitUntil': 'networkidle0'})
    await page.pdf({
        'path': pdf_file,
        'format': 'A4',
        'printBackground': True,
        'margin': {'top': '20mm', 'bottom': '20mm', 'left': '20mm', 'right': '20mm'}
    })
    await browser.close()

asyncio.run(html_to_pdf('/path/to/proposal.html', '/path/to/proposal.pdf'))
```

**Option B — WeasyPrint (pure Python, simpler)**:
```bash
pip install weasyprint --break-system-packages
```
```python
from weasyprint import HTML
HTML('proposal.html').write_pdf('proposal.pdf')
```

**Option C — wkhtmltopdf (nếu có sẵn)**:
```bash
wkhtmltopdf --page-size A4 --margin-top 20mm --margin-bottom 20mm proposal.html proposal.pdf
```

**Chọn gì?**
- Puppeteer: render chuẩn nhất, hỗ trợ JS, modern CSS — dùng cho proposal design phức tạp
- WeasyPrint: nhanh, không cần browser, ít lỗi font — dùng cho proposal đơn giản
- wkhtmltopdf: cũ, có thể lỗi với flexbox/grid — tránh cho design phức tạp

## Templates phổ biến

### Template 1: "Minimal Premium"
Màu đen trắng, accent 1 màu duy nhất, typography lớn, nhiều whitespace. Phù hợp enterprise, consulting.

### Template 2: "Tech Startup"
Gradient mesh background, SF Pro / Inter, illustration lineart, accent color bright. Phù hợp SaaS proposal.

### Template 3: "Corporate Blue"
Navy + gold, serif headers, bảng dày đặc, Gantt charts. Phù hợp banking, finance.

### Template 4: "Creative Agency"
Typography experimental, bold colors, editorial layout. Phù hợp agency pitching.

## Workflow chuẩn

1. Đọc `pdf` skill trước — `/sessions/eager-confident-dijkstra/mnt/.claude/skills/pdf/SKILL.md`
2. Đọc `design-system` skill nếu user có brand guidelines — `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/.claude/skills/05-design-ui/design-system/SKILL.md`
3. Hỏi user brand info + style preference
4. Nếu nội dung chưa có → suggest dùng `proposal-builder` để viết content, rồi quay lại đây để design
5. Tạo design system (CSS variables) trước
6. Build HTML theo sections, review visual với user qua screenshot
7. Test print preview trong browser (Ctrl+P) → verify layout không vỡ
8. Export PDF bằng Puppeteer
9. Deliver cả HTML (interactive) và PDF (for email) cho user

## Checklist chất lượng

Trước khi deliver, kiểm tra:
- [ ] Font tiếng Việt hiển thị đúng (không bị "?" hay box)
- [ ] Màu sắc in đúng (test printBackground: true)
- [ ] Page breaks không vỡ giữa heading/content
- [ ] Images resolution đủ cao (300dpi cho print)
- [ ] Tables không vượt page width
- [ ] Headers/footers có trên mọi trang
- [ ] Page numbers đúng
- [ ] Brand consistent (logo, colors, fonts)
- [ ] File size PDF hợp lý (<10MB cho email)
- [ ] Không có lorem ipsum còn sót
- [ ] Tên khách hàng + tên công ty đúng

---

# Patterns từ proposal Smart Factory 4.0 thực tế (Bilingual VI/JP, 15 pages A4)

Các pattern bên dưới được chưng cất từ một HTML proposal production-grade đã giao cho khách hàng Nhật Bản (Smart Factory 4.0 package). Dùng khi cần: **proposal song ngữ**, **export PDF A4 chuẩn 15+ pages**, **visual design cao cấp với brand màu navy + sky blue**.

## 1. A4 page container pattern (CRITICAL)

Cách structure HTML để mỗi "section" là một trang A4 thật, hiển thị đẹp cả trên web lẫn khi export PDF:

```html
<div class="page-container">
  <!-- PAGE 1 -->
  <section class="page">
    <div class="page-inner">
      <!-- nội dung trang 1 -->
    </div>
  </section>

  <!-- PAGE 2 -->
  <section class="page">
    <div class="page-inner">
      <!-- nội dung trang 2 -->
    </div>
  </section>
</div>
```

```css
.page-container {
  max-width: 210mm;
  margin: 20px auto;
}

.page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm 20mm;
  background: white;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  page-break-after: always;
  position: relative;
}

.page:last-child {
  page-break-after: auto;
}

/* On screen: each page looks like a physical sheet with shadow.
   On print: shadow removed, each page breaks cleanly. */
@media print {
  body { background: white; }
  .page-container { margin: 0; max-width: none; }
  .page { margin: 0; box-shadow: none; page-break-after: always; }
}
```

**Kết quả**: Trên web, khách hàng xem như đang cầm tập tài liệu A4. Khi Ctrl+P hoặc export Puppeteer ra PDF → mỗi `.page` là một trang riêng, không bị cắt giữa chừng.

## 2. Print compression rules (shrink content for PDF)

Web view có thể dùng font lớn cho dễ đọc. Nhưng khi export PDF, cần **compress** để mọi thứ vừa một trang A4:

```css
@media print {
  /* Compress padding */
  .page {
    padding: 14mm 16mm !important;
    min-height: auto !important;
  }

  /* Compress typography */
  h1 { font-size: 22pt !important; line-height: 1.2 !important; }
  h2 { font-size: 16pt !important; line-height: 1.25 !important; page-break-after: avoid; }
  h3 { font-size: 12pt !important; line-height: 1.3 !important; page-break-after: avoid; }
  p, li, span, div { font-size: 9.5pt !important; line-height: 1.45 !important; }
  .text-sm { font-size: 8pt !important; }
  .text-xs { font-size: 7pt !important; }

  /* Color preservation (CRITICAL for brand colors) */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Shrink spacing */
  .mb-12 { margin-bottom: 1.5rem !important; }
  .mb-8 { margin-bottom: 1rem !important; }
  .py-16 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }

  /* Prevent awkward breaks */
  .avoid-break { page-break-inside: avoid; }
  table, figure, .card { page-break-inside: avoid; }
}
```

**Lý do**: Nếu không compress, 1 trang web 800px cao có thể chiếm 2-3 trang PDF A4. Dùng rules này để compact về ~250mm content cao per page.

## 3. Bilingual toggle (VI / JP / EN) pattern

Cực kỳ hữu ích cho client nước ngoài. User switch ngôn ngữ bằng 1 click, content VI hoặc JP sẽ hiện/ẩn:

```html
<!-- Toggle buttons (fixed top-right) -->
<div class="lang-toggle fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-1 flex gap-1">
  <button id="btn-vi" class="lang-btn active" onclick="setLang('vi')">🇻🇳 VI</button>
  <button id="btn-jp" class="lang-btn inactive" onclick="setLang('jp')">🇯🇵 JP</button>
</div>

<!-- Content with vi/jp classes -->
<h1 class="vi">Nhà máy thông minh 4.0</h1>
<h1 class="jp">スマートファクトリー 4.0</h1>

<p class="vi">Đây là đề xuất cho nhà máy của bạn.</p>
<p class="jp">これは貴社の工場向けの提案です。</p>
```

```css
/* Default: show VI, hide JP */
body.lang-vi .jp { display: none !important; }
body.lang-jp .vi { display: none !important; }

.lang-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}
.lang-btn.active { background: #0284C7; color: white; }
.lang-btn.inactive { background: transparent; color: #64748B; }
.lang-btn.inactive:hover { background: #F1F5F9; }

/* Hide toggle when printing */
@media print {
  .lang-toggle { display: none !important; }
}
```

```js
function setLang(lang) {
  document.body.className = 'antialiased lang-' + lang;
  document.getElementById('btn-vi').className = 'lang-btn ' + (lang === 'vi' ? 'active' : 'inactive');
  document.getElementById('btn-jp').className = 'lang-btn ' + (lang === 'jp' ? 'active' : 'inactive');

  // Optional: swap images with different labels per language
  document.querySelectorAll('[data-img-vi][data-img-jp]').forEach(img => {
    img.src = img.dataset['img' + (lang === 'vi' ? 'Vi' : 'Jp')];
  });
}

// Default: Vietnamese
document.body.className = 'antialiased lang-vi';
```

**Khi export PDF**: cần export 2 phiên bản riêng (VI.pdf và JP.pdf). Set `body.className` trước khi gọi Puppeteer:

```python
await page.evaluate('document.body.className = "antialiased lang-vi"')
await page.pdf({'path': 'proposal-vi.pdf', ...})

await page.evaluate('document.body.className = "antialiased lang-jp"')
await page.pdf({'path': 'proposal-jp.pdf', ...})
```

## 4. Font stack cho multilingual (VI + JP)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

- **Inter**: hỗ trợ tốt cho tiếng Việt (có đủ diacritics), modern, đọc clean
- **Noto Sans JP**: fallback cho tiếng Nhật, matches Inter weight
- Thứ tự quan trọng: Inter trước để ký tự Latin/Việt dùng Inter, ký tự Nhật rơi xuống Noto

## 5. Cover page pattern (1st impression)

```html
<section class="page cover bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white">
  <div class="page-inner flex flex-col justify-between h-full">
    <!-- Top: logos -->
    <div class="flex items-center justify-between">
      <img src="vendor-logo.png" class="h-12" alt="Vendor Logo">
      <div class="text-right text-sm opacity-80">
        <div class="vi">ĐỀ XUẤT HỢP TÁC</div>
        <div class="jp">提案書</div>
        <div class="mt-1">April 2026 · Confidential</div>
      </div>
    </div>

    <!-- Middle: title -->
    <div>
      <div class="text-sky-300 text-sm font-semibold tracking-widest mb-4">
        <span class="vi">DỰ ÁN</span>
        <span class="jp">プロジェクト</span>
      </div>
      <h1 class="text-6xl font-bold leading-tight mb-6">
        <span class="vi">Nhà máy thông minh 4.0</span>
        <span class="jp">スマートファクトリー 4.0</span>
      </h1>
      <p class="text-xl opacity-90 max-w-2xl">
        <span class="vi">Chuyển đổi số toàn diện cho nhà máy truyền thống</span>
        <span class="jp">従来の工場向けの包括的なデジタルトランスフォーメーション</span>
      </p>
    </div>

    <!-- Bottom: client info -->
    <div class="border-t border-white/20 pt-6">
      <div class="text-sm opacity-70 mb-1">Prepared for</div>
      <div class="text-2xl font-semibold">[Client Name]</div>
      <div class="mt-4 text-sm opacity-70">Prepared by [Vendor Team]</div>
    </div>
  </div>
</section>
```

**Key design moves**:
- Dark gradient background (navy → sky blue) — premium feel
- Title takes 70% of visual weight
- Client name positioned prominently — khách hàng thấy tên mình = personalization
- Date + "Confidential" footer — professional

## 6. Executive Summary pattern (dark KPI hero)

```html
<section class="page bg-slate-900 text-white">
  <div class="page-inner">
    <div class="mb-8">
      <span class="text-sky-400 text-sm font-bold tracking-widest">EXECUTIVE SUMMARY</span>
      <h1 class="text-4xl font-bold mt-2">
        <span class="vi">Tóm tắt cho Ban Lãnh Đạo</span>
        <span class="jp">経営陣向けサマリー</span>
      </h1>
    </div>

    <!-- KPI Grid: 3 big numbers -->
    <div class="grid grid-cols-3 gap-6 mb-10">
      <div class="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
        <div class="text-5xl font-bold text-sky-400">-40%</div>
        <div class="text-sm mt-2 opacity-80">
          <span class="vi">Giảm downtime</span>
          <span class="jp">ダウンタイム削減</span>
        </div>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <div class="text-5xl font-bold text-emerald-400">+25%</div>
        <div class="text-sm mt-2 opacity-80">
          <span class="vi">Tăng throughput</span>
          <span class="jp">スループット向上</span>
        </div>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <div class="text-5xl font-bold text-violet-400">18 tháng</div>
        <div class="text-sm mt-2 opacity-80">
          <span class="vi">Thời gian hoàn vốn</span>
          <span class="jp">投資回収期間</span>
        </div>
      </div>
    </div>

    <!-- Narrative -->
    <div class="prose prose-invert max-w-none">
      <p class="text-lg leading-relaxed opacity-90">
        <span class="vi">Đề xuất này giúp nhà máy của quý vị...</span>
        <span class="jp">この提案により...</span>
      </p>
    </div>
  </div>
</section>
```

## 7. Pain Points / Opportunities comparison

```html
<section class="page">
  <div class="page-inner">
    <div class="flex items-center mb-8">
      <span class="bg-sky-100 text-sky-700 w-10 h-10 rounded-lg flex items-center justify-center mr-4 text-xl font-bold">01</span>
      <h2 class="text-3xl font-bold">
        <span class="vi">Hiện trạng & Cơ hội</span>
        <span class="jp">現状と機会</span>
      </h2>
    </div>

    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="bg-slate-100">
          <th class="text-left p-3 font-semibold w-1/4">Quy trình</th>
          <th class="text-left p-3 font-semibold w-1/4 text-rose-700">Hiện trạng</th>
          <th class="text-left p-3 font-semibold w-1/4 text-emerald-700">Mục tiêu</th>
          <th class="text-left p-3 font-semibold w-1/4 text-sky-700">Giá trị</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-slate-200">
          <td class="p-3 font-semibold">Kiểm tra chất lượng</td>
          <td class="p-3 text-slate-600">Thủ công, 30 phút/lô</td>
          <td class="p-3 text-slate-800">AI camera, 2 phút/lô</td>
          <td class="p-3 text-sky-700 font-semibold">+14x tốc độ</td>
        </tr>
        <!-- more rows -->
      </tbody>
    </table>
  </div>
</section>
```

**Pattern**: Section number badge (`01`, `02`, `03`...) + 4-column comparison table (process / current / target / financial benefit) = highly scannable by executives.

## 8. Result cards (color-coded by domain)

```html
<div class="grid grid-cols-2 gap-4">
  <div class="bg-rose-50 border-l-4 border-rose-500 rounded-lg p-5">
    <div class="text-rose-700 text-sm font-bold mb-2">COST REDUCTION</div>
    <div class="text-3xl font-bold text-slate-900">-230M VND</div>
    <div class="text-sm text-slate-600 mt-1">per year</div>
  </div>
  <div class="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-5">
    <div class="text-emerald-700 text-sm font-bold mb-2">REVENUE UPLIFT</div>
    <div class="text-3xl font-bold text-slate-900">+1.2B VND</div>
    <div class="text-sm text-slate-600 mt-1">per year</div>
  </div>
  <div class="bg-sky-50 border-l-4 border-sky-500 rounded-lg p-5">
    <!-- ... -->
  </div>
  <div class="bg-violet-50 border-l-4 border-violet-500 rounded-lg p-5">
    <!-- ... -->
  </div>
</div>
```

**Color semantics**:
- `rose-50/500` → cost, pain, loss (negative framing)
- `emerald-50/500` → growth, revenue, gain
- `sky-50/500` → efficiency, speed, time
- `violet-50/500` → innovation, advanced
- `orange-50/500` → urgency, warning
- `teal-50/500` → sustainability, ROI

## 9. 3-tier Pricing pattern với "Recommended" badge

```html
<div class="grid grid-cols-3 gap-6">
  <!-- Tier 1: Starter -->
  <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 relative">
    <h3 class="text-xl font-bold mb-2">Starter</h3>
    <div class="text-4xl font-bold mb-1">500M<span class="text-base font-normal text-slate-500"> VND</span></div>
    <p class="text-sm text-slate-500 mb-6">Core package, 3 months</p>
    <ul class="space-y-2 text-sm">
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> 5 MES modules</li>
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Basic dashboard</li>
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Training 2 days</li>
      <li class="flex items-start text-slate-400"><span class="mr-2">—</span> AI inspection</li>
    </ul>
  </div>

  <!-- Tier 2: Recommended (middle, emphasized) -->
  <div class="bg-slate-900 text-white rounded-2xl p-6 relative transform scale-105 shadow-2xl">
    <div class="absolute top-0 right-0 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
      ĐỀ XUẤT
    </div>
    <h3 class="text-xl font-bold mb-2">Professional</h3>
    <div class="text-4xl font-bold mb-1">1.2B<span class="text-base font-normal opacity-70"> VND</span></div>
    <p class="text-sm opacity-70 mb-6">Full package, 6 months</p>
    <ul class="space-y-2 text-sm">
      <li class="flex items-start"><span class="text-sky-400 mr-2">✓</span> All 12 MES modules</li>
      <li class="flex items-start"><span class="text-sky-400 mr-2">✓</span> AI quality inspection</li>
      <li class="flex items-start"><span class="text-sky-400 mr-2">✓</span> Advanced analytics</li>
      <li class="flex items-start"><span class="text-sky-400 mr-2">✓</span> On-site training 5 days</li>
    </ul>
  </div>

  <!-- Tier 3: Enterprise -->
  <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 relative">
    <h3 class="text-xl font-bold mb-2">Enterprise</h3>
    <div class="text-4xl font-bold mb-1">Custom</div>
    <p class="text-sm text-slate-500 mb-6">Tailored, ongoing</p>
    <ul class="space-y-2 text-sm">
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Everything in Pro</li>
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Multi-plant support</li>
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> 24/7 dedicated team</li>
      <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> SLA P1 &lt; 1h</li>
    </ul>
  </div>
</div>
```

**Key moves**:
- Middle tier `transform scale-105` + dark bg → eyes drawn to it
- "ĐỀ XUẤT" badge (Vietnamese for "Recommended") top-right corner
- Checkmarks `✓` in semantic colors; `—` for excluded features
- Prices with unit (VND) in smaller weight

## 10. Timeline / Roadmap pattern

```html
<div class="relative">
  <!-- Phase 1 -->
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="text-sm text-sky-600 font-bold">PHASE 1 · Month 1-2</div>
    <h3 class="text-xl font-bold mt-1 mb-2">Discovery & Setup</h3>
    <p class="text-sm text-slate-600">Site audit, infrastructure readiness, team onboarding, architecture design.</p>
    <div class="mt-3 flex gap-2 flex-wrap">
      <span class="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded">Audit</span>
      <span class="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded">Architecture</span>
    </div>
  </div>

  <!-- Phase 2 -->
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="text-sm text-sky-600 font-bold">PHASE 2 · Month 3-4</div>
    <h3 class="text-xl font-bold mt-1 mb-2">Pilot Implementation</h3>
    <!-- ... -->
  </div>
</div>
```

```css
.timeline-item {
  border-left: 2px solid #E2E8F0;
  padding-left: 24px;
  padding-bottom: 24px;
  position: relative;
}
.timeline-item:last-child { padding-bottom: 0; border-left-color: transparent; }

.timeline-dot {
  width: 14px;
  height: 14px;
  background: #0284C7;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #0284C7;
  border-radius: 50%;
  position: absolute;
  left: -8px;
  top: 4px;
}
```

## 11. Closing CTA page

```html
<section class="page bg-gradient-to-br from-slate-900 to-sky-900 text-white">
  <div class="page-inner flex flex-col justify-center h-full text-center">
    <div class="text-sky-300 text-sm font-bold tracking-widest mb-4">NEXT STEPS</div>
    <h1 class="text-5xl font-bold mb-6 max-w-3xl mx-auto">
      <span class="vi">Sẵn sàng bắt đầu?</span>
      <span class="jp">始める準備はできましたか？</span>
    </h1>
    <p class="text-xl opacity-90 max-w-2xl mx-auto mb-10">
      <span class="vi">Hãy cùng đặt lịch buổi workshop 2 giờ để tùy chỉnh đề xuất này cho nhà máy của quý vị.</span>
      <span class="jp">...</span>
    </p>

    <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
      <div class="grid grid-cols-2 gap-6 text-left">
        <div>
          <div class="text-xs opacity-70 mb-1">CONTACT</div>
          <div class="font-semibold">Nguyễn Văn A</div>
          <div class="text-sm opacity-80">Head of Sales</div>
        </div>
        <div>
          <div class="text-xs opacity-70 mb-1">EMAIL</div>
          <div class="font-semibold">sales@danaexperts.com</div>
          <div class="text-sm opacity-80">+84 xxx xxx xxx</div>
        </div>
      </div>
    </div>

    <div class="mt-8 text-sm opacity-60">
      © 2026 [Vendor Name] · Confidential — For [Client Name] only
    </div>
  </div>
</section>
```

## 12. Full 15-page structure (battle-tested)

Thứ tự các trang đã được proven với enterprise clients:

```
Page 1   — COVER (gradient, client name, date)
Page 2   — EXECUTIVE SUMMARY (dark hero, 3 KPIs, narrative)
Page 3   — PAIN POINTS (comparison table: current vs target)
Page 4   — SOLUTION OVERVIEW (workflow diagram, 3-5 steps)
Page 5-7 — DEEP DIVE (1 page per workstream/module)
Page 8   — PROOF OF CAPABILITY (case study 1: logo + result numbers)
Page 9   — CASE STUDY 2 (optional, another proof point)
Page 10  — ROI BREAKDOWN (cost savings + revenue uplift, numbers)
Page 11  — WORKFORCE / TEAM ALLOCATION (who does what, hours)
Page 12  — PRICING (3-tier with recommended)
Page 13  — ROADMAP / TIMELINE (4-6 phases)
Page 14  — RISK & CHANGE MANAGEMENT (top 5 risks + mitigations)
Page 15  — CLOSING / CTA (contact info, next step)
```

**Rule**: Không bao giờ quá 15 pages trừ khi enterprise đặt hàng. Người đọc không scroll qua trang 15.

## 13. CSS variables cho brand theming (production-ready)

```css
:root {
  /* Primary brand */
  --primary: #0F172A;          /* slate-900 */
  --primary-light: #1E293B;    /* slate-800 */
  --accent: #0284C7;           /* sky-600 */
  --accent-light: #38BDF8;     /* sky-400 */

  /* Semantic */
  --success: #10B981;          /* emerald-500 */
  --warning: #F59E0B;          /* amber-500 */
  --danger: #EF4444;           /* red-500 */

  /* Neutral */
  --surface: #F8FAFC;          /* slate-50 */
  --surface-dark: #0F172A;     /* slate-900 */
  --text: #0F172A;
  --text-muted: #64748B;       /* slate-500 */
  --border: #E2E8F0;           /* slate-200 */

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans JP', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Print */
  --page-width: 210mm;
  --page-height: 297mm;
  --page-margin: 20mm;
}
```

Khách hàng khác chỉ cần đổi `--accent` và `--primary` để rebrand toàn bộ proposal trong 5 giây.

## 14. Fonts + Tailwind CDN setup (one-line)

```html
<head>
  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts: Inter + Noto Sans JP -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Tailwind config inline -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
          },
        },
      },
    };
  </script>
</head>
```

**Lưu ý**: Tailwind CDN không work offline. Nếu cần offline (client đọc trên máy không có net), dùng `pip install tailwindcss` build CSS static trước.

## 15. Puppeteer PDF export script chuẩn (bilingual)

```python
import asyncio
from pyppeteer import launch
from pathlib import Path

async def export_bilingual_proposal(html_path: str, out_dir: str):
    browser = await launch(args=['--no-sandbox', '--disable-setuid-sandbox'])
    page = await browser.newPage()

    # Load HTML
    abs_path = Path(html_path).resolve()
    await page.goto(f'file://{abs_path}', {'waitUntil': 'networkidle0'})

    # Wait for fonts
    await page.evaluate('document.fonts.ready')

    for lang in ['vi', 'jp']:
        # Switch language via class
        await page.evaluate(f'document.body.className = "antialiased lang-{lang}"')

        # Export PDF
        await page.pdf({
            'path': f'{out_dir}/proposal-{lang}.pdf',
            'format': 'A4',
            'printBackground': True,  # CRITICAL for brand colors
            'preferCSSPageSize': True,
            'margin': {'top': '0', 'bottom': '0', 'left': '0', 'right': '0'},
        })
        print(f'✓ Exported proposal-{lang}.pdf')

    await browser.close()

asyncio.run(export_bilingual_proposal(
    '/sessions/eager-confident-dijkstra/mnt/claude-share-skill/proposal.html',
    '/sessions/eager-confident-dijkstra/mnt/claude-share-skill/'
))
```

**Key flags**:
- `printBackground: True` → giữ gradient và màu brand (không giữ thì cover page ra trắng tinh)
- `preferCSSPageSize: True` → honor `@page { size: A4 }` trong CSS
- Margin 0 ở đây vì đã set `.page { padding: 20mm }` rồi
- `document.fonts.ready` → đợi Inter/Noto Sans JP load trước khi render

## 16. Common mistakes cần tránh

- **Không test print preview trước khi export** → kết quả PDF khác web hoàn toàn
- **Quên `printBackground: true`** → gradient background trắng tinh
- **Dùng `vh/vw` thay vì `mm`** → proposal không fit A4
- **Image PNG 2000px cho print** → PDF file > 20MB, không gửi email được
- **Font Google Fonts không load offline** → client ngắt net thấy Times New Roman
- **Text chồng lên page break** → dùng `page-break-inside: avoid` cho `.card`, `table`
- **Không có `page-break-after: avoid` cho H2** → heading dính trang cũ, content sang trang mới
- **Màu brand không consistent** → dùng CSS variables ngay từ đầu
- **Forget mobile preview** → nếu client mở HTML trên điện thoại, layout vỡ → dùng responsive với breakpoint `lg:` cho print layout
- **Export 1 file PDF dài → gắp khổ in rồi mới nhận ra sai** → luôn preview trên browser Ctrl+P trước khi Puppeteer export

## 17. Workflow nâng cao (multi-language proposal)

1. Đọc skill `pdf` và `design-system` trước
2. Hỏi user: ngôn ngữ (VI, EN, JP, song ngữ?), brand, logo, số pages target
3. Setup `<head>`: Tailwind + Google Fonts + CSS variables
4. Build cover page trước (60% first-impression weight)
5. Build executive summary (KPI hero) — nếu approve → tiếp
6. Build các pages nội dung
7. Add `class="vi"` / `class="jp"` cho mọi text node
8. Add language toggle JS
9. Test trên web: switch language, visual OK?
10. Test print preview Ctrl+P → fix overflows, broken tables
11. Run Puppeteer export cho cả 2 ngôn ngữ
12. Check PDF file size (<10MB), check từng trang
13. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link cả HTML + PDF
