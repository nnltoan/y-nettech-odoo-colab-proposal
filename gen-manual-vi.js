const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const PAGE_W = 11906;
const CONTENT_W = 9026;
const BLUE = '1F4E79';
const LB = 'D6E4F0';
const B = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BS = { top: B, bottom: B, left: B, right: B };
const CM = { top: 60, bottom: 60, left: 100, right: 100 };
const F = 'Arial';

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, bold: true })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, bold: true })] }); }
function h3(t) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, bold: true })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 120 }, ...o.pp, children: [new TextRun({ text: t, size: 22, font: F, ...o })] }); }
function pb(t, o = {}) { return p(t, { bold: true, ...o }); }
function br() { return new Paragraph({ children: [new PageBreak()] }); }
function sp(n = 200) { return new Paragraph({ spacing: { after: n } }); }

function c(t, o = {}) {
  return new TableCell({
    borders: BS, margins: CM,
    width: o.w ? { size: o.w, type: WidthType.DXA } : undefined,
    shading: o.f ? { fill: o.f, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: o.a || AlignmentType.LEFT,
      children: [new TextRun({ text: t || '', size: 20, font: F, bold: !!o.b })]
    })]
  });
}

function tbl(hds, rows, cw) {
  const tw = cw.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: tw, type: WidthType.DXA }, columnWidths: cw,
    rows: [
      new TableRow({ children: hds.map((h, i) => c(h, { b: true, f: LB, w: cw[i] })) }),
      ...rows.map(r => new TableRow({ children: r.map((x, i) => c(x, { w: cw[i] })) }))
    ]
  });
}

function bullet(t) {
  return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text: t, size: 22, font: F })] });
}
function num(t, ref = 'n1') {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 },
    children: [new TextRun({ text: t, size: 22, font: F })] });
}

const numbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n1', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n3', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n4', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n5', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n6', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'n7', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
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
  children: [new TextRun({ text: 'Smart Factory - Production Report System', size: 16, font: F, color: '999999' })] })] });
const ftr = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Page ', size: 16, font: F, color: '999999' }), new TextRun({ children: [PageNumber.CURRENT], size: 16, font: F, color: '999999' })] })] });
const pgProps = {
  page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
};

