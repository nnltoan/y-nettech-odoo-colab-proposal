---
name: demo-webapp
description: Rapidly build demo web applications, clickable prototypes, proof-of-concept web apps, and interactive product demos. Use this skill when the user mentions 'demo app', 'demo web app', 'prototype', 'POC', 'proof of concept', 'clickable demo', 'interactive demo', 'sample app', 'demo cho khách hàng', 'web app mẫu', 'tạo app demo', or wants to quickly visualize a web application idea without building full production code. Outputs single-file React components or small Next.js apps with mock data, focusing on UX/UI experience rather than backend robustness.
---

# Demo Web App Skill

Tạo **demo web app nhanh** để showcase ý tưởng, pitching khách hàng, hoặc làm POC. Skill này **ưu tiên tốc độ và UX trên production-ready code** — mục tiêu là có thứ chạy được, nhìn đẹp, trong thời gian ngắn nhất.

## Khi nào dùng

Trigger khi user nói:
- "Tạo demo app cho khách hàng"
- "Làm prototype web app"
- "POC cho dự án X"
- "Demo clickable"
- "Web app mẫu để show"
- "Interactive demo"
- "Sample app"

**Không** dùng khi:
- User cần landing page tĩnh → dùng `landing-page`
- User cần admin CMS → dùng `cms-admin-seo`
- User cần production app thật → cần phân tích kỹ, không phải quick demo

## Triết lý xây demo app

### Priority (cao → thấp)
1. **UX/UI đẹp** — ấn tượng đầu tiên là visual
2. **Interactivity** — user phải click được, state thay đổi
3. **Realistic data** — mock data phải giống thật, không lorem ipsum
4. **Happy path** — demo không cần handle edge cases
5. **Mobile responsive** — nhiều khách xem trên phone
6. **Fast load** — < 2 giây

### Anti-priority (bỏ qua trong demo)
- ❌ Real backend / database (dùng mock data in memory)
- ❌ Authentication thật (fake login)
- ❌ Error handling đầy đủ
- ❌ Performance optimization cực đại
- ❌ Accessibility 100% (cố gắng, nhưng không over-engineer)
- ❌ Test coverage
- ❌ Scalability

## Thông tin cần thu thập

1. **Purpose**: Demo cho ai? (Khách hàng sales pitch? Investor? Internal stakeholder?)
2. **Domain**: Ngành gì? (SaaS B2B? E-commerce? Healthcare? Fintech? Logistics?)
3. **Key flows cần show**: Top 3-5 user journeys (vd: đăng ký, tạo project, share, analytics)
4. **Brand**: Có brand guidelines chưa? Màu, logo?
5. **Style**: Modern minimal? Data-dense enterprise? Playful consumer?
6. **Platform**: Desktop-first, mobile-first, hay cả hai?
7. **Tech preference**:
   - Single HTML file (no build, instant)
   - React component (một file .jsx)
   - Next.js app (nếu cần multi-page)
8. **Thời gian demo**: 5 phút? 30 phút? Ảnh hưởng đến độ sâu features
9. **Deliverable**: Link demo, video record, hay source code?

## Tech Stack khuyến nghị

### Option A: Single React Component (.jsx)
**Use case**: Dashboard hoặc single screen demo
- No build step
- Tailwind CSS via CDN
- React hooks cho state
- Mock data inline
- Lucide icons
- Recharts cho charts

**Pros**: Instant preview, easy share, no setup
**Cons**: Không nhiều page

### Option B: Next.js App (multi-page)
**Use case**: Demo đa màn hình (dashboard, detail, settings...)
```
app/
├── page.tsx          # Dashboard
├── projects/
│   ├── page.tsx      # Project list
│   └── [id]/page.tsx # Project detail
├── settings/page.tsx
└── layout.tsx
```

**Pros**: Realistic app structure, navigation
**Cons**: Cần build, nhiều file

### Option C: Single HTML + Alpine.js
**Use case**: Landing page with interactive elements
- No React needed
- Alpine.js for simple state
- Tailwind via CDN
- Single file

**Pros**: Smallest footprint, easy to email
**Cons**: Complex state khó quản lý

## Common Demo Patterns

### Pattern 1: SaaS Dashboard Demo
Sections cần có:
```
[Sidebar Navigation]
├── Dashboard (overview)
├── Projects / Items
├── Analytics (with charts)
├── Team / Users
├── Settings
└── Help

[Top bar]
├── Search
├── Notifications (badge)
├── User menu

[Main area]
├── Page title + actions
├── KPI cards (4-6)
├── Charts (line, bar, pie)
├── Recent activity table
└── Quick actions
```

