import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Menu, X, LogOut, Globe, Plus, Download, Edit2, Check, AlertCircle,
  TrendingUp, Users, Clock, AlertTriangle, ChevronDown, ChevronRight,
  Home, FileText, UserCheck, BarChart3, Settings, Lock, Unlock,
  Calendar, Filter, Search, Star, MessageCircle, Eye, MoreHorizontal,
  ArrowRight, ArrowUp, ArrowDown, Zap, Target, TrendingDown,
  CheckCircle, XCircle, Clock3, HelpCircle, PlusCircle, MinusCircle,
  SkipBack, ChevronLeft, ChevronRightIcon, Trash2, Save, Send,
  AlertOctagon, Info, Percent, Activity, Clock4, Briefcase, Wrench,
  ChevronUp, Copy, Trash
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts';

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR & UTILITY FUNCTIONS
// ============================================================================
const createSeededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// Calculate hours between time strings (HH:MM format)
const calcHours = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, ((eh * 60 + em) - (sh * 60 + sm)) / 60);
};

// Get report summary calculated from entries
const getReportSummary = (report) => {
  const entries = report.entries || [];
  const totalPlan = entries.reduce((s, e) => s + (e.planQty || 0), 0);
  const totalActual = entries.reduce((s, e) => s + (e.actualQty || 0), 0);
  const totalDefectsCount = entries.reduce((s, e) => {
    return s + (e.defects || []).reduce((ds, d) => ds + (d.count || 0), 0);
  }, 0);
  const defectRate = totalActual > 0 ? ((totalDefectsCount / totalActual) * 100) : 0;
  const achievement = totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0;
  return {
    totalPlan,
    totalActual,
    totalDefects: totalDefectsCount,
    defectRate: +defectRate.toFixed(2),
    achievement
  };
};

// Order targets for cumulative tracking (contract-level totals for full factory)
const orderTargets = {
  'J2025-001': { product: 'フランジ加工品', totalQty: 5000, deadline: '2026-04-15' },
  'J2025-002': { product: 'シャフト部品', totalQty: 3500, deadline: '2026-04-20' },
  'J2025-003': { product: 'ギアケース', totalQty: 2800, deadline: '2026-04-25' },
  'J2025-004': { product: 'ベアリングハウジング', totalQty: 4200, deadline: '2026-04-18' },
  'J2025-005': { product: 'バルブボディ', totalQty: 6000, deadline: '2026-04-30' },
  'J2025-006': { product: 'ポンプインペラ', totalQty: 1800, deadline: '2026-04-12' },
  'J2025-007': { product: 'クランクシャフト', totalQty: 3200, deadline: '2026-04-22' },
  'J2025-008': { product: 'シリンダーヘッド', totalQty: 7500, deadline: '2026-05-05' },
};

// ============================================================================
// PRODUCTION SCHEDULE (Kế hoạch sản xuất - loaded from ERP/MES)
// Maps operator username → today's assigned work entries
// ============================================================================
const todayStr = new Date().toISOString().split('T')[0];

const productionSchedule = {
  // ── op001: "Perfect day" (Case 7: single product, no issues) ──
  'op001': {
    date: todayStr,
    shift: 'A',
    line: 'ラインA',
    entries: [{
      jobNumber: 'J2025-001',
      product: 'フランジ加工品',
      machines: ['CNC-001'],
      startTime: '07:00',
      endTime: '16:00',
      planQty: 120,
      defects: []
    }],
    setupEntries: [],
    downtimeEntries: [{
      id: 'dt-op001-1',
      startTime: '15:00',
      endTime: '15:30',
      machine: 'CNC-001',
      planned: true,
      reason: '週次定期保全 (CNC-001 bảo trì)'
    }]
  },

  // ── op002: "Multi-order day with changeover" (Case 1+4: switch orders, setup time) ──
  'op002': {
    date: todayStr,
    shift: 'A',
    line: 'ラインA',
    entries: [
      {
        jobNumber: 'J2025-002',
        product: 'シャフト部品',
        machines: ['CNC-002'],
        startTime: '07:00',
        endTime: '11:30',
        planQty: 50,
        defects: []
      },
      {
        jobNumber: 'J2025-004',
        product: 'ベアリングハウジング',
        machines: ['CNC-002'],
        startTime: '12:30',
        endTime: '16:30',
        planQty: 60,
        defects: []
      }
    ],
    setupEntries: [{
      id: 'setup-op002-1',
      startTime: '11:30',
      endTime: '12:30',
      type: 'changeover',
      fromJob: 'J2025-002',
      toJob: 'J2025-004',
      machines: ['CNC-002'],
      notes: 'J2025-002 → J2025-004 刃具交換'
    }],
    downtimeEntries: []
  },

  // ── op003: "Day with defects" (Case 1+9: defects on one product) ──
  'op003': {
    date: todayStr,
    shift: 'A',
    line: 'ラインB',
    entries: [
      {
        jobNumber: 'J2025-003',
        product: 'ギアケース',
        machines: ['CNC-003'],
        startTime: '07:00',
        endTime: '12:00',
        planQty: 40,
        defects: [{ code: 'D01', name: '寸法不良', count: 3, severity: 'minor', rootCause: { code: 'M07', name: '校正ずれ', category: 'Machine' }, countermeasure: { code: 'A06', name: '機械調整' } }]
      },
      {
        jobNumber: 'J2025-005',
        product: 'バルブボディ',
        machines: ['CNC-003', 'CNC-005'],
        startTime: '13:00',
        endTime: '16:30',
        planQty: 50,
        defects: []
      }
    ],
    setupEntries: [{
      id: 'setup-op003-1',
      startTime: '12:00',
      endTime: '13:00',
      type: 'changeover',
      fromJob: 'J2025-003',
      toJob: 'J2025-005',
      machines: ['CNC-003'],
      notes: 'J2025-003 → J2025-005 刃具交換'
    }],
    downtimeEntries: []
  },

  // ── op004: "Machine breakdown day" (Case 5+10: unplanned downtime + planned maintenance) ──
  'op004': {
    date: todayStr,
    shift: 'A',
    line: 'ラインC',
    entries: [
      {
        jobNumber: 'J2025-005',
        product: 'バルブボディ',
        machines: ['CNC-004'],
        startTime: '07:00',
        endTime: '12:00',
        planQty: 80,
        defects: []
      },
      {
        jobNumber: 'J2025-006',
        product: 'ポンプインペラ',
        machines: ['CNC-004', 'CNC-005'],
        startTime: '13:00',
        endTime: '16:30',
        planQty: 30,
        defects: []
      }
    ],
    setupEntries: [{
      id: 'setup-op004-1',
      startTime: '12:00',
      endTime: '13:00',
      type: 'changeover',
      fromJob: 'J2025-005',
      toJob: 'J2025-006',
      machines: ['CNC-004'],
      notes: 'J2025-005 → J2025-006 刃具交換'
    }],
    downtimeEntries: [
      {
        id: 'dt-op004-1',
        startTime: '10:00',
        endTime: '10:45',
        machine: 'CNC-004',
        planned: false,
        reason: 'CNC-004 スピンドルエラー'
      },
      {
        id: 'dt-op004-2',
        startTime: '15:30',
        endTime: '16:00',
        machine: 'CNC-005',
        planned: true,
        reason: '保全点検'
      }
    ]
  }
};

// Helper: get schedule for any operator (fallback to default for ops without explicit schedule)
const getOperatorSchedule = (username) => {
  if (productionSchedule[username]) return productionSchedule[username];
  // Default schedule for other operators (generic)
  return {
    date: todayStr,
    shift: 'A',
    line: '',
    entries: [{
      jobNumber: 'J2025-001',
      product: 'フランジ加工品',
      machines: ['CNC-001'],
      startTime: '07:00',
      endTime: '16:00',
      planQty: 120,
      defects: []
    }],
    setupEntries: [],
    downtimeEntries: []
  };
};