// ====================== DOCUMENT 1: USER MANUAL (Vietnamese) ======================
const manualDoc = new Document({
  styles, numbering,
  sections: [
    // COVER
    {
      properties: pgProps,
      children: [
        sp(3600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'TÀI LIỆU NỘI BỘ - INTERNAL REVIEW', size: 24, font: F, color: '888888' })] }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'HỆ THỐNG BÁO CÁO SẢN XUẤT', size: 44, bold: true, font: F, color: BLUE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'NHÀ MÁY THÔNG MINH', size: 36, bold: true, font: F, color: BLUE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Smart Factory Production Report System', size: 24, font: F, color: '666666' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Hướng Dẫn Sử Dụng (Tiếng Việt)', size: 28, bold: true, font: F })] }),
        sp(1200),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Phiên bản 1.0 (Demo) - Tháng 4/2026', size: 22, font: F, color: '888888' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DanaExperts x Y-nettech', size: 22, font: F, color: '888888' })] }),
      ]
    },
    // CONTENT
    {
      properties: pgProps,
      headers: { default: hdr }, footers: { default: ftr },
      children: [
        // CH1
        h1('Chương 1: Tổng Quan Hệ Thống'),
        p('Hệ thống Báo cáo Sản xuất Nhà máy Thông minh là ứng dụng web giúp số hóa quy trình báo cáo sản xuất hàng ngày của bộ phận gia công CNC. Ứng dụng được thiết kế cho tablet, với giao diện thân thiện để công nhân cao tuổi cũng dễ dàng sử dụng.'),
        h2('Đặc điểm chính'),
        bullet('Dashboard riêng cho 6 vai trò (Operator, Tổ trưởng, Trưởng bộ phận CNC, QA, Bảo trì, Giám đốc)'),
        bullet('Luồng phê duyệt tự động theo mức độ nghiêm trọng của lỗi (Normal / Major / Critical)'),
        bullet('Phân tích nguyên nhân 4M: Man (Người), Machine (Máy), Material (Vật liệu), Method (Phương pháp)'),
        bullet('Giao diện Modal Selector - nút bấm lớn, dễ chọn cho công nhân cao tuổi'),
        bullet('Hỗ trợ song ngữ Nhật - Anh'),
        bullet('Responsive: PC, tablet, điện thoại'),
        sp(),

        // CH2
        h1('Chương 2: Các Vai Trò và Quyền Hạn'),
        p('Hệ thống có 6 vai trò, mỗi vai trò có dashboard và quyền hạn riêng:'),
        tbl(
          ['Vai trò', 'Tên tiếng Nhật', 'Quyền hạn chính'],
          [
            ['Operator', 'Operator', 'Tạo báo cáo, xem thực tích cá nhân'],
            ['Tổ trưởng (Team Leader)', 'Hanchō', 'Tạo báo cáo + quản lý team + phê duyệt cấp 1'],
            ['Trưởng bộ phận CNC (Section Mgr)', 'Kachō', 'Quản lý bộ phận + phê duyệt cấp 2 (Critical)'],
            ['Quản lý chất lượng (QA)', 'Hinshitsu Kanri', 'Phân tích chất lượng + phê duyệt cấp 3'],
            ['Trưởng nhóm bảo trì', 'Hozen Leader', 'Theo dõi tình trạng máy móc'],
            ['Giám đốc nhà máy', 'Kōjōchō', 'Tổng quan toàn nhà máy + phê duyệt cuối (Critical) + cài đặt'],
          ],
          [2200, 1800, 5026]
        ),
        sp(),
        h2('Phân quyền dữ liệu'),
        bullet('Operator: chỉ xem dữ liệu của mình'),
        bullet('Tổ trưởng: xem dữ liệu của cả team'),
        bullet('Trưởng bộ phận CNC / QA / Giám đốc: xem dữ liệu toàn nhà máy'),
        sp(),

        // CH3
        h1('Chương 3: Đăng Nhập'),
        p('Màn hình đăng nhập dạng thẻ bấm (card-based login), thiết kế cho tablet:'),
        num('Chọn ngôn ngữ (Nhật / Anh) ở góc trên', 'n1'),
        num('Bấm vào thẻ tên của mình', 'n1'),
        num('Hệ thống tự động chuyển đến Dashboard tương ứng với vai trò', 'n1'),
        sp(80),
        p('Màu sắc thẻ theo vai trò: Xanh dương = Operator, Xanh lá = Tổ trưởng, Cam = Trưởng bộ phận CNC, Tím = QA, Đỏ = Giám đốc.', { color: '555555' }),
        sp(),

        // CH4
        h1('Chương 4: Dashboard'),
        h2('4.1. Operator Dashboard'),
        p('Hiển thị thông tin cá nhân của người vận hành máy:'),
        tbl(
          ['Khu vực', 'Nội dung hiển thị'],
          [
            ['4 thẻ KPI', 'Máy được phân công + Shift / Kế hoạch hôm nay + Sản phẩm / Giờ làm (tháng 4) / Báo cáo chưa hoàn thành'],
            ['Thành tích tháng/năm', '2 thẻ: Tỷ lệ đạt + Sản lượng + Tỷ lệ lỗi (tháng hiện tại vs cả năm)'],
            ['Giờ làm theo đơn hàng', 'Bảng: Mã đơn / Sản phẩm / Giờ thường / Tăng ca / Tổng / Sản lượng / Tỷ lệ đạt'],
            ['Báo cáo gần đây', 'Bảng: Ngày / Sản phẩm / Thực tế / Tỷ lệ lỗi / Trạng thái (có badge màu)'],
          ],
          [2500, 6526]
        ),
        sp(),

        h2('4.2. Ban Trưởng Dashboard'),
        p('Tổ trưởng cũng vận hành máy CNC, nên dashboard gồm 2 phần:'),
        h3('Phần 1: Thực tích cá nhân (giống Operator)'),
        p('4 thẻ KPI + Thành tích tháng/năm + Giờ làm theo đơn hàng + Báo cáo cá nhân. Tất cả nằm trong khung xanh nhạt để phân biệt.'),
        h3('Phần 2: Quản lý team'),
        bullet('4 thẻ: Số yêu cầu phê duyệt (viền vàng nếu có) / Tỷ lệ đạt team / Lỗi team / Số thành viên'),
        bullet('Bảng thực tích team theo đơn hàng'),
        bullet('Danh sách báo cáo của team (15 báo cáo gần nhất)'),
        p('Nút "Tạo báo cáo mới" ở góc phải trên dashboard.', { color: '555555' }),
        sp(),

        h2('4.3. Các Dashboard khác'),
        tbl(
          ['Vai trò', 'Nội dung chính'],
          [
            ['Trưởng bộ phận CNC', 'KPI bộ phận (5 thẻ) / Biểu đồ Plan vs Actual / Bảng đơn hàng (highlight Critical) / Mục phê duyệt'],
            ['QA', 'Tổng sản lượng + Lỗi + FPY / Biểu đồ lỗi theo loại / Biểu đồ lỗi theo đơn hàng / Mục phê duyệt QA'],
            ['Bảo trì', 'Số máy / Giờ vận hành / Thời gian dừng / Hiệu suất máy / Bảng chi tiết từng máy'],
            ['Giám đốc', 'Bộ lọc theo đơn hàng / KPI theo đơn hàng / Tiến độ toàn nhà máy / Mục phê duyệt Critical'],
          ],
          [2200, 6826]
        ),
        sp(),

        // CH5
        br(),
        h1('Chương 5: Tạo Báo Cáo (Nhật Báo)'),
        p('Operator và Tổ trưởng tạo báo cáo cuối ngày làm việc. Truy cập qua menu "Báo cáo mới" hoặc nút trên Dashboard.'),

        h2('5.1. Thanh hành động cố định (Sticky Action Bar)'),
        p('Thanh này luôn hiển thị ở đầu màn hình, kể cả khi cuộn xuống:'),
        bullet('Nút "Lưu tạm" (Save Draft): Lưu nháp, chưa gửi phê duyệt. Có thể sửa lại sau.'),
        bullet('Nút "Gửi" (Submit): Gửi cho Tổ trưởng phê duyệt. Hiện hộp thoại xác nhận.'),
        bullet('Hiệu ứng: Khi cuộn xuống, thanh header chính ẩn đi, Action Bar chuyển thành navigation bar (nền tối).'),
        sp(),

        h2('5.2. Các mục nhập liệu'),
        tbl(
          ['Mục', 'Các trường nhập', 'Ghi chú'],
          [
            ['Thông tin cơ bản', 'Ngày / Shift (A/B/C) / Máy / Sản phẩm + Mã đơn', 'Chọn bằng Modal Selector (nút bấm lớn)'],
            ['Sản lượng', 'Số lượng kế hoạch / Số lượng thực tế', 'Nút +5/+1/-1/-5 để điều chỉnh. Cảnh báo nếu vượt 120%'],
            ['Giờ làm', 'Giờ thường / Giờ tăng ca', 'Cảnh báo nếu tăng ca > 4h (quy định 36 hiệp định)'],
            ['Thông tin lỗi', 'Loại lỗi / Mức độ / Số lượng / Mô tả', 'Có thể thêm nhiều lỗi. 3 mức độ: Nhẹ/Nghiêm trọng/Nguy hiểm'],
            ['Phân tích 4M', 'Nguyên nhân (20 mục) / Biện pháp (11 mục)', 'Viền cam nếu chưa nhập (bắt buộc)'],
            ['Ghi chép', 'Mục tiêu / Kết quả / Cải tiến / Kế hoạch ngày mai', 'Nhập văn bản tự do'],
          ],
          [1800, 3600, 3626]
        ),
        sp(),

        h2('5.3. Modal Selector'),
        p('Tất cả dropdown được thay thế bằng Modal Selector - giao diện nút bấm lớn hiện từ dưới màn hình lên. Thiết kế này giúp công nhân cao tuổi, không quen thiết bị công nghệ, vẫn thao tác chính xác. Mục đang chọn được highlight bằng khung xanh.'),
        sp(),

        // CH6
        br(),
        h1('Chương 6: Luồng Phê Duyệt'),
        p('Sau khi gửi báo cáo, hệ thống tự động xác định tuyến phê duyệt dựa trên mức độ nghiêm trọng của lỗi:'),

        h2('6.1. Ba tuyến phê duyệt'),
        tbl(
          ['Tuyến', 'Điều kiện', 'Luồng phê duyệt'],
          [
            ['Normal', 'Tỷ lệ lỗi < 5%, chỉ có lỗi nhẹ', 'Operator → Tổ trưởng → Hoàn thành'],
            ['Major', 'Tỷ lệ lỗi 5-10%, hoặc có lỗi nghiêm trọng', 'Operator → Tổ trưởng → QA → Hoàn thành'],
            ['Critical', 'Tỷ lệ lỗi > 10%, hoặc có lỗi nguy hiểm', 'Operator → Tổ trưởng → Trưởng bộ phận CNC → QA → Giám đốc → Hoàn thành'],
          ],
          [1500, 2800, 4726]
        ),
        sp(),

        h2('6.2. Các trạng thái'),
        tbl(
          ['Trạng thái', 'Tiếng Nhật', 'Ý nghĩa'],
          [
            ['DRAFT', 'Shitagai (下書き)', 'Bản nháp, chưa gửi. Có thể sửa/xóa'],
            ['SUBMITTED', 'Teishutsu-zumi (提出済)', 'Đã gửi, chờ Tổ trưởng duyệt'],
            ['TL_REVIEWING', 'Hanchō kakunin-chū (班長確認中)', 'Tổ trưởng đang xem xét'],
            ['SM_REVIEWING', 'Kachō kakunin-chū (課長確認中)', 'Trưởng bộ phận CNC đang xem xét (chỉ Critical)'],
            ['QA_REVIEWING', 'QA kakunin-chū (QA確認中)', 'QA đang xem xét'],
            ['DIR_REVIEWING', 'Kōjōchō kakunin-chū (工場長確認中)', 'Giám đốc đang xem xét (chỉ Critical)'],
            ['COMPLETED', 'Kanryō (完了)', 'Đã được phê duyệt xong'],
            ['REJECTED', 'Samodoshi (差戻し)', 'Bị từ chối, cần sửa lại'],
          ],
          [2000, 2800, 4226]
        ),
        sp(),

        h2('6.3. Màn hình Phê duyệt'),
        p('Mỗi vai trò chỉ thấy các báo cáo cần CHÍNH MÌNH phê duyệt:'),
        bullet('Tổ trưởng: chỉ thấy SUBMITTED và TL_REVIEWING của team mình'),
        bullet('Trưởng bộ phận CNC: chỉ thấy SM_REVIEWING'),
        bullet('QA: chỉ thấy QA_REVIEWING'),
        bullet('Giám đốc: chỉ thấy DIR_REVIEWING'),
        sp(),

        // CH7
        br(),
        h1('Chương 7: Phân Tích 4M và Quản Lý Lỗi'),
        h2('7.1. Mức độ nghiêm trọng'),
        tbl(
          ['Mức độ', 'Tiếng Nhật', 'Mô tả', 'Ảnh hưởng đến tuyến'],
          [
            ['Minor (Nhẹ)', 'Keibi (軽微)', 'Lỗi ngoại quan nhẹ, không ảnh hưởng chức năng', 'Normal'],
            ['Major (Nghiêm trọng)', 'Jūdai (重大)', 'Ảnh hưởng đến chức năng sản phẩm', 'Major trở lên'],
            ['Critical (Nguy hiểm)', 'Chimei (致命)', 'Ảnh hưởng an toàn hoặc chức năng nghiêm trọng', 'Critical'],
          ],
          [1800, 1600, 3000, 2626]
        ),
        sp(),

        h2('7.2. Phân loại nguyên nhân 4M'),
        tbl(
          ['Nhóm', 'Mã', 'Ví dụ các nguyên nhân'],
          [
            ['Man (Người)', 'M01-M05', 'Thiếu kỹ năng, bất cẩn, mệt mỏi, thiếu kinh nghiệm, giao tiếp kém'],
            ['Machine (Máy)', 'M06-M11', 'Hao mòn, lệch hiệu chuẩn, dao cụ hỏng, nhiệt độ, thủy lực, hệ thống điều khiển'],
            ['Material (Vật liệu)', 'M12-M15', 'Chất liệu không đồng đều, độ cứng kém, kích thước sai, khuyết tật bề mặt'],
            ['Method (Phương pháp)', 'M16-M20', 'Quy trình sai, đo lường không phù hợp, gá kẹm, tốc độ cắt sai, lỗi chương trình'],
          ],
          [2000, 1200, 5826]
        ),
        sp(),

        // CH8
        h1('Chương 8: Các Tính Năng Khác'),
        h2('Thanh điều hướng (Sidebar)'),
        p('Có thể thu gọn (chỉ hiện icon) trên desktop. Trên mobile, mở bằng nút hamburger.'),
        tbl(
          ['Menu', 'Vai trò được phép'],
          [
            ['Dashboard', 'Tất cả'],
            ['Danh sách báo cáo', 'Tất cả'],
            ['Tạo báo cáo mới', 'Operator, Tổ trưởng'],
            ['Phê duyệt', 'Tổ trưởng, Trưởng bộ phận CNC, QA, Giám đốc'],
            ['Phân tích', 'Tổ trưởng, Trưởng bộ phận CNC, QA, Giám đốc'],
            ['Cài đặt', 'Chỉ Giám đốc'],
          ],
          [3000, 6026]
        ),
        sp(),

        h2('Danh sách báo cáo'),
        p('Tìm kiếm và lọc báo cáo: Tất cả / Đang chờ / Hoàn thành / Từ chối. Operator chỉ thấy của mình, Tổ trưởng thấy của team, các vai trò khác thấy toàn bộ.'),

        h2('Phân tích (Analytics)'),
        p('Chọn kỳ: 7 ngày / 30 ngày / 90 ngày / 1 năm. Biểu đồ xu hướng sản lượng và tỷ lệ lỗi theo thời gian.'),

        h2('Chuyển đổi ngôn ngữ'),
        p('Bấm icon hình địa cầu (góc phải trên) để chuyển giữa tiếng Nhật và tiếng Anh. Toàn bộ giao diện được dịch.'),

        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '--- Hết tài liệu ---', size: 20, font: F, color: '999999', italics: true })] }),
      ]
    }
  ]
});

