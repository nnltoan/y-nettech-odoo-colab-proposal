import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import {
  LogOut, Bell, Menu, X, Plus, Trash2, ChevronDown, ChevronUp,
  Home, FileText, List, Clock, TrendingUp, AlertCircle, CheckCircle,
  Zap, Users, Settings, MoreVertical, Edit, Save, Eye, Printer, Minus
} from "lucide-react";

// ==================== i18n TRANSLATIONS ====================

const i18n = {
  ja: {
    app: {
      title: "スマートファクトリー4.0 生産報告システム",
      subtitle: "効率的な生産管理と品質改善"
    },
    nav: {
      dashboard: "ダッシュボード",
      createReport: "報告書作成",
      reportList: "報告書一覧",
      pendingApprovals: "承認待ち",
      qualityAnalysis: "品質分析"
    },
    login: {
      title: "ログイン",
      selectUser: "ユーザーを選択"
    },
    roles: {
      operator: "オペレータ",
      team_leader: "班長",
      qa_manager: "品質管理",
      section_manager: "課長",
      director: "工場長"
    },
    dashboard: {
      operatorTitle: "生産オペレータダッシュボード",
      tlTitle: "班長ダッシュボード",
      qaTitle: "品質管理ダッシュボード",
      smTitle: "課長ダッシュボード",
      dirTitle: "工場長ダッシュボード"
    },
    kpi: {
      todayOutput: "本日の生産実績",
      achievementRate: "達成率",
      groupOutput: "グループ生産量",
      groupDefectRate: "グループ不良率",
      pendingApprovals: "承認待ち報告書",
      submissionRate: "提出率",
      factoryDefectRate: "工場不良率",
      fpy: "初回良率(FPY)",
      openAlerts: "オープンアラート",
      deptOutput: "部門生産量",
      defectRate: "不良率",
      oee: "総合設備効率(OEE)",
      totalOutput: "総生産量",
      defectPPM: "不良PPM",
      onTimeDelivery: "納期達成率"
    },
    report: {
      date: "日付",
      shift: "シフト",
      dayShift: "日勤",
      nightShift: "夜勤",
      machine: "機械",
      operator: "オペレータ",
      productionResults: "生産実績",
      addLine: "ラインを追加",
      plannedQty: "計画数量",
      actualQty: "実績数量",
      workHours: "作業時間",
      machineHours: "機械稼働時間",
      laborHours: "労働時間",
      shiftTotal: "シフト合計",
      shiftRemaining: "残り時間",
      defectCount: "不良数",
      defectRate: "不良率",
      achievementRate: "達成率",
      addDefect: "不良を追加",
      defectDetail: "不良の詳細",
      type: "種類",
      severity: "重大度",
      minor: "軽微",
      major: "重大",
      critical: "致命的",
      count: "個数",
      description: "説明",
      cause: "原因",
      solution: "対策",
      enterLater: "後で入力",
      operatorNote: "オペレータ備考",
      cancel: "キャンセル",
      saveDraft: "下書き保存",
      submit: "提出",
      product: "製品",
      productCode: "製品コード",
      lot: "ロット"
    },
    reportList: {
      id: "報告書ID",
      date: "日付",
      operator: "オペレータ",
      machine: "機械",
      output: "生産量",
      defects: "不良数",
      status: "ステータス",
      action: "アクション",
      detail: "詳細",
      all: "すべて",
      noReports: "報告書がありません",
      startDate: "開始日",
      endDate: "終了日"
    },
    reportDetail: {
      reportId: "報告書ID",
      workflowProgress: "ワークフロー進行状況",
      close: "閉じる",
      approve: "承認",
      reject: "差戻し",
      rejectReason: "差戻し理由",
      rejectConfirm: "確認",
      commentHistory: "コメント履歴",
      noComments: "コメントはありません",
      enterComment: "コメントを入力"
    },
    status: {
      draft: "下書き",
      saved: "保存済み",
      submitted: "提出済み",
      tlReviewing: "班長確認中",
      tlApproved: "班長承認",
      smReviewing: "課長確認中",
      smApproved: "課長承認",
      qaReviewing: "品質確認中",
      qaApproved: "品質承認",
      dirReviewing: "工場長確認中",
      dirApproved: "工場長承認",
      rejected: "差戻し"
    },
    quality: {
      titleAnalysis: "品質分析",
      defectTrend: "不良トレンド",
      oeeAnalysis: "OEE分析",
      categoryAnalysis: "カテゴリ別分析"
    },
    common: {
      units: "個/pcs",
      hours: "h",
      percent: "%",
      logout: "ログアウト"
    }
  },
  en: {
    app: {
      title: "Smart Factory 4.0 Production Report System",
      subtitle: "Efficient Production Management and Quality Improvement"
    },
    nav: {
      dashboard: "Dashboard",
      createReport: "Create Report",
      reportList: "Report List",
      pendingApprovals: "Pending Approvals",
      qualityAnalysis: "Quality Analysis"
    },
    login: {
      title: "Login",
      selectUser: "Select User"
    },
    roles: {
      operator: "Operator",
      team_leader: "Team Leader",
      qa_manager: "QA Manager",
      section_manager: "Section Manager",
      director: "Director"
    },
    dashboard: {
      operatorTitle: "Operator Dashboard",
      tlTitle: "Team Leader Dashboard",
      qaTitle: "QA Manager Dashboard",
      smTitle: "Section Manager Dashboard",
      dirTitle: "Director Dashboard"
    },
    kpi: {
      todayOutput: "Today's Output",
      achievementRate: "Achievement Rate",
      groupOutput: "Group Output",
      groupDefectRate: "Group Defect Rate",
      pendingApprovals: "Pending Approvals",
      submissionRate: "Submission Rate",
      factoryDefectRate: "Factory Defect Rate",
      fpy: "First Pass Yield (FPY)",
      openAlerts: "Open Alerts",
      deptOutput: "Dept. Output",
      defectRate: "Defect Rate",
      oee: "Overall Equipment Effectiveness (OEE)",
      totalOutput: "Total Output",
      defectPPM: "Defect PPM",
      onTimeDelivery: "On-Time Delivery"
    },
    report: {
      date: "Date",
      shift: "Shift",
      dayShift: "Day Shift",
      nightShift: "Night Shift",
      machine: "Machine",
      operator: "Operator",
      productionResults: "Production Results",
      addLine: "Add Line",
      plannedQty: "Planned Qty",
      actualQty: "Actual Qty",
      workHours: "Work Hours",
      machineHours: "Machine Run Time",
      laborHours: "Labor Hours",
      shiftTotal: "Shift Total",
      shiftRemaining: "Remaining",
      defectCount: "Defect Count",
      defectRate: "Defect Rate",
      achievementRate: "Achievement Rate",
      addDefect: "Add Defect",
      defectDetail: "Defect Details",
      type: "Type",
      severity: "Severity",
      minor: "Minor",
      major: "Major",
      critical: "Critical",
      count: "Count",
      description: "Description",
      cause: "Cause",
      solution: "Solution",
      enterLater: "Enter Later",
      operatorNote: "Operator Notes",
      cancel: "Cancel",
      saveDraft: "Save Draft",
      submit: "Submit",
      product: "Product",
      productCode: "Product Code",
      lot: "Lot"
    },
    reportList: {
      id: "Report ID",
      date: "Date",
      operator: "Operator",
      machine: "Machine",
      output: "Output",
      defects: "Defects",
      status: "Status",
      action: "Action",
      detail: "Detail",
      all: "All",
      noReports: "No reports found",
      startDate: "Start Date",
      endDate: "End Date"
    },
    reportDetail: {
      reportId: "Report ID",
      workflowProgress: "Workflow Progress",
      close: "Close",
      approve: "Approve",
      reject: "Reject",
      rejectReason: "Rejection Reason",
      rejectConfirm: "Confirm",
      commentHistory: "Comment History",
      noComments: "No comments",
      enterComment: "Enter comment"
    },
    status: {
      draft: "Draft",
      saved: "Saved",
      submitted: "Submitted",
      tlReviewing: "TL Reviewing",
      tlApproved: "TL Approved",
      smReviewing: "SM Reviewing",
      smApproved: "SM Approved",
      qaReviewing: "QA Reviewing",
      qaApproved: "QA Approved",
      dirReviewing: "Director Reviewing",
      dirApproved: "Director Approved",
      rejected: "Rejected"
    },
    quality: {
      titleAnalysis: "Quality Analysis",
      defectTrend: "Defect Trend",
      oeeAnalysis: "OEE Analysis",
      categoryAnalysis: "Category Analysis"
    },
    common: {
      units: "pcs",
      hours: "h",
      percent: "%",
      logout: "Logout"
    }
  }
};

