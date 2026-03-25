import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatAmount, formatAmountForA11y } from '@/utils/currency';
import type { ActivityItem } from '@/types/api';

type Props = {
  item: ActivityItem;
};

export function ActivityRow({ item }: Props) {
  const isNegative = item.amount < 0;

  return (
    <View
      style={styles.row}
      accessible={true}
      accessibilityLabel={`${item.description}, ${formatAmountForA11y(item.amount, item.currency)}`}
    >
      <ThemedText style={styles.description} numberOfLines={1}>
        {item.description}
      </ThemedText>
      <ThemedText style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
        {formatAmount(item.amount, item.currency)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  description: {
    flex: 1,
    fontSize: 15,
    marginRight: 8,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  positive: {
    color: '#2e7d32',
  },
  negative: {
    color: '#c62828',
  },
});
