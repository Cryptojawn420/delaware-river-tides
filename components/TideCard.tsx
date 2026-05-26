import { StyleSheet, Text, View } from 'react-native';

import { palette, shadows } from '@/constants/theme';
import type { TidePrediction, TideType } from '@/services/noaa';

type TideCardProps = {
  title: string;
  tide?: TidePrediction;
  emptyText?: string;
  compact?: boolean;
};

export function TideCard({ title, tide, emptyText = 'No tide prediction available.', compact = false }: TideCardProps) {
  const tideType = tide ? getTideTypeLabel(tide.type) : undefined;
  const color = tide?.type === 'L' ? palette.lowTide : palette.highTide;

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {tideType ? (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{tideType}</Text>
          </View>
        ) : null}
      </View>

      {tide ? (
        <>
          <Text style={styles.time}>{formatTideTime(tide.time)}</Text>
          <Text style={styles.meta}>{formatTideDate(tide.time)}</Text>
          <Text style={styles.height}>{formatTideHeight(tide.heightFeet)}</Text>
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

export function formatTideTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatTideDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTideHeight(heightFeet?: number) {
  if (heightFeet === undefined || Number.isNaN(heightFeet)) {
    return 'Height not reported';
  }

  return `${heightFeet.toFixed(2)} ft MLLW`;
}

function getTideTypeLabel(type: TideType) {
  return type === 'H' ? 'High' : 'Low';
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  compactCard: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: palette.mutedInk,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '800',
  },
  time: {
    color: palette.ink,
    fontSize: 30,
    fontWeight: '800',
  },
  meta: {
    color: palette.mutedInk,
    fontSize: 15,
    fontWeight: '600',
  },
  height: {
    color: palette.deepOcean,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: palette.mutedInk,
    fontSize: 16,
    lineHeight: 22,
  },
});
