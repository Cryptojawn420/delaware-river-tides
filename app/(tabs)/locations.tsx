import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StationCard } from '@/components/StationCard';
import { TIDE_STATIONS, type TideStation } from '@/constants/stations';
import { palette } from '@/constants/theme';
import { useSelectedStation } from '@/context/StationContext';

export default function LocationsScreen() {
  const { selectedStation, selectStation } = useSelectedStation();
  const [savedStationId, setSavedStationId] = useState<string | null>(null);

  async function handleSelectStation(station: TideStation) {
    await selectStation(station);
    setSavedStationId(station.id);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Tide stations</Text>
          <Text style={styles.title}>Choose your shore spot</Text>
          <Text style={styles.subtitle}>Your station is saved locally on this phone.</Text>
        </View>

        {savedStationId ? (
          <View style={styles.savedCard}>
            <Text style={styles.savedText}>Saved {selectedStation.name} for tide forecasts.</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {TIDE_STATIONS.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isSelected={station.id === selectedStation.id}
              onPress={() => handleSelectStation(station)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    gap: 8,
    paddingBottom: 4,
  },
  eyebrow: {
    color: palette.ocean,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: 33,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.mutedInk,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  savedCard: {
    backgroundColor: palette.seaGlass,
    borderColor: palette.lowTide,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  savedText: {
    color: palette.deepOcean,
    fontSize: 15,
    fontWeight: '800',
  },
  list: {
    gap: 14,
  },
});
