import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/AppText';
import TransactionItem from '@/components/TransactionItem';

const Text = AppText;
import { useMoney } from '@/context/MoneyContext';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney, formatThaiMonthYear, formatThaiDate } from '@/utils/format';

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { visibleTransactions, deleteTransaction } = useMoney();

  function confirmDelete(id: string, name: string) {
    Alert.alert('ลบรายการ', `ต้องการลบ "${name}" ใช่ไหม?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  }

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  );

  const monthPrefix = `${year}-${pad(month + 1)}`;

  const monthTx = useMemo(
    () => visibleTransactions.filter((t) => t.date.startsWith(monthPrefix)),
    [visibleTransactions, monthPrefix],
  );

  const monthIncome = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const dayFlags = useMemo(() => {
    const map = new Map<number, { income: boolean; expense: boolean }>();
    monthTx.forEach((t) => {
      const day = Number(t.date.split('-')[2]);
      const flag = map.get(day) ?? { income: false, expense: false };
      if (t.type === 'income') flag.income = true;
      else flag.expense = true;
      map.set(day, flag);
    });
    return map;
  }, [monthTx]);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedTx = selectedDate
    ? visibleTransactions.filter((t) => t.date === selectedDate)
    : [];

  function changeMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.sm }]}>
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.monthNav}>
          <Pressable onPress={() => changeMonth(-1)} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.text} />
          </Pressable>
          <Text style={styles.monthText}>{formatThaiMonthYear(year, month)}</Text>
          <Pressable onPress={() => changeMonth(1)} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-right" size={26} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.incomeTint }]}>
            <Text style={[styles.summaryLabel, { color: COLORS.incomeOn }]}>รับ</Text>
            <Text style={[styles.summaryValue, { color: COLORS.incomeOn }]}>{formatMoney(monthIncome)}</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.expenseTint }]}>
            <Text style={[styles.summaryLabel, { color: COLORS.expenseOn }]}>จ่าย</Text>
            <Text style={[styles.summaryValue, { color: COLORS.expenseOn }]}>{formatMoney(monthExpense)}</Text>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={styles.weekday}>
                {w}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((day, index) => {
              if (day === null) {
                return <View key={`blank-${index}`} style={styles.cell} />;
              }
              const dateStr = `${monthPrefix}-${pad(day)}`;
              const selected = selectedDate === dateStr;
              const flag = dayFlags.get(day);
              return (
                <Pressable key={dateStr} style={styles.cell} onPress={() => setSelectedDate(dateStr)}>
                  <View style={[styles.dayCircle, selected && styles.daySelected]}>
                    <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
                  </View>
                  <View style={styles.dotRow}>
                    {flag?.income ? <View style={[styles.dot, { backgroundColor: COLORS.income }]} /> : null}
                    {flag?.expense ? <View style={[styles.dot, { backgroundColor: COLORS.expense }]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedDate ? (
          <Animated.View entering={FadeIn.duration(250)}>
            <Text style={styles.sectionTitle}>{formatThaiDate(selectedDate)}</Text>
            {selectedTx.length === 0 ? (
              <Text style={styles.empty}>ไม่มีรายการในวันนี้</Text>
            ) : (
              selectedTx.map((tx) => (
                <View key={tx.id} style={{ marginBottom: SPACING.sm }}>
                  <TransactionItem
                    tx={tx}
                    onPress={() => router.push({ pathname: '/add', params: { id: tx.id } })}
                    onLongPress={() => confirmDelete(tx.id, tx.title)}
                  />
                </View>
              ))
            )}
          </Animated.View>
        ) : (
          <Text style={styles.empty}>แตะวันที่เพื่อดูรายการ</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  monthText: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  summaryRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  summaryChip: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.md },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 17, fontWeight: '700', marginTop: 2 },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  weekRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, color: COLORS.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 46, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 14, color: COLORS.text },
  dayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  dotRow: { flexDirection: 'row', gap: 3, height: 6, marginTop: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  empty: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.lg },
});
