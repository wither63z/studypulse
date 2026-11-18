import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { APP_NAME, TABS } from "@/config";
import { useTheme } from "@/theme/useTheme";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, elevation: 0 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      {Object.entries(TABS).map(([name, tab]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: `${tab.title} · ${APP_NAME}`,
            tabBarLabel: tab.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} color={String(color)} size={size - 3} />,
          }}
        />
      ))}
    </Tabs>
  );
}
