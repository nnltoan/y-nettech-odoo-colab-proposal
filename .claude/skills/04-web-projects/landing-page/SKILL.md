---
name: landing-page
description: Create high-converting company landing pages, marketing websites, and single-page product sites with responsive design and SEO optimization. Use this skill when the user mentions 'landing page', 'trang chủ công ty', 'website công ty', 'company website', 'marketing site', 'product page', 'homepage', 'hero section', 'one-page website', 'SEO landing page', or needs to build a page that presents a company/product to visitors and drives conversions. Outputs include single-file HTML, React component, or Next.js page with Tailwind CSS. Combines with design-system skill for brand consistency.
---

# Landing Page Skill

Tạo **landing page công ty / sản phẩm** với focus vào **conversion, SEO, performance, và responsive**. Skill này cover từ cấu trúc section, copywriting, đến implementation technical.

## Khi nào dùng

Trigger khi user nói:
- "Tạo landing page cho công ty"
- "Làm trang chủ giới thiệu sản phẩm"
- "Website công ty một trang"
- "Hero section đẹp"
- "Marketing page"
- "Company homepage"
- "One-page website"

**Không** dùng khi:
- User cần web app có nhiều trang phức tạp → dùng `demo-webapp`
- User cần admin CMS → dùng `cms-admin-seo`

## Thông tin cần thu thập

1. **Purpose**: Giới thiệu công ty? Bán sản phẩm? Lead generation? Event?
2. **Brand**: Logo, màu sắc chính/phụ, font preference, style (modern/corporate/creative)
3. **Target audience**: B2B enterprise / B2C / SMB / developers?
4. **Key value proposition**: Câu tagline chính là gì?
5. **Call-to-action**: Muốn user làm gì? (Sign up / Book demo / Buy / Contact)
6. **Content available**: Có sẵn text/images chưa hay cần placeholder?
7. **Tech stack output**:
   - Single HTML file (simple, portable)
   - React component (cho app có sẵn)
   - Next.js page (SEO + SSR)
   - Plain static site
8. **Ngôn ngữ**: Tiếng Việt / English / Song ngữ?
9. **SEO**: Keywords target? Meta info cần có?

## Cấu trúc landing page chuẩn (10 sections)

### 1. Navigation (sticky header)
- Logo bên trái
- Menu items (5-7 items max): Features, Pricing, About, Blog, Contact
- CTA button bên phải: "Get Started" / "Book Demo"
- Mobile: hamburger menu
- Sticky on scroll

### 2. Hero Section ⭐ QUAN TRỌNG NHẤT
Phần user thấy đầu tiên, quyết định bounce rate:
```
[Eyebrow text - optional]
# Main headline (H1) - clear value proposition
Subheadline explaining what you do and who it's for

[Primary CTA button] [Secondary CTA button]

[Hero visual - product screenshot / illustration / video]

[Social proof - "Trusted by 500+ companies" / client logos]
```

**Rules for hero**:
- Headline < 10 từ, rõ ràng
- Subheadline giải thích trong 1 câu
- CTA button nổi bật, action-oriented
- Visual tốt hơn stock photo
- Above the fold: không scroll mà thấy hết hero

### 3. Social Proof Bar
- Logos của khách hàng nổi bật (grayscale)
- Số liệu: "10,000+ users", "99.9% uptime"
- Awards / certifications

### 4. Features Section (3-6 features)
Grid layout, mỗi feature:
- Icon (24px, consistent style)
- Title (3-5 words)
- Description (1-2 sentences)
- Optional: "Learn more" link

**Layout options**:
- 3 columns (grid)
- Alternating image-text rows
- Accordion (collapsible)
- Tab-based

### 5. How It Works (3-4 steps)
Visual explanation của user flow:
```
[Step 1 icon]  →  [Step 2 icon]  →  [Step 3 icon]
Sign up          Upload data      Get insights
```

### 6. Testimonials
- Real quotes from real customers
- Include: photo, name, title, company
- Rotating carousel hoặc grid 3 columns
- Include star rating nếu có

### 7. Pricing (nếu applicable)
3 tier card layout:
```
Starter         Pro (most popular)    Enterprise
$29/mo         $99/mo                 Custom
- 10 users     - 100 users            - Unlimited
- 10GB         - 100GB                - Unlimited
- Email        - Priority             - Dedicated
[Start free]   [Start trial]          [Contact sales]
```

### 8. FAQ Section (5-10 items)
Collapsible accordion:
- Câu hỏi về pricing
- Security/privacy
- Cancellation
- Support
- Integration

### 9. Final CTA Section
Giống hero, nhưng strong hơn:
```
Ready to [action]?
Join 1,000+ companies already using [product]
[Big CTA button] [Secondary option]
```

### 10. Footer
- Logo + tagline
- Columns: Product, Company, Resources, Legal
- Social media icons
- Newsletter signup (optional)
- Copyright + compliance links
- Language switcher (nếu multi-lang)

## Design Principles

### Visual Hierarchy
1. **Size**: Headline > subheadline > body
2. **Color**: Primary actions contrast strong
3. **Spacing**: Breathing room - white space is valuable
4. **Typography**: Max 2 font families (1 cho headings, 1 cho body)

