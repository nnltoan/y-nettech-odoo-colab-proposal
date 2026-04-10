const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const BLUE = '1F4E79';
const LB = 'D6E4F0';
const WARN = 'FFF3CD';
const GREEN = 'D4EDDA';
const RED = 'F8D7DA';
const F = 'Arial';
const B = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BS = { top: B, bottom: B, left: B, right: B };
const CM = { top: 60, bottom: 60, left: 100, right: 100 };

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, bold: true })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, bold: true })] }); }
function h3(t) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, bold: true })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 120 }, ...o.pp, children: [new TextRun({ text: t, size: 22, font: F, ...o })] }); }
function pMulti(runs) { return new Paragraph({ spacing: { after: 120 }, children: runs.map(r => new TextRun({ size: 22, font: F, ...r })) }); }
function br() { return new Paragraph({ children: [new PageBreak()] }); }
function sp(n = 200) { return new Paragraph({ spacing: { after: n } }); }

function c(t, o = {}) {
  return new TableCell({
    borders: BS, margins: CM,
    width: o.w ? { size: o.w, type: WidthType.DXA } : undefined,
    shading: o.f ? { fill: o.f, type: ShadingType.CLEAR } : undefined,
    verticalAlign: o.v || undefined,
    children: Array.isArray(t)
      ? t.map(x => new Paragraph({ alignment: o.a || AlignmentType.LEFT, children: [new TextRun({ text: x, size: 20, font: F, bold: !!o.b })] }))
      : [new Paragraph({ alignment: o.a || AlignmentType.LEFT, children: [new TextRun({ text: t || '', size: 20, font: F, bold: !!o.b })] })]
  });
}

function tbl(hds, rows, cw) {
  const tw = cw.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: tw, type: WidthType.DXA }, columnWidths: cw,
    rows: [
      new TableRow({ children: hds.map((h, i) => c(h, { b: true, f: LB, w: cw[i] })) }),
      ...rows.map(r => new TableRow({
        children: r.map((x, i) => {
          if (typeof x === 'object' && x._cell) return c(x.text, { w: cw[i], ...x });
          return c(x, { w: cw[i] });
        })
      }))
    ]
  });
}

function bullet(t, ref = 'bullets') {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text: t, size: 22, font: F })] });
}
function num(t, ref = 'n1') {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text: t, size: 22, font: F })] });
}
function bulletBold(label, desc) {
  return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text: label, size: 22, font: F, bold: true }), new TextRun({ text: desc, size: 22, font: F })] });
}

const numbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n1', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n3', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ]
};

const styles = {
  default: { document: { run: { font: F, size: 22 } } },
  paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 32, bold: true, font: F, color: BLUE },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 28, bold: true, font: F, color: BLUE },
      paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 24, bold: true, font: F, color: '333333' },
      paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
  ]
};

const hdr = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'DanaExperts - Internal Review', size: 16, font: F, color: '999999' })] })] });
const ftr = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Page ', size: 16, font: F, color: '999999' }), new TextRun({ children: [PageNumber.CURRENT], size: 16, font: F, color: '999999' })] })] });
const pgProps = {
  page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
};

