export type TxType = 'income' | 'expense';

export type CategoryId =
  | 'salary'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  tint: string;
  type: TxType | 'both';
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TxType;
  categoryId: CategoryId;
  title: string;
  amount: number;
  date: string;
}
