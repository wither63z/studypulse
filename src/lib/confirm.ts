import { haptics } from "./haptics";
import { Alert, Platform } from "react-native";

/** Pide confirmación al usuario (Alert en celular, confirm en PC). */
export function confirm(title: string, message: string, confirmLabel: string, onConfirm: () => void) {
  haptics.warning();
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