### Pattern 2: E-commerce Demo
```
[Home page]
├── Hero banner carousel
├── Categories grid
├── Featured products
├── Trending products
├── Newsletter

[Product list]
├── Filters sidebar
├── Sort options
├── Product cards grid
├── Pagination

[Product detail]
├── Image gallery
├── Product info
├── Add to cart
├── Reviews
├── Related products

[Cart]
├── Item list
├── Quantity controls
├── Subtotal
├── Checkout button
```

### Pattern 3: CRM / Sales Demo
```
[Pipeline view]
├── Kanban board (Leads → Qualified → Proposal → Won)
├── Drag drop between stages

[Contact list]
├── Table with search
├── Tags, labels

[Contact detail]
├── Profile info
├── Activity timeline
├── Related deals
├── Notes

[Dashboard]
├── Sales KPIs
├── Pipeline value chart
├── Top performers
```

### Pattern 4: Project Management Demo
```
[Project list]
├── Card view (color coded by status)
├── List view alternative

[Project board]
├── Kanban: To Do, In Progress, Review, Done
├── Task cards with assignee, due date

[Task detail]
├── Description
├── Comments thread
├── Subtasks
├── Attachments
├── Activity log

[Timeline / Gantt]
├── Project phases
├── Dependencies
```

### Pattern 5: Analytics / BI Demo
```
[Dashboard]
├── Date range picker
├── KPI cards
├── Line chart (trend)
├── Bar chart (comparison)
├── Pie chart (breakdown)
├── Data table with sort/filter

[Drill-down view]
├── Detailed metric
├── Segmentation
├── Export options
```

## UI/UX Best Practices cho Demo

### 1. Mock data realistic
**BAD**:
```js
const users = ['User 1', 'User 2', 'User 3'];
```

**GOOD**:
```js
const users = [
  { name: 'Nguyễn Thành Long', email: 'long.nguyen@acme.com', role: 'Admin', lastActive: '2 hours ago', avatar: 'NL' },
  { name: 'Trần Thị Hương', email: 'huong.tran@acme.com', role: 'Editor', lastActive: '5 minutes ago', avatar: 'TH' },
  { name: 'Lê Văn Nam', email: 'nam.le@acme.com', role: 'Viewer', lastActive: '1 day ago', avatar: 'LN' },
];
```

**Sources for mock data**:
- Faker.js (names, emails, addresses)
- JSONPlaceholder API
- Random User Generator
- Unsplash for images
- Placeholder.com for avatars

### 2. Interactive state
```jsx
const [items, setItems] = useState(mockItems);
const [selectedId, setSelectedId] = useState(null);

// Real feedback on interaction
const handleDelete = (id) => {
  setItems(items.filter(i => i.id !== id));
  // Show toast notification
};
```

### 3. Loading states (fake)
```jsx
const [loading, setLoading] = useState(false);

const handleSave = async () => {
  setLoading(true);
  await new Promise(r => setTimeout(r, 800)); // Fake delay
  setLoading(false);
  showToast('Saved successfully');
};
```

### 4. Micro-interactions
- Hover effects on cards
- Smooth transitions (Tailwind `transition-all duration-200`)
- Loading spinners
- Toast notifications
- Modal animations
- Smooth scroll

### 5. Empty states
Không để screen rỗng:
```
[Icon]
"No projects yet"
"Create your first project to get started"
[+ Create Project button]
```

### 6. Data visualization
- **Line charts**: time-series data (Recharts LineChart)
- **Bar charts**: comparisons (Recharts BarChart)
- **Pie/donut**: proportions (Recharts PieChart)
- **Area charts**: cumulative metrics
- **Sparklines**: inline trend in cards
- **Progress bars**: completion status

## Color & Typography

### Quick palette choices
**Modern SaaS** (Stripe/Linear style):
```css
primary: #635BFF (purple)
bg: #FFFFFF
text: #0A2540
muted: #697386
border: #EEF0F3
```

**Corporate** (Microsoft/IBM):
```css
primary: #0078D4 (blue)
bg: #FAF9F8
text: #201F1E
muted: #605E5C
border: #EDEBE9
```

**Playful** (Mailchimp/Slack):
```css
primary: #FFE01B (yellow) with #241C15 (text)
accent: #4A154B (purple)
```

