import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// En la web (PC) se usa la API de notificaciones del navegador con un setTimeout.
const isWeb = Platform.OS === "web";
let webTimer: ReturnType<typeof setTimeout> | undefined;

if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false, // con la app abierta suena la alarma propia (lib/alarm.ts)
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (isWeb) {
      if (typeof Notification === "undefined") return false;
      if (Notification.permission === "granted") return true;
      return (await Notification.requestPermission()) === "granted";
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("pomodoro", {
        name: "Pomodoro",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Programa una notificación local dentro de `seconds` segundos. Devuelve un id para cancelarla. */
export async function scheduleNotification(title: string, body: string, seconds: number): Promise<string | undefined> {
  try {
    if (isWeb) {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return undefined;
      clearTimeout(webTimer);
      webTimer = setTimeout(() => new Notification(title, { body }), seconds * 1000);
      return "web";
    }
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        channelId: "pomodoro",
      },
    });
  } catch {
    return undefined;
  }
}

export async function cancelNotification(id?: string): Promise<void> {
  if (!id) return;
  if (isWeb) return clearTimeout(webTimer);
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}