// ==================== MOCK DATA ====================

const USERS = [
  { id: 1, name: '中村美咲', role: 'operator', department: '製造部 Line A', line: 'Line A', avatar: '👩‍🔧' },
  { id: 2, name: '加藤健一', role: 'operator', department: '製造部 Line B', line: 'Line B', avatar: '👨‍🔧' },
  { id: 3, name: '伊藤直樹', role: 'team_leader', department: '製造部 Line A', line: 'Line A', avatar: '👨‍💼' },
  { id: 4, name: '鈴木花子', role: 'qa_manager', department: '品質管理部', line: null, avatar: '👩‍💻' },
  { id: 5, name: '田中太郎', role: 'section_manager', department: '製造部', line: null, avatar: '👨‍💼' },
  { id: 6, name: '山本誠一', role: 'director', department: '工場管理', line: null, avatar: '👔' },
];

const PRODUCTION_PLANS = [
  { id: 'PP-2026-0401', lot: 'LOT-A-0342', product: 'アルミフレーム A-100', productCode: 'PRD-001', plannedQty: 100, machine: 'CNC-T-015', line: 'Line A' },
  { id: 'PP-2026-0402', lot: 'LOT-A-0342', product: 'ステンレスパイプ SP-50', productCode: 'PRD-002', plannedQty: 200, machine: 'CNC-M-008', line: 'Line A' },
  { id: 'PP-2026-0403', lot: 'LOT-B-0198', product: 'チタンシャフト TS-30', productCode: 'PRD-003', plannedQty: 50, machine: 'CNC-T-022', line: 'Line B' },
  { id: 'PP-2026-0404', lot: 'LOT-B-0198', product: '真鍮コネクタ BC-12', productCode: 'PRD-004', plannedQty: 300, machine: 'CNC-M-011', line: 'Line B' },
  { id: 'PP-2026-0405', lot: 'LOT-A-0343', product: 'アルミブラケット AB-200', productCode: 'PRD-005', plannedQty: 150, machine: 'CNC-M-003', line: 'Line A' },
];

const DEFECT_TYPES = [
  { code: 'D01', label: '寸法不良', en: 'Dimensional error' },
  { code: 'D02', label: '面粗度不良', en: 'Surface roughness' },
  { code: 'D03', label: 'バリ発生', en: 'Burr formation' },
  { code: 'D04', label: 'チャタリング', en: 'Chatter marks' },
  { code: 'D05', label: '割れ・欠け', en: 'Crack/chip' },
  { code: 'D06', label: 'キズ', en: 'Scratch' },
  { code: 'D07', label: '変形・歪み', en: 'Deformation' },
  { code: 'D08', label: '穴位置ズレ', en: 'Hole position error' },
  { code: 'D09', label: 'ネジ不良', en: 'Thread defect' },
  { code: 'D10', label: '刃物摩耗痕', en: 'Tool wear mark' },
  { code: 'D11', label: '材料不良', en: 'Material defect' },
  { code: 'D12', label: 'プログラムミス', en: 'Program error' },
  { code: 'D99', label: 'その他', en: 'Other' },
];

