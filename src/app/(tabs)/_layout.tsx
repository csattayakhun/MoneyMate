import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '@/styles/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าแรก',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'ปฏิทิน',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-blank" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'สถิติ',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-donut" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'ตั้งค่า',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
