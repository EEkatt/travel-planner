import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const trip = {
  title: 'Georgia trip',
  dates: 'May 12-19',
  nextItem: {
    time: '10:30',
    title: 'Old Tbilisi walk',
    meta: 'Abanotubani -> Narikala Fortress',
  },
  housing: {
    title: 'Tbilisi apartment',
    meta: 'Check-in 15:00 · Booking #A42-91',
  },
  flight: {
    title: 'Flight SU 1892',
    meta: 'SVO 08:20 -> TBS 12:05',
  },
};

const dayPlan = [
  { time: '09:30', title: 'Breakfast near Freedom Square', type: 'Place' },
  { time: '10:30', title: 'Old Tbilisi walk', type: 'Route' },
  { time: '13:00', title: 'Lunch and notes review', type: 'Note' },
  { time: '16:00', title: 'Mtatsminda Park', type: 'Place' },
];

const quickActions = ['Housing', 'Flights', 'Notes', 'Checklist'];

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.tripLabel}>Current trip</Text>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.tripDates}>{trip.dates}</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>In trip</Text>
          </View>
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          <TouchableOpacity style={[styles.tab, styles.activeTab]} accessibilityRole="tab">
            <Text style={[styles.tabText, styles.activeTabText]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} accessibilityRole="tab">
            <Text style={styles.tabText}>Days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} accessibilityRole="tab">
            <Text style={styles.tabText}>Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nextPanel}>
          <Text style={styles.sectionLabel}>Next</Text>
          <Text style={styles.nextTime}>{trip.nextItem.time}</Text>
          <Text style={styles.nextTitle}>{trip.nextItem.title}</Text>
          <Text style={styles.nextMeta}>{trip.nextItem.meta}</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Open in maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action} style={styles.quickButton}>
              <Text style={styles.quickButtonText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mapPreview}>
          <Text style={styles.mapTitle}>Day map</Text>
          <Text style={styles.mapSubtitle}>4 saved points · external navigation handoff</Text>
          <View style={[styles.mapPin, styles.mapPinOne]} />
          <View style={[styles.mapPin, styles.mapPinTwo]} />
          <View style={[styles.mapPin, styles.mapPinThree]} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today plan</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeline}>
          {dayPlan.map((item) => (
            <View key={`${item.time}-${item.title}`} style={styles.timelineItem}>
              <Text style={styles.timelineTime}>{item.time}</Text>
              <View style={styles.timelineCard}>
                <Text style={styles.timelineType}>{item.type}</Text>
                <Text style={styles.timelineTitle}>{item.title}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Housing</Text>
            <Text style={styles.detailTitle}>{trip.housing.title}</Text>
            <Text style={styles.detailMeta}>{trip.housing.meta}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Flight</Text>
            <Text style={styles.detailTitle}>{trip.flight.title}</Text>
            <Text style={styles.detailMeta}>{trip.flight.meta}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7f4',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  tripLabel: {
    color: '#657063',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tripTitle: {
    color: '#1d261f',
    fontSize: 30,
    fontWeight: '800',
  },
  tripDates: {
    color: '#657063',
    fontSize: 16,
    marginTop: 4,
  },
  modeBadge: {
    backgroundColor: '#d8eadb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  modeText: {
    color: '#1f6b3a',
    fontSize: 13,
    fontWeight: '700',
  },
  tabs: {
    backgroundColor: '#e7ece5',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#657063',
    fontSize: 15,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#1d261f',
  },
  nextPanel: {
    backgroundColor: '#233528',
    borderRadius: 8,
    marginBottom: 14,
    padding: 18,
  },
  sectionLabel: {
    color: '#b8cbbd',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  nextTime: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
  },
  nextTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  nextMeta: {
    color: '#dce8df',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 7,
    marginTop: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  quickButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    paddingVertical: 14,
  },
  quickButtonText: {
    color: '#243126',
    fontSize: 15,
    fontWeight: '800',
  },
  mapPreview: {
    aspectRatio: 1.7,
    backgroundColor: '#dce7db',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 16,
  },
  mapTitle: {
    color: '#1d261f',
    fontSize: 18,
    fontWeight: '800',
  },
  mapSubtitle: {
    color: '#566357',
    fontSize: 14,
    marginTop: 4,
  },
  mapPin: {
    backgroundColor: '#e6563f',
    borderColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 3,
    height: 20,
    position: 'absolute',
    width: 20,
  },
  mapPinOne: {
    left: '28%',
    top: '48%',
  },
  mapPinTwo: {
    left: '56%',
    top: '38%',
  },
  mapPinThree: {
    left: '68%',
    top: '64%',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#1d261f',
    fontSize: 21,
    fontWeight: '800',
  },
  sectionAction: {
    color: '#2b7344',
    fontSize: 16,
    fontWeight: '800',
  },
  timeline: {
    gap: 10,
    marginBottom: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineTime: {
    color: '#657063',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 14,
    width: 52,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  timelineType: {
    color: '#6b756b',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timelineTitle: {
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '800',
  },
  detailsRow: {
    gap: 10,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  detailLabel: {
    color: '#657063',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  detailTitle: {
    color: '#1d261f',
    fontSize: 17,
    fontWeight: '800',
  },
  detailMeta: {
    color: '#657063',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
});
