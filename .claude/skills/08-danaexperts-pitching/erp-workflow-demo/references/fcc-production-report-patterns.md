# FCC Vietnam Production Report — Code Patterns Reference

Tổng hợp các code snippet đã kiểm chứng từ dự án **FCC Vietnam Smart Factory Production Report System**. Dùng làm template khi tạo dự án tương tự.

Stack: React 18 + Vite 6 + Tailwind 3 + lucide-react + recharts.

---

## 1. Constants ở đầu App.jsx

```javascript
// Shift windows — dùng cho validate time picker
const SHIFT_WINDOWS = {
  1: { label: 'Ca 1', start: '06:00', end: '14:00', crossMidnight: false },
  2: { label: 'Ca 2', start: '14:00', end: '22:00', crossMidnight: false },
  3: { label: 'Ca 3', start: '22:00', end: '06:00', crossMidnight: true },
};

// Thresholds cho auto-abnormality detection
const NG_THRESHOLD_PERCENT = 5;       // NG Rate > 5% → abnormal, blocking
const DOWNTIME_THRESHOLD_MIN = 60;    // Total downtime > 60 min → abnormal, warning
const MIN_REPORT_DATE_OFFSET = 3;     // Ngày báo cáo: hôm nay → hôm nay - 3 ngày

// Departments
const DEPT_TABS = [
  { key: 'Press', labelVi: 'Dập',  labelJa: 'プレス', line: 'Line A' },
  { key: 'CNC',   labelVi: 'CNC',  labelJa: 'CNC',    line: 'Line B' },
  { key: 'Mill',  labelVi: 'Phay', labelJa: 'フライス', line: 'Line C' },
];

// Machines
const MACHINES = [
  { id: 'PR-01', name: 'Press 01', dept: 'Press', line: 'Line A' },
  { id: 'PR-02', name: 'Press 02', dept: 'Press', line: 'Line A' },
  { id: 'PR-03', name: 'Press 03', dept: 'Press', line: 'Line A' },
  { id: 'CNC-01', name: 'CNC 01',  dept: 'CNC',   line: 'Line B' },
  { id: 'CNC-02', name: 'CNC 02',  dept: 'CNC',   line: 'Line B' },
  { id: 'CNC-03', name: 'CNC 03',  dept: 'CNC',   line: 'Line B' },
  { id: 'ML-01',  name: 'Mill 01', dept: 'Mill',  line: 'Line C' },
  { id: 'ML-02',  name: 'Mill 02', dept: 'Mill',  line: 'Line C' },
];

// Teams — source of truth cho users
const TEAMS_DEF = [
  { dept: 'Press', line: 'Line A', shiftNumber: 1,
    subLeaderName: 'Nguyễn Thành Tâm',
    members: ['Nguyễn Văn An', 'Trần Văn Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung'] },
  { dept: 'Press', line: 'Line A', shiftNumber: 2,
    subLeaderName: 'Phạm Hữu Nghĩa',
    members: ['Hoàng Văn Em', 'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hoa'] },
  { dept: 'Press', line: 'Line A', shiftNumber: 3,
    subLeaderName: 'Lê Văn Khánh',
    members: ['Đỗ Văn Khoa', 'Ngô Thị Lan', 'Phan Văn Minh', 'Lý Thị Nga'] },
  { dept: 'CNC', line: 'Line B', shiftNumber: 1,
    subLeaderName: 'Trần Quốc Việt',
    members: ['Trịnh Văn Oanh', 'Dương Thị Phúc', 'Cao Văn Quân', 'Mai Thị Rạng'] },
  { dept: 'CNC', line: 'Line B', shiftNumber: 2,
    subLeaderName: 'Bùi Minh Tuấn',
    members: ['Võ Văn Sơn', 'Hồ Thị Thảo', 'Tô Văn Uy', 'Lâm Thị Vân'] },
  { dept: 'CNC', line: 'Line B', shiftNumber: 3,
    subLeaderName: 'Nguyễn Hoàng Nam',
    members: ['Huỳnh Văn Xuân', 'Tạ Thị Yến', 'Đinh Văn Dũng', 'Chu Thị Ánh'] },
  { dept: 'Mill', line: 'Line C', shiftNumber: 1,
    subLeaderName: 'Lê Thanh Hải',
    members: ['Nguyễn Thanh Bảo', 'Trần Thanh Cảnh', 'Lê Thanh Dương', 'Phạm Thanh Huy'] },
  { dept: 'Mill', line: 'Line C', shiftNumber: 2,
    subLeaderName: 'Võ Đức Thịnh',
    members: ['Hoàng Thanh Khải', 'Vũ Thị Lộc', 'Đặng Thanh Minh', 'Bùi Thanh Nguyên'] },
  { dept: 'Mill', line: 'Line C', shiftNumber: 3,
    subLeaderName: 'Đinh Quang Hưng',
    members: ['Đỗ Thanh Phát', 'Ngô Thanh Quang', 'Phan Thanh Sơn', 'Lý Thanh Tùng'] },
];

// Products
const PRODUCTS = [
  { code: 'PRD-001', nameVi: 'Brake Disc Type A', nameJa: 'ブレーキディスク A型', dept: 'Press' },
  { code: 'PRD-002', nameVi: 'Clutch Plate Std',  nameJa: 'クラッチプレート',     dept: 'Press' },
  { code: 'PRD-003', nameVi: 'Gear Shaft M6',     nameJa: 'ギアシャフト M6',     dept: 'CNC' },
  { code: 'PRD-004', nameVi: 'Piston Rod 25mm',   nameJa: 'ピストンロッド 25mm', dept: 'CNC' },
  { code: 'PRD-005', nameVi: 'Housing Cover',     nameJa: 'ハウジングカバー',     dept: 'Mill' },
  { code: 'PRD-006', nameVi: 'Bracket Assy',      nameJa: 'ブラケット ASSY',     dept: 'Mill' },
];

// Dropdown options
const NG_REASONS = ['Vết xước', 'Biến dạng', 'Sai kích thước', 'Lỗi bề mặt', 'Khác'];
const DOWNTIME_REASONS = ['Breakdown', 'Maintenance', 'Material shortage', 'Setup/Changeover', 'Other'];
```

