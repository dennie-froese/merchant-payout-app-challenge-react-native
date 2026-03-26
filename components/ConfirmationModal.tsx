import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatAmount } from '@/utils/currency';
import type { Currency } from '@/types/api';

function maskIban(iban: string): string {
  if (iban.length <= 8) return iban;
  return `${iban.slice(0, 4)}****...****${iban.slice(-4)}`;
}

type Props = {
  visible: boolean;
  amount: number; // in pence
  currency: Currency;
  iban: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({ visible, amount, currency, iban, onCancel, onConfirm }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal={true}>
          <ThemedText type="subtitle" style={styles.title} accessibilityRole="header">Confirm Payout</ThemedText>
          <View style={styles.row} accessible={true} accessibilityLabel={`Amount: ${formatAmount(amount, currency)}`}>
            <ThemedText style={styles.label}>Amount:</ThemedText>
            <ThemedText style={styles.value}>{formatAmount(amount, currency)}</ThemedText>
          </View>
          <View style={styles.row} accessible={true} accessibilityLabel={`Currency: ${currency}`}>
            <ThemedText style={styles.label}>Currency:</ThemedText>
            <ThemedText style={styles.value}>{currency}</ThemedText>
          </View>
          <View style={styles.row} accessible={true} accessibilityLabel={`IBAN: ${maskIban(iban)}`}>
            <ThemedText style={styles.label}>IBAN:</ThemedText>
            <ThemedText style={styles.value} numberOfLines={1}>{maskIban(iban)}</ThemedText>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel payout"
            >
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Confirm and submit payout"
            >
              <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    opacity: 0.6,
  },
  value: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f7',
  },
  confirmButton: {
    backgroundColor: '#0a7ea4',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