const CAUSE_CATEGORIES = [
  { group: '人 (Man)', groupEn: 'Man', items: [
    { code: 'M1-01', label: '操作ミス', en: 'Operation error' },
    { code: 'M1-02', label: '確認不足', en: 'Insufficient verification' },
    { code: 'M1-03', label: '経験不足', en: 'Lack of experience' },
    { code: 'M1-04', label: '教育不足', en: 'Insufficient training' },
  ]},
  { group: '機械 (Machine)', groupEn: 'Machine', items: [
    { code: 'M2-01', label: '設備故障', en: 'Equipment failure' },
    { code: 'M2-02', label: '刃物摩耗', en: 'Tool wear' },
    { code: 'M2-03', label: '精度低下', en: 'Accuracy degradation' },
    { code: 'M2-04', label: 'メンテナンス不足', en: 'Insufficient maintenance' },
  ]},
  { group: '材料 (Material)', groupEn: 'Material', items: [
    { code: 'M3-01', label: '材料不良', en: 'Material defect' },
    { code: 'M3-02', label: '材料間違い', en: 'Wrong material' },
    { code: 'M3-03', label: '保管不良', en: 'Poor storage' },
    { code: 'M3-04', label: 'ロット差異', en: 'Lot variation' },
  ]},
  { group: '方法 (Method)', groupEn: 'Method', items: [
    { code: 'M4-01', label: '加工条件不適', en: 'Improper machining conditions' },
    { code: 'M4-02', label: 'プログラム誤り', en: 'Program error' },
    { code: 'M4-03', label: '手順書不備', en: 'Incomplete procedure' },
    { code: 'M4-04', label: '治具不良', en: 'Jig defect' },
  ]},
];

const SOLUTIONS = [
  { code: 'A01', label: '再加工', en: 'Rework', type: 'immediate' },
  { code: 'A02', label: '刃物交換', en: 'Tool replacement', type: 'immediate' },
  { code: 'A03', label: '設備調整', en: 'Equipment adjustment', type: 'immediate' },
  { code: 'A04', label: '加工条件変更', en: 'Change machining conditions', type: 'immediate' },
  { code: 'A05', label: '材料交換', en: 'Material replacement', type: 'immediate' },
  { code: 'A06', label: '再教育実施', en: 'Retraining', type: 'preventive' },
  { code: 'A07', label: '手順書改訂', en: 'Procedure revision', type: 'preventive' },
  { code: 'A08', label: '設備修理依頼', en: 'Equipment repair request', type: 'preventive' },
  { code: 'A09', label: '治具改善', en: 'Jig improvement', type: 'preventive' },
  { code: 'A10', label: 'ポカヨケ導入', en: 'Poka-yoke implementation', type: 'preventive' },
  { code: 'A11', label: '定期点検追加', en: 'Add periodic inspection', type: 'preventive' },
  { code: 'A12', label: '廃棄処分', en: 'Disposal', type: 'disposal' },
  { code: 'A99', label: 'その他', en: 'Other', type: 'other' },
];

const INITIAL_REPORTS = [
  {
    id: 'RPT-20260404-001',
    date: '2026-04-04',
    shift: 'day',
    operatorId: 1,
    machine: 'CNC-T-015',
    status: 'SUBMITTED',
    items: [
      { planId: 'PP-2026-0401', actualQty: 95, workHours: 7.5, laborHours: 7.5, machineHours: 7.5, defectCount: 3,
        defects: [
          { type: 'D01', severity: 'minor', count: 2, description: '外径寸法 +0.03mm', cause: 'M2-02', solution: 'A02' },
          { type: 'D03', severity: 'minor', count: 1, description: 'バリ残り', cause: '', solution: '' }
        ]
      }
    ],
    operatorNote: '刃物摩耗のため途中で交換、15分停止',
    comments: [],
    history: [
      { action: 'created', by: '中村美咲', at: '2026-04-04 17:30', note: '' },
      { action: 'submitted', by: '中村美咲', at: '2026-04-04 17:45', note: '' }
    ]
  },
  {
    id: 'RPT-20260404-002',
    date: '2026-04-04',
    shift: 'day',
    operatorId: 2,
    machine: 'CNC-T-022',
    status: 'TL_APPROVED',
    items: [
      { planId: 'PP-2026-0403', actualQty: 48, workHours: 7.0, laborHours: 7.0, machineHours: 7.0, defectCount: 1,
        defects: [
          { type: 'D02', severity: 'minor', count: 1, description: '面粗度 Ra1.8(規格Ra1.6)', cause: 'M4-01', solution: 'A04' }
        ]
      }
    ],
    operatorNote: '',
    comments: [
      { by: '伊藤直樹', role: 'team_leader', at: '2026-04-04 18:15', text: '加工条件の見直しが必要。次回から送り速度を調整してください。' }
    ],
    history: [
      { action: 'created', by: '加藤健一', at: '2026-04-04 17:15', note: '' },
      { action: 'submitted', by: '加藤健一', at: '2026-04-04 17:20', note: '' },
      { action: 'tl_approved', by: '伊藤直樹', at: '2026-04-04 18:15', note: '加工条件の見直しが必要' }
    ]
  },
  {
    id: 'RPT-20260403-001',
    date: '2026-04-03',
    shift: 'day',
    operatorId: 1,
    machine: 'CNC-T-015',
    status: 'QA_APPROVED',
    items: [
      { planId: 'PP-2026-0401', actualQty: 98, workHours: 7.5, laborHours: 7.5, machineHours: 7.5, defectCount: 0, defects: [] }
    ],
    operatorNote: '',
    comments: [],
    history: [
      { action: 'created', by: '中村美咲', at: '2026-04-03 17:30', note: '' },
      { action: 'submitted', by: '中村美咲', at: '2026-04-03 17:35', note: '' },
      { action: 'tl_approved', by: '伊藤直樹', at: '2026-04-03 18:00', note: '' },
      { action: 'qa_approved', by: '鈴木花子', at: '2026-04-04 09:30', note: '' }
    ]
  },
  {
    id: 'RPT-20260403-002',
    date: '2026-04-03',
    shift: 'day',
    operatorId: 2,
    machine: 'CNC-M-011',
    status: 'REJECTED',
    items: [
      { planId: 'PP-2026-0404', actualQty: 280, workHours: 7.5, laborHours: 7.5, machineHours: 7.5, defectCount: 8,
        defects: [
          { type: 'D05', severity: 'major', count: 5, description: 'コネクタ先端に割れ', cause: '', solution: '' },
          { type: 'D01', severity: 'minor', count: 3, description: '内径 -0.02mm', cause: '', solution: '' }
        ]
      }
    ],
    operatorNote: '材料ロットが変わった影響かもしれません',
    comments: [
      { by: '伊藤直樹', role: 'team_leader', at: '2026-04-03 18:30', text: '不良数が多いです。原因と対策を詳しく記入してください。割れの原因は材料か加工条件か確認が必要です。' }
    ],
    history: [
      { action: 'created', by: '加藤健一', at: '2026-04-03 17:00', note: '' },
      { action: 'submitted', by: '加藤健一', at: '2026-04-03 17:10', note: '' },
      { action: 'rejected', by: '伊藤直樹', at: '2026-04-03 18:30', note: '原因・対策の記入不足' }
    ]
  }
];

