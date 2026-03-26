import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import type { Currency } from '@/types/api';

type Props = {
  amount: string;
  currency: Currency;
  iban: string;
  submitting: boolean;
  isValid: boolean;
  onAmountChange: (value: string) => void;
  onCurrencyPress: () => void;
  onIbanChange: (value: string) => void;
  onConfirm: () => void;
};

export function PayoutForm({
  amount,
  currency,
  iban,
  submitting,
  isValid,
  onAmountChange,
  onCurrencyPress,
  onIbanChange,
  onConfirm,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText type="title" style={styles.screenTitle} accessibilityRole="header">
            Send Payout
          </ThemedText>

          <View style={styles.amountRow}>
            <View style={styles.amountField}>
              <ThemedText style={styles.label}>Amount</ThemedText>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={onAmountChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#aaa"
                accessibilityLabel="Payout amount"
                returnKeyType="next"
              />
            </View>
            <View style={styles.currencyField}>
              <ThemedText style={styles.label}>Currency</ThemedText>
              <TouchableOpacity
                style={[styles.input, styles.currencyButton]}
                onPress={onCurrencyPress}
                accessibilityRole="button"
                accessibilityLabel={`Select currency, currently ${currency}`}
              >
                <ThemedText style={styles.currencyButtonText}>{currency} ▾</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.label}>IBAN</ThemedText>
            <TextInput
              style={styles.input}
              value={iban}
              onChangeText={onIbanChange}
              placeholder="FR1212345123451234567A12310131231231231"
              placeholderTextColor="#aaa"
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel="Destination IBAN"
              returnKeyType="done"
            />
            <ThemedText style={styles.hint}>Enter the destination bank account IBAN</ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.button, (!isValid || submitting) && styles.buttonDisabled]}
            onPress={onConfirm}
            disabled={!isValid || submitting}
            accessibilityRole="button"
            accessibilityLabel={submitting ? 'Processing payout' : 'Confirm payout'}
            accessibilityState={{ disabled: !isValid || submitting }}
          >
            <ThemedText style={styles.buttonText}>
              {submitting ? 'Processing...' : 'Confirm'}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#e5e5ea',
  },
  content: {
    padding: 20,
  },
  screenTitle: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  amountField: {
    flex: 1,
  },
  currencyField: {
    width: 100,
  },
  currencyButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  hint: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#c7c7cc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
