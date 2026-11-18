import { useEffect, useRef, useState } from "react";
import { POMODORO } from "@/config";
import { playAlarm, preloadAlarm } from "@/lib/alarm";
import { cancelNotification, requestNotificationPermission, scheduleNotification } from "@/lib/notifications";

export type Phase = "focus" | "break";
export type Status = "idle" | "running" | "paused";
type Durations = Record<Phase, number>; // en minutos

const DEFAULTS: Durations = { focus: POMODORO.focusMinutes, break: POMODORO.breakMinutes };

const messages = (d: Durations): Record<Phase, { title: string; body: string }> => ({
  focus: { title: "Sesión de estudio completada", body: `Buen trabajo. Toma un descanso de ${d.break} minutos.` },
  break: { title: "Descanso terminado", body: "Es hora de volver a estudiar." },
});

/**
 * Temporizador Pomodoro. Calcula el tiempo con la hora de fin (no con un contador),
 * así sigue siendo exacto aunque la app pase a segundo plano.
 * Los minutos de cada fase se pueden ajustar; al abrir la app vuelven a los de config.ts.
 */
export function usePomodoro(onFocusComplete: (minutes: number) => void) {
  const [durations, setDurations] = useState<Durations>(DEFAULTS);
  const [phase, setPhase] = useState<Phase>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(DEFAULTS.focus * 60);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);
  const [lastCompleted, setLastCompleted] = useState<Phase | null>(null);
  const endAt = useRef(0);
  const notificationId = useRef<string | undefined>(undefined);
  const busy = useRef(false);
  const onComplete = useRef(onFocusComplete);
  onComplete.current = onFocusComplete;

  const secondsOf = (p: Phase) => durations[p] * 60;

  useEffect(() => {
    if (status !== "running") return;
    const tick = () => {
      const left = (endAt.current - Date.now()) / 1000;
      if (left > 0) return setRemaining(left);
      // Fase terminada: la notificación ya estaba programada desde que se inició.
      notificationId.current = undefined;
      if (phase === "focus") onComplete.current(durations.focus);
      playAlarm();
      const next: Phase = phase === "focus" ? "break" : "focus";
      setLastCompleted(phase);
      setPhase(next);
      setRemaining(durations[next] * 60);
      setStatus("idle");
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [status, phase, durations]);

  useEffect(() => preloadAlarm(), []);

  // Al desmontar, no dejar notificaciones huérfanas.
  useEffect(() => () => void cancelNotification(notificationId.current), []);

  const clearScheduled = () => {
    cancelNotification(notificationId.current);
    notificationId.current = undefined;
  };

  const start = async () => {
    if (busy.current || status === "running") return; // evita doble toque
    busy.current = true;
    setLastCompleted(null);
    endAt.current = Date.now() + remaining * 1000;
    setStatus("running");
    const allowed = await requestNotificationPermission();
    setNotificationsAllowed(allowed);
    clearScheduled();
    const msg = messages(durations)[phase];
    notificationId.current = allowed ? await scheduleNotification(msg.title, msg.body, (endAt.current - Date.now()) / 1000) : undefined;
    busy.current = false;
  };

  const pause = () => {
    if (status !== "running") return;
    setRemaining(Math.max(1, (endAt.current - Date.now()) / 1000));
    setStatus("paused");
    clearScheduled();
  };

  const reset = () => {
    clearScheduled();
    setStatus("idle");
    setRemaining(secondsOf(phase));
  };

  const switchPhase = (next: Phase) => {
    if (next === phase) return;
    clearScheduled();
    setLastCompleted(null);
    setPhase(next);
    setStatus("idle");
    setRemaining(secondsOf(next));
  };

  /** Cambia los minutos de una fase (solo con el temporizador detenido). */
  const setMinutes = (p: Phase, minutes: number) => {
    if (status !== "idle") return;
    const { min, max } = POMODORO[p];
    const value = Math.min(max, Math.max(min, Math.round(minutes)));
    setDurations((d) => ({ ...d, [p]: value }));
    if (p === phase) setRemaining(value * 60);
  };

  return {
    durations,
    phase,
    status,
    remaining,
    progress: Math.max(0, 1 - remaining / secondsOf(phase)),
    notificationsAllowed,
    lastCompleted,
    start,
    pause,
    reset,
    switchPhase,
    setMinutes,
  };
}
