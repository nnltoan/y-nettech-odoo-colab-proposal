const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak } = require('docx');
const fs = require('fs');

// ── Constants ──
const PAGE_W = 11906; // A4 width DXA
const CONTENT_W = 9026; // A4 minus 1" margins
const BLUE = '1F4E79';
const LIGHT_BLUE = 'D6E4F0';
const GRAY_BG = 'F2F2F2';
const GREEN = '2E7D32';
const ORANGE = 'E65100';
const RED = 'C62828';
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_M = { top: 60, bottom: 60, left: 100, right: 100 };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun({ text, bold: true })] });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts.pOpts,
    children: [new TextRun({ text, size: 22, font: 'Yu Gothic', ...opts })]
  });
}

function boldPara(text, opts = {}) {
  return para(text, { bold: true, ...opts });
}

function cell(text, opts = {}) {
  const { bold, fill, align, width } = opts;
  return new TableCell({
    borders: BORDERS,
    margins: CELL_M,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text: text || '', size: 20, font: 'Yu Gothic', bold: !!bold })]
    })]
  });
}

function simpleTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => cell(h, { bold: true, fill: LIGHT_BLUE, width: colWidths[i] }))
      }),
      ...rows.map(row => new TableRow({
        children: row.map((c, i) => cell(c, { width: colWidths[i] }))
      }))
    ]
  });
}