---

## 2. generateMockUsers — sinh 45 operator + sub leader

```javascript
function generateMockUsers(machines) {
  const users = [];
  let idx = 0;

  // Management (không thuộc team sản xuất)
  const management = [
    { name: 'Lê Minh Châu',       role: 'section_manager', dept: null, title: 'Chief' },
    { name: 'Nguyễn Công Đạt',    role: 'ast_chief',       dept: null, title: 'Assistant Chief' },
    { name: 'Trần Thị Kim Ngân',  role: 'qa',              dept: null, title: 'QA Inspector' },
    { name: 'Phạm Văn Hiếu',      role: 'maintenance',     dept: null, title: 'Maintenance' },
    { name: 'Hoàng Đức Minh',     role: 'director',        dept: null, title: 'Factory Director' },
  ];
  management.forEach(m => {
    users.push({ id: `u${String(++idx).padStart(3, '0')}`, ...m, teamId: 'mgmt' });
  });

  // Production teams
  TEAMS_DEF.forEach(team => {
    const teamId = `${team.dept}-S${team.shiftNumber}`;
    const teamMachines = machines.filter(m => m.dept === team.dept);

    // Sub Leader kiêm Operator — luôn giữ máy đầu tiên của dept
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

    // Members cycling qua machines (bắt đầu từ index 1 để tránh trùng Sub Lead)
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

---

## 3. Helpers cho resolution theo team

```javascript
function getTeamLeaderByDeptAndShift(users, dept, shiftNumber) {
  // Exact match dept + shift
  let leader = users.find(u =>
    u.role === 'sub_leader' && u.dept === dept && u.shiftNumber === shiftNumber
  );
  // Fallback: bất kỳ sub_leader nào trong dept (phòng trường hợp thiếu ca)
  if (!leader) leader = users.find(u => u.role === 'sub_leader' && u.dept === dept);
  return leader;
}

function getTeamOperators(users, dept, shiftNumber) {
  return users.filter(u =>
    (u.role === 'operator' || u.role === 'sub_leader') &&
    u.dept === dept &&
    u.shiftNumber === shiftNumber
  );
}

function getMachinesForDept(dept) {
  return MACHINES.filter(m => m.dept === dept);
}

