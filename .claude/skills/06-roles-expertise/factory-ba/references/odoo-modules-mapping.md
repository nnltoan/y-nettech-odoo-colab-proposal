# Odoo Modules Mapping cho Nhà máy Sản xuất

## Chi tiết mapping nghiệp vụ → Odoo Module → Tính năng

### Manufacturing (mrp)
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Bill of Materials | mrp.bom | Multi-level BOM, phantom BOM, kit |
| Manufacturing Order | mrp.production | Create, plan, produce, close MO |
| Work Centers | mrp.workcenter | Define machines/stations, capacity, OEE |
| Routing | mrp.routing | Sequence of operations |
| Work Orders | mrp.workorder | Track operations per MO |
| Planning | MRP Scheduler | Auto-generate MOs from demand |
| Subcontracting | mrp_subcontracting | Outsource operations |
| PLM | mrp_plm | Engineering Change Orders |

### Quality (quality_control, quality_mrp)
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Quality Points | quality.point | Define when/where to check |
| Quality Checks | quality.check | Execute checks (pass/fail/measure) |
| Quality Alerts | quality.alert | Report and track issues |
| SPC | quality_control_spc | Statistical process control charts |
| Worksheet | quality_worksheet | Custom check instructions |

### Inventory (stock)
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Products | product.product | Items, variants, tracking |
| Warehouses | stock.warehouse | Physical locations |
| Transfers | stock.picking | Receipts, deliveries, internal |
| Lot/Serial | stock.lot | Traceability |
| Routes | stock.route | Push/pull rules |
| Inventory Adj | stock.inventory | Cycle counts |
| Barcodes | stock_barcode | Scan operations |
| Replenishment | stock.warehouse.orderpoint | Auto reorder rules |

### Maintenance (maintenance)
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Equipment | maintenance.equipment | Register machines |
| Categories | maintenance.equipment.category | Group equipment types |
| Requests | maintenance.request | Create/track maintenance |
| Preventive | maintenance.request (type=preventive) | Scheduled maintenance |
| Corrective | maintenance.request (type=corrective) | Breakdown repair |
| Calendar | Calendar view | Visual scheduling |

### HR & Attendance
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Employees | hr.employee | Employee records |
| Attendance | hr.attendance | Check in/out, kiosk mode |
| Planning | planning.slot | Shift scheduling |
| Leaves | hr.leave | Time off management |
| Appraisal | hr.appraisal | Performance reviews |

### Accounting (account)
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| Journal Entries | account.move | Financial transactions |
| Invoicing | account.move (type=invoice) | AR/AP |
| Payments | account.payment | Payment processing |
| Bank Reconciliation | account.bank.statement | Match transactions |
| Reports | Financial Reports | P&L, Balance Sheet |
| Localization | l10n_jp | Japanese chart of accounts |

### IoT (iot) — Integration với Y-Nettech
| Tính năng | Odoo Feature | Mô tả |
|---|---|---|
| IoT Box | iot.device | Connect industrial devices |
| Triggers | iot.trigger | Auto-actions from device input |
| Dashboard | Custom | Real-time monitoring |
| API | JSON-RPC / REST | Data exchange with IoT platform |

---

## Integration Points (ERP ↔ IoT)

```
IoT Sensors (Y-Nettech)          Odoo ERP (DanaExperts)
========================          =====================
Machine Status    ──────────────→ Work Center OEE
Temperature/Pressure ───────────→ Quality Alerts
Production Count  ──────────────→ Manufacturing Order Progress
Energy Meter      ──────────────→ Cost Accounting
Barcode/RFID      ──────────────→ Inventory Transfers
Alarm Signals     ──────────────→ Maintenance Requests
```
