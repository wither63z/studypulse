import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StudyDataProvider } from "@/data/StudyData";
import { useTheme } from "@/theme/useTheme";

export default function RootLayout() {
  const { scheme, colors, themeVars } = useTheme();

  return (
    <SafeAreaProvider>
      <StudyDataProvider>
        <View style={themeVars} className="flex-1 bg-background">
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="new-task" options={{ presentation: "modal", title: "Nueva tarea" }} />
          </Stack>
        </View>
      </StudyDataProvider>
    </SafeAreaProvider>
  );
}