function canLeaderTouchShift(user, report, shift) {
  if (user.role !== 'sub_leader') return false;
  if (report.dept !== user.dept) return false;
  if (user.shiftNumber && shift.shiftNumber !== user.shiftNumber) return false;
  return true;
}
```

---

## 4. Time math utilities

```javascript
function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function fromMinutes(min) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function diffMinutes(start, end, crossMidnight = false) {
  let s = toMinutes(start);
  let e = toMinutes(end);
  if (crossMidnight && e < s) e += 24 * 60;
  return e - s;
}

function validateTimeWithinShift(time, shiftNumber) {
  const { start, end, crossMidnight } = SHIFT_WINDOWS[shiftNumber];
  const t = toMinutes(time);
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (crossMidnight) return t >= s || t <= e; // Ca 3
  return t >= s && t <= e;
}

function validateDowntimeRange(dt, shiftNumber) {
  const { crossMidnight } = SHIFT_WINDOWS[shiftNumber];
  if (!validateTimeWithinShift(dt.start, shiftNumber)) return false;
  if (!validateTimeWithinShift(dt.end, shiftNumber))   return false;
  // Ca 3: start có thể ở 23:00, end ở 01:00 — cần cross-midnight diff
  const minutes = diffMinutes(dt.start, dt.end, crossMidnight);
  return minutes > 0;
}
```

---

## 5. Business logic — status & abnormality

```javascript
function deriveReportStatus(report) {
  const shifts = report.shifts || [];
  if (shifts.length === 0) return 'DRAFT';
  if (shifts.every(s => s.status === 'DRAFT'))           return 'DRAFT';
  if (shifts.some(s => s.status === 'REJECTED'))         return 'REJECTED';
  if (shifts.every(s => s.status === 'CHIEF_APPROVED'))  return 'CHIEF_APPROVED';
  if (shifts.every(s => s.status === 'LEADER_APPROVED')) return 'CHIEF_REVIEW';
  return 'LEADER_REVIEW';
}

function computeShiftMetrics(shift) {
  const ok = shift.okQty || 0;
  const ng = shift.ngQty || 0;
  const total = ok + ng;
  const ngRate = total > 0 ? (ng / total) * 100 : 0;
  const totalDowntime = (shift.downtime || []).reduce((sum, d) => {
    const { crossMidnight } = SHIFT_WINDOWS[shift.shiftNumber];
    return sum + Math.max(0, diffMinutes(d.start, d.end, crossMidnight));
  }, 0);
  return { ok, ng, total, ngRate, totalDowntime };
}

