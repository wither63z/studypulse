import { Platform, Text, View } from "react-native";
import { POMODORO } from "@/config";
import { ProgressRing } from "@/components/ProgressRing";
import { Button, Card, Notice, Screen, SectionTitle, Segmented, StatCard, Stepper } from "@/components/ui";
import { useStudyData } from "@/data/StudyData";
import { usePomodoro, type Phase } from "@/hooks/usePomodoro";
import { confirm } from "@/lib/confirm";
import { formatClock, toDateKey } from "@/lib/dates";

const STATUS_TEXT = { idle: "Listo para empezar", running: "En curso", paused: "En pausa" };

export default function PomodoroScreen() {
  const { sessions, addSession } = useStudyData();
  const timer = usePomodoro(addSession);
  const isFocus = timer.phase === "focus";
  const locked = timer.status !== "idle";

  const phaseOptions: { label: string; value: Phase }[] = [
    { label: `Estudio · ${timer.durations.focus} min`, value: "focus" },
    { label: `Descanso · ${timer.durations.break} min`, value: "break" },
  ];

  const today = toDateKey(new Date());
  const todaySessions = sessions.filter((s) => toDateKey(new Date(s.finishedAt)) === today);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

  // Cambiar de fase con el temporizador activo pierde el progreso: se pide confirmación.
  const changePhase = (next: Phase) => {
    if (!locked) return timer.switchPhase(next);
    confirm("Cambiar de modo", "Se perderá el progreso del temporizador actual.", "Cambiar", () => timer.switchPhase(next));
  };

  const stepper = (p: Phase, label: string) => (
    <Stepper
      label={label}
      value={timer.durations[p]}
      unit="min"
      min={POMODORO[p].min}
      max={POMODORO[p].max}
      disabled={locked}
      onChange={(v) => timer.setMinutes(p, v)}
      step={POMODORO[p].step}
    />
  );

  return (
    <Screen title="Pomodoro" subtitle="Concéntrate por bloques y descansa entre ellos">
      <Card className="items-center gap-6 py-6">
        <View className="w-full">
          <Segmented options={phaseOptions} value={timer.phase} onChange={changePhase} />
        </View>

        <ProgressRing progress={timer.progress} color={isFocus ? "accent" : "rest"}>
          <Text className={`text-xs font-semibold uppercase tracking-widest ${isFocus ? "text-accent" : "text-rest"}`}>
            {isFocus ? "Estudio" : "Descanso"}
          </Text>
          <Text className="text-6xl font-light tracking-tight text-text" style={{ fontVariant: ["tabular-nums"] }}>
            {formatClock(timer.remaining)}
          </Text>
          <Text className="text-sm text-muted">{STATUS_TEXT[timer.status]}</Text>
        </ProgressRing>

        <View className="w-full flex-row gap-3">
          {timer.status === "running" ? (
            <Button key="pause" label="Pausar" icon="pause" onPress={timer.pause} className="flex-1" />
          ) : (
            <Button key="start" label={timer.status === "paused" ? "Reanudar" : "Iniciar"} icon="play" onPress={timer.start} className="flex-1" />
          )}
          <Button label="Reiniciar" icon="refresh" variant="secondary" onPress={timer.reset} disabled={!locked && timer.progress === 0} className="flex-1" />
        </View>

        {timer.lastCompleted ? (
          <Notice
            icon="checkmark-circle-outline"
            text={timer.lastCompleted === "focus" ? `Sesión completada: +${timer.durations.focus} minutos en tu resumen. Ahora toca descansar.` : "Descanso terminado. Inicia otra sesión cuando estés listo."}
          />
        ) : null}
        {timer.notificationsAllowed === false ? (
          <Notice
            icon="notifications-off-outline"
            text={Platform.OS === "web" ? "Las notificaciones están bloqueadas en el navegador. Actívalas en la configuración del sitio para recibir avisos." : "Las notificaciones están desactivadas. Actívalas en Ajustes para recibir el aviso al terminar."}
          />
        ) : null}
      </Card>

      <Card>
        <SectionTitle>Duración</SectionTitle>
        {stepper("focus", "Estudio")}
        {stepper("break", "Descanso")}
        {locked ? <Text className="text-xs text-muted">Reinicia el temporizador para cambiar los tiempos.</Text> : null}
      </Card>

      <View className="flex-row gap-3">
        <StatCard icon="checkmark-circle-outline" value={todaySessions.length} label="Sesiones hoy" />
        <StatCard icon="time-outline" value={todayMinutes} label="Minutos hoy" />
      </View>
    </Screen>
  );
}
