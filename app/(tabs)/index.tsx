import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { TideCard } from '@/components/TideCard';
import { palette, shadows } from '@/constants/theme';
import { useSelectedStation } from '@/context/StationContext';
import {
  fetchUpcomingTides,
  getNextTides,
  type NextTides,
} from '@/services/noaa';

export default function HomeScreen() {
  const { selectedStation, isStationLoading } = useSelectedStation();

  const [nextTides, setNextTides] = useState<NextTides>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadTides = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const predictions = await fetchUpcomingTides(selectedStation, 3);
      setNextTides(getNextTides(predictions));
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load tide predictions.',
      );
      setNextTides({});
    } finally {
      setIsLoading(false);
    }
  }, [selectedStation]);

  useEffect(() => {
    if (!isStationLoading) {
      loadTides();
    }
  }, [isStationLoading, loadTides]);

  const tideStatus = useMemo(() => {
    if (nextTides.nextHigh) {
      return {
        title: 'River is rising',
        icon: 'trending-up-outline',
      };
    }

    if (nextTides.nextLow) {
      return {
        title: 'River is dropping',
        icon: 'trending-down-outline',
      };
    }

    return {
      title: 'Checking tide movement',
      icon: 'water-outline',
    };
  }, [nextTides]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <Ionicons
                name="water-outline"
                size={15}
                color={palette.deepOcean}
              />
              <Text style={styles.heroBadgeText}>
                Delaware River System
              </Text>
            </View>
          </View>

          <Text style={styles.title}>River Tides</Text>

          <Text style={styles.subtitle}>
            Live Delaware River tide conditions, local stations, and striper guidance.
          </Text>

          <View style={styles.statusCard}>
            <Ionicons
              name={tideStatus.icon as any}
              size={22}
              color={palette.white}
            />
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusLabel}>Current River Read</Text>
              <Text style={styles.statusTitle}>
                {tideStatus.title}
              </Text>
            </View>
          </View>

          <Text style={styles.date}>{formatToday()}</Text>
        </View>

        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <View>
              <Text style={styles.sectionLabel}>Selected station</Text>
              <Text style={styles.stationName} numberOfLines={2}>
                {selectedStation.name}
              </Text>
            </View>

            <View style={styles.stationIcon}>
              <Ionicons
                name="navigate-outline"
                size={22}
                color={palette.deepOcean}
              />
            </View>
          </View>

          <Text style={styles.stationMeta}>
            {selectedStation.area} · NOAA {selectedStation.id}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isLoading || isStationLoading}
          onPress={loadTides}
          style={({ pressed }) => [
            styles.refreshButton,
            (isLoading || isStationLoading) && styles.disabledButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={palette.white}
          />
          <Text style={styles.refreshText}>
            {isLoading ? 'Refreshing tides...' : 'Refresh Tides'}
          </Text>
        </Pressable>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Tides are not available right now
            </Text>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <View style={styles.tideGrid}>
          <TideCard
            compact
            title="Next high tide"
            tide={nextTides.nextHigh}
            emptyText={
              isLoading
                ? 'Loading high tide...'
                : 'No upcoming high tide found.'
            }
          />

          <TideCard
            compact
            title="Next low tide"
            tide={nextTides.nextLow}
            emptyText={
              isLoading
                ? 'Loading low tide...'
                : 'No upcoming low tide found.'
            }
          />
        </View>

        {lastUpdated ? (
          <Text style={styles.updatedText}>
            Updated {formatUpdatedTime(lastUpdated)}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatToday() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function formatUpdatedTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f7fb',
  },

  content: {
    gap: 14,
    padding: 16,
    paddingBottom: 112,
  },

  hero: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },

  heroBadgeText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '800',
  },

  title: {
    color: '#0f172a',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },

  statusCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },

  statusTextWrap: {
    flex: 1,
  },

  statusLabel: {
    color: '#0369a1',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.7,
  },

  statusTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
  },

  date: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '800',
  },

  stationCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  stationIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  sectionLabel: {
    color: '#0284c7',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  stationName: {
    color: '#0f172a',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
    marginTop: 4,
    flexShrink: 1,
  },

  stationMeta: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },

  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#0284c7',
    borderRadius: 18,
    minHeight: 54,
    paddingHorizontal: 18,
    shadowColor: '#0284c7',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.62,
  },

  pressedButton: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },

  refreshText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '900',
  },

  errorCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },

  errorTitle: {
    color: '#b91c1c',
    fontSize: 17,
    fontWeight: '900',
  },

  errorText: {
    color: '#b91c1c',
    fontSize: 15,
    lineHeight: 21,
  },

  tideGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  updatedText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
