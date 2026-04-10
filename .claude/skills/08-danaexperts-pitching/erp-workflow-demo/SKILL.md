---
name: erp-workflow-demo
description: "Create full-featured ERP / factory web app demos with mock data, team-based user structure, role-based dashboards, per-shift approval workflows, bulk approval with abnormality filtering, and tablet-first UI. Combines BA analysis, Tech Lead architecture, and UI/UX design into interactive React/HTML prototypes. Use this skill whenever the user asks to: build a web demo for ERP/factory, create a role-based dashboard, demo approval workflows, build a webapp prototype with multiple user roles, show report→review→approve→reject flows, create interactive factory management demo, build a mock ERP system, demo per-shift approval, team-based login, Sub Leader kiêm Operator, tạo demo web app cho nhà máy, demo báo cáo sản xuất, demo luồng phê duyệt, dashboard theo vai trò, phê duyệt theo ca, ERPデモアプリ, 生産日報デモ, ワークフローデモ, シフト別承認. Even if the user just says 'build me a demo app' or 'demo webapp' in an ERP/factory context, use this skill. This skill should be used together with `factory-ba` (BA first), `odoo-demo` (UI patterns), and `ui-ux-pro-max` (design quality)."
---

# ERP Workflow Demo Builder (v2 — post FCC Vietnam lessons)

Skill tạo web app demo ERP hoàn chỉnh với mock data, **team-based user structure**, role-based dashboards và **per-shift approval workflows**. Kết hợp 3 góc nhìn: **Business Analyst** (nghiệp vụ), **Tech Lead** (kiến trúc), **UI/UX Designer** (trải nghiệm).

Phiên bản này cập nhật từ dự án **FCC Vietnam Smart Factory** — demo React 18 + Vite 6 + Tailwind 3, single-file `App.jsx` ~6500 dòng, 9 teams × 5 người = 45 user, deploy Vercel.

## Tổng quan

Skill này tạo ra interactive web app (React JSX hoặc HTML) mô phỏng hệ thống ERP cho nhà máy, bao gồm:
- Hệ thống login **team-based** (chọn bộ phận → ca → thành viên)
- Dashboard khác nhau cho từng role
- Luồng nghiệp vụ 3 cấp: Operator → Sub Leader (per-shift) → Ast/Chief
- **Per-shift approval routing** — mỗi ca do Sub Leader khác nhau duyệt độc lập
- **Sub Leader kiêm Operator** với auto-approve khi người tạo = người duyệt cấp 1
- **Bulk Approval** với filter Normal/Abnormal
- **Auto-abnormality detection** (NG > 5%, Downtime > 60 phút, OT không lý do)
- Mock data realistic cho nhà máy Nhật/Việt
- Charts, tables, KPI cards phù hợp với từng role
- Tablet-first UI (Number Wheel Picker, Time Picker, touch targets ≥ 44px)

Tham khảo chi tiết code patterns tại `references/workflow-patterns.md`.

---

## 1. Hệ thống Roles trong nhà máy

### Role definitions (v2 — đã cập nhật từ FCC)

| Role | 日本語 | Permissions | Dashboard Focus |
|------|--------|-------------|-----------------|
| **Factory Director** (工場長) | Director | View all, Approve L2 | KPIs tổng thể, OEE, cost, alerts chiến lược |
| **Section Manager / Chief** (課長) | Chief | Manage dept, Approve L2 | Production của bộ phận, WIP, pending approvals |
| **Assistant Chief** (係長補佐) | Ast Chief | Support Chief, Approve L2 | Tương tự Chief, thay khi Chief vắng |
| **Sub Leader — Operator** (組長) | Sub Lead | Report + Approve L1 (theo ca) | Ca của mình: pending shifts, báo cáo, team |
| **Operator** (オペレーター) | Operator | Report, View own | My reports, work instructions, quality checks |
| **QA Inspector** (品質検査員) | QA | View all, note QA | Quality metrics, defect rates, SPC charts |
| **Maintenance** (保全員) | MT | View downtime | Equipment status, MTBF/MTTR, schedule |
| **Accountant** (経理担当) | Accountant | View financial | Cost analysis, budget vs actual |

