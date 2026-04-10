---
name: cms-admin-seo
description: Build admin CMS panels for content management with built-in SEO tools, blog post management, meta fields, and publishing workflows. Use this skill when the user mentions 'admin CMS', 'quản lý bài viết', 'blog management', 'content management', 'admin panel', 'SEO admin', 'publishing workflow', 'post editor', 'editorial dashboard', 'rich text editor', 'meta fields', 'schema markup', or wants to create a backend interface to manage website content. Works alongside landing-page skill when the landing page needs a blog section with dynamic content.
---

# CMS Admin + SEO Skill

Tạo **admin panel quản lý bài viết** với **tính năng SEO đầy đủ**. Skill này dành cho các dự án cần backend để quản lý content (blog posts, news, case studies, landing pages) và tối ưu SEO.

## Khi nào dùng

Trigger khi user nói:
- "Làm admin CMS quản lý blog"
- "Admin panel cho website công ty"
- "Quản lý bài viết + SEO"
- "Content management system"
- "Blog dashboard"
- "Rich text editor cho admin"
- "Publishing workflow"

**Không** dùng khi:
- User chỉ cần landing page không có blog → dùng `landing-page`
- User cần demo app general purpose → dùng `demo-webapp`

## Thông tin cần thu thập

1. **Purpose**: Blog cá nhân? Company blog? News site? Multi-author?
2. **Content types**: Posts only? Pages? Products? Case studies? Custom types?
3. **User roles**:
   - Single admin?
   - Multi-role (admin, editor, author, contributor)?
4. **Editor preference**:
   - Rich text (WYSIWYG như Notion/Medium)
   - Markdown
   - Block-based (như WordPress Gutenberg)
5. **Publishing workflow**: Draft → Review → Publish? Hay direct publish?
6. **Media management**: Upload images, video, files? CDN?
7. **SEO features**: Meta, schema, redirects, sitemap?
8. **Multi-language**: Có cần i18n không?
9. **Tech stack**:
   - Full-stack: Next.js + Supabase
   - Backend API: Node.js/Python + React admin
   - Headless CMS: Strapi, Sanity, Directus, Payload
10. **Integration**: Cần connect với landing page hiện có không?

## Các tính năng core của CMS

### 1. Authentication & User Management
- Login (email/password, SSO optional)
- User roles & permissions:
  - **Admin**: Full access, manage users, site settings
  - **Editor**: Create/edit/publish any content
  - **Author**: Create/edit own content, submit for review
  - **Contributor**: Create drafts only
- Password recovery
- 2FA (optional for admin)

### 2. Content List View
Dashboard với table view:
```
| Title              | Status    | Author    | Category | Published At | Actions |
|--------------------|-----------|-----------|----------|--------------|---------|
| My First Post      | Published | John Doe  | News     | 2026-03-15   | ✏️ 👁 🗑  |
| Draft Article      | Draft     | Jane      | Tech     | -            | ✏️ 👁 🗑  |
| Featured Review    | Scheduled | Admin     | Reviews  | 2026-04-10   | ✏️ 👁 🗑  |
```

**Features**:
- Search (title, content, author)
- Filter (status, category, author, date range)
- Sort (newest, oldest, most viewed, alphabetical)
- Bulk actions (publish, unpublish, delete)
- Pagination (20-50 per page)
- Quick edit (inline)

### 3. Content Editor
Main editor with sections:

**Basic fields**:
- Title (required)
- Slug (auto-generated from title, editable)
- Content (rich text/markdown/blocks)
- Excerpt (for previews, auto from first paragraph)
- Featured image (with alt text)
- Category (dropdown)
- Tags (multi-select with autocomplete)
- Status: Draft / Pending Review / Scheduled / Published

**Editor features**:
- Rich text formatting (bold, italic, underline, strikethrough)
- Headings (H1-H6)
- Lists (bullet, numbered)
- Links (internal search, external URL)
- Images (upload, paste from URL, from library)
- Embeds (YouTube, Twitter, CodePen)
- Code blocks with syntax highlighting
- Tables
- Quotes
- Horizontal rule

