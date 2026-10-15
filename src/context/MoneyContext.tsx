import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SEED_TRANSACTIONS, WALLETS } from '@/constants/money-data';
import { Transaction, Wallet } from '@/types/money';
import { DEFAULT_DAILY_LIMIT } from '@/styles/theme';
import { todayISO } from '@/utils/format';
import { generateId } from '@/utils/id';

const STORAGE_TX = 'moneymate_transactions';
const STORAGE_WALLETS = 'moneymate_wallets';
const STORAGE_LIMIT = 'moneymate_daily_limit';

interface Totals {
  income: number;
  expense: number;
  balance: number;
}

interface MoneyContextValue {
  wallets: Wallet[];
  transactions: Transaction[];
  selectedWalletId: string;
  setSelectedWalletId: (id: string) => void;
  visibleTransactions: Transaction[];
  totals: Totals;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  walletBalance: (walletId: string) => number;
  totalBalance: number;
  dailyLimit: number;
  setDailyLimit: (value: number) => void;
  todayExpense: number;
  clearData: () => void;
  loadSampleData: () => void;
}

const MoneyContext = createContext<MoneyContextValue | undefined>(undefined);

export function MoneyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [wallets, setWallets] = useState<Wallet[]>(WALLETS);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('all');
  const [dailyLimit, setDailyLimit] = useState<number>(DEFAULT_DAILY_LIMIT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [txRaw, walletRaw, limitRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_TX),
          AsyncStorage.getItem(STORAGE_WALLETS),
          AsyncStorage.getItem(STORAGE_LIMIT),
        ]);
        if (txRaw) setTransactions(JSON.parse(txRaw));
        if (walletRaw) setWallets(JSON.parse(walletRaw));
        if (limitRaw) setDailyLimit(JSON.parse(limitRaw));
      } catch {
        // ถ้าโหลดไม่สำเร็จ ใช้ข้อมูล seed ต่อไป
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_LIMIT, JSON.stringify(dailyLimit)).catch(() => {});
  }, [dailyLimit, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_TX, JSON.stringify(transactions)).catch(() => {});
  }, [transactions, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_WALLETS, JSON.stringify(wallets)).catch(() => {});
  }, [wallets, hydrated]);

  const visibleTransactions = useMemo(() => {
    const list =
      selectedWalletId === 'all'
        ? transactions
        : transactions.filter((t) => t.walletId === selectedWalletId);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedWalletId]);

  const totals = useMemo<Totals>(() => {
    const income = visibleTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = visibleTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [visibleTransactions]);

  const totalBalance = useMemo(
    () =>
      transactions.reduce(
        (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
        0,
      ),
    [transactions],
  );

  const todayExpense = useMemo(() => {
    const today = todayISO();
    return visibleTransactions
      .filter((t) => t.type === 'expense' && t.date === today)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [visibleTransactions]);

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    setTransactions((prev) => [{ ...tx, id: generateId() }, ...prev]);
  }

  function updateTransaction(id: string, data: Omit<Transaction, 'id'>) {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)));
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function addWallet(wallet: Omit<Wallet, 'id'>) {
    setWallets((prev) => [...prev, { ...wallet, id: generateId('w') }]);
  }

  function walletBalance(walletId: string) {
    return transactions
      .filter((t) => t.walletId === walletId)
      .reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount), 0);
  }

  function clearData() {
    setTransactions([]);
    setWallets(WALLETS);
    setSelectedWalletId('all');
    setDailyLimit(DEFAULT_DAILY_LIMIT);
  }

  function loadSampleData() {
    setTransactions(SEED_TRANSACTIONS);
    setWallets(WALLETS);
    setSelectedWalletId('all');
    setDailyLimit(DEFAULT_DAILY_LIMIT);
  }

  const value: MoneyContextValue = {
    wallets,
    transactions,
    selectedWalletId,
    setSelectedWalletId,
    visibleTransactions,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addWallet,
    walletBalance,
    totalBalance,
    dailyLimit,
    setDailyLimit,
    todayExpense,
    clearData,
    loadSampleData,
  };

  return <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>;
}

export function useMoney(): MoneyContextValue {
  const ctx = useContext(MoneyContext);
  if (!ctx) {
    throw new Error('useMoney ต้องใช้ภายใน <MoneyProvider>');
  }
  return ctx;
}
