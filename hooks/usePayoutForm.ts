import { useState } from 'react';
import { submitPayout } from '@/api/merchant';
import { getDeviceId } from '@/modules/screen-security';
import type { Currency } from '@/types/api';

export type ScreenState = 'form' | 'success' | 'error';

export function usePayoutForm() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [iban, setIban] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('form');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successAmount, setSuccessAmount] = useState(0);
  const [successCurrency, setSuccessCurrency] = useState<Currency>('GBP');

  const amountNum = parseFloat(amount);
  const isValid = !isNaN(amountNum) && amountNum > 0 && iban.trim().length > 0;

  const handleSubmit = async () => {
    setShowConfirmation(false);
    setSubmitting(true);
    try {
      const pence = Math.round(amountNum * 100);
      const deviceId = getDeviceId();
      const result = await submitPayout({ amount: pence, currency, iban: iban.trim(), device_id: deviceId });
      setSuccessAmount(result.amount);
      setSuccessCurrency(result.currency);
      setScreenState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setScreenState('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setIban('');
    setCurrency('GBP');
    setScreenState('form');
  };

  const handleTryAgain = () => setScreenState('form');

  return {
    amount,
    currency,
    iban,
    screenState,
    showConfirmation,
    showCurrencyPicker,
    submitting,
    errorMessage,
    successAmount,
    successCurrency,
    amountNum,
    isValid,
    setAmount,
    setCurrency,
    setIban,
    setShowConfirmation,
    setShowCurrencyPicker,
    handleSubmit,
    handleReset,
    handleTryAgain,
  };
}
