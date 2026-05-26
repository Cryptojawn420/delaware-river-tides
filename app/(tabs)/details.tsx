import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TideCard } from '@/components/TideCard';
import { palette, shadows } from '@/constants/theme';
import { useSelectedStation } from '@/context/StationContext';
import {
  fetchTodayAndTomorrowTides,
  filterTidesByDate,
  getTodayAndTomorrowKeys,
  type TidePrediction,
} from '@/services/noaa';

export default function TideDetailsScreen() {
  const { selectedStation, isStationLoading } = useSelectedStation();
  const [predictions, setPredictions] = useState<TidePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { todayKey, tomorrowKey } = getTodayAndTomorrowKeys();
  const todayTides = filterTidesByDate(predictions, todayKey);
  const tomorrowTides = filterTidesByDate(predictions, tomorrowKey);

  const loadTides = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextPredictions = await fetchTodayAndTomorrowTides(selectedStation);
      setPredictions(nextPredictions);
    } catch (error) {
      setPredictions([]);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load tide details.');
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
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Tide details</Text>
          <Text style={styles.title}>{selectedStation.name}</Text>
          <Text style={styles.subtitle}>
            NOAA station {selectedStation.id} · {selectedStation.area}
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
          ]}>
          <Text style={styles.refreshText}>{isLoading ? 'Loading details...' : 'Refresh details'}</Text>
        </Pressable>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to load tide details</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TideSection title="Today" tides={todayTides} isLoading={isLoading} />
        <TideSection title="Tomorrow" tides={tomorrowTides} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TideSection({
  title,
  tides,
  isLoading,
}: {
  title: string;
  tides: TidePrediction[];
  isLoading: boolean;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {tides.length > 0 ? (
        <View style={styles.tideList}>
          {tides.map((tide) => (
            <TideCard key={tide.id} title={tide.type === 'H' ? 'High tide' : 'Low tide'} tide={tide} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{isLoading ? 'Loading tide predictions...' : 'No tide predictions found'}</Text>
          <Text style={styles.emptyText}>
            {isLoading
              ? 'Checking NOAA CO-OPS for high and low tide times.'
              : 'Try refreshing, or choose a different Delaware River station.'}
          </Text>
        </View>
      )}
    </View>
  );
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
  header: {
    ...shadows.card,
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 7,
    padding: 20,
  },
  eyebrow: {
    color: palette.ocean,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: 31,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.mutedInk,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  tideList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 18,
  },
  emptyTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  emptyText: {
    color: palette.mutedInk,
    fontSize: 15,
    lineHeight: 21,
  },
});