### Điểm khác biệt quan trọng với các hệ thống cổ điển
- **Không có flat operator list.** User được tổ chức thành Team (1 dept × 1 shift = 1 team).
- **Sub Leader có `machineId`** — cũng là Operator của đội, được gán máy như mọi người.
- **Mỗi Sub Leader có `shiftNumber`** — chỉ duyệt được các ca thuộc đúng ca của mình trong bộ phận.
- **Ast/Chief/Director không gán theo ca** — duyệt cấp 2 khi cả 3 ca đã approved.

### Permission Matrix

```
Action                          Operator  SubLead  AstChief  Chief  Director  QA   MT
──────────────────────────────  ────────  ───────  ────────  ─────  ────────  ───  ───
Create Report                   ✓         ✓        ✗         ✗      ✗         ✗    ✗
Edit own Report                 ✓         ✓        ✗         ✗      ✗         ✗    ✗
Submit Report                   ✓         ✓        ✗         ✗      ✗         ✗    ✗
Approve L1 (per-shift)          ✗         ✓*       ✗         ✗      ✗         ✗    ✗
Approve L2 (whole report)       ✗         ✗        ✓         ✓      ✓         ✗    ✗
Bulk Approval                   ✗         ✓        ✓         ✓      ✗         ✗    ✗
Reject                          ✗         ✓        ✓         ✓      ✗         ✗    ✗
View All Reports                ✗         dept✓    ✓         ✓      ✓         ✓    ✓
Analytics / KPI                 ✗         dept✓    ✓         ✓      ✓         ✓    ✓
Monthly Plan                    ✗         ✗        ✓         ✓      ✓         ✗    ✗
```
`*` Sub Leader chỉ duyệt các ca thuộc đúng `dept` + đúng `shiftNumber` của mình.

---

## 2. Team-based User Model (pattern từ FCC)

### TEAMS_DEF — constant trung tâm sinh user

```javascript
const TEAMS_DEF = [
  { dept: 'Press', line: 'Line A', shiftNumber: 1,
    subLeaderName: 'Nguyễn Thành Tâm',
    members: ['Nguyễn Văn An', 'Trần Văn Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung'] },
  { dept: 'Press', line: 'Line A', shiftNumber: 2,
    subLeaderName: 'Phạm Hữu Nghĩa',
    members: ['Hoàng Văn Em', 'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hoa'] },
  // ... 9 teams total (3 depts × 3 shifts)
];
```

### generateMockUsers — sinh 45 user từ TEAMS_DEF

```javascript
function generateMockUsers(machines) {
  const users = [];
  let idx = 0;
  TEAMS_DEF.forEach(team => {
    const teamId = `${team.dept}-S${team.shiftNumber}`;
    const teamMachines = machines.filter(m => m.dept === team.dept);

    // Sub Leader — kiêm Operator, giữ máy đầu tiên của dept
    users.push({
      id: `u${String(++idx).padStart(3, '0')}`,
      name: team.subLeaderName,
      role: 'sub_leader',
      dept: team.dept,
      line: team.line,
      shiftNumber: team.shiftNumber,
      machineId: teamMachines[0]?.id,
      teamId,
    });

    // 4 members — cycling qua các máy còn lại
    team.members.forEach((memberName, k) => {
      const machine = teamMachines[(k + 1) % teamMachines.length];
      users.push({
        id: `u${String(++idx).padStart(3, '0')}`,
        name: memberName,
        role: 'operator',
        dept: team.dept,
        line: team.line,
        shiftNumber: team.shiftNumber,
        machineId: machine?.id,
        teamId,
      });
    });
  });
  return users;
}
```

### Helper quan trọng

```javascript
// Lấy Sub Leader duyệt ca theo dept + shift
function getTeamLeaderByDeptAndShift(users, dept, shiftNumber) {
  return users.find(u =>
    u.role === 'sub_leader' &&
    u.dept === dept &&
    u.shiftNumber === shiftNumber
  );
}

// Lấy operator của 1 team (dùng cho dropdown)
function getTeamOperators(users, dept, shiftNumber) {
  return users.filter(u =>
    (u.role === 'operator' || u.role === 'sub_leader') &&
    u.dept === dept &&
    u.shiftNumber === shiftNumber
  );
}
```

