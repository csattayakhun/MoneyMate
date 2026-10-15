import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from '@/components/AppText';
import { COLORS, LIMIT_WARNING_RATIO, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney } from '@/utils/format';

const Text = AppText;

interface Props {
  spent: number;
  limit: number;
  onPress?: () => void;
}

export default function DailyLimitBar({ spent, limit, onPress }: Props) {
  const ratio = limit > 0 ? spent / limit : 0;
  const fillWidth = Math.min(ratio, 1) * 100;
  const remaining = limit - spent;

  let barColor = COLORS.income;
  let status = `เหลือใช้ได้วันนี้ ${formatMoney(remaining)}`;
  if (ratio >= 1) {
    barColor = COLORS.expense;
    status = `เกินลิมิต ${formatMoney(Math.abs(remaining))} แล้ว!`;
  } else if (ratio >= LIMIT_WARNING_RATIO) {
    barColor = COLORS.warning;
    status = `ใกล้เต็มลิมิตแล้ว เหลือ ${formatMoney(remaining)}`;
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="target" size={16} color={COLORS.primary} />
          <Text style={styles.title}>ลิมิตใช้จ่ายวันนี้</Text>
        </View>
        <Text style={styles.amount}>
          {formatMoney(spent)} <Text style={styles.limit}>/ {formatMoney(limit)}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillWidth}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.status, { color: barColor }]}>{status}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  amount: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  limit: { fontSize: 13, fontWeight: '500', color: COLORS.textMuted },
  track: { height: 12, backgroundColor: COLORS.surfaceAlt, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  status: { fontSize: 12, fontWeight: '600', marginTop: 8 },
});
