import { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { SUBJECTS } from "@/config";
import { TaskItem } from "@/components/TaskItem";
import { Button, Card, Chip, EmptyState, Screen, Segmented } from "@/components/ui";
import { useStudyData } from "@/data/StudyData";
import { confirm } from "@/lib/confirm";
import { daysFromToday } from "@/lib/dates";

const ALL = "Todas";
const filters = [ALL, ...SUBJECTS];
type TaskView = "pending" | "done";

export default function TasksScreen() {
  const { tasks, loaded, toggleTask, deleteTask, clearCompleted } = useStudyData();
  const [filter, setFilter] = useState(ALL);
  const [view, setView] = useState<TaskView>("pending");

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const overdue = pending.filter((t) => daysFromToday(t.dueDate) < 0).length;
  const visible = (view === "pending" ? pending : done)
    .filter((t) => filter === ALL || t.subject === filter)
    .sort((a, b) => (view === "pending" ? a.dueDate.localeCompare(b.dueDate) : (b.completedAt ?? "").localeCompare(a.completedAt ?? "")));

  const remove = (id: string, name: string) => confirm("Borrar tarea", `¿Seguro que quieres borrar "${name}"?`, "Borrar", () => deleteTask(id));

  return (
    <Screen
      title="Tareas"
      subtitle={pending.length ? `${pending.length} ${pending.length === 1 ? "pendiente" : "pendientes"}${overdue ? ` · ${overdue} ${overdue === 1 ? "vencida" : "vencidas"}` : ""}` : "Todo al día"}
      right={<Button label="Nueva" icon="add" onPress={() => router.push("/new-task")} className="min-h-10 px-4" />}
    >
      <Segmented
        options={[
          { label: `Pendientes · ${pending.length}`, value: "pending" },
          { label: `Resueltas · ${done.length}`, value: "done" },
        ]}
        value={view}
        onChange={setView}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {filters.map((f) => (
          <Chip key={f} label={f} selected={f === filter} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      <Card className="py-1">
        {view === "done" && done.length > 0 ? (
          <View className="flex-row justify-end pt-2">
            <Button
              label="Limpiar resueltas"
              variant="ghost"
              className="min-h-9 px-2"
              onPress={() => confirm("Limpiar resueltas", "Se borrarán todas las tareas resueltas. Tus minutos de estudio no cambian.", "Borrar", clearCompleted)}
            />
          </View>
        ) : null}

        {loaded && visible.length === 0 ? (
          view === "pending" && filter === ALL ? (
            <EmptyState icon="document-text-outline" title="No tienes tareas pendientes" text="Crea una tarea para organizar tus entregas." action={{ label: "Crear tarea", onPress: () => router.push("/new-task") }} />
          ) : (
            <EmptyState
              icon={view === "pending" ? "document-text-outline" : "checkmark-done-outline"}
              title={view === "pending" ? "Nada pendiente aquí" : "Aún no hay tareas resueltas"}
              text={filter !== ALL ? `No hay tareas de ${filter}.` : undefined}
            />
          )
        ) : (
          <View>
            {visible.map((t) => (
              <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} onDelete={() => remove(t.id, t.title)} />
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}
