// Banners for Hero Slider
export const BANNERS = [
  {
    id: 1,
    title: "ĐẠI CHIẾN TỨ HOÀNG",
    subtitle: "KHÁM PHÁ KỶ NGUYÊN HẢI TẶC MỚI",
    description: "Tham gia thế giới hải tặc sôi động, giăng buồm ra khơi, chinh phục Đại Hải Trình cùng hàng triệu người chơi khác và tìm kiếm kho báu vĩ đại nhất!",
    image: "/banner_adventure.png",
    buttonText: "⚓ CHƠI NGAY",
    action: "account",
    badge: "HOT UPDATE"
  },
  {
    id: 2,
    title: "ĐẤU TRƯỜNG CHAMPIONS",
    subtitle: "GIẢI ĐẤU PVP TÌM KIẾM VUA HẢI TẶC",
    description: "Sân chơi PK đỉnh cao dành cho các hải tặc kiệt xuất khẳng định bản lĩnh. Vinh danh bảng vàng, nhận danh hiệu độc quyền và hàng ngàn Coin quà tặng!",
    image: "/banner_pvp.png",
    buttonText: "⚡ THAM GIA NGAY",
    action: "account",
    badge: "PVP ARENA"
  },
  {
    id: 3,
    title: "SIÊU CẬP NHẬT 2.0",
    subtitle: "KỶ NGUYÊN CHUYỂN SINH MỚI",
    description: "Mở rộng cấp giới hạn, tính năng Chuyển Sinh thần thánh, thêm phụ bản lăng mộ cổ, và cập nhật hàng loạt trang bị tối thượng thời trang cực ngầu!",
    image: "/banner_update.png",
    buttonText: "📖 XEM CẬP NHẬT",
    action: "download",
    badge: "PHIÊN BẢN MỚI"
  }
];

// Character Classes
export const CLASSES = [
  {
    id: 1,
    name: "Võ Sĩ",
    icon: "✊",
    weapon: "Găng Tay Sắt",
    color: "#f43f5e",
    accentGlow: "rgba(244, 63, 94, 0.4)",
    role: "Tiên Phong / Tanker",
    description: "Sức mạnh từ nắm đấm thép huyền thoại. Sở hữu lượng máu dồi dào, khả năng càn quét cận chiến mạnh mẽ và là lá chắn phòng thủ tuyệt vời cho đồng đội trong mọi hoạt động tổ đội.",
    stats: { hp: 95, atk: 75, def: 90, spd: 60 }
  },
  {
    id: 2,
    name: "Kiếm Khách",
    icon: "⚔️",
    weapon: "Danh Kiếm Hạt Mưa",
    color: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.4)",
    role: "Sát Thủ / Bạo Kích",
    description: "Bậc thầy kiếm thuật với những đường kiếm sắc bén. Tấn công cận chiến linh hoạt, sở hữu sát thương vật lý và tỉ lệ chí mạng cao nhất trong 5 class, có khả năng kết liễu mục tiêu nhanh chóng.",
    stats: { hp: 75, atk: 95, def: 70, spd: 80 }
  },
  {
    id: 3,
    name: "Đầu Bếp",
    icon: "🍳",
    weapon: "Hắc Cước Phong Ma",
    color: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.4)",
    role: "Đấu Sĩ Cơ Động",
    description: "Sử dụng những cú đá uy lực có tốc độ kinh hoàng. Nổi bật với chỉ số né tránh cực tốt, bộ kỹ năng PK cơ động, phản đòn mạnh mẽ cùng khả năng hồi máu đột phá cho bản thân.",
    stats: { hp: 80, atk: 85, def: 65, spd: 95 }
  },
  {
    id: 4,
    name: "Hoa Tiêu",
    icon: "🌪️",
    weapon: "Gậy Thời Tiết",
    color: "#06b6d4",
    accentGlow: "rgba(6, 182, 212, 0.4)",
    role: "Pháp Sư / Khống Chế",
    description: "Khống chế thiên nhiên và thời tiết bằng gậy ma thuật. Gây sát thương phép thuật diện rộng cực mạnh, tạo các hiệu ứng khống chế khó chịu như đóng băng, sấm sét làm chậm mục tiêu.",
    stats: { hp: 65, atk: 90, def: 60, spd: 75 }
  },
  {
    id: 5,
    name: "Xạ Thủ",
    icon: "🎯",
    weapon: "Súng Hỏa Mai / Ná Thun",
    color: "#a855f7",
    accentGlow: "rgba(168, 85, 247, 0.4)",
    role: "Xạ Thủ Tầm Xa",
    description: "Bắn phá kẻ thù từ khoảng cách an toàn nhất. Sát thương vật lý duy trì liên tục rất mạnh, có độ chính xác cao, chuyên gây các hiệu ứng bất lợi suy giảm sức mạnh của đối thủ từ tầm xa.",
    stats: { hp: 70, atk: 88, def: 55, spd: 85 }
  }
];

// Download links
export const DOWNLOAD_LINKS = {
  android: "https://drive.google.com/drive/folders/1Q6ZlksXz8NX_ejBytDQFcR6RyuTukaS3?usp=sharing",
  ios: "https://drive.google.com/drive/folders/1Q6ZlksXz8NX_ejBytDQFcR6RyuTukaS3?usp=sharing",
  pc: "https://drive.google.com/drive/folders/1Q6ZlksXz8NX_ejBytDQFcR6RyuTukaS3?usp=sharing"
};

// Social & Support links
export const SUPPORT_LINKS = {
  telegram: "https://t.me/HTTH_Support",
  telegramName: "@HTTH_Support",
  zalo: "https://zalo.me/g/5kecoibhjjidw7ffumz5",
  zaloName: "Tham Gia Box Zalo Hỗ Trợ"
};
