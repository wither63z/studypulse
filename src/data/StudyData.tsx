import { createContext, useContext, type ReactNode } from "react";
import { STORAGE_KEYS, TASKS } from "@/config";
import { useStoredState } from "@/hooks/useStoredState";
import { newId } from "@/lib/dates";
import type { StudySession, Task } from "@/types";

type NewTask = Pick<Task, "title" | "subject" | "dueDate">;

type StudyData = {
  loaded: boolean;
  tasks: Task[];
  sessions: StudySession[];
  addTask: (task: NewTask) => boolean;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  addSession: (minutes: number) => void;
};

const Ctx = createContext<StudyData | null>(null);

// Descarta datos guardados dañados o con otro formato.
const isTask = (t: any): t is Task => t && typeof t.id === "string" && typeof t.title === "string" && typeof t.dueDate === "string";
const isSession = (s: any): s is StudySession => s && typeof s.minutes === "number" && typeof s.finishedAt === "string";
const safeList = <T,>(v: unknown, check: (x: any) => x is T): T[] => (Array.isArray(v) ? v.filter(check) : []);

/** Datos compartidos por las tres pantallas, guardados en el dispositivo. */
export function StudyDataProvider({ children }: { children: ReactNode }) {
  const [rawTasks, setTasks, tasksLoaded] = useStoredState<Task[]>(STORAGE_KEYS.tasks, []);
  const [rawSessions, setSessions, sessionsLoaded] = useStoredState<StudySession[]>(STORAGE_KEYS.sessions, []);
  const tasks = safeList(rawTasks, isTask);
  const sessions = safeList(rawSessions, isSession);

  const value: StudyData = {
    loaded: tasksLoaded && sessionsLoaded,
    tasks,
    sessions,
    addTask: ({ title, subject, dueDate }) => {
      const clean = title.trim().replace(/\s+/g, " ").slice(0, TASKS.titleMaxLength);
      if (!clean || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return false;
      setTasks((l) => [...safeList(l, isTask), { id: newId(), title: clean, subject, dueDate, done: false }]);
      return true;
    },
    toggleTask: (id) =>
      setTasks(
        (l) => safeList(l, isTask).map((t) => (t.id === id ? { ...t, done: !t.done, completedAt: t.done ? undefined : new Date().toISOString() } : t)),
      ),
    deleteTask: (id) => setTasks((l) => safeList(l, isTask).filter((t) => t.id !== id)),
    clearCompleted: () => setTasks((l) => safeList(l, isTask).filter((t) => !t.done)),
    addSession: (minutes) => {
      if (minutes > 0) setSessions((list) => [...safeList(list, isSession), { id: newId(), minutes, finishedAt: new Date().toISOString() }]);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudyData(): StudyData {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudyData debe usarse dentro de StudyDataProvider");
  return ctx;
}
