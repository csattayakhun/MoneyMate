import { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/AppText';
import { CATEGORY_LIST } from '@/constants/money-data';

const Text = AppText;
import { useMoney } from '@/context/MoneyContext';
import { CategoryId, TxType } from '@/types/money';
import { COLORS, FONTS, RADIUS, SPACING } from '@/styles/theme';
import { todayISO } from '@/utils/format';

export default function AddTransactionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { wallets, addTransaction, updateTransaction, transactions } = useMoney();

  const existing = id ? transactions.find((t) => t.id === id) : undefined;
  const isEdit = !!existing;

  const [type, setType] = useState<TxType>(existing?.type ?? 'expense');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [title, setTitle] = useState(existing?.title ?? '');
  const [categoryId, setCategoryId] = useState<CategoryId | null>(existing?.categoryId ?? null);
  const [walletId, setWalletId] = useState(existing?.walletId ?? wallets[0]?.id ?? '');
  const [submitted, setSubmitted] = useState(false);

  const categories = useMemo(
    () => CATEGORY_LIST.filter((c) => c.type === type || c.type === 'both'),
    [type],
  );

  const amountValue = parseFloat(amount);
  const roundedAmount = Math.round(amountValue);
  const amountError = submitted && (isNaN(amountValue) || roundedAmount <= 0);
  const titleError = submitted && title.trim().length === 0;
  const categoryError = submitted && categoryId === null;

  function handleTypeChange(next: string) {
    setType(next as TxType);
    setCategoryId(null);
  }

  function handleSave() {
    setSubmitted(true);
    if (isNaN(amountValue) || roundedAmount <= 0) return;
    if (title.trim().length === 0) return;
    if (categoryId === null) return;

    const payload = {
      walletId,
      type,
      categoryId,
      title: title.trim(),
      amount: roundedAmount,
      date: existing ? existing.date : todayISO(),
    };
    if (existing) {
      updateTransaction(existing.id, payload);
    } else {
      addTransaction(payload);
    }
    router.back();
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isEdit ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <MaterialCommunityIcons name="close" size={24} color={COLORS.textMuted} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled">
          <SegmentedButtons
            value={type}
            onValueChange={handleTypeChange}
            buttons={[
              { value: 'expense', label: 'รายจ่าย', icon: 'arrow-up' },
              { value: 'income', label: 'รายรับ', icon: 'arrow-down' },
            ]}
            style={{ marginBottom: SPACING.xl }}
          />

          <Text style={styles.fieldLabel}>จำนวนเงิน</Text>
          <View style={[styles.amountBox, amountError && styles.inputError]}>
            <Text style={styles.baht}>฿</Text>
            <RNTextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              style={styles.amountInput}
            />
          </View>
          {amountError ? <Text style={styles.errorText}>ใส่จำนวนเงินมากกว่า 0</Text> : null}

          <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>ชื่อรายการ</Text>
          <RNTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="เช่น ข้าวเที่ยง, ค่ารถ"
            placeholderTextColor={COLORS.textMuted}
            style={[styles.textInput, titleError && styles.inputError]}
          />
          {titleError ? <Text style={styles.errorText}>กรุณาใส่ชื่อรายการ</Text> : null}

          <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>หมวดหมู่</Text>
          <View style={styles.categoryGrid}>
            {categories.map((c) => {
              const selected = categoryId === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
                  style={[
                    styles.categoryChip,
                    selected && { borderColor: c.color, backgroundColor: c.tint },
                  ]}>
                  <View style={[styles.categoryIcon, { backgroundColor: c.tint }]}>
                    <MaterialCommunityIcons name={c.icon as any} size={18} color={c.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {categoryError ? <Text style={styles.errorText}>เลือกหมวดหมู่</Text> : null}

          <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>กระเป๋าเงิน</Text>
          <View style={styles.walletRow}>
            {wallets.map((w) => {
              const selected = walletId === w.id;
              return (
                <Pressable
                  key={w.id}
                  onPress={() => setWalletId(w.id)}
                  style={[
                    styles.walletChip,
                    selected && { borderColor: w.color, backgroundColor: COLORS.primaryLight },
                  ]}>
                  <MaterialCommunityIcons name={w.icon as any} size={16} color={w.color} />
                  <Text style={styles.walletLabel}>{w.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 6 }}>
            บันทึก
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, marginBottom: SPACING.sm },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  baht: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginRight: SPACING.sm },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    paddingVertical: 12,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.expense },
  errorText: { fontSize: 12, color: COLORS.expense, marginTop: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 13, color: COLORS.text },
  walletRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
  },
  walletLabel: { fontSize: 13, color: COLORS.text },
  saveButton: { marginTop: SPACING.xl, borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
});