---

## 3. Per-shift Approval Workflow Engine

### Report structure — 1 máy × 1 ngày × 3 ca

```javascript
{
  id: 'RPT-2026-0401-PR01',
  date: '2026-04-01',
  machineId: 'PR-01',
  dept: 'Press',
  status: 'LEADER_REVIEW',    // aggregated — derive từ 3 ca
  shifts: [
    {
      shiftNumber: 1,
      operatorId: 'u001',
      leaderId: 'u001',         // Sub Leader Press Ca 1
      startTime: '06:00', endTime: '14:00',
      productCode: 'PRD-001',
      okQty: 240, ngQty: 5,
      ngReason: 'Vết xước',
      downtime: [{ start: '08:30', end: '09:00', reason: 'Setup' }],
      ot: { enabled: false, reason: '', peopleCount: 0 },
      status: 'LEADER_APPROVED',   // per-shift status
      submittedAt: '...', approvedAt: '...',
    },
    { shiftNumber: 2, ... status: 'LEADER_REVIEW' },
    { shiftNumber: 3, ... status: 'DRAFT' },
  ],
  auditTrail: [ ... ],
}
```

### Status transitions — per shift

```
DRAFT → LEADER_REVIEW → LEADER_APPROVED
                    └→ REJECTED → DRAFT (operator sửa)
```

### Aggregation — deriveReportStatus

```javascript
function deriveReportStatus(report) {
  const shifts = report.shifts || [];
  if (shifts.every(s => s.status === 'DRAFT'))               return 'DRAFT';
  if (shifts.some(s => s.status === 'REJECTED'))             return 'REJECTED';
  if (shifts.every(s => s.status === 'LEADER_APPROVED'))     return 'CHIEF_REVIEW';
  if (shifts.every(s => s.status === 'CHIEF_APPROVED'))      return 'CHIEF_APPROVED';
  if (shifts.some(s => s.status === 'LEADER_REVIEW'))        return 'LEADER_REVIEW';
  return 'LEADER_REVIEW';
}
```

### Per-shift approval — ApprovalsPage filter

```javascript
// Sub Leader chỉ thấy các ca thuộc đúng dept + đúng ca của mình
const pendingShifts = useMemo(() => {
  const rows = [];
  reports.forEach(r => {
    if (r.dept !== user.dept) return;
    (r.shifts || []).forEach((sh, si) => {
      if (sh.status !== 'LEADER_REVIEW') return;
      if (user.shiftNumber && sh.shiftNumber !== user.shiftNumber) return;
      rows.push({ report: r, shift: sh, shiftIdx: si });
    });
  });
  return rows;
}, [reports, user]);
```

### Auto-approve for dual-role

```javascript
function submitShift(report, shiftIdx, currentUser) {
  const shift = report.shifts[shiftIdx];
  const leader = getTeamLeaderByDeptAndShift(users, report.dept, shift.shiftNumber);

  // Nếu người tạo/nhập ca = Sub Leader của ca đó → auto-approve L1
  if (leader && leader.id === currentUser.id) {
    shift.status = 'LEADER_APPROVED';
    shift.approvedBy = currentUser.id;
    shift.approvedAt = new Date().toISOString();
  } else {
    shift.status = 'LEADER_REVIEW';
  }
  shift.submittedAt = new Date().toISOString();

  // Cập nhật status toàn báo cáo
  report.status = deriveReportStatus(report);
}
```

---

## 4. Abnormality Detection & Bulk Approval

### Thresholds (constants)

```javascript
const NG_THRESHOLD_PERCENT = 5;
const DOWNTIME_THRESHOLD_MIN = 60;
```

### isAbnormalShift

