import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TideStation } from '@/constants/stations';
import { palette, shadows } from '@/constants/theme';

type StationCardProps = {
  station: TideStation;
  isSelected: boolean;
  onPress: () => void;
};

export function StationCard({ station, isSelected, onPress }: StationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.selectedCard,
        pressed && styles.pressedCard,
      ]}>
      <View style={styles.content}>
        <Text style={styles.name}>{station.name}</Text>
        <Text style={styles.area}>{station.area}</Text>
        <Text style={styles.stationId}>NOAA {station.id}</Text>
      </View>

      <View style={[styles.radio, isSelected && styles.selectedRadio]}>
        {isSelected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    alignItems: 'center',
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    padding: 18,
  },
  selectedCard: {
    backgroundColor: palette.seaGlass,
    borderColor: palette.lowTide,
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  area: {
    color: palette.mutedInk,
    fontSize: 15,
    fontWeight: '600',
  },
  stationId: {
    color: palette.ocean,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  radio: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: 16,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  selectedRadio: {
    borderColor: palette.lowTide,
  },
  radioDot: {
    backgroundColor: palette.lowTide,
    borderRadius: 8,
    height: 14,
    width: 14,
  },
});
