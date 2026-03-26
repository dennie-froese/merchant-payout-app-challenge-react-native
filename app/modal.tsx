import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionRow } from '@/components/TransactionRow';
import { fetchActivity } from '@/api/merchant';
import type { ActivityItem } from '@/types/api';

export default function ModalScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const isFetchingMore = useRef(false);

  async function loadInitial() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActivity(null);
      setItems(data.items);
      cursorRef.current = data.next_cursor;
      hasMoreRef.current = data.has_more;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const loadMore = useCallback(async () => {
    if (isFetchingMore.current || !hasMoreRef.current) return;
    isFetchingMore.current = true;
    setLoadingMore(true);
    try {
      const data = await fetchActivity(cursorRef.current);
      setItems((prev) => [...prev, ...data.items]);
      cursorRef.current = data.next_cursor;
      hasMoreRef.current = data.has_more;
    } catch {
      // silently ignore — user can trigger again by scrolling
    } finally {
      isFetchingMore.current = false;
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, []);

  const renderRow = ({ item }: { item: ActivityItem }) => (
    <View style={styles.rowWithDivider}>
      <TransactionRow item={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container} accessibilityViewIsModal={true}>
        <View style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">Recent Activity</ThemedText>
          <TouchableOpacity
            onPress={() => router.dismiss()}
            accessibilityRole="button"
            accessibilityLabel="Close transactions"
          >
            <ThemedText style={styles.doneButton}>Done</ThemedText>
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
              onPress={loadInitial}
              accessibilityRole="button"
              accessibilityLabel="Retry loading transactions"
            >
              <ThemedText type="link">Try again</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            testID="transaction-list"
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderRow}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footer}>
                  <ActivityIndicator size="small" />
                  <ThemedText style={styles.footerText} accessibilityLiveRegion="polite">Loading more...</ThemedText>
                </View>
              ) : null
            }
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  doneButton: {
    color: '#0a7ea4',
    fontSize: 17,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.5,
  },
});
