import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

// Vibraciones cortas. En la web (PC) no hacen nada.
const enabled = Platform.OS !== "web";
const safe = (fn: () => Promise<void>) => {
  if (enabled) fn().catch(() => {});
};

export const haptics = {
  tap: () => safe(() => Haptics.selectionAsync()),
  light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
