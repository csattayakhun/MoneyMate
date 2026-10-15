import { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/AppText';
import DonutChart, { DonutSlice } from '@/components/DonutChart';

const Text = AppText;
import { CATEGORIES } from '@/constants/money-data';
import { useMoney } from '@/context/MoneyContext';
import { CategoryId } from '@/types/money';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney, formatThaiMonthYear } from '@/utils/format';

const NOW = new Date();
const MONTH_LABEL = formatThaiMonthYear(NOW.getFullYear(), NOW.getMonth());

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { visibleTransactions, totals } = useMoney();

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

  const maxValue = expenseByCategory[0]?.value ?? 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.sm }]}>
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.monthText}>{MONTH_LABEL}</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.incomeTint }]}>
            <Text style={[styles.summaryLabel, { color: COLORS.incomeOn }]}>รายรับ</Text>
            <Text style={[styles.summaryValue, { color: COLORS.incomeOn }]}>{formatMoney(totals.income)}</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.expenseTint }]}>
            <Text style={[styles.summaryLabel, { color: COLORS.expenseOn }]}>รายจ่าย</Text>
            <Text style={[styles.summaryValue, { color: COLORS.expenseOn }]}>{formatMoney(totals.expense)}</Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={styles.card}>
          {expenseByCategory.length === 0 ? (
            <Text style={styles.empty}>ยังไม่มีรายจ่ายในเดือนนี้</Text>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <DonutChart
                data={slices}
                size={190}
                strokeWidth={30}
                centerLabel={formatMoney(totals.expense)}
                centerSub="จ่ายทั้งหมด"
              />
            </View>
          )}
        </Animated.View>

        {expenseByCategory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>จ่ายมากสุด</Text>
            {expenseByCategory.map((e, index) => {
              const percent = totals.expense > 0 ? Math.round((e.value / totals.expense) * 100) : 0;
              const barWidth = maxValue > 0 ? (e.value / maxValue) * 100 : 0;
              return (
                <Animated.View
                  key={e.id}
                  entering={FadeInDown.duration(300).delay(index * 50)}
                  style={styles.barCard}>
                  <View style={styles.barHeader}>
                    <View style={styles.barLabelGroup}>
                      <View style={[styles.iconBox, { backgroundColor: e.category.tint }]}>
                        <MaterialCommunityIcons
                          name={e.category.icon as any}
                          size={18}
                          color={e.category.color}
                        />
                      </View>
                      <Text style={styles.barLabel}>{e.category.label}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.barValue}>{formatMoney(e.value)}</Text>
                      <Text style={styles.barPercent}>{percent}%</Text>
                    </View>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${barWidth}%`, backgroundColor: e.category.color },
                      ]}
                    />
                  </View>
                </Animated.View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  monthText: { fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  summaryChip: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.md },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  empty: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  barCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: 10,
    ...SHADOW,
  },
  barHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  barLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  barLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  barValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  barPercent: { fontSize: 12, color: COLORS.textMuted },
  track: { height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