const doc = new Document({
  styles, numbering,
  sections: [
    // === COVER ===
    {
      properties: pgProps,
      children: [
        sp(3000),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'TÀI LIỆU NỘI BỘ - PHÂN TÍCH & KẾ HOẠCH', size: 24, font: F, color: '888888' })] }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'CÁC TRƯỜNG HỢP BÁO CÁO SẢN XUẤT', size: 40, bold: true, font: F, color: BLUE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'TRONG NHÀ MÁY CNC', size: 36, bold: true, font: F, color: BLUE })] }),
        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Production Report Use Cases & Enhancement Plan', size: 24, font: F, color: '666666' })] }),
        sp(1200),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Phân tích hiện trạng, các case thực tế,', size: 22, font: F })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'và đề xuất phương án nâng cấp hệ thống', size: 22, font: F })] }),
        sp(800),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Tháng 4/2026', size: 22, font: F, color: '888888' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DanaExperts x Y-nettech', size: 22, font: F, color: '888888' })] }),
      ]
    },

    // === CONTENT ===
    {
      properties: pgProps,
      headers: { default: hdr }, footers: { default: ftr },
      children: [
        // ============================================================
        // PHẦN 1: HIỆN TRẠNG
        // ============================================================
        h1('Phần 1: Hiện Trạng Hệ Thống'),

        h2('1.1. Mô hình dữ liệu hiện tại'),
        p('Hiện tại, mỗi báo cáo (report) tuân theo mô hình 1-1-1-1:'),
        tbl(
          ['Thành phần', 'Số lượng', 'Mô tả'],
          [
            ['Ngày', '1', 'Mỗi report gắn với 1 ngày cụ thể'],
            ['Operator', '1', 'Mỗi report do 1 người tạo'],
            ['Máy CNC', '1', 'Mỗi report chỉ chọn được 1 máy'],
            ['Sản phẩm / Đơn hàng', '1', 'Mỗi report chỉ chọn được 1 sản phẩm + 1 mã đơn hàng'],
            ['Sản lượng', '1 cặp', 'Kế hoạch + Thực tế (cho 1 sản phẩm duy nhất)'],
            ['Giờ làm', '1 cặp', 'Giờ thường + Tăng ca (tổng cho cả ngày, không phân bổ theo đơn)'],
          ],
          [2000, 1200, 5826]
        ),
        sp(),

        h2('1.2. Vấn đề phát sinh'),
        p('Mô hình 1-1-1-1 hoạt động tốt khi operator chỉ làm 1 đơn hàng/ngày. Nhưng trong thực tế nhà máy CNC, các trường hợp phức tạp hơn xảy ra thường xuyên:'),
        sp(),

        // ============================================================
        // PHẦN 2: CÁC CASE
        // ============================================================
        br(),
        h1('Phần 2: Các Trường Hợp Báo Cáo Thực Tế'),

        // --- CASE 1 ---
        h2('Case 1: Chuyển đơn hàng trong ngày (Anh đã nêu)'),
        p('Operator hoàn thành lô hàng A buổi sáng, chuyển sang lô hàng B buổi chiều.', { bold: true }),
        sp(80),
        tbl(
          ['Thời gian', 'Đơn hàng', 'Sản phẩm', 'Máy', 'Sản lượng'],
          [
            ['7:00 - 11:30', 'J2025-001', 'Flange', 'CNC-001, CNC-003', '120 pcs'],
            ['12:30 - 17:00', 'J2025-002', 'Shaft', 'CNC-001, CNC-002', '60 pcs'],
          ],
          [1500, 1500, 1500, 2200, 2326]
        ),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'App hiện tại chỉ cho chọn 1 sản phẩm/đơn hàng. Operator phải tạo 2 report riêng, nhưng giờ làm (7.5h thường + 1.5h tăng ca) không biết phân bổ thế nào cho mỗi đơn.' }
        ]),
        pMulti([
          { text: 'Tần suất: ', bold: true, color: 'CC0000' },
          { text: 'Rất thường xuyên. Đây là case phổ biến nhất cần giải quyết.' }
        ]),
        sp(),

        // --- CASE 2 ---
        h2('Case 2: Nhiều máy CNC cho cùng 1 sản phẩm'),
        p('Operator điều khiển 2-3 máy CNC đồng thời để hoàn thành các công đoạn khác nhau cho 1 sản phẩm.', { bold: true }),
        sp(80),
        tbl(
          ['Máy', 'Công đoạn', 'Sản phẩm', 'Ghi chú'],
          [
            ['CNC-001', 'Tiện thô (Rough Turning)', 'Flange J2025-001', 'Bước 1'],
            ['CNC-003', 'Phay tinh (Finish Milling)', 'Flange J2025-001', 'Bước 2'],
            ['CNC-005', 'Khoan lỗ (Drilling)', 'Flange J2025-001', 'Bước 3'],
          ],
          [1500, 2500, 2500, 2526]
        ),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'App hiện tại chỉ cho chọn 1 máy. Nhưng sản lượng 120 pcs là kết quả chung của 3 máy. Nếu tạo 3 report riêng sẽ bị trùng sản lượng.' }
        ]),
        pMulti([
          { text: 'Đặc điểm: ', bold: true, color: BLUE },
          { text: 'Đây KHÔNG phải 3 lô hàng riêng - mà là 3 công đoạn cho cùng 1 lô. Kết quả cuối cùng tính là 1 sản phẩm hoàn chỉnh.' }
        ]),
        sp(),

        // --- CASE 3 ---
        h2('Case 3: Đơn hàng kéo dài nhiều ngày'),
        p('Đơn hàng lớn không hoàn thành trong 1 ngày, phải tiếp tục ngày sau.', { bold: true }),
        sp(80),
        tbl(
          ['Ngày', 'Đơn hàng', 'Kế hoạch ngày', 'Thực tế ngày', 'Lũy kế'],
          [
            ['1/4', 'J2025-001 (tổng 500 pcs)', '120', '118', '118/500'],
            ['2/4', 'J2025-001', '120', '125', '243/500'],
            ['3/4', 'J2025-001', '120', '122', '365/500'],
            ['4/4', 'J2025-001', '140 (chạy nốt)', '135', '500/500'],
          ],
          [1000, 2500, 1500, 1500, 2526]
        ),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'App hiện tại không hiển thị tiến độ lũy kế (cumulative progress) của đơn hàng. Operator và quản lý không biết đơn hàng đã hoàn thành bao nhiêu %.' }
        ]),
        pMulti([
          { text: 'Nhu cầu: ', bold: true, color: BLUE },
          { text: 'Cần hiển thị: "Đơn hàng J2025-001: 365/500 pcs (73%) - còn 2 ngày" trên dashboard.' }
        ]),
        sp(),

        // --- CASE 4 ---
        h2('Case 4: Thời gian chuyển đổi đơn hàng (Setup / Changeover)'),
        p('Khi chuyển từ lô hàng A sang lô hàng B, operator cần thời gian thay dao, hiệu chỉnh máy, chạy thử.', { bold: true }),
        sp(80),
        tbl(
          ['Thời gian', 'Hoạt động', 'Phân bổ giờ'],
          [
            ['7:00 - 11:00', 'Sản xuất Flange (J2025-001)', '4h sản xuất'],
            ['11:00 - 12:00', 'Chuyển đổi: thay dao, hiệu chỉnh CNC, chạy test', '1h setup (không tính sản xuất)'],
            ['12:00 - 12:30', 'Nghỉ trưa', '-'],
            ['12:30 - 17:00', 'Sản xuất Shaft (J2025-002)', '4.5h sản xuất'],
          ],
          [1500, 4500, 3026]
        ),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'App hiện tại không có mục ghi thời gian setup/changeover. 1 giờ setup này "biến mất" - không được tính vào đơn hàng nào, nhưng vẫn là giờ làm việc thực tế.' }
        ]),
        pMulti([
          { text: 'Tầm quan trọng: ', bold: true, color: 'CC0000' },
          { text: 'Trong lean manufacturing, thời gian setup là KPI quan trọng (SMED - Single Minute Exchange of Die). Nhà máy Nhật rất quan tâm chỉ số này.' }
        ]),
        sp(),

        // --- CASE 5 ---
        h2('Case 5: Máy hỏng giữa chừng - chuyển máy'),
        p('Máy CNC-001 bị lỗi lúc 10:00, operator chuyển sang CNC-004 để tiếp tục.', { bold: true }),
        sp(80),
        tbl(
          ['Thời gian', 'Máy', 'Trạng thái', 'Sản lượng'],
          [
            ['7:00 - 10:00', 'CNC-001', 'Sản xuất bình thường', '60 pcs'],
            ['10:00 - 10:45', 'CNC-001', 'Máy hỏng - chờ sửa / chuyển máy', '0 (downtime 45 phút)'],
            ['10:45 - 17:00', 'CNC-004', 'Tiếp tục sản xuất cùng đơn hàng', '55 pcs'],
          ],
          [1500, 1500, 3000, 3026]
        ),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'App chỉ cho chọn 1 máy. Không có cách ghi nhận: "sáng dùng CNC-001, chiều chuyển sang CNC-004 vì máy hỏng". Downtime 45 phút cũng không có chỗ ghi chi tiết.' }
        ]),
        pMulti([
          { text: 'Liên quan: ', bold: true, color: BLUE },
          { text: 'Case này kết nối với bộ phận Bảo trì (Y-nettech IoT). Cần log sự kiện máy hỏng để bảo trì theo dõi.' }
        ]),
        sp(),

        // --- CASE 6 ---
        h2('Case 6: Rework / Gia công lại'),
        p('Sản phẩm bị lỗi từ ngày trước quay lại để gia công lại.', { bold: true }),
        sp(80),
        pMulti([
          { text: 'Ví dụ: ', bold: true },
          { text: 'Hôm qua Tanaka sản xuất 120 Flange, QA kiểm tra phát hiện 8 pcs lỗi bề mặt. Hôm nay 8 pcs này quay lại CNC để mài lại (rework).' }
        ]),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'Nếu tạo report mới cho 8 pcs rework, kế hoạch (planQty) là gì? Sản lượng rework có tính vào tổng sản lượng đơn hàng không? Lỗi rework tính thế nào?' }
        ]),
        pMulti([
          { text: 'Cần phân biệt: ', bold: true, color: 'CC0000' },
          { text: 'Sản xuất mới (First Run) vs Gia công lại (Rework). Nếu không, báo cáo sẽ bị sai tỷ lệ FPY (First Pass Yield).' }
        ]),
        sp(),

        // --- CASE 7 ---
        h2('Case 7: Nhiều operator cùng đơn hàng, khác shift'),
        p('Shift A (Tanaka) và Shift B (Yamada) cùng sản xuất đơn hàng J2025-001 trên CNC-001.', { bold: true }),
        sp(80),
        tbl(
          ['Shift', 'Operator', 'Máy', 'Đơn hàng', 'Sản lượng'],
          [
            ['A (7:00-15:00)', 'Tanaka', 'CNC-001', 'J2025-001', '120 pcs'],
            ['B (15:00-23:00)', 'Yamada', 'CNC-001', 'J2025-001', '115 pcs'],
          ],
          [1800, 1200, 1200, 1800, 3026]
        ),
        sp(80),
        pMulti([
          { text: 'Hiện trạng: ', bold: true },
          { text: 'Case này app hiện tại XỬ LÝ ĐƯỢC - mỗi operator tạo report riêng, hệ thống tổng hợp theo jobNumber. Tuy nhiên, cần đảm bảo dashboard hiển thị tổng sản lượng ngày (235 pcs) chứ không chỉ theo từng report.' }
        ]),
        sp(),

        // --- CASE 8 ---
        h2('Case 8: Sản xuất thử / Test Run'),
        p('Trước khi chạy sản xuất hàng loạt, operator cần chạy thử 3-5 pcs để kiểm tra chất lượng.', { bold: true }),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'Sản phẩm test run tiêu tốn vật liệu và thời gian máy nhưng KHÔNG tính vào sản lượng đơn hàng. App hiện tại không phân biệt test run vs production run.' }
        ]),
        sp(),

        // --- CASE 9 ---
        h2('Case 9: Phế phẩm / Scrap'),
        p('Sản phẩm lỗi không thể rework, phải bỏ đi (scrap).', { bold: true }),
        sp(80),
        pMulti([
          { text: 'Hiện trạng: ', bold: true },
          { text: 'App có ghi số lượng lỗi (defects) nhưng không phân biệt: lỗi có thể rework vs lỗi phải scrap. Số lượng scrap ảnh hưởng trực tiếp đến chi phí vật liệu và cần báo cáo riêng.' }
        ]),
        sp(),

        // --- CASE 10 ---
        h2('Case 10: Bảo trì phòng ngừa trong giờ sản xuất'),
        p('Theo lịch, CNC-001 cần bảo trì 30 phút mỗi tuần. Thời gian này nằm trong giờ sản xuất.', { bold: true }),
        sp(80),
        pMulti([
          { text: 'Vấn đề: ', bold: true },
          { text: 'Tương tự downtime, nhưng đây là planned downtime (có kế hoạch). Cần phân biệt với unplanned downtime (máy hỏng bất ngờ) để tính OEE (Overall Equipment Effectiveness) chính xác.' }
        ]),
        sp(),

        // ============================================================
        // PHẦN 3: TỔNG HỢP ĐỘ ƯU TIÊN
        // ============================================================
        br(),
        h1('Phần 3: Tổng Hợp và Đánh Giá Độ Ưu Tiên'),
        sp(100),

        tbl(
          ['Case', 'Mô tả ngắn', 'Tần suất', 'Ưu tiên', 'Phase đề xuất'],
          [
            ['1', 'Chuyển đơn hàng trong ngày', 'Rất cao', 'P0 - Bắt buộc', 'Phase 1'],
            ['2', 'Nhiều máy cho 1 sản phẩm', 'Cao', 'P0 - Bắt buộc', 'Phase 1'],
            ['4', 'Thời gian setup/changeover', 'Cao', 'P1 - Quan trọng', 'Phase 1'],
            ['3', 'Đơn hàng kéo dài nhiều ngày', 'Cao', 'P1 - Quan trọng', 'Phase 1'],
            ['5', 'Máy hỏng giữa chừng', 'Trung bình', 'P1 - Quan trọng', 'Phase 1'],
            ['6', 'Rework', 'Trung bình', 'P2 - Cần có', 'Phase 2'],
            ['9', 'Scrap tracking', 'Trung bình', 'P2 - Cần có', 'Phase 2'],
            ['7', 'Nhiều operator/shift', 'Cao', 'P3 - Đã có', 'Hiện tại OK'],
            ['8', 'Test run', 'Thấp', 'P3 - Tùy chọn', 'Phase 2'],
            ['10', 'Bảo trì phòng ngừa', 'Thấp', 'P3 - Tùy chọn', 'Phase 2 (IoT)'],
          ],
          [800, 2500, 1200, 1800, 2726]
        ),
        sp(),

        // ============================================================
        // PHẦN 4: ĐỀ XUẤT GIẢI PHÁP
        // ============================================================
        br(),
        h1('Phần 4: Đề Xuất Giải Pháp'),

        h2('4.1. Thay đổi cốt lõi: Report Multi-Line (Nhiều dòng sản xuất)'),
        p('Thay đổi mô hình từ "1 report = 1 đơn hàng" thành "1 report = 1 ngày làm việc, nhiều dòng sản xuất".', { bold: true }),
        sp(80),

        h3('Mô hình mới: Nhật báo có nhiều Production Entry'),
        p('Mỗi báo cáo ngày (Daily Report) chứa nhiều dòng sản xuất (Production Entry). Mỗi dòng ghi nhận 1 khoảng thời gian làm việc cho 1 đơn hàng cụ thể:'),
        sp(80),

        tbl(
          ['Cấp', 'Thông tin', 'Ví dụ'],
          [
            ['Daily Report (header)', 'Ngày, Operator, Shift, Ghi chép chung, Trạng thái phê duyệt', '3/4/2026, Tanaka, Shift A'],
            ['Production Entry 1', 'Đơn hàng, Sản phẩm, Máy (nhiều), Giờ bắt đầu-kết thúc, Kế hoạch, Thực tế, Lỗi, 4M', 'J2025-001, Flange, CNC-001+003, 7:00-11:00, 120 kế hoạch, 118 thực tế'],
            ['Setup Entry', 'Loại: Changeover, Thời gian, Từ đơn nào sang đơn nào', 'Changeover, 11:00-12:00, J2025-001 → J2025-002'],
            ['Production Entry 2', 'Đơn hàng, Sản phẩm, Máy, Giờ, Kế hoạch, Thực tế, Lỗi, 4M', 'J2025-002, Shaft, CNC-001+002, 12:30-17:00, 80 kế hoạch, 62 thực tế'],
            ['Downtime Entry (nếu có)', 'Máy, Thời gian, Lý do, Planned/Unplanned', 'CNC-001, 10:00-10:45, Lỗi spindle, Unplanned'],
          ],
          [2200, 3800, 3026]
        ),
        sp(),

        h3('So sánh mô hình cũ vs mới'),
        tbl(
          ['Tiêu chí', 'Hiện tại (1-1-1-1)', 'Đề xuất (Multi-Line)'],
          [
            ['Cấu trúc', '1 report = 1 đơn hàng', '1 report = 1 ngày, N dòng sản xuất'],
            ['Chuyển đơn trong ngày', 'Phải tạo 2 report riêng', '1 report, thêm dòng sản xuất mới'],
            ['Nhiều máy / 1 sản phẩm', 'Không hỗ trợ', 'Mỗi dòng chọn nhiều máy'],
            ['Phân bổ giờ làm', 'Không rõ ràng', 'Mỗi dòng có giờ bắt đầu-kết thúc riêng'],
            ['Thời gian setup', 'Không ghi được', 'Entry riêng cho setup/changeover'],
            ['Downtime', 'Chỉ có số phút chung', 'Entry riêng: máy nào, bao lâu, lý do'],
            ['Phê duyệt', 'Theo từng report', 'Theo nhật báo (1 lần duyệt cho cả ngày)'],
            ['Lỗi & 4M', 'Chung cho 1 sản phẩm', 'Riêng cho từng dòng sản xuất'],
            ['Độ phức tạp UI', 'Đơn giản', 'Phức tạp hơn nhưng chính xác hơn'],
          ],
          [2200, 3200, 3626]
        ),
        sp(),

        // --- 4.2 ---
        h2('4.2. Thiết kế UI cho Multi-Line Report'),
        p('Form tạo báo cáo mới sẽ có cấu trúc accordion (mở/đóng từng section):'),
        sp(80),

        h3('Bước 1: Header (giữ nguyên)'),
        bullet('Ngày, Shift, Operator (tự động)'),
        sp(80),

        h3('Bước 2: Danh sách dòng sản xuất (Production Entries)'),
        bullet('Ban đầu hiện 1 dòng (giống hiện tại - chọn đơn hàng, máy, sản lượng)'),
        bullet('Nút "+ Thêm dòng sản xuất" ở cuối → thêm 1 accordion mới'),
        bullet('Mỗi dòng có nút xóa (nếu > 1 dòng)'),
        bullet('Mỗi dòng có: Đơn hàng, Sản phẩm, Máy (multi-select), Giờ bắt đầu-kết thúc, Kế hoạch, Thực tế, Lỗi riêng, 4M riêng'),
        sp(80),

        h3('Bước 3: Setup / Downtime (tùy chọn)'),
        bullet('Nút "+ Ghi nhận setup/changeover" → form: Thời gian, Loại, Ghi chú'),
        bullet('Nút "+ Ghi nhận downtime" → form: Máy, Thời gian, Lý do, Planned/Unplanned'),
        bullet('Các entry này không bắt buộc - chỉ thêm khi cần'),
        sp(80),

        h3('Bước 4: Tổng kết ngày (Summary)'),
        bullet('Tự động tính: Tổng sản lượng, Tổng giờ làm, Tổng lỗi, Tỷ lệ đạt chung'),
        bullet('Ghi chép chung: Mục tiêu / Kết quả / Cải tiến / Kế hoạch ngày mai'),
        sp(80),

        h3('Bước 5: Lưu / Gửi (giữ nguyên sticky bar)'),
        p('Thanh action bar cố định phía trên vẫn hoạt động như hiện tại.'),
        sp(),

        // --- 4.3 ---
        h2('4.3. Thay đổi Dashboard'),
        h3('Operator Dashboard'),
        bullet('Thẻ KPI: Thêm "Số đơn hàng hôm nay" bên cạnh máy và sản phẩm'),
        bullet('Bảng giờ làm: Phân bổ rõ ràng theo từng đơn hàng (từ multi-line data)'),
        bullet('Thêm dòng: Setup time, Downtime (nếu có)'),
        sp(80),

        h3('Tổ trưởng Dashboard'),
        bullet('Bảng team: Thêm cột "Số đơn/ngày" cho mỗi thành viên'),
        bullet('Cảnh báo: Highlight nếu changeover time > ngưỡng'),
        sp(80),

        h3('Trưởng bộ phận CNC / Giám đốc Dashboard'),
        bullet('Tiến độ đơn hàng: Thanh progress bar cho mỗi đơn (Case 3)'),
        bullet('KPI setup time: Trung bình thời gian changeover (SMED tracking)'),
        bullet('KPI downtime: Tổng downtime, phân loại planned vs unplanned'),
        sp(),

        // --- 4.4 ---
        h2('4.4. Thay đổi Data Schema'),
        p('Đề xuất cấu trúc dữ liệu mới (cho cả demo lẫn production sau này):'),
        sp(80),

        tbl(
          ['Field', 'Type', 'Mô tả'],
          [
            ['--- DAILY REPORT (Header) ---', '', ''],
            ['id', 'number', 'ID báo cáo'],
            ['operatorId', 'string', 'Mã nhân viên'],
            ['date', 'string', 'Ngày (YYYY-MM-DD)'],
            ['shift', 'string', 'Ca làm (A/B/C)'],
            ['status', 'string', 'Trạng thái phê duyệt'],
            ['entries[]', 'array', 'Danh sách các dòng sản xuất'],
            ['setupEntries[]', 'array', 'Danh sách changeover/setup'],
            ['downtimeEntries[]', 'array', 'Danh sách downtime'],
            ['narratives', 'object', 'Ghi chép chung (giữ nguyên)'],
            ['summary', 'object', 'Tổng kết tự động tính'],
            ['', '', ''],
            ['--- PRODUCTION ENTRY ---', '', ''],
            ['entry.id', 'number', 'ID dòng sản xuất'],
            ['entry.jobNumber', 'string', 'Mã đơn hàng'],
            ['entry.product', 'string', 'Sản phẩm'],
            ['entry.machines[]', 'string[]', 'Danh sách máy CNC (multi-select)'],
            ['entry.startTime', 'string', 'Giờ bắt đầu (HH:MM)'],
            ['entry.endTime', 'string', 'Giờ kết thúc (HH:MM)'],
            ['entry.planQty', 'number', 'Kế hoạch'],
            ['entry.actualQty', 'number', 'Thực tế'],
            ['entry.type', 'string', 'production / rework / test_run'],
            ['entry.defects[]', 'array', 'Lỗi riêng cho dòng này'],
            ['entry.rootCauses[]', 'array', '4M riêng cho dòng này'],
            ['', '', ''],
            ['--- SETUP ENTRY ---', '', ''],
            ['setup.startTime', 'string', 'Giờ bắt đầu setup'],
            ['setup.endTime', 'string', 'Giờ kết thúc setup'],
            ['setup.type', 'string', 'changeover / calibration / tool_change'],
            ['setup.fromJob', 'string', 'Từ đơn hàng (nếu changeover)'],
            ['setup.toJob', 'string', 'Sang đơn hàng (nếu changeover)'],
            ['setup.machines[]', 'string[]', 'Máy liên quan'],
            ['setup.notes', 'string', 'Ghi chú'],
            ['', '', ''],
            ['--- DOWNTIME ENTRY ---', '', ''],
            ['dt.startTime', 'string', 'Giờ bắt đầu dừng'],
            ['dt.endTime', 'string', 'Giờ kết thúc dừng'],
            ['dt.machine', 'string', 'Máy bị dừng'],
            ['dt.planned', 'boolean', 'true = bảo trì có kế hoạch'],
            ['dt.reason', 'string', 'Lý do dừng'],
          ],
          [2500, 1500, 5026]
        ),
        sp(),

        // --- 4.5 ---
        h2('4.5. Ảnh hưởng đến luồng phê duyệt'),
        p('Luồng phê duyệt thay đổi nhỏ nhưng quan trọng:'),
        sp(80),
        bullet('Mỗi nhật báo vẫn được phê duyệt 1 lần (không phê duyệt từng dòng riêng)'),
        bullet('Route type (Normal/Major/Critical) tính dựa trên DÒng CÓ MỨC LỖI CAO NHẤT trong toàn bộ nhật báo'),
        bullet('Ví dụ: Entry 1 không lỗi (Normal) + Entry 2 có lỗi Critical → Cả nhật báo đi theo tuyến Critical'),
        bullet('Người phê duyệt thấy toàn bộ entries trong 1 màn hình, duyệt/từ chối cho cả ngày'),
        sp(),

        // ============================================================
        // PHẦN 5: KẾ HOẠCH TRIỂN KHAI
        // ============================================================
        br(),
        h1('Phần 5: Kế Hoạch Triển Khai (Đề Xuất)'),
        sp(100),

        h2('Phase 1 - Demo nâng cao (Ước tính: 1-2 tuần)'),
        p('Mục tiêu: Nâng cấp demo hiện tại để khách hàng thấy được khả năng xử lý multi-line.'),
        sp(80),
        num('Thêm Production Entry (multi-line) vào form tạo báo cáo', 'n1'),
        num('Cho phép chọn nhiều máy CNC cho 1 dòng sản xuất', 'n1'),
        num('Thêm giờ bắt đầu-kết thúc cho mỗi dòng', 'n1'),
        num('Thêm Setup Entry (changeover tracking)', 'n1'),
        num('Cập nhật dashboard hiển thị multi-line data', 'n1'),
        num('Thêm thanh tiến độ đơn hàng (cumulative progress)', 'n1'),
        num('Cập nhật mock data cho multi-line scenarios', 'n1'),
        sp(),

        h2('Phase 2 - Tích hợp Odoo (Theo kế hoạch dự án)'),
        p('Mục tiêu: Kết nối với Odoo ERP để lấy dữ liệu thực.'),
        sp(80),
        num('Đồng bộ danh sách đơn hàng từ Odoo Manufacturing', 'n2'),
        num('Đồng bộ danh sách sản phẩm, máy, nhân viên', 'n2'),
        num('Thêm Rework tracking (loại entry riêng)', 'n2'),
        num('Thêm Scrap tracking (phân loại lỗi)', 'n2'),
        num('Tích hợp IoT data từ Y-nettech (downtime tự động)', 'n2'),
        sp(),

        // ============================================================
        // PHẦN 6: CÂU HỎI CẦN XÁC NHẬN
        // ============================================================
        br(),
        h1('Phần 6: Câu Hỏi Cần Xác Nhận Với Khách Hàng'),
        sp(100),
        p('Trước khi triển khai, cần xác nhận với nhà máy các điểm sau:'),
        sp(80),

        tbl(
          ['#', 'Câu hỏi', 'Tại sao cần hỏi'],
          [
            ['1', 'Trung bình 1 operator chuyển bao nhiêu đơn hàng/ngày?', 'Xác định max entries để tối ưu UI'],
            ['2', 'Operator có thường chạy nhiều máy CNC cùng lúc không? Tối đa mấy máy?', 'Quyết định giao diện multi-select máy'],
            ['3', 'Thời gian changeover trung bình là bao lâu? Có KPI cho changeover không?', 'Quyết định có cần setup entry hay không'],
            ['4', 'Có bao nhiêu ca (shift) trong ngày? Có ca đêm không?', 'Ảnh hưởng đến logic ngày báo cáo'],
            ['5', 'Khi máy hỏng, ai ghi nhận - operator hay bảo trì?', 'Quyết định downtime entry thuộc report nào'],
            ['6', 'Rework có xảy ra thường xuyên không? Ai quyết định rework?', 'Quyết định có cần rework tracking ở Phase 1 không'],
            ['7', 'Đơn hàng có tổng số lượng cố định không? Hay thay đổi giữa chừng?', 'Ảnh hưởng đến tính tiến độ lũy kế'],
            ['8', 'Có cần phân biệt planned downtime và unplanned downtime không?', 'Quyết định mức độ chi tiết cho downtime'],
          ],
          [500, 4800, 3726]
        ),

        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '--- Hết tài liệu ---', size: 20, font: F, color: '999999', italics: true })] }),
      ]
    }
  ]
});

async function generate() {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('/sessions/dreamy-friendly-ride/mnt/Odoo_Y-nettech_colab/ReportCases_Plan_v1.docx', buf);
  console.log('OK: ReportCases_Plan_v1.docx');
}
generate();