**Rich text editor options**:
- **TipTap** (recommended): headless, customizable, React/Vue
- **Lexical** (Meta): modern, extensible
- **Slate**: flexible but complex
- **Quill**: mature, easy to use
- **Editor.js**: block-based (like Notion)

### 4. SEO Sidebar ⭐ Quan trọng

Mỗi content editor phải có SEO panel:

**Meta Information**:
- **SEO Title** (max 60 chars, preview Google SERP)
- **Meta Description** (max 160 chars, preview)
- **Focus Keyword** (primary)
- **Additional Keywords**

**SEO Analysis** (real-time score 0-100):
- ✅ Focus keyword in title
- ✅ Focus keyword in first paragraph
- ✅ Focus keyword density 1-3%
- ✅ Internal links present
- ✅ External links present
- ✅ Image alt texts
- ✅ Content length > 300 words
- ✅ Meta description length OK
- ✅ URL slug contains keyword
- ⚠️ Transition words
- ⚠️ Sentence length
- ⚠️ Paragraph length

**Social Sharing (Open Graph)**:
- OG title
- OG description
- OG image (1200x630 recommended)
- Twitter Card type
- Twitter-specific title/description

**Schema Markup**:
- Article / BlogPosting / NewsArticle / Product
- Author, datePublished, dateModified
- Preview JSON-LD output

**Advanced SEO**:
- Canonical URL
- Robots meta (index/noindex, follow/nofollow)
- Redirect (301 from old URL)

### 5. Media Library
- Upload images (drag-drop, bulk)
- Auto-generate thumbnails (multiple sizes)
- Image optimization (WebP conversion, compression)
- Alt text (SEO + accessibility)
- Caption, description
- Folders / tags for organization
- Search by filename, alt text
- Quick copy URL
- Delete with confirmation

### 6. Categories & Tags Manager
- Create/edit/delete categories
- Hierarchical categories (parent/child)
- Category description (for category page SEO)
- Category image
- Tag cloud view
- Merge tags (combine duplicates)

### 7. Comments Management (optional)
- List all comments
- Approve / spam / trash
- Reply inline
- Bulk actions
- Spam detection (Akismet-like)

### 8. Settings
- **General**: Site title, tagline, timezone, language
- **SEO**: Default meta templates, sitemap settings, robots.txt
- **Social**: Social profiles, default OG image
- **Analytics**: GA/Mixpanel/Plausible integration
- **Email**: SMTP settings, notification templates

### 9. Analytics Dashboard
- Page views (by post, by day/week/month)
- Top posts
- Top referrers
- Search queries
- Bounce rate
- Device breakdown
- Integrate with GA4 / Plausible / Umami

## SEO Features Deep Dive

### 1. Sitemap Generation
Auto-generate `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-04-09</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/post-slug</loc>
    <lastmod>2026-04-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2. robots.txt
- Configurable via admin
- Default: allow all, disallow /admin

### 3. Structured Data (JSON-LD)

For blog post:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Site Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-04-09",
  "dateModified": "2026-04-09"
}
```

### 4. URL Structure
- Clean URLs: `/blog/post-title` (not `/blog.php?id=123`)
- Category in URL: `/blog/category/post-title` (optional)
- Trailing slash consistency
- 301 redirects for changed slugs
- No spaces, special chars in slugs

### 5. Internal Linking
Editor feature: "Find internal link" — autocomplete from existing posts. Helps with SEO juice distribution.

### 6. Image SEO
- Auto-fill alt text suggestion
- Title attribute
- Lazy loading by default
- WebP format
- Responsive srcset
- Filename should be descriptive

### 7. Page Speed
- Cache HTML
- CDN for assets
- Minify CSS/JS
- Gzip/Brotli compression
- Lazy load images
- Preload critical fonts

### 8. Monitoring
- Broken links detector
- 404 error log with analytics
- Search Console integration
- Core Web Vitals monitoring

## Tech Stack Recommendations

