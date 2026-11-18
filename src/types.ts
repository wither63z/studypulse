export type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  done: boolean;
  completedAt?: string; // ISO
};

export type StudySession = {
  id: string;
  minutes: number;
  finishedAt: string; // ISO
};
