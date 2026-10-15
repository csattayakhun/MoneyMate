import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from '@/components/AppText';
import { Wallet } from '@/types/money';

const Text = AppText;
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney } from '@/utils/format';

interface Props {
  wallet: Wallet;
  balance: number;
  filled?: boolean;
}

export default function WalletCard({ wallet, balance, filled }: Props) {
  if (filled) {
    return (
      <View style={[styles.card, { backgroundColor: wallet.color }]}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <MaterialCommunityIcons name={wallet.icon as any} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: '#FFFFFF' }]}>{wallet.name}</Text>
          <Text style={[styles.type, { color: 'rgba(255,255,255,0.8)' }]}>{wallet.type}</Text>
        </View>
        <Text style={[styles.balance, { color: '#FFFFFF' }]}>{formatMoney(balance)}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.cardPlain]}>
      <View style={[styles.iconBox, { backgroundColor: COLORS.surfaceAlt }]}>
        <MaterialCommunityIcons name={wallet.icon as any} size={20} color={wallet.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{wallet.name}</Text>
        <Text style={styles.type}>{wallet.type}</Text>
      </View>
      <Text style={styles.balance}>{formatMoney(balance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW,
  },
  cardPlain: { backgroundColor: COLORS.surface },
  iconBox: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  type: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  balance: { fontSize: 15, fontWeight: '700', color: COLORS.text },
});