// ============================================================================
// MOCK DATA GENERATION
// ============================================================================
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
  const endDate = new Date('2026-04-03');

  for (let d = new Date('2026-04-01'); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (!isWeekday(d)) continue;

    for (const op of operators) {
      if (rand() < 0.05) continue;

      const dateStr = d.toISOString().split('T')[0];

      // ~50% have 1 entry, ~40% have 2 entries, ~10% have 3 entries
      let entryCount = 1;
      const entryRand = rand();
      if (entryRand > 0.50 && entryRand < 0.90) entryCount = 2;
      else if (entryRand >= 0.90) entryCount = 3;

      const entries = [];
      let reportMaxSeverity = 'minor';
      let totalDefects = 0;
      let totalPlanQty = 0;
      let totalActualQty = 0;

      // Generate entries for this report
      for (let entIdx = 0; entIdx < entryCount; entIdx++) {
        const product = productList[Math.floor(rand() * productList.length)];
        const planQty = product.planQty;
        const achievementRate = 0.88 + rand() * 0.22;
        const actualQty = Math.round(planQty * achievementRate);

        // Defects per entry
        let defectCount = 0;
        const dr = rand();
        if (dr > 0.60) {
          if (dr < 0.85) defectCount = 1 + Math.floor(rand() * 2);
          else if (dr < 0.95) defectCount = 3 + Math.floor(rand() * 3);
          else defectCount = 6 + Math.floor(rand() * 5);
        }

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

        totalPlanQty += planQty;
        totalActualQty += actualQty;
        totalDefects += defects.reduce((s, d) => s + d.count, 0);
        if (maxSeverity === 'critical') reportMaxSeverity = 'critical';
        else if (maxSeverity === 'major' && reportMaxSeverity !== 'critical') reportMaxSeverity = 'major';

        // Time slots: 07:00-11:30, 12:00-16:00, 16:30-20:00 for shifts
        const times = [
          { start: '07:00', end: '11:30' },
          { start: '12:00', end: '16:00' },
          { start: '16:30', end: '20:00' }
        ];
        const timeSlot = times[entIdx % 3];

        // Select 1-2 machines
        const machineCount = 1 + Math.floor(rand() * 2);
        const selectedMachines = [];
        for (let m = 0; m < machineCount; m++) {
          const mIdx = Math.floor(rand() * machines.length);
          if (!selectedMachines.includes(machines[mIdx])) {
            selectedMachines.push(machines[mIdx]);
          }
        }

        entries.push({
          id: `${reportId}-E${entIdx + 1}`,
          jobNumber: product.jobNum,
          product: product.name,
          machines: selectedMachines,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          planQty,
          actualQty,
          defects,
          fourM: {
            man: '',
            machine: '',
            material: '',
            method: ''
          }
        });
      }

      // Route type based on defect rate
      const defectRate = totalActualQty > 0 ? ((totalDefects / totalActualQty) * 100) : 0;
      let routeType = 'normal';
      if (reportMaxSeverity === 'critical' || defectRate > 10) routeType = 'critical';
      else if (reportMaxSeverity === 'major' || (defectRate >= 5 && defectRate <= 10)) routeType = 'major';

      // Status determination
      const daysAgo = Math.floor((endDate - d) / (1000 * 60 * 60 * 24));
      let status;
      if (daysAgo === 0) {
        const r = rand();
        if (r < 0.10) status = 'DRAFT';
        else if (r < 0.30) status = 'SUBMITTED';
        else if (routeType === 'normal') status = r < 0.60 ? 'TL_REVIEWING' : 'COMPLETED';
        else if (routeType === 'major') status = r < 0.50 ? 'SUBMITTED' : r < 0.75 ? 'TL_REVIEWING' : 'QA_REVIEWING';
        else status = r < 0.50 ? 'SUBMITTED' : r < 0.70 ? 'TL_REVIEWING' : 'SM_REVIEWING';
      } else if (daysAgo === 1) {
        if (routeType === 'normal') {
          status = 'COMPLETED';
        } else if (routeType === 'major') {
          status = rand() < 0.6 ? 'COMPLETED' : 'QA_REVIEWING';
        } else {
          const r = rand();
          status = r < 0.3 ? 'COMPLETED' : r < 0.5 ? 'DIR_REVIEWING' : r < 0.7 ? 'QA_REVIEWING' : 'SM_REVIEWING';
        }
      } else {
        if (routeType === 'normal') {
          status = 'COMPLETED';
        } else if (routeType === 'major') {
          status = rand() < 0.9 ? 'COMPLETED' : 'QA_REVIEWING';
        } else {
          status = rand() < 0.7 ? 'COMPLETED' : (rand() < 0.5 ? 'DIR_REVIEWING' : 'QA_REVIEWING');
        }
      }

      let otHours = 0;
      const otR = rand();
      if (otR > 0.70) {
        if (otR < 0.90) otHours = +(1 + rand()).toFixed(1);
        else if (otR < 0.97) otHours = +(2 + rand()).toFixed(1);
        else otHours = +(3 + rand()).toFixed(1);
      }

      const achievement = totalPlanQty > 0 ? Math.round((totalActualQty / totalPlanQty) * 100) : 0;
      const variance = totalPlanQty > 0 ? +((totalActualQty - totalPlanQty) / totalPlanQty * 100).toFixed(1) : 0;

      reports.push({
        id: reportId++,
        operatorId: op.id,
        operatorName: op.name,
        date: dateStr,
        shift: shifts[Math.floor(rand() * 3)],
        status,
        routeType,
        maxSeverity: reportMaxSeverity,
        defectRate: +defectRate.toFixed(2),
        achievement,
        variance,
        entries,
        setupEntries: [],
        downtimeEntries: rand() < 0.10 ? [{
          id: `${reportId}-D1`,
          startTime: '10:00',
          endTime: '10:45',
          machine: machines[Math.floor(rand() * machines.length)],
          planned: false,
          reason: 'スピンドル異常'
        }] : [],
        totalPlanQty,
        totalActualQty,
        totalDefects,
        hours: {
          regular: 7.5,
          overtime: otHours,
          downtime: rand() > 0.92 ? Math.floor(rand() * 60) : 0
        },
        narratives: {
          target: `複数ラインの${entries.length}工程を実行`,
          results: `目標達成 ${totalActualQty}個完了`,
          improvement: '段取り時間短縮',
          tomorrow: '新ロット切替予定'
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
    todayMachine: "本日の担当機",
    todayPlanCard: "本日の計画",
    workHoursMonth: "勤務時間",
    incompleteReports: "未完了レポート",
    overtime: "残業",
    monthlyPerformance: "今月の成績",
    yearlyPerformance: "年間の成績",
    achievementRateLabel: "達成率",
    productionCount: "生産数",
    defectRateLabel: "不具合率",
    daysWorked: "日間勤務",
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
    addEntry: "生産ラインを追加",
    entry: "生産ライン",
    setupRecord: "段取り替え記録",
    downtimeRecord: "停止時間記録",
    startTime: "開始時刻",
    endTime: "終了時刻",
    changeover: "段取り替え",
    calibration: "校正",
    toolChange: "刃具交換",
    planned: "計画停止",
    unplanned: "突発停止",
    fromOrder: "切替前",
    toOrder: "切替後",
    reason: "理由",
    summary: "集計",
    totalOutput: "合計生産数",
    orders: "受注",
    orderProgress: "受注進捗",
    cumulative: "累計",
    machines: "使用機械",
    multiMachineHint: "複数選択可",
    entryCount: "ライン数",
    setupTime: "段取り時間",
    downtimeTotal: "停止時間合計",
    // Status labels
    statusDraft: "下書き",
    statusSubmitted: "班長確認中",
    statusTlReviewing: "班長確認中",
    statusQaReviewing: "品質確認中",
    statusSmReviewing: "課長確認中",
    statusDirReviewing: "工場長確認中",
    statusCompleted: "完了",
    statusRejected: "差戻し",
    // Buttons
    viewDetail: "詳細",
    edit: "編集",
    withdraw: "取下",
    withdrawLong: "取下げ",
    back: "戻る",
    saveDraft: "下書き",
    submit: "提出",
    submitConfirm: "提出する",
    cancel: "キャンセル",
    add: "追加",
    delete: "削除",
    deleteEntry: "このラインを削除",
    approve: "承認",
    reject: "却下",
    // Report Creation Form
    newReportTitle: "新規日報作成",
    editReportTitle: "日報編集",
    date: "日付",
    shiftSelect: "シフト選択",
    productionEntries: "生産ライン",
    orderProduct: "受注 / 製品",
    orderSelect: "受注選択",
    machineSelect: "機械選択",
    tapToSelect: "タップして選択...",
    onPlan: "計画通り",
    submitConfirmTitle: "提出確認",
    submitConfirmMsg: "この日報を提出しますか？提出後は班長の承認待ちになります。",
    // Schedule banner
    scheduleBannerTitle: "生産計画から自動入力済み",
    scheduleBannerMsg: "計画通りならそのまま提出。差異があれば該当箇所を修正してください。",
    schedulePlanLabel: "計画:",
    scheduleAutoLoad: "ERPより自動読込",
    todayPlan: "本日の生産計画",
    // Defect section
    defectRecord: "不具合記録",
    noDefects: "不具合なし",
    defectCount: "個",
    severityMinor: "軽微",
    severityMajor: "大",
    severityCritical: "重大",
    rootCause: "原因",
    countermeasure: "対策",
    defectWizardStep1: "① 不具合種類",
    defectWizardStep2: "② 原因",
    defectWizardStep3: "③ 対策",
    skipCause: "スキップ（原因不明）",
    skipAction: "スキップ（対策なし）",
    // Setup/Changeover section
    setupSection: "段取り・切替",
    noSetup: "段取り・切替なし",
    setupChangeover: "切替（チェンジオーバー）",
    setupToolChange: "刃具交換",
    setupCalibration: "キャリブレーション",
    setupType: "種類",
    setupChangeoverShort: "切替",
    setupStart: "開始",
    setupEnd: "終了",
    prevOrder: "前の受注",
    nextOrder: "次の受注",
    setupNotes: "備考",
    setupNotesPlaceholder: "段取りのメモを入力...",
    // Downtime section
    downtimeSection: "停止時間",
    noDowntime: "停止時間なし",
    plannedStop: "計画停止（保全）",
    unplannedStop: "非計画停止",
    downtimeCategory: "区分",
    unplannedFault: "非計画（故障等）",
    plannedMaint: "計画（保全）",
    downtimeMachine: "機械",
    downtimeReasonPlaceholder: "故障内容を入力...",
    maintenancePlaceholder: "保全内容を入力...",
    // Report Detail
    reportDetail: "日報詳細",
    reportOperator: "オペレータ",
    reportStatus: "ステータス",
    colActions: "操作",
    shiftSuffix: "班",
    productionLineDetail: "生産ライン詳細",
    linePrefix: "ライン",
    defectDetail: "不具合詳細:",
    setupTimeMin: "分",
    narrativeSection: "日報記述",
    // Summary card
    achievementLabel: "成績率",
    defectsLabel: "不具合",
    setupLabel: "段取り",
    downtimeLabel: "停止",
    // Approvals page
    noApprovalsMessage: "承認待ちのレポートはありません",
    countUnit: "件",
    confirm: "確認",
    // Dashboard & Reports
    notSelected: "未選択",
    orderByWorkHours: "オーダー別作業時間",
    pendingReview: "確認待ち",
    plan: "計画",
    totalPlanToday: "Today's Plan Total",
    // TL Dashboard
    myWorkPerformance: "自分の作業実績",
    myReportsList: "自分の日報一覧",
    approvalRequests: "承認リクエスト",
    awaitingTLApproval: "班長承認待ち",
    teamAchievementRate: "チーム達成率",
    teamDefects: "チーム不具合",
    memberCount: "メンバー数",
    orderTeamPerformance: "オーダー別チーム実績",
    colJobNumber: "工番",
    colProduct: "製品",
    colRegularHours: "通常(h)",
    colOvertimeHours: "残業(h)",
    colTotalHours: "合計(h)",
    colPlan: "計画",
    colActual: "実績",
    colDefects: "不具合",
    colStatus: "状態",
    colActualQty: "実績数量",
    totalRow: "合計",
    statusOnTrack: "進行中",
    statusComplete: "完了",
    approveBtn: "承認",
    rejectBtn: "却下",
    confirmApproveTitle: "承認確認",
    confirmApproveMsg: "このレポートを承認しますか？",
    confirmRejectTitle: "却下確認",
    confirmRejectMsg: "このレポートを却下しますか？差戻しになります。",
    confirmYes: "はい",
    confirmNo: "いいえ",
    deadline: "納期",
    reportCreationPermission: "日報作成権限",
    reportCreationPermissionDesc: "新規日報作成画面を表示するロールを選択してください",
    enabled: "有効",
    settingsTBD: "設定項目は準備中です",
    settingsTBDDesc: "今後のアップデートで追加される予定です",
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
    todayMachine: "Today's Machine",
    todayPlanCard: "Today's Plan",
    workHoursMonth: "Work Hours",
    incompleteReports: "Incomplete Reports",
    overtime: "Overtime",
    monthlyPerformance: "Monthly Performance",
    yearlyPerformance: "Yearly Performance",
    achievementRateLabel: "Achievement",
    productionCount: "Production",
    defectRateLabel: "Defect Rate",
    daysWorked: "days worked",
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
    addEntry: "Add Production Entry",
    entry: "Production Entry",
    setupRecord: "Setup Record",
    downtimeRecord: "Downtime Record",
    startTime: "Start Time",
    endTime: "End Time",
    changeover: "Changeover",
    calibration: "Calibration",
    toolChange: "Tool Change",
    planned: "Planned",
    unplanned: "Unplanned",
    fromOrder: "From Order",
    toOrder: "To Order",
    reason: "Reason",
    summary: "Summary",
    totalOutput: "Total Output",
    orders: "Orders",
    orderProgress: "Order Progress",
    cumulative: "Cumulative",
    machines: "Machines",
    multiMachineHint: "Multi-select",
    entryCount: "Entries",
    setupTime: "Setup Time",
    downtimeTotal: "Total Downtime",
    // Status labels
    statusDraft: "Draft",
    statusSubmitted: "TL Reviewing",
    statusTlReviewing: "TL Reviewing",
    statusQaReviewing: "QA Reviewing",
    statusSmReviewing: "SM Reviewing",
    statusDirReviewing: "Dir Reviewing",
    statusCompleted: "Completed",
    statusRejected: "Rejected",
    // Buttons
    viewDetail: "Detail",
    edit: "Edit",
    withdraw: "Withdraw",
    withdrawLong: "Withdraw",
    back: "Back",
    saveDraft: "Draft",
    submit: "Submit",
    submitConfirm: "Submit",
    cancel: "Cancel",
    add: "Add",
    delete: "Delete",
    deleteEntry: "Delete this entry",
    approve: "Approve",
    reject: "Reject",
    // Report Creation Form
    newReportTitle: "New Daily Report",
    editReportTitle: "Edit Daily Report",
    date: "Date",
    shiftSelect: "Select Shift",
    productionEntries: "Production Lines",
    orderProduct: "Order / Product",
    orderSelect: "Select Order",
    machineSelect: "Select Machine",
    tapToSelect: "Tap to select...",
    onPlan: "On plan",
    submitConfirmTitle: "Confirm Submission",
    submitConfirmMsg: "Submit this report? It will be sent to team leader for review.",
    // Schedule banner
    scheduleBannerTitle: "Auto-filled from production plan",
    scheduleBannerMsg: "Submit as-is if on plan. Edit only where actual differs.",
    schedulePlanLabel: "Plan:",
    scheduleAutoLoad: "Auto-loaded from ERP",
    todayPlan: "Today's Plan",
    // Defect section
    defectRecord: "Defect Record",
    noDefects: "No defects",
    defectCount: "pcs",
    severityMinor: "Minor",
    severityMajor: "Major",
    severityCritical: "Critical",
    rootCause: "Cause",
    countermeasure: "Action",
    defectWizardStep1: "① Defect Type",
    defectWizardStep2: "② Root Cause",
    defectWizardStep3: "③ Countermeasure",
    skipCause: "Skip (unknown cause)",
    skipAction: "Skip (no action)",
    // Setup/Changeover section
    setupSection: "Setup / Changeover",
    noSetup: "No setup/changeover",
    setupChangeover: "Changeover",
    setupToolChange: "Tool Change",
    setupCalibration: "Calibration",
    setupType: "Type",
    setupChangeoverShort: "Changeover",
    setupStart: "Start",
    setupEnd: "End",
    prevOrder: "Previous Order",
    nextOrder: "Next Order",
    setupNotes: "Notes",
    setupNotesPlaceholder: "Enter setup notes...",
    // Downtime section
    downtimeSection: "Downtime",
    noDowntime: "No downtime",
    plannedStop: "Planned (Maintenance)",
    unplannedStop: "Unplanned",
    downtimeCategory: "Category",
    unplannedFault: "Unplanned (Fault)",
    plannedMaint: "Planned (Maint.)",
    downtimeMachine: "Machine",
    downtimeReasonPlaceholder: "Enter fault details...",
    maintenancePlaceholder: "Enter maintenance details...",
    // Report Detail
    reportDetail: "Report Detail",
    reportOperator: "Operator",
    reportStatus: "Status",
    colActions: "Actions",
    shiftSuffix: "",
    productionLineDetail: "Production Line Details",
    linePrefix: "Line",
    defectDetail: "Defect Details:",
    setupTimeMin: "min",
    narrativeSection: "Report Notes",
    // Summary card
    achievementLabel: "Achievement",
    defectsLabel: "Defects",
    setupLabel: "Setup",
    downtimeLabel: "Downtime",
    // Approvals page
    noApprovalsMessage: "No pending reports",
    countUnit: "items",
    confirm: "Confirm",
    // Dashboard & Reports
    notSelected: "Not selected",
    orderByWorkHours: "Work Hours by Order",
    pendingReview: "Pending Review",
    plan: "Plan",
    totalPlanToday: "Today's Plan Total",
    // TL Dashboard
    myWorkPerformance: "My Work Performance",
    myReportsList: "My Reports",
    approvalRequests: "Approval Requests",
    awaitingTLApproval: "Awaiting TL Approval",
    teamAchievementRate: "Team Achievement",
    teamDefects: "Team Defects",
    memberCount: "Members",
    orderTeamPerformance: "Team Performance by Order",
    colJobNumber: "Job No.",
    colProduct: "Product",
    colRegularHours: "Regular(h)",
    colOvertimeHours: "OT(h)",
    colTotalHours: "Total(h)",
    colPlan: "Plan",
    colActual: "Actual",
    colDefects: "Defects",
    colStatus: "Status",
    colActualQty: "Actual Qty",
    totalRow: "Total",
    statusOnTrack: "In Progress",
    statusComplete: "Complete",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    confirmApproveTitle: "Confirm Approval",
    confirmApproveMsg: "Are you sure you want to approve this report?",
    confirmRejectTitle: "Confirm Rejection",
    confirmRejectMsg: "Are you sure you want to reject this report? It will be returned to draft.",
    confirmYes: "Yes",
    confirmNo: "No",
    deadline: "Deadline",
    reportCreationPermission: "Report Creation Permission",
    reportCreationPermissionDesc: "Select which roles can access the New Report screen",
    enabled: "Enabled",
    settingsTBD: "Settings coming soon",
    settingsTBDDesc: "Additional settings will be available in future updates",
  }
};

const generateMockUsers = () => {
  const rand = createSeededRandom(12345);
  const users = [];
  const firstNamesChinese = ['田中', '佐藤', '鈴木', '高橋', '山本', '渡辺', '中村', '小林', '加藤', '吉田'];
  const lastNames = ['太郎', '次郎', '三郎', '四郎', '五郎', '六郎', '七郎', '八郎', '九郎', '十郎'];
  let userId = 1;

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
  const [username, setUsername] = useState('op001');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const users = useMemo(() => generateMockUsers(), []);

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">スマートファクトリ</h1>
        <p className="text-center text-gray-600 mb-8">生産日報システム</p>

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold mb-2">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="op001"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="demo"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 text-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            ログイン
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p className="font-semibold mb-2">デモアカウント:</p>
          <p>op001-op040: Operator</p>
          <p>tl001-tl010: Team Leader</p>
          <p>sm001: Section Manager</p>
          <p>qa001: QA</p>
          <p>ml001: Maintenance</p>
          <p>dir001: Director</p>
          <p className="mt-2">パスワード: demo</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL SELECT COMPONENT
// ============================================================================
const ModalSelect = ({ isOpen, onClose, title, options, value, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-3xl p-2 hover:bg-gray-100 rounded">×</button>
        </div>
        <div className="divide-y-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                onClose();
              }}
              className={`w-full p-4 text-left text-xl font-semibold transition ${
                value === opt.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL MULTI-SELECT COMPONENT
// ============================================================================
const ModalMultiSelect = ({ isOpen, onClose, title, options, values, onChange }) => {
  if (!isOpen) return null;

  const toggleValue = (value) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value];
    onChange(newValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-3xl p-2 hover:bg-gray-100 rounded">×</button>
        </div>
        <div className="divide-y-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className={`w-full p-4 text-left text-xl font-semibold transition flex items-center gap-4 ${
                values.includes(opt.value)
                  ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 border-2 rounded flex items-center justify-center ${
                values.includes(opt.value)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-400'
              }`}>
                {values.includes(opt.value) && <Check className="w-5 h-5 text-white" />}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 p-4 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            完了 ({values.length}個選択)
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================
const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse, currentUser, onLogout, onNavigate, language, activePage, appSettings }) => {
  const t = translations[language];
  const allMenuItems = [
    { id: 'dashboard', icon: Home, label_ja: 'ダッシュボード', label_en: 'Dashboard' },
    { id: 'reports', icon: FileText, label_ja: '日報一覧', label_en: 'Reports' },
    { id: 'new-report', icon: Plus, label_ja: '新規日報', label_en: 'New Report' },
    { id: 'approvals', icon: UserCheck, label_ja: '承認待ち', label_en: 'Approvals' },
    { id: 'analytics', icon: BarChart3, label_ja: '分析', label_en: 'Analytics' },
    { id: 'settings', icon: Settings, label_ja: '設定', label_en: 'Settings' },
  ];
  // Filter menu based on role permissions
  const canCreateReport = appSettings?.reportCreationRoles?.includes(currentUser?.role);
  const isReviewer = ['team_leader', 'section_manager', 'qa', 'director'].includes(currentUser?.role);
  const menuItems = allMenuItems.filter(item => {
    if (item.id === 'new-report' && !canCreateReport) return false;
    if (item.id === 'approvals' && !isReviewer) return false;
    return true;
  });

  const getRoleLabel = () => {
    const roles = {
      'operator': t.operator,
      'team_leader': t.team_leader,
      'section_manager': t.section_manager,
      'qa': t.qa,
      'maintenance_lead': t.maintenance_lead,
      'director': t.director,
    };
    return roles[currentUser?.role] || currentUser?.role;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      } ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            {!collapsed && <h2 className="text-xl font-bold">メニュー</h2>}
            <button onClick={onToggleCollapse} className="p-2 hover:bg-gray-800 rounded">
              {collapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {!collapsed && currentUser && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-sm">{currentUser.name}</p>
                <p className="text-xs text-gray-400">{getRoleLabel()}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const label = language === 'ja' ? item.label_ja : item.label_en;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-2">
          {!collapsed && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{t.logout}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// OPERATOR DASHBOARD
// ============================================================================
const OperatorDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const allMyReports = reports.filter(r => r.operatorId === currentUser.id);

  // Get today's schedule for this operator
  const schedule = productionSchedule[currentUser.username];

  // Today's machine(s) from schedule
  const todayMachines = schedule ? [...new Set(schedule.entries.flatMap(e => e.machines || []))] : [];
  const todayShift = schedule?.shift || '-';

  // Today's plan summary
  const todayPlanTotal = schedule ? schedule.entries.reduce((s, e) => s + (e.planQty || 0), 0) : 0;
  const todayPlanProduct = schedule?.entries?.[0]?.product || '-';

  // Monthly stats
  const monthReports = allMyReports.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthDaysWorked = monthReports.length;
  const monthTotalActual = monthReports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const monthTotalPlan = monthReports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const monthAchievement = monthTotalPlan > 0 ? ((monthTotalActual / monthTotalPlan) * 100).toFixed(1) : 0;
  const monthTotalDefects = monthReports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const monthDefectRate = monthTotalActual > 0 ? ((monthTotalDefects / monthTotalActual) * 100).toFixed(2) : 0;

  // Monthly work hours
  const monthTotalHours = monthReports.reduce((s, r) => {
    return s + (r.entries || []).reduce((es, e) => es + calcHours(e.startTime, e.endTime), 0);
  }, 0);
  const standardHoursPerDay = 8;
  const monthOvertime = Math.max(0, monthTotalHours - (monthDaysWorked * standardHoursPerDay));

  // Yearly stats
  const yearReports = allMyReports.filter(r => new Date(r.date).getFullYear() === currentYear);
  const yearDaysWorked = yearReports.length;
  const yearTotalActual = yearReports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const yearTotalPlan = yearReports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const yearAchievement = yearTotalPlan > 0 ? ((yearTotalActual / yearTotalPlan) * 100).toFixed(1) : 0;
  const yearTotalDefects = yearReports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const yearDefectRate = yearTotalActual > 0 ? ((yearTotalDefects / yearTotalActual) * 100).toFixed(2) : 0;

  // Incomplete reports (DRAFT or REJECTED)
  const incompleteCount = allMyReports.filter(r => r.status === 'DRAFT' || r.status === 'REJECTED').length;

  const recentReports = allMyReports.slice(-7).reverse();
  const monthName = language === 'ja' ? `${currentMonth + 1}月` : new Date().toLocaleString('en', { month: 'short' });

  return (
    <div className="space-y-6">
      {/* Top 4 Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Machine */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.todayMachine}</p>
          <p className="text-2xl font-bold text-blue-700">{todayMachines[0] || '-'}</p>
          <p className="text-xs text-gray-400 mt-1">{t.shift}: {todayShift}</p>
        </div>
        {/* Today's Plan */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.todayPlanCard}</p>
          <p className="text-2xl font-bold text-blue-700">{todayPlanTotal}</p>
          <p className="text-xs text-gray-400 mt-1">{todayPlanProduct}</p>
        </div>
        {/* Work Hours (Month) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.workHoursMonth} ({monthName})</p>
          <p className="text-2xl font-bold text-orange-600">{monthTotalHours.toFixed(1)}h</p>
          <p className="text-xs text-orange-500 mt-1">{t.overtime}: {monthOvertime.toFixed(1)}h</p>
        </div>
        {/* Incomplete Reports */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.incompleteReports}</p>
          <p className="text-2xl font-bold text-green-700">{incompleteCount}</p>
        </div>
      </div>

      {/* Monthly + Yearly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Performance */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📅</span>
            <h3 className="text-lg font-bold">{t.monthlyPerformance} ({monthName})</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-blue-700">{monthAchievement}%</p>
              <p className="text-xs text-gray-500">{t.achievementRateLabel}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-purple-700">{monthTotalActual}</p>
              <p className="text-xs text-gray-500">{t.productionCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-green-700">{monthDefectRate}%</p>
              <p className="text-xs text-gray-500">{t.defectRateLabel}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">{monthDaysWorked} {t.daysWorked}</p>
        </div>

        {/* Yearly Performance */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📈</span>
            <h3 className="text-lg font-bold">{t.yearlyPerformance} ({currentYear}{language === 'ja' ? '年' : ''})</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-blue-700">{yearAchievement}%</p>
              <p className="text-xs text-gray-500">{t.achievementRateLabel}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-purple-700">{yearTotalActual}</p>
              <p className="text-xs text-gray-500">{t.productionCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-green-700">{yearDefectRate}%</p>
              <p className="text-xs text-gray-500">{t.defectRateLabel}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">{yearDaysWorked} {t.daysWorked}</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-xl font-bold">{t.recentReportsTable}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-semibold">{t.date}</th>
                <th className="text-left p-3 font-semibold">{t.shift}</th>
                <th className="text-center p-3 font-semibold">{t.entryCount}</th>
                <th className="text-center p-3 font-semibold">{t.quantity}</th>
                <th className="text-center p-3 font-semibold">{t.achievementRate}</th>
                <th className="text-left p-3 font-semibold">{t.reportStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentReports.map((report) => {
                const summary = getReportSummary(report);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="p-3">{report.date}</td>
                    <td className="p-3">{report.shift}{t.shiftSuffix}</td>
                    <td className="p-3 text-center">{(report.entries || []).length}</td>
                    <td className="p-3 text-center">{summary.totalActual}</td>
                    <td className="p-3 text-center font-bold">{summary.achievement}%</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${
                        report.status === 'COMPLETED' ? 'bg-green-600' :
                        report.status === 'DRAFT' ? 'bg-gray-400' :
                        report.status === 'REJECTED' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}>
                        {{ DRAFT: t.statusDraft, SUBMITTED: t.statusSubmitted, TL_REVIEWING: t.statusTlReviewing, QA_REVIEWING: t.statusQaReviewing, SM_REVIEWING: t.statusSmReviewing, DIR_REVIEWING: t.statusDirReviewing, COMPLETED: t.statusCompleted, REJECTED: t.statusRejected }[report.status] || report.status}
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
// TEAM LEADER DASHBOARD
// ============================================================================
const TeamLeaderDashboard = ({ currentUser, language, reports, users, onNavigate }) => {
  const t = translations[language];
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = language === 'ja' ? `${currentMonth + 1}月` : new Date().toLocaleString('en', { month: 'short' });

  // === MY (TL's own) DATA ===
  const myReports = reports.filter(r => r.operatorId === currentUser.id);
  const schedule = productionSchedule[currentUser.username];
  const todayMachines = schedule ? [...new Set(schedule.entries.flatMap(e => e.machines || []))] : [];
  const todayShift = schedule?.shift || '-';
  const todayPlanTotal = schedule ? schedule.entries.reduce((s, e) => s + (e.planQty || 0), 0) : 0;
  const todayPlanProduct = schedule?.entries?.[0]?.product || '-';

  // My monthly stats
  const myMonthReports = myReports.filter(r => { const d = new Date(r.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; });
  const myMonthDays = myMonthReports.length;
  const myMonthActual = myMonthReports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const myMonthPlan = myMonthReports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const myMonthAchievement = myMonthPlan > 0 ? ((myMonthActual / myMonthPlan) * 100).toFixed(1) : 0;
  const myMonthDefects = myMonthReports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const myMonthDefectRate = myMonthActual > 0 ? ((myMonthDefects / myMonthActual) * 100).toFixed(2) : 0;
  const myMonthHours = myMonthReports.reduce((s, r) => s + (r.entries || []).reduce((es, e) => es + calcHours(e.startTime, e.endTime), 0), 0);
  const myMonthOvertime = Math.max(0, myMonthHours - (myMonthDays * 8));

  // My yearly stats
  const myYearReports = myReports.filter(r => new Date(r.date).getFullYear() === currentYear);
  const myYearDays = myYearReports.length;
  const myYearActual = myYearReports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const myYearPlan = myYearReports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const myYearAchievement = myYearPlan > 0 ? ((myYearActual / myYearPlan) * 100).toFixed(1) : 0;
  const myYearDefects = myYearReports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const myYearDefectRate = myYearActual > 0 ? ((myYearDefects / myYearActual) * 100).toFixed(2) : 0;

  const myIncompleteCount = myReports.filter(r => r.status === 'DRAFT' || r.status === 'REJECTED').length;

  // My work hours by order (monthly)
  const myOrderHours = {};
  myMonthReports.forEach(report => {
    (report.entries || []).forEach(entry => {
      const key = entry.jobNumber;
      if (!myOrderHours[key]) myOrderHours[key] = { jobNumber: key, product: entry.product, regularHours: 0, overtimeHours: 0, totalHours: 0, actual: 0, plan: 0, achievement: 0 };
      const h = calcHours(entry.startTime, entry.endTime);
      myOrderHours[key].totalHours += h;
      myOrderHours[key].actual += entry.actualQty || 0;
      myOrderHours[key].plan += entry.planQty || 0;
    });
  });
  // Split regular/overtime (first 8h/day = regular, rest = overtime) - simplified per order
  Object.values(myOrderHours).forEach(o => {
    o.regularHours = Math.min(o.totalHours, myMonthDays * 8 * (o.totalHours / (myMonthHours || 1)));
    o.overtimeHours = Math.max(0, o.totalHours - o.regularHours);
    o.achievement = o.plan > 0 ? ((o.actual / o.plan) * 100).toFixed(1) : 0;
  });
  const myOrderData = Object.values(myOrderHours);
  const myOrderTotals = myOrderData.reduce((acc, o) => ({
    regularHours: acc.regularHours + o.regularHours,
    overtimeHours: acc.overtimeHours + o.overtimeHours,
    totalHours: acc.totalHours + o.totalHours,
    actual: acc.actual + o.actual,
    plan: acc.plan + o.plan
  }), { regularHours: 0, overtimeHours: 0, totalHours: 0, actual: 0, plan: 0 });

  // My recent reports with products shown per entry
  const myRecentReports = myReports.slice(-7).reverse();

  // === TEAM DATA ===
  const teamMembers = users.filter(u => u.team === currentUser.team && u.role === 'operator');
  const teamReports = reports.filter(r => r.team === currentUser.team);
  const pendingReviews = teamReports.filter(r => r.status === 'SUBMITTED');

  // Team totals (all time in system)
  const teamTotalActual = teamReports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const teamTotalPlan = teamReports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const teamAchievement = teamTotalPlan > 0 ? ((teamTotalActual / teamTotalPlan) * 100).toFixed(1) : 0;
  const teamTotalDefects = teamReports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const teamDefectRate = teamTotalActual > 0 ? ((teamTotalDefects / teamTotalActual) * 100).toFixed(2) : 0;

  // Team order-level aggregation
  const teamOrderAgg = {};
  teamReports.forEach(report => {
    (report.entries || []).forEach(entry => {
      const key = entry.jobNumber;
      if (!teamOrderAgg[key]) teamOrderAgg[key] = { jobNumber: key, product: entry.product, plan: 0, actual: 0, defects: 0 };
      teamOrderAgg[key].plan += entry.planQty || 0;
      teamOrderAgg[key].actual += entry.actualQty || 0;
      teamOrderAgg[key].defects += (entry.defects || []).reduce((s, d) => s + (d.count || 0), 0);
    });
  });
  const teamOrderData = Object.values(teamOrderAgg).sort((a, b) => b.actual - a.actual);

  // Status label helper
  const statusLabel = (status) => ({ DRAFT: t.statusDraft, SUBMITTED: t.statusSubmitted, TL_REVIEWING: t.statusTlReviewing, QA_REVIEWING: t.statusQaReviewing, SM_REVIEWING: t.statusSmReviewing, DIR_REVIEWING: t.statusDirReviewing, COMPLETED: t.statusCompleted, REJECTED: t.statusRejected }[status] || status);
  const statusColor = (status) => status === 'COMPLETED' ? 'bg-green-600' : status === 'DRAFT' ? 'bg-gray-400' : status === 'REJECTED' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className="space-y-6">
      {/* ====== SECTION 1: MY WORK PERFORMANCE ====== */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔧</span>
          <h3 className="text-lg font-bold text-blue-800">{t.myWorkPerformance}</h3>
        </div>

        {/* Top 4 Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{t.todayMachine}</p>
            <p className="text-2xl font-bold text-blue-700">{todayMachines[0] || '-'}</p>
            <p className="text-xs text-gray-400 mt-1">{t.shift}: {todayShift}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{t.todayPlanCard}</p>
            <p className="text-2xl font-bold text-blue-700">{todayPlanTotal || '-'}</p>
            <p className="text-xs text-gray-400 mt-1">{todayPlanProduct}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{t.workHoursMonth} ({monthName})</p>
            <p className="text-2xl font-bold text-orange-600">{myMonthHours.toFixed(1)}h</p>
            <p className="text-xs text-orange-500 mt-1">{t.overtime}: {myMonthOvertime.toFixed(1)}h</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{t.incompleteReports}</p>
            <p className="text-2xl font-bold text-green-700">{myIncompleteCount}</p>
          </div>
        </div>

        {/* Monthly + Yearly Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span>📅</span>
              <h3 className="text-lg font-bold">{t.monthlyPerformance} ({monthName})</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-blue-700">{myMonthAchievement}%</p>
                <p className="text-xs text-gray-500">{t.achievementRateLabel}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-purple-700">{myMonthActual}</p>
                <p className="text-xs text-gray-500">{t.productionCount}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-green-700">{myMonthDefectRate}%</p>
                <p className="text-xs text-gray-500">{t.defectRateLabel}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">{myMonthDays} {t.daysWorked}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span>📈</span>
              <h3 className="text-lg font-bold">{t.yearlyPerformance} ({currentYear}{language === 'ja' ? '年' : ''})</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-blue-700">{myYearAchievement}%</p>
                <p className="text-xs text-gray-500">{t.achievementRateLabel}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-purple-700">{myYearActual}</p>
                <p className="text-xs text-gray-500">{t.productionCount}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-green-700">{myYearDefectRate}%</p>
                <p className="text-xs text-gray-500">{t.defectRateLabel}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">{myYearDays} {t.daysWorked}</p>
          </div>
        </div>

        {/* Work Hours by Order table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold">{t.orderByWorkHours} ({monthName})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold">{t.colJobNumber}</th>
                  <th className="text-left p-3 font-semibold">{t.colProduct}</th>
                  <th className="text-center p-3 font-semibold">{t.colRegularHours}</th>
                  <th className="text-center p-3 font-semibold">{t.colOvertimeHours}</th>
                  <th className="text-center p-3 font-semibold">{t.colTotalHours}</th>
                  <th className="text-center p-3 font-semibold">{t.productionCount}</th>
                  <th className="text-center p-3 font-semibold">{t.achievementRateLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myOrderData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-700">{row.jobNumber}</td>
                    <td className="p-3">{row.product}</td>
                    <td className="p-3 text-center">{row.regularHours.toFixed(1)}</td>
                    <td className="p-3 text-center text-orange-600">{row.overtimeHours.toFixed(1)}</td>
                    <td className="p-3 text-center font-medium">{row.totalHours.toFixed(1)}</td>
                    <td className="p-3 text-center">{row.actual}</td>
                    <td className="p-3 text-center font-bold text-green-700">{row.achievement}%</td>
                  </tr>
                ))}
                {myOrderData.length > 0 && (
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-3" colSpan={2}>{t.totalRow}</td>
                    <td className="p-3 text-center">{myOrderTotals.regularHours.toFixed(1)}</td>
                    <td className="p-3 text-center text-orange-600">{myOrderTotals.overtimeHours.toFixed(1)}</td>
                    <td className="p-3 text-center">{myOrderTotals.totalHours.toFixed(1)}</td>
                    <td className="p-3 text-center">{myOrderTotals.actual}</td>
                    <td className="p-3 text-center font-bold text-orange-600">{myOrderTotals.plan > 0 ? ((myOrderTotals.actual / myOrderTotals.plan) * 100).toFixed(1) : 0}%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Reports List - show product detail per entry */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold">{t.myReportsList}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold">{t.date}</th>
                  <th className="text-left p-3 font-semibold">{t.colProduct}</th>
                  <th className="text-center p-3 font-semibold">{t.colActualQty}</th>
                  <th className="text-center p-3 font-semibold">{t.defectRateLabel}</th>
                  <th className="text-left p-3 font-semibold">{t.reportStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myRecentReports.map((report) => {
                  const entries = report.entries || [];
                  const summary = getReportSummary(report);
                  const productNames = entries.map(e => e.product).filter(Boolean).join(', ');
                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-3">{report.date}</td>
                      <td className="p-3 text-sm">{productNames || '-'}</td>
                      <td className="p-3 text-center font-bold">{summary.totalActual}</td>
                      <td className="p-3 text-center">{summary.defectRate}%</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${statusColor(report.status)}`}>
                          {statusLabel(report.status)}
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

      {/* ====== SECTION 2: TEAM MANAGEMENT ====== */}
      {/* Team KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Approval Requests - highlighted */}
        <div className="bg-white border-2 border-yellow-400 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
          onClick={() => onNavigate('approvals')}>
          <p className="text-sm text-gray-500 mb-1">{t.approvalRequests}</p>
          <p className="text-3xl font-bold text-red-600">{pendingReviews.length}</p>
          <p className="text-xs text-gray-400 mt-1">{t.awaitingTLApproval}</p>
        </div>
        {/* Team Achievement */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.teamAchievementRate}</p>
          <p className="text-3xl font-bold text-green-700">{teamAchievement}%</p>
          <p className="text-xs text-gray-400 mt-1">{teamTotalActual} / {teamTotalPlan}</p>
        </div>
        {/* Team Defects */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.teamDefects}</p>
          <p className="text-3xl font-bold text-red-600">{teamTotalDefects}</p>
          <p className="text-xs text-gray-400 mt-1">{t.defectRateLabel}: {teamDefectRate}%</p>
        </div>
        {/* Member Count */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t.memberCount}</p>
          <p className="text-3xl font-bold text-blue-700">{teamMembers.length}</p>
        </div>
      </div>

      {/* Team Performance by Order */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <span className="text-lg">👥</span>
          <h3 className="font-bold text-lg">{t.orderTeamPerformance}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-semibold">{t.colJobNumber}</th>
                <th className="text-left p-3 font-semibold">{t.colProduct}</th>
                <th className="text-center p-3 font-semibold">{t.colPlan}</th>
                <th className="text-center p-3 font-semibold">{t.colActual}</th>
                <th className="text-center p-3 font-semibold">{t.achievementRateLabel}</th>
                <th className="text-center p-3 font-semibold">{t.colDefects}</th>
                <th className="text-center p-3 font-semibold">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {teamOrderData.map((row, idx) => {
                const ach = row.plan > 0 ? ((row.actual / row.plan) * 100).toFixed(1) : 0;
                const defPct = row.actual > 0 ? ((row.defects / row.actual) * 100).toFixed(1) : 0;
                const target = orderTargets[row.jobNumber]?.totalQty || row.plan;
                const isComplete = row.actual >= target;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-700">{row.jobNumber}</td>
                    <td className="p-3">{row.product}</td>
                    <td className="p-3 text-center">{row.plan}</td>
                    <td className="p-3 text-center font-bold">{row.actual}</td>
                    <td className="p-3 text-center font-bold" style={{ color: parseFloat(ach) >= 95 ? '#15803d' : parseFloat(ach) >= 80 ? '#d97706' : '#dc2626' }}>{ach}%</td>
                    <td className="p-3 text-center">{row.defects} ({defPct}%)</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${isComplete ? 'bg-green-600' : 'bg-blue-500'}`}>
                        {isComplete ? t.statusComplete : t.statusOnTrack}
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

  // Collect all orders and their cumulative progress
  const orderProgress = {};
  reports.forEach(report => {
    (report.entries || []).forEach(entry => {
      if (!orderProgress[entry.jobNumber]) {
        orderProgress[entry.jobNumber] = {
          jobNumber: entry.jobNumber,
          product: entry.product,
          cumulative: 0,
          target: orderTargets[entry.jobNumber]?.totalQty || 500
        };
      }
      orderProgress[entry.jobNumber].cumulative += entry.actualQty;
    });
  });

  const progressData = Object.values(orderProgress).sort((a, b) => b.cumulative - a.cumulative);

  const totalOutput = reports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const totalPlan = reports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const achievement = totalPlan > 0 ? Math.round((totalOutput / totalPlan) * 100) : 0;
  const totalDefects = reports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const defectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.departmentOutput}</p>
          <p className="text-4xl font-bold">{totalOutput}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.departmentAchievementRate}</p>
          <p className="text-4xl font-bold">{achievement}%</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.defectRate}</p>
          <p className="text-4xl font-bold">{defectRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-xl font-bold">{t.orderProgress}</h3>
        </div>
        <div className="p-4 space-y-5">
          {progressData.map((order) => {
            const percent = Math.min(100, +((order.cumulative / order.target) * 100).toFixed(1));
            const deadline = orderTargets[order.jobNumber]?.deadline || '';
            const isOverdue = deadline && new Date(deadline) < new Date();
            const barColor = percent >= 100 ? 'from-green-500 to-green-600'
              : percent >= 70 ? 'from-blue-500 to-blue-600'
              : percent >= 40 ? 'from-yellow-400 to-yellow-500'
              : 'from-red-400 to-red-500';
            return (
              <div key={order.jobNumber}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="font-semibold text-blue-700">{order.jobNumber}</span>
                    <span className="text-sm text-gray-500 ml-2">{order.product}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{order.cumulative} <span className="text-sm font-normal text-gray-400">/ {order.target}</span></p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className={`bg-gradient-to-r ${barColor} h-full transition-all rounded-full`}
                    style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm font-semibold" style={{ color: percent >= 100 ? '#15803d' : percent >= 70 ? '#2563eb' : '#dc2626' }}>{percent}%</p>
                  {deadline && <p className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>{language === 'ja' ? '納期' : 'Due'}: {deadline}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QA DASHBOARD
// ============================================================================
const QADashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const criticalReports = reports.filter(r => r.routeType === 'critical');
  const majorReports = reports.filter(r => r.routeType === 'major');

  const defectChart = reports
    .slice(-7)
    .map(r => ({
      date: r.date.slice(-2),
      defects: r.totalDefects || 0,
      rate: r.defectRate || 0
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">Critical Reports</p>
          <p className="text-4xl font-bold">{criticalReports.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">Major Issues</p>
          <p className="text-4xl font-bold">{majorReports.length}</p>
        </div>
      </div>

      {/* Defect Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t.defectTrend}</h3>
        {defectChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={defectChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="defects" stroke="#ef4444" name="Count" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No data</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAINTENANCE LEAD DASHBOARD
// ============================================================================
const MaintenanceLeadDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const reportsWithDowntime = reports.filter(r => (r.downtimeEntries || []).length > 0);
  const totalDowntime = reportsWithDowntime.reduce((s, r) => {
    return s + (r.downtimeEntries || []).reduce((dt, d) => dt + calcHours(d.startTime, d.endTime), 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
        <p className="text-lg opacity-90">計画外停止</p>
        <p className="text-4xl font-bold">{reportsWithDowntime.length}</p>
        <p className="text-sm mt-2">累計: {totalDowntime.toFixed(2)}時間</p>
      </div>

      {reportsWithDowntime.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h3 className="text-xl font-bold">停止時間記録</h3>
          </div>
          <div className="divide-y">
            {reportsWithDowntime.slice(-10).map((report) => (
              (report.downtimeEntries || []).map((dt, idx) => (
                <div key={`${report.id}-${idx}`} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{report.date} {dt.startTime}-{dt.endTime}</p>
                      <p className="text-sm text-gray-600">{dt.machine}</p>
                      <p className="text-sm text-gray-700 mt-1">{dt.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                      dt.planned ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {dt.planned ? '計画' : '突発'}
                    </span>
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DIRECTOR DASHBOARD
// ============================================================================
const DirectorDashboard = ({ currentUser, language, reports }) => {
  const t = translations[language];
  const totalOutput = reports.reduce((s, r) => s + (r.totalActualQty || 0), 0);
  const totalPlan = reports.reduce((s, r) => s + (r.totalPlanQty || 0), 0);
  const totalDefects = reports.reduce((s, r) => s + (r.totalDefects || 0), 0);
  const achievement = totalPlan > 0 ? Math.round((totalOutput / totalPlan) * 100) : 0;
  const defectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100) : 0;
  const criticalCount = reports.filter(r => r.routeType === 'critical').length;

  const dailyData = {};
  reports.forEach(r => {
    if (!dailyData[r.date]) {
      dailyData[r.date] = { date: r.date, output: 0, defects: 0 };
    }
    dailyData[r.date].output += r.totalActualQty || 0;
    dailyData[r.date].defects += r.totalDefects || 0;
  });

  const chartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.totalOutputQty}</p>
          <p className="text-4xl font-bold">{totalOutput}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.achievementRate}</p>
          <p className="text-4xl font-bold">{achievement}%</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">Critical</p>
          <p className="text-4xl font-bold">{criticalCount}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg opacity-90">{t.defectRate}</p>
          <p className="text-4xl font-bold">{defectRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Output Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t.outputChart}</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="output" fill="#3b82f6" name="Output" />
              <Line yAxisId="right" type="monotone" dataKey="defects" stroke="#ef4444" name="Defects" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No data</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// REPORT LIST
// ============================================================================
const ReportList = ({ currentUser, language, reports, onViewReport, onEditReport, onCancelSubmit }) => {
  const t = translations[language];
  const filteredReports = currentUser?.role === 'operator'
    ? reports.filter(r => r.operatorId === currentUser.id)
    : reports;

  const statusConfig = {
    'DRAFT': { label: t.statusDraft, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    'SUBMITTED': { label: t.statusSubmitted, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'TL_REVIEWING': { label: t.statusTlReviewing, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'QA_REVIEWING': { label: t.statusQaReviewing, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'SM_REVIEWING': { label: t.statusSmReviewing, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'DIR_REVIEWING': { label: t.statusDirReviewing, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'COMPLETED': { label: t.statusCompleted, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'REJECTED': { label: t.statusRejected, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-2xl font-bold">{t.recentReportsTable}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="text-left p-4 font-semibold">{t.shift}</th>
                <th className="text-left p-4 font-semibold">{t.date}</th>
                <th className="text-center p-4 font-semibold">{t.entryCount}</th>
                <th className="text-center p-4 font-semibold">{t.quantity}</th>
                <th className="text-center p-4 font-semibold">{t.achievementRate}</th>
                <th className="text-center p-4 font-semibold">{t.defectRate}</th>
                <th className="text-left p-4 font-semibold">{t.reportStatus}</th>
                <th className="text-center p-4 font-semibold">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReports.slice(-30).reverse().map((report) => {
                const summary = getReportSummary(report);
                const st = statusConfig[report.status] || statusConfig['DRAFT'];
                const isOwner = report.operatorId === currentUser?.id;
                const canEdit = isOwner && (report.status === 'DRAFT' || report.status === 'REJECTED');
                const canCancel = isOwner && (report.status === 'SUBMITTED' || report.status === 'TL_REVIEWING');

                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="p-4">{report.shift}班</td>
                    <td className="p-4">{report.date}</td>
                    <td className="p-4 text-center font-semibold">{(report.entries || []).length}</td>
                    <td className="p-4 text-center">{summary.totalActual}/{summary.totalPlan}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{summary.achievement}%</td>
                    <td className="p-4 text-center">{summary.defectRate.toFixed(2)}%</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => onViewReport(report)}
                          className="px-3 py-1.5 rounded-lg font-bold text-sm transition active:scale-[0.97] bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
                          <Eye className="w-4 h-4" />{t.viewDetail}
                        </button>
                        {canEdit && onEditReport && (
                          <button onClick={() => onEditReport(report)}
                            className="px-3 py-1.5 rounded-lg font-bold text-sm transition active:scale-[0.97] bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1">
                            <Edit2 className="w-4 h-4" />{t.edit}
                          </button>
                        )}
                        {canCancel && onCancelSubmit && (
                          <button onClick={() => onCancelSubmit(report)}
                            className="px-3 py-1.5 rounded-lg font-bold text-sm transition active:scale-[0.97] bg-red-500 text-white hover:bg-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />{t.withdraw}
                          </button>
                        )}
                      </div>
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
// REPORT DETAIL SCREEN
// ============================================================================
const ReportDetailScreen = ({ report, currentUser, language, onBack, onUpdateReport, onDeleteReport, onEditReport, onCancelSubmit, onNavigate }) => {
  const t = translations[language];
  const summary = getReportSummary(report);

  const canApprove = ['team_leader', 'section_manager', 'qa', 'director'].includes(currentUser?.role);
  const showApproveButtons = canApprove && report.status !== 'COMPLETED' && report.status !== 'DRAFT' && report.status !== 'REJECTED';
  const [confirmDialog, setConfirmDialog] = useState(null); // null | 'approve' | 'reject'
  const [headerHidden, setHeaderHidden] = useState(false);
  const mainRef = React.useRef(null);

  const handleDetailScroll = (e) => {
    setHeaderHidden(e.target.scrollTop > 80);
  };

  const handleApprove = () => {
    setConfirmDialog('approve');
  };

  const handleReject = () => {
    setConfirmDialog('reject');
  };

  const executeApprove = () => {
    onUpdateReport({ ...report, status: 'COMPLETED' });
    setConfirmDialog(null);
    if (onNavigate) onNavigate('approvals');
    else onBack();
  };

  const executeReject = () => {
    onUpdateReport({ ...report, status: 'DRAFT' });
    setConfirmDialog(null);
    if (onNavigate) onNavigate('approvals');
    else onBack();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ═══ FIXED ACTION BAR ═══ */}
      <div className={`flex-shrink-0 z-30 transition-all duration-300 ease-in-out ${
        headerHidden
          ? 'bg-slate-800 shadow-xl'
          : 'bg-white border-b border-slate-200 shadow-sm'
      }`}>
        <div className="px-4 py-2.5 flex items-center gap-2">
          <button onClick={onBack}
            className={`p-2.5 rounded-xl font-bold transition ${
              headerHidden ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className={`font-bold truncate transition-colors duration-300 ${
              headerHidden ? 'text-white text-base' : 'text-slate-800 text-xl'
            }`}>
              {headerHidden
                ? `${report.operatorName}  ·  ${summary.totalActual}/${summary.totalPlan}  ·  ${summary.achievement}%`
                : t.reportDetail}
            </h1>
          </div>

          {/* Edit button for DRAFT / REJECTED */}
          {(report.status === 'DRAFT' || report.status === 'REJECTED') && onEditReport && report.operatorId === currentUser?.id && (
            <button onClick={() => onEditReport(report)}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                headerHidden
                  ? 'bg-amber-500 text-white hover:bg-amber-400'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}>
              <Edit2 className="w-4 h-4" />{t.edit}
            </button>
          )}
          {/* Cancel/Withdraw button for SUBMITTED / TL_REVIEWING (owner only) */}
          {(report.status === 'SUBMITTED' || report.status === 'TL_REVIEWING') && onCancelSubmit && report.operatorId === currentUser?.id && (
            <button onClick={() => onCancelSubmit(report)}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                headerHidden
                  ? 'bg-red-500 text-white hover:bg-red-400'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}>
              <XCircle className="w-4 h-4" />{t.withdrawLong}
            </button>
          )}
          {/* Approve / Reject buttons for reviewers */}
          {showApproveButtons && (
            <>
              <button onClick={handleApprove}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                  headerHidden
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                <Check className="w-4 h-4" />{t.approveBtn}
              </button>
              <button onClick={handleReject}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                  headerHidden
                    ? 'bg-red-500 text-white hover:bg-red-400'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}>
                <X className="w-4 h-4" />{t.rejectBtn}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div ref={mainRef} onScroll={handleDetailScroll} className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-6">

      {/* Report Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">{t.date}</p>
            <p className="text-xl font-bold">{report.date}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t.shift}</p>
            <p className="text-xl font-bold">{report.shift}班</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t.reportOperator}</p>
            <p className="text-xl font-bold">{report.operatorName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t.reportStatus}</p>
            <span className="inline-block px-3 py-1 rounded text-xs font-semibold text-white bg-blue-600">
              {report.status}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">{t.summary}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">{t.planQuantity}</p>
            <p className="text-3xl font-bold text-blue-600">{summary.totalPlan}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t.actualQuantity}</p>
            <p className="text-3xl font-bold text-green-600">{summary.totalActual}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">成績率</p>
            <p className="text-3xl font-bold text-purple-600">{summary.achievement}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{t.defectRate}</p>
            <p className="text-3xl font-bold text-red-600">{summary.defectRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Production Entries */}
      {(report.entries || []).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{t.productionLineDetail}</h2>
          <div className="space-y-4">
            {report.entries.map((entry, idx) => (
              <div key={entry.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-bold">{t.linePrefix} {idx + 1}: {entry.jobNumber}</p>
                    <p className="text-gray-600">{entry.product}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{entry.startTime} - {entry.endTime}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">{t.planQuantity}</p>
                    <p className="text-lg font-bold">{entry.planQty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t.actualQuantity}</p>
                    <p className="text-lg font-bold text-green-600">{entry.actualQty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t.achievementRate}</p>
                    <p className="text-lg font-bold">{entry.planQty > 0 ? Math.round((entry.actualQty / entry.planQty) * 100) : 0}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t.machine}</p>
                    <p className="text-sm font-semibold">{entry.machines.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t.defectsLabel}</p>
                    <p className="text-lg font-bold text-red-600">{(entry.defects || []).reduce((s, d) => s + (d.count || 0), 0)}</p>
                  </div>
                </div>
                {(entry.defects || []).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm font-semibold mb-2">{t.defectDetail}</p>
                    <div className="space-y-1">
                      {entry.defects.map((defect, didx) => (
                        <p key={didx} className="text-sm text-gray-700">
                          {defect.type} ({defect.severity}) - {defect.count}{t.defectCount}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Downtime Entries */}
      {(report.downtimeEntries || []).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{t.downtimeSection}</h2>
          <div className="space-y-3">
            {report.downtimeEntries.map((dt, idx) => (
              <div key={idx} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{dt.startTime} - {dt.endTime}</p>
                    <p className="text-gray-600">{dt.machine}</p>
                    <p className="text-sm mt-2">{dt.reason}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                    dt.planned ? 'bg-blue-600' : 'bg-red-600'
                  }`}>
                    {dt.planned ? '計画' : '突発'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Narratives */}
      {report.narratives && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{t.narrativeSection}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">{t.workTarget}</p>
              <p className="text-lg text-gray-800">{report.narratives.target}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">{t.workResults}</p>
              <p className="text-lg text-gray-800">{report.narratives.results}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">{t.improvementPoints}</p>
              <p className="text-lg text-gray-800">{report.narratives.improvement}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">{t.tomorrowPlan}</p>
              <p className="text-lg text-gray-800">{report.narratives.tomorrow}</p>
            </div>
          </div>
        </div>
      )}

      </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-3">
              {confirmDialog === 'approve' ? t.confirmApproveTitle : t.confirmRejectTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmDialog === 'approve' ? t.confirmApproveMsg : t.confirmRejectMsg}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                {t.confirmNo}
              </button>
              <button
                onClick={confirmDialog === 'approve' ? executeApprove : executeReject}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                  confirmDialog === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {t.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REPORT CREATION FORM - MULTI-LINE SUPPORT
// ============================================================================
const ReportCreationForm = ({ currentUser, language, onBack, onSave, isNavMode, schedule, editingReport }) => {
  const t = translations[language];
  const mainRef = React.useRef(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const isEditing = !!editingReport;

  // Build initial entries from editing report or production schedule
  const buildInitialEntries = () => {
    if (editingReport && editingReport.entries) {
      return editingReport.entries.map((e, idx) => ({
        ...e, id: e.id || String(idx + 1), defects: e.defects || []
      }));
    }
    if (!schedule || !schedule.entries || schedule.entries.length === 0) {
      return [{
        id: '1', jobNumber: 'J2025-001', product: 'フランジ加工品',
        machines: ['CNC-001'], startTime: '07:00', endTime: '16:00',
        planQty: 120, actualQty: 120, defects: []
      }];
    }
    return schedule.entries.map((se, idx) => ({
      id: String(idx + 1),
      jobNumber: se.jobNumber,
      product: se.product,
      machines: se.machines || ['CNC-001'],
      startTime: se.startTime,
      endTime: se.endTime,
      planQty: se.planQty,
      actualQty: se.planQty,
      defects: se.defects || []
    }));
  };

  const [formData, setFormData] = useState({
    date: editingReport?.date || schedule?.date || new Date().toISOString().split('T')[0],
    shift: editingReport?.shift || schedule?.shift || 'A',
    entries: buildInitialEntries(),
    setupEntries: editingReport?.setupEntries || schedule?.setupEntries || [],
    downtimeEntries: editingReport?.downtimeEntries || schedule?.downtimeEntries || [],
    narratives: editingReport?.narratives || {
      target: '',
      results: '',
      improvement: '',
      tomorrow: ''
    }
  });

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, field: '', index: -1 });
  const [multiSelectState, setMultiSelectState] = useState({ isOpen: false, field: '', index: -1 });

  // Defect wizard: step 1=type, 2=rootCause, 3=countermeasure
  const [defectWizard, setDefectWizard] = useState({ step: 0, entryIdx: -1, defectCode: '', defectName: '', rootCause: null, countermeasure: null });

  const machines = ['CNC-001', 'CNC-002', 'CNC-003', 'CNC-004', 'CNC-005'];
  const products = [
    { jobNum: 'J2025-001', name: 'フランジ加工品', plan: 120 },
    { jobNum: 'J2025-002', name: 'シャフト部品', plan: 80 },
    { jobNum: 'J2025-003', name: 'ギアケース', plan: 60 },
    { jobNum: 'J2025-004', name: 'ベアリングハウジング', plan: 100 },
    { jobNum: 'J2025-005', name: 'バルブボディ', plan: 150 },
    { jobNum: 'J2025-006', name: 'ポンプインペラ', plan: 40 },
    { jobNum: 'J2025-007', name: 'クランクシャフト', plan: 90 },
    { jobNum: 'J2025-008', name: 'シリンダーヘッド', plan: 200 },
  ];

  const handleScroll = (e) => {
    const isScrolled = e.target.scrollTop > 100;
    setHeaderHidden(isScrolled);
  };

  const addEntry = () => {
    const newId = (Math.max(...formData.entries.map(e => parseInt(e.id)), 0) + 1).toString();
    // Smart default: continue from last entry's end time
    const lastEntry = formData.entries[formData.entries.length - 1];
    const nextStart = lastEntry?.endTime || '12:00';
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, {
        id: newId,
        jobNumber: '',
        product: '',
        machines: lastEntry?.machines || ['CNC-001'],
        startTime: nextStart,
        endTime: '16:30',
        planQty: 0,
        actualQty: 0,
        defects: []
      }]
    }));
  };

  const updateEntry = (index, updates) => {
    setFormData(prev => {
      const newEntries = [...prev.entries];
      newEntries[index] = { ...newEntries[index], ...updates };
      return { ...prev, entries: newEntries };
    });
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 1) {
      setFormData(prev => ({
        ...prev,
        entries: prev.entries.filter((_, i) => i !== index)
      }));
    }
  };

  const addDefectToEntry = (entryIdx) => {
    setDefectWizard({ step: 1, entryIdx, defectCode: '', defectName: '', rootCause: null, countermeasure: null });
  };

  const finishDefectWizard = (wizard) => {
    if (wizard.entryIdx >= 0 && wizard.defectCode) {
      setFormData(prev => {
        const newEntries = [...prev.entries];
        const existingDefects = [...(newEntries[wizard.entryIdx].defects || [])];
        existingDefects.push({
          code: wizard.defectCode,
          name: wizard.defectName,
          count: 1,
          severity: 'minor',
          rootCause: wizard.rootCause,
          countermeasure: wizard.countermeasure
        });
        newEntries[wizard.entryIdx] = { ...newEntries[wizard.entryIdx], defects: existingDefects };
        return { ...prev, entries: newEntries };
      });
    }
    setDefectWizard({ step: 0, entryIdx: -1, defectCode: '', defectName: '', rootCause: null, countermeasure: null });
  };

  const removeDefectFromEntry = (entryIdx, defectIdx) => {
    setFormData(prev => {
      const newEntries = [...prev.entries];
      const newDefects = [...newEntries[entryIdx].defects];
      newDefects.splice(defectIdx, 1);
      newEntries[entryIdx] = { ...newEntries[entryIdx], defects: newDefects };
      return { ...prev, entries: newEntries };
    });
  };

  const updateDefectInEntry = (entryIdx, defectIdx, updates) => {
    setFormData(prev => {
      const newEntries = [...prev.entries];
      const newDefects = [...newEntries[entryIdx].defects];
      newDefects[defectIdx] = { ...newDefects[defectIdx], ...updates };
      newEntries[entryIdx] = { ...newEntries[entryIdx], defects: newDefects };
      return { ...prev, entries: newEntries };
    });
  };

  const addSetupEntry = () => {
    const lastEntry = formData.entries[formData.entries.length - 1];
    setFormData(prev => ({
      ...prev,
      setupEntries: [...prev.setupEntries, {
        id: Date.now().toString(),
        startTime: lastEntry?.endTime || '11:00',
        endTime: '12:00',
        type: 'changeover',
        fromJob: formData.entries.length > 0 ? formData.entries[0].jobNumber : '',
        toJob: '',
        machines: lastEntry?.machines || ['CNC-001'],
        notes: ''
      }]
    }));
  };

  const updateSetupEntry = (index, updates) => {
    setFormData(prev => {
      const newSetups = [...prev.setupEntries];
      newSetups[index] = { ...newSetups[index], ...updates };
      return { ...prev, setupEntries: newSetups };
    });
  };

  const removeSetupEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      setupEntries: prev.setupEntries.filter((_, i) => i !== index)
    }));
  };

  const addDowntimeEntry = () => {
    setFormData(prev => ({
      ...prev,
      downtimeEntries: [...prev.downtimeEntries, {
        id: Date.now().toString(),
        startTime: '10:00',
        endTime: '10:30',
        machine: 'CNC-001',
        planned: false,
        reason: ''
      }]
    }));
  };

  const updateDowntimeEntry = (index, updates) => {
    setFormData(prev => {
      const newDT = [...prev.downtimeEntries];
      newDT[index] = { ...newDT[index], ...updates };
      return { ...prev, downtimeEntries: newDT };
    });
  };

  const removeDowntimeEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      downtimeEntries: prev.downtimeEntries.filter((_, i) => i !== index)
    }));
  };

  const updateNarrative = (field, value) => {
    setFormData(prev => ({
      ...prev,
      narratives: { ...prev.narratives, [field]: value }
    }));
  };

  const handleSave = () => {
    const summary = {
      totalPlanQty: formData.entries.reduce((s, e) => s + (e.planQty || 0), 0),
      totalActualQty: formData.entries.reduce((s, e) => s + (e.actualQty || 0), 0),
      totalDefects: formData.entries.reduce((s, e) => {
        return s + (e.defects || []).reduce((ds, d) => ds + (d.count || 0), 0);
      }, 0),
    };

    const maxSeverity = formData.entries.reduce((max, e) => {
      const entryMax = (e.defects || []).reduce((emax, d) => {
        if (d.severity === 'critical') return 'critical';
        if (d.severity === 'major' && emax !== 'critical') return 'major';
        return emax;
      }, 'minor');
      if (entryMax === 'critical') return 'critical';
      if (entryMax === 'major' && max !== 'critical') return 'major';
      return max;
    }, 'minor');

    const defectRate = summary.totalActualQty > 0
      ? ((summary.totalDefects / summary.totalActualQty) * 100)
      : 0;

    let routeType = 'normal';
    if (maxSeverity === 'critical' || defectRate > 10) routeType = 'critical';
    else if (maxSeverity === 'major' || (defectRate >= 5 && defectRate <= 10)) routeType = 'major';

    const newReport = {
      id: Date.now(),
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      date: formData.date,
      shift: formData.shift,
      status: 'DRAFT',
      routeType,
      maxSeverity,
      defectRate: +defectRate.toFixed(2),
      entries: formData.entries,
      setupEntries: formData.setupEntries,
      downtimeEntries: formData.downtimeEntries,
      narratives: formData.narratives,
      ...summary,
      achievement: summary.totalPlanQty > 0
        ? Math.round((summary.totalActualQty / summary.totalPlanQty) * 100)
        : 0,
      variance: summary.totalPlanQty > 0
        ? +((summary.totalActualQty - summary.totalPlanQty) / summary.totalPlanQty * 100).toFixed(1)
        : 0,
      hours: { regular: 7.5, overtime: 0, downtime: 0 },
      evaluation: null,
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString().split('T')[0],
      team: currentUser.team
    };

    onSave(newReport);
  };

  const handleSubmit = () => {
    const summaryCalc = {
      totalPlanQty: formData.entries.reduce((s, e) => s + (e.planQty || 0), 0),
      totalActualQty: formData.entries.reduce((s, e) => s + (e.actualQty || 0), 0),
      totalDefects: formData.entries.reduce((s, e) => {
        return s + (e.defects || []).reduce((ds, d) => ds + (d.count || 0), 0);
      }, 0),
    };
    const maxSeverity = formData.entries.reduce((max, e) => {
      const entryMax = (e.defects || []).reduce((emax, d) => {
        if (d.severity === 'critical') return 'critical';
        if (d.severity === 'major' && emax !== 'critical') return 'major';
        return emax;
      }, 'minor');
      if (entryMax === 'critical') return 'critical';
      if (entryMax === 'major' && max !== 'critical') return 'major';
      return max;
    }, 'minor');
    const defectRate = summaryCalc.totalActualQty > 0 ? ((summaryCalc.totalDefects / summaryCalc.totalActualQty) * 100) : 0;
    let routeType = 'normal';
    if (maxSeverity === 'critical' || defectRate > 10) routeType = 'critical';
    else if (maxSeverity === 'major' || (defectRate >= 5 && defectRate <= 10)) routeType = 'major';

    const newReport = {
      id: Date.now(),
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      date: formData.date,
      shift: formData.shift,
      status: 'SUBMITTED',
      routeType,
      maxSeverity,
      defectRate: +defectRate.toFixed(2),
      entries: formData.entries,
      setupEntries: formData.setupEntries,
      downtimeEntries: formData.downtimeEntries,
      narratives: formData.narratives,
      ...summaryCalc,
      achievement: summaryCalc.totalPlanQty > 0
        ? Math.round((summaryCalc.totalActualQty / summaryCalc.totalPlanQty) * 100)
        : 0,
      variance: summaryCalc.totalPlanQty > 0
        ? +((summaryCalc.totalActualQty - summaryCalc.totalPlanQty) / summaryCalc.totalPlanQty * 100).toFixed(1)
        : 0,
      hours: { regular: 7.5, overtime: 0, downtime: 0 },
      evaluation: null,
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString().split('T')[0],
      team: currentUser.team
    };
    onSave(newReport);
  };

  const summary = {
    totalPlan: formData.entries.reduce((s, e) => s + (e.planQty || 0), 0),
    totalActual: formData.entries.reduce((s, e) => s + (e.actualQty || 0), 0),
    totalDefects: formData.entries.reduce((s, e) => {
      return s + (e.defects || []).reduce((ds, d) => ds + (d.count || 0), 0);
    }, 0),
  };

  const totalSetupMins = formData.setupEntries.reduce((s, e) => s + calcHours(e.startTime, e.endTime) * 60, 0);
  const totalDowntimeMins = formData.downtimeEntries.reduce((s, e) => s + calcHours(e.startTime, e.endTime) * 60, 0);

  const machineOptions = machines.map(m => ({ value: m, label: m }));
  const productOptions = products.map(p => ({ value: p.jobNum, label: `${p.jobNum} - ${p.name}` }));

  const achievementPct = summary.totalPlan > 0 ? Math.round((summary.totalActual / summary.totalPlan) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ═══ FIXED ACTION BAR ═══ */}
      <div className={`flex-shrink-0 z-30 transition-all duration-300 ease-in-out ${
        headerHidden
          ? 'bg-slate-800 shadow-xl'
          : 'bg-white border-b border-slate-200 shadow-sm'
      }`}>
        <div className="px-4 py-2.5 flex items-center gap-2">
          <button onClick={onBack}
            className={`p-2.5 rounded-xl font-bold transition ${
              headerHidden ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className={`font-bold truncate transition-colors duration-300 ${
              headerHidden ? 'text-white text-base' : 'text-slate-800 text-xl'
            }`}>
              {headerHidden
                ? `${formData.entries.length}ライン  ·  ${summary.totalActual}/${summary.totalPlan}個  ·  ${achievementPct}%`
                : isEditing ? t.editReportTitle : t.newReportTitle}
            </h1>
          </div>

          <button onClick={handleSave}
            className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
              headerHidden
                ? 'bg-slate-600 text-slate-200 hover:bg-slate-500 border border-slate-500'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-300'
            }`}
          >
            <Save className="w-4 h-4" />
            {t.saveDraft}
          </button>
          <button onClick={() => setShowSubmitDialog(true)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
              headerHidden
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            {t.submit}
          </button>
        </div>
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div ref={mainRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">

          {/* ── Date & Shift ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.date}</label>
                <input type="date" value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3.5 text-lg border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.shift}</label>
                <button onClick={() => setModalState({ isOpen: true, field: 'shift', index: -1 })}
                  className="w-full px-4 py-3.5 text-lg bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition active:scale-[0.98]"
                >
                  {formData.shift}班
                </button>
              </div>
            </div>
          </div>

          {/* ── Schedule info banner (only for new reports) ── */}
          {!isEditing && schedule && schedule.entries && schedule.entries.length > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">
                  {t.scheduleBannerTitle}
                </span>
              </div>
              <p className="text-sm text-emerald-600 mb-3">
                {t.scheduleBannerMsg}
              </p>
              <div className="flex gap-3">
                {schedule.entries.map((se, i) => (
                  <div key={i} className="flex-1 bg-white rounded-xl px-3 py-2.5 border border-emerald-200">
                    <p className="font-bold text-slate-800 text-sm truncate">{se.product}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{se.jobNumber} · {se.startTime}–{se.endTime}</p>
                    <p className="text-emerald-700 text-xs font-bold mt-1">{t.schedulePlanLabel} {se.planQty}{t.defectCount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Section header: Production Entries ── */}
          <div className="flex items-center gap-3 px-1 pt-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-1 h-6 bg-slate-800 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-800">{t.productionEntries}</h2>
              <span className="bg-slate-800 text-white text-xs font-bold px-2 py-0.5 rounded-full">{formData.entries.length}</span>
            </div>
          </div>

          {/* ── Entry Cards ── */}
          {formData.entries.map((entry, idx) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Entry Header */}
              <div className="bg-slate-800 text-white px-5 py-3.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-slate-800 text-sm font-black w-7 h-7 rounded-lg flex items-center justify-center">{idx + 1}</span>
                    <div>
                      <p className="font-bold text-base">{entry.product || <span className="text-slate-400 italic">{t.notSelected}</span>}</p>
                      <p className="text-slate-400 text-sm">{entry.jobNumber || '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{entry.actualQty}<span className="text-sm font-normal text-slate-400">/{entry.planQty}</span></p>
                    <p className="text-xs text-slate-400">{entry.startTime} – {entry.endTime}</p>
                    {entry.actualQty !== entry.planQty && entry.planQty > 0 && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                        entry.actualQty >= entry.planQty ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {entry.actualQty >= entry.planQty ? '+' : ''}{entry.actualQty - entry.planQty}個
                      </span>
                    )}
                    {entry.actualQty === entry.planQty && entry.planQty > 0 && (
                      <span className="text-xs text-emerald-400 mt-0.5 inline-block">✓ {t.onPlan}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Entry Body */}
              <div className="p-5 space-y-5">
                {/* Order selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.orderProduct}</label>
                  <button onClick={() => setModalState({ isOpen: true, field: 'product', index: idx })}
                    className="w-full px-4 py-3.5 text-lg rounded-xl font-semibold transition text-left active:scale-[0.98] bg-slate-100 text-slate-800 border-2 border-slate-200 hover:border-slate-400"
                  >
                    <span className="text-slate-400 text-sm mr-2">{entry.jobNumber}</span>{entry.product}
                  </button>
                </div>

                {/* Machine multi-select */}
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.machine} <span className="text-slate-400 normal-case">（{t.multiMachineHint}）</span></label>
                  <button onClick={() => setMultiSelectState({ isOpen: true, field: 'machines', index: idx })}
                    className="w-full px-4 py-3.5 text-lg rounded-xl font-semibold transition text-left active:scale-[0.98] bg-slate-100 text-slate-800 border-2 border-slate-200 hover:border-slate-400"
                  >
                    {entry.machines.length > 0
                      ? <>{entry.machines.join(' · ')} <span className="text-slate-400 text-sm">({entry.machines.length}台)</span></>
                      : <span className="text-slate-400">{t.tapToSelect}</span>}
                  </button>
                </div>

                {/* Time range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.startTime}</label>
                    <input type="time" value={entry.startTime}
                      onChange={(e) => updateEntry(idx, { startTime: e.target.value })}
                      className="w-full px-4 py-3.5 text-xl font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.endTime}</label>
                    <input type="time" value={entry.endTime}
                      onChange={(e) => updateEntry(idx, { endTime: e.target.value })}
                      className="w-full px-4 py-3.5 text-xl font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none"
                    />
                  </div>
                </div>

                {/* Quantities with +/- buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.planQuantity}</label>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateEntry(idx, { planQty: Math.max(0, (entry.planQty || 0) - 5) })}
                        className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition active:scale-95 font-bold text-lg">−5</button>
                      <input type="number" value={entry.planQty}
                        onChange={(e) => updateEntry(idx, { planQty: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-2 py-3 text-xl font-bold border-2 border-slate-200 rounded-xl text-center bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none min-w-0"
                      />
                      <button onClick={() => updateEntry(idx, { planQty: (entry.planQty || 0) + 5 })}
                        className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition active:scale-95 font-bold text-lg">+5</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.actualQuantity}</label>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateEntry(idx, { actualQty: Math.max(0, (entry.actualQty || 0) - 5) })}
                        className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition active:scale-95 font-bold text-lg">−5</button>
                      <input type="number" value={entry.actualQty}
                        onChange={(e) => updateEntry(idx, { actualQty: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-2 py-3 text-xl font-bold border-2 border-slate-200 rounded-xl text-center bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none min-w-0"
                      />
                      <button onClick={() => updateEntry(idx, { actualQty: (entry.actualQty || 0) + 5 })}
                        className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition active:scale-95 font-bold text-lg">+5</button>
                    </div>
                  </div>
                </div>

                {/* Defects for this entry */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {t.defectRecord}
                    </label>
                    <button onClick={() => addDefectToEntry(idx)} className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition">
                      <PlusCircle className="w-4 h-4" /> {t.add}
                    </button>
                  </div>
                  {entry.defects.length === 0 ? (
                    <p className="text-sm text-emerald-600 font-medium py-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> {t.noDefects}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {entry.defects.map((defect, dIdx) => (
                        <div key={dIdx} className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base font-bold text-red-700">{defect.code} - {defect.name}</span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setDefectWizard({ step: 1, entryIdx: idx, defectCode: defect.code, defectName: defect.name, rootCause: defect.rootCause, countermeasure: defect.countermeasure, editDefectIdx: dIdx })}
                                className="text-slate-400 hover:text-slate-700 transition p-1.5 hover:bg-slate-100 rounded-lg" title="編集">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => removeDefectFromEntry(idx, dIdx)} className="text-red-300 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-lg" title="削除">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Count + Severity row */}
                          <div className="flex gap-3 items-center mb-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateDefectInEntry(idx, dIdx, { count: Math.max(1, defect.count - 1) })}
                                className="bg-red-200 text-red-700 w-10 h-10 rounded-xl font-bold hover:bg-red-300 transition text-lg active:scale-95">−</button>
                              <span className="text-2xl font-black text-red-700 w-12 text-center">{defect.count}</span>
                              <button onClick={() => updateDefectInEntry(idx, dIdx, { count: defect.count + 1 })}
                                className="bg-red-200 text-red-700 w-10 h-10 rounded-xl font-bold hover:bg-red-300 transition text-lg active:scale-95">+</button>
                              <span className="text-sm text-red-500 ml-1">{t.defectCount}</span>
                            </div>
                          </div>

                          {/* Severity - BIG finger-friendly buttons */}
                          <div className="flex gap-2 mb-3">
                            {['minor', 'major', 'critical'].map(sev => (
                              <button key={sev} onClick={() => updateDefectInEntry(idx, dIdx, { severity: sev })}
                                className={`flex-1 py-3 text-base font-bold rounded-xl transition active:scale-[0.97] ${
                                  defect.severity === sev
                                    ? sev === 'critical' ? 'bg-red-600 text-white shadow-md' : sev === 'major' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}>
                                {sev === 'critical' ? t.severityCritical : sev === 'major' ? t.severityMajor : t.severityMinor}
                              </button>
                            ))}
                          </div>

                          {/* Root cause & Countermeasure display */}
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-red-400 font-semibold shrink-0 w-16">{t.rootCause}:</span>
                              {defect.rootCause ? (
                                <button onClick={() => setDefectWizard({ step: 2, entryIdx: idx, defectCode: defect.code, defectName: defect.name, rootCause: null, countermeasure: defect.countermeasure, editDefectIdx: dIdx })}
                                  className="text-slate-700 font-medium text-left hover:text-red-700 transition">
                                  {defect.rootCause.code} {defect.rootCause.name} <span className="text-slate-400 text-xs">({defect.rootCause.category})</span>
                                </button>
                              ) : (
                                <button onClick={() => setDefectWizard({ step: 2, entryIdx: idx, defectCode: defect.code, defectName: defect.name, rootCause: null, countermeasure: defect.countermeasure, editDefectIdx: dIdx })}
                                  className="text-slate-400 hover:text-red-600 transition italic">タップして選択...</button>
                              )}
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-red-400 font-semibold shrink-0 w-16">{t.countermeasure}:</span>
                              {defect.countermeasure ? (
                                <button onClick={() => setDefectWizard({ step: 3, entryIdx: idx, defectCode: defect.code, defectName: defect.name, rootCause: defect.rootCause, countermeasure: null, editDefectIdx: dIdx })}
                                  className="text-slate-700 font-medium text-left hover:text-red-700 transition">
                                  {defect.countermeasure.code} {defect.countermeasure.name}
                                </button>
                              ) : (
                                <button onClick={() => setDefectWizard({ step: 3, entryIdx: idx, defectCode: defect.code, defectName: defect.name, rootCause: defect.rootCause, countermeasure: null, editDefectIdx: dIdx })}
                                  className="text-slate-400 hover:text-red-600 transition italic">タップして選択...</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove entry */}
                {formData.entries.length > 1 && (
                  <button onClick={() => removeEntry(idx)}
                    className="w-full py-2.5 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.deleteEntry}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* ── Add Entry Button ── */}
          <button onClick={addEntry}
            className="w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 active:scale-[0.98] border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-white bg-transparent"
          >
            <PlusCircle className="w-6 h-6" />
            {t.addEntry}
          </button>

          {/* ── Section header: Setup/Changeover ── */}
          <div className="flex items-center gap-3 px-1 pt-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-800">{t.setupSection}</h2>
              {formData.setupEntries.length > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{formData.setupEntries.length}</span>
              )}
            </div>
            <button onClick={addSetupEntry} className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200">
              <PlusCircle className="w-4 h-4" /> {t.add}
            </button>
          </div>

          {formData.setupEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 text-center">
              <p className="text-sm text-slate-400">{t.noSetup}</p>
            </div>
          ) : (
            formData.setupEntries.map((setup, sIdx) => (
              <div key={setup.id || sIdx} className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
                <div className="bg-amber-500 text-white px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    <span className="font-bold">
                      {setup.type === 'changeover' ? t.setupChangeover : setup.type === 'tool_change' ? t.setupToolChange : t.setupCalibration}
                    </span>
                  </div>
                  <button onClick={() => removeSetupEntry(sIdx)} className="text-amber-200 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-4">
                  {/* Setup type selector */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupType}</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'changeover', label: t.setupChangeoverShort },
                        { value: 'tool_change', label: t.setupToolChange },
                        { value: 'calibration', label: t.setupCalibration }
                      ].map(opt => (
                        <button key={opt.value} onClick={() => updateSetupEntry(sIdx, { type: opt.value })}
                          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                            setup.type === opt.value ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupStart}</label>
                      <input type="time" value={setup.startTime}
                        onChange={(e) => updateSetupEntry(sIdx, { startTime: e.target.value })}
                        className="w-full px-4 py-3 text-lg font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-amber-400 focus:bg-white transition outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupEnd}</label>
                      <input type="time" value={setup.endTime}
                        onChange={(e) => updateSetupEntry(sIdx, { endTime: e.target.value })}
                        className="w-full px-4 py-3 text-lg font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-amber-400 focus:bg-white transition outline-none"
                      />
                    </div>
                  </div>

                  {/* From/To jobs (for changeover) */}
                  {setup.type === 'changeover' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.prevOrder}</label>
                        <div className="px-4 py-3 bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 border-2 border-slate-200">{setup.fromJob || '—'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.nextOrder}</label>
                        <div className="px-4 py-3 bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 border-2 border-slate-200">{setup.toJob || '—'}</div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupNotes}</label>
                    <input type="text" value={setup.notes || ''}
                      onChange={(e) => updateSetupEntry(sIdx, { notes: e.target.value })}
                      className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-amber-400 focus:bg-white transition outline-none"
                      placeholder={t.setupNotesPlaceholder}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ── Section header: Downtime ── */}
          <div className="flex items-center gap-3 px-1 pt-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-800">{t.downtimeSection}</h2>
              {formData.downtimeEntries.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{formData.downtimeEntries.length}</span>
              )}
            </div>
            <button onClick={addDowntimeEntry} className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200">
              <PlusCircle className="w-4 h-4" /> {t.add}
            </button>
          </div>

          {formData.downtimeEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 text-center">
              <p className="text-sm text-slate-400">{t.noDowntime}</p>
            </div>
          ) : (
            formData.downtimeEntries.map((dt, dIdx) => (
              <div key={dt.id || dIdx} className="bg-white rounded-2xl border border-red-200 overflow-hidden">
                <div className={`${dt.planned ? 'bg-blue-500' : 'bg-red-500'} text-white px-5 py-3 flex justify-between items-center`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{dt.planned ? t.plannedStop : t.unplannedStop}</span>
                    <span className="text-xs opacity-75">{dt.machine}</span>
                  </div>
                  <button onClick={() => removeDowntimeEntry(dIdx)} className="text-white/60 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-4">
                  {/* Planned toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.downtimeCategory}</label>
                    <div className="flex gap-2">
                      <button onClick={() => updateDowntimeEntry(dIdx, { planned: false })}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                          !dt.planned ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>{t.unplannedFault}</button>
                      <button onClick={() => updateDowntimeEntry(dIdx, { planned: true })}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                          dt.planned ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>{t.plannedMaint}</button>
                    </div>
                  </div>

                  {/* Machine + Time */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.downtimeMachine}</label>
                      <button onClick={() => setModalState({ isOpen: true, field: 'downtime_machine', index: dIdx })}
                        className="w-full px-3 py-3 text-base bg-slate-100 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-400 transition text-left text-slate-800">
                        {dt.machine}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupStart}</label>
                      <input type="time" value={dt.startTime}
                        onChange={(e) => updateDowntimeEntry(dIdx, { startTime: e.target.value })}
                        className="w-full px-3 py-3 text-base font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-red-400 focus:bg-white transition outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.setupEnd}</label>
                      <input type="time" value={dt.endTime}
                        onChange={(e) => updateDowntimeEntry(dIdx, { endTime: e.target.value })}
                        className="w-full px-3 py-3 text-base font-mono border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-red-400 focus:bg-white transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.reason}</label>
                    <input type="text" value={dt.reason || ''}
                      onChange={(e) => updateDowntimeEntry(dIdx, { reason: e.target.value })}
                      className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-red-400 focus:bg-white transition outline-none"
                      placeholder={dt.planned ? t.maintenancePlaceholder : t.downtimeReasonPlaceholder}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ── Summary Card ── */}
          <div className="bg-slate-800 text-white rounded-2xl p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">{t.summary}</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.planQuantity}</p>
                <p className="text-2xl font-black">{summary.totalPlan}</p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.actualQuantity}</p>
                <p className="text-2xl font-black">{summary.totalActual}</p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.achievementLabel}</p>
                <p className={`text-2xl font-black ${achievementPct >= 95 ? 'text-emerald-400' : achievementPct >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                  {achievementPct}%
                </p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.defectsLabel}</p>
                <p className={`text-2xl font-black ${summary.totalDefects === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {summary.totalDefects}
                </p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.setupLabel}</p>
                <p className={`text-2xl font-black ${totalSetupMins === 0 ? 'text-slate-300' : 'text-amber-400'}`}>
                  {Math.round(totalSetupMins)}<span className="text-sm font-normal">{t.setupTimeMin}</span>
                </p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{t.downtimeLabel}</p>
                <p className={`text-2xl font-black ${totalDowntimeMins === 0 ? 'text-slate-300' : 'text-red-400'}`}>
                  {Math.round(totalDowntimeMins)}<span className="text-sm font-normal">{t.setupTimeMin}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Narratives ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-slate-800 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-800">{t.narrativeSection}</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'target', label: t.workTarget, ph: '本日の作業目標を入力' },
                { key: 'results', label: t.workResults, ph: '作業結果を入力' },
                { key: 'improvement', label: t.improvementPoints, ph: '改善点を入力' },
                { key: 'tomorrow', label: t.tomorrowPlan, ph: '明日の予定を入力' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <textarea
                    value={formData.narratives[key]}
                    onChange={(e) => updateNarrative(key, e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-slate-400 focus:bg-white transition outline-none resize-none"
                    rows={2}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">{t.submitConfirmTitle}</h3>
            <p className="text-gray-600 mb-6">{t.submitConfirmMsg}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => { handleSubmit(); setShowSubmitDialog(false); }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                {t.submitConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ModalSelect
        isOpen={modalState.isOpen && modalState.field === 'shift'}
        onClose={() => setModalState({ isOpen: false, field: '', index: -1 })}
        title={t.shiftSelect}
        options={['A', 'B', 'C'].map(s => ({ value: s, label: `${s}班` }))}
        value={formData.shift}
        onChange={(value) => setFormData(prev => ({ ...prev, shift: value }))}
      />

      <ModalSelect
        isOpen={modalState.isOpen && modalState.field === 'product'}
        onClose={() => setModalState({ isOpen: false, field: '', index: -1 })}
        title={t.orderSelect}
        options={productOptions}
        value={modalState.index >= 0 ? formData.entries[modalState.index]?.jobNumber : ''}
        onChange={(value) => {
          const product = products.find(p => p.jobNum === value);
          if (modalState.index >= 0 && product) {
            updateEntry(modalState.index, { jobNumber: value, product: product.name, planQty: product.plan });
          }
          setModalState({ isOpen: false, field: '', index: -1 });
        }}
      />

      <ModalMultiSelect
        isOpen={multiSelectState.isOpen && multiSelectState.field === 'machines'}
        onClose={() => setMultiSelectState({ isOpen: false, field: '', index: -1 })}
        title={t.machineSelect}
        options={machineOptions}
        values={multiSelectState.index >= 0 ? (formData.entries[multiSelectState.index]?.machines || []) : []}
        onChange={(values) => {
          if (multiSelectState.index >= 0) {
            updateEntry(multiSelectState.index, { machines: values });
          }
        }}
      />

      {/* ═══ DEFECT WIZARD: Step 1 - Defect Type ═══ */}
      {defectWizard.step === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{t.defectWizardStep1}</h3>
                <button onClick={() => setDefectWizard(prev => ({ ...prev, step: 0 }))}
                  className="p-2 hover:bg-gray-100 rounded-xl text-slate-400 hover:text-slate-700 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Step indicator */}
              <div className="flex gap-1.5 mt-2">
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-200"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <div className="divide-y">
              {defectTypes.map(d => (
                <button key={d.code} onClick={() => {
                  if (defectWizard.editDefectIdx !== undefined) {
                    updateDefectInEntry(defectWizard.entryIdx, defectWizard.editDefectIdx, { code: d.code, name: d.name_ja });
                    setDefectWizard(prev => ({ ...prev, step: 2, defectCode: d.code, defectName: d.name_ja }));
                  } else {
                    setDefectWizard(prev => ({ ...prev, step: 2, defectCode: d.code, defectName: d.name_ja }));
                  }
                }} className="w-full p-4 text-left text-xl font-semibold bg-white text-gray-800 hover:bg-gray-100">
                  {d.code} - {d.name_ja}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ DEFECT WIZARD: Step 2 - Root Cause (optional) ═══ */}
      {defectWizard.step === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setDefectWizard(prev => ({ ...prev, step: 1 }))}
                  className="p-2 hover:bg-gray-100 rounded-xl text-slate-500 hover:text-slate-700 transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold flex-1">{t.defectWizardStep2}</h3>
                <button onClick={() => setDefectWizard(prev => ({ ...prev, step: 0 }))}
                  className="p-2 hover:bg-gray-100 rounded-xl text-slate-400 hover:text-slate-700 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1 ml-10">{defectWizard.defectCode} - {defectWizard.defectName}</p>
              {/* Step indicator */}
              <div className="flex gap-1.5 mt-2">
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-200"></div>
              </div>
            </div>
            {/* Skip button */}
            <button onClick={() => {
              if (defectWizard.editDefectIdx !== undefined) {
                updateDefectInEntry(defectWizard.entryIdx, defectWizard.editDefectIdx, { rootCause: null });
              }
              setDefectWizard(prev => ({ ...prev, step: 3, rootCause: null }));
            }} className="w-full p-4 text-left text-lg font-semibold bg-slate-50 text-slate-400 hover:bg-slate-100 border-b-2">
              {t.skipCause}
            </button>
            {/* Group by 4M category */}
            {['Man', 'Machine', 'Material', 'Method'].map(cat => (
              <div key={cat}>
                <div className="px-4 py-2 bg-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wide">{cat}</div>
                {rootCauses.filter(rc => rc.category === cat).map(rc => (
                  <button key={rc.code} onClick={() => {
                    const rcData = { code: rc.code, name: rc.name_ja, category: rc.category };
                    if (defectWizard.editDefectIdx !== undefined) {
                      updateDefectInEntry(defectWizard.entryIdx, defectWizard.editDefectIdx, { rootCause: rcData });
                    }
                    setDefectWizard(prev => ({ ...prev, step: 3, rootCause: rcData }));
                  }} className="w-full p-4 text-left text-xl font-semibold bg-white text-gray-800 hover:bg-gray-100 border-b">
                    {rc.code} - {rc.name_ja}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ DEFECT WIZARD: Step 3 - Countermeasure (optional) ═══ */}
      {defectWizard.step === 3 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setDefectWizard(prev => ({ ...prev, step: 2 }))}
                  className="p-2 hover:bg-gray-100 rounded-xl text-slate-500 hover:text-slate-700 transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold flex-1">{t.defectWizardStep3}</h3>
                <button onClick={() => setDefectWizard(prev => ({ ...prev, step: 0 }))}
                  className="p-2 hover:bg-gray-100 rounded-xl text-slate-400 hover:text-slate-700 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1 ml-10">
                {defectWizard.defectCode} - {defectWizard.defectName}
                {defectWizard.rootCause && <> · {defectWizard.rootCause.name}</>}
              </p>
              {/* Step indicator */}
              <div className="flex gap-1.5 mt-2">
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-1 rounded-full bg-slate-800"></div>
              </div>
            </div>
            <button onClick={() => {
              if (defectWizard.editDefectIdx !== undefined) {
                updateDefectInEntry(defectWizard.entryIdx, defectWizard.editDefectIdx, { countermeasure: null });
                setDefectWizard(prev => ({ ...prev, step: 0 }));
              } else {
                finishDefectWizard({ ...defectWizard, countermeasure: null });
              }
            }} className="w-full p-4 text-left text-lg font-semibold bg-slate-50 text-slate-400 hover:bg-slate-100 border-b-2">
              {t.skipAction}
            </button>
            <div className="divide-y">
              {countermeasures.map(cm => (
                <button key={cm.code} onClick={() => {
                  const cmData = { code: cm.code, name: cm.name_ja };
                  if (defectWizard.editDefectIdx !== undefined) {
                    updateDefectInEntry(defectWizard.entryIdx, defectWizard.editDefectIdx, { countermeasure: cmData });
                    setDefectWizard(prev => ({ ...prev, step: 0 }));
                  } else {
                    finishDefectWizard({ ...defectWizard, countermeasure: cmData });
                  }
                }} className="w-full p-4 text-left text-xl font-semibold bg-white text-gray-800 hover:bg-gray-100">
                  {cm.code} - {cm.name_ja}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ModalSelect
        isOpen={modalState.isOpen && modalState.field === 'downtime_machine'}
        onClose={() => setModalState({ isOpen: false, field: '', index: -1 })}
        title={t.machineSelect}
        options={machines.map(m => ({ value: m, label: m }))}
        value={modalState.index >= 0 ? (formData.downtimeEntries[modalState.index]?.machine || '') : ''}
        onChange={(value) => {
          if (modalState.index >= 0) {
            updateDowntimeEntry(modalState.index, { machine: value });
          }
          setModalState({ isOpen: false, field: '', index: -1 });
        }}
      />
    </div>
  );
};

// ============================================================================
// ANALYTICS PAGE
// ============================================================================
const AnalyticsPage = ({ language, reports }) => {
  const t = translations[language];
  const chartData = reports.slice(-7).map(r => ({
    date: r.date.slice(-2),
    output: r.totalActualQty || 0,
    defects: r.totalDefects || 0
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">{t.outputChart}</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="output" fill="#3b82f6" name="Output" />
              <Line type="monotone" dataKey="defects" stroke="#ef4444" name="Defects" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No data</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS PAGE
// ============================================================================
const SettingsPage = ({ language, onChangeLanguage, appSettings, onUpdateSettings, currentUser }) => {
  const t = translations[language];
  const allRoles = [
    { key: 'operator', label_ja: 'オペレータ', label_en: 'Operator' },
    { key: 'team_leader', label_ja: '班長', label_en: 'Team Leader' },
    { key: 'section_manager', label_ja: '課長', label_en: 'Section Manager' },
    { key: 'qa', label_ja: '品質管理', label_en: 'QA' },
    { key: 'maintenance_lead', label_ja: '保全リーダー', label_en: 'Maintenance Lead' },
    { key: 'director', label_ja: '工場長', label_en: 'Director' },
  ];

  const toggleReportRole = (roleKey) => {
    const current = appSettings.reportCreationRoles || [];
    const updated = current.includes(roleKey)
      ? current.filter(r => r !== roleKey)
      : [...current, roleKey];
    onUpdateSettings({ ...appSettings, reportCreationRoles: updated });
  };

  const isDirector = currentUser?.role === 'director';
  const isQA = currentUser?.role === 'qa';
  const hasAnySetting = isDirector || isQA;

  return (
    <div className="space-y-6">
      {/* Language Setting - all roles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t.language}</h3>
        <div className="flex gap-3">
          <button
            onClick={() => onChangeLanguage('ja')}
            className={`flex-1 py-3 rounded-xl font-bold text-lg transition border-2 ${
              language === 'ja' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            🇯🇵 日本語
          </button>
          <button
            onClick={() => onChangeLanguage('en')}
            className={`flex-1 py-3 rounded-xl font-bold text-lg transition border-2 ${
              language === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Threshold Settings - QA only */}
      {isQA && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{t.configuration}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">{t.defectThreshold}</label>
              <input type="number" defaultValue="5" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">{t.varianceThreshold}</label>
              <input type="number" defaultValue="10" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Report Creation Role Permission (Director only) */}
      {isDirector && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2">{t.reportCreationPermission}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.reportCreationPermissionDesc}</p>
          <div className="space-y-3">
            {allRoles.map(role => {
              const isActive = (appSettings.reportCreationRoles || []).includes(role.key);
              return (
                <label key={role.key} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleReportRole(role.key)}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                  <span className="font-medium">{language === 'ja' ? role.label_ja : role.label_en}</span>
                  {isActive && <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{t.enabled || '有効'}</span>}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* TBD placeholder for roles with no settings */}
      {!hasAnySetting && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg text-gray-400 font-medium">{t.settingsTBD}</p>
          <p className="text-sm text-gray-300 mt-1">{t.settingsTBDDesc}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// APPROVALS PAGE
// ============================================================================
const ApprovalsPage = ({ currentUser, language, reports, onViewReport }) => {
  const t = translations[language];

  let approvalsToShow = [];
  if (currentUser?.role === 'team_leader') {
    approvalsToShow = reports.filter(r => r.team === currentUser.team && r.status === 'SUBMITTED');
  } else if (currentUser?.role === 'section_manager') {
    approvalsToShow = reports.filter(r => r.status === 'TL_REVIEWING');
  } else if (currentUser?.role === 'qa') {
    approvalsToShow = reports.filter(r => r.status === 'QA_REVIEWING');
  } else if (currentUser?.role === 'director') {
    approvalsToShow = reports.filter(r => r.status === 'SM_REVIEWING' || r.status === 'DIR_REVIEWING');
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-2xl font-bold">{t.pendingApprovals}</h3>
          <p className="text-lg text-gray-600">{approvalsToShow.length}{t.countUnit}</p>
        </div>
        {approvalsToShow.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">{t.noApprovalsMessage}</p>
          </div>
        ) : (
          <div className="divide-y">
            {approvalsToShow.map((report) => {
              const summary = getReportSummary(report);
              return (
                <div key={report.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{report.operatorName} - {report.date}</p>
                      <p className="text-gray-600">{report.shift}班 | {t.entryCount}: {(report.entries || []).length}</p>
                      <p className="mt-2 text-sm">{t.actualQuantity}: {summary.totalActual} / {t.planQuantity}: {summary.totalPlan} ({summary.achievement}%)</p>
                    </div>
                    <button
                      onClick={() => onViewReport(report)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {t.confirm}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('ja');
  const [reports, setReports] = useState(generateMockReports());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [appSettings, setAppSettings] = useState({
    reportCreationRoles: ['operator', 'team_leader'], // roles that can create new reports
  });
  const users = useMemo(() => generateMockUsers(), []);
  const t = translations[language];

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    setSelectedReport(null);
  };

  const handleBack = () => {
    setPageHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      const prevPage = newHistory[newHistory.length - 1];
      setCurrentPage(prevPage);
      setSelectedReport(null);
      return newHistory;
    });
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setPageHistory(prev => [...prev, 'report-detail']);
    setCurrentPage('report-detail');
  };

  const handleSaveReport = (newReport) => {
    if (editingReport) {
      // Update existing report
      setReports(reports.map(r => r.id === editingReport.id ? { ...newReport, id: editingReport.id } : r));
      setEditingReport(null);
    } else {
      setReports([...reports, newReport]);
    }
    setCurrentPage('reports');
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setCurrentPage('new-report');
  };

  const handleCancelSubmit = (report) => {
    // Withdraw submitted report back to DRAFT
    const updated = { ...report, status: 'DRAFT' };
    setReports(reports.map(r => r.id === report.id ? updated : r));
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport(updated);
    }
  };

  const handleUpdateReport = (updatedReport) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
    setSelectedReport(updatedReport);
  };

  const handleDeleteReport = (reportId) => {
    setReports(reports.filter(r => r.id !== reportId));
    setCurrentPage('reports');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        language={language}
        activePage={currentPage}
        appSettings={appSettings}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}>
        {/* Top Bar - Hidden when in report creation */}
        {currentPage !== 'new-report' && currentPage !== 'report-detail' && (
          <div className="bg-white border-b-2 border-gray-200 shadow p-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              {currentPage !== 'dashboard' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <h1 className="text-2xl font-bold">
                {{ 'dashboard': t.dashboardTitle, 'reports': t.reports, 'approvals': t.approvals || t.pendingApprovals, 'analytics': t.analytics, 'settings': t.settings, 'report-detail': t.reportDetail }[currentPage] || t.appTitle}
              </h1>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className={`flex-1 overflow-auto ${(currentPage === 'new-report' || currentPage === 'report-detail') ? '' : 'p-4'}`}>
          {currentPage === 'dashboard' && (
            <div>
              {currentUser.role === 'operator' && <OperatorDashboard currentUser={currentUser} language={language} reports={reports} />}
              {currentUser.role === 'team_leader' && <TeamLeaderDashboard currentUser={currentUser} language={language} reports={reports} users={users} onNavigate={handleNavigate} />}
              {currentUser.role === 'section_manager' && <SectionManagerDashboard currentUser={currentUser} language={language} reports={reports} />}
              {currentUser.role === 'qa' && <QADashboard currentUser={currentUser} language={language} reports={reports} />}
              {currentUser.role === 'maintenance_lead' && <MaintenanceLeadDashboard currentUser={currentUser} language={language} reports={reports} />}
              {currentUser.role === 'director' && <DirectorDashboard currentUser={currentUser} language={language} reports={reports} />}
            </div>
          )}

          {currentPage === 'reports' && (
            <div>
              <ReportList currentUser={currentUser} language={language} reports={reports} onViewReport={handleViewReport} onEditReport={handleEditReport} onCancelSubmit={handleCancelSubmit} />
            </div>
          )}

          {currentPage === 'new-report' && appSettings.reportCreationRoles.includes(currentUser.role) && (
            <ReportCreationForm currentUser={currentUser} language={language} onBack={() => { setEditingReport(null); handleNavigate('reports'); }} onSave={handleSaveReport} schedule={getOperatorSchedule(currentUser.username)} editingReport={editingReport} />
          )}

          {currentPage === 'report-detail' && selectedReport && (
            <ReportDetailScreen
              report={selectedReport}
              currentUser={currentUser}
              language={language}
              onBack={handleBack}
              onUpdateReport={handleUpdateReport}
              onDeleteReport={handleDeleteReport}
              onEditReport={handleEditReport}
              onCancelSubmit={handleCancelSubmit}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'approvals' && (
            <div>
              <ApprovalsPage currentUser={currentUser} language={language} reports={reports} onViewReport={handleViewReport} />
            </div>
          )}

          {currentPage === 'analytics' && (
            <div>
              <AnalyticsPage language={language} reports={reports} />
            </div>
          )}

          {currentPage === 'settings' && (
            <div>
              <SettingsPage language={language} onChangeLanguage={setLanguage} appSettings={appSettings} onUpdateSettings={setAppSettings} currentUser={currentUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
