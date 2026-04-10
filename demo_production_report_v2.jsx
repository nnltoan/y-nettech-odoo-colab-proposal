import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Menu, X, LogOut, Globe, Plus, Download, Edit2, Check, AlertCircle,
  TrendingUp, Users, Clock, AlertTriangle, ChevronDown, ChevronRight,
  Home, FileText, UserCheck, BarChart3, Settings, Lock, Unlock,
  Calendar, Filter, Search, Star, MessageCircle, Eye, MoreHorizontal,
  ArrowRight, ArrowUp, ArrowDown, Zap, Target, TrendingDown,
  CheckCircle, XCircle, Clock3, HelpCircle, PlusCircle, MinusCircle,
  SkipBack, ChevronLeft, ChevronRightIcon, Trash2, Save, Send,
  AlertOctagon, Info, Percent, Activity, Clock4, Briefcase, Wrench
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts';

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR & MOCK DATA
// ============================================================================
const createSeededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const generateMockReports = () => {
  const rand = createSeededRandom(54321);
  const reports = [];
  const users = generateMockUsers();
  const shifts = ['A', 'B', 'C'];
  const machines = ['CNC-001', 'CNC-002', 'CNC-003', 'CNC-004', 'CNC-005'];
  const productList = [
    { name: 'フランジ加工品', planQty: 120, jobNum: 'J2025-001' },
    { name: 'シャフト部品', planQty: 80, jobNum: 'J2025-002' },
    { name: 'ギアケース', planQty: 60, jobNum: 'J2025-003' },
    { name: 'ベアリングハウジング', planQty: 100, jobNum: 'J2025-004' },
    { name: 'バルブボディ', planQty: 150, jobNum: 'J2025-005' },
    { name: 'ポンプインペラ', planQty: 40, jobNum: 'J2025-006' },
    { name: 'クランクシャフト', planQty: 90, jobNum: 'J2025-007' },
    { name: 'シリンダーヘッド', planQty: 200, jobNum: 'J2025-008' },
  ];
  const defectCodes = ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12'];
  const isWeekday = (date) => { const d = date.getDay(); return d !== 0 && d !== 6; };

  let reportId = 1;
  const operators = users.filter(u => u.role === 'operator');
  // Mock 3 working days: April 1 (Wed), 2 (Thu), 3 (Fri) 2026
  const endDate = new Date('2026-04-03');

  for (let d = new Date('2026-04-01'); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (!isWeekday(d)) continue;

    for (const op of operators) {
      if (rand() < 0.05) continue; // ~95% attendance for just 3 days

      const product = productList[Math.floor(rand() * productList.length)];
      const planQty = product.planQty;
      const achievementRate = 0.88 + rand() * 0.22; // 88-110%
      const actualQty = Math.round(planQty * achievementRate);
      const achievement = Math.round((actualQty / planQty) * 100);

      // Defect generation: 60% zero, 25% 1-2, 10% 3-5, 5% 6+
      let defectCount = 0;
      const dr = rand();
      if (dr > 0.60) {
        if (dr < 0.85) defectCount = 1 + Math.floor(rand() * 2);
        else if (dr < 0.95) defectCount = 3 + Math.floor(rand() * 3);
        else defectCount = 6 + Math.floor(rand() * 5);
      }

      // Generate individual defects with severity: 70% Minor, 25% Major, 5% Critical
      const defects = [];
      let maxSeverity = 'minor';
      for (let i = 0; i < defectCount; i++) {
        const sr = rand();
        const severity = sr < 0.70 ? 'minor' : sr < 0.95 ? 'major' : 'critical';
        if (severity === 'critical') maxSeverity = 'critical';
        else if (severity === 'major' && maxSeverity !== 'critical') maxSeverity = 'major';
        defects.push({
          type: defectCodes[Math.floor(rand() * defectCodes.length)],
          severity,
          count: 1 + Math.floor(rand() * 3),
          description: '不具合の説明'
        });
      }
      const totalDefects = defects.reduce((s, d) => s + d.count, 0);
      const defectRate = actualQty > 0 ? ((totalDefects / actualQty) * 100) : 0;

      // SRS condition-based routing
      // Normal/Minor (no defect or rate<5% only minor) → TL→COMPLETED
      // Major (rate 5-10% or has Major severity) → TL→QA→COMPLETED
      // Critical (rate>10% or has Critical severity) → TL→SM→QA→DIR→COMPLETED
      let routeType = 'normal';
      if (maxSeverity === 'critical' || defectRate > 10) routeType = 'critical';
      else if (maxSeverity === 'major' || (defectRate >= 5 && defectRate <= 10)) routeType = 'major';

      // Status based on date and route type
      // Apr 1 = 2 days ago, Apr 2 = 1 day ago, Apr 3 = today
      const daysAgo = Math.floor((endDate - d) / (1000 * 60 * 60 * 24));
      let status;

      if (daysAgo === 0) {
        // Today (Apr 3): reports being created/submitted/reviewed now
        const r = rand();
        if (r < 0.10) status = 'DRAFT';
        else if (r < 0.30) status = 'SUBMITTED';
        else if (routeType === 'normal') status = r < 0.60 ? 'TL_REVIEWING' : 'COMPLETED';
        else if (routeType === 'major') status = r < 0.50 ? 'SUBMITTED' : r < 0.75 ? 'TL_REVIEWING' : 'QA_REVIEWING';
        else status = r < 0.50 ? 'SUBMITTED' : r < 0.70 ? 'TL_REVIEWING' : 'SM_REVIEWING';
      } else if (daysAgo === 1) {
        // Yesterday (Apr 2): Normal should be COMPLETED by morning chorei
        if (routeType === 'normal') {
          status = 'COMPLETED'; // TL approved in morning
        } else if (routeType === 'major') {
          status = rand() < 0.6 ? 'COMPLETED' : 'QA_REVIEWING'; // Some still at QA
        } else {
          // Critical: may still be in review chain
          const r = rand();
          status = r < 0.3 ? 'COMPLETED' : r < 0.5 ? 'DIR_REVIEWING' : r < 0.7 ? 'QA_REVIEWING' : 'SM_REVIEWING';
        }
      } else {
        // Apr 1 (2 days ago): almost all done
        if (routeType === 'normal') {
          status = 'COMPLETED';
        } else if (routeType === 'major') {
          status = rand() < 0.9 ? 'COMPLETED' : 'QA_REVIEWING';
        } else {
          status = rand() < 0.7 ? 'COMPLETED' : (rand() < 0.5 ? 'DIR_REVIEWING' : 'QA_REVIEWING');
        }
      }

      // OT: 70% zero, 20% 1-2h, 7% 2-3h, 3% 3-4h
      let otHours = 0;
      const otR = rand();
      if (otR > 0.70) {
        if (otR < 0.90) otHours = +(1 + rand()).toFixed(1);
        else if (otR < 0.97) otHours = +(2 + rand()).toFixed(1);
        else otHours = +(3 + rand()).toFixed(1);
      }

      const dateStr = d.toISOString().split('T')[0];

      // Narratives
      const targetOptions = [`${product.name}加工 ${planQty}個目標`, `計画通り作業実施`];
      const resultsOptions = [`目標達成 ${actualQty}個完了`, `計画通り完了`];
      const improvementOptions = ['段取り時間短縮', '刃具寿命管理改善', '品質確保手段検討'];
      const tomorrowOptions = [`引き続き${product.name}加工予定`, '新ロット切替', '次工程準備'];

      reports.push({
        id: reportId++,
        operatorId: op.id,
        operatorName: op.name,
        date: dateStr,
        shift: shifts[Math.floor(rand() * 3)],
        machine: machines[Math.floor(rand() * machines.length)],
        product: product.name,
        jobNumber: product.jobNum,
        planQty,
        actualQty,
        achievement,
        achievementRate: achievement.toFixed(1),
        defectRate: +defectRate.toFixed(2),
        totalDefects,
        maxSeverity,
        routeType,
        variance: +((actualQty - planQty) / planQty * 100).toFixed(1),
        status,
        hours: {
          regular: 7.5,
          overtime: otHours,
          downtime: rand() > 0.92 ? Math.floor(rand() * 60) : 0
        },
        defects,
        narratives: {
          target: targetOptions[Math.floor(rand() * targetOptions.length)],
          results: resultsOptions[Math.floor(rand() * resultsOptions.length)],
          improvement: improvementOptions[Math.floor(rand() * improvementOptions.length)],
          tomorrow: tomorrowOptions[Math.floor(rand() * tomorrowOptions.length)]
        },
        evaluation: status === 'COMPLETED' && rand() > 0.2 ? {
          stars: 3 + Math.floor(rand() * 2.9),
          comment: ['良好な達成', '目標達成', '標準的な成績', '改善が必要'][Math.floor(rand() * 4)]
        } : null,
        notes: '作業内容の記録',
        createdAt: dateStr,
        submittedAt: dateStr,
        team: op.team
      });
    }
  }

  return reports;
};

// ============================================================================
// DEFECT TYPES, ROOT CAUSES, COUNTERMEASURES, ACTIVITY TYPES
// ============================================================================
const defectTypes = [
  { code: "D01", name_ja: "寸法不良", name_en: "Dimensional Error" },
  { code: "D02", name_ja: "表面傷", name_en: "Surface Scratch" },
  { code: "D03", name_ja: "バリ残り", name_en: "Burr Remaining" },
  { code: "D04", name_ja: "穴ずれ", name_en: "Hole Misalignment" },
  { code: "D05", name_ja: "面粗度不良", name_en: "Surface Roughness" },
  { code: "D06", name_ja: "加工漏れ", name_en: "Missing Process" },
  { code: "D07", name_ja: "材料不良", name_en: "Material Defect" },
  { code: "D08", name_ja: "溶接不良", name_en: "Weld Defect" },
  { code: "D09", name_ja: "組立不良", name_en: "Assembly Error" },
  { code: "D10", name_ja: "塗装不良", name_en: "Paint Defect" },
  { code: "D11", name_ja: "変形・歪み", name_en: "Deformation" },
  { code: "D12", name_ja: "異物混入", name_en: "Contamination" },
  { code: "D99", name_ja: "その他", name_en: "Other" },
];

const rootCauses = [
  { code: "M01", name_ja: "技術不足", name_en: "Skill Shortage", category: "Man" },
  { code: "M02", name_ja: "不注意", name_en: "Carelessness", category: "Man" },
  { code: "M03", name_ja: "疲労", name_en: "Fatigue", category: "Man" },
  { code: "M04", name_ja: "手順無視", name_en: "Procedure Ignored", category: "Man" },
  { code: "M05", name_ja: "経験不足", name_en: "Inexperience", category: "Man" },
  { code: "M06", name_ja: "摩耗", name_en: "Wear", category: "Machine" },
  { code: "M07", name_ja: "校正ずれ", name_en: "Calibration Drift", category: "Machine" },
  { code: "M08", name_ja: "刃具劣化", name_en: "Tool Degradation", category: "Machine" },
  { code: "M09", name_ja: "スピンドル異常", name_en: "Spindle Anomaly", category: "Machine" },
  { code: "M10", name_ja: "冷却不良", name_en: "Cooling Failure", category: "Machine" },
  { code: "M11", name_ja: "プログラムミス", name_en: "Program Error", category: "Machine" },
  { code: "M12", name_ja: "材質ばらつき", name_en: "Material Variation", category: "Material" },
  { code: "M13", name_ja: "硬度不良", name_en: "Hardness Issue", category: "Material" },
  { code: "M14", name_ja: "寸法誤差(素材)", name_en: "Raw Material Dim Error", category: "Material" },
  { code: "M15", name_ja: "錆・腐食", name_en: "Rust/Corrosion", category: "Material" },
  { code: "M16", name_ja: "作業手順不備", name_en: "Procedure Gap", category: "Method" },
  { code: "M17", name_ja: "測定方法不適切", name_en: "Wrong Measurement", category: "Method" },
  { code: "M18", name_ja: "段取り不良", name_en: "Setup Error", category: "Method" },
  { code: "M19", name_ja: "検査基準曖昧", name_en: "Vague Inspection Std", category: "Method" },
  { code: "M20", name_ja: "工程順序誤り", name_en: "Process Order Error", category: "Method" },
];

const countermeasures = [
  { code: "A01", name_ja: "再教育", name_en: "Re-training" },
  { code: "A02", name_ja: "手順書改訂", name_en: "Procedure Revision" },
  { code: "A03", name_ja: "治具修正", name_en: "Jig/Fixture Fix" },
  { code: "A04", name_ja: "刃具交換", name_en: "Tool Replacement" },
  { code: "A05", name_ja: "プログラム修正", name_en: "Program Fix" },
  { code: "A06", name_ja: "機械調整", name_en: "Machine Adjustment" },
  { code: "A07", name_ja: "材料変更", name_en: "Material Change" },
  { code: "A08", name_ja: "検査強化", name_en: "Inspection Strengthen" },
  { code: "A09", name_ja: "ポカヨケ導入", name_en: "Poka-Yoke Install" },
  { code: "A10", name_ja: "ダブルチェック", name_en: "Double Check" },
  { code: "A99", name_ja: "その他", name_en: "Other" },
];