```javascript
function isAbnormalShift(shift) {
  const total = (shift.okQty || 0) + (shift.ngQty || 0);
  const ngRate = total > 0 ? (shift.ngQty / total) * 100 : 0;
  const totalDowntime = (shift.downtime || []).reduce((sum, d) => sum + diffMinutes(d.start, d.end), 0);
  const otWithoutReason = shift.ot?.enabled && !shift.ot?.reason?.trim();

  return {
    abnormal: ngRate > NG_THRESHOLD_PERCENT || totalDowntime > DOWNTIME_THRESHOLD_MIN || otWithoutReason,
    reasons: [
      ngRate > NG_THRESHOLD_PERCENT ? `NG Rate ${ngRate.toFixed(1)}% > ${NG_THRESHOLD_PERCENT}%` : null,
      totalDowntime > DOWNTIME_THRESHOLD_MIN ? `Downtime ${totalDowntime} phút > ${DOWNTIME_THRESHOLD_MIN}` : null,
      otWithoutReason ? 'OT bật mà không có lý do' : null,
    ].filter(Boolean),
    blocking: ngRate > NG_THRESHOLD_PERCENT || otWithoutReason,  // downtime chỉ cảnh báo
  };
}
```

### Bulk Approval pattern

```javascript
function BulkApprovalPanel({ pendingShifts, onApprove }) {
  const [selected, setSelected] = useState(new Set());
  const normal = pendingShifts.filter(p => !isAbnormalShift(p.shift).abnormal);
  const abnormal = pendingShifts.filter(p => isAbnormalShift(p.shift).abnormal);

  const selectAllNormal = () => setSelected(new Set(normal.map(p => p.report.id + '-' + p.shiftIdx)));

  return (
    <div>
      <button onClick={selectAllNormal}>Chọn tất cả Normal ({normal.length})</button>
      {/* Abnormal KHÔNG có "select all" — phải tick từng cái */}
      <section>
        <h3>Normal ({normal.length})</h3>
        {normal.map(p => <ShiftCheckbox {...p} selected={selected} setSelected={setSelected} />)}
      </section>
      <section>
        <h3 className="text-orange-700">Abnormal ({abnormal.length}) — phải xem kỹ</h3>
        {abnormal.map(p => <ShiftCheckbox {...p} selected={selected} setSelected={setSelected} showWarning />)}
      </section>
      <button onClick={() => onApprove([...selected])}>Duyệt đã chọn</button>
    </div>
  );
}
```

---

## 5. Role-Based Dashboards

Mỗi role có dashboard khác nhau, hiển thị dữ liệu trong phạm vi quyền.

### 5.1 Operator
- Số báo cáo hôm nay, đã gửi, bị từ chối
- Danh sách báo cáo gần đây (tối đa 10) của chính mình
- Nút "Tạo báo cáo mới"
- Thông báo đỏ nếu có báo cáo REJECTED

### 5.2 Sub Leader (shift-scoped)
- Báo cáo chờ duyệt (CHỈ các ca đúng dept + đúng shiftNumber)
- Số báo cáo Abnormal cần xem kỹ
- Nút "Duyệt hàng loạt"
- Nút "Tạo báo cáo" (vì kiêm Operator)

### 5.3 Ast Chief / Chief
- Tổng quan tất cả bộ phận
- Báo cáo đã đủ 3 ca approved, chờ cấp 2
- Biểu đồ sản lượng theo ngày/tuần
- Danh sách báo cáo bị từ chối để theo dõi

### 5.4 Director
- KPI tổng thể nhà máy (OEE, output, defect rate, delivery, cost)
- So sánh bộ phận
- Xu hướng sản lượng tháng
- Strategic alerts

### 5.5 QA / Maintenance
- QA: NG trend, Pareto chart, quality alerts
- MT: downtime log, MTBF/MTTR, maintenance schedule

---

## 6. Mock Data Architecture

### Nguyên tắc
- Tất cả data consistent (quantities, dates, references trùng khớp)
- Tên người Nhật/Việt thực tế, realistic
- Số liệu không tròn quá (85.2% thay vì 85%)
- Timeline dates gần đây, có weekday pattern
- Tạo data từ constants (TEAMS_DEF, MACHINES, MONTHLY_PLAN) — không hard-code inline

### Data store pattern

```javascript
const MACHINES = [
  { id: 'PR-01', name: 'Press 01', dept: 'Press', line: 'Line A' },
  { id: 'PR-02', name: 'Press 02', dept: 'Press', line: 'Line A' },
  { id: 'PR-03', name: 'Press 03', dept: 'Press', line: 'Line A' },
  { id: 'CNC-01', name: 'CNC 01', dept: 'CNC', line: 'Line B' },
  // ...
];

const MONTHLY_PLAN = [
  { date: '2026-04-01', machineId: 'PR-01', productCode: 'PRD-001', targetQty: 800 },
  // ...
];

// Derive mock state
const USERS = generateMockUsers(MACHINES);
const REPORTS = generateMockReports(USERS, MACHINES, MONTHLY_PLAN);
```