// ==================== UTILITY FUNCTIONS ====================

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getStatusColor = (status) => {
  const colors = {
    'DRAFT': 'bg-gray-100 text-gray-600',
    'SAVED': 'bg-blue-50 text-blue-600',
    'SUBMITTED': 'bg-blue-100 text-blue-700',
    'TL_REVIEWING': 'bg-yellow-100 text-yellow-700',
    'TL_APPROVED': 'bg-green-100 text-green-700',
    'SM_REVIEWING': 'bg-orange-100 text-orange-700',
    'SM_APPROVED': 'bg-green-100 text-green-800',
    'QA_REVIEWING': 'bg-purple-100 text-purple-700',
    'QA_APPROVED': 'bg-green-200 text-green-800',
    'DIR_REVIEWING': 'bg-red-100 text-red-700',
    'DIR_APPROVED': 'bg-green-200 text-green-900',
    'REJECTED': 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};

// ==================== MAIN APP COMPONENT ====================

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [newReportForm, setNewReportForm] = useState(null);
  const [notifications, setNotifications] = useState(2);
  const [lang, setLang] = useState('ja');

  const t = (key) => {
    const keys = key.split('.');
    let value = i18n[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // ==================== HANDLERS ====================

  const handleLogin = (userId) => {
    const user = USERS.find(u => u.id === userId);
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setSelectedReport(null);
    setEditingReport(null);
    setNewReportForm(null);
  };

  const handleCreateNewReport = () => {
    const today = new Date().toISOString().split('T')[0];
    const operatorLine = currentUser?.line;
    const plansForLine = PRODUCTION_PLANS.filter(p => p.line === operatorLine);

    const totalPlannedQty = plansForLine.reduce((sum, p) => sum + p.plannedQty, 0);
    const shiftHours = 7.5;

    const items = plansForLine.map(plan => {
      const ratio = totalPlannedQty > 0 ? plan.plannedQty / totalPlannedQty : 1;
      const laborHours = Math.round(shiftHours * ratio * 10) / 10;
      return {
        planId: plan.id,
        plannedQty: plan.plannedQty,
        actualQty: plan.plannedQty,
        machineHours: laborHours,
        laborHours: laborHours,
        defectCount: 0,
        defects: [],
        modified: false
      };
    });

    setNewReportForm({
      date: today,
      shift: 'day',
      machine: currentUser?.line === 'Line A' ? 'CNC-T-015' : 'CNC-T-022',
      items: items,
      operatorNote: '',
    });
    setCurrentPage('create_report');
  };

  const handleRemoveLineItem = (index) => {
    setNewReportForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateLineItem = (index, updates) => {
    setNewReportForm(prev => {
      const newItems = [...prev.items];
      const merged = { ...newItems[index], ...updates };
      const plan = PRODUCTION_PLANS.find(p => p.id === merged.planId);
      const totalPlannedQty = prev.items.reduce((sum, i) => {
        const pp = PRODUCTION_PLANS.find(p2 => p2.id === i.planId);
        return sum + (pp?.plannedQty || 0);
      }, 0);
      const defaultLaborHrs = plan && totalPlannedQty > 0
        ? Math.round((7.5 * plan.plannedQty / totalPlannedQty) * 10) / 10
        : 7.5;
      const isModified = merged.actualQty !== plan?.plannedQty ||
        merged.laborHours !== defaultLaborHrs ||
        merged.defects.length > 0;
      newItems[index] = { ...merged, modified: isModified };
      return { ...prev, items: newItems };
    });
  };

  const handleAddDefect = (itemIndex) => {
    setNewReportForm(prev => {
      if (!prev) return prev;
      const newItems = prev.items.map((item, i) => {
        if (i !== itemIndex) return item;
        return {
          ...item,
          defects: [...item.defects, {
            type: '', severity: 'minor', count: 1, description: '', cause: '', solution: ''
          }]
        };
      });
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveDefect = (itemIndex, defectIndex) => {
    setNewReportForm(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex].defects = newItems[itemIndex].defects.filter((_, i) => i !== defectIndex);
      newItems[itemIndex].defectCount = newItems[itemIndex].defects.reduce((sum, d) => sum + (d.count || 0), 0);
      return { ...prev, items: newItems };
    });
  };

  const handleUpdateDefect = (itemIndex, defectIndex, updates) => {
    setNewReportForm(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex].defects[defectIndex] = { ...newItems[itemIndex].defects[defectIndex], ...updates };
      newItems[itemIndex].defectCount = newItems[itemIndex].defects.reduce((sum, d) => sum + (d.count || 0), 0);
      return { ...prev, items: newItems };
    });
  };

  const handleSaveDraft = () => {
    const newReport = {
      id: `RPT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(reports.length + 1).padStart(3, '0')}`,
      ...newReportForm,
      operatorId: currentUser.id,
      status: 'DRAFT',
      comments: [],
      history: [{ action: 'created', by: currentUser.name, at: new Date().toLocaleString('ja-JP'), note: '' }]
    };
    setReports([newReport, ...reports]);
    setNewReportForm(null);
    setCurrentPage('dashboard');
  };

  const handleSubmitReport = () => {
    const newReport = {
      id: `RPT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(reports.length + 1).padStart(3, '0')}`,
      ...newReportForm,
      operatorId: currentUser.id,
      status: 'SUBMITTED',
      comments: [],
      history: [
        { action: 'created', by: currentUser.name, at: new Date().toLocaleString('ja-JP'), note: '' },
        { action: 'submitted', by: currentUser.name, at: new Date().toLocaleString('ja-JP'), note: '' }
      ]
    };
    setReports([newReport, ...reports]);
    setNewReportForm(null);
    setCurrentPage('dashboard');
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setCurrentPage('report_detail');
  };

  const handleApproveReport = (note) => {
    const newStatus = currentUser.role === 'team_leader' ? 'TL_APPROVED' :
                      currentUser.role === 'section_manager' ? 'SM_APPROVED' :
                      currentUser.role === 'qa_manager' ? 'QA_APPROVED' :
                      currentUser.role === 'director' ? 'DIR_APPROVED' : 'SUBMITTED';

    setReports(prev => prev.map(r => r.id === selectedReport.id ? {
      ...r,
      status: newStatus,
      history: [...r.history, { action: newStatus.toLowerCase(), by: currentUser.name, at: new Date().toLocaleString('ja-JP'), note }]
    } : r));
    setSelectedReport(null);
    setCurrentPage('dashboard');
  };

  const handleRejectReport = (reason) => {
    setReports(prev => prev.map(r => r.id === selectedReport.id ? {
      ...r,
      status: 'REJECTED',
      history: [...r.history, { action: 'rejected', by: currentUser.name, at: new Date().toLocaleString('ja-JP'), note: reason }]
    } : r));
    setSelectedReport(null);
    setCurrentPage('dashboard');
  };

  // ==================== RENDER LOGIN PAGE ====================

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-2">{t('app.title')}</h1>
            <p className="text-xl text-blue-100">{t('app.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USERS.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all text-center"
              >
                <div className="text-8xl mb-4">{user.avatar}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{t(`roles.${user.role}`)}</p>
                <p className="text-sm text-gray-500">{user.department}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setLang('ja')}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors ${
                lang === 'ja'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              🇯🇵 日本語
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors ${
                lang === 'en'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== NAVBAR ====================

  const NavItem = ({ icon: Icon, label, page, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 text-base font-semibold rounded-lg transition-colors w-full ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={24} />
      {label}
    </button>
  );

  // ==================== RENDER MAIN APP ====================

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-3 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarOpen && (
            <>
              <NavItem
                icon={Home}
                label={t('nav.dashboard')}
                page="dashboard"
                onClick={() => { setCurrentPage('dashboard'); setSelectedReport(null); setNewReportForm(null); }}
              />
              <NavItem
                icon={Plus}
                label={t('nav.createReport')}
                page="create_report"
                onClick={handleCreateNewReport}
              />
              <NavItem
                icon={List}
                label={t('nav.reportList')}
                page="report_list"
                onClick={() => setCurrentPage('report_list')}
              />
              {(currentUser.role === 'team_leader' || currentUser.role === 'section_manager' ||
                currentUser.role === 'qa_manager' || currentUser.role === 'director') && (
                <NavItem
                  icon={Clock}
                  label={t('nav.pendingApprovals')}
                  page="pending_approvals"
                  onClick={() => setCurrentPage('pending_approvals')}
                />
              )}
              {(currentUser.role === 'qa_manager' || currentUser.role === 'section_manager' || currentUser.role === 'director') && (
                <NavItem
                  icon={TrendingUp}
                  label={t('nav.qualityAnalysis')}
                  page="quality_analysis"
                  onClick={() => setCurrentPage('quality_analysis')}
                />
              )}
            </>
          )}
        </nav>

        <div className="p-4 border-t space-y-2">
          {sidebarOpen && (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setLang('ja')}
                  className={`flex-1 py-2 px-2 text-sm font-semibold rounded ${
                    lang === 'ja' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`flex-1 py-2 px-2 text-sm font-semibold rounded ${
                    lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={24} />
                {t('common.logout')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-8">
          <h2 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h2>
          <div className="flex items-center gap-4">
            <Bell size={28} className="cursor-pointer text-gray-600 hover:text-blue-600" />
            <span className="text-sm font-semibold text-gray-600">{notifications}</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardPage t={t} user={currentUser} reports={reports} />}
          {currentPage === 'create_report' && newReportForm && (
            <CreateReportPage
              t={t}
              user={currentUser}
              form={newReportForm}
              onUpdateLineItem={handleUpdateLineItem}
              onRemoveLineItem={handleRemoveLineItem}
              onAddDefect={handleAddDefect}
              onRemoveDefect={handleRemoveDefect}
              onUpdateDefect={handleUpdateDefect}
              onUpdateForm={(updates) => setNewReportForm({...newReportForm, ...updates})}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmitReport}
              onCancel={() => { setNewReportForm(null); setCurrentPage('dashboard'); }}
            />
          )}
          {currentPage === 'report_list' && (
            <ReportListPage
              t={t}
              reports={reports.filter(r => r.operatorId === currentUser.id || currentUser.role !== 'operator')}
              onSelectReport={handleSelectReport}
            />
          )}
          {currentPage === 'report_detail' && selectedReport && (
            <ReportDetailPage
              t={t}
              report={selectedReport}
              user={currentUser}
              onApprove={handleApproveReport}
              onReject={handleRejectReport}
              onClose={() => { setSelectedReport(null); setCurrentPage('dashboard'); }}
            />
          )}
          {currentPage === 'pending_approvals' && (
            <PendingApprovalsPage
              t={t}
              reports={reports.filter(r => {
                if (currentUser.role === 'team_leader') return r.status === 'SUBMITTED';
                if (currentUser.role === 'section_manager') return ['TL_APPROVED'].includes(r.status);
                if (currentUser.role === 'qa_manager') return ['SM_APPROVED'].includes(r.status);
                if (currentUser.role === 'director') return ['QA_APPROVED'].includes(r.status);
                return false;
              })}
              onSelectReport={handleSelectReport}
            />
          )}
          {currentPage === 'quality_analysis' && (
            <QualityAnalysisPage t={t} reports={reports} />
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================

function DashboardPage({ t, user, reports }) {
  const userReports = reports.filter(r => r.operatorId === user.id);
  const todayOutput = userReports.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.actualQty, 0), 0);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        {user.role === 'operator' && t('dashboard.operatorTitle')}
        {user.role === 'team_leader' && t('dashboard.tlTitle')}
        {user.role === 'qa_manager' && t('dashboard.qaTitle')}
        {user.role === 'section_manager' && t('dashboard.smTitle')}
        {user.role === 'director' && t('dashboard.dirTitle')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title={t('kpi.todayOutput')}
          value={todayOutput}
          unit={t('common.units')}
          color="blue"
        />
        <KPICard
          title={t('kpi.achievementRate')}
          value={Math.round((todayOutput / 300) * 100)}
          unit={t('common.percent')}
          color="green"
        />
        <KPICard
          title={t('kpi.pendingApprovals')}
          value={reports.filter(r => r.status === 'SUBMITTED').length}
          unit=""
          color="orange"
        />
        <KPICard
          title={t('kpi.factoryDefectRate')}
          value={(Math.random() * 5).toFixed(2)}
          unit={t('common.percent')}
          color="red"
        />
      </div>

      {user.role !== 'operator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('quality.defectTrend')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateQualityTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="defects" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('quality.oeeAnalysis')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={generateOEEData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="oee" fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== KPI CARD ====================

function KPICard({ title, value, unit, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200',
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  return (
    <div className={`${colors[color]} border-2 rounded-lg p-8`}>
      <p className="text-lg text-gray-600 mb-3">{title}</p>
      <p className={`text-5xl font-bold ${textColors[color]} mb-2`}>{value}</p>
      <p className="text-base text-gray-500">{unit}</p>
    </div>
  );
}

// ==================== CREATE REPORT PAGE ====================

function CreateReportPage({
  t, user, form, onUpdateLineItem, onRemoveLineItem,
  onAddDefect, onRemoveDefect, onUpdateDefect, onUpdateForm,
  onSaveDraft, onSubmit, onCancel
}) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('nav.createReport')}</h2>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">{t('report.date')}</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => onUpdateForm({ date: e.target.value })}
              className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">{t('report.shift')}</label>
            <select
              value={form.shift}
              onChange={(e) => onUpdateForm({ shift: e.target.value })}
              className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="day">{t('report.dayShift')}</option>
              <option value="night">{t('report.nightShift')}</option>
            </select>
          </div>
        </div>

        {/* Shift Total Summary Bar */}
        {form.items.length > 0 && (() => {
          const totalLabor = form.items.reduce((sum, i) => sum + (i.laborHours || 0), 0);
          const shiftHours = 7.5;
          const usedPct = Math.min(100, Math.round((totalLabor / shiftHours) * 100));
          const isOver = totalLabor > shiftHours;
          return (
            <div className="mb-8 bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-800">{t('report.shiftTotal')}: {shiftHours}h</span>
                <span className={`text-lg font-bold ${isOver ? 'text-red-600' : 'text-green-700'}`}>
                  {t('report.laborHours')}: {totalLabor.toFixed(1)}h
                  {isOver && ' ⚠️'}
                </span>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : usedPct > 90 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, usedPct)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>0h</span>
                <span>{usedPct}%</span>
                <span>{shiftHours}h</span>
              </div>
            </div>
          );
        })()}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('report.productionResults')}</h3>
          {form.items.length === 0 ? (
            <p className="text-lg text-gray-500">{t('reportList.noReports')}</p>
          ) : (
            <div className="space-y-8">
              {form.items.map((item, idx) => {
                const plan = PRODUCTION_PLANS.find(p => p.id === item.planId);
                const achievementPct = item.plannedQty > 0 ? Math.round((item.actualQty / item.plannedQty) * 100) : 0;
                return (
                  <div key={idx} className={`bg-gray-50 rounded-xl p-6 border-2 ${item.modified ? 'border-orange-400' : 'border-gray-200'}`}>
                    {/* Product Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{plan?.product}</p>
                        <p className="text-base text-gray-500">{plan?.productCode} | {plan?.machine}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.modified && (
                          <span className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                            ✏️ {t('report.achievementRate')}: {achievementPct}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 1: Planned Qty + Actual Qty (side by side, large) */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-base font-semibold text-gray-600 mb-3">{t('report.plannedQty')}</label>
                        <div className="h-16 px-6 flex items-center text-xl font-bold border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700">
                          {item.plannedQty} {t('common.units')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-600 mb-3">{t('report.actualQty')}</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onUpdateLineItem(idx, { actualQty: Math.max(0, item.actualQty - 5) })}
                            className="h-16 w-16 bg-red-500 text-white rounded-xl hover:bg-red-600 active:bg-red-700 flex items-center justify-center text-3xl font-bold shrink-0 shadow-md"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => onUpdateLineItem(idx, { actualQty: Math.max(0, item.actualQty - 1) })}
                            className="h-16 w-12 bg-red-400 text-white rounded-xl hover:bg-red-500 active:bg-red-600 flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.actualQty}
                            onChange={(e) => onUpdateLineItem(idx, { actualQty: parseInt(e.target.value) || 0 })}
                            className="flex-1 h-16 px-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 text-center min-w-0"
                          />
                          <button
                            onClick={() => onUpdateLineItem(idx, { actualQty: item.actualQty + 1 })}
                            className="h-16 w-12 bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onUpdateLineItem(idx, { actualQty: item.actualQty + 5 })}
                            className="h-16 w-16 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 flex items-center justify-center text-3xl font-bold shrink-0 shadow-md"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Labor Hours + Machine Hours + Defect Count */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-base font-semibold text-gray-600 mb-3">{t('report.laborHours')} (h)</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateLineItem(idx, { laborHours: Math.max(0, Math.round(((item.laborHours || 0) - 0.5) * 10) / 10) })}
                            className="h-14 w-14 bg-red-400 text-white rounded-xl hover:bg-red-500 active:bg-red-600 flex items-center justify-center text-xl font-bold shrink-0"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            step="0.5"
                            value={item.laborHours || 0}
                            onChange={(e) => onUpdateLineItem(idx, { laborHours: parseFloat(e.target.value) || 0 })}
                            className="flex-1 h-14 px-3 text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 text-center min-w-0"
                          />
                          <button
                            onClick={() => onUpdateLineItem(idx, { laborHours: Math.round(((item.laborHours || 0) + 0.5) * 10) / 10 })}
                            className="h-14 w-14 bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 flex items-center justify-center text-xl font-bold shrink-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-600 mb-3">{t('report.machineHours')} (h)</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateLineItem(idx, { machineHours: Math.max(0, Math.round(((item.machineHours || 0) - 0.5) * 10) / 10) })}
                            className="h-14 w-14 bg-red-400 text-white rounded-xl hover:bg-red-500 active:bg-red-600 flex items-center justify-center text-xl font-bold shrink-0"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            step="0.5"
                            value={item.machineHours || 0}
                            onChange={(e) => onUpdateLineItem(idx, { machineHours: parseFloat(e.target.value) || 0 })}
                            className="flex-1 h-14 px-3 text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 text-center min-w-0"
                          />
                          <button
                            onClick={() => onUpdateLineItem(idx, { machineHours: Math.round(((item.machineHours || 0) + 0.5) * 10) / 10 })}
                            className="h-14 w-14 bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 flex items-center justify-center text-xl font-bold shrink-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-600 mb-3">{t('report.defectCount')}</label>
                        <div className="h-14 px-4 flex items-center justify-center text-xl font-bold border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700">
                          {item.defects.reduce((sum, d) => sum + (d.count || 0), 0)}
                        </div>
                      </div>
                    </div>

                    {/* Defects Section */}
                    {item.defects.length > 0 && (
                      <div className="mb-6 bg-white rounded-xl p-6 border-2 border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4">{t('report.defectDetail')} ({item.defects.length})</h4>
                        <div className="space-y-4">
                          {item.defects.map((defect, didx) => (
                            <div key={didx} className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-base font-bold text-gray-700">#{didx + 1}</span>
                                <button
                                  onClick={() => onRemoveDefect(idx, didx)}
                                  className="h-12 w-12 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg flex items-center justify-center"
                                >
                                  <X size={24} />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.type')}</label>
                                  <select
                                    value={defect.type}
                                    onChange={(e) => onUpdateDefect(idx, didx, { type: e.target.value })}
                                    className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                                  >
                                    <option value="">---</option>
                                    {DEFECT_TYPES.map(dt => (
                                      <option key={dt.code} value={dt.code}>{dt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.severity')}</label>
                                  <div className="flex gap-2">
                                    {[
                                      { val: 'minor', label: t('report.minor'), color: 'bg-yellow-100 border-yellow-400 text-yellow-800', activeColor: 'bg-yellow-400 border-yellow-600 text-white' },
                                      { val: 'major', label: t('report.major'), color: 'bg-orange-100 border-orange-400 text-orange-800', activeColor: 'bg-orange-500 border-orange-700 text-white' },
                                      { val: 'critical', label: t('report.critical'), color: 'bg-red-100 border-red-400 text-red-800', activeColor: 'bg-red-600 border-red-800 text-white' },
                                    ].map(sev => (
                                      <button
                                        key={sev.val}
                                        onClick={() => onUpdateDefect(idx, didx, { severity: sev.val })}
                                        className={`flex-1 h-14 rounded-xl border-2 text-base font-bold transition-colors ${defect.severity === sev.val ? sev.activeColor : sev.color}`}
                                      >
                                        {sev.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.count')}</label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => onUpdateDefect(idx, didx, { count: Math.max(1, (defect.count || 1) - 1) })}
                                      className="h-14 w-14 bg-red-400 text-white rounded-xl hover:bg-red-500 flex items-center justify-center text-xl font-bold shrink-0"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={defect.count}
                                      onChange={(e) => onUpdateDefect(idx, didx, { count: parseInt(e.target.value) || 1 })}
                                      className="flex-1 h-14 px-3 text-xl font-bold border-2 border-gray-300 rounded-xl text-center min-w-0"
                                    />
                                    <button
                                      onClick={() => onUpdateDefect(idx, didx, { count: (defect.count || 1) + 1 })}
                                      className="h-14 w-14 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center text-xl font-bold shrink-0"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.description')}</label>
                                  <input
                                    type="text"
                                    value={defect.description}
                                    onChange={(e) => onUpdateDefect(idx, didx, { description: e.target.value })}
                                    className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.cause')}</label>
                                  <select
                                    value={defect.cause}
                                    onChange={(e) => onUpdateDefect(idx, didx, { cause: e.target.value })}
                                    className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                                  >
                                    <option value="">{t('report.enterLater')}</option>
                                    {CAUSE_CATEGORIES.map((cat, cidx) => (
                                      <optgroup key={cidx} label={cat.group}>
                                        {cat.items.map(ci => (
                                          <option key={ci.code} value={ci.code}>{ci.label}</option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('report.solution')}</label>
                                  <select
                                    value={defect.solution}
                                    onChange={(e) => onUpdateDefect(idx, didx, { solution: e.target.value })}
                                    className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                                  >
                                    <option value="">{t('report.enterLater')}</option>
                                    {SOLUTIONS.map(sol => (
                                      <option key={sol.code} value={sol.code}>{sol.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => onAddDefect(idx)}
                      className="w-full h-16 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600 active:bg-orange-700 transition-colors flex items-center justify-center gap-3 shadow-md"
                    >
                      <AlertCircle size={28} />
                      {t('report.addDefect')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-base font-semibold text-gray-700 mb-3">{t('report.operatorNote')}</label>
          <textarea
            value={form.operatorNote}
            onChange={(e) => onUpdateForm({ operatorNote: e.target.value })}
            className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-24"
            placeholder={t('report.operatorNote')}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 h-14 bg-gray-600 text-white text-base font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('report.cancel')}
          </button>
          <button
            onClick={onSaveDraft}
            className="flex-1 h-14 bg-yellow-600 text-white text-base font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('report.saveDraft')}
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 h-14 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('report.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== REPORT LIST PAGE ====================

function ReportListPage({ t, reports, onSelectReport }) {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('nav.reportList')}</h2>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-2xl text-gray-500">{t('reportList.noReports')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-left">{t('reportList.id')}</th>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-left">{t('reportList.date')}</th>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-left">{t('reportList.operator')}</th>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-left">{t('reportList.output')}</th>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-left">{t('reportList.status')}</th>
                <th className="px-6 py-4 text-base font-bold text-gray-700 text-center">{t('reportList.action')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => {
                const operator = USERS.find(u => u.id === report.operatorId);
                const output = report.items.reduce((sum, item) => sum + item.actualQty, 0);
                return (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-base text-gray-800 font-semibold">{report.id}</td>
                    <td className="px-6 py-4 text-base text-gray-700">{formatDate(report.date)}</td>
                    <td className="px-6 py-4 text-base text-gray-700">{operator?.name}</td>
                    <td className="px-6 py-4 text-base text-gray-700">{output}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onSelectReport(report)}
                        className="h-12 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('reportList.detail')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==================== REPORT DETAIL PAGE ====================

function ReportDetailPage({ t, report, user, onApprove, onReject, onClose }) {
  const [rejectReason, setRejectReason] = useState('');
  const operator = USERS.find(u => u.id === report.operatorId);
  const totalOutput = report.items.reduce((sum, item) => sum + item.actualQty, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">{t('reportDetail.reportId')}: {report.id}</h2>
        <button
          onClick={onClose}
          className="h-12 px-6 bg-gray-600 text-white text-base font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t('reportDetail.close')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">日付</p>
          <p className="text-2xl font-bold text-gray-800">{formatDate(report.date)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">オペレータ</p>
          <p className="text-2xl font-bold text-gray-800">{operator?.name}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">生産量</p>
          <p className="text-2xl font-bold text-gray-800">{totalOutput}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('report.productionResults')}</h3>
        {report.items.map((item, idx) => {
          const plan = PRODUCTION_PLANS.find(p => p.id === item.planId);
          return (
            <div key={idx} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
              <p className="text-xl font-bold text-gray-800 mb-2">{plan?.product}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                <div>
                  <p className="text-gray-600">計画数量</p>
                  <p className="font-semibold text-gray-800">{item.plannedQty}</p>
                </div>
                <div>
                  <p className="text-gray-600">実績数量</p>
                  <p className="font-semibold text-gray-800">{item.actualQty}</p>
                </div>
                <div>
                  <p className="text-gray-600">作業時間</p>
                  <p className="font-semibold text-gray-800">{item.workHours}h</p>
                </div>
                <div>
                  <p className="text-gray-600">不良数</p>
                  <p className="font-semibold text-gray-800">{item.defects.reduce((sum, d) => sum + (d.count || 0), 0)}</p>
                </div>
              </div>
              {item.defects.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-3">不良詳細</p>
                  {item.defects.map((d, didx) => (
                    <p key={didx} className="text-sm text-gray-700 mb-1">
                      • {DEFECT_TYPES.find(dt => dt.code === d.type)?.label} ({d.count}個): {d.description}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {report.operatorNote && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
          <p className="text-base font-semibold text-gray-700 mb-3">備考</p>
          <p className="text-base text-gray-800">{report.operatorNote}</p>
        </div>
      )}

      {(user.role === 'team_leader' || user.role === 'section_manager' ||
        user.role === 'qa_manager' || user.role === 'director') &&
       (report.status === 'SUBMITTED' || report.status === 'TL_APPROVED' ||
        report.status === 'SM_APPROVED' || report.status === 'QA_APPROVED') && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-700 mb-3">{t('reportDetail.rejectReason')}</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-20"
              placeholder="理由を入力"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onApprove('')}
              className="flex-1 h-14 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('reportDetail.approve')}
            </button>
            <button
              onClick={() => onReject(rejectReason)}
              className="flex-1 h-14 bg-red-600 text-white text-base font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('reportDetail.reject')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PENDING APPROVALS PAGE ====================

function PendingApprovalsPage({ t, reports, onSelectReport }) {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('nav.pendingApprovals')}</h2>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-2xl text-gray-500">承認待ちの報告書はありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map(report => {
            const operator = USERS.find(u => u.id === report.operatorId);
            const output = report.items.reduce((sum, item) => sum + item.actualQty, 0);
            return (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{report.id}</p>
                    <p className="text-base text-gray-600">{operator?.name} • {formatDate(report.date)}</p>
                  </div>
                  <button
                    onClick={() => onSelectReport(report)}
                    className="h-12 px-6 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    確認
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-base">
                  <div>
                    <p className="text-gray-600">生産量</p>
                    <p className="font-semibold text-gray-800">{output}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">不良数</p>
                    <p className="font-semibold text-gray-800">{report.items.reduce((sum, i) => sum + i.defectCount, 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ステータス</p>
                    <p className={`font-semibold px-3 py-1 rounded inline-block ${getStatusColor(report.status)}`}>
                      {report.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==================== QUALITY ANALYSIS PAGE ====================

function QualityAnalysisPage({ t, reports }) {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('nav.qualityAnalysis')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">不良トレンド</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateQualityTrendData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="defects" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">不良タイプ分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: '寸法不良', value: 35 },
                  { name: '面粗度', value: 25 },
                  { name: 'バリ', value: 20 },
                  { name: 'その他', value: 20 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER FUNCTIONS ====================

function generateOEEData() {
  return [
    { day: '日', oee: 88 },
    { day: '月', oee: 92 },
    { day: '火', oee: 85 },
    { day: '水', oee: 90 },
    { day: '木', oee: 87 },
    { day: '金', oee: 91 },
  ];
}

function generateQualityTrendData() {
  return [
    { day: '4/1', defects: 5, fpy: 98 },
    { day: '4/2', defects: 8, fpy: 95 },
    { day: '4/3', defects: 3, fpy: 99 },
    { day: '4/4', defects: 6, fpy: 96 },
  ];
}