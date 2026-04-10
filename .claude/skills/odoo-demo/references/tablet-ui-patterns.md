# Tablet UI Patterns — Reference

Các pattern UI đã được kiểm chứng từ dự án FCC Vietnam, áp dụng cho mọi demo cần chạy trên tablet tại shop floor.

## 1. Touch target sizing

| Component | Min size |
|---|---|
| Button primary | 48 × 48 px |
| Button secondary | 44 × 44 px |
| Checkbox | 24 × 24 px (clickable area 44 × 44) |
| Icon button | 44 × 44 px |
| List item row | 56 px cao |
| Dropdown option | 48 px cao |
| Font base | 16 px (không nhỏ hơn 14 px) |

Tailwind classes tham khảo:
```html
<!-- Primary button -->
<button class="min-h-[48px] min-w-[48px] px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold">

<!-- List row -->
<div class="min-h-[56px] flex items-center px-4 gap-3 border-b">

<!-- Checkbox wrapper -->
<label class="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
  <input type="checkbox" class="w-6 h-6" />
</label>
```

## 2. Color system — semantic for status

```javascript
const STATUS_STYLES = {
  DRAFT:            { bg: 'bg-gray-100',    text: 'text-gray-700',    border: 'border-gray-300',    label: 'Nháp' },
  LEADER_REVIEW:    { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300',   label: 'Chờ tổ trưởng' },
  LEADER_APPROVED:  { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-300',     label: 'TT đã duyệt' },
  CHIEF_REVIEW:     { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-300',  label: 'Chờ Chief' },
  CHIEF_APPROVED:   { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Hoàn tất' },
  REJECTED:         { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-300',     label: 'Từ chối' },
  ABNORMAL:         { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-400',  label: 'Bất thường' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text} border ${s.border}`}>
      {s.label}
    </span>
  );
}
```

## 3. Layout — tablet responsive breakpoints

```javascript
// Tailwind default breakpoints đủ dùng
// md: 768px  (portrait tablet)
// lg: 1024px (landscape tablet)
// xl: 1280px (large tablet + small laptop)

// Ví dụ grid adaptation
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(...)}
</div>

// Dashboard KPI cards
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <KPICard /> ...
</div>
```

## 4. Navbar pattern tablet-first

```jsx
function Navbar({ user, lang, setLang, onLogout, onNavigate, t }) {
  return (
    <nav className="bg-indigo-900 text-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          <Factory className="w-7 h-7" />
          <h1 className="font-bold text-lg hidden md:block">{t('appName')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'vi' ? 'ja' : 'vi')}
                  className="min-h-[44px] px-3 border border-white/30 rounded-lg">
            {lang === 'vi' ? '日本語' : 'VI'}
          </button>
          <div className="flex items-center gap-2 min-h-[44px] px-3">
            <div className="w-9 h-9 bg-white text-indigo-900 rounded-full flex items-center justify-center font-bold">
              {user.name[0]}
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-white/70">{user.dept || t(user.role)}</div>
            </div>
          </div>
          <button onClick={onLogout} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
```

## 5. KPI Card

```jsx
function KPICard({ icon: Icon, label, value, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend && (
          <span className={`text-xs ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
```

## 6. Shift Tab Navigator (trong ReportForm)

```jsx
function ShiftTabs({ shifts, currentIdx, setCurrentIdx, t }) {
  return (
    <div className="flex gap-2 mb-4 border-b">
      {shifts.map((sh, i) => {
        const active = i === currentIdx;
        const ab = isAbnormalShift(sh);
        return (
          <button key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`relative px-6 py-3 font-medium min-h-[56px] ${
                    active ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-600'
                  }`}>
            {t(`shift${sh.shiftNumber}`)}
            {ab.abnormal && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
            )}
            <div className="text-xs text-gray-400 mt-1">{sh.startTime} — {sh.endTime}</div>
          </button>
        );
      })}
    </div>
  );
}
```

## 7. Form field pattern — dễ chạm, rõ ràng

```jsx
function Field({ label, required, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Usage
<Field label={t('okQty')} required>
  <button onClick={() => setNumberPickerOpen('okQty')}
          className="w-full min-h-[56px] px-4 border-2 border-gray-300 rounded-lg text-left text-xl font-semibold hover:border-indigo-500">
    {shift.okQty || '—'}
  </button>
</Field>
```

## 8. Downtime list pattern

```jsx
function DowntimeList({ shift, onChange, t }) {
  const addDowntime = () => {
    const next = [...(shift.downtime || []), { start: '', end: '', reason: '', note: '' }];
    onChange({ ...shift, downtime: next });
  };

  const updateDowntime = (idx, patch) => {
    const next = shift.downtime.map((d, i) => i === idx ? { ...d, ...patch } : d);
    onChange({ ...shift, downtime: next });
  };

  const removeDowntime = (idx) => {
    onChange({ ...shift, downtime: shift.downtime.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      {(shift.downtime || []).map((d, i) => (
        <div key={i} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Downtime #{i + 1}</span>
            <button onClick={() => removeDowntime(i)} className="p-2 min-h-[44px] min-w-[44px] text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('startTime')}>
              <TimePickerButton value={d.start} shiftNumber={shift.shiftNumber}
                                onChange={v => updateDowntime(i, { start: v })} />
            </Field>
            <Field label={t('endTime')}>
              <TimePickerButton value={d.end} shiftNumber={shift.shiftNumber}
                                onChange={v => updateDowntime(i, { end: v })} />
            </Field>
          </div>
          <Field label={t('reason')}>
            <select value={d.reason} onChange={e => updateDowntime(i, { reason: e.target.value })}
                    className="w-full min-h-[48px] px-3 border rounded-lg">
              <option value="">—</option>
              {DOWNTIME_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      ))}
      <button onClick={addDowntime}
              className="w-full min-h-[56px] border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600">
        + {t('addDowntime')}
      </button>
    </div>
  );
}
```

## 9. Modal pattern — full-screen tablet

```jsx
function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col"
           onClick={e => e.stopPropagation()}>
        <header className="p-5 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px]">
            <X className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {actions && <footer className="p-5 border-t flex gap-3 justify-end">{actions}</footer>}
      </div>
    </div>
  );
}
```

## 10. Accessibility checklist

- [ ] Color contrast ≥ 4.5:1 cho text thường, 3:1 cho text lớn
- [ ] Focus states rõ ràng (ring-2 ring-indigo-500)
- [ ] Keyboard navigation hoạt động (Tab, Enter, Esc)
- [ ] aria-label cho icon-only buttons
- [ ] Form error có thông báo text, không chỉ màu
- [ ] Touch target ≥ 44×44 px
- [ ] Font size ≥ 16 px cho body text
- [ ] Status được truyền bằng text + màu + icon (không chỉ màu)