function isAbnormalShift(shift) {
  const { ngRate, totalDowntime } = computeShiftMetrics(shift);
  const otWithoutReason = shift.ot?.enabled && !String(shift.ot?.reason || '').trim();
  const flags = [];
  if (ngRate > NG_THRESHOLD_PERCENT)
    flags.push({ type: 'ng',       blocking: true,  msg: `NG ${ngRate.toFixed(1)}% > ${NG_THRESHOLD_PERCENT}%` });
  if (totalDowntime > DOWNTIME_THRESHOLD_MIN)
    flags.push({ type: 'downtime', blocking: false, msg: `Downtime ${totalDowntime} phút > ${DOWNTIME_THRESHOLD_MIN}` });
  if (otWithoutReason)
    flags.push({ type: 'ot',       blocking: true,  msg: 'OT bật mà không có lý do' });
  return {
    abnormal: flags.length > 0,
    flags,
    blocking: flags.some(f => f.blocking),
  };
}
```

---

## 6. seedFromPlan — auto-fill report khi chọn máy + ngày

```javascript
function seedFromPlan({ machineId, date, users, plans }) {
  const machine = MACHINES.find(m => m.id === machineId);
  if (!machine) return null;

  const planRow = plans.find(p => p.machineId === machineId && p.date === date);
  const product = planRow ? PRODUCTS.find(pr => pr.code === planRow.productCode) : null;

  const shifts = [1, 2, 3].map(shiftNum => {
    const operators = getTeamOperators(users, machine.dept, shiftNum);
    const operator = operators.find(o => o.machineId === machineId) || operators[0];
    const leader = getTeamLeaderByDeptAndShift(users, machine.dept, shiftNum);

    return {
      shiftNumber: shiftNum,
      operatorId: operator?.id || '',
      operatorName: operator?.name || '',
      leaderId: leader?.id || '',
      leaderName: leader?.name || '',
      leaderFromPlan: !!leader,
      productCode: product?.code || '',
      productName: product?.nameVi || '',
      targetQty: planRow?.targetQty || 0,
      okQty: 0,
      ngQty: 0,
      ngReason: '',
      ngNote: '',
      startTime: SHIFT_WINDOWS[shiftNum].start,
      endTime: SHIFT_WINDOWS[shiftNum].end,
      downtime: [],
      ot: { enabled: false, start: '', end: '', reason: '', peopleCount: 0 },
      status: 'DRAFT',
      submittedAt: null,
      approvedAt: null,
      approvedBy: null,
    };
  });

  return {
    id: `RPT-${date}-${machineId}`,
    date,
    machineId,
    machineName: machine.name,
    dept: machine.dept,
    line: machine.line,
    shifts,
    status: 'DRAFT',
    auditTrail: [{ at: new Date().toISOString(), by: 'system', action: 'seeded_from_plan' }],
  };
}
```

---

## 7. Submit shift + auto-approve

```javascript
function submitShift(report, shiftIdx, currentUser) {
  const shift = report.shifts[shiftIdx];

  // Check blocking abnormalities
  const ab = isAbnormalShift(shift);
  if (ab.blocking && !shift.abnormalNote) {
    return { ok: false, error: `Không thể gửi duyệt: ${ab.flags.filter(f => f.blocking).map(f => f.msg).join(', ')}` };
  }

  // Sub Leader kiêm Operator → auto-approve L1
  const isSelfApprove = currentUser.role === 'sub_leader'
    && currentUser.dept === report.dept
    && currentUser.shiftNumber === shift.shiftNumber;

  if (isSelfApprove) {
    shift.status = 'LEADER_APPROVED';
    shift.approvedBy = currentUser.id;
    shift.approvedAt = new Date().toISOString();
  } else {
    shift.status = 'LEADER_REVIEW';
  }
  shift.submittedAt = new Date().toISOString();
  report.auditTrail.push({
    at: new Date().toISOString(),
    by: currentUser.id,
    action: isSelfApprove ? 'submit_and_self_approve' : 'submit',
    shiftNumber: shift.shiftNumber,
  });

  // Recompute overall status
  report.status = deriveReportStatus(report);
  return { ok: true };
}
```

---

## 8. Approvals filter — Sub Leader chỉ thấy ca của mình

```javascript
function useMyPendingShifts(reports, user) {
  return useMemo(() => {
    const rows = [];
    if (!user) return rows;

    reports.forEach(r => {
      // Sub Leader: filter by dept + shift
      if (user.role === 'sub_leader') {
        if (r.dept !== user.dept) return;
        (r.shifts || []).forEach((sh, si) => {
          if (sh.status !== 'LEADER_REVIEW') return;
          if (user.shiftNumber && sh.shiftNumber !== user.shiftNumber) return;
          rows.push({ report: r, shift: sh, shiftIdx: si });
        });
      }
      // Ast Chief / Chief / Director: theo report status
      else if (['ast_chief', 'section_manager', 'director'].includes(user.role)) {
        if (r.status !== 'CHIEF_REVIEW') return;
        rows.push({ report: r, whole: true });
      }
    });
    return rows;
  }, [reports, user]);
}
```

---

## 9. Bulk approval — Normal / Abnormal panel

```jsx
function BulkApprovalPanel({ pendingShifts, currentUser, onBulkApprove, t }) {
  const [selected, setSelected] = useState(new Set());

  const { normal, abnormal } = useMemo(() => {
    const n = [], a = [];
    pendingShifts.forEach(row => {
      const ab = isAbnormalShift(row.shift);
      (ab.abnormal ? a : n).push({ ...row, abnormal: ab });
    });
    return { normal: n, abnormal: a };
  }, [pendingShifts]);

  const keyOf = (row) => `${row.report.id}-${row.shiftIdx ?? 'whole'}`;

  const selectAllNormal = () => {
    setSelected(new Set(normal.map(keyOf)));
  };

  const handleApprove = () => {
    const rowsToApprove = [...normal, ...abnormal].filter(r => selected.has(keyOf(r)));
    onBulkApprove(rowsToApprove, currentUser);
    setSelected(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={selectAllNormal}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg min-h-[44px]">
          {t('selectAllNormal')} ({normal.length})
        </button>
        <button onClick={handleApprove} disabled={selected.size === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 min-h-[44px]">
          {t('approveSelected')} ({selected.size})
        </button>
      </div>

      <section className="border rounded-lg bg-white">
        <h3 className="p-3 bg-emerald-50 text-emerald-800 font-semibold">
          {t('normalShifts')} — {normal.length}
        </h3>
        {normal.map(row => (
          <ShiftBulkRow key={keyOf(row)} row={row} selected={selected} setSelected={setSelected} t={t} />
        ))}
      </section>

      <section className="border-2 border-orange-400 rounded-lg bg-white">
        <h3 className="p-3 bg-orange-100 text-orange-800 font-semibold">
          {t('abnormalShifts')} — {abnormal.length} — {t('mustReviewCarefully')}
        </h3>
        {abnormal.map(row => (
          <ShiftBulkRow key={keyOf(row)} row={row} selected={selected} setSelected={setSelected}
                        warning={row.abnormal.flags.map(f => f.msg).join(' · ')} t={t} />
        ))}
      </section>
    </div>
  );
}
```

---

## 10. LoginScreen — two-tier tabs

```jsx
function LoginScreen({ users, onLogin, lang, setLang, t }) {
  const [deptTab, setDeptTab] = useState('Press');
  const [shiftTab, setShiftTab] = useState(1);

  const teamUsers = useMemo(() => {
    if (deptTab === 'Management') {
      return users.filter(u =>
        ['section_manager', 'ast_chief', 'qa', 'maintenance', 'director'].includes(u.role)
      );
    }
    return users.filter(u => u.dept === deptTab && u.shiftNumber === shiftTab);
  }, [users, deptTab, shiftTab]);

  const mgmtGroups = useMemo(() => {
    if (deptTab !== 'Management') return null;
    return {
      leadership: teamUsers.filter(u => ['section_manager', 'ast_chief', 'director'].includes(u.role)),
      support: teamUsers.filter(u => ['qa', 'maintenance'].includes(u.role)),
    };
  }, [teamUsers, deptTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">{t('appName')}</h1>
            <p className="text-sm text-gray-500">{t('selectTeam')}</p>
          </div>
          <button onClick={() => setLang(lang === 'vi' ? 'ja' : 'vi')}
                  className="px-3 py-2 border rounded-lg">
            {lang === 'vi' ? '日本語' : 'Tiếng Việt'}
          </button>
        </header>

        {/* Tier 1: Dept tabs */}
        <div className="flex gap-2 mb-4 border-b">
          {[...DEPT_TABS, { key: 'Management', labelVi: 'Quản lý', labelJa: '管理' }].map(d => (
            <button key={d.key}
                    onClick={() => setDeptTab(d.key)}
                    className={`px-4 py-3 font-medium min-h-[48px] ${
                      deptTab === d.key
                        ? 'border-b-2 border-indigo-600 text-indigo-700'
                        : 'text-gray-600'
                    }`}>
              {lang === 'vi' ? d.labelVi : d.labelJa}
            </button>
          ))}
        </div>

        {/* Tier 2: Shift chips (or mgmt groups header) */}
        {deptTab !== 'Management' && (
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <button key={s}
                      onClick={() => setShiftTab(s)}
                      className={`px-4 py-2 rounded-full min-h-[44px] ${
                        shiftTab === s
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                {t(`shift${s}`)}
              </button>
            ))}
          </div>
        )}

        {/* Tier 3: Member grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamUsers.map(u => {
            const isSubLead = u.role === 'sub_leader';
            return (
              <button key={u.id}
                      onClick={() => onLogin(u)}
                      className={`p-4 rounded-xl text-left min-h-[88px] transition ${
                        isSubLead
                          ? 'border-2 border-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                          : 'border border-gray-200 bg-white hover:bg-gray-50'
                      }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.title || u.role}</div>
                    {u.machineId && <div className="text-xs text-indigo-600">{u.machineId}</div>}
                  </div>
                  {isSubLead && (
                    <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-full">SL</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## 11. Number Wheel Picker (skeleton)

Implementation chi tiết dùng touch events, snap animation. Dưới đây là skeleton logic:

```jsx
function NumberWheelPicker({ value, onChange, min = 0, max = 9999, onClose }) {
  const digits = String(max).length;
  const [cols, setCols] = useState(() => padLeft(String(value), digits).split('').map(Number));

  const updateDigit = (idx, delta) => {
    setCols(prev => {
      const next = [...prev];
      next[idx] = (next[idx] + delta + 10) % 10;
      const num = Number(next.join(''));
      if (num >= min && num <= max) return next;
      return prev;
    });
  };

  const confirm = () => onChange(Number(cols.join('')));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl md:rounded-2xl p-6 w-full md:w-96">
        <div className="flex justify-center gap-2 mb-6">
          {cols.map((d, i) => (
            <div key={i} className="flex flex-col items-center">
              <button onClick={() => updateDigit(i, +1)} className="p-3 min-h-[48px] min-w-[48px]">▲</button>
              <div className="text-4xl font-bold w-14 text-center py-2 border-y-2 border-indigo-500">{d}</div>
              <button onClick={() => updateDigit(i, -1)} className="p-3 min-h-[48px] min-w-[48px]">▼</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border rounded-lg min-h-[48px]">✕</button>
          <button onClick={confirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg min-h-[48px]">✓</button>
        </div>
      </div>
    </div>
  );
}
```

---

## 12. i18n VI/JA translations (starter)

```javascript
const translations = {
  vi: {
    appName: 'FCC Vietnam - Báo cáo sản xuất',
    selectTeam: 'Chọn đội của bạn',
    deptPress: 'Dập', deptCNC: 'CNC', deptMill: 'Phay',
    managementTab: 'Quản lý',
    shift1: 'Ca 1', shift2: 'Ca 2', shift3: 'Ca 3',
    createReport: 'Tạo báo cáo',
    approvals: 'Phê duyệt', dashboard: 'Bảng điều khiển',
    selectAllNormal: 'Chọn tất cả Normal',
    approveSelected: 'Duyệt đã chọn',
    normalShifts: 'Ca bình thường',
    abnormalShifts: 'Ca bất thường',
    mustReviewCarefully: 'phải xem kỹ',
    reject: 'Từ chối', approve: 'Duyệt',
    operator: 'Công nhân', subLeader: 'Tổ trưởng',
    chief: 'Chief', astChief: 'Ast Chief',
    ngRate: 'Tỷ lệ NG', downtime: 'Dừng máy', overtime: 'Tăng ca',
    save: 'Lưu', submit: 'Gửi duyệt', cancel: 'Hủy',
    startTime: 'Giờ bắt đầu', endTime: 'Giờ kết thúc',
    machine: 'Máy', date: 'Ngày', product: 'Sản phẩm',
  },
  ja: {
    appName: 'FCC Vietnam - 生産日報',
    selectTeam: 'チームを選択',
    deptPress: 'プレス', deptCNC: 'CNC', deptMill: 'フライス',
    managementTab: '管理',
    shift1: '1直', shift2: '2直', shift3: '3直',
    createReport: '日報作成',
    approvals: '承認', dashboard: 'ダッシュボード',
    selectAllNormal: '正常を全て選択',
    approveSelected: '選択を承認',
    normalShifts: '正常シフト',
    abnormalShifts: '異常シフト',
    mustReviewCarefully: '要確認',
    reject: '却下', approve: '承認',
    operator: 'オペレーター', subLeader: '組長',
    chief: '課長', astChief: '係長補佐',
    ngRate: 'NG率', downtime: '停止', overtime: '残業',
    save: '保存', submit: '提出', cancel: 'キャンセル',
    startTime: '開始時刻', endTime: '終了時刻',
    machine: '機械', date: '日付', product: '製品',
  },
};
```

---

## 13. Deployment (Vercel)

```bash
# Lần đầu
cd demo-app
npm install
vercel            # link project, chọn account, Root Directory = demo-app

# Các lần sau
vercel --prod     # file .vercel/project.json giữ link, chỉ deploy
```

Checklist trước deploy:
- `npm run build` pass
- Bundle size < 1MB gzipped
- Xóa console.log debug
- Test login từng role
- Test per-shift approval
- Test cross-midnight time picker
- Test bulk approval filter