### seedFromPlan — key UX feature

```javascript
function seedFromPlan(machineId, date, plans, users, machines) {
  const machine = machines.find(m => m.id === machineId);
  const planRow = plans.find(p => p.machineId === machineId && p.date === date);
  const product = planRow ? PRODUCTS.find(pr => pr.code === planRow.productCode) : null;

  const shifts = [1, 2, 3].map(shiftNum => {
    const operators = getTeamOperators(users, machine.dept, shiftNum);
    const leader = getTeamLeaderByDeptAndShift(users, machine.dept, shiftNum);
    const operator = operators[0] || {};
    return {
      shiftNumber: shiftNum,
      operatorId: operator.id || '',
      operatorName: operator.name || '',
      leaderId: leader?.id || '',
      leaderName: leader?.name || '',
      productCode: product?.code || '',
      productName: product?.nameVi || '',
      targetQty: planRow?.targetQty || 0,
      okQty: 0, ngQty: 0,
      startTime: SHIFT_WINDOWS[shiftNum].start,
      endTime: SHIFT_WINDOWS[shiftNum].end,
      downtime: [],
      ot: { enabled: false, reason: '', peopleCount: 0 },
      status: 'DRAFT',
    };
  });

  return { id: `RPT-${date}-${machineId}`, date, machineId, dept: machine.dept, shifts, status: 'DRAFT' };
}
```

---

## 7. Tablet-first UI essentials (tham khảo odoo-demo skill)

Các pattern sau đã kiểm chứng, luôn dùng:
- **Number Wheel Picker** cho ô nhập số
- **Time Picker** với ràng buộc shift window + cross-midnight cho Ca 3
- **Team-based Login** (3 tầng: dept → shift → member)
- **Status Badge** semantic colors
- Touch target ≥ 44px, font base 16px
- Responsive tablet 1024×768 và 1280×800

---

## 8. Technical Architecture (React JSX)

### App structure

```jsx
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [lang, setLang] = useState('vi');

  const users = useMemo(() => generateMockUsers(MACHINES), []);
  const [reports, setReports] = useState(() => generateMockReports(users, MACHINES, MONTHLY_PLAN));

  if (!currentUser) return <LoginScreen users={users} onLogin={setCurrentUser} lang={lang} setLang={setLang} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} onLogout={() => setCurrentUser(null)} lang={lang} setLang={setLang} onNavigate={setPage} />
      <main className="p-4">
        {page === 'dashboard' && <DashboardByRole user={currentUser} reports={reports} users={users} />}
        {page === 'report'    && <ReportForm      user={currentUser} users={users} reports={reports} setReports={setReports} />}
        {page === 'approvals' && <ApprovalsPage   user={currentUser} users={users} reports={reports} setReports={setReports} />}
        {page === 'analytics' && <AnalyticsPage   user={currentUser} reports={reports} />}
        {page === 'plan'      && <MonthlyPlanPage user={currentUser} />}
      </main>
    </div>
  );
}
```

### Key components to build

1. **LoginScreen** — team-based tabs (dept → shift → member) + Management tab
2. **Navbar** — app title, user info, language toggle, notification bell
3. **DashboardByRole** — switch dựa trên role
4. **ReportForm** — 3 shifts tabs, Number Wheel, Time Picker, downtime list, OT layer
5. **ApprovalsPage** — pending list + bulk modal
6. **BulkApprovalPanel** — Normal/Abnormal sections, select-all Normal only
7. **AbnormalityBadge** — hiển thị lý do abnormal
8. **AuditTrail** — lịch sử actions dưới form
9. **StatusBadge**, **KPICard**, **ChartContainer**
10. **NumberWheelPicker**, **TimePicker**

### Import list (đã kiểm chứng)