// ── Build Document ──
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Yu Gothic', size: 22 } }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Yu Gothic', color: BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Yu Gothic', color: BLUE },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Yu Gothic', color: '333333' },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: 'numbers2',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: 'numbers3',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [
    // ──────── COVER PAGE ────────
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: 'INTERNAL REVIEW DOCUMENT', size: 24, font: 'Yu Gothic', color: '888888' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: '社内レビュー用資料', size: 24, font: 'Yu Gothic', color: '888888' })]
        }),
        new Paragraph({ spacing: { after: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: 'スマートファクトリー', size: 44, bold: true, font: 'Yu Gothic', color: BLUE })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: '生産日報システム', size: 44, bold: true, font: 'Yu Gothic', color: BLUE })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: 'Smart Factory Production Report System', size: 24, font: 'Yu Gothic', color: '666666' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: 'User Manual / ユーザーマニュアル', size: 28, bold: true, font: 'Yu Gothic' })]
        }),
        new Paragraph({ spacing: { after: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Version 1.0 (Demo)', size: 22, font: 'Yu Gothic', color: '888888' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: '2026\u5E744\u6708', size: 22, font: 'Yu Gothic', color: '888888' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'DanaExperts \u00D7 Y-nettech', size: 22, font: 'Yu Gothic', color: '888888' })]
        }),
      ]
    },

    // ──────── MAIN CONTENT ────────
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: '\u30B9\u30DE\u30FC\u30C8\u30D5\u30A1\u30AF\u30C8\u30EA\u30FC \u751F\u7523\u65E5\u5831\u30B7\u30B9\u30C6\u30E0 \u2014 User Manual', size: 16, font: 'Yu Gothic', color: '999999' })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Page ', size: 16, font: 'Yu Gothic', color: '999999' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Yu Gothic', color: '999999' })
            ]
          })]
        })
      },
      children: [
        // ── 1. OVERVIEW ──
        heading('\u7B2C1\u7AE0\u3000\u30B7\u30B9\u30C6\u30E0\u6982\u8981'),
        para('\u672C\u30B7\u30B9\u30C6\u30E0\u306F\u3001CNC\u52A0\u5DE5\u90E8\u9580\u306E\u751F\u7523\u65E5\u5831\u3092\u30C7\u30B8\u30BF\u30EB\u5316\u3057\u3001\u5404\u5F79\u8077\u304C\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u3067\u751F\u7523\u72B6\u6CC1\u3092\u628A\u63E1\u30FB\u627F\u8A8D\u3067\u304D\u308B\u30A6\u30A7\u30D6\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u3067\u3059\u3002\u30BF\u30D6\u30EC\u30C3\u30C8\u7AEF\u672B\u3067\u306E\u5229\u7528\u3092\u524D\u63D0\u306B\u8A2D\u8A08\u3055\u308C\u3066\u304A\u308A\u3001\u9AD8\u9F62\u306E\u4F5C\u696D\u54E1\u3067\u3082\u64CD\u4F5C\u3057\u3084\u3059\u3044UI/UX\u3092\u63A1\u7528\u3057\u3066\u3044\u307E\u3059\u3002'),

        heading('\u4E3B\u306A\u7279\u5FB4', HeadingLevel.HEADING_2),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u5F79\u8077\u5225\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\uFF086\u30ED\u30FC\u30EB\u5BFE\u5FDC\uFF09', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u91CD\u5927\u5EA6\u306B\u5FDC\u3058\u305F\u81EA\u52D5\u627F\u8A8D\u30EB\u30FC\u30C8\uFF08Normal / Major / Critical\uFF09', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '4M\u5206\u6790\uFF08Man / Machine / Material / Method\uFF09\u306B\u3088\u308B\u539F\u56E0\u5206\u985E', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u30BF\u30C3\u30C1\u30D5\u30EC\u30F3\u30C9\u30EA\u30FC\u306A\u30E2\u30FC\u30C0\u30EB\u30BB\u30EC\u30AF\u30BF\u30FC\uFF08\u9AD8\u9F62\u4F5C\u696D\u54E1\u5BFE\u5FDC\uFF09', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u65E5\u672C\u8A9E / \u82F1\u8A9E \u5207\u308A\u66FF\u3048\u5BFE\u5FDC', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 200 },
          children: [new TextRun({ text: '\u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u5BFE\u5FDC\uFF08PC / \u30BF\u30D6\u30EC\u30C3\u30C8 / \u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\uFF09', size: 22, font: 'Yu Gothic' })]
        }),

        // ── 2. ROLES ──
        heading('\u7B2C2\u7AE0\u3000\u30ED\u30FC\u30EB\u3068\u6A29\u9650'),
        para('\u672C\u30B7\u30B9\u30C6\u30E0\u306F6\u3064\u306E\u5F79\u8077\u306B\u5BFE\u5FDC\u3057\u3001\u305D\u308C\u305E\u308C\u7570\u306A\u308B\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3068\u6A29\u9650\u3092\u6301\u3061\u307E\u3059\u3002'),

        simpleTable(
          ['\u30ED\u30FC\u30EB', '\u65E5\u672C\u8A9E\u540D', '\u4E3B\u306A\u6A29\u9650'],
          [
            ['\u30AA\u30DA\u30EC\u30FC\u30BF', '\u30AA\u30DA\u30EC\u30FC\u30BF', '\u65E5\u5831\u4F5C\u6210\u30FB\u81EA\u5206\u306E\u5B9F\u7E3E\u78BA\u8A8D'],
            ['\u73ED\u9577', '\u73ED\u9577', '\u65E5\u5831\u4F5C\u6210\u30FB\u30C1\u30FC\u30E0\u7BA1\u7406\u30FB\u4E00\u6B21\u627F\u8A8D'],
            ['\u8AB2\u9577', '\u8AB2\u9577', '\u90E8\u9580\u7BA1\u7406\u30FB\u4E8C\u6B21\u627F\u8A8D\uFF08Critical\uFF09'],
            ['\u54C1\u8CEA\u7BA1\u7406', '\u54C1\u8CEA\u7BA1\u7406', '\u54C1\u8CEA\u5206\u6790\u30FB\u4E09\u6B21\u627F\u8A8D'],
            ['\u4FDD\u5168\u30EA\u30FC\u30C0\u30FC', '\u4FDD\u5168\u30EA\u30FC\u30C0\u30FC', '\u6A5F\u68B0\u7A3C\u50CD\u72B6\u6CC1\u78BA\u8A8D'],
            ['\u5DE5\u5834\u9577', '\u5DE5\u5834\u9577', '\u5168\u4F53\u7D71\u62EC\u30FB\u6700\u7D42\u627F\u8A8D\uFF08Critical\uFF09\u30FB\u8A2D\u5B9A'],
          ],
          [2200, 1800, 5026]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        // ── 3. LOGIN ──
        heading('\u7B2C3\u7AE0\u3000\u30ED\u30B0\u30A4\u30F3'),
        para('\u30BF\u30D6\u30EC\u30C3\u30C8\u5411\u3051\u306E\u30AB\u30FC\u30C9\u5F0F\u30ED\u30B0\u30A4\u30F3\u753B\u9762\u3067\u3059\u3002\u30E6\u30FC\u30B6\u30FC\u30AB\u30FC\u30C9\u3092\u30BF\u30C3\u30D7\u3059\u308B\u3060\u3051\u3067\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u3059\u3002'),
        new Paragraph({
          numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u30ED\u30B0\u30A4\u30F3\u753B\u9762\u3067\u8A00\u8A9E\u3092\u9078\u629E\uFF08\u65E5\u672C\u8A9E / English\uFF09', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u81EA\u5206\u306E\u540D\u524D\u30AB\u30FC\u30C9\u3092\u30BF\u30C3\u30D7', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'numbers', level: 0 }, spacing: { after: 200 },
          children: [new TextRun({ text: '\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306B\u81EA\u52D5\u9077\u79FB', size: 22, font: 'Yu Gothic' })]
        }),
        para('\u203B \u30AB\u30FC\u30C9\u306F\u5F79\u8077\u5225\u306B\u8272\u5206\u3051\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u30AA\u30DA\u30EC\u30FC\u30BF=\u9752\u3001\u73ED\u9577=\u7DD1\u3001\u8AB2\u9577=\u30AA\u30EC\u30F3\u30B8\u3001QA=\u7D2B\u3001\u5DE5\u5834\u9577=\u8D64\uFF09'),

        // ── 4. DASHBOARD ──
        heading('\u7B2C4\u7AE0\u3000\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9'),

        heading('\u30AA\u30DA\u30EC\u30FC\u30BF \u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9', HeadingLevel.HEADING_2),
        para('\u81EA\u5206\u306E\u4F5C\u696D\u5B9F\u7E3E\u3092\u78BA\u8A8D\u3059\u308B\u753B\u9762\u3067\u3059\u3002'),

        heading('\u8868\u793A\u60C5\u5831', HeadingLevel.HEADING_3),
        simpleTable(
          ['\u30BB\u30AF\u30B7\u30E7\u30F3', '\u5185\u5BB9'],
          [
            ['\u672C\u65E5\u306E\u62C5\u5F53 (4\u30AB\u30FC\u30C9)', '\u62C5\u5F53\u6A5F\u68B0\u30FB\u30B7\u30D5\u30C8 / \u672C\u65E5\u306E\u8A08\u753B\u6570\u30FB\u88FD\u54C1 / \u52E4\u52D9\u6642\u9593(4\u6708) / \u672A\u5B8C\u4E86\u30EC\u30DD\u30FC\u30C8\u6570'],
            ['\u4ECA\u6708 / \u5E74\u9593\u306E\u6210\u7E3E', '\u9054\u6210\u7387\u30FB\u751F\u7523\u6570\u30FB\u4E0D\u5177\u5408\u7387\u3092\u6708\u30FB\u5E74\u3067\u6BD4\u8F03\u8868\u793A'],
            ['\u30AA\u30FC\u30C0\u30FC\u5225\u4F5C\u696D\u6642\u9593', '\u5DE5\u756A / \u88FD\u54C1 / \u901A\u5E38\u6642\u9593 / \u6B8B\u696D / \u5408\u8A08 / \u751F\u7523\u6570 / \u9054\u6210\u7387\u306E\u4E00\u89A7\u8868'],
            ['\u6700\u8FD1\u306E\u65E5\u5831\u4E00\u89A7', '\u65E5\u4ED8 / \u88FD\u54C1 / \u5B9F\u7E3E / \u4E0D\u5177\u5408\u7387 / \u30B9\u30C6\u30FC\u30BF\u30B9\u30D0\u30C3\u30B8'],
          ],
          [2500, 6526]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        heading('\u73ED\u9577 \u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9', HeadingLevel.HEADING_2),
        para('\u73ED\u9577\u306FCNC\u6A5F\u64CD\u4F5C\u3082\u884C\u3046\u305F\u3081\u3001\u30AA\u30DA\u30EC\u30FC\u30BF\u3068\u540C\u3058\u500B\u4EBA\u5B9F\u7E3E\u30BB\u30AF\u30B7\u30E7\u30F3\u306B\u52A0\u3048\u3001\u30C1\u30FC\u30E0\u7BA1\u7406\u6A5F\u80FD\u3092\u5099\u3048\u3066\u3044\u307E\u3059\u3002'),
        simpleTable(
          ['\u30BB\u30AF\u30B7\u30E7\u30F3', '\u5185\u5BB9'],
          [
            ['\u81EA\u5206\u306E\u4F5C\u696D\u5B9F\u7E3E', '\u30AA\u30DA\u30EC\u30FC\u30BF\u3068\u540C\u3058\u30EC\u30A4\u30A2\u30A6\u30C8\uFF084\u30AB\u30FC\u30C9\u30FB\u6708/\u5E74\u6210\u7E3E\u30FB\u30AA\u30FC\u30C0\u30FC\u5225\u6642\u9593\u30FB\u81EA\u5206\u306E\u65E5\u5831\uFF09'],
            ['\u30C1\u30FC\u30E0KPI (4\u30AB\u30FC\u30C9)', '\u627F\u8A8D\u30EA\u30AF\u30A8\u30B9\u30C8\u6570 / \u30C1\u30FC\u30E0\u9054\u6210\u7387 / \u30C1\u30FC\u30E0\u4E0D\u5177\u5408 / \u30E1\u30F3\u30D0\u30FC\u6570'],
            ['\u30AA\u30FC\u30C0\u30FC\u5225\u30C1\u30FC\u30E0\u5B9F\u7E3E', '\u5DE5\u756A / \u88FD\u54C1 / \u8A08\u753B / \u5B9F\u7E3E / \u9054\u6210\u7387 / \u4E0D\u5177\u5408 / \u72B6\u614B'],
            ['\u30C1\u30FC\u30E0\u65E5\u5831\u4E00\u89A7', '\u5168\u30E1\u30F3\u30D0\u30FC\u306E\u65E5\u5831\u3092\u65E5\u4ED8\u9806\u306B\u8868\u793A\uFF08\u6700\u592715\u4EF6\uFF09'],
          ],
          [2500, 6526]
        ),
        new Paragraph({ spacing: { after: 120 } }),
        para('\u203B \u73ED\u9577\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u53F3\u4E0A\u306E\u300C\u65B0\u898F\u30EC\u30DD\u30FC\u30C8\u4F5C\u6210\u300D\u30DC\u30BF\u30F3\u304B\u3089\u76F4\u63A5\u65E5\u5831\u4F5C\u6210\u753B\u9762\u3078\u79FB\u52D5\u3067\u304D\u307E\u3059\u3002', { color: '555555' }),

        heading('\u305D\u306E\u4ED6\u306E\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30ED\u30FC\u30EB', '\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306E\u7279\u5FB4'],
          [
            ['\u8AB2\u9577', '\u90E8\u9580\u5168\u4F53\u306EKPI / \u30AA\u30FC\u30C0\u30FC\u5225Plan vs Actual\u30C1\u30E3\u30FC\u30C8 / Critical\u30CF\u30A4\u30E9\u30A4\u30C8 / \u627F\u8A8D\u5F85\u3061\u30BB\u30AF\u30B7\u30E7\u30F3'],
            ['\u54C1\u8CEA\u7BA1\u7406', '\u7DCF\u751F\u7523\u6570\u30FB\u4E0D\u5177\u5408\u6570\u30FBFPY / \u4E0D\u5177\u5408\u7A2E\u5225\u30C1\u30E3\u30FC\u30C8 / \u30AA\u30FC\u30C0\u30FC\u5225\u54C1\u8CEA\u30C6\u30FC\u30D6\u30EB / \u627F\u8A8D\u5F85\u3061'],
            ['\u4FDD\u5168\u30EA\u30FC\u30C0\u30FC', '\u6A5F\u68B0\u53F0\u6570\u30FB\u7A3C\u50CD\u6642\u9593\u30FB\u505C\u6B62\u6642\u9593\u30FB\u6A5F\u68B0\u52B9\u7387 / \u6A5F\u68B0\u5225\u8A73\u7D30\u30C6\u30FC\u30D6\u30EB'],
            ['\u5DE5\u5834\u9577', '\u30AA\u30FC\u30C0\u30FC\u30D5\u30A3\u30EB\u30BF\u30FC\u4ED8\u304DKPI / \u5168\u30AA\u30FC\u30C0\u30FC\u9032\u6357\u8868 / Critical\u627F\u8A8D\u30BB\u30AF\u30B7\u30E7\u30F3'],
          ],
          [2200, 6826]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        // ── 5. REPORT CREATION ──
        new Paragraph({ children: [new PageBreak()] }),
        heading('\u7B2C5\u7AE0\u3000\u65E5\u5831\u4F5C\u6210'),
        para('\u30AA\u30DA\u30EC\u30FC\u30BF\u307E\u305F\u306F\u73ED\u9577\u304C\u3001\u52E4\u52D9\u7D42\u4E86\u5F8C\u306B\u65E5\u5831\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002\u30B5\u30A4\u30C9\u30D0\u30FC\u306E\u300C\u65B0\u898F\u65E5\u5831\u300D\u307E\u305F\u306F\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306E\u30DC\u30BF\u30F3\u304B\u3089\u30A2\u30AF\u30BB\u30B9\u3057\u307E\u3059\u3002'),

        heading('\u30B9\u30C6\u30A3\u30C3\u30AD\u30FC\u30A2\u30AF\u30B7\u30E7\u30F3\u30D0\u30FC', HeadingLevel.HEADING_2),
        para('\u753B\u9762\u4E0A\u90E8\u306B\u56FA\u5B9A\u8868\u793A\u3055\u308C\u308B\u30A2\u30AF\u30B7\u30E7\u30F3\u30D0\u30FC\u3067\u3059\u3002\u30B9\u30AF\u30ED\u30FC\u30EB\u3057\u3066\u3082\u5E38\u306B\u8868\u793A\u3055\u308C\u3001\u3044\u3064\u3067\u3082\u4FDD\u5B58\u30FB\u63D0\u51FA\u304C\u53EF\u80FD\u3067\u3059\u3002'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u4E0B\u66F8\u304D\u4FDD\u5B58\uFF1A\u5165\u529B\u9014\u4E2D\u306E\u5185\u5BB9\u3092\u4E00\u6642\u4FDD\u5B58\u3002\u5F8C\u304B\u3089\u7DE8\u96C6\u30FB\u63D0\u51FA\u53EF\u80FD', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: '\u63D0\u51FA\u3059\u308B\uFF1A\u73ED\u9577\u3078\u306E\u627F\u8A8D\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u9001\u4FE1\u3002\u78BA\u8A8D\u30C0\u30A4\u30A2\u30ED\u30B0\u304C\u8868\u793A\u3055\u308C\u307E\u3059', size: 22, font: 'Yu Gothic' })]
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 }, spacing: { after: 200 },
          children: [new TextRun({ text: '\u30B9\u30AF\u30ED\u30FC\u30EB\u6642\u306E\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\uFF1A\u30D8\u30C3\u30C0\u30FC\u304C\u975E\u8868\u793A\u306B\u306A\u308A\u3001\u30A2\u30AF\u30B7\u30E7\u30F3\u30D0\u30FC\u304C\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u30D0\u30FC\u306B\u5909\u5316\uFF08\u6697\u3044\u80CC\u666F\uFF09', size: 22, font: 'Yu Gothic' })]
        }),

        heading('\u5165\u529B\u30BB\u30AF\u30B7\u30E7\u30F3', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30BB\u30AF\u30B7\u30E7\u30F3', '\u5165\u529B\u9805\u76EE', '\u5099\u8003'],
          [
            ['\u57FA\u672C\u60C5\u5831', '\u65E5\u4ED8 / \u30B7\u30D5\u30C8 / \u62C5\u5F53\u6A5F / \u88FD\u54C1\u30FB\u5DE5\u756A', '\u30E2\u30FC\u30C0\u30EB\u30BB\u30EC\u30AF\u30BF\u30FC\u3067\u9078\u629E'],
            ['\u751F\u7523\u6570\u91CF', '\u8A08\u753B\u6570 / \u5B9F\u7E3E\u6570', '+5/+1/-1/-5\u30DC\u30BF\u30F3\u3067\u5165\u529B'],
            ['\u52E4\u52D9\u6642\u9593', '\u901A\u5E38\u6642\u9593(h) / \u6B8B\u696D\u6642\u9593(h)', '\u6B8B\u696D4h\u4EE5\u4E0A\u3067\u8B66\u544A\u8868\u793A'],
            ['\u4E0D\u5177\u5408\u60C5\u5831', '\u7A2E\u985E / \u91CD\u5927\u5EA6 / \u6570\u91CF / \u8AAC\u660E', '\u8907\u6570\u4EF6\u767B\u9332\u53EF'],
            ['4M\u5206\u6790', '\u539F\u56E0(20\u9805\u76EE) / \u5BFE\u7B56(11\u9805\u76EE)', '\u672A\u5165\u529B\u6642\u306B\u30AA\u30EC\u30F3\u30B8\u8B66\u544A'],
            ['\u4F5C\u696D\u8A18\u9332', '\u76EE\u6A19 / \u7D50\u679C / \u6539\u5584\u70B9 / \u660E\u65E5\u306E\u4E88\u5B9A', '\u30C6\u30AD\u30B9\u30C8\u5165\u529B'],
          ],
          [1800, 3800, 3426]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        heading('\u30E2\u30FC\u30C0\u30EB\u30BB\u30EC\u30AF\u30BF\u30FC\u306B\u3064\u3044\u3066', HeadingLevel.HEADING_3),
        para('\u5168\u3066\u306E\u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3\u306F\u300C\u30E2\u30FC\u30C0\u30EB\u30BB\u30EC\u30AF\u30BF\u30FC\u300D\u306B\u7F6E\u304D\u63DB\u3048\u3089\u308C\u3066\u3044\u307E\u3059\u3002\u753B\u9762\u4E0B\u90E8\u304B\u3089\u30B9\u30E9\u30A4\u30C9\u30A2\u30C3\u30D7\u3059\u308B\u5927\u304D\u306A\u30DC\u30BF\u30F3\u5F62\u5F0F\u3067\u3001\u9AD8\u9F62\u306E\u4F5C\u696D\u54E1\u3067\u3082\u6B63\u78BA\u306B\u9078\u629E\u3067\u304D\u308B\u3088\u3046\u8A2D\u8A08\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u9078\u629E\u4E2D\u306E\u9805\u76EE\u306F\u9752\u8272\u306E\u67A0\u3067\u30CF\u30A4\u30E9\u30A4\u30C8\u3055\u308C\u307E\u3059\u3002'),

        // ── 6. APPROVAL FLOW ──
        new Paragraph({ children: [new PageBreak()] }),
        heading('\u7B2C6\u7AE0\u3000\u627F\u8A8D\u30D5\u30ED\u30FC'),
        para('\u65E5\u5831\u306E\u91CD\u5927\u5EA6\u306B\u3088\u308A\u30013\u3064\u306E\u627F\u8A8D\u30EB\u30FC\u30C8\u304C\u81EA\u52D5\u9078\u629E\u3055\u308C\u307E\u3059\u3002'),

        heading('\u627F\u8A8D\u30EB\u30FC\u30C8', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30EB\u30FC\u30C8', '\u6761\u4EF6', '\u627F\u8A8D\u30D5\u30ED\u30FC'],
          [
            ['Normal', '\u4E0D\u5177\u5408\u7387 < 5%\u3001\u8EFD\u5FAE\u306E\u307F', '\u30AA\u30DA\u30EC\u30FC\u30BF \u2192 \u73ED\u9577 \u2192 \u5B8C\u4E86'],
            ['Major', '\u4E0D\u5177\u5408\u7387 5-10%\u3001\u307E\u305F\u306F\u91CD\u5927\u3042\u308A', '\u30AA\u30DA\u30EC\u30FC\u30BF \u2192 \u73ED\u9577 \u2192 QA \u2192 \u5B8C\u4E86'],
            ['Critical', '\u4E0D\u5177\u5408\u7387 > 10%\u3001\u307E\u305F\u306F\u81F4\u547D\u3042\u308A', '\u30AA\u30DA\u30EC\u30FC\u30BF \u2192 \u73ED\u9577 \u2192 \u8AB2\u9577 \u2192 QA \u2192 \u5DE5\u5834\u9577 \u2192 \u5B8C\u4E86'],
          ],
          [1500, 2800, 4726]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        heading('\u30B9\u30C6\u30FC\u30BF\u30B9\u4E00\u89A7', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30B9\u30C6\u30FC\u30BF\u30B9', '\u65E5\u672C\u8A9E\u8868\u793A', '\u8AAC\u660E'],
          [
            ['DRAFT', '\u4E0B\u66F8\u304D', '\u4E0B\u66F8\u304D\u4FDD\u5B58\u6E08\u307F\u3002\u7DE8\u96C6\u30FB\u524A\u9664\u53EF\u80FD'],
            ['SUBMITTED', '\u63D0\u51FA\u6E08', '\u73ED\u9577\u3078\u306E\u627F\u8A8D\u5F85\u3061'],
            ['TL_REVIEWING', '\u73ED\u9577\u78BA\u8A8D\u4E2D', '\u73ED\u9577\u304C\u78BA\u8A8D\u4E2D'],
            ['SM_REVIEWING', '\u8AB2\u9577\u78BA\u8A8D\u4E2D', 'Critical\u30EB\u30FC\u30C8\u306E\u307F'],
            ['QA_REVIEWING', 'QA\u78BA\u8A8D\u4E2D', 'Major/Critical\u30EB\u30FC\u30C8'],
            ['DIR_REVIEWING', '\u5DE5\u5834\u9577\u78BA\u8A8D\u4E2D', 'Critical\u30EB\u30FC\u30C8\u306E\u6700\u7D42\u627F\u8A8D'],
            ['COMPLETED', '\u5B8C\u4E86', '\u5168\u627F\u8A8D\u5B8C\u4E86'],
            ['REJECTED', '\u5DEE\u623B\u3057', '\u5374\u4E0B\u3055\u308C\u3001\u4FEE\u6B63\u304C\u5FC5\u8981'],
          ],
          [2200, 2000, 4826]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        heading('\u627F\u8A8D\u5F85\u3061\u753B\u9762', HeadingLevel.HEADING_2),
        para('\u5404\u30ED\u30FC\u30EB\u306E\u627F\u8A8D\u5F85\u3061\u753B\u9762\u306B\u306F\u3001\u305D\u306E\u30ED\u30FC\u30EB\u304C\u627F\u8A8D\u3059\u3079\u304D\u30EC\u30DD\u30FC\u30C8\u306E\u307F\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002'),
        simpleTable(
          ['\u30ED\u30FC\u30EB', '\u8868\u793A\u3055\u308C\u308B\u30EC\u30DD\u30FC\u30C8'],
          [
            ['\u73ED\u9577', 'SUBMITTED\u307E\u305F\u306FTL_REVIEWING\uFF08\u81EA\u30C1\u30FC\u30E0\u306E\u307F\uFF09'],
            ['\u8AB2\u9577', 'SM_REVIEWING\u306E\u307F'],
            ['\u54C1\u8CEA\u7BA1\u7406', 'QA_REVIEWING\u306E\u307F'],
            ['\u5DE5\u5834\u9577', 'DIR_REVIEWING\u306E\u307F'],
          ],
          [2200, 6826]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        // ── 7. DEFECT 4M ──
        heading('\u7B2C7\u7AE0\u30004M\u5206\u6790\u3068\u4E0D\u5177\u5408\u7BA1\u7406'),
        para('\u4E0D\u5177\u5408\u767B\u9332\u6642\u306B\u30014M\u30D5\u30EC\u30FC\u30E0\u30EF\u30FC\u30AF\u3067\u539F\u56E0\u5206\u985E\u3057\u307E\u3059\u3002'),

        heading('\u91CD\u5927\u5EA6\u30EC\u30D9\u30EB', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30EC\u30D9\u30EB', '\u65E5\u672C\u8A9E', '\u8AAC\u660E', '\u30EB\u30FC\u30C8\u3078\u306E\u5F71\u97FF'],
          [
            ['Minor', '\u8EFD\u5FAE', '\u8EFD\u5FAE\u306A\u5916\u89B3\u4E0D\u826F\u7B49', 'Normal\u30EB\u30FC\u30C8'],
            ['Major', '\u91CD\u5927', '\u6A5F\u80FD\u306B\u5F71\u97FF\u3059\u308B\u4E0D\u826F', 'Major\u30EB\u30FC\u30C8\u4EE5\u4E0A'],
            ['Critical', '\u81F4\u547D', '\u5B89\u5168\u30FB\u6A5F\u80FD\u306B\u91CD\u5927\u5F71\u97FF', 'Critical\u30EB\u30FC\u30C8'],
          ],
          [1500, 1200, 2800, 3526]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        heading('4M\u539F\u56E0\u30AB\u30C6\u30B4\u30EA', HeadingLevel.HEADING_2),
        simpleTable(
          ['\u30AB\u30C6\u30B4\u30EA', '\u30B3\u30FC\u30C9', '\u4F8B'],
          [
            ['Man\uFF08\u4EBA\uFF09', 'M01-M05', '\u6280\u8853\u4E0D\u8DB3\u3001\u4E0D\u6CE8\u610F\u3001\u75B2\u52B4\u3001\u7D4C\u9A13\u4E0D\u8DB3\u3001\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u4E0D\u8DB3'],
            ['Machine\uFF08\u6A5F\u68B0\uFF09', 'M06-M11', '\u6469\u8017\u3001\u6821\u6B63\u305A\u308C\u3001\u5203\u5177\u52A3\u5316\u3001\u6E29\u5EA6\u5909\u52D5\u3001\u6CB9\u5727\u4E0D\u826F\u3001\u5236\u5FA1\u7CFB\u7570\u5E38'],
            ['Material\uFF08\u6750\u6599\uFF09', 'M12-M15', '\u6750\u8CEA\u3070\u3089\u3064\u304D\u3001\u786C\u5EA6\u4E0D\u826F\u3001\u5BF8\u6CD5\u4E0D\u826F\u3001\u8868\u9762\u6B20\u9665'],
            ['Method\uFF08\u65B9\u6CD5\uFF09', 'M16-M20', '\u4F5C\u696D\u624B\u9806\u4E0D\u5099\u3001\u6E2C\u5B9A\u65B9\u6CD5\u4E0D\u9069\u5207\u3001\u6CBB\u5177\u4E0D\u9069\u5408\u3001\u901F\u5EA6\u8A2D\u5B9A\u4E0D\u9069\u5207\u3001\u30D7\u30ED\u30B0\u30E9\u30E0\u30A8\u30E9\u30FC'],
          ],
          [2200, 1500, 5326]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        // ── 8. SIDEBAR ──
        heading('\u7B2C8\u7AE0\u3000\u30B5\u30A4\u30C9\u30D0\u30FC\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3'),
        para('\u5DE6\u5074\u306E\u30B5\u30A4\u30C9\u30D0\u30FC\u304B\u3089\u5404\u753B\u9762\u306B\u79FB\u52D5\u3057\u307E\u3059\u3002\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u3067\u306F\u6298\u308A\u305F\u305F\u307F\u53EF\u80FD\uFF08\u30A2\u30A4\u30B3\u30F3\u306E\u307F\u8868\u793A\uFF09\u3001\u30E2\u30D0\u30A4\u30EB\u3067\u306F\u30CF\u30F3\u30D0\u30FC\u30AC\u30FC\u30E1\u30CB\u30E5\u30FC\u3067\u958B\u9589\u3057\u307E\u3059\u3002'),
        simpleTable(
          ['\u30E1\u30CB\u30E5\u30FC', '\u5BFE\u8C61\u30ED\u30FC\u30EB'],
          [
            ['\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9', '\u5168\u30ED\u30FC\u30EB'],
            ['\u65E5\u5831\u4E00\u89A7', '\u5168\u30ED\u30FC\u30EB'],
            ['\u65B0\u898F\u65E5\u5831', '\u30AA\u30DA\u30EC\u30FC\u30BF\u3001\u73ED\u9577'],
            ['\u627F\u8A8D\u5F85\u3061', '\u73ED\u9577\u3001\u8AB2\u9577\u3001QA\u3001\u5DE5\u5834\u9577'],
            ['\u5206\u6790', '\u73ED\u9577\u3001\u8AB2\u9577\u3001QA\u3001\u5DE5\u5834\u9577'],
            ['\u8A2D\u5B9A', '\u5DE5\u5834\u9577\u306E\u307F'],
          ],
          [3000, 6026]
        ),
        new Paragraph({ spacing: { after: 200 } }),

        // ── 9. OTHER FEATURES ──
        heading('\u7B2C9\u7AE0\u3000\u305D\u306E\u4ED6\u306E\u6A5F\u80FD'),

        heading('\u65E5\u5831\u4E00\u89A7', HeadingLevel.HEADING_2),
        para('\u5168\u65E5\u5831\u306E\u691C\u7D22\u30FB\u30D5\u30A3\u30EB\u30BF\u30FC\u304C\u53EF\u80FD\u3067\u3059\u3002\u30AA\u30DA\u30EC\u30FC\u30BF\u306F\u81EA\u5206\u306E\u65E5\u5831\u306E\u307F\u3001\u73ED\u9577\u306F\u30C1\u30FC\u30E0\u306E\u65E5\u5831\u3001\u305D\u306E\u4ED6\u306F\u5168\u65E5\u5831\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u30D5\u30A3\u30EB\u30BF\u30FC\u30DC\u30BF\u30F3\uFF1A\u5168\u3066 / \u5F85\u6A5F\u4E2D / \u5B8C\u4E86 / \u5374\u4E0B'),

        heading('\u5206\u6790\u753B\u9762', HeadingLevel.HEADING_2),
        para('\u671F\u9593\u3092\u9078\u629E\uFF087\u65E5 / 30\u65E5 / 90\u65E5 / 1\u5E74\uFF09\u3057\u3001\u751F\u7523\u51FA\u529B\u30C8\u30EC\u30F3\u30C9\u30FB\u4E0D\u5177\u5408\u7387\u30C8\u30EC\u30F3\u30C9\u306E\u30C1\u30E3\u30FC\u30C8\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002'),

        heading('\u8A2D\u5B9A\u753B\u9762', HeadingLevel.HEADING_2),
        para('\u5DE5\u5834\u9577\u306E\u307F\u30A2\u30AF\u30BB\u30B9\u53EF\u80FD\u3002\u4E0D\u5177\u5408\u95BE\u5024\u3084\u5DEE\u7570\u95BE\u5024\u306A\u3069\u306E\u30B7\u30B9\u30C6\u30E0\u30D1\u30E9\u30E1\u30FC\u30BF\u3092\u8A2D\u5B9A\u3067\u304D\u307E\u3059\u3002'),

        heading('\u8A00\u8A9E\u5207\u308A\u66FF\u3048', HeadingLevel.HEADING_2),
        para('\u30D8\u30C3\u30C0\u30FC\u53F3\u4E0A\u306E\u5730\u7403\u30A2\u30A4\u30B3\u30F3\u3067\u65E5\u672C\u8A9E / \u82F1\u8A9E\u3092\u5207\u308A\u66FF\u3048\u3067\u304D\u307E\u3059\u3002\u5168\u3066\u306EUI\u30C6\u30AD\u30B9\u30C8\u304C\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u3059\u3002'),

        new Paragraph({ spacing: { after: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: '\u2014 End of Document \u2014', size: 20, font: 'Yu Gothic', color: '999999', italics: true })]
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = '/sessions/dreamy-friendly-ride/mnt/Odoo_Y-nettech_colab/UserManual_ProductionReport_v1.docx';
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
