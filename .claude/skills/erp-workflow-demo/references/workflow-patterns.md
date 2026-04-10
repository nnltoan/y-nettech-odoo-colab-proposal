# Factory Workflow Patterns - Chi tiết

## 1. Production Daily Report (生産日報)

### Flow
```
Operator → Line Supervisor → Production Manager
(作成)     (レビュー・L1承認)   (最終承認)
```

### Form fields
- Report date (報告日)
- Line / Work Center (ライン/ワークセンター)
- Shift (シフト): Day/Night
- Products produced (生産実績): [{product, planned, actual, unit}]
- Defects (不良数): [{type, count, description}]
- Downtime (停止時間): [{reason, minutes, equipment}]
- Material usage (材料使用量)
- Worker attendance (出勤状況)
- Comments (備考)

### Auto-calculated
- Achievement rate = actual / planned × 100
- Defect rate = defects / actual × 100
- Availability = (shift_time - downtime) / shift_time × 100

---

## 2. Quality Alert (品質異常報告)

### Flow
```
Inspector/Operator → Quality Manager → Factory Director (if critical)
(発見・報告)          (調査・対策)        (最終判断)
```

### Severity levels
- **Critical (重大)**: Safety issue or customer impact → Must escalate to Director
- **Major (重要)**: Out of spec, requires rework → Manager approval
- **Minor (軽微)**: Cosmetic, within tolerance → Manager review

### Form fields
- Alert ID (異常番号): Auto-generated QA-YYYY-NNNN
- Detected at (発見工程): IQC / IPQC / OQC / Customer
- Product (製品)
- Lot/Serial (ロット/シリアル)
- Severity (重要度): Critical / Major / Minor
- Description (異常内容)
- Photos (写真): attachment area
- Affected quantity (影響数量)
- Root cause (原因): 4M analysis (Man/Machine/Material/Method)
- Containment action (暫定対策)
- Corrective action (恒久対策)
- Preventive action (予防対策)
- Due date (対策期限)

---

## 3. Maintenance Request (保全依頼)

### Flow
```
Anyone → Maintenance Manager → Factory Director (if cost > ¥500,000)
(依頼)    (確認・手配)           (承認)
```

### Types
- **Breakdown (故障)**: Emergency, immediate attention
- **Preventive (予防保全)**: Scheduled maintenance
- **Improvement (改善)**: Equipment upgrade/modification

### Form fields
- Equipment (設備): from master list
- Type (種別): Breakdown / Preventive / Improvement
- Priority (優先度): Emergency / High / Normal / Low
- Description (内容)
- Estimated cost (見積金額): ¥
- Estimated duration (見積時間): hours
- Assigned technician (担当者)
- Spare parts needed (必要部品)
- Safety notes (安全注意事項)

---

## 4. Purchase Request (購買依頼)

### Flow
```
Requester → Department Manager → Factory Director (if > ¥1,000,000)
(依頼)       (部門承認)            (工場長承認)
```

### Form fields
- Items: [{product, quantity, unit_price, supplier, delivery_date}]
- Total amount (合計金額)
- Purpose/reason (理由)
- Budget code (予算コード)
- Urgency (緊急度)

---

## 5. Engineering Change Order (設計変更)

### Flow (3-level approval)
```
Engineer → Quality Manager → Production Manager → Factory Director
(起案)      (品質影響確認)     (製造影響確認)       (最終承認)
```

### Form fields
- ECO number: ECO-YYYY-NNNN
- Change type: BOM change / Process change / Spec change
- Affected products
- Current state (現状)
- Proposed change (変更内容)
- Reason (理由): Cost reduction / Quality improvement / Customer request
- Impact analysis (影響分析): Quality / Cost / Schedule
- Implementation plan (実施計画)
- Effective date (適用日)

---

## 6. Dashboard KPI Definitions

### Factory Director KPIs
| KPI | Formula | Target | Unit |
|-----|---------|--------|------|
| OEE | Availability × Performance × Quality | ≥85% | % |
| Output Volume | Sum of daily production | Per plan | units |
| Defect Rate | Defects / Total produced | ≤0.5% | PPM or % |
| On-Time Delivery | On-time orders / Total orders | ≥98% | % |
| Production Cost | Total manufacturing cost | ≤budget | ¥ |
| Safety | Days without incident | Continuous | days |

### Production Manager KPIs
| KPI | Formula | Target | Unit |
|-----|---------|--------|------|
| Daily Achievement | Actual / Planned | ≥95% | % |
| Machine Utilization | Run time / Available time | ≥80% | % |
| Cycle Time | Actual cycle / Standard cycle | ≤105% | ratio |
| WIP Level | Current WIP inventory | Optimal range | units |
| Changeover Time | Setup time between products | Minimize | min |

### Quality Manager KPIs
| KPI | Formula | Target | Unit |
|-----|---------|--------|------|
| First Pass Yield | Good first time / Total | ≥99% | % |
| COPQ | Cost of poor quality | Minimize | ¥ |
| NCR Count | Open non-conformance reports | ≤5 | count |
| Customer Complaints | Monthly complaints | 0 | count |
| Inspection Coverage | Checked / Total | 100% | % |

### Operator KPIs (simple, personal)
| KPI | Formula | Target | Unit |
|-----|---------|--------|------|
| My Output Today | Units completed | Per assignment | units |
| My Quality | Good units / My total | ≥99.5% | % |
| Tasks Completed | Done / Assigned | 100% | count |
