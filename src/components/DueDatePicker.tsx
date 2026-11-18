import { Text, View } from "react-native";
import { DUE_SHORTCUTS, TASKS } from "@/config";
import { addDays, daysFromToday, formatLongDate, fromDateKey, toDateKey } from "@/lib/dates";
import { Chip, IconButton } from "./ui";

/** Selector de fecha de entrega: atajos + flechas día a día. No permite fechas pasadas. */
export function DueDatePicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  const offset = daysFromToday(value);
  const shift = (days: number) => onChange(toDateKey(addDays(fromDateKey(value), days)));

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2 rounded-xl border border-border bg-input px-1">
        <IconButton icon="chevron-back" label="Día anterior" onPress={() => shift(-1)} disabled={offset <= 0} />
        <Text className="flex-1 text-center text-base font-medium text-text">{formatLongDate(value)}</Text>
        <IconButton icon="chevron-forward" label="Día siguiente" onPress={() => shift(1)} disabled={offset >= TASKS.maxDaysAhead} />
      </View>
      <View className="flex-row flex-wrap gap-2">
        {DUE_SHORTCUTS.map((s) => (
          <Chip key={s.label} label={s.label} selected={offset === s.days} onPress={() => onChange(toDateKey(addDays(new Date(), s.days)))} />
        ))}
      </View>
    </View>
  );
}