### Option A: Full Stack — Next.js + Supabase
**Best for**: Quick start, small to medium site
```
Frontend: Next.js 14 (App Router)
Backend: Next.js API routes
Database: Supabase (PostgreSQL)
Auth: Supabase Auth
Storage: Supabase Storage
ORM: Drizzle or Prisma
Editor: TipTap
Styling: Tailwind + shadcn/ui
```

### Option B: Headless CMS — Sanity/Strapi + Next.js
**Best for**: Large site, multiple devs, content team
```
CMS: Sanity Studio (best editor UX)
     OR Strapi (self-hosted, open source)
     OR Directus (open source, SQL-based)
     OR Payload (code-first, TypeScript)
Frontend: Next.js consuming API
Deploy: Vercel + Sanity/Strapi cloud
```

### Option C: MERN Stack (Classic)
**Best for**: Custom backend requirements
```
Frontend: React + React Router
State: Zustand or Redux Toolkit
API client: Axios or TanStack Query
Backend: Node.js + Express
Database: MongoDB or PostgreSQL
Auth: JWT + bcrypt
Editor: TipTap
Styling: Tailwind
```

### Option D: Laravel + Vue (PHP stack)
**Best for**: Traditional hosting, PHP team
```
Frontend: Vue 3 + Inertia.js
Backend: Laravel 10+
Database: MySQL/PostgreSQL
Admin: Filament or custom
```

## UI/UX for Admin Panels

### Layout
```
┌─────────────────────────────────────────┐
│  Logo    [search]         User Avatar   │ ← Topbar
├────────┬────────────────────────────────┤
│ Dashbrd│                                │
│ Posts  │        Main Content            │ ← Main area
│ Media  │                                │
│ SEO    │                                │
│ Users  │                                │
│ Settings│                               │
└────────┴────────────────────────────────┘
  Sidebar
```

### Design principles
- **Information density**: Admin users want to see data, not whitespace
- **Fast navigation**: Keyboard shortcuts (cmd+k for search)
- **Bulk actions**: Always allow selecting multiple items
- **Undo**: Confirm destructive actions, offer undo
- **Responsive**: Desktop-first but must work on tablet
- **Dark mode**: Many admins work late, offer dark mode

### Component library recommendations
- **shadcn/ui**: Modern, customizable, copy-paste components
- **Ant Design**: Complete set, Chinese enterprise heritage
- **Mantine**: Hooks + components, TypeScript-first
- **Chakra UI**: Accessible, modular
- **Material UI**: Mature, many examples

## Workflow chuẩn

1. Đọc `landing-page` skill nếu cần build frontend matching
2. Hỏi user: content types, user roles, editor preference, tech stack
3. Define data model (tables: users, posts, categories, tags, media)
4. Setup backend (database + API)
5. Build authentication
6. Build content list view (with search/filter)
7. Build content editor with rich text
8. Add SEO sidebar với live preview
9. Build media library
10. Build settings page
11. Test publishing workflow
12. Save and share output in `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/`

## Delivery as Demo

Nếu user muốn demo (không phải production):
- Single-file React component (với mock data)
- No real backend — dùng localStorage hoặc in-memory state
- Focus vào UX/UI experience
- Placeholder for real integration points

Nếu user muốn production-ready:
- Proper separation: frontend, backend, database
- Migration scripts
- Seed data
- Docker setup
- Environment variables
- README với setup instructions

## Checklist quality

- [ ] Authentication secure (bcrypt, JWT, HTTPS)
- [ ] Role permissions enforced (không chỉ hide UI)
- [ ] XSS protection trong rich text editor
- [ ] CSRF tokens cho mutations
- [ ] Rate limiting trên API
- [ ] File upload validation (size, type)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Auto-save drafts mỗi 30 giây
- [ ] Preview trước khi publish
- [ ] Undo delete (soft delete, 30 days)
- [ ] Search works fast (< 200ms)
- [ ] SEO sidebar actionable (real recommendations)
- [ ] Sitemap auto-update khi publish
- [ ] Mobile responsive admin (for emergency edits)
