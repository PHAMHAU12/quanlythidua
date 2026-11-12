import { AppData, Criteria, Team } from '../types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 1,
    name: 'Tổ 1',
    color: 'blue',
    students: ['Nguyễn Minh Khang', 'Trần Anh Phong', 'Phạm Thu Trâm', 'Đỗ Mỹ Hà'],
  },
  {
    id: 2,
    name: 'Tổ 2',
    color: 'indigo',
    students: ['Lê Quốc Sơn', 'Lê Bảo Uyên', 'Mai Hữu Quân', 'Phạm Khánh Chi'],
  },
  {
    id: 3,
    name: 'Tổ 3',
    color: 'amber',
    students: ['Võ Hữu Khoa', 'Ngô Hoàng Thư', 'Đặng Quang Huy', 'Bùi Quỳnh Anh'],
  },
  {
    id: 4,
    name: 'Tổ 4',
    color: 'emerald',
    students: ['Hoàng Gia Huy', 'Vũ Hoàng Linh', 'Phan Thanh Tùng', 'Lý Thanh Trúc'],
  },
];

// Bộ tiêu chí thi đua toàn diện dành cho LỚP CHỦ NHIỆM (Nề nếp, Học tập, Kỷ luật, Vệ sinh, Phong trào)
export const HOMEROOM_CRITERIA: Criteria[] = [
  // --- HỌC TẬP ---
  { id: 101, text: 'Điểm kiểm tra / kiểm tra miệng đạt điểm 9 - 10', points: 2, target: 'Cá nhân', category: 'Học tập' },
  { id: 102, text: 'Phát biểu xây dựng bài tích cực trong tiết học', points: 1, target: 'Cá nhân', category: 'Học tập' },
  { id: 103, text: 'Đạt giải học sinh giỏi / nghiên cứu khoa học / cuộc thi các cấp', points: 5, target: 'Cá nhân', category: 'Học tập' },
  { id: 104, text: 'Tiết học xếp loại Tốt (Tổ không có bạn vi phạm sổ đầu bài)', points: 2, target: 'Tổ', category: 'Học tập' },
  { id: 105, text: 'Không học bài cũ / không chuẩn bị bài trước khi đến lớp', points: -2, target: 'Cá nhân', category: 'Học tập' },
  { id: 106, text: 'Không làm bài tập về nhà / không ghi chép bài đầy đủ', points: -2, target: 'Cá nhân', category: 'Học tập' },
  { id: 107, text: 'Điểm kiểm tra dưới trung bình (< 5.0)', points: -2, target: 'Cá nhân', category: 'Học tập' },
  { id: 108, text: 'Gian lận / quay cóp trong giờ kiểm tra', points: -5, target: 'Cá nhân', category: 'Học tập' },

  // --- KỶ LUẬT & TÁC PHONG ---
  { id: 201, text: 'Mặc sai đồng phục / không đeo bảng tên / không đúng giày dép', points: -2, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 202, text: 'Sử dụng điện thoại trong giờ học khi chưa được phép', points: -3, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 203, text: 'Mất trật tự, nói chuyện riêng bị ghi tên vào Sổ đầu bài', points: -3, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 204, text: 'Nhuộm tóc / tác phong nề nếp chưa đúng nội quy', points: -2, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 205, text: 'Gửi xe ngoài trường / vi phạm luật an toàn giao thông', points: -5, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 206, text: 'Gây gổ, làm mất đoàn kết nội bộ trong lớp', points: -10, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 207, text: 'Vô lễ với thầy cô giáo hoặc nhân viên nhà trường', points: -10, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
  { id: 208, text: 'Lễ phép chào hỏi thầy cô, có hành vi văn minh chuẩn mực', points: 1, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },

  // --- CHUYÊN CẦN ---
  { id: 301, text: 'Đi học đúng giờ, chuyên cần đầy đủ cả tuần', points: 2, target: 'Cá nhân', category: 'Chuyên cần' },
  { id: 302, text: 'Đi học muộn / vào lớp trễ tiết', points: -2, target: 'Cá nhân', category: 'Chuyên cần' },
  { id: 303, text: 'Nghỉ học không phép', points: -5, target: 'Cá nhân', category: 'Chuyên cần' },
  { id: 304, text: 'Trốn tiết / cúp tiết không có lý do chính đáng', points: -10, target: 'Cá nhân', category: 'Chuyên cần' },

  // --- VỆ SINH & TRỰC NHẬT ---
  { id: 401, text: 'Trực nhật lớp sạch sẽ, bàn ghế ngay ngắn, đổ rác đúng giờ', points: 2, target: 'Tổ', category: 'Vệ sinh' },
  { id: 402, text: 'Trực nhật muộn, lớp bẩn bị Đoàn trường / Cờ đỏ trừ điểm', points: -3, target: 'Tổ', category: 'Vệ sinh' },
  { id: 403, text: 'Không tắt quạt, đèn, máy chiếu khi ra khỏi phòng học', points: -2, target: 'Cá nhân', category: 'Vệ sinh' },
  { id: 404, text: 'Xả rác bừa bãi trong lớp hoặc ngoài hành lang', points: -2, target: 'Cá nhân', category: 'Vệ sinh' },
  { id: 405, text: 'Tích cực tham gia lao động, chăm sóc bồn hoa / cây cảnh lớp', points: 2, target: 'Cá nhân', category: 'Vệ sinh' },

  // --- PHONG TRÀO & ĐOÀN THỂ ---
  { id: 501, text: 'Tham gia tích cực phong trào văn nghệ, thể thao, hội thao', points: 3, target: 'Cá nhân', category: 'Phong trào' },
  { id: 502, text: 'Đoạt giải phong trào thi đua cấp trường (20/11, 26/3, Hội khỏe)', points: 5, target: 'Cá nhân', category: 'Phong trào' },
  { id: 503, text: 'Gương người tốt việc tốt, nhặt được của rơi trả lại người mất', points: 3, target: 'Cá nhân', category: 'Phong trào' },
  { id: 504, text: 'Đôi bạn cùng tiến: Tích cực hỗ trợ bạn tiến bộ trong học tập', points: 3, target: 'Cá nhân', category: 'Phong trào' },
  { id: 505, text: 'Không tham gia sinh hoạt tập thể / vắng họp lớp không lý do', points: -2, target: 'Cá nhân', category: 'Phong trào' },
];

// Bộ tiêu chí phụ: Chuyên đề Môn Toán 12
export const MATH_CRITERIA: Criteria[] = [
  { id: 1, text: 'Giải nhanh bài toán cực trị hàm số', points: 2, target: 'Cá nhân', category: 'Toán học' },
  { id: 2, text: 'Phát hiện lỗi sai tiệm cận / đồ thị', points: 2, target: 'Cá nhân', category: 'Toán học' },
  { id: 3, text: 'Làm bài tập khảo sát đầy đủ & trình bày sạch đẹp', points: 1, target: 'Cá nhân', category: 'Toán học' },
  { id: 4, text: 'Thuyết trình mô hình STEM Toán học xuất sắc', points: 3, target: 'Tổ', category: 'Toán học' },
  { id: 5, text: 'Vẽ đúng và nhanh bảng biến thiên hàm bậc 3 / bậc 4', points: 2, target: 'Cá nhân', category: 'Toán học' },
  { id: 6, text: 'Tìm đúng GTLN - GTNN bài toán tối ưu thực tế', points: 2, target: 'Cá nhân', category: 'Toán học' },
  { id: 7, text: 'Giải đúng câu hỏi trắc nghiệm vận dụng cao (VDC)', points: 3, target: 'Cá nhân', category: 'Toán học' },
  { id: 8, text: 'Hỗ trợ bạn cùng tổ hiểu bài khảo sát hàm số', points: 1, target: 'Cá nhân', category: 'Toán học' },
  { id: 9, text: 'Không làm bài tập về nhà môn Toán', points: -1, target: 'Cá nhân', category: 'Toán học' },
  { id: 10, text: 'Sai dấu hoặc lỗi tính đạo hàm cơ bản', points: -1, target: 'Cá nhân', category: 'Toán học' },
  { id: 11, text: 'Mất trật tự hoặc dùng điện thoại không xin phép', points: -1, target: 'Cá nhân', category: 'Kỷ luật & Tác phong' },
];

export const INITIAL_CRITERIA = HOMEROOM_CRITERIA;

export const INITIAL_APP_DATA: AppData = {
  appName: 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU',
  className: '12A6',
  topic: 'Nề nếp & Thi đua Toàn diện Lớp Chủ Nhiệm',
  currentWeek: 'Tuần 11 (09/11 - 14/11/2026)',
  teams: INITIAL_TEAMS,
  criteria: HOMEROOM_CRITERIA,
  scores: {
    'Nguyễn Minh Khang': 9,
    'Trần Anh Phong': 7,
    'Phạm Thu Trâm': 8,
    'Đỗ Mỹ Hà': 6,
    'Lê Quốc Sơn': 8,
    'Lê Bảo Uyên': 10,
    'Mai Hữu Quân': 5,
    'Phạm Khánh Chi': 7,
    'Võ Hữu Khoa': 11,
    'Ngô Hoàng Thư': 6,
    'Đặng Quang Huy': 7,
    'Bùi Quỳnh Anh': 9,
    'Hoàng Gia Huy': 7,
    'Vũ Hoàng Linh': 8,
    'Phan Thanh Tùng': 6,
    'Lý Thanh Trúc': 8,
  },
  history: [
    {
      id: 'h-1',
      time: '14:20 11/11/2026',
      student: 'Võ Hữu Khoa',
      team: 'Tổ 3',
      reason: 'Điểm kiểm tra 15 phút đạt điểm 10 xuất sắc',
      points: 2,
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: 'h-2',
      time: '13:45 11/11/2026',
      student: 'Lê Bảo Uyên',
      team: 'Tổ 2',
      reason: 'Đôi bạn cùng tiến: Tích cực hỗ trợ bạn tiến bộ trong học tập',
      points: 3,
      timestamp: Date.now() - 3600000 * 4,
    },
    {
      id: 'h-3',
      time: '10:15 11/11/2026',
      student: 'Cả Tổ 4',
      team: 'Tổ 4',
      reason: 'Trực nhật lớp sạch sẽ, bàn ghế ngay ngắn, đổ rác đúng giờ',
      points: 2,
      timestamp: Date.now() - 3600000 * 6,
    },
    {
      id: 'h-4',
      time: '09:05 11/11/2026',
      student: 'Nguyễn Minh Khang',
      team: 'Tổ 1',
      reason: 'Tham gia tích cực phong trào văn nghệ chào mừng Ngày Nhà giáo 20/11',
      points: 3,
      timestamp: Date.now() - 3600000 * 8,
    },
  ],
  undoStack: [],
};

export const QUICK_MATH_CHALLENGES = [
  {
    topic: 'Cực trị hàm số',
    question: 'Cho hàm số y = x³ - 3x² + 2. Tìm toạ độ điểm cực đại của đồ thị hàm số?',
    answer: 'Cực đại tại x = 0 ⇒ y = 2. Toạ độ điểm CĐ: (0; 2)',
    points: 2,
  },
  {
    topic: 'Đường tiệm cận',
    question: 'Đồ thị hàm số y = (2x - 1) / (x + 3) có đường tiệm cận ngang và tiệm cận đứng lần lượt là gì?',
    answer: 'Tiệm cận đứng: x = -3; Tiệm cận ngang: y = 2',
    points: 2,
  },
  {
    topic: 'Đơn điệu hàm số',
    question: 'Hàm số y = -x³ + 3x nghịch biến trên những khoảng nào?',
    answer: "y' = -3x² + 3 = 0 ⇔ x = ±1. Nghịch biến trên (-∞; -1) và (1; +∞)",
    points: 2,
  },
  {
    topic: 'Nội quy lớp học',
    question: 'Theo nội quy lớp chủ nhiệm, nếu đi học muộn hoặc không đeo bảng tên sẽ bị trừ bao nhiêu điểm thi đua?',
    answer: 'Trừ 2 điểm cho mỗi lần vi phạm',
    points: 1,
  },
  {
    topic: 'Vệ sinh lớp học',
    question: 'Tổ trực nhật đạt yêu cầu sạch sẽ, bàn ghế ngay ngắn được cộng bao nhiêu điểm cho cả tổ?',
    answer: 'Cộng 2 điểm thi đua cho cả tổ',
    points: 2,
  },
];
