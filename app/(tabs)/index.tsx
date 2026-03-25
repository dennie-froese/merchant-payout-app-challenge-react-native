import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BalanceCard } from '@/components/BalanceCard';
import { ActivityRow } from '@/components/ActivityRow';
import { fetchMerchant } from '@/api/merchant';
import type { MerchantDataResponse } from '@/types/api';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<MerchantDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMerchant() {
    try {
      setLoading(true);
      setError(null);
      setData(await fetchMerchant());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMerchant();
  }, []);

  if (loading) {
    return (
      <ThemedView lightColor="#e5e5ea" style={styles.centered}>
        <ActivityIndicator size="large" accessibilityLabel="Loading account data" />
      </ThemedView>
    );
  }

  if (error || !data) {
    return (
      <ThemedView lightColor="#e5e5ea" style={styles.centered}>
        <ThemedText style={styles.errorText} accessibilityLiveRegion="assertive">
          Failed to load account data
        </ThemedText>
        <TouchableOpacity
          onPress={loadMerchant}
          style={styles.retryButton}
          accessibilityRole="button"
          accessibilityLabel="Retry loading account data"
        >
          <ThemedText type="link">Try again</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const recentActivity = data.activity.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <ThemedView lightColor="#e5e5ea" style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">Business Account</ThemedText>
        </ThemedView>

        <BalanceCard
          availableBalance={data.available_balance}
          pendingBalance={data.pending_balance}
          currency={data.currency}
        />

        <ThemedView lightColor="#e5e5ea" style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle} accessibilityRole="header">
            Recent Activity
          </ThemedText>
          {recentActivity.map((item, index) => (
            <View
              key={item.id}
              style={index < recentActivity.length - 1 ? styles.rowWithDivider : undefined}
            >
              <ActivityRow item={item} />
            </View>
          ))}
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => router.push('/modal')}
            accessibilityRole="button"
            accessibilityLabel="Show more activity"
          >
            <ThemedText style={styles.showMoreText}>Show More</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e5e5ea',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e5e5ea',
  },
  errorText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
  },
  scrollView: {
    backgroundColor: '#e5e5ea',
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  showMoreButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
  },
  showMoreText: {
    color: '#0a7ea4',
    fontWeight: '600',
    fontSize: 16,
  },
});