### Color Palette (example)
```
Primary:       Brand color (buttons, links)
Primary-dark:  Hover state
Secondary:     Accent (highlights)
Text-primary:  #1A1A1A (headings, body)
Text-secondary: #6B7280 (captions, labels)
Bg:            #FFFFFF
Bg-soft:       #F9FAFB (section dividers)
Border:        #E5E7EB
Success:       #10B981
```

### Typography Scale (Tailwind)
```
Hero headline:    text-5xl md:text-6xl font-bold leading-tight
Section heading:  text-3xl md:text-4xl font-bold
Subheadline:      text-xl md:text-2xl text-gray-600
Body:             text-base md:text-lg leading-relaxed
Small:            text-sm text-gray-500
```

### Spacing (Tailwind)
```
Section padding:  py-16 md:py-24
Section gap:      space-y-6
Grid gap:         gap-8
Button padding:   px-6 py-3
```

## Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768-1024px (2 columns)
- Desktop: > 1024px (3+ columns)
- Max width: 1280px (centered)

## Tech Implementation

### Option A: Single HTML file (simplest)
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand - Tagline</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css">
  <script src="https://unpkg.com/alpinejs@3/dist/cdn.min.js" defer></script>
</head>
<body class="font-sans text-gray-900">
  <!-- Nav, Hero, Features, etc. -->
</body>
</html>
```

### Option B: React Component (if in React app)
Create `LandingPage.jsx` with sections as sub-components.

### Option C: Next.js (best for SEO)
```
app/
├── page.tsx              # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Testimonials.tsx
│   └── Footer.tsx
└── layout.tsx
```

### Dependencies
- **Tailwind CSS**: Utility-first styling
- **Framer Motion** (optional): Scroll animations
- **Lucide React**: Icon library
- **Next/Image**: Optimized images (Next.js)

## SEO Optimization

### Required meta tags
```html
<title>Brand - Clear value proposition (max 60 chars)</title>
<meta name="description" content="Who you are and what you do (max 160 chars)">
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta property="og:url" content="https://yoursite.com">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://yoursite.com/twitter-image.jpg">

<!-- Canonical -->
<link rel="canonical" href="https://yoursite.com">
```

### Structured Data (JSON-LD)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84...",
    "contactType": "customer service"
  }
}
</script>
```

### On-page SEO
- H1 chỉ có 1 lần trong page (trong Hero)
- H2 cho section headings, H3 cho subsections
- Alt text cho mọi image
- Descriptive link text ("Read more" → "Read our pricing guide")
- Semantic HTML (nav, main, section, article, footer)
- Mobile-friendly (responsive)
- Page speed < 3s (optimize images, lazy load)

### Technical SEO
- robots.txt
- sitemap.xml
- HTTPS
- Schema markup
- Clean URLs
- 404 page

## Performance Checklist
- [ ] Images: WebP format, lazy loading, responsive srcset
- [ ] Fonts: Subset, preload, system font fallback
- [ ] CSS: Tailwind purge, critical CSS inline
- [ ] JS: Minimal, defer non-critical
- [ ] Lighthouse score > 90 on all metrics
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

## Copywriting Tips

### Headlines
- **Bad**: "Innovative Solutions for Modern Businesses"
- **Good**: "Stop losing customers to slow checkout. [Product] cuts checkout time in half."

### Value props
- **Bad**: "Powerful features"
- **Good**: "Process 10,000 orders per day without a glitch"

### CTA buttons
- **Bad**: "Submit" / "Click here"
- **Good**: "Start free trial" / "Book a 15-min demo" / "Get my quote"

### Trust signals
- Số liệu cụ thể > claim chung
- "Used by X Fortune 500 companies" > "Trusted by leading companies"
- Before/after numbers
- Real testimonials with photos

## Workflow chuẩn

1. Đọc các skill liên quan:
   - `design-system` nếu cần brand consistency — `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/.claude/skills/05-design-ui/design-system/SKILL.md`
   - `ui-ux-pro-max-skill` project nếu cần design inspiration — `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/.claude/skills/05-design-ui/ui-ux-pro-max-skill/`
2. Hỏi user: purpose, brand, audience, CTA, tech stack
3. Định nghĩa color palette + typography scale
4. Wireframe section structure trước (không code)
5. Write copy (headline, subheadline, body)
6. Implement HTML + Tailwind, section by section
7. Add interactions (smooth scroll, animations)
8. Test responsive (mobile, tablet, desktop)
9. Run Lighthouse audit
10. Save output in `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link

## Lỗi thường gặp cần tránh

- **Generic stock photos**: Dùng real product screenshot hoặc custom illustration
- **Too much text in hero**: Hero phải clean, impact
- **Multiple CTAs fighting**: 1 primary CTA, 1 secondary, không hơn
- **Unclear value prop**: User phải hiểu bạn làm gì trong 5 giây
- **No social proof**: Landing page không có testimonial/logos → trust thấp
- **Broken mobile**: Luôn test trên thật (không chỉ dev tools)
- **Slow load time**: Images không optimize là killer
- **Bad SEO**: Thiếu meta, H1, alt text
