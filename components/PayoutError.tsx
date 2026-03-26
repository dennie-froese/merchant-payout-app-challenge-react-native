import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type Props = {
  message: string;
  onRetry: () => void;
};

export function PayoutError({ message, onRetry }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ThemedText type="title" accessibilityRole="header">Payout</ThemedText>
        <View style={styles.body}>
          <View
            style={[styles.iconCircle, styles.errorCircle]}
            accessibilityLabel="Payout failed"
            accessibilityRole="image"
          >
            <ThemedText style={[styles.iconText, styles.errorIconText]}>✕</ThemedText>
          </View>
          <ThemedText type="subtitle" style={[styles.heading, styles.errorHeading]} accessibilityRole="header">
            Unable to Process Payout
          </ThemedText>
          <ThemedText style={styles.message} accessibilityLiveRegion="assertive">
            {message}
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <ThemedText style={styles.buttonText}>Try Again</ThemedText>
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
  errorCircle: {
    backgroundColor: '#fff0f0',
  },
  iconText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 64,
    width: 64,
  },
  errorIconText: {
    color: '#c62828',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHeading: {
    color: '#c62828',
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
