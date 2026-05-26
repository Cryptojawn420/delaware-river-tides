import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const oceanBlue = '#0369a1';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: oceanBlue,
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f8fafc',
          borderTopColor: '#bae6fd',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: 'Locations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: 'Details',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="striper"
        options={{
          title: 'Striper',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fish-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
