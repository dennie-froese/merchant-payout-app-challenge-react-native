import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { formatAmount } from '@/utils/currency';
import type { Currency } from '@/types/api';

type Props = {
  amount: number; // in pence
  currency: Currency;
  onReset: () => void;
};

export function PayoutSuccess({ amount, currency, onReset }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ThemedText type="title" accessibilityRole="header">Payout</ThemedText>
        <View style={styles.body}>
          <View
            style={[styles.iconCircle, styles.successCircle]}
            accessibilityLabel="Payout successful"
            accessibilityRole="image"
          >
            <ThemedText style={[styles.iconText, styles.successIconText]}>✓</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.heading} accessibilityRole="header">Payout Completed</ThemedText>
          <ThemedText style={styles.message}>
            {`Your payout of ${formatAmount(amount, currency)} has been processed successfully.`}
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={onReset}
            accessibilityRole="button"
            accessibilityLabel="Create another payout"
          >
            <ThemedText style={styles.buttonText}>Create Another Payout</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e5e5ea',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successCircle: {
    backgroundColor: '#2e7d32',
  },
  iconText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 64,
    width: 64,
  },
  successIconText: {
    color: '#fff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
