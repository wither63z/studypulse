import { Pressable, Text, View } from "react-native";
import { daysFromToday, formatDue } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import type { Task } from "@/types";
import { Icon, IconButton } from "./ui";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const days = daysFromToday(task.dueDate);
  const dueColor = task.done ? "text-subtle" : days < 0 ? "text-danger" : days <= 1 ? "text-accent" : "text-muted";

  return (
    <View className="flex-row items-center gap-3 border-b border-border py-3 last:border-b-0">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={`${task.done ? "Marcar como pendiente" : "Completar"}: ${task.title}`}
        onPress={() => { task.done ? haptics.tap() : haptics.success(); onToggle(); }}
        hitSlop={10}
        className={`h-6 w-6 items-center justify-center rounded-full border-[1.5px] ${task.done ? "border-text bg-text" : "border-subtle"}`}
      >
        {task.done ? <Icon name="checkmark" color="background" size={14} /> : null}
      </Pressable>

      <View className="flex-1 gap-1">
        <Text numberOfLines={2} className={`text-base ${task.done ? "text-subtle line-through" : "font-medium text-text"}`}>
          {task.title}
        </Text>
        <View className="flex-row flex-wrap items-center gap-x-2">
          <Text className="text-xs text-muted">{task.subject}</Text>
          <Text className="text-xs text-subtle">•</Text>
          <Text className={`text-xs font-medium ${dueColor}`}>{formatDue(task.dueDate)}</Text>
        </View>
      </View>

      <IconButton icon="trash-outline" label={`Borrar ${task.title}`} onPress={onDelete} color="subtle" />
    </View>
  );
}
