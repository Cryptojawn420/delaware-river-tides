import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TideCard } from '@/components/TideCard';
import { palette, shadows } from '@/constants/theme';
import { useSelectedStation } from '@/context/StationContext';
import { fetchUpcomingTides, getNextTides, type NextTides } from '@/services/noaa';

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
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load tide predictions.');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Today on the Delaware River</Text>
          <Text style={styles.title}>Delaware River Tides</Text>
          <Text style={styles.subtitle}>Local tide info for the Delaware River</Text>
          <Text style={styles.date}>{formatToday()}</Text>
        </View>

        <View style={styles.stationCard}>
          <Text style={styles.sectionLabel}>Selected station</Text>
          <Text style={styles.stationName}>{selectedStation.name}</Text>
          <Text style={styles.stationMeta}>
            {selectedStation.area} · NOAA {selectedStation.id}
          </Text>
        </View>

        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || isStationLoading}
            onPress={loadTides}
            style={({ pressed }) => [
              styles.refreshButton,
              (isLoading || isStationLoading) && styles.disabledButton,
              pressed && styles.pressedButton,
            ]}>
            <Text style={styles.refreshText}>{isLoading ? 'Refreshing tides...' : 'Refresh'}</Text>
          </Pressable>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Tides are not available right now</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.tideGrid}>
          <TideCard
            compact
            title="Next high tide"
            tide={nextTides.nextHigh}
            emptyText={isLoading ? 'Loading high tide...' : 'No upcoming high tide found.'}
          />
          <TideCard
            compact
            title="Next low tide"
            tide={nextTides.nextLow}
            emptyText={isLoading ? 'Loading low tide...' : 'No upcoming low tide found.'}
          />
        </View>

        {lastUpdated ? <Text style={styles.updatedText}>Updated {formatUpdatedTime(lastUpdated)}</Text> : null}
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
    backgroundColor: palette.foam,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 112,
  },
  hero: {
    backgroundColor: palette.deepOcean,
    borderRadius: 8,
    gap: 8,
    padding: 24,
  },
  kicker: {
    color: palette.seaGlass,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  title: {
    color: palette.white,
    fontSize: 38,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.mist,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
  },
  date: {
    color: palette.sand,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  stationCard: {
    ...shadows.card,
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 18,
  },
  sectionLabel: {
    color: palette.mutedInk,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stationName: {
    color: palette.ink,
    fontSize: 25,
    fontWeight: '900',
  },
  stationMeta: {
    color: palette.mutedInk,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  row: {
    alignItems: 'stretch',
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: palette.ocean,
    borderRadius: 8,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.62,
  },
  pressedButton: {
    opacity: 0.84,
  },
  refreshText: {
    color: palette.white,
    fontSize: 17,
    fontWeight: '900',
  },
  errorCard: {
    backgroundColor: palette.dangerSoft,
    borderColor: palette.danger,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  errorTitle: {
    color: palette.danger,
    fontSize: 17,
    fontWeight: '900',
  },
  errorText: {
    color: palette.danger,
    fontSize: 15,
    lineHeight: 21,
  },
  tideGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  updatedText: {
    color: palette.mutedInk,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
