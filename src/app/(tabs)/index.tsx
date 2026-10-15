import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Dialog, FAB, Menu, Portal, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/AppText';
import DailyLimitBar from '@/components/DailyLimitBar';
import DonutChart, { DonutSlice } from '@/components/DonutChart';
import Mascot from '@/components/Mascot';
import TransactionItem from '@/components/TransactionItem';

const Text = AppText;
import { CATEGORIES } from '@/constants/money-data';
import { useMoney } from '@/context/MoneyContext';
import { CategoryId } from '@/types/money';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney, formatThaiMonthYear } from '@/utils/format';

const NOW = new Date();
const MONTH_LABEL = formatThaiMonthYear(NOW.getFullYear(), NOW.getMonth());

const HIGH_SPEND_RATIO = 0.8;

function getPiggyMessage(income: number, expense: number, balance: number, count: number): string {
  if (count === 0) return 'ยังไม่มีรายการเลย เริ่มบันทึกกันเถอะ!';
  if (expense === 0) return 'เดือนนี้ยังไม่มีรายจ่าย เยี่ยมไปเลย! ✨';
  const ratio = income > 0 ? expense / income : 1;
  if (ratio >= HIGH_SPEND_RATIO) return `ใช้ไป ${formatMoney(expense)} แล้วน้า ระวังนิดนึงนะ! 🐽`;
  if (balance >= 0) return `เหลือ ${formatMoney(balance)} เก็บเก่งมากเลย! 💕`;
  return `เดือนนี้ใช้ไป ${formatMoney(expense)} แล้วนะ`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    visibleTransactions,
    totals,
    wallets,
    selectedWalletId,
    setSelectedWalletId,
    deleteTransaction,
    dailyLimit,
    setDailyLimit,
    todayExpense,
  } = useMoney();
  const [menuVisible, setMenuVisible] = useState(false);
  const [limitDialogVisible, setLimitDialogVisible] = useState(false);
  const [limitText, setLimitText] = useState('');

  function openLimitDialog() {
    setLimitText(String(dailyLimit));
    setLimitDialogVisible(true);
  }

  function saveLimit() {
    const value = parseFloat(limitText);
    if (!isNaN(value) && value > 0) {
      setDailyLimit(value);
    }
    setLimitDialogVisible(false);
  }

  const recent = visibleTransactions.slice(0, 8);

  function confirmDelete(id: string, name: string) {
    Alert.alert('ลบรายการ', `ต้องการลบ "${name}" ใช่ไหม?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  }

  const expenseByCategory = useMemo(() => {
    const map = new Map<CategoryId, number>();
    visibleTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount));
    return Array.from(map.entries())
      .map(([id, value]) => ({ id, value, category: CATEGORIES[id] }))
      .sort((a, b) => b.value - a.value);
  }, [visibleTransactions]);

  const slices: DonutSlice[] = expenseByCategory.map((e) => ({
    value: e.value,
    color: e.category.color,
  }));

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);
  const walletLabel = selectedWallet ? selectedWallet.name : 'ทุกกระเป๋า';

  const header = (
    <View>
      <View style={styles.greet}>
        <Mascot size={54} />
        <View style={styles.bubble}>
          <View style={styles.bubbleTail} />
          <Text style={styles.bubbleName}>สวัสดี, Jirayut 👋</Text>
          <Text style={styles.bubbleMsg}>
            {getPiggyMessage(totals.income, totals.expense, totals.balance, visibleTransactions.length)}
          </Text>
        </View>
      </View>

      <View style={styles.topBar}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable style={styles.walletPill} onPress={() => setMenuVisible(true)}>
              <MaterialCommunityIcons name="wallet" size={16} color={COLORS.primary} />
              <Text style={styles.walletText}>{walletLabel}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={COLORS.textMuted} />
            </Pressable>
          }>
          <Menu.Item
            onPress={() => {
              setSelectedWalletId('all');
              setMenuVisible(false);
            }}
            title="ทุกกระเป๋า"
          />
          {wallets.map((w) => (
            <Menu.Item
              key={w.id}
              onPress={() => {
                setSelectedWalletId(w.id);
                setMenuVisible(false);
              }}
              title={w.name}
            />
          ))}
        </Menu>
        <Text style={styles.monthText}>{MONTH_LABEL}</Text>
      </View>

      <Animated.View entering={FadeInDown.duration(350)} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>ยอดคงเหลือ</Text>
        <Text style={styles.balanceValue}>{formatMoney(totals.balance)}</Text>
        <View style={styles.balanceRow}>
          <View style={[styles.balanceChip, { backgroundColor: COLORS.incomeTint }]}>
            <View style={styles.chipHead}>
              <MaterialCommunityIcons name="arrow-down-circle" size={15} color={COLORS.income} />
              <Text style={[styles.chipLabel, { color: COLORS.incomeOn }]}>รายรับ</Text>
            </View>
            <Text style={[styles.chipValue, { color: COLORS.income }]}>{formatMoney(totals.income)}</Text>
          </View>
          <View style={[styles.balanceChip, { backgroundColor: COLORS.expenseTint }]}>
            <View style={styles.chipHead}>
              <MaterialCommunityIcons name="arrow-up-circle" size={15} color={COLORS.expense} />
              <Text style={[styles.chipLabel, { color: COLORS.expenseOn }]}>รายจ่าย</Text>
            </View>
            <Text style={[styles.chipValue, { color: COLORS.expense }]}>{formatMoney(totals.expense)}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(60)}>
        <DailyLimitBar spent={todayExpense} limit={dailyLimit} onPress={openLimitDialog} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(80)} style={styles.card}>
        <View style={styles.chartRow}>
          <DonutChart
            data={slices}
            size={150}
            strokeWidth={24}
            centerLabel={formatMoney(totals.expense)}
            centerSub="จ่ายเดือนนี้"
          />
          <View style={styles.legend}>
            {expenseByCategory.length === 0 ? (
              <Text style={styles.sub}>ยังไม่มีรายจ่าย</Text>
            ) : (
              expenseByCategory.slice(0, 5).map((e) => {
                const percent = totals.expense > 0 ? Math.round((e.value / totals.expense) * 100) : 0;
                return (
                  <View key={e.id} style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: e.category.color }]} />
                    <Text style={styles.legendLabel}>{e.category.label}</Text>
                    <Text style={styles.legendPercent}>{percent}%</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </Animated.View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>รายการล่าสุด</Text>
        <Text style={styles.hint}>แตะแก้ไข · กดค้างลบ</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.sm }]}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.duration(300).delay(index * 50)}
            style={{ marginBottom: 10 }}>
            <TransactionItem
              tx={item}
              onPress={() => router.push({ pathname: '/add', params: { id: item.id } })}
              onLongPress={() => confirmDelete(item.id, item.title)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Mascot size={92} />
            <Text style={styles.emptyText}>ยังไม่มีรายการ{'\n'}แตะปุ่ม + เพื่อเพิ่มเลย!</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <FAB icon="plus" color="#FFFFFF" style={styles.fab} onPress={() => router.push('/add')} />

      <Portal>
        <Dialog visible={limitDialogVisible} onDismiss={() => setLimitDialogVisible(false)}>
          <Dialog.Title>ตั้งลิมิตใช้จ่ายรายวัน</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="จำนวนเงินต่อวัน (บาท)"
              value={limitText}
              onChangeText={setLimitText}
              keyboardType="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLimitDialogVisible(false)}>ยกเลิก</Button>
            <Button onPress={saveLimit}>บันทึก</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  greet: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.md },
  bubble: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: 4,
  },
  bubbleTail: {
    position: 'absolute',
    left: -7,
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.primaryLight,
  },
  bubbleName: { fontSize: 14, fontWeight: '800', color: COLORS.primaryDark },
  bubbleMsg: { fontSize: 13, color: COLORS.text, marginTop: 2, lineHeight: 19 },
  empty: { alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.xl },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  walletText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  monthText: { fontSize: 13, color: COLORS.textMuted },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  balanceLabel: { fontSize: 13, color: COLORS.textMuted },
  balanceValue: { fontSize: 34, fontWeight: '800', color: COLORS.text, marginTop: 2, marginBottom: 16 },
  balanceRow: { flexDirection: 'row', gap: SPACING.md },
  balanceChip: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  chipHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chipLabel: { fontSize: 12, fontWeight: '600' },
  chipValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  legend: { flex: 1, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  legendLabel: { fontSize: 13, color: COLORS.text, flex: 1 },
  legendPercent: { fontSize: 13, color: COLORS.textMuted },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  hint: { fontSize: 12, color: COLORS.textMuted },
  sub: { fontSize: 13, color: COLORS.textMuted },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
  },
});
