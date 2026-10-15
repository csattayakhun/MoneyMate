import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/AppText';
import WalletCard from '@/components/WalletCard';

const Text = AppText;
import { useMoney } from '@/context/MoneyContext';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/styles/theme';
import { formatMoney } from '@/utils/format';

const PRESETS = [
  { icon: 'wallet', color: '#534AB7' },
  { icon: 'bank', color: '#378ADD' },
  { icon: 'piggy-bank', color: '#1D9E75' },
  { icon: 'credit-card', color: '#D4537E' },
  { icon: 'cash', color: '#EF9F27' },
  { icon: 'currency-usd', color: '#D85A30' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { wallets, walletBalance, totalBalance, addWallet, clearData, loadSampleData } = useMoney();

  function confirmClear() {
    Alert.alert('ล้างข้อมูล', 'ลบรายการทั้งหมด เริ่มใหม่จากศูนย์ (เหลือ 3 กระเป๋าเริ่มต้น) ใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ล้าง', style: 'destructive', onPress: () => clearData() },
    ]);
  }

  function confirmLoadSample() {
    Alert.alert('โหลดข้อมูลตัวอย่าง', 'แทนที่ข้อมูลปัจจุบันด้วยข้อมูลตัวอย่าง (10 รายการ) ใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'โหลด', onPress: () => loadSampleData() },
    ]);
  }

  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [presetIndex, setPresetIndex] = useState(0);
  const [error, setError] = useState(false);

  function openDialog() {
    setName('');
    setPresetIndex(0);
    setError(false);
    setDialogVisible(true);
  }

  function handleAdd() {
    if (name.trim().length === 0) {
      setError(true);
      return;
    }
    const preset = PRESETS[presetIndex];
    addWallet({ name: name.trim(), type: 'เงินสด', icon: preset.icon, color: preset.color });
    setDialogVisible(false);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.sm }]}>
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>ตั้งค่า</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={28} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Jirayut สัตยาคุณ</Text>
            <Text style={styles.profileId}>รหัส 466415241010</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>รวมทุกกระเป๋า</Text>
          <Text style={styles.totalValue}>{formatMoney(totalBalance)}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>กระเป๋าเงิน</Text>
          <Text style={styles.sectionCount}>{wallets.length} กระเป๋า</Text>
        </View>

        <View style={{ gap: SPACING.sm }}>
          {wallets.map((w, index) => (
            <WalletCard key={w.id} wallet={w} balance={walletBalance(w.id)} filled={index === 0} />
          ))}

          <Pressable style={styles.addWallet} onPress={openDialog}>
            <MaterialCommunityIcons name="plus" size={20} color={COLORS.textMuted} />
            <Text style={styles.addWalletText}>เพิ่มกระเป๋า</Text>
          </Pressable>
        </View>

        <View style={styles.dataButtons}>
          <Pressable style={[styles.dataButton, styles.clearButton]} onPress={confirmClear}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.expense} />
            <Text style={[styles.dataButtonText, { color: COLORS.expense }]}>ล้างข้อมูล</Text>
          </Pressable>
          <Pressable style={[styles.dataButton, styles.sampleButton]} onPress={confirmLoadSample}>
            <MaterialCommunityIcons name="database-import-outline" size={18} color={COLORS.primary} />
            <Text style={[styles.dataButtonText, { color: COLORS.primary }]}>โหลดตัวอย่าง</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>MoneyMate · เวอร์ชัน 1.0.0</Text>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>เพิ่มกระเป๋าใหม่</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="ชื่อกระเป๋า"
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError(false);
              }}
              error={error}
            />
            {error ? <Text style={styles.errorText}>กรุณาใส่ชื่อกระเป๋า</Text> : null}

            <Text style={styles.pickLabel}>เลือกไอคอน</Text>
            <View style={styles.presetRow}>
              {PRESETS.map((p, index) => {
                const selected = presetIndex === index;
                return (
                  <Pressable
                    key={p.icon}
                    onPress={() => setPresetIndex(index)}
                    style={[
                      styles.presetIcon,
                      { backgroundColor: p.color },
                      selected && styles.presetSelected,
                    ]}>
                    <MaterialCommunityIcons name={p.icon as any} size={22} color="#FFFFFF" />
                  </Pressable>
                );
              })}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>ยกเลิก</Button>
            <Button onPress={handleAdd}>เพิ่ม</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  pageTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  profileId: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  totalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  totalLabel: { fontSize: 13, color: COLORS.textMuted },
  totalValue: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  sectionCount: { fontSize: 13, color: COLORS.textMuted },
  addWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  addWalletText: { fontSize: 14, color: COLORS.textMuted },
  dataButtons: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  dataButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  clearButton: { borderColor: COLORS.expense, backgroundColor: '#FCEBEB' },
  sampleButton: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  dataButtonText: { fontSize: 14, fontWeight: '600' },
  footer: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.lg },
  errorText: { fontSize: 12, color: COLORS.expense, marginTop: 4 },
  pickLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  presetIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  presetSelected: { borderWidth: 3, borderColor: COLORS.text },
});
