---
name: odoo-demo
description: "Skill for creating Odoo ERP / factory demo prototypes as interactive web apps (React JSX or single-file HTML) for tablet-first shop floor use. Use this skill whenever the user wants to create a demo, mockup, or prototype that simulates Odoo ERP or a shop-floor reporting system. Triggers include: tạo demo Odoo, mockup Odoo, prototype ERP, demo webapp, demo cho khách hàng, tạo giao diện demo, demo báo cáo sản xuất, demo cho tablet, Odoo screen mockup, interactive demo, module demo, Odooデモ, 生産日報デモ, タブレットUI, clickable prototype, wireframe, interactive workflow demo. Also use when the user asks for Number Wheel Picker, Time Picker with cross-midnight, team-based login screen with tabs, shift selector, or any tablet-optimized factory UI. Even if the user just says 'make a demo' in the context of an Odoo/ERP/factory project, use this skill."
---

# Odoo / Factory Demo Webapp Creator (v2 — post FCC Vietnam lessons)

Skill tạo demo webapp mô phỏng Odoo ERP và/hoặc hệ thống báo cáo sản xuất shop-floor, phục vụ trình bày cho khách hàng (đặc biệt khách Nhật Bản). Phiên bản này được cập nhật từ kinh nghiệm dự án **FCC Vietnam Smart Factory** — file demo `App.jsx` ~6500 dòng, React 18 + Tailwind 3 + Vite 6, deploy Vercel.

## Mục đích

Tạo các interactive React/HTML prototype mô phỏng hệ thống ERP hoặc Production Report System để:
- Demo cho khách hàng thấy hệ thống sẽ trông và hoạt động thế nào
- Trình bày workflow nghiệp vụ một cách trực quan trên tablet
- Hỗ trợ giai đoạn proposal và pre-sales
- Cho phép khách hàng "click through" toàn bộ vòng đời nghiệp vụ

---

## 1. Tech Stack mặc định (đã kiểm chứng)

Dựa trên FCC Vietnam, stack sau hoạt động tốt cho demo cỡ trung/lớn:

```json
{
  "node": ">= 20",
  "framework": "React 18",
  "build": "Vite 6",
  "styling": "Tailwind CSS 3.4",
  "icons": "lucide-react",
  "charts": "recharts",
  "deployment": "Vercel",
  "docGen": "docx (for User Manual)"
}
```

Cấu trúc project:
```
demo-app/
├── src/
│   ├── App.jsx         # Single-file app — đủ cho demo < 10k dòng
│   ├── main.jsx
│   └── index.css       # Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

**Lý do chọn single-file App.jsx**: Demo được xem và chỉnh sửa bởi BA/PM, không phải dev chuyên. Một file duy nhất giúp dễ review, dễ grep, dễ chia sẻ, dễ deploy. Khi app > 8000 dòng mới nên tách module.

---

## 2. Odoo UI Design System (khi mô phỏng Odoo thật)

### Color Palette

```css
:root {
  /* Odoo brand */
  --odoo-purple: #714B67;
  --odoo-purple-dark: #51384C;
  --odoo-purple-light: #8F7082;
  /* Functional */
  --success: #28a745;
  --warning: #e9a800;
  --danger: #dc3545;
  --info: #17a2b8;
  /* Neutral */
  --bg-light: #F8F9FA;
  --border: #DEE2E6;
  --text-primary: #212529;
  --text-muted: #6c757d;
}
```

### Odoo layout anatomy
1. **Top navbar** (h-46px, bg purple-dark) — logo | app name | user menu
2. **Control Panel** — breadcrumb | action buttons | search/filter
3. **Main content** — list / form / kanban
4. **Sidebar** (optional) — module menu

### Common components
- Statusbar (pipeline: draft → confirmed → done)
- Chatter (message log dưới form)
- Stat buttons, Smart buttons
- Kanban cards
- List view với checkbox select all

---

## 3. Tablet-first UI Patterns (từ FCC Vietnam)

Khi demo cho shop floor, tablet-first là mặc định. Các pattern sau đã được kiểm chứng.

### 3.1 Number Wheel Picker

Giao diện bánh xe cuộn từng chữ số, giống iOS date picker, tối ưu ngón tay không cần bàn phím ảo.

Đặc điểm:
- Mỗi chữ số (units/tens/hundreds) là một cột độc lập
- Swipe up/down để tăng/giảm
- Có snap animation
- Nút ✓ xác nhận, ✕ hủy
- Hỗ trợ min/max constraint

Use case: nhập sản lượng OK, NG quantity, OT people count, target quantity.

### 3.2 Time Picker với ràng buộc ca

Picker chọn HH:MM với validation theo shift window:

```javascript
// Mẫu validator từ App.jsx
const SHIFT_WINDOWS = {
  1: { start: '06:00', end: '14:00', crossMidnight: false },
  2: { start: '14:00', end: '22:00', crossMidnight: false },
  3: { start: '22:00', end: '06:00', crossMidnight: true  },
};

