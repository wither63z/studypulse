import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SUBJECTS, TASKS } from "@/config";
import { DueDatePicker } from "@/components/DueDatePicker";
import { Button, ChipGroup, Field, IconButton, Label } from "@/components/ui";
import { useStudyData } from "@/data/StudyData";
import { addDays, daysFromToday, toDateKey } from "@/lib/dates";

const subjectOptions = SUBJECTS.map((s) => ({ label: s, value: s }));

const close = () => (router.canGoBack() ? router.back() : router.replace("/"));

/** Pantalla para crear una tarea. Se abre desde el botón "Nueva" de Tareas. */
export default function NewTaskScreen() {
  const { addTask } = useStudyData();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [dueDate, setDueDate] = useState(() => toDateKey(addDays(new Date(), 1)));

  const canSave = title.trim().length > 0 && daysFromToday(dueDate) >= 0;

  const save = () => {
    if (canSave && addTask({ title, subject, dueDate })) close();
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="w-full max-w-2xl flex-row items-center justify-between self-center px-2 py-2">
          <IconButton icon="close" label="Cerrar" onPress={close} color="text" />
          <Text className="text-base font-semibold text-text">Nueva tarea</Text>
          <View className="w-10" />
        </View>

        <ScrollView contentContainerClassName="w-full max-w-2xl self-center gap-6 px-5 pb-6 pt-2" keyboardShouldPersistTaps="handled">
          <Field
            label="Descripción"
            placeholder="Ej. Ejercicios de la página 42"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={save}
            maxLength={TASKS.titleMaxLength}
            hint={`${title.length}/${TASKS.titleMaxLength}`}
            returnKeyType="done"
            autoFocus
          />
          <View className="gap-2.5">
            <Label>Materia</Label>
            <ChipGroup options={subjectOptions} value={subject} onChange={setSubject} />
          </View>
          <View className="gap-2.5">
            <Label>Fecha de entrega</Label>
            <DueDatePicker value={dueDate} onChange={setDueDate} />
          </View>
        </ScrollView>

        <View className="w-full max-w-2xl self-center border-t border-border px-5 py-3">
          <Button label="Guardar tarea" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
