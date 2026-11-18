import { Platform, Vibration } from "react-native";
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { ALARM } from "@/config";

// Aviso al terminar el temporizador: sonido + vibración.
// Se activa/desactiva y se cambia el sonido en config.ts → ALARM.

let player: AudioPlayer | null = null;

function getPlayer(): AudioPlayer | null {
  try {
    if (!player) {
      // Que suene aunque el iPhone esté en modo silencio.
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
      player = createAudioPlayer(ALARM.soundFile);
    }
    return player;
  } catch {
    return null;
  }
}

/** Precarga el sonido para que no haya retraso al sonar. */
export function preloadAlarm() {
  if (ALARM.sound) getPlayer();
}

function playSound() {
  const p = getPlayer();
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {
    // Si el audio falla, al menos vibra.
  }
}

function vibrate() {
  if (Platform.OS === "web") return;
  if (Platform.OS === "android") {
    Vibration.vibrate([0, 400, 200, 400, 200, 600]);
    return;
  }
  // iOS: varios golpes de vibración seguidos.
  for (let i = 0; i < ALARM.vibrationPulses; i++) {
    setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}), i * 450);
  }
}

export function playAlarm() {
  if (ALARM.sound) playSound();
  if (ALARM.vibrate) vibrate();
}
