import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from '@/components/AppText';
import { CATEGORIES } from '@/constants/money-data';

const Text = AppText;
import { Transaction } from '@/types/money';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney, formatThaiDate } from '@/utils/format';

interface Props {
  tx: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function TransactionItem({ tx, onPress, onLongPress }: Props) {
  const category = CATEGORIES[tx.categoryId];
  const isIncome = tx.type === 'income';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && (onPress || onLongPress) ? styles.pressed : null]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}>
      <View style={[styles.iconBox, { backgroundColor: category.tint }]}>
        <MaterialCommunityIcons name={category.icon as any} size={20} color={category.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={styles.sub}>
          {category.label} · {formatThaiDate(tx.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
        {isIncome ? '+' : '-'}
        {formatMoney(tx.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
    paddingHorizontal: 14,
    ...SHADOW,
  },
  pressed: { opacity: 0.6 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  sub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
});
