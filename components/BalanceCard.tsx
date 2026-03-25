import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatAmount, formatAmountForA11y } from '@/utils/currency';
import type { Currency } from '@/types/api';

type Props = {
  availableBalance: number;
  pendingBalance: number;
  currency: Currency;
};

export function BalanceCard({ availableBalance, pendingBalance, currency }: Props) {
  return (
    <ThemedView lightColor="#e5e5ea" style={styles.card}>
      <ThemedText type="subtitle" accessibilityRole="header">Account Balance</ThemedText>
      <View style={styles.row}>
        <View
          accessible={true}
          accessibilityLabel={`Available balance: ${formatAmountForA11y(availableBalance, currency)}`}
        >
          <ThemedText style={styles.label}>Available</ThemedText>
          <ThemedText style={styles.amount}>{formatAmount(availableBalance, currency)}</ThemedText>
        </View>
        <View
          accessible={true}
          accessibilityLabel={`Pending balance: ${formatAmountForA11y(pendingBalance, currency)}`}
        >
          <ThemedText style={styles.label}>Pending</ThemedText>
          <ThemedText style={styles.amount}>{formatAmount(pendingBalance, currency)}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    opacity: 0.5,
    marginBottom: 4,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
