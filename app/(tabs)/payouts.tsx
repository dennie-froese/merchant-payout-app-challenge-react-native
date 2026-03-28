import { useEffect } from 'react';
import { Alert } from 'react-native';
import { usePayoutForm } from '@/hooks/usePayoutForm';
import { PayoutForm } from '@/components/PayoutForm';
import { PayoutSuccess } from '@/components/PayoutSuccess';
import { PayoutError } from '@/components/PayoutError';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { CurrencyPickerModal } from '@/components/CurrencyPickerModal';
import { addScreenshotListener } from '@/modules/screen-security';

export default function PayoutsScreen() {
  useEffect(() => {
    const subscription = addScreenshotListener(() => {
      Alert.alert(
        'Screenshot Detected',
        'Please keep your financial data private. Screenshots may contain sensitive information.'
      );
    });
    return () => subscription.remove();
  }, []);
  const {
    amount, currency, iban,
    screenState, showConfirmation, showCurrencyPicker,
    submitting, errorMessage, successAmount, successCurrency,
    amountNum, isValid,
    setAmount, setCurrency, setIban,
    setShowConfirmation, setShowCurrencyPicker,
    handleSubmit, handleReset, handleTryAgain,
  } = usePayoutForm();

  if (screenState === 'success') {
    return (
      <PayoutSuccess
        amount={successAmount}
        currency={successCurrency}
        onReset={handleReset}
      />
    );
  }

  if (screenState === 'error') {
    return (
      <PayoutError
        message={errorMessage}
        onRetry={handleTryAgain}
      />
    );
  }

  return (
    <>
      <PayoutForm
        amount={amount}
        currency={currency}
        iban={iban}
        submitting={submitting}
        isValid={isValid}
        onAmountChange={setAmount}
        onCurrencyPress={() => setShowCurrencyPicker(true)}
        onIbanChange={setIban}
        onConfirm={() => setShowConfirmation(true)}
      />
      <ConfirmationModal
        visible={showConfirmation}
        amount={Math.round(amountNum * 100)}
        currency={currency}
        iban={iban}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleSubmit}
      />
      <CurrencyPickerModal
        visible={showCurrencyPicker}
        selected={currency}
        onSelect={(c) => { setCurrency(c); setShowCurrencyPicker(false); }}
        onClose={() => setShowCurrencyPicker(false)}
      />
    </>
  );
}
