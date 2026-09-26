// Formatting utilities

export const formatShortMoney = (amount = 0) => {
  const val = Math.abs(Number(amount) || 0);
  if (val >= 1000000000) {
    const b = Math.floor(val / 1000000000);
    const dec = Math.floor((val % 1000000000) / 100000000);
    return dec > 0 && b < 100 ? `${b}.${dec}B` : `${b}B`;
  }
  if (val >= 1000000) {
    const m = Math.floor(val / 1000000);
    const dec = Math.floor((val % 1000000) / 100000);
    return dec > 0 && m < 100 ? `${m}.${dec}M` : `${m}M`;
  }
  if (val >= 1000) {
    const k = Math.floor(val / 1000);
    const dec = Math.floor((val % 1000) / 100);
    return dec > 0 && k < 10 ? `${k}.${dec}K` : `${k}K`;
  }
  return val.toLocaleString();
};

export const formatCurrency = (amount = 0) => {
  return Number(amount || 0).toLocaleString('vi-VN');
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getTag = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('khai mở') || t.includes('hot') || t.includes('mới')) return 'Hot';
  if (t.includes('sự kiện') || t.includes('đua top') || t.includes('khuyến mại') || t.includes('quà')) return 'Sự Kiện';
  if (t.includes('bảo trì') || t.includes('thông báo') || t.includes('lịch')) return 'Thông Báo';
  return 'Tin Tức';
};