const activityTypes = [
  { id: "ACT01", name_ja: "打合・段取", name_en: "Meeting/Setup" },
  { id: "ACT02", name_ja: "設計・展開", name_en: "Design/Development" },
  { id: "ACT03", name_ja: "製缶", name_en: "Fabrication" },
  { id: "ACT04", name_ja: "組立", name_en: "Assembly" },
  { id: "ACT05", name_ja: "試運転", name_en: "Test Run" },
  { id: "ACT06", name_ja: "現地作業", name_en: "On-site Work" },
  { id: "ACT07", name_ja: "機械加工", name_en: "Machining" },
  { id: "ACT08", name_ja: "メンテナンス", name_en: "Maintenance" },
  { id: "ACT09", name_ja: "バリ取り・酸洗", name_en: "Deburring/Pickling" },
  { id: "ACT10", name_ja: "ドキュメント作成", name_en: "Documentation" },
];

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
const translations = {
  ja: {
    appTitle: "スマートファクトリ 生産日報システム",
    appSubtitle: "CNC部門",
    logout: "ログアウト",
    language: "言語",
    dashboard: "ダッシュボード",
    reports: "日報一覧",
    newReport: "新規日報",
    approvals: "承認待ち",
    morningReview: "朝礼",
    settings: "設定",
    admin: "管理者",
    loginTitle: "ログイン",
    operator: "オペレータ",
    team_leader: "班長",
    section_manager: "課長",
    qa: "品質管理",
    maintenance_lead: "保全リーダー",
    director: "工場長",
    dashboardTitle: "ダッシュボード",
    todayOutput: "本日の生産数",
    achievementRate: "成績率",
    pendingApprovals: "承認待ち",
    defectRate: "不具合率",
    groupOutput: "グループ出荷",
    groupDefectRate: "グループ不具合率",
    factoryDefectRate: "工場不具合率",
    fpy: "初回良率",
    productionCost: "生産原価",
    oee: "OEE",
    totalOutputQty: "総生産数量",
    defectPPM: "PPM",
    onTimeDelivery: "納期達成率",
    departmentOutput: "部門生産数量",
    departmentAchievementRate: "部門成績率",
    pendingQAReviews: "品質管理待ち",
    rejectedReportsBanner: "却下された報告書",
    recentReportsTable: "最近7日間の日報",
    quickActions: "クイック操作",
    morningAlerts: "朝礼情報",
    yesterdayStatus: "昨日の報告状況",
    tlFeedback: "班長からのコメント",
    choreiNotes: "朝礼の注意点",
    shift: "シフト",
    shiftA: "A班",
    shiftB: "B班",
    shiftC: "C班",
    machine: "機械",
    product: "製品",
    quantity: "数量",
    planQuantity: "計画数量",
    actualQuantity: "実績数量",
    workTarget: "作業目標",
    workResults: "作業結果",
    improvementPoints: "改善ポイント",
    tomorrowPlan: "明日の予定",
    workHours: "勤務時間",
    regularHours: "通常勤務",
    overtimeHours: "超勤時間",
    downtimeHours: "停止時間",
    plannedDowntime: "計画停止",
    unplannedDowntime: "非計画停止",
    analytics: "分析",
    outputChart: "生産出力",
    defectTrend: "不具合トレンド",
    activityDistribution: "活動分布",
    configuration: "設定",
    configurableThresholds: "設定可能な閾値",
    defectThreshold: "不具合閾値",
    varianceThreshold: "差異閾値",
  },
  en: {
    appTitle: "Smart Factory Production Report System",
    appSubtitle: "CNC Department",
    logout: "Logout",
    language: "Language",
    dashboard: "Dashboard",
    reports: "Reports",
    newReport: "New Report",
    approvals: "Approvals",
    morningReview: "Morning Review",
    settings: "Settings",
    admin: "Admin",
    loginTitle: "Login",
    operator: "Operator",
    team_leader: "Team Leader",
    section_manager: "Section Manager",
    qa: "Quality Assurance",
    maintenance_lead: "Maintenance Lead",
    director: "Director",
    dashboardTitle: "Dashboard",
    todayOutput: "Today Output",
    achievementRate: "Achievement Rate",
    pendingApprovals: "Pending Approvals",
    defectRate: "Defect Rate",
    groupOutput: "Group Output",
    groupDefectRate: "Group Defect Rate",
    factoryDefectRate: "Factory Defect Rate",
    fpy: "First Pass Yield",
    productionCost: "Production Cost",
    oee: "OEE",
    totalOutputQty: "Total Output",
    defectPPM: "PPM",
    onTimeDelivery: "On-Time Delivery",
    departmentOutput: "Department Output",
    departmentAchievementRate: "Department Achievement",
    pendingQAReviews: "Pending QA Reviews",
    rejectedReportsBanner: "Rejected Reports",
    recentReportsTable: "Recent Reports (Last 7 Days)",
    quickActions: "Quick Actions",
    morningAlerts: "Morning Alerts",
    yesterdayStatus: "Yesterday Status",
    tlFeedback: "Team Leader Feedback",
    choreiNotes: "Chorei Notes",
    shift: "Shift",
    shiftA: "Shift A",
    shiftB: "Shift B",
    shiftC: "Shift C",
    machine: "Machine",
    product: "Product",
    quantity: "Quantity",
    planQuantity: "Planned Quantity",
    actualQuantity: "Actual Quantity",
    workTarget: "Work Target",
    workResults: "Work Results",
    improvementPoints: "Improvement Points",
    tomorrowPlan: "Tomorrow Plan",
    workHours: "Work Hours",
    regularHours: "Regular Hours",
    overtimeHours: "Overtime Hours",
    downtimeHours: "Downtime Hours",
    plannedDowntime: "Planned Downtime",
    unplannedDowntime: "Unplanned Downtime",
    analytics: "Analytics",
    outputChart: "Output Chart",
    defectTrend: "Defect Trend",
    activityDistribution: "Activity Distribution",
    configuration: "Configuration",
    configurableThresholds: "Configurable Thresholds",
    defectThreshold: "Defect Threshold",
    varianceThreshold: "Variance Threshold",
  }
};

const generateMockUsers = () => {
  const rand = createSeededRandom(12345);
  const users = [];

  // 50 operators (40 operators + 10 team leaders who are also operators)
  const firstNamesChinese = ['田中', '佐藤', '鈴木', '高橋', '山本', '渡辺', '中村', '小林', '加藤', '吉田'];
  const lastNames = ['太郎', '次郎', '三郎', '四郎', '五郎', '六郎', '七郎', '八郎', '九郎', '十郎'];

  let userId = 1;

  // Operators
  for (let i = 0; i < 40; i++) {
    users.push({
      id: userId++,
      username: `op${String(i + 1).padStart(3, '0')}`,
      password: 'demo',
      name: `${firstNamesChinese[i % 10]}${lastNames[i % 10]}`,
      role: 'operator',
      team: `チーム${Math.floor(i / 4) + 1}`,
      avatar: `https://i.pravatar.cc/64?img=${i}`,
      color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'][i % 5]
    });
  }

  // Team leaders (also operators, 10 total)
  for (let i = 0; i < 10; i++) {
    users.push({
      id: userId++,
      username: `tl${String(i + 1).padStart(3, '0')}`,
      password: 'demo',
      name: `リーダー${i + 1}`,
      role: 'team_leader',
      team: `チーム${i + 1}`,
      avatar: `https://i.pravatar.cc/64?img=${40 + i}`,
      color: 'bg-green-600'
    });
  }

  // Section Manager (CNC Department)
  users.push({
    id: userId++,
    username: 'sm001',
    password: 'demo',
    name: 'CNC課長',
    role: 'section_manager',
    team: 'CNC部門',
    avatar: 'https://i.pravatar.cc/64?img=50',
    color: 'bg-blue-700'
  });

  // QA
  users.push({
    id: userId++,
    username: 'qa001',
    password: 'demo',
    name: '品質管理',
    role: 'qa',
    team: '品質',
    avatar: 'https://i.pravatar.cc/64?img=51',
    color: 'bg-red-600'
  });

  // Maintenance Lead
  users.push({
    id: userId++,
    username: 'ml001',
    password: 'demo',
    name: '保全リーダー',
    role: 'maintenance_lead',
    team: '保全',
    avatar: 'https://i.pravatar.cc/64?img=52',
    color: 'bg-purple-700'
  });

  // Director
  users.push({
    id: userId++,
    username: 'dir001',
    password: 'demo',
    name: '工場長',
    role: 'director',
    team: '工場',
    avatar: 'https://i.pravatar.cc/64?img=53',
    color: 'bg-red-800'
  });

  return users;
};