function validateTimeWithinShift(time, shiftNumber) {
  const { start, end, crossMidnight } = SHIFT_WINDOWS[shiftNumber];
  const t = toMinutes(time);
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (crossMidnight) {
    // Ca 3: 22:00 → 06:00 hôm sau
    return t >= s || t <= e;
  }
  return t >= s && t <= e;
}
```

Use case: giờ bắt đầu/kết thúc ca, downtime start/end, OT start/end.

### 3.3 Team-based Login Screen (two-tier tabs)

Màn hình đăng nhập có 3 tầng:
1. **Tầng 1 — Tab Bộ phận**: Press / CNC / Mill / Management
2. **Tầng 2 — Chip chọn Ca**: Ca 1 / Ca 2 / Ca 3 (hoặc nhóm chức danh nếu là Management)
3. **Tầng 3 — Grid thành viên**: lưới 3 cột, 5 thẻ/đội, Sub Leader có viền nổi bật và badge "SL"

Pattern này hoạt động tốt hơn flat list khi có 40+ user, vì user tìm nhanh theo "tôi ở bộ phận nào, ca nào".

### 3.4 Status Badge màu semantic

```javascript
const STATUS_STYLES = {
  DRAFT:            { bg: 'bg-gray-100',    text: 'text-gray-700',    label: 'Nháp' },
  LEADER_REVIEW:    { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Chờ tổ trưởng' },
  LEADER_APPROVED:  { bg: 'bg-sky-100',     text: 'text-sky-700',     label: 'Tổ trưởng đã duyệt' },
  CHIEF_REVIEW:     { bg: 'bg-indigo-100',  text: 'text-indigo-700',  label: 'Chờ Chief' },
  CHIEF_APPROVED:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Hoàn tất' },
  REJECTED:         { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Từ chối' },
  ABNORMAL:         { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Bất thường' },
};
```

### 3.5 Touch targets
- Buttons ≥ 44×44px
- Checkbox ≥ 24×24px với padding 12px
- Dropdown option ≥ 48px cao
- Font base 16px, không nhỏ hơn 14px

---

## 4. Quy trình tạo demo

### Step 1 — Xác định scope
Xác nhận với user:
- Module/nghiệp vụ nào cần demo?
- Workflow chính cần trình bày?
- Audience: management Nhật, technical team, end users, operator?
- Ngôn ngữ UI: VI, JA, VI/JA song ngữ?
- Ngày hạn demo (ảnh hưởng mức độ polish)

### Step 2 — Thiết kế screens
Xác định các screens chính:
- Login (team-based nếu áp dụng)
- Dashboard per role
- List views
- Form views (có thể phức tạp như Production Report với 3 ca)
- Approval queue với Bulk Approval
- Analytics / chart views

### Step 3 — Define mock data centrally
Tạo các constants ở đầu file:
- `TEAMS_DEF` — cấu trúc đội
- `MACHINES` — danh sách máy
- `PRODUCTS` — sản phẩm
- `MONTHLY_PLAN` — kế hoạch sản xuất theo máy × ngày
- `generateMockUsers()` / `generateMockReports()` — sinh data từ constants

### Step 4 — Build từng màn hình
Đi theo luồng nghiệp vụ end-to-end thay vì build từng màn riêng lẻ:
1. Login → chọn user
2. Operator tạo báo cáo mới
3. Sub Leader duyệt ca của mình
4. Chief duyệt toàn báo cáo
5. Analytics xem kết quả

### Step 5 — Polish & deploy
- Test navigation giữa các role
- Build: `npm run build`
- Deploy Vercel: `vercel --prod` (Root Directory = `demo-app`)

---

## 5. Sample data Japanese/Vietnamese factory

### Sản phẩm (phù hợp ngành cơ khí/đúc/dập)

```javascript
const PRODUCTS = [
  { code: 'PRD-001', nameVi: 'Brake Disc Type A',  nameJa: 'ブレーキディスク A型', dept: 'Press' },
  { code: 'PRD-002', nameVi: 'Clutch Plate Std',    nameJa: 'クラッチプレート', dept: 'Press' },
  { code: 'PRD-003', nameVi: 'Gear Shaft M6',       nameJa: 'ギアシャフト M6', dept: 'CNC' },
  { code: 'PRD-004', nameVi: 'Piston Rod 25mm',     nameJa: 'ピストンロッド 25mm', dept: 'CNC' },
  { code: 'PRD-005', nameVi: 'Housing Cover',       nameJa: 'ハウジングカバー', dept: 'Mill' },
  { code: 'PRD-006', nameVi: 'Bracket Assy',        nameJa: 'ブラケット ASSY', dept: 'Mill' },
];
```

### Tên người (cho demo Nhật/Việt)

Tên tiếng Nhật phổ biến: 田中, 鈴木, 佐藤, 山田, 渡辺, 伊藤, 中村, 小林, 加藤, 吉田
Tên tiếng Việt cho operator/sub-leader: Nguyễn Văn An, Trần Thị Bình, Lê Văn Cường, Phạm Hữu Nghĩa, ...

### Lý do NG (chọn từ dropdown)
```javascript
const NG_REASONS = ['Vết xước', 'Biến dạng', 'Sai kích thước', 'Lỗi bề mặt', 'Khác'];
```

### Lý do Downtime
```javascript
const DOWNTIME_REASONS = ['Breakdown', 'Maintenance', 'Material shortage', 'Setup/Changeover', 'Other'];
```

---

## 6. i18n VI/JA (pattern từ App.jsx)

```javascript
const translations = {
  vi: {
    appName: 'FCC Vietnam - Báo cáo sản xuất',
    selectTeam: 'Chọn đội của bạn',
    teamSize: 'số người',
    people: 'người',
    deptPress: 'Dập',
    deptCNC: 'CNC',
    deptMill: 'Phay',
    managementTab: 'Quản lý',
    // ...
  },
  ja: {
    appName: 'FCC Vietnam - 生産日報',
    selectTeam: 'チームを選択',
    teamSize: '人数',
    people: '人',
    deptPress: 'プレス',
    deptCNC: 'CNC',
    deptMill: 'フライス',
    managementTab: '管理',
    // ...
  },
};

// Usage:
const t = (key) => translations[lang][key] || key;
```

---

## 7. Templates cho từng module

### 7.1 Manufacturing Demo
- Dashboard: OEE chart, production status, alerts
- MO list: MO number, product, quantity, status
- MO Form: info, BOM, work orders, quality checks
- **Daily Production Report** (FCC pattern): 1 máy × 1 ngày × 3 ca
- Work Center Kanban

### 7.2 Inventory/Warehouse Demo
- Stock levels dashboard
- Stock Moves list
- Inventory Adjustments
- Barcode scanning simulation

### 7.3 Quality Control Demo
- Quality Alerts dashboard
- Quality Check form với photo upload mock
- SPC control chart
- NG Pareto chart

### 7.4 Maintenance Demo
- Equipment list với status
- Maintenance Request form
- Maintenance Calendar
- MTBF/MTTR statistics

### 7.5 IoT Integration Demo
- Real-time Machine Dashboard (simulated live data)
- Alert panel (temperature, pressure)
- Energy Monitoring
- Traceability view

---

## 8. Code skeleton — single-file React

```jsx
import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Factory, Users, CheckCircle, XCircle, AlertTriangle, LogOut, Globe } from 'lucide-react';

// ---------- Constants ----------
const SHIFT_WINDOWS = { /* ... */ };
const TEAMS_DEF = [ /* ... */ ];
const PRODUCTS = [ /* ... */ ];
const translations = { vi: {}, ja: {} };

// ---------- Mock data generators ----------
function generateMockUsers() { /* iterate TEAMS_DEF */ }
function generateMockReports(users, machines) { /* ... */ }

// ---------- Business logic ----------
function deriveReportStatus(report) { /* aggregate shift statuses */ }
function isAbnormalShift(shift) { /* NG>5%, downtime>60, OT no reason */ }
function validateTimeWithinShift(time, shiftNumber) { /* cross-midnight */ }

// ---------- UI Components ----------
function LoginScreen({ onLogin, lang, setLang }) { /* team-based tabs */ }
function NumberWheelPicker({ value, onChange, min, max }) { /* swipeable wheel */ }
function TimePicker({ value, onChange, shiftNumber }) { /* constrained */ }
function StatusBadge({ status }) { /* semantic colors */ }

// ---------- Pages ----------
function OperatorDashboard({ user, reports }) { /* ... */ }
function SubLeaderDashboard({ user, reports }) { /* shift-scoped */ }
function ChiefDashboard({ user, reports }) { /* all depts */ }
function ReportForm({ user, machines, onSave, onSubmit }) { /* 3 shifts */ }
function ApprovalsPage({ user, reports, onApprove }) { /* bulk + filter */ }

// ---------- Main App ----------
export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('vi');
  const [page, setPage] = useState('dashboard');
  const users = useMemo(() => generateMockUsers(), []);
  const [reports, setReports] = useState(() => generateMockReports(users, MACHINES));

  if (!user) return <LoginScreen onLogin={setUser} lang={lang} setLang={setLang} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav>{/* navbar with lang toggle, logout */}</nav>
      <main className="p-4">
        {page === 'dashboard' && /* role-specific dashboard */}
        {page === 'report' && <ReportForm user={user} />}
        {page === 'approvals' && <ApprovalsPage user={user} reports={reports} />}
      </main>
    </div>
  );
}
```

---

## 9. Deployment tips

### Vercel (đã kiểm chứng từ FCC)
1. `npm install -g vercel` (nếu chưa có)
2. Trong folder `demo-app/`: `vercel` → chọn account, link project
3. **QUAN TRỌNG**: Root Directory = `demo-app` nếu `package.json` không ở repo root
4. Build command mặc định: `vite build` → output `dist/`
5. Deploy tiếp: `vercel --prod` (file `.vercel/project.json` giữ link)

### Vite production checklist
- `vite.config.js` không cần base nếu deploy vào root domain
- Xóa `console.log` debug trước build
- Verify bundle size: thường 500kB–800kB gzipped OK cho demo
- Test trên tablet thật (iPad hoặc Android) ít nhất 1 lần trước demo

---

## 10. Demo delivery checklist

- [ ] Login screen hiển thị đủ teams/roles
- [ ] Chuyển đổi user mượt, không phải reload trang
- [ ] Ít nhất 1 workflow end-to-end (create → submit → approve → done)
- [ ] Charts render đúng (recharts)
- [ ] Mock data realistic (tên Nhật/Việt, số liệu hợp lý)
- [ ] Touch targets ≥ 44px
- [ ] Responsive trên tablet 1024×768 và 1280×800
- [ ] i18n VI/JA toggle hoạt động tức thì
- [ ] Number Wheel Picker / Time Picker hoạt động đúng
- [ ] Cross-midnight shift validation không báo sai
- [ ] Bulk approval có filter Normal/Abnormal
- [ ] Auto-flag abnormal (NG>5%, downtime>60, OT no reason)
- [ ] User Manual .docx (dùng skill docx) nếu khách yêu cầu
- [ ] Deploy Vercel, test URL trên tablet

## 11. Khi cần cấu trúc phức tạp hơn

Nếu demo vượt quá single-file:
- Cân nhắc skill `erp-workflow-demo` cho full RBAC + multi-workflow
- Cân nhắc skill `factory-ba` để tài liệu hóa nghiệp vụ trước
- Luôn dùng skill `docx` / `pptx` khi cần xuất tài liệu cuối cho khách
