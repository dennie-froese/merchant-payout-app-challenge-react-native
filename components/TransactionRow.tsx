import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatAmount, formatAmountForA11y } from '@/utils/currency';
import type { ActivityItem } from '@/types/api';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type Props = {
  item: ActivityItem;
};

export function TransactionRow({ item }: Props) {
  const isNegative = item.amount < 0;

  return (
    <View
      style={styles.row}
      accessible={true}
      accessibilityLabel={`${capitalise(item.type)}, ${item.description}, ${formatDate(item.date)}, ${formatAmountForA11y(item.amount, item.currency)}, ${capitalise(item.status)}`}
    >
      <View style={styles.left}>
        <ThemedText style={styles.type}>{capitalise(item.type)}</ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>
        <ThemedText style={styles.date}>{formatDate(item.date)}</ThemedText>
      </View>
      <View style={styles.right}>
        <ThemedText style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
          {formatAmount(item.amount, item.currency)}
        </ThemedText>
        <ThemedText style={styles.status}>{capitalise(item.status)}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  type: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    opacity: 0.5,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  status: {
    fontSize: 13,
    opacity: 0.5,
  },
  positive: {
    color: '#2e7d32',
  },
  negative: {
    color: '#c62828',
  },
});