**Dark mode** (Vercel/GitHub):
```css
bg: #0A0A0A
surface: #171717
primary: #FFFFFF
muted: #A1A1A1
accent: #2563EB
```

### Typography scale
```css
font-family: Inter, -apple-system, sans-serif

text-xs:  12px  // Captions, labels
text-sm:  14px  // Body small
text-base: 16px // Body
text-lg:  18px  // Large body
text-xl:  20px  // Small heading
text-2xl: 24px  // Heading
text-3xl: 30px  // Large heading
text-4xl: 36px  // Hero
```

## Common Components Library

Components bạn thường cần trong demo:

### Buttons
- Primary, Secondary, Tertiary, Ghost, Destructive
- Sizes: sm, md, lg
- With/without icon
- Loading state

### Cards
- Container with padding, border, shadow
- KPI card with icon + number + change
- Product card with image
- User card with avatar

### Forms
- Input with label
- Select/dropdown
- Checkbox, radio
- Toggle switch
- Date picker
- File upload

### Tables
- Sortable headers
- Row selection
- Pagination
- Row actions menu

### Navigation
- Sidebar (collapsible)
- Top bar with search
- Breadcrumbs
- Tabs

### Feedback
- Toast notification
- Modal dialog
- Confirmation dialog
- Alert banner
- Loading skeleton

### Charts
- Line chart
- Bar chart
- Pie chart
- Area chart

## Example: Dashboard Demo Template

```jsx
import { useState } from 'react';
import { Home, Users, Package, Settings, BarChart, Bell, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const kpis = [
  { label: 'Revenue', value: '$124,580', change: '+12.5%', positive: true },
  { label: 'Active Users', value: '8,492', change: '+3.2%', positive: true },
  { label: 'Conversion', value: '3.8%', change: '-0.4%', positive: false },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%', positive: true },
];

const chartData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 51000 },
  // ...
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        {/* Nav items */}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <input placeholder="Search..." className="px-4 py-2 border rounded-lg"/>
            <Bell className="w-5 h-5"/>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">NA</div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {kpis.map(kpi => (
              <div key={kpi.label} className="bg-white p-6 rounded-xl border">
                <div className="text-sm text-gray-500">{kpi.label}</div>
                <div className="text-3xl font-bold mt-2">{kpi.value}</div>
                <div className={kpi.positive ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="revenue" stroke="#635BFF" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## Workflow chuẩn

1. Đọc skill liên quan:
   - `ui-ux-pro-max-skill` project cho design inspiration
   - `design-system` nếu cần brand consistency
2. Hỏi user: domain, flows, style preference, tech stack
3. Quick sketch: liệt kê các screens/pages cần
4. Setup tech (React component hoặc Next.js app)
5. Build layout (sidebar + topbar + main)
6. Implement screens một cái một lần
7. Add mock data (realistic, không lorem ipsum)
8. Add interactions (clicks, state changes)
9. Polish UI (spacing, colors, animations)
10. Test trên mobile (responsive)
11. Save vào `/sessions/eager-confident-dijkstra/mnt/claude-share-skill/` và share link

## Tips cho demo thành công

### DO ✅
- **Hook trong 5 giây**: Hero visual phải impact ngay
- **Click-worthy**: Mọi button đều phải làm gì đó
- **Happy path only**: Demo flow "từ thiên tài sử dụng" — không edge cases
- **Pre-filled data**: User không cần nhập gì để thấy kết quả
- **Smooth transitions**: Không jarring state changes
- **Logo khách hàng**: Nếu biết ai xem, custom data với tên họ
- **Share URL**: Để họ xem lại sau meeting

### DON'T ❌
- **Overscope**: 3-5 màn hình là đủ, không cần 20
- **Real authentication**: Fake login
- **Real data**: Mock mọi thứ
- **Performance paranoia**: Demo thường local, không cần optimize siêu
- **Unit tests**: Không cần cho demo
- **Over-explain**: UI phải self-explanatory

## Checklist chất lượng

- [ ] Demo load < 2s
- [ ] Mobile responsive
- [ ] Mock data realistic, not lorem ipsum
- [ ] Mọi button/link click được (không dead)
- [ ] Transitions smooth
- [ ] Colors consistent với brand (nếu có)
- [ ] Typography clean, readable
- [ ] Images quality (không pixelated)
- [ ] Icons consistent style
- [ ] Loading/empty/error states có
- [ ] Keyboard navigation works
- [ ] Works in Chrome, Safari, Firefox
