import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Currency } from '@/types/api';

const CURRENCIES: Currency[] = ['GBP', 'EUR'];

type Props = {
  visible: boolean;
  selected: Currency;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
};

export function CurrencyPickerModal({ visible, selected, onSelect, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
        accessibilityLabel="Close currency picker"
      >
        <View style={styles.card}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.option, c === selected && styles.optionSelected]}
              onPress={() => onSelect(c)}
              accessibilityRole="radio"
              accessibilityLabel={c === 'GBP' ? 'British Pound' : 'Euro'}
              accessibilityState={{ checked: c === selected }}
            >
              <ThemedText style={[styles.optionText, c === selected && styles.optionTextSelected]}>
                {c}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    width: 180,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#e8f4fd',
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
});
