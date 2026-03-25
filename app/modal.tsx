import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActivityRow } from '@/components/ActivityRow';
import { fetchActivity } from '@/api/merchant';
import type { ActivityItem } from '@/types/api';

export default function ModalScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadActivity() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActivity();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container} accessibilityViewIsModal={true}>
        <View style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">All Transactions</ThemedText>
          <TouchableOpacity
            onPress={() => router.dismiss()}
            accessibilityRole="button"
            accessibilityLabel="Close transactions"
          >
            <ThemedText type="link">Close</ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.centered}
            size="large"
            accessibilityLabel="Loading transactions"
          />
        ) : error ? (
          <View style={styles.centered}>
            <ThemedText accessibilityLiveRegion="assertive">{error}</ThemedText>
            <TouchableOpacity
              onPress={loadActivity}
              accessibilityRole="button"
              accessibilityLabel="Retry loading transactions"
            >
              <ThemedText type="link">Try again</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={index < items.length - 1 ? styles.rowWithDivider : undefined}>
                <ActivityRow item={item} />
              </View>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
});
