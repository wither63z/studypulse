import { useState } from "react";
import { Text, View } from "react-native";
import { Card, EmptyState, IconButton, Screen, SectionTitle, StatCard } from "@/components/ui";
import { useStudyData } from "@/data/StudyData";
import { addDays, formatDayMonth, isInWeek, toDateKey, weekRange } from "@/lib/dates";

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export default function SummaryScreen() {
  const { tasks, sessions } = useStudyData();
  const [weekOffset, setWeekOffset] = useState(0); // 0 = esta semana, -1 = la anterior...
  const ref = addDays(new Date(), weekOffset * 7);
  const { start } = weekRange(ref);

  const completed = tasks.filter((t) => t.done && isInWeek(t.completedAt, ref));
  const weekSessions = sessions.filter((s) => isInWeek(s.finishedAt, ref));
  const minutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0);

  const days = DAY_LABELS.map((label, i) => {
    const key = toDateKey(addDays(start, i));
    const value = weekSessions.filter((s) => toDateKey(new Date(s.finishedAt)) === key).reduce((sum, s) => sum + s.minutes, 0);
    return { label, key, value };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.value));
  const todayKey = toDateKey(new Date());

  const bySubject = Object.entries(
    completed.reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.subject]: (acc[t.subject] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);

  const weekLabel = weekOffset === 0 ? "Esta semana" : weekOffset === -1 ? "Semana pasada" : `Hace ${-weekOffset} semanas`;

  return (
    <Screen
      title="Resumen"
      subtitle={`${weekLabel} · ${formatDayMonth(start)} – ${formatDayMonth(addDays(start, 6))}`}
      right={
        <View className="flex-row">
          <IconButton icon="chevron-back" label="Semana anterior" onPress={() => setWeekOffset((w) => w - 1)} color="text" />
          <IconButton icon="chevron-forward" label="Semana siguiente" onPress={() => setWeekOffset((w) => w + 1)} disabled={weekOffset >= 0} color="text" />
        </View>
      }
    >
      <View className="flex-row flex-wrap gap-3">
        <StatCard icon="checkmark-done-outline" value={completed.length} label="Tareas" />
        <StatCard icon="time-outline" value={minutes} label="Minutos" />
        <StatCard icon="timer-outline" value={weekSessions.length} label="Sesiones" />
      </View>

      <Card>
        <SectionTitle>Minutos por día</SectionTitle>
        <View className="h-40 flex-row gap-2">
          {days.map((d) => (
            <View key={d.key} className="flex-1 items-center gap-1.5">
              <Text className="text-xs font-medium text-muted">{d.value > 0 ? d.value : ""}</Text>
              <View className="w-full flex-1 justify-end overflow-hidden rounded-md bg-track">
                <View className="w-full rounded-md bg-primary" style={{ height: `${(d.value / maxDay) * 100}%` }} />
              </View>
              <Text className={`text-xs ${d.key === todayKey ? "font-semibold text-text" : "text-muted"}`}>{d.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>Tareas completadas por materia</SectionTitle>
        {bySubject.length === 0 ? (
          <EmptyState icon="school-outline" title="Sin tareas completadas" text="Las tareas que completes en esta semana aparecerán aquí." />
        ) : (
          bySubject.map(([subject, count]) => (
            <View key={subject} className="gap-1.5">
              <View className="flex-row justify-between">
                <Text className="text-sm font-medium text-text">{subject}</Text>
                <Text className="text-sm font-semibold text-muted">{count}</Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-track">
                <View className="h-full rounded-full bg-accent" style={{ width: `${(count / bySubject[0][1]) * 100}%` }} />
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}
