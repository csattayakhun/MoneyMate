import { Category, CategoryId, Transaction, Wallet } from '@/types/money';

export const CATEGORIES: Record<CategoryId, Category> = {
  salary: { id: 'salary', label: 'เงินเดือน', icon: 'cash', color: '#4CC191', tint: '#E4F6EE', type: 'income' },
  food: { id: 'food', label: 'อาหาร', icon: 'silverware-fork-knife', color: '#FF9E7D', tint: '#FFECE3', type: 'expense' },
  transport: { id: 'transport', label: 'เดินทาง', icon: 'train', color: '#6FB1E8', tint: '#E8F2FC', type: 'expense' },
  shopping: { id: 'shopping', label: 'ช้อปปิ้ง', icon: 'shopping', color: '#F585AC', tint: '#FDE7EF', type: 'expense' },
  entertainment: { id: 'entertainment', label: 'บันเทิง', icon: 'gamepad-variant', color: '#F7C25E', tint: '#FEF3DD', type: 'expense' },
  bills: { id: 'bills', label: 'บิล/ค่าบริการ', icon: 'receipt', color: '#58C9A6', tint: '#E2F6F0', type: 'expense' },
  health: { id: 'health', label: 'สุขภาพ', icon: 'heart-pulse', color: '#F58A8A', tint: '#FDE9E9', type: 'expense' },
  other: { id: 'other', label: 'อื่นๆ', icon: 'dots-horizontal', color: '#BBB2A1', tint: '#F1ECE2', type: 'both' },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

export const WALLETS: Wallet[] = [
  { id: 'w1', name: 'กระเป๋าหลัก', type: 'เงินสด', icon: 'wallet', color: '#FF7E9B' },
  { id: 'w2', name: 'ธนาคาร', type: 'ออมทรัพย์', icon: 'bank', color: '#4DA3E0' },
  { id: 'w3', name: 'เงินเก็บ', type: 'เป้าหมาย', icon: 'piggy-bank', color: '#2FB383' },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', walletId: 'w1', type: 'income', categoryId: 'salary', title: 'เงินเดือน', amount: 15000, date: '2026-10-01' },
  { id: 't2', walletId: 'w2', type: 'income', categoryId: 'salary', title: 'งานพิเศษ', amount: 5900, date: '2026-10-05' },
  { id: 't3', walletId: 'w1', type: 'expense', categoryId: 'food', title: 'ร้านกาแฟ', amount: 120, date: '2026-10-14' },
  { id: 't4', walletId: 'w1', type: 'expense', categoryId: 'food', title: 'ข้าวเที่ยง', amount: 80, date: '2026-10-14' },
  { id: 't5', walletId: 'w1', type: 'expense', categoryId: 'transport', title: 'BTS', amount: 44, date: '2026-10-13' },
  { id: 't6', walletId: 'w1', type: 'expense', categoryId: 'shopping', title: 'ช้อปปิ้งออนไลน์', amount: 690, date: '2026-10-12' },
  { id: 't7', walletId: 'w2', type: 'expense', categoryId: 'bills', title: 'ค่าเน็ต', amount: 599, date: '2026-10-10' },
  { id: 't8', walletId: 'w1', type: 'expense', categoryId: 'entertainment', title: 'Netflix', amount: 349, date: '2026-10-08' },
  { id: 't9', walletId: 'w1', type: 'expense', categoryId: 'food', title: 'ชานมไข่มุก', amount: 65, date: '2026-10-07' },
  { id: 't10', walletId: 'w2', type: 'expense', categoryId: 'health', title: 'ยาสามัญ', amount: 240, date: '2026-10-06' },
];