```javascript
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, AreaChart, Area,
} from 'recharts';
import {
  Factory, Users, ClipboardCheck, Package, Wrench, Settings, Bell, LogOut,
  Home, FileText, BarChart3, CheckCircle, XCircle, Clock, AlertTriangle,
  ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Eye, Filter, Search,
  Globe, Plus, Minus, Check, X, Calendar, Play, Pause,
} from 'lucide-react';
```

---

## 9. Quy trình tạo demo (Step-by-step)

### Step 1 — BA Analysis
- Xác định modules cần demo
- Define teams, roles, permissions
- Map out per-shift approval workflow
- KPIs cho từng role
- Tham khảo skill `factory-ba`

### Step 2 — Tech Architecture
- Chọn single-file React (nếu < 8000 dòng) hoặc multi-file
- Design TEAMS_DEF, MACHINES, PRODUCTS, MONTHLY_PLAN
- Plan component hierarchy
- State management: useState + useMemo đủ cho demo, không cần Redux/Zustand

### Step 3 — UI/UX Design
- Apply Odoo design system colors
- Tablet-first layouts
- Team-based login với two-tier tabs
- Status badges semantic
- Tham khảo skill `ui-ux-pro-max` cho design tokens

### Step 4 — Implementation order (quan trọng)
1. Constants (SHIFT_WINDOWS, TEAMS_DEF, MACHINES, PRODUCTS)
2. Mock generators (generateMockUsers, generateMockReports, seedFromPlan)
3. Business logic (deriveReportStatus, isAbnormalShift, validateTimeWithinShift)
4. Leaf UI components (Picker, Badge, Card)
5. Page components (Dashboard, ReportForm, ApprovalsPage)
6. LoginScreen + App root + navigation

### Step 5 — Polish & Delivery
- Test all role switches end-to-end
- Verify per-shift routing (mỗi Sub Leader chỉ thấy ca của mình)
- Verify auto-approve khi Sub Leader tự nhập
- Verify abnormality blocking
- Test Bulk Approval
- Build: `npm run build`, check bundle size
- Deploy Vercel `vercel --prod`
- Chuẩn bị talking points cho demo

---

## 10. Output specifications

### File naming
- React: `App.jsx` (single-file) trong `demo-app/src/`
- Supporting: `index.html`, `vite.config.js`, `tailwind.config.js`, `package.json`

### Deployment
- Vercel Root Directory = `demo-app`
- Build command: `vite build`
- Output directory: `dist`
- Re-deploy: `vercel --prod` sau khi sửa code

### Checklist trước khi deliver

- [ ] Team-based login screen (dept tabs → shift chips → member grid)
- [ ] 9+ teams × 5 người = 45+ users sinh từ TEAMS_DEF
- [ ] Sub Leader có machineId
- [ ] Per-shift approval routing đúng dept + shiftNumber
- [ ] Auto-approve khi Sub Leader nhập ca của mình
- [ ] Abnormality auto-detect (NG>5%, downtime>60, OT no reason)
- [ ] Abnormality blocking rule đúng (NG và OT chặn, downtime chỉ cảnh báo)
- [ ] Bulk approval có Normal / Abnormal sections, select-all chỉ Normal
- [ ] deriveReportStatus aggregate đúng từ 3 ca
- [ ] Number Wheel Picker + Time Picker cross-midnight
- [ ] Date restriction (today → today-3)
- [ ] Downtime within shift window validation
- [ ] seedFromPlan tự điền Product, Operator, Leader khi chọn Máy + Ngày
- [ ] i18n VI/JA toggle tức thì
- [ ] Touch targets ≥ 44px
- [ ] Charts recharts
- [ ] Color contrast 4.5:1
- [ ] Deploy Vercel thành công
- [ ] User Manual .docx (dùng skill docx)

## 11. Phối hợp với skill khác

- **factory-ba** — dùng TRƯỚC để phân tích nghiệp vụ và thiết kế team/role/workflow
- **odoo-demo** — dùng cho UI patterns (Number Wheel, Time Picker, Odoo look)
- **ui-ux-pro-max** — dùng cho design tokens, color palette, accessibility
- **docx** — dùng để xuất User Manual cuối cùng
- **pptx** — dùng để xuất proposal slides

## 12. Tham khảo

- `references/workflow-patterns.md` — chi tiết workflow state machine, per-shift rules