// ============================================================================
// LOGIN SCREEN
// ============================================================================
const LoginScreen = ({ onLogin }) => {
  const [language, setLanguage] = useState('ja');
  const users = generateMockUsers();

  const handleLogin = (user) => {
    onLogin(user, language);
  };

  const t = translations[language];

  // Demo tablet: 4 operators + 1 TL + 1 SM + 1 QA + 1 Director
  const demoUsers = [
    ...users.filter(u => u.role === 'operator').slice(0, 4),
    users.find(u => u.role === 'team_leader'),
    users.find(u => u.role === 'section_manager'),
    users.find(u => u.role === 'qa'),
    users.find(u => u.role === 'director'),
  ].filter(Boolean);

  const roleColors = {
    operator: 'border-blue-300 hover:border-blue-500 hover:bg-blue-50',
    team_leader: 'border-green-300 hover:border-green-500 hover:bg-green-50',
    section_manager: 'border-orange-300 hover:border-orange-500 hover:bg-orange-50',
    qa: 'border-purple-300 hover:border-purple-500 hover:bg-purple-50',
    director: 'border-red-300 hover:border-red-500 hover:bg-red-50',
  };
  const roleBadgeColors = {
    operator: 'bg-blue-100 text-blue-700',
    team_leader: 'bg-green-100 text-green-700',
    section_manager: 'bg-orange-100 text-orange-700',
    qa: 'bg-purple-100 text-purple-700',
    director: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏭</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.appTitle}</h1>
          <p className="text-gray-500 text-sm">{t.appSubtitle}</p>
        </div>

        <div className="mb-5 flex gap-2 justify-center">
          <button onClick={() => setLanguage('ja')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${language === 'ja' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            日本語
          </button>
          <button onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            English
          </button>
        </div>

        <p className="text-gray-500 text-center text-sm mb-4">
          {language === 'ja' ? 'タップしてログイン' : 'Tap to login'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {demoUsers.map(user => (
            <button key={user.id} onClick={() => handleLogin(user)}
              className={`p-4 border-2 rounded-xl transition transform hover:scale-[1.02] active:scale-95 text-left ${roleColors[user.role] || 'border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                  {user.team && <p className="text-xs text-gray-400 truncate">{user.team}</p>}
                </div>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadgeColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                {t[user.role]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL SELECT (touch-friendly picker for elderly workers)
// ============================================================================
const ModalSelect = ({ isOpen, onClose, title, options, value, onChange }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-2 flex-1">
          {options.map((opt, i) => (
            <button key={opt.value ?? i} onClick={() => { onChange(opt.value); onClose(); }}
              className={`w-full text-left p-4 rounded-xl mb-1 transition active:scale-[0.98] ${
                value === opt.value
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-bold'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-800'
              }`}>
              <span className="text-base">{opt.label}</span>
              {opt.sub && <span className="block text-xs text-gray-500 mt-0.5">{opt.sub}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR NAVIGATION (collapsible)
// ============================================================================
const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse, currentUser, onLogout, onNavigate, language, activePage }) => {
  const t = translations[language];

  const sidebarItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: t.dashboard, icon: Home, show: true },
      { id: 'reports', label: t.reports, icon: FileText, show: true },
      { id: 'new-report', label: t.newReport, icon: Plus, show: ['operator', 'team_leader'].includes(currentUser?.role) },
      { id: 'approvals', label: t.approvals, icon: UserCheck, show: ['team_leader', 'section_manager', 'qa', 'director'].includes(currentUser?.role) },
      { id: 'analytics', label: t.analytics, icon: BarChart3, show: ['section_manager', 'qa', 'director', 'team_leader'].includes(currentUser?.role) },
      { id: 'settings', label: t.settings, icon: Settings, show: currentUser?.role === 'director' },
    ];
    return items.filter(item => item.show);
  }, [currentUser, t]);

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white ${sidebarWidth} transform transition-all duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto flex flex-col ${collapsed ? 'px-2 py-4' : 'p-6'}`}
      >
        {/* Mobile close */}
        <button onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-800 rounded">
          <X size={24} />
        </button>

        {/* Collapse toggle (desktop only) */}
        <button onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center p-2 hover:bg-gray-800 rounded-lg mb-4 self-end">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {!collapsed && <h2 className="text-lg font-bold mb-6 leading-tight">🏭 {t.appSubtitle}</h2>}

        <nav className={`space-y-1 mb-8 ${collapsed ? 'mt-2' : ''}`}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition ${
                activePage === item.id ? 'bg-gray-700 text-white font-bold' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-700 pt-4">
          <button onClick={onLogout} title={collapsed ? t.logout : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg hover:bg-gray-800 transition text-red-400`}>
            <LogOut size={20} />
            {!collapsed && <span>{t.logout}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

// ============================================================================
// OPERATOR DASHBOARD
// ============================================================================
const OperatorDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const operatorReports = reports.filter(r => r.operatorId === currentUser.id);

  // Today's plan (derived from latest report's order — mock assignment)
  const latestReport = operatorReports.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)[0];
  const todayPlan = latestReport ? {
    machine: latestReport.machine,
    product: latestReport.product,
    jobNumber: latestReport.jobNumber,
    planQty: latestReport.planQty,
    shift: latestReport.shift
  } : null;

  // Hours per order
  const orderHoursMap = {};
  operatorReports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!orderHoursMap[key]) orderHoursMap[key] = { jobNumber: key, product: r.product, totalHours: 0, totalOT: 0, totalQty: 0, totalPlan: 0, reports: 0 };
    orderHoursMap[key].totalHours += (r.hours?.regular || 7.5);
    orderHoursMap[key].totalOT += (r.hours?.overtime || 0);
    orderHoursMap[key].totalQty += r.actualQty;
    orderHoursMap[key].totalPlan += r.planQty;
    orderHoursMap[key].reports++;
  });
  const orderHours = Object.values(orderHoursMap).sort((a, b) => b.reports - a.reports);

  // Performance metrics
  const totalOutput = operatorReports.reduce((s, r) => s + r.actualQty, 0);
  const totalPlan = operatorReports.reduce((s, r) => s + r.planQty, 0);
  const totalDef = operatorReports.reduce((s, r) => s + r.totalDefects, 0);
  const totalRegHours = operatorReports.reduce((s, r) => s + (r.hours?.regular || 7.5), 0);
  const totalOTHours = operatorReports.reduce((s, r) => s + (r.hours?.overtime || 0), 0);
  const achRate = totalPlan > 0 ? ((totalOutput / totalPlan) * 100).toFixed(1) : '0';
  const defRate = totalOutput > 0 ? ((totalDef / totalOutput) * 100).toFixed(2) : '0';

  // Month performance (mock: all data is April 2026, so same as total for demo)
  const monthReports = operatorReports.filter(r => r.date && r.date.startsWith('2026-04'));
  const monthOutput = monthReports.reduce((s, r) => s + r.actualQty, 0);
  const monthPlan = monthReports.reduce((s, r) => s + r.planQty, 0);
  const monthDef = monthReports.reduce((s, r) => s + r.totalDefects, 0);
  const monthAch = monthPlan > 0 ? ((monthOutput / monthPlan) * 100).toFixed(1) : '0';
  const monthDefRate = monthOutput > 0 ? ((monthDef / monthOutput) * 100).toFixed(2) : '0';

  // Year performance (mock: same data for demo)
  const yearReports = operatorReports.filter(r => r.date && r.date.startsWith('2026'));
  const yearOutput = yearReports.reduce((s, r) => s + r.actualQty, 0);
  const yearPlan = yearReports.reduce((s, r) => s + r.planQty, 0);
  const yearDef = yearReports.reduce((s, r) => s + r.totalDefects, 0);
  const yearAch = yearPlan > 0 ? ((yearOutput / yearPlan) * 100).toFixed(1) : '0';
  const yearDefRate = yearOutput > 0 ? ((yearDef / yearOutput) * 100).toFixed(2) : '0';

  const stColors = {
    'DRAFT': 'bg-gray-100 text-gray-600', 'SUBMITTED': 'bg-blue-100 text-blue-700',
    'TL_REVIEWING': 'bg-yellow-100 text-yellow-700', 'QA_REVIEWING': 'bg-purple-100 text-purple-700',
    'SM_REVIEWING': 'bg-orange-100 text-orange-700', 'DIR_REVIEWING': 'bg-red-100 text-red-700',
    'COMPLETED': 'bg-green-100 text-green-700', 'REJECTED': 'bg-red-100 text-red-700'
  };
  const stLabels = language === 'ja' ? {
    'DRAFT': '下書き', 'SUBMITTED': '提出済', 'TL_REVIEWING': '班長確認中',
    'QA_REVIEWING': 'QA確認中', 'SM_REVIEWING': '課長確認中',
    'DIR_REVIEWING': '工場長確認中', 'COMPLETED': '完了', 'REJECTED': '差戻し'
  } : {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'ja' ? 'マイダッシュボード' : 'My Dashboard'}</h2>

      {/* Today's Assignment + Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '本日の担当機' : "Today's Machine"}</p>
          <p className="text-2xl font-bold text-blue-600">{todayPlan ? todayPlan.machine : '-'}</p>
          {todayPlan && <p className="text-xs text-gray-400">{language === 'ja' ? 'シフト' : 'Shift'}: {todayPlan.shift}</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '本日の計画' : "Today's Plan"}</p>
          <p className="text-3xl font-bold text-indigo-600">{todayPlan ? todayPlan.planQty : '-'}</p>
          {todayPlan && <p className="text-xs text-gray-400 truncate">{todayPlan.product}</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '勤務時間 (4月)' : 'Hours (April)'}</p>
          <p className="text-3xl font-bold text-blue-600">{totalRegHours.toFixed(1)}h</p>
          {totalOTHours > 0 && <p className="text-xs text-orange-600">{language === 'ja' ? '残業' : 'OT'}: {totalOTHours.toFixed(1)}h</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '未完了レポート' : 'Pending'}</p>
          <p className={`text-3xl font-bold ${operatorReports.filter(r => !['COMPLETED','REJECTED'].includes(r.status)).length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {operatorReports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length}
          </p>
        </div>
      </div>

      {/* Performance: Month vs Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={16} /> {language === 'ja' ? '今月の成績 (4月)' : 'This Month (April)'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className={`text-xl font-bold ${parseFloat(monthAch) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{monthAch}%</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '達成率' : 'Achievement'}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">{monthOutput}</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '生産数' : 'Output'}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${parseFloat(monthDefRate) > 5 ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className={`text-xl font-bold ${parseFloat(monthDefRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{monthDefRate}%</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{monthReports.length} {language === 'ja' ? '日間勤務' : 'days worked'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> {language === 'ja' ? '年間の成績 (2026年)' : 'Year Performance (2026)'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className={`text-xl font-bold ${parseFloat(yearAch) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{yearAch}%</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '達成率' : 'Achievement'}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-xl font-bold text-purple-600">{yearOutput}</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '生産数' : 'Output'}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${parseFloat(yearDefRate) > 5 ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className={`text-xl font-bold ${parseFloat(yearDefRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{yearDefRate}%</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{yearReports.length} {language === 'ja' ? '日間勤務' : 'days worked'}</p>
        </div>
      </div>

      {/* Hours per Order */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別作業時間' : 'Hours by Order'}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">{language === 'ja' ? '工番' : 'Job#'}</th>
                <th className="px-4 py-2 text-left">{language === 'ja' ? '製品' : 'Product'}</th>
                <th className="px-4 py-2 text-right">{language === 'ja' ? '通常(h)' : 'Regular(h)'}</th>
                <th className="px-4 py-2 text-right">{language === 'ja' ? '残業(h)' : 'OT(h)'}</th>
                <th className="px-4 py-2 text-right">{language === 'ja' ? '合計(h)' : 'Total(h)'}</th>
                <th className="px-4 py-2 text-right">{language === 'ja' ? '生産数' : 'Output'}</th>
                <th className="px-4 py-2 text-right">{language === 'ja' ? '達成率' : 'Ach%'}</th>
              </tr>
            </thead>
            <tbody>
              {orderHours.map(o => {
                const ach = o.totalPlan > 0 ? ((o.totalQty / o.totalPlan) * 100).toFixed(1) : '0';
                return (
                  <tr key={o.jobNumber} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                    <td className="px-4 py-2">{o.product}</td>
                    <td className="px-4 py-2 text-right">{o.totalHours.toFixed(1)}</td>
                    <td className={`px-4 py-2 text-right ${o.totalOT > 0 ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>{o.totalOT.toFixed(1)}</td>
                    <td className="px-4 py-2 text-right font-bold">{(o.totalHours + o.totalOT).toFixed(1)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{o.totalQty}</td>
                    <td className={`px-4 py-2 text-right font-bold ${parseFloat(ach) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{ach}%</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="px-4 py-2" colSpan={2}>{language === 'ja' ? '合計' : 'Total'}</td>
                <td className="px-4 py-2 text-right">{totalRegHours.toFixed(1)}</td>
                <td className="px-4 py-2 text-right text-orange-600">{totalOTHours.toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{(totalRegHours + totalOTHours).toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{totalOutput}</td>
                <td className={`px-4 py-2 text-right ${parseFloat(achRate) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{achRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reports with status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{t.recentReportsTable}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">{language === 'ja' ? '日付' : 'Date'}</th>
                <th className="px-4 py-2 text-left">{t.product}</th>
                <th className="px-4 py-2 text-right">{t.actualQuantity}</th>
                <th className="px-4 py-2 text-right">{t.defectRate}</th>
                <th className="px-4 py-2 text-center">{language === 'ja' ? 'ステータス' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {operatorReports.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 7).map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-600">{report.date}</td>
                  <td className="px-4 py-2">{report.product}</td>
                  <td className="px-4 py-2 text-right font-bold">{report.actualQty}</td>
                  <td className={`px-4 py-2 text-right font-bold ${report.defectRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.defectRate.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stColors[report.status] || 'bg-gray-100'}`}>
                      {stLabels[report.status] || report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEAM LEADER DASHBOARD
// ============================================================================
const TeamLeaderDashboard = ({ currentUser, language, reports, users, onNavigate }) => {
  const t = translations[language];
  const teamReports = reports.filter(r => {
    const operator = users.find(u => u.id === r.operatorId);
    return operator?.team === currentUser.team;
  });

  // TL's own reports (TL also works CNC)
  const myReports = reports.filter(r => r.operatorId === currentUser.id);
  const latestMyReport = myReports.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)[0];
  const todayPlan = latestMyReport ? {
    machine: latestMyReport.machine,
    product: latestMyReport.product,
    jobNumber: latestMyReport.jobNumber,
    planQty: latestMyReport.planQty,
    shift: latestMyReport.shift
  } : null;

  // My hours per order
  const myOrderMap = {};
  myReports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!myOrderMap[key]) myOrderMap[key] = { jobNumber: key, product: r.product, totalHours: 0, totalOT: 0, totalQty: 0, totalPlan: 0, reports: 0 };
    myOrderMap[key].totalHours += (r.hours?.regular || 7.5);
    myOrderMap[key].totalOT += (r.hours?.overtime || 0);
    myOrderMap[key].totalQty += r.actualQty;
    myOrderMap[key].totalPlan += r.planQty;
    myOrderMap[key].reports++;
  });
  const myOrderHours = Object.values(myOrderMap).sort((a, b) => b.reports - a.reports);

  // My performance totals
  const myOutput = myReports.reduce((s, r) => s + r.actualQty, 0);
  const myPlan = myReports.reduce((s, r) => s + r.planQty, 0);
  const myDef = myReports.reduce((s, r) => s + r.totalDefects, 0);
  const myRegHours = myReports.reduce((s, r) => s + (r.hours?.regular || 7.5), 0);
  const myOTHours = myReports.reduce((s, r) => s + (r.hours?.overtime || 0), 0);
  const myAch = myPlan > 0 ? ((myOutput / myPlan) * 100).toFixed(1) : '0';
  const myDefRate = myOutput > 0 ? ((myDef / myOutput) * 100).toFixed(2) : '0';

  // Month performance (my)
  const monthReports = myReports.filter(r => r.date && r.date.startsWith('2026-04'));
  const monthOutput = monthReports.reduce((s, r) => s + r.actualQty, 0);
  const monthPlan = monthReports.reduce((s, r) => s + r.planQty, 0);
  const monthDef = monthReports.reduce((s, r) => s + r.totalDefects, 0);
  const monthAch = monthPlan > 0 ? ((monthOutput / monthPlan) * 100).toFixed(1) : '0';
  const monthDefRate = monthOutput > 0 ? ((monthDef / monthOutput) * 100).toFixed(2) : '0';

  // Year performance (my)
  const yearReports = myReports.filter(r => r.date && r.date.startsWith('2026'));
  const yearOutput = yearReports.reduce((s, r) => s + r.actualQty, 0);
  const yearPlan = yearReports.reduce((s, r) => s + r.planQty, 0);
  const yearDef = yearReports.reduce((s, r) => s + r.totalDefects, 0);
  const yearAch = yearPlan > 0 ? ((yearOutput / yearPlan) * 100).toFixed(1) : '0';
  const yearDefRate = yearOutput > 0 ? ((yearDef / yearOutput) * 100).toFixed(2) : '0';

  // Per-order summary (team)
  const orderMap = {};
  teamReports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!orderMap[key]) orderMap[key] = { jobNumber: key, product: r.product, reports: [], totalPlan: 0, totalActual: 0, totalDefects: 0 };
    orderMap[key].reports.push(r);
    orderMap[key].totalPlan += r.planQty;
    orderMap[key].totalActual += r.actualQty;
    orderMap[key].totalDefects += r.totalDefects;
  });
  const orders = Object.values(orderMap).sort((a, b) => b.reports.length - a.reports.length);

  const totalOutput = teamReports.reduce((s, r) => s + r.actualQty, 0);
  const totalPlan = teamReports.reduce((s, r) => s + r.planQty, 0);
  const totalDef = teamReports.reduce((s, r) => s + r.totalDefects, 0);
  const defRate = totalOutput > 0 ? ((totalDef / totalOutput) * 100).toFixed(2) : '0';
  const achRate = totalPlan > 0 ? ((totalOutput / totalPlan) * 100).toFixed(1) : '0';

  // Review counts
  const tlPendingReview = teamReports.filter(r => ['SUBMITTED', 'TL_REVIEWING'].includes(r.status)).length;

  const stColors = {
    'DRAFT': 'bg-gray-100 text-gray-600', 'SUBMITTED': 'bg-blue-100 text-blue-700',
    'TL_REVIEWING': 'bg-yellow-100 text-yellow-700', 'QA_REVIEWING': 'bg-purple-100 text-purple-700',
    'SM_REVIEWING': 'bg-orange-100 text-orange-700', 'DIR_REVIEWING': 'bg-red-100 text-red-700',
    'COMPLETED': 'bg-green-100 text-green-700', 'REJECTED': 'bg-red-100 text-red-700'
  };
  const stLabels = language === 'ja' ? {
    'DRAFT': '下書き', 'SUBMITTED': '提出済', 'TL_REVIEWING': '班長確認中',
    'QA_REVIEWING': 'QA確認中', 'SM_REVIEWING': '課長確認中',
    'DIR_REVIEWING': '工場長確認中', 'COMPLETED': '完了', 'REJECTED': '差戻し'
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{language === 'ja' ? '班長ダッシュボード' : 'Team Leader Dashboard'}</h2>
        {onNavigate && (
          <button onClick={() => onNavigate('new-report')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-semibold">
            <Plus size={18} /> {language === 'ja' ? '新規レポート作成' : 'New Report'}
          </button>
        )}
      </div>

      {/* ===== SECTION 1: My Work (mirrors OperatorDashboard) ===== */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
          <Wrench size={18} /> {language === 'ja' ? '自分の作業実績' : 'My Work Performance'}
        </h3>

        {/* Today's Assignment - 4 cards (same as Operator) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '本日の担当機' : "Today's Machine"}</p>
            <p className="text-2xl font-bold text-blue-600">{todayPlan ? todayPlan.machine : '-'}</p>
            {todayPlan && <p className="text-xs text-gray-400">{language === 'ja' ? 'シフト' : 'Shift'}: {todayPlan.shift}</p>}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '本日の計画' : "Today's Plan"}</p>
            <p className="text-3xl font-bold text-indigo-600">{todayPlan ? todayPlan.planQty : '-'}</p>
            {todayPlan && <p className="text-xs text-gray-400 truncate">{todayPlan.product}</p>}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '勤務時間 (4月)' : 'Hours (April)'}</p>
            <p className="text-3xl font-bold text-blue-600">{myRegHours.toFixed(1)}h</p>
            {myOTHours > 0 && <p className="text-xs text-orange-600">{language === 'ja' ? '残業' : 'OT'}: {myOTHours.toFixed(1)}h</p>}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '未完了レポート' : 'Pending'}</p>
            <p className={`text-3xl font-bold ${myReports.filter(r => !['COMPLETED','REJECTED'].includes(r.status)).length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {myReports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length}
            </p>
          </div>
        </div>

        {/* Performance: Month vs Year (same as Operator) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={16} /> {language === 'ja' ? '今月の成績 (4月)' : 'This Month (April)'}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className={`text-xl font-bold ${parseFloat(monthAch) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{monthAch}%</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '達成率' : 'Achievement'}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-600">{monthOutput}</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '生産数' : 'Output'}</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${parseFloat(monthDefRate) > 5 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-xl font-bold ${parseFloat(monthDefRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{monthDefRate}%</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{monthReports.length} {language === 'ja' ? '日間勤務' : 'days worked'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp size={16} /> {language === 'ja' ? '年間の成績 (2026年)' : 'Year Performance (2026)'}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className={`text-xl font-bold ${parseFloat(yearAch) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{yearAch}%</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '達成率' : 'Achievement'}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-purple-600">{yearOutput}</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '生産数' : 'Output'}</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${parseFloat(yearDefRate) > 5 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-xl font-bold ${parseFloat(yearDefRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{yearDefRate}%</p>
                <p className="text-xs text-gray-500">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{yearReports.length} {language === 'ja' ? '日間勤務' : 'days worked'}</p>
          </div>
        </div>

        {/* Hours per Order (same as Operator) */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h4 className="font-bold text-gray-700 mb-3">{language === 'ja' ? 'オーダー別作業時間 (4月)' : 'Hours by Order (April)'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">{language === 'ja' ? '工番' : 'Job#'}</th>
                  <th className="px-4 py-2 text-left">{language === 'ja' ? '製品' : 'Product'}</th>
                  <th className="px-4 py-2 text-right">{language === 'ja' ? '通常(h)' : 'Regular(h)'}</th>
                  <th className="px-4 py-2 text-right">{language === 'ja' ? '残業(h)' : 'OT(h)'}</th>
                  <th className="px-4 py-2 text-right">{language === 'ja' ? '合計(h)' : 'Total(h)'}</th>
                  <th className="px-4 py-2 text-right">{language === 'ja' ? '生産数' : 'Output'}</th>
                  <th className="px-4 py-2 text-right">{language === 'ja' ? '達成率' : 'Ach%'}</th>
                </tr>
              </thead>
              <tbody>
                {myOrderHours.map(o => {
                  const ach = o.totalPlan > 0 ? ((o.totalQty / o.totalPlan) * 100).toFixed(1) : '0';
                  return (
                    <tr key={o.jobNumber} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                      <td className="px-4 py-2">{o.product}</td>
                      <td className="px-4 py-2 text-right">{o.totalHours.toFixed(1)}</td>
                      <td className={`px-4 py-2 text-right ${o.totalOT > 0 ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>{o.totalOT.toFixed(1)}</td>
                      <td className="px-4 py-2 text-right font-bold">{(o.totalHours + o.totalOT).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right font-semibold">{o.totalQty}</td>
                      <td className={`px-4 py-2 text-right font-bold ${parseFloat(ach) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{ach}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-4 py-2" colSpan={2}>{language === 'ja' ? '合計' : 'Total'}</td>
                  <td className="px-4 py-2 text-right">{myRegHours.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-orange-600">{myOTHours.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{(myRegHours + myOTHours).toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{myOutput}</td>
                  <td className={`px-4 py-2 text-right ${parseFloat(myAch) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{myAch}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* My Recent Reports with status */}
        <div className="bg-white rounded-lg shadow-sm p-5 mt-4">
          <h4 className="font-bold text-gray-700 mb-3">{language === 'ja' ? '自分の日報一覧' : 'My Recent Reports'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">{language === 'ja' ? '日付' : 'Date'}</th>
                  <th className="px-4 py-2 text-left">{t.product}</th>
                  <th className="px-4 py-2 text-right">{t.actualQuantity}</th>
                  <th className="px-4 py-2 text-right">{t.defectRate}</th>
                  <th className="px-4 py-2 text-center">{language === 'ja' ? 'ステータス' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {myReports.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 7).map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{report.date}</td>
                    <td className="px-4 py-2">{report.product}</td>
                    <td className="px-4 py-2 text-right font-bold">{report.actualQty}</td>
                    <td className={`px-4 py-2 text-right font-bold ${report.defectRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.defectRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stColors[report.status] || 'bg-gray-100'}`}>
                        {stLabels[report.status] || report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== SECTION 2: TL-Specific — Review Requests + Team KPI ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`bg-white rounded-lg shadow-sm p-5 ${tlPendingReview > 0 ? 'border-2 border-yellow-400' : ''}`}>
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '承認リクエスト' : 'Review Requests'}</p>
          <p className={`text-3xl font-bold ${tlPendingReview > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{tlPendingReview}</p>
          <p className="text-xs text-gray-400">{language === 'ja' ? '班長承認待ち' : 'Awaiting TL review'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? 'チーム達成率' : 'Team Achievement'}</p>
          <p className={`text-3xl font-bold ${parseFloat(achRate) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{achRate}%</p>
          <p className="text-xs text-gray-400">{totalOutput} / {totalPlan}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? 'チーム不具合' : 'Team Defects'}</p>
          <p className="text-3xl font-bold text-red-600">{totalDef}</p>
          <p className="text-xs text-gray-400">{language === 'ja' ? '不具合率' : 'Rate'}: {defRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? 'メンバー数' : 'Members'}</p>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.team === currentUser.team && u.role === 'operator').length}
          </p>
        </div>
      </div>

      {/* ===== SECTION 3: Per-Order Team Summary ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users size={18} /> {language === 'ja' ? 'オーダー別チーム実績' : 'Team Performance by Order'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '工番' : 'Job#'}</th>
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '製品' : 'Product'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '計画' : 'Plan'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '実績' : 'Actual'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '達成率' : 'Ach%'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '不具合' : 'Defects'}</th>
                <th className="py-2 px-3 text-center font-semibold">{language === 'ja' ? '状態' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const ach = o.totalPlan > 0 ? ((o.totalActual / o.totalPlan) * 100).toFixed(1) : '0';
                const dr = o.totalActual > 0 ? ((o.totalDefects / o.totalActual) * 100).toFixed(1) : '0';
                const pending = o.reports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length;
                return (
                  <tr key={o.jobNumber} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                    <td className="py-3 px-3">{o.product}</td>
                    <td className="py-3 px-3 text-right">{o.totalPlan}</td>
                    <td className="py-3 px-3 text-right font-semibold">{o.totalActual}</td>
                    <td className={`py-3 px-3 text-right font-bold ${parseFloat(ach) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{ach}%</td>
                    <td className={`py-3 px-3 text-right ${parseFloat(dr) > 5 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{o.totalDefects} ({dr}%)</td>
                    <td className="py-3 px-3 text-center">
                      {pending > 0
                        ? <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{pending}{language === 'ja' ? '件未完了' : ' pending'}</span>
                        : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{language === 'ja' ? '完了' : 'Done'}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== SECTION 4: Team Reports ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'チーム日報一覧' : 'Team Reports'}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">{language === 'ja' ? '日付' : 'Date'}</th>
                <th className="px-4 py-2 text-left">{language === 'ja' ? '作業者' : 'Operator'}</th>
                <th className="px-4 py-2 text-left">{t.product}</th>
                <th className="px-4 py-2 text-right">{t.actualQuantity}</th>
                <th className="px-4 py-2 text-right">{t.defectRate}</th>
                <th className="px-4 py-2 text-center">{language === 'ja' ? 'ステータス' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {teamReports.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 15).map((report) => {
                const operator = users.find(u => u.id === report.operatorId);
                return (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{report.date}</td>
                    <td className="px-4 py-2">{operator?.name || 'Unknown'}</td>
                    <td className="px-4 py-2">{report.product}</td>
                    <td className="px-4 py-2 text-right font-bold">{report.actualQty}</td>
                    <td className={`px-4 py-2 text-right font-bold ${report.defectRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.defectRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stColors[report.status] || 'bg-gray-100'}`}>
                        {stLabels[report.status] || report.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION MANAGER DASHBOARD
// ============================================================================
const SectionManagerDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];

  const totalOutput = reports.reduce((s, r) => s + r.actualQty, 0);
  const totalPlan = reports.reduce((s, r) => s + r.planQty, 0);
  const totalDef = reports.reduce((s, r) => s + r.totalDefects, 0);
  const defRate = totalOutput > 0 ? ((totalDef / totalOutput) * 100).toFixed(2) : '0';
  const achRate = totalPlan > 0 ? ((totalOutput / totalPlan) * 100).toFixed(1) : '0';
  const smPending = reports.filter(r => r.status === 'SM_REVIEWING').length;

  // Per-order summary
  const orderMap = {};
  reports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!orderMap[key]) orderMap[key] = { jobNumber: key, product: r.product, reports: [], totalPlan: 0, totalActual: 0, totalDefects: 0 };
    orderMap[key].reports.push(r);
    orderMap[key].totalPlan += r.planQty;
    orderMap[key].totalActual += r.actualQty;
    orderMap[key].totalDefects += r.totalDefects;
  });
  const orders = Object.values(orderMap).sort((a, b) => b.reports.length - a.reports.length);

  // Chart data per order
  const orderChartData = orders.map(o => ({
    name: o.jobNumber.replace('J2025-', ''),
    plan: o.totalPlan,
    actual: o.totalActual,
    defects: o.totalDefects
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'ja' ? '課長ダッシュボード' : 'Section Manager Dashboard'}</h2>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '部門生産数' : 'Dept Output'}</p>
          <p className="text-3xl font-bold text-blue-600">{totalOutput}</p>
          <p className="text-xs text-gray-400">{language === 'ja' ? '計画' : 'Plan'}: {totalPlan}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '達成率' : 'Achievement'}</p>
          <p className={`text-3xl font-bold ${parseFloat(achRate) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{achRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
          <p className={`text-3xl font-bold ${parseFloat(defRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{defRate}%</p>
          <p className="text-xs text-gray-400">{totalDef} {language === 'ja' ? '件' : 'defects'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '課長承認待ち' : 'SM Pending'}</p>
          <p className={`text-3xl font-bold ${smPending > 0 ? 'text-orange-600' : 'text-green-600'}`}>{smPending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? 'オーダー数' : 'Orders'}</p>
          <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
        </div>
      </div>

      {/* Per-order chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別 計画vs実績' : 'Plan vs Actual by Order'}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="plan" fill="#93c5fd" name={language === 'ja' ? '計画' : 'Plan'} />
            <Bar dataKey="actual" fill="#3b82f6" name={language === 'ja' ? '実績' : 'Actual'} />
            <Bar dataKey="defects" fill="#ef4444" name={language === 'ja' ? '不具合' : 'Defects'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-order table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別状況' : 'Order Status'}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '工番' : 'Job#'}</th>
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '製品' : 'Product'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '計画' : 'Plan'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '実績' : 'Actual'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '達成率' : 'Ach%'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '不具合' : 'Defects'}</th>
                <th className="py-2 px-3 text-center font-semibold">{language === 'ja' ? '状態' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const ach = o.totalPlan > 0 ? ((o.totalActual / o.totalPlan) * 100).toFixed(1) : '0';
                const dr = o.totalActual > 0 ? ((o.totalDefects / o.totalActual) * 100).toFixed(1) : '0';
                const pending = o.reports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length;
                const hasCritical = o.reports.some(r => r.maxSeverity === 'critical' && !['COMPLETED', 'REJECTED'].includes(r.status));
                return (
                  <tr key={o.jobNumber} className={`border-b hover:bg-gray-50 ${hasCritical ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                    <td className="py-3 px-3">{o.product}</td>
                    <td className="py-3 px-3 text-right">{o.totalPlan}</td>
                    <td className="py-3 px-3 text-right font-semibold">{o.totalActual}</td>
                    <td className={`py-3 px-3 text-right font-bold ${parseFloat(ach) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{ach}%</td>
                    <td className={`py-3 px-3 text-right ${parseFloat(dr) > 5 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{o.totalDefects} ({dr}%)</td>
                    <td className="py-3 px-3 text-center">
                      {hasCritical
                        ? <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Critical</span>
                        : pending > 0
                          ? <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{pending}{language === 'ja' ? '件処理中' : ' active'}</span>
                          : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{language === 'ja' ? '完了' : 'Done'}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SM review items */}
      {smPending > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-4">{language === 'ja' ? '課長承認待ち報告' : 'Pending SM Review'}</h3>
          <div className="space-y-3">
            {reports.filter(r => r.status === 'SM_REVIEWING').map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold text-gray-900">{r.operatorName} - {r.product}</p>
                  <p className="text-sm text-gray-600">{r.date} | {r.jobNumber} | {language === 'ja' ? '不具合率' : 'Defect'}: {r.defectRate.toFixed(1)}%</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">SM_REVIEWING</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QA DASHBOARD
// ============================================================================
const QADashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];

  const totalOutput = reports.reduce((s, r) => s + r.actualQty, 0);
  const totalDef = reports.reduce((s, r) => s + r.totalDefects, 0);
  const fpy = ((1 - (totalDef / Math.max(totalOutput, 1))) * 100).toFixed(2);
  const qaPending = reports.filter(r => r.status === 'QA_REVIEWING').length;

  // Per-order summary
  const orderMap = {};
  reports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!orderMap[key]) orderMap[key] = { jobNumber: key, product: r.product, reports: [], totalPlan: 0, totalActual: 0, totalDefects: 0 };
    orderMap[key].reports.push(r);
    orderMap[key].totalPlan += r.planQty;
    orderMap[key].totalActual += r.actualQty;
    orderMap[key].totalDefects += r.totalDefects;
  });
  const orders = Object.values(orderMap).sort((a, b) => b.totalDefects - a.totalDefects);

  // Defect by type
  const defectsByType = {};
  reports.forEach(r => {
    r.defects?.forEach(d => {
      const dt = defectTypes.find(t => t.code === d.type);
      const name = dt ? dt.name_ja : d.type;
      defectsByType[name] = (defectsByType[name] || 0) + d.count;
    });
  });
  const defectData = Object.entries(defectsByType).map(([name, count]) => ({ name, value: count })).sort((a, b) => b.value - a.value);

  // Chart data per order
  const orderChartData = orders.map(o => ({
    name: o.jobNumber.replace('J2025-', ''),
    defects: o.totalDefects,
    defectRate: o.totalActual > 0 ? +((o.totalDefects / o.totalActual) * 100).toFixed(1) : 0
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'ja' ? '品質管理ダッシュボード' : 'QA Dashboard'}</h2>

      {/* QA KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '総生産数' : 'Total Output'}</p>
          <p className="text-3xl font-bold text-blue-600">{totalOutput}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '総不具合数' : 'Total Defects'}</p>
          <p className="text-3xl font-bold text-red-600">{totalDef}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{t.fpy}</p>
          <p className="text-3xl font-bold text-green-600">{fpy}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{t.pendingQAReviews}</p>
          <p className={`text-3xl font-bold ${qaPending > 0 ? 'text-orange-600' : 'text-green-600'}`}>{qaPending}</p>
        </div>
      </div>

      {/* Defect by Type chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? '不具合の種類別' : 'Defects by Type'}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={defectData.slice(0, 8)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-order defect chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別不具合率' : 'Defect Rate by Order'}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={orderChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" unit="%" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="defects" fill="#ef4444" name={language === 'ja' ? '不具合数' : 'Defects'} />
            <Line yAxisId="right" dataKey="defectRate" stroke="#f97316" strokeWidth={2} name={language === 'ja' ? '不具合率%' : 'Defect Rate%'} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Per-order table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別品質状況' : 'Quality by Order'}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '工番' : 'Job#'}</th>
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '製品' : 'Product'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '生産数' : 'Output'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '不具合数' : 'Defects'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '不具合率' : 'Rate'}</th>
                <th className="py-2 px-3 text-center font-semibold">{language === 'ja' ? 'QA待ち' : 'QA Pending'}</th>
                <th className="py-2 px-3 text-center font-semibold">{language === 'ja' ? '状態' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const dr = o.totalActual > 0 ? ((o.totalDefects / o.totalActual) * 100).toFixed(1) : '0';
                const qaCount = o.reports.filter(r => r.status === 'QA_REVIEWING').length;
                const hasCritical = o.reports.some(r => r.maxSeverity === 'critical' && !['COMPLETED', 'REJECTED'].includes(r.status));
                return (
                  <tr key={o.jobNumber} className={`border-b hover:bg-gray-50 ${hasCritical ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                    <td className="py-3 px-3">{o.product}</td>
                    <td className="py-3 px-3 text-right font-semibold">{o.totalActual}</td>
                    <td className={`py-3 px-3 text-right ${o.totalDefects > 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{o.totalDefects}</td>
                    <td className={`py-3 px-3 text-right font-bold ${parseFloat(dr) > 5 ? 'text-red-600' : 'text-green-600'}`}>{dr}%</td>
                    <td className="py-3 px-3 text-center">
                      {qaCount > 0 ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{qaCount}</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {hasCritical
                        ? <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Critical</span>
                        : parseFloat(dr) > 5
                          ? <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{language === 'ja' ? '要注意' : 'Warning'}</span>
                          : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{language === 'ja' ? '良好' : 'Good'}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QA review items */}
      {qaPending > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">{language === 'ja' ? 'QA承認待ち報告' : 'Pending QA Review'}</h3>
          <div className="space-y-3">
            {reports.filter(r => r.status === 'QA_REVIEWING').map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                <div>
                  <p className="font-semibold text-gray-900">{r.operatorName} - {r.product}</p>
                  <p className="text-sm text-gray-600">{r.date} | {r.jobNumber} | {language === 'ja' ? '重大度' : 'Severity'}: {r.maxSeverity}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.maxSeverity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>
                  {r.maxSeverity === 'critical' ? 'CRITICAL' : 'QA_REVIEWING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAINTENANCE LEAD DASHBOARD
// ============================================================================
const MaintenanceLeadDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];

  const machineStats = {};
  reports.forEach(r => {
    if (!machineStats[r.machine]) {
      machineStats[r.machine] = { total: 0, defects: 0 };
    }
    machineStats[r.machine].total += r.actualQty;
    machineStats[r.machine].defects += r.totalDefects;
  });

  const machineData = Object.entries(machineStats).map(([machine, stats]) => ({
    machine,
    ...stats,
    defectRate: ((stats.defects / stats.total) * 100).toFixed(2)
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">保全リーダー {t.dashboardTitle}</h2>

      {/* Machine Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold">機械台数</p>
          <p className="text-3xl font-bold text-blue-600">
            {Object.keys(machineStats).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold">稼働時間</p>
          <p className="text-3xl font-bold text-green-600">
            {(reports.reduce((sum, r) => sum + (r.hours?.regular || 0), 0)).toFixed(1)}h
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold">停止時間</p>
          <p className="text-3xl font-bold text-orange-600">
            {reports.reduce((sum, r) => sum + (r.hours?.downtime || 0), 0)}m
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold">機械効率</p>
          <p className="text-3xl font-bold text-purple-600">
            {((reports.filter(r => (r.hours?.downtime || 0) < 30).length / reports.length) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Machine Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">機械別出力</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">機械</th>
                <th className="px-4 py-2 text-right">出力</th>
                <th className="px-4 py-2 text-right">不具合数</th>
                <th className="px-4 py-2 text-right">不具合率</th>
              </tr>
            </thead>
            <tbody>
              {machineData.map((machine) => (
                <tr key={machine.machine} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{machine.machine}</td>
                  <td className="px-4 py-2 text-right font-bold">{machine.total}</td>
                  <td className="px-4 py-2 text-right">{machine.defects}</td>
                  <td className={`px-4 py-2 text-right font-bold ${parseFloat(machine.defectRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {machine.defectRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DIRECTOR DASHBOARD
// ============================================================================
const DirectorDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const [selectedOrder, setSelectedOrder] = useState('all');

  // Group reports by job order (工番)
  const orderMap = {};
  reports.forEach(r => {
    const key = r.jobNumber || 'N/A';
    if (!orderMap[key]) orderMap[key] = { jobNumber: key, product: r.product, reports: [], totalPlan: 0, totalActual: 0, totalDefects: 0 };
    orderMap[key].reports.push(r);
    orderMap[key].totalPlan += r.planQty;
    orderMap[key].totalActual += r.actualQty;
    orderMap[key].totalDefects += r.totalDefects;
  });
  const orders = Object.values(orderMap).sort((a, b) => b.reports.length - a.reports.length);

  // Filtered reports for selected order
  const filteredReports = selectedOrder === 'all' ? reports : reports.filter(r => r.jobNumber === selectedOrder);
  const totalOutput = filteredReports.reduce((sum, r) => sum + r.actualQty, 0);
  const totalPlan = filteredReports.reduce((sum, r) => sum + r.planQty, 0);
  const totalDefects = filteredReports.reduce((sum, r) => sum + r.totalDefects, 0);
  const achievementRate = totalPlan > 0 ? ((totalOutput / totalPlan) * 100).toFixed(1) : '0';
  const defectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100).toFixed(2) : '0';
  const completedCount = filteredReports.filter(r => r.status === 'COMPLETED').length;
  const pendingCount = filteredReports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'ja' ? '工場長ダッシュボード' : 'Director Dashboard'}</h2>

      {/* Order Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-semibold text-gray-600 mb-2">{language === 'ja' ? '工番（オーダー）で絞り込み' : 'Filter by Job Order'}</label>
        <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm font-semibold">
          <option value="all">{language === 'ja' ? '全オーダー' : 'All Orders'}</option>
          {orders.map(o => (
            <option key={o.jobNumber} value={o.jobNumber}>
              {o.jobNumber} - {o.product} ({o.reports.length}{language === 'ja' ? '件' : ' reports'})
            </option>
          ))}
        </select>
      </div>

      {/* KPI Cards for selected order */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '達成率' : 'Achievement'}</p>
          <p className={`text-3xl font-bold ${parseFloat(achievementRate) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{achievementRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{totalOutput} / {totalPlan}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '不具合率' : 'Defect Rate'}</p>
          <p className={`text-3xl font-bold ${parseFloat(defectRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>{defectRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{totalDefects} {language === 'ja' ? '件' : 'defects'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '完了' : 'Completed'}</p>
          <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-1">{language === 'ja' ? '件' : 'reports'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs text-gray-500 font-semibold">{language === 'ja' ? '未完了' : 'Pending'}</p>
          <p className={`text-3xl font-bold ${pendingCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">{language === 'ja' ? '件レビュー中' : 'in review'}</p>
        </div>
      </div>

      {/* Per-Order Summary Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{language === 'ja' ? 'オーダー別進捗' : 'Progress by Order'}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '工番' : 'Job#'}</th>
                <th className="py-2 px-3 font-semibold">{language === 'ja' ? '製品' : 'Product'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '計画' : 'Plan'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '実績' : 'Actual'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '達成率' : 'Ach%'}</th>
                <th className="py-2 px-3 text-right font-semibold">{language === 'ja' ? '不具合' : 'Defects'}</th>
                <th className="py-2 px-3 text-center font-semibold">{language === 'ja' ? '状態' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const ach = o.totalPlan > 0 ? ((o.totalActual / o.totalPlan) * 100).toFixed(1) : '0';
                const dr = o.totalActual > 0 ? ((o.totalDefects / o.totalActual) * 100).toFixed(1) : '0';
                const pending = o.reports.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length;
                return (
                  <tr key={o.jobNumber} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(o.jobNumber)}>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{o.jobNumber}</td>
                    <td className="py-3 px-3">{o.product}</td>
                    <td className="py-3 px-3 text-right">{o.totalPlan}</td>
                    <td className="py-3 px-3 text-right font-semibold">{o.totalActual}</td>
                    <td className={`py-3 px-3 text-right font-bold ${parseFloat(ach) >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{ach}%</td>
                    <td className={`py-3 px-3 text-right ${parseFloat(dr) > 5 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{o.totalDefects} ({dr}%)</td>
                    <td className="py-3 px-3 text-center">
                      {pending > 0
                        ? <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{pending}{language === 'ja' ? '件未完了' : ' pending'}</span>
                        : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{language === 'ja' ? '完了' : 'Done'}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Reports needing Director attention */}
      {filteredReports.filter(r => r.status === 'DIR_REVIEWING').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-800 mb-4">{language === 'ja' ? '承認が必要な報告（Critical）' : 'Reports Requiring Approval (Critical)'}</h3>
          <div className="space-y-3">
            {filteredReports.filter(r => r.status === 'DIR_REVIEWING').map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div>
                  <p className="font-semibold text-gray-900">{r.operatorName} - {r.product}</p>
                  <p className="text-sm text-gray-600">{r.date} | {language === 'ja' ? '不具合率' : 'Defect'}: {r.defectRate.toFixed(1)}% | {r.jobNumber}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">DIR_REVIEWING</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REPORT LIST
// ============================================================================
const ReportList = ({ currentUser, language, reports, onViewReport }) => {
  const t = translations[language];
  const [filter, setFilter] = useState('all');
  const users = generateMockUsers();

  // Role-based visibility: operator=own, TL=team, others=all
  const visibleReports = reports.filter(r => {
    if (currentUser.role === 'operator') return r.operatorId === currentUser.id;
    if (currentUser.role === 'team_leader') return r.team === currentUser.team;
    return true; // SM, QA, Director, Maintenance see all
  });

  const filteredReports = visibleReports.filter(r => {
    if (filter === 'pending') return !['COMPLETED', 'REJECTED'].includes(r.status);
    if (filter === 'completed') return r.status === 'COMPLETED';
    if (filter === 'rejected') return r.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t.reports}</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          全て
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          待機中
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          完了
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">日付</th>
              <th className="px-4 py-3 text-left">作業者</th>
              <th className="px-4 py-3 text-left">{t.shift}</th>
              <th className="px-4 py-3 text-left">{t.product}</th>
              <th className="px-4 py-3 text-right">{t.actualQuantity}</th>
              <th className="px-4 py-3 text-right">{t.defectRate}</th>
              <th className="px-4 py-3 text-center">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.slice().reverse().map((report) => {
              const operator = users.find(u => u.id === report.operatorId);
              const statusColors = {
                'COMPLETED': 'bg-green-100 text-green-700',
                'TL_APPROVED': 'bg-blue-100 text-blue-700',
                'SM_REVIEWING': 'bg-orange-100 text-orange-700',
                'QA_REVIEWING': 'bg-purple-100 text-purple-700',
                'REJECTED': 'bg-red-100 text-red-700'
              };

              return (
                <tr key={report.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewReport && onViewReport(report)}>
                  <td className="px-4 py-3">{report.date}</td>
                  <td className="px-4 py-3">{operator?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{`Shift ${report.shift}`}</td>
                  <td className="px-4 py-3">{report.product}</td>
                  <td className="px-4 py-3 text-right font-bold">{report.actualQty}</td>
                  <td className={`px-4 py-3 text-right font-bold ${report.defectRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.defectRate.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[report.status] || 'bg-gray-100'}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// ANALYTICS PAGE
// ============================================================================
const AnalyticsPage = ({ language, reports }) => {
  const t = translations[language];
  const [dateRange, setDateRange] = useState('30');

  const generateTrendData = () => {
    const days = parseInt(dateRange);
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayReports = reports.filter(r => (typeof r.date === 'string' ? r.date : r.date.toISOString().split('T')[0]) === dateStr);
      const output = dayReports.reduce((sum, r) => sum + r.actualQty, 0);
      const defects = dayReports.reduce((sum, r) => sum + r.totalDefects, 0);
      const qty = dayReports.reduce((sum, r) => sum + r.actualQty, 0);
      const defectRate = qty > 0 ? ((defects / qty) * 100).toFixed(2) : 0;

      data.push({
        date: dateStr.slice(-5),
        output,
        defectRate: parseFloat(defectRate),
        reports: dayReports.length
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.analytics}</h2>
        <div className="flex gap-2">
          {['7', '30', '90', '365'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {['7d', '30d', '90d', '1y'][['7', '30', '90', '365'].indexOf(range)]}
            </button>
          ))}
        </div>
      </div>

      {/* Production Output */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">{t.outputChart}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="output" fill="#3b82f6" stroke="#1e40af" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Defect Trend */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">{t.defectTrend}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="defectRate" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS PAGE
// ============================================================================
const SettingsPage = ({ language }) => {
  const t = translations[language];
  const [settings, setSettings] = useState({
    defectThreshold: 5,
    varianceThreshold: 10,
    downtimeThreshold: 60,
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">{t.configuration}</h2>

      {/* Configurable Thresholds */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">{t.configurableThresholds}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.defectThreshold}
            </label>
            <input
              type="number"
              value={settings.defectThreshold}
              onChange={(e) => setSettings({...settings, defectThreshold: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.varianceThreshold}
            </label>
            <input
              type="number"
              value={settings.varianceThreshold}
              onChange={(e) => setSettings({...settings, varianceThreshold: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APPROVALS PAGE (role-specific filtering)
// ============================================================================
const ApprovalsPage = ({ currentUser, language, reports, onViewReport }) => {
  const users = generateMockUsers();

  // Each role only sees reports waiting for THEIR review
  // TL: SUBMITTED or TL_REVIEWING (team only)
  // SM: SM_REVIEWING
  // QA: QA_REVIEWING
  // Director: DIR_REVIEWING
  const getMyPendingReports = () => {
    switch (currentUser.role) {
      case 'team_leader':
        return reports.filter(r => {
          const op = users.find(u => u.id === r.operatorId);
          return (op?.team === currentUser.team) && ['SUBMITTED', 'TL_REVIEWING'].includes(r.status);
        });
      case 'section_manager':
        return reports.filter(r => r.status === 'SM_REVIEWING');
      case 'qa':
        return reports.filter(r => r.status === 'QA_REVIEWING');
      case 'director':
        return reports.filter(r => r.status === 'DIR_REVIEWING');
      default:
        return [];
    }
  };

  const pendingReports = getMyPendingReports().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const roleLabel = language === 'ja' ? {
    'team_leader': '班長',
    'section_manager': '課長',
    'qa': '品質管理',
    'director': '工場長'
  } : {
    'team_leader': 'Team Leader',
    'section_manager': 'Section Manager',
    'qa': 'QA',
    'director': 'Director'
  };

  const stColors = {
    'SUBMITTED': 'bg-blue-100 text-blue-700',
    'TL_REVIEWING': 'bg-yellow-100 text-yellow-700',
    'QA_REVIEWING': 'bg-purple-100 text-purple-700',
    'SM_REVIEWING': 'bg-orange-100 text-orange-700',
    'DIR_REVIEWING': 'bg-red-100 text-red-700',
  };
  const stLabels = language === 'ja' ? {
    'SUBMITTED': '提出済', 'TL_REVIEWING': '班長確認中',
    'QA_REVIEWING': 'QA確認中', 'SM_REVIEWING': '課長確認中',
    'DIR_REVIEWING': '工場長確認中',
  } : {};

  const severityLabel = (sev) => {
    if (language === 'ja') return sev === 'critical' ? '致命的' : sev === 'major' ? '重大' : '軽微';
    return sev;
  };
  const severityColor = (sev) => sev === 'critical' ? 'bg-red-600 text-white' : sev === 'major' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-yellow-900';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{language === 'ja' ? '承認待ち' : 'Pending Approvals'}</h2>
        <span className="text-sm text-gray-500">{roleLabel[currentUser.role] || currentUser.role}</span>
      </div>

      {pendingReports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <p className="text-lg font-semibold text-gray-600">{language === 'ja' ? '承認待ちの報告はありません' : 'No pending approvals'}</p>
          <p className="text-sm text-gray-400 mt-1">{language === 'ja' ? 'すべて完了しています' : 'All caught up!'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{pendingReports.length} {language === 'ja' ? '件の承認待ち' : 'reports pending'}</p>
          {pendingReports.map(r => {
            const operator = users.find(u => u.id === r.operatorId);
            return (
              <div key={r.id} onClick={() => onViewReport && onViewReport(r)}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer border-l-4 border-yellow-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      {(operator?.name || '?').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{operator?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{r.date} | Shift {r.shift} | {r.machine}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${stColors[r.status] || 'bg-gray-100'}`}>
                    {stLabels[r.status] || r.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ja' ? '製品' : 'Product'}</p>
                    <p className="text-sm font-semibold">{r.product}</p>
                    <p className="text-xs text-gray-400">{r.jobNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ja' ? '実績/計画' : 'Actual/Plan'}</p>
                    <p className="text-sm font-bold">{r.actualQty} / {r.planQty}</p>
                    <p className={`text-xs font-semibold ${r.achievement >= 95 ? 'text-green-600' : 'text-orange-600'}`}>{r.achievement}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ja' ? '不具合' : 'Defects'}</p>
                    <p className={`text-sm font-bold ${r.totalDefects > 0 ? 'text-red-600' : 'text-green-600'}`}>{r.totalDefects}</p>
                    <p className="text-xs text-gray-400">{r.defectRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ja' ? '重大度' : 'Severity'}</p>
                    {r.totalDefects > 0 ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-0.5 ${severityColor(r.maxSeverity)}`}>
                        {severityLabel(r.maxSeverity)}
                      </span>
                    ) : (
                      <p className="text-sm text-green-600 font-semibold">{language === 'ja' ? 'なし' : 'None'}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REPORT DETAIL SCREEN
// ============================================================================
const ReportDetailScreen = ({ report, currentUser, language, onBack, onUpdateReport, onDeleteReport, onViewReport }) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [starRating, setStarRating] = useState(report?.rating || 0);
  const [choreiMarked, setChoreiMarked] = useState(report?.choreiMarked || false);

  if (!report) return <div className="text-center py-20 text-gray-400">{language === "ja" ? "レポートが見つかりません" : "Report not found"}</div>;

  const t = translations[language];
  const users = generateMockUsers();
  const operator = users.find(u => u.id === report.operatorId);

  const canReview = (currentUser.role === "team_leader")
    || (currentUser.role === "section_manager")
    || (currentUser.role === "qa")
    || (currentUser.role === "director");

  const statusColors = {
    'COMPLETED': 'bg-green-100 text-green-700',
    'TL_APPROVED': 'bg-blue-100 text-blue-700',
    'SM_REVIEWING': 'bg-orange-100 text-orange-700',
    'QA_REVIEWING': 'bg-purple-100 text-purple-700',
    'REJECTED': 'bg-red-100 text-red-700'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 font-semibold text-lg">← {language === "ja" ? "戻る" : "Back"}</button>
        <span className={`px-4 py-2 rounded-full font-bold ${statusColors[report.status] || "bg-gray-100"}`}>{report.status}</span>
      </div>

      {/* Delete button for operator's own DRAFT reports */}
      {currentUser.role === 'operator' && report.operatorId === currentUser.id && report.status === 'DRAFT' && (
        <div className="flex justify-end">
          <button onClick={() => { if (window.confirm(language === 'ja' ? 'この日報を削除しますか？' : 'Delete this report?')) { onDeleteReport && onDeleteReport(report.id); } }}
            className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-semibold">
            <Trash2 size={16} /> {language === 'ja' ? '削除' : 'Delete'}
          </button>
        </div>
      )}

      {/* Report Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-4 gap-4">
          <div><span className="text-xs text-gray-500">{language === "ja" ? "日付" : "Date"}</span><p className="font-bold">{report.date}</p></div>
          <div><span className="text-xs text-gray-500">{language === "ja" ? "作業者" : "Operator"}</span><p className="font-bold">{operator?.name || "N/A"}</p></div>
          <div><span className="text-xs text-gray-500">{language === "ja" ? "シフト" : "Shift"}</span><p className="font-bold">{`Shift ${report.shift}`}</p></div>
          <div><span className="text-xs text-gray-500">{language === "ja" ? "製品" : "Product"}</span><p className="font-bold">{report.product}</p></div>
        </div>
      </div>

      {/* Production Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">{language === "ja" ? "生産実績" : "Production Results"}</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{report.actualQty}</p>
            <p className="text-xs text-gray-500">{language === "ja" ? "実績" : "Actual"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700">{report.planQty}</p>
            <p className="text-xs text-gray-500">{language === "ja" ? "計画" : "Plan"}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${((report.actualQty / report.planQty) * 100) >= 100 ? "bg-green-50" : "bg-orange-50"}`}>
            <p className={`text-2xl font-bold ${((report.actualQty / report.planQty) * 100) >= 100 ? "text-green-700" : "text-orange-700"}`}>{((report.actualQty / report.planQty) * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500">{language === "ja" ? "達成率" : "Achievement"}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${report.defectRate > 5 ? "bg-red-50" : "bg-green-50"}`}>
            <p className={`text-2xl font-bold ${report.defectRate > 5 ? "text-red-700" : "text-green-700"}`}>{report.defectRate.toFixed(2)}%</p>
            <p className="text-xs text-gray-500">{language === "ja" ? "不具合率" : "Defect Rate"}</p>
          </div>
        </div>
        {/* Hours */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-semibold">{language === "ja" ? "通常勤務" : "Regular"}: {report.hours?.regular || 7.5}h</p>
          </div>
          <div className={`p-3 rounded-lg ${(report.hours?.overtime || 0) > 0 ? "bg-orange-50" : "bg-gray-50"}`}>
            <p className="text-sm font-semibold">{language === "ja" ? "残業" : "OT"}: {report.hours?.overtime || 0}h</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-semibold">{language === "ja" ? "合計" : "Total"}: {((report.hours?.regular || 7.5) + (report.hours?.overtime || 0)).toFixed(1)}h</p>
          </div>
        </div>
      </div>

      {/* Defects */}
      {report.totalDefects > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4 text-red-700">⚠️ {language === "ja" ? "不具合詳細" : "Defect Details"} ({report.totalDefects})</h3>
          {(report.defects || []).map((d, i) => (
            <div key={i} className="border border-red-200 rounded-lg p-4 mb-3 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">#{i + 1} {defectTypes.find(dt => dt.code === d.type)?.name_ja || d.type}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.severity === "critical" ? "bg-red-600 text-white" : d.severity === "major" ? "bg-orange-500 text-white" : "bg-yellow-400 text-yellow-900"}`}>
                  {d.severity === "minor" ? "軽微" : d.severity === "major" ? "重大" : "致命的"}
                </span>
              </div>
              <p className="text-sm">{language === "ja" ? "数量" : "Count"}: <span className="font-bold">{d.count}</span></p>
              <p className="text-sm mt-2">{d.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notes Section */}
      {report.notes && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">📝 {language === "ja" ? "コメント" : "Notes"}</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm">{report.notes}</p>
          </div>
        </div>
      )}

      {/* Evaluation Section */}
      {(canReview || report.rating) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">⭐ {language === "ja" ? "評価" : "Evaluation"}</h3>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => canReview && setStarRating(star)}
                className={`text-3xl transition ${star <= starRating ? "text-yellow-400" : "text-gray-300"} ${canReview ? "cursor-pointer hover:text-yellow-300" : ""}`}>
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{starRating}/5</span>
          </div>
        </div>
      )}

      {/* Review Actions */}
      {canReview && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg">{language === "ja" ? "レビューアクション" : "Review Actions"}</h3>

          {/* Comment */}
          <div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              className="w-full border rounded-lg p-3" rows={2} placeholder={language === "ja" ? "コメントを追加..." : "Add comment..."} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => {
              // Determine next status based on current role and route type
              let nextStatus = 'COMPLETED';
              if (currentUser.role === 'team_leader') {
                if (report.routeType === 'major') nextStatus = 'QA_REVIEWING';
                else if (report.routeType === 'critical') nextStatus = 'SM_REVIEWING';
                else nextStatus = 'COMPLETED';
              } else if (currentUser.role === 'section_manager') {
                nextStatus = 'QA_REVIEWING';
              } else if (currentUser.role === 'qa') {
                if (report.routeType === 'critical') nextStatus = 'DIR_REVIEWING';
                else nextStatus = 'COMPLETED';
              } else if (currentUser.role === 'director') {
                nextStatus = 'COMPLETED';
              }
              onUpdateReport && onUpdateReport(report.id, { status: nextStatus, evaluation: { stars: starRating || 5, comment: comment || '承認済み' } });
              onBack();
            }}
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition">
              ✓ {language === "ja" ? "承認" : "Approve"}
            </button>
            <button onClick={() => setShowRejectDialog(true)}
              className="px-6 bg-red-100 text-red-700 py-4 rounded-xl font-bold text-lg hover:bg-red-200 transition">
              ✕ {language === "ja" ? "差戻し" : "Reject"}
            </button>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-700 mb-2">{language === "ja" ? "差戻し確認" : "Confirm Reject"}</h3>
            <label className="block text-sm font-semibold mb-2">{language === "ja" ? "差戻し理由 (必須)" : "Reject Reason (Required)"} *</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-red-300 rounded-lg p-3 mb-4" rows={3}
              placeholder={language === "ja" ? "差戻しの理由を詳しく入力..." : "Enter detailed rejection reason..."} />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectDialog(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold">{language === "ja" ? "キャンセル" : "Cancel"}</button>
              <button onClick={() => { setShowRejectDialog(false); onUpdateReport && onUpdateReport(report.id, { status: 'REJECTED', rejectReason }); onBack(); }}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">{language === "ja" ? "差戻しする" : "Reject"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REPORT CREATION FORM
// ============================================================================
const ReportCreationForm = ({ currentUser, language, onBack, onSave, isNavMode }) => {
  const t = translations[language];
  const productOptions = [
    { name: 'フランジ加工品', jobNum: 'J2025-001', planQty: 120 },
    { name: 'シャフト部品', jobNum: 'J2025-002', planQty: 80 },
    { name: 'ギアケース', jobNum: 'J2025-003', planQty: 60 },
    { name: 'ベアリングハウジング', jobNum: 'J2025-004', planQty: 100 },
    { name: 'バルブボディ', jobNum: 'J2025-005', planQty: 150 },
    { name: 'ポンプインペラ', jobNum: 'J2025-006', planQty: 40 },
    { name: 'クランクシャフト', jobNum: 'J2025-007', planQty: 90 },
    { name: 'シリンダーヘッド', jobNum: 'J2025-008', planQty: 200 },
  ];
  const machines = ['CNC-001', 'CNC-002', 'CNC-003', 'CNC-004', 'CNC-005'];

  const [selectedProduct, setSelectedProduct] = useState(productOptions[0]);
  const [formData, setFormData] = useState({
    date: '2026-04-03',
    shift: 'A',
    machine: machines[0],
    planQty: productOptions[0].planQty,
    actualQty: productOptions[0].planQty, // Default = plan (FR-RPT-001)
    notes: '',
    defects: [],
    hours: { regular: 7.5, overtime: 0 },
    narratives: { target: '', results: '', improvement: '', tomorrow: '' }
  });
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  // Modal selector states
  const [modalOpen, setModalOpen] = useState(null); // 'shift' | 'machine' | 'product' | 'defectType-{id}' | 'rootCause-{id}' | 'countermeasure-{id}'

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProductChange = (idx) => {
    const p = productOptions[idx];
    setSelectedProduct(p);
    setFormData({ ...formData, planQty: p.planQty, actualQty: p.planQty });
  };

  const adjustQty = (delta) => {
    const newVal = Math.max(0, formData.actualQty + delta);
    setFormData({ ...formData, actualQty: newVal });
  };

  const achievementRate = formData.planQty > 0 ? ((formData.actualQty / formData.planQty) * 100) : 0;
  const totalDefects = formData.defects.reduce((s, d) => s + (d.count || 0), 0);
  const defectRateCalc = formData.actualQty > 0 ? ((totalDefects / formData.actualQty) * 100) : 0;

  const buildAndSaveReport = (status) => {
    const maxSev = formData.defects.reduce((max, d) => {
      if (d.severity === 'critical') return 'critical';
      if (d.severity === 'major' && max !== 'critical') return 'major';
      return max;
    }, 'minor');
    const defRate = formData.actualQty > 0 ? ((totalDefects / formData.actualQty) * 100) : 0;
    let routeType = 'normal';
    if (maxSev === 'critical' || defRate > 10) routeType = 'critical';
    else if (maxSev === 'major' || (defRate >= 5 && defRate <= 10)) routeType = 'major';

    const newReport = {
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      date: formData.date,
      shift: formData.shift,
      machine: formData.machine,
      product: selectedProduct.name,
      jobNumber: selectedProduct.jobNum,
      planQty: formData.planQty,
      actualQty: formData.actualQty,
      achievement: Math.round((formData.actualQty / formData.planQty) * 100),
      achievementRate: ((formData.actualQty / formData.planQty) * 100).toFixed(1),
      defectRate: +defRate.toFixed(2),
      totalDefects,
      maxSeverity: maxSev,
      routeType,
      variance: +((formData.actualQty - formData.planQty) / formData.planQty * 100).toFixed(1),
      status,
      hours: formData.hours,
      defects: formData.defects,
      narratives: formData.narratives,
      evaluation: null,
      notes: formData.notes || '',
      createdAt: formData.date,
      submittedAt: status === 'SUBMITTED' ? formData.date : null,
      team: currentUser.team
    };
    onSave(newReport);
  };

  const addDefect = () => {
    setFormData({
      ...formData,
      defects: [...formData.defects, {
        id: Date.now(),
        type: 'D01',
        severity: 'minor',
        count: 1,
        description: '',
        rootCause: '',
        countermeasure: ''
      }]
    });
  };

  const removeDefect = (id) => {
    setFormData({ ...formData, defects: formData.defects.filter(d => d.id !== id) });
  };

  const updateDefect = (id, field, value) => {
    setFormData({ ...formData, defects: formData.defects.map(d => d.id === id ? { ...d, [field]: value } : d) });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-24">
      {/* Sticky Top Action Bar — transitions into nav bar on scroll */}
      <div className={`sticky top-0 z-30 -mx-4 px-4 md:-mx-6 md:px-6 flex items-center justify-between gap-3 transition-all duration-300 ease-in-out ${
        isNavMode
          ? 'bg-gray-900 text-white py-2.5 shadow-lg'
          : 'bg-white border-b shadow-sm py-3'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            isNavMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}>
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-0">
            <h2 className={`font-bold truncate transition-all duration-300 ${isNavMode ? 'text-base text-white' : 'text-lg text-gray-900'}`}>
              {language === "ja" ? "日報作成" : "Create Report"}
            </h2>
            {isNavMode && (
              <p className="text-xs text-gray-400 truncate">{currentUser.name} · {formData.date}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => { buildAndSaveReport('DRAFT'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
              isNavMode
                ? 'bg-gray-700 text-blue-300 border border-gray-600 hover:bg-gray-600'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}>
            <Save size={16} /> {language === "ja" ? "下書き保存" : "Save Draft"}
          </button>
          <button onClick={() => setShowSubmitDialog(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm shadow-sm ${
              isNavMode
                ? 'bg-green-500 text-white hover:bg-green-400'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
            <Send size={16} /> {language === "ja" ? "提出する" : "Submit"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3 text-gray-700">{language === "ja" ? "基本情報" : "Basic Info"}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "日付" : "Date"}</label>
            <input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)}
              className="w-full border rounded-lg p-3 text-base font-semibold" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "シフト" : "Shift"}</label>
            <button onClick={() => setModalOpen('shift')}
              className="w-full border-2 rounded-lg p-3 text-base font-bold text-left bg-white hover:bg-blue-50 transition">
              {language === 'ja' ? `${formData.shift}班` : `Shift ${formData.shift}`} <ChevronDown size={14} className="inline float-right mt-1 text-gray-400" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "機械" : "Machine"}</label>
            <button onClick={() => setModalOpen('machine')}
              className="w-full border-2 rounded-lg p-3 text-base font-bold text-left bg-white hover:bg-blue-50 transition">
              {formData.machine} <ChevronDown size={14} className="inline float-right mt-1 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "製品（工番）" : "Product (Job#)"}</label>
          <button onClick={() => setModalOpen('product')}
            className="w-full border-2 rounded-lg p-3 text-base font-bold text-left bg-white hover:bg-blue-50 transition">
            {selectedProduct.jobNum} - {selectedProduct.name}
            <span className="block text-xs text-gray-500 font-normal mt-0.5">{language === 'ja' ? `計画: ${selectedProduct.planQty}個` : `Plan: ${selectedProduct.planQty}`}</span>
          </button>
        </div>
      </div>

      {/* Modal selectors for basic info */}
      <ModalSelect isOpen={modalOpen === 'shift'}
        onClose={() => setModalOpen(null)}
        title={language === 'ja' ? 'シフト選択' : 'Select Shift'}
        value={formData.shift}
        onChange={v => handleInputChange('shift', v)}
        options={[
          { value: 'A', label: language === 'ja' ? 'A班 (早番)' : 'Shift A (Morning)' },
          { value: 'B', label: language === 'ja' ? 'B班 (遅番)' : 'Shift B (Afternoon)' },
          { value: 'C', label: language === 'ja' ? 'C班 (夜勤)' : 'Shift C (Night)' },
        ]}
      />
      <ModalSelect isOpen={modalOpen === 'machine'}
        onClose={() => setModalOpen(null)}
        title={language === 'ja' ? '機械選択' : 'Select Machine'}
        value={formData.machine}
        onChange={v => handleInputChange('machine', v)}
        options={machines.map(m => ({ value: m, label: m }))}
      />
      <ModalSelect isOpen={modalOpen === 'product'}
        onClose={() => setModalOpen(null)}
        title={language === 'ja' ? '製品選択' : 'Select Product'}
        value={productOptions.indexOf(selectedProduct)}
        onChange={v => handleProductChange(v)}
        options={productOptions.map((p, i) => ({ value: i, label: `${p.jobNum} - ${p.name}`, sub: language === 'ja' ? `計画: ${p.planQty}個` : `Plan: ${p.planQty}` }))}
      />

      {/* Production Quantity with +/- buttons */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3 text-gray-700">{language === "ja" ? "生産数量" : "Quantity"}</h3>
        <div className="flex items-center justify-center gap-2 mb-3">
          <button onClick={() => adjustQty(-5)} className="w-12 h-12 bg-red-100 text-red-600 rounded-lg font-bold text-lg hover:bg-red-200">-5</button>
          <button onClick={() => adjustQty(-1)} className="w-10 h-12 bg-red-50 text-red-500 rounded-lg font-bold hover:bg-red-100">-</button>
          <input type="number" value={formData.actualQty} onChange={e => handleInputChange('actualQty', parseInt(e.target.value) || 0)}
            className="w-24 text-center border-2 rounded-xl p-2 text-2xl font-bold" />
          <button onClick={() => adjustQty(1)} className="w-10 h-12 bg-green-50 text-green-500 rounded-lg font-bold hover:bg-green-100">+</button>
          <button onClick={() => adjustQty(5)} className="w-12 h-12 bg-green-100 text-green-600 rounded-lg font-bold text-lg hover:bg-green-200">+5</button>
        </div>
        <div className="flex justify-between text-sm px-2">
          <span className="text-gray-500">{language === "ja" ? "計画" : "Plan"}: {formData.planQty}</span>
          <span className={`font-bold ${achievementRate >= 100 ? 'text-green-600' : achievementRate >= 88 ? 'text-blue-600' : 'text-orange-600'}`}>
            {language === "ja" ? "達成率" : "Ach"}: {achievementRate.toFixed(1)}%
          </span>
        </div>
        {achievementRate > 120 && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-xs text-yellow-800 font-semibold">
            ⚠️ {language === "ja" ? "実績が計画の120%を超えています。確認してください。" : "Actual exceeds 120% of plan. Please verify."}
          </div>
        )}
      </div>

      {/* Work Hours */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3 text-gray-700">{language === "ja" ? "勤務時間" : "Hours"}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "通常 (h)" : "Regular (h)"}</label>
            <input type="number" value={formData.hours.regular} step="0.5" onChange={e => setFormData({ ...formData, hours: { ...formData.hours, regular: parseFloat(e.target.value) || 0 } })}
              className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "残業 (h)" : "OT (h)"}</label>
            <input type="number" value={formData.hours.overtime} step="0.5" max="4" onChange={e => setFormData({ ...formData, hours: { ...formData.hours, overtime: Math.min(4, parseFloat(e.target.value) || 0) } })}
              className="w-full border rounded-lg p-2 text-sm" />
            {formData.hours.overtime > 0 && <p className="text-xs text-orange-600 mt-1">{language === "ja" ? "36協定: 上限4h/日, 45h/月" : "36 Agreement: Max 4h/day, 45h/month"}</p>}
          </div>
        </div>
      </div>

      {/* Defects with Root Cause & Countermeasure */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700">{language === "ja" ? "不具合報告" : "Defects"}</h3>
          <button onClick={addDefect} className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm font-semibold">
            <Plus size={16} /> {language === "ja" ? "追加" : "Add"}
          </button>
        </div>

        {formData.defects.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{language === "ja" ? "不具合なし" : "No defects"}</p>
        )}

        {formData.defects.map((d, idx) => (
          <div key={d.id} className="border rounded-lg p-4 mb-3 bg-red-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-red-700 text-sm">#{idx + 1}</span>
              <button onClick={() => removeDefect(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>

            {/* Defect Type - modal */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "種類" : "Type"}</label>
              <button onClick={() => setModalOpen(`defectType-${d.id}`)}
                className="w-full border-2 rounded-lg p-3 text-sm font-semibold text-left bg-white hover:bg-gray-50 transition">
                {d.type}: {defectTypes.find(dt => dt.code === d.type)?.name_ja || d.type}
                <ChevronDown size={14} className="inline float-right mt-0.5 text-gray-400" />
              </button>
              <ModalSelect isOpen={modalOpen === `defectType-${d.id}`}
                onClose={() => setModalOpen(null)}
                title={language === 'ja' ? '不具合の種類' : 'Defect Type'}
                value={d.type}
                onChange={v => updateDefect(d.id, 'type', v)}
                options={defectTypes.map(dt => ({ value: dt.code, label: `${dt.code}: ${language === 'ja' ? dt.name_ja : dt.name_en}` }))}
              />
            </div>

            {/* Severity toggle + Count */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "重大度" : "Severity"}</label>
                <div className="flex gap-1">
                  {['minor', 'major', 'critical'].map(s => (
                    <button key={s} onClick={() => updateDefect(d.id, 'severity', s)}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition active:scale-95 ${d.severity === s
                        ? (s === 'minor' ? 'bg-yellow-400 text-white' : s === 'major' ? 'bg-orange-500 text-white' : 'bg-red-600 text-white')
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {s === 'minor' ? (language === 'ja' ? '軽微' : 'Min') : s === 'major' ? (language === 'ja' ? '重大' : 'Maj') : (language === 'ja' ? '致命' : 'Crit')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "数量" : "Count"}</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateDefect(d.id, 'count', Math.max(1, d.count - 1))} className="w-10 h-10 bg-gray-100 rounded-lg font-bold text-gray-600 hover:bg-gray-200">-</button>
                  <input type="number" value={d.count} min="1" onChange={e => updateDefect(d.id, 'count', Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 border-2 rounded-lg p-2 text-lg text-center font-bold" />
                  <button onClick={() => updateDefect(d.id, 'count', d.count + 1)} className="w-10 h-10 bg-gray-100 rounded-lg font-bold text-gray-600 hover:bg-gray-200">+</button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "説明" : "Description"}</label>
              <input type="text" value={d.description} onChange={e => updateDefect(d.id, 'description', e.target.value)}
                className="w-full border rounded-lg p-3 text-sm" placeholder={language === "ja" ? "不具合の詳細..." : "Defect details..."} />
            </div>

            {/* Root Cause (原因) - modal */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "原因 (4M分析)" : "Root Cause (4M)"}</label>
              <button onClick={() => setModalOpen(`rootCause-${d.id}`)}
                className={`w-full border-2 rounded-lg p-3 text-sm font-semibold text-left transition ${
                  !d.rootCause ? 'border-orange-300 bg-orange-50 hover:bg-orange-100' : 'bg-white hover:bg-gray-50'
                }`}>
                {d.rootCause
                  ? `${d.rootCause}: ${rootCauses.find(rc => rc.code === d.rootCause)?.name_ja || ''} (${rootCauses.find(rc => rc.code === d.rootCause)?.category || ''})`
                  : (language === 'ja' ? '🔍 原因を選択してください' : '🔍 Select cause')
                }
                <ChevronDown size={14} className="inline float-right mt-0.5 text-gray-400" />
              </button>
              {!d.rootCause && <p className="text-xs text-orange-600 mt-0.5">{language === "ja" ? "原因の入力が必要です" : "Cause is required"}</p>}
              <ModalSelect isOpen={modalOpen === `rootCause-${d.id}`}
                onClose={() => setModalOpen(null)}
                title={language === 'ja' ? '原因 (4M分析)' : 'Root Cause (4M)'}
                value={d.rootCause}
                onChange={v => updateDefect(d.id, 'rootCause', v)}
                options={[
                  { value: '', label: language === 'ja' ? '-- 未選択 --' : '-- None --' },
                  ...rootCauses.map(rc => ({ value: rc.code, label: `${rc.name_ja}`, sub: `${rc.category} | ${rc.code}` }))
                ]}
              />
            </div>

            {/* Countermeasure (対策) - modal */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{language === "ja" ? "対策" : "Countermeasure"}</label>
              <button onClick={() => setModalOpen(`countermeasure-${d.id}`)}
                className={`w-full border-2 rounded-lg p-3 text-sm font-semibold text-left transition ${
                  !d.countermeasure ? 'border-orange-300 bg-orange-50 hover:bg-orange-100' : 'bg-white hover:bg-gray-50'
                }`}>
                {d.countermeasure
                  ? `${d.countermeasure}: ${countermeasures.find(cm => cm.code === d.countermeasure)?.name_ja || ''}`
                  : (language === 'ja' ? '🔧 対策を選択してください' : '🔧 Select countermeasure')
                }
                <ChevronDown size={14} className="inline float-right mt-0.5 text-gray-400" />
              </button>
              {!d.countermeasure && <p className="text-xs text-orange-600 mt-0.5">{language === "ja" ? "対策の入力が必要です" : "Countermeasure is required"}</p>}
              <ModalSelect isOpen={modalOpen === `countermeasure-${d.id}`}
                onClose={() => setModalOpen(null)}
                title={language === 'ja' ? '対策選択' : 'Countermeasure'}
                value={d.countermeasure}
                onChange={v => updateDefect(d.id, 'countermeasure', v)}
                options={[
                  { value: '', label: language === 'ja' ? '-- 未選択 --' : '-- None --' },
                  ...countermeasures.map(cm => ({ value: cm.code, label: cm.name_ja, sub: cm.code }))
                ]}
              />
            </div>
          </div>
        ))}

        {totalDefects > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
            <span className="font-semibold">{language === "ja" ? "合計不具合" : "Total defects"}: {totalDefects}</span>
            <span className="ml-4 text-gray-500">{language === "ja" ? "不具合率" : "Rate"}: {defectRateCalc.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Narratives */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3 text-gray-700">{language === "ja" ? "作業記録" : "Work Record"}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "作業目標" : "Work Target"}</label>
            <input type="text" value={formData.narratives.target} onChange={e => setFormData({ ...formData, narratives: { ...formData.narratives, target: e.target.value } })}
              className="w-full border rounded-lg p-2 text-sm" placeholder={language === "ja" ? "本日の目標..." : "Today's target..."} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "作業結果" : "Results"}</label>
            <input type="text" value={formData.narratives.results} onChange={e => setFormData({ ...formData, narratives: { ...formData.narratives, results: e.target.value } })}
              className="w-full border rounded-lg p-2 text-sm" placeholder={language === "ja" ? "結果..." : "Results..."} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "改善点" : "Improvement"}</label>
            <input type="text" value={formData.narratives.improvement} onChange={e => setFormData({ ...formData, narratives: { ...formData.narratives, improvement: e.target.value } })}
              className="w-full border rounded-lg p-2 text-sm" placeholder={language === "ja" ? "改善点..." : "Improvements..."} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{language === "ja" ? "明日の予定" : "Tomorrow Plan"}</label>
            <input type="text" value={formData.narratives.tomorrow} onChange={e => setFormData({ ...formData, narratives: { ...formData.narratives, tomorrow: e.target.value } })}
              className="w-full border rounded-lg p-2 text-sm" placeholder={language === "ja" ? "明日の予定..." : "Tomorrow's plan..."} />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (mirrors top for convenience at end of long form) */}
      <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <button onClick={onBack} className="flex-1 bg-white text-gray-600 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 text-sm">
          {language === "ja" ? "キャンセル" : "Cancel"}
        </button>
        <button onClick={() => { buildAndSaveReport('DRAFT'); }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-lg font-semibold hover:bg-blue-100 text-sm">
          <Save size={16} /> {language === "ja" ? "下書き保存" : "Save Draft"}
        </button>
        <button onClick={() => setShowSubmitDialog(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm shadow-sm">
          <Send size={16} /> {language === "ja" ? "提出する" : "Submit"}
        </button>
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{language === "ja" ? "日報を提出しますか？" : "Submit Report?"}</h3>
            <div className="bg-blue-50 p-3 rounded-lg mb-3 text-sm text-blue-800">
              {language === "ja" ? "提出後は班長による承認が必要になります。" : "After submission, team leader approval is required."}
            </div>
            {formData.defects.some(d => !d.rootCause || !d.countermeasure) && (
              <div className="bg-orange-50 p-3 rounded-lg mb-3 text-sm text-orange-800 border border-orange-200">
                ⚠️ {language === "ja" ? "不具合の原因・対策が未入力の項目があります。" : "Some defects are missing root cause or countermeasure."}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitDialog(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold">{language === "ja" ? "キャンセル" : "Cancel"}</button>
              <button onClick={() => { setShowSubmitDialog(false); buildAndSaveReport('SUBMITTED'); }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold">{language === "ja" ? "提出する" : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('ja');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const mainRef = React.useRef(null);

  const [reports, setReports] = useState(generateMockReports());
  const [users] = useState(generateMockUsers());

  const t = translations[language];

  // Hide header on scroll when in report creation form
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;
    const handleScroll = () => {
      if (currentPage === 'new-report') {
        setHeaderHidden(mainEl.scrollTop > 30);
      } else {
        setHeaderHidden(false);
      }
    };
    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleLogin = (user, lang) => {
    setCurrentUser(user);
    setLanguage(lang);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setHeaderHidden(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  // CRUD: Add new report
  const handleAddReport = (newReport) => {
    const maxId = reports.reduce((max, r) => Math.max(max, r.id), 0);
    const report = { ...newReport, id: maxId + 1 };
    setReports(prev => [...prev, report]);
  };

  // CRUD: Update report (edit fields or status change)
  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updates } : r));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => ({ ...prev, ...updates }));
    }
  };

  // CRUD: Delete report
  const handleDeleteReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
      setCurrentPage('reports');
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - collapsible on desktop, overlay on mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        language={language}
        activePage={currentPage}
      />

      {/* Right side: header + content */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header — slides up when scrolling in report form */}
        <header className={`bg-white shadow-sm flex-shrink-0 z-20 transition-all duration-300 ease-in-out overflow-hidden ${headerHidden ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 flex-1 ml-2">{t.appTitle}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">{currentUser.name} ({t[currentUser.role]})</span>
              <button onClick={handleLanguageToggle} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Globe size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main ref={mainRef} className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {currentPage === 'dashboard' && currentUser.role === 'operator' && (
          <OperatorDashboard currentUser={currentUser} language={language} reports={reports} />
        )}
        {currentPage === 'dashboard' && currentUser.role === 'team_leader' && (
          <TeamLeaderDashboard currentUser={currentUser} language={language} reports={reports} users={users} onNavigate={handleNavigate} />
        )}
        {currentPage === 'dashboard' && currentUser.role === 'section_manager' && (
          <SectionManagerDashboard currentUser={currentUser} language={language} reports={reports} />
        )}
        {currentPage === 'dashboard' && currentUser.role === 'qa' && (
          <QADashboard currentUser={currentUser} language={language} reports={reports} />
        )}
        {currentPage === 'dashboard' && currentUser.role === 'maintenance_lead' && (
          <MaintenanceLeadDashboard currentUser={currentUser} language={language} reports={reports} />
        )}
        {currentPage === 'dashboard' && currentUser.role === 'director' && (
          <DirectorDashboard currentUser={currentUser} language={language} reports={reports} />
        )}

        {currentPage === 'reports' && (
          <ReportList currentUser={currentUser} language={language} reports={reports} onViewReport={(report) => { setSelectedReport(report); setCurrentPage('report-detail'); }} />
        )}

        {currentPage === 'new-report' && (
          <ReportCreationForm currentUser={currentUser} language={language}
            onBack={() => { setCurrentPage('dashboard'); setHeaderHidden(false); }}
            onSave={(newReport) => { handleAddReport(newReport); setCurrentPage('dashboard'); setHeaderHidden(false); }}
            isNavMode={headerHidden} />
        )}

        {currentPage === 'report-detail' && (
          <ReportDetailScreen report={selectedReport} currentUser={currentUser} language={language}
            onBack={() => setCurrentPage('reports')}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            onViewReport={() => {}} />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage language={language} reports={reports} />
        )}

        {currentPage === 'settings' && (
          <SettingsPage language={language} />
        )}

        {currentPage === 'approvals' && (
          <ApprovalsPage currentUser={currentUser} language={language} reports={reports} onViewReport={(report) => { setSelectedReport(report); setCurrentPage('report-detail'); }} />
        )}
        </main>
      </div>
    </div>
  );
};

export default App;