// ====================== DOCUMENT 2: DEMO SCRIPT (Vietnamese) ======================
const demoDoc = new Document({
  styles, numbering,
  sections: [
    // COVER
    {
      properties: pgProps,
      children: [
        sp(3600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'TÀI LIỆU NỘI BỘ - CHUẨN BỊ DEMO', size: 24, font: F, color: '888888' })] }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'KỊCH BẢN DEMO', size: 44, bold: true, font: F, color: BLUE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Hệ Thống Báo Cáo Sản Xuất', size: 36, bold: true, font: F, color: BLUE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Smart Factory Production Report System', size: 24, font: F, color: '666666' })] }),
        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Đối tượng: Khách hàng (Nhà máy Nhật Bản)', size: 22, font: F })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Thời lượng dự kiến: 30-45 phút', size: 22, font: F })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Phiên bản 1.0 (Demo) - Tháng 4/2026', size: 22, font: F, color: '888888' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DanaExperts x Y-nettech', size: 22, font: F, color: '888888' })] }),
      ]
    },
    // CONTENT
    {
      properties: pgProps,
      headers: { default: hdr }, footers: { default: ftr },
      children: [
        h1('Phần 1: Chuẩn Bị Trước Demo'),

        h2('1.1. Thiết bị'),
        bullet('Laptop kết nối màn hình lớn (hoặc projector)'),
        bullet('1 tablet (iPad hoặc Android) để demo thao tác thực tế - không bắt buộc nhưng tăng thuyết phục'),
        bullet('Kết nối internet ổn định'),
        sp(),

        h2('1.2. Trình duyệt'),
        bullet('Mở sẵn trang web demo (link Vercel)'),
        bullet('Đăng nhập sẵn bằng tài khoản Tanaka (Operator) - để sẵn màn hình đầu tiên'),
        bullet('Mở thêm 1 tab đăng nhập Suzuki (Tổ trưởng) - để chuyển nhanh khi demo phê duyệt'),
        sp(),

        h2('1.3. Dữ liệu mock'),
        p('Hệ thống có sẵn dữ liệu mẫu 3 ngày (1-3/4/2026), với đủ các trạng thái. Không cần nhập thêm dữ liệu trước.'),
        sp(),

        h2('1.4. Lưu ý khi trình bày'),
        bullet('Nói chậm, rõ ràng. Giao diện hiển thị tiếng Nhật - giải thích bằng tiếng Nhật hoặc tiếng Anh'),
        bullet('Nhấn mạnh: "thiết kế cho công nhân cao tuổi" khi demo Modal Selector'),
        bullet('Nhấn mạnh: "tự động định tuyến phê duyệt" khi demo luồng Critical'),
        sp(),

        // =====================================
        br(),
        h1('Phần 2: Kịch Bản Demo Chi Tiết'),
        sp(100),

        // SCENE 1
        h2('Cảnh 1: Giới thiệu và Đăng nhập (3 phút)'),
        p('Mục đích: Giới thiệu tổng quan, cho thấy giao diện thân thiện.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'Mở màn hình đăng nhập. Chỉ vào các thẻ user.', 'Đăng nhập bằng 1 chạm - không cần nhập mật khẩu. Thiết kế cho tablet nhà máy.'],
            ['2', 'Chỉ ra màu sắc theo vai trò: xanh dương, xanh lá, cam, tím, đỏ.', 'Mỗi vai trò có dashboard riêng, quyền hạn riêng.'],
            ['3', 'Bấm nút chuyển đổi ngôn ngữ (JP/EN).', 'Hỗ trợ song ngữ cho nhà máy có cả nhân viên nước ngoài.'],
            ['4', 'Bấm thẻ "Tanaka" (Operator) để đăng nhập.', 'Chuyển trực tiếp đến Dashboard.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // SCENE 2
        h2('Cảnh 2: Dashboard Operator (5 phút)'),
        p('Mục đích: Cho thấy công nhân thấy được thông tin gì khi bắt đầu ngày làm việc.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'Chỉ vào 4 thẻ KPI trên cùng: Máy được phân công, Kế hoạch hôm nay, Giờ làm tháng 4, Báo cáo chờ xử lý.', 'Ngay khi đăng nhập, công nhân biết mình làm máy nào, sản xuất gì, bao nhiêu.'],
            ['2', 'Chỉ vào 2 thẻ "Thành tích tháng" và "Thành tích năm".', 'Mỗi người tự theo dõi hiệu suất của mình. Màu xanh = tốt, màu cam = cần cải thiện.'],
            ['3', 'Cuộn xuống bảng "Giờ làm theo đơn hàng".', 'Theo dõi chi tiết thời gian làm việc từng đơn hàng, bao gồm tăng ca.'],
            ['4', 'Chỉ bảng "Báo cáo gần đây" với cột Status.', 'Trạng thái hiển thị bằng badge màu - dễ nhận biết báo cáo đang ở bước nào.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // SCENE 3
        h2('Cảnh 3: Tạo Báo Cáo Mới (10 phút) --- TRỌNG TÂM'),
        p('Mục đích: Demo quy trình tạo nhật báo cuối ngày. Đây là cảnh QUAN TRỌNG NHẤT.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'Bấm menu "Báo cáo mới" trên sidebar.', 'Màn hình tạo báo cáo với Action Bar cố định ở trên.'],
            ['2', 'Bấm nút chọn Shift → Modal hiện lên từ dưới.', 'MODAL SELECTOR: Nút lớn, dễ bấm, phù hợp người cao tuổi. Không dùng dropdown nhỏ.'],
            ['3', 'Chọn Shift A. Bấm nút chọn Máy → chọn CNC-003.', 'Mọi trường đều dùng Modal - nhất quán, dễ học.'],
            ['4', 'Bấm nút chọn Sản phẩm → chọn "Flange" (J2025-001).', 'Hiển thị mã đơn hàng và số lượng kế hoạch tự động.'],
            ['5', 'Tại mục Sản lượng, bấm +5 vài lần để điều chỉnh số thực tế.', 'Nút +5/+1/-1/-5 thay vì gõ bàn phím. Nhanh và chính xác.'],
            ['6', 'Cuộn xuống mục Lỗi. Bấm "Thêm lỗi".', 'Hệ thống hỗ trợ nhập nhiều lỗi cùng lúc.'],
            ['7', 'Chọn loại lỗi, chọn mức độ "Major", nhập số lượng.', 'Mức độ lỗi quyết định tuyến phê duyệt. Đây là điểm then chốt.'],
            ['8', 'Bấm chọn Nguyên nhân (4M) → Modal hiện các nhóm Man/Machine/Material/Method.', 'Phân tích 4M tích hợp trực tiếp, không cần form riêng.'],
            ['9', 'Chọn Biện pháp xử lý.', 'Cảnh báo cam nếu chưa nhập - bắt buộc phải có nguyên nhân và biện pháp.'],
            ['10', 'CUỘN XUỐNG - chỉ ra Action Bar vẫn cố định ở trên, nền chuyển thành nav bar tối.', 'Luôn có thể Lưu/Gửi mà không cần cuộn lên. Animation mượt.'],
            ['11', 'Bấm "Lưu tạm" (Save Draft).', 'Báo cáo lưu với trạng thái DRAFT. Có thể quay lại sửa bất kỳ lúc nào.'],
            ['12', 'Bấm "Gửi" (Submit). Hộp thoại xác nhận hiện lên.', 'Hệ thống cảnh báo nếu lỗi chưa có nguyên nhân. Bấm xác nhận để gửi.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // SCENE 4
        br(),
        h2('Cảnh 4: Luồng Phê Duyệt (10 phút) --- TRỌNG TÂM'),
        p('Mục đích: Demo quy trình phê duyệt tự động theo tuyến Normal/Major/Critical.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'CHUYỂN TAB: Đăng nhập tài khoản Suzuki (Tổ trưởng).', 'Chuyển vai trò để demo góc nhìn người phê duyệt.'],
            ['2', 'Chỉ Dashboard Tổ trưởng: phần thực tích cá nhân + phần team.', 'Tổ trưởng cũng vận hành máy, nên có đủ 2 góc nhìn.'],
            ['3', 'Chỉ thẻ "Yêu cầu phê duyệt" (viền vàng).', 'Báo cáo vừa gửi của Tanaka hiện ở đây.'],
            ['4', 'Bấm menu "Phê duyệt" trên sidebar.', 'Chỉ hiện các báo cáo cần CHÍNH BAN TRƯỞNG duyệt - không lẫn với vai trò khác.'],
            ['5', 'Bấm vào 1 báo cáo để xem chi tiết.', 'Hiện đầy đủ thông tin: sản lượng, lỗi, 4M, ghi chép.'],
            ['6', 'Bấm "Phê duyệt" (Approve).', 'Vì báo cáo có lỗi Major → hệ thống TỰ ĐỘNG chuyển sang QA (không phải Normal route).'],
            ['7', 'Giải thích: "Nếu là lỗi Critical, báo cáo sẽ đi qua Trưởng bộ phận CNC → QA → Giám đốc."', 'Nhấn mạnh hệ thống tự động, không cần người quyết định tuyến phê duyệt.'],
            ['8', '(Tùy chọn) Đăng nhập Giám đốc, mở Phê duyệt → chỉ thấy DIR_REVIEWING.', 'Mỗi vai trò chỉ thấy việc của mình - không bị nhiễu thông tin.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // SCENE 5
        h2('Cảnh 5: Dashboard Quản Lý (5 phút)'),
        p('Mục đích: Cho thấy góc nhìn quản lý cấp cao.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'Đăng nhập QA (Yamamoto). Chỉ dashboard QA.', 'Biểu đồ lỗi theo loại, lỗi theo đơn hàng. FPY (First Pass Yield).'],
            ['2', 'Đăng nhập Trưởng bộ phận CNC (Kobayashi). Chỉ biểu đồ Plan vs Actual.', 'Dòng highlight đỏ cho đơn hàng Critical. Quản lý thấy ngay vấn đề.'],
            ['3', 'Đăng nhập Giám đốc (Watanabe). Chỉ bộ lọc đơn hàng.', 'Giám đốc lọc theo từng đơn hàng, xem tiến độ tổng thể.'],
            ['4', 'Chỉ mục Critical của Giám đốc (nếu có).', 'Giám đốc là người phê duyệt cuối cùng cho luồng Critical.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // SCENE 6
        h2('Cảnh 6: UI/UX và Tính Năng Phụ (5 phút)'),
        p('Mục đích: Nhấn mạnh các điểm thiết kế đặc biệt.', { bold: true }),
        sp(80),
        tbl(
          ['Bước', 'Thao tác', 'Điểm nhấn mạnh'],
          [
            ['1', 'Thu gọn sidebar (bấm nút <<). Chỉ còn icon.', 'Tiết kiệm không gian màn hình trên tablet.'],
            ['2', 'Bấm icon địa cầu → chuyển sang tiếng Anh.', 'Toàn bộ giao diện dịch sang tiếng Anh.'],
            ['3', 'Thu nhỏ cửa sổ trình duyệt thành dạng điện thoại.', 'Giao diện tự động thích ứng (responsive). Menu chuyển thành hamburger.'],
            ['4', 'Mở menu Phân tích. Chuyển kỳ 7 ngày / 30 ngày.', 'Biểu đồ xu hướng giúp quản lý theo dõi dài hạn.'],
          ],
          [700, 3500, 4826]
        ),
        sp(),

        // =====================================
        br(),
        h1('Phần 3: Câu Hỏi Dự Kiến Từ Khách'),
        sp(100),
        tbl(
          ['Câu hỏi có thể gặp', 'Cách trả lời gợi ý'],
          [
            ['Dữ liệu có thể kết nối với hệ thống hiện tại không?', 'Đây là demo UI/UX. Phase tiếp theo sẽ tích hợp API với Odoo ERP để đồng bộ dữ liệu thực.'],
            ['Có thể tùy chỉnh các trường nhập không?', 'Có. Toàn bộ các trường (loại lỗi, nguyên nhân 4M, sản phẩm...) đều có thể cấu hình theo nhu cầu nhà máy.'],
            ['Bảo mật dữ liệu như thế nào?', 'Production sẽ chạy trên server riêng, có xác thực người dùng đầy đủ (không phải card login như demo).'],
            ['Hỗ trợ offline không?', 'Đang nghiên cứu PWA để hỗ trợ nhập liệu offline và đồng bộ khi có mạng.'],
            ['Thời gian triển khai bao lâu?', 'Phase 1 (MVP): 2-3 tháng. Bao gồm: báo cáo, phê duyệt, dashboard cơ bản.'],
            ['Có thể xuất báo cáo ra Excel/PDF không?', 'Có. Phase 1 sẽ hỗ trợ xuất Excel. Phase 2 sẽ thêm PDF với template tùy chỉnh.'],
            ['Tiếng Việt có được hỗ trợ không?', 'Hệ thống hỗ trợ đa ngôn ngữ. Hiện tại có Nhật-Anh, có thể thêm ngôn ngữ khác.'],
          ],
          [3800, 5226]
        ),
        sp(),

        // =====================================
        br(),
        h1('Phần 4: Tổng Kết và Bước Tiếp Theo'),
        sp(100),
        p('Sau demo, tóm tắt lại 3 điểm chính:', { bold: true }),
        num('Giao diện thân thiện: Modal Selector, nút lớn, action bar cố định - phù hợp mọi đối tượng sử dụng.', 'n5'),
        num('Luồng phê duyệt tự động: Hệ thống tự định tuyến theo mức độ lỗi - giảm sai sót, tiết kiệm thời gian.', 'n5'),
        num('Dashboard đa vai trò: Mỗi người thấy đúng thông tin cần thiết - từ công nhân đến giám đốc.', 'n5'),
        sp(),

        p('Bước tiếp theo đề xuất:', { bold: true }),
        num('Thu thập feedback chi tiết từ khách hàng', 'n6'),
        num('Điều chỉnh demo theo yêu cầu cụ thể của nhà máy', 'n6'),
        num('Lên báo giá chi tiết cho Phase 1', 'n6'),
        num('Lập kế hoạch triển khai và mốc thời gian', 'n6'),
        sp(),

        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '--- Hết kịch bản demo ---', size: 20, font: F, color: '999999', italics: true })] }),
      ]
    }
  ]
});

// ====================== GENERATE ======================
async function generate() {
  const buf1 = await Packer.toBuffer(manualDoc);
  fs.writeFileSync('/sessions/dreamy-friendly-ride/mnt/Odoo_Y-nettech_colab/UserManual_TiengViet_v1.docx', buf1);
  console.log('OK: UserManual_TiengViet_v1.docx');

  const buf2 = await Packer.toBuffer(demoDoc);
  fs.writeFileSync('/sessions/dreamy-friendly-ride/mnt/Odoo_Y-nettech_colab/KichBanDemo_TiengViet_v1.docx', buf2);
  console.log('OK: KichBanDemo_TiengViet_v1.docx');
}
generate();
