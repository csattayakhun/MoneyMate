const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export function formatMoney(value: number): string {
  const rounded = Math.round(Math.abs(value));
  const withComma = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '฿' + withComma;
}

export function formatThaiDate(iso: string): string {
  const [, month, day] = iso.split('-').map(Number);
  return `${day} ${THAI_MONTHS_SHORT[month - 1]}`;
}

export function formatThaiMonthYear(year: number, monthIndex: number): string {
  return `${THAI_MONTHS_FULL[monthIndex]} ${year + 543}`;
}

export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
