import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSelectedStation } from '@/context/StationContext';
import {
  getCurrentStriperSeason,
  getStriperNoteForStation,
  REPORT_LINKS,
} from '@/constants/striper';

const riverBlue = '#0369a1';
const deepBlue = '#0f172a';
const softBlue = '#e0f2fe';
const sand = '#fef3c7';

export default function StriperScreen() {
  const { selectedStation } = useSelectedStation();
  const season = getCurrentStriperSeason();
  const stationNote = getStriperNoteForStation(selectedStation.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="fish-outline" size={34} color={riverBlue} />
        </View>
        <Text style={styles.eyebrow}>Delaware River</Text>
        <Text style={styles.title}>Striper Report</Text>
        <Text style={styles.subtitle}>
          Seasonal striped bass guidance for the same tide stations in this app.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Season</Text>
        <Text style={styles.cardTitle}>{season.title}</Text>
        <Text style={styles.body}>{season.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Selected Station</Text>
        <Text style={styles.cardTitle}>{selectedStation.name}</Text>
        {stationNote ? (
          <>
            <View style={styles.badge}>
              <Ionicons name="navigate-outline" size={15} color={riverBlue} />
              <Text style={styles.badgeText}>{stationNote.areaType}</Text>
            </View>
            <Text style={styles.body}>{stationNote.localRead}</Text>
            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>Tide Tip</Text>
              <Text style={styles.tipText}>{stationNote.tideTip}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.body}>
            Pick a Delaware River station to get local striper notes.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Baits & Presentations</Text>
        <Text style={styles.cardTitle}>What to Think About</Text>
        <View style={styles.chipWrap}>
          {season.baits.map((bait) => (
            <View key={bait} style={styles.chip}>
              <Text style={styles.chipText}>{bait}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>River Notes</Text>
        {season.notes.map((note) => (
          <View key={note} style={styles.noteRow}>
            <Ionicons name="water-outline" size={17} color={riverBlue} />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Live Report Links</Text>
        <Text style={styles.body}>
          These open current public reports. Use them as a reality check before you fish.
        </Text>
        {REPORT_LINKS.map((link) => (
          <TouchableOpacity
            key={link.url}
            style={styles.linkButton}
            onPress={() => Linking.openURL(link.url)}
          >
            <Text style={styles.linkText}>{link.title}</Text>
            <Ionicons name="open-outline" size={18} color={riverBlue} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.warning}>
        <Ionicons name="alert-circle-outline" size={18} color="#92400e" />
        <Text style={styles.warningText}>
          Fishing conditions change fast. Check current NJ, PA, and DE regulations before fishing.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  eyebrow: {
    color: riverBlue,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    color: deepBlue,
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  cardLabel: {
    color: riverBlue,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  cardTitle: {
    color: deepBlue,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
  },
  body: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: softBlue,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: riverBlue,
    fontSize: 12,
    fontWeight: '800',
  },
  tipBox: {
    marginTop: 14,
    backgroundColor: sand,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipTitle: {
    color: '#92400e',
    fontWeight: '900',
    marginBottom: 4,
  },
  tipText: {
    color: '#78350f',
    fontSize: 14,
    lineHeight: 20,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: softBlue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: riverBlue,
    fontWeight: '800',
    fontSize: 13,
  },
  noteRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noteText: {
    flex: 1,
    color: '#334155',
    fontSize: 15,
    lineHeight: 21,
  },
  linkButton: {
    marginTop: 10,
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    color: deepBlue,
    fontWeight: '800',
    flex: 1,
    paddingRight: 8,
  },
  warning: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  warningText: {
    flex: 1,
    color: '#78350f',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});
