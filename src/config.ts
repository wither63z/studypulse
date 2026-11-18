// Ajustes generales de la app. Cambia aquí un valor y se aplica en toda la app.

export const APP_NAME = "StudyPulse";

// Tiempos por defecto (se usan cada vez que se abre la app) y límites al ajustarlos.
export const POMODORO = {
  focusMinutes: 25,
  breakMinutes: 5,
  focus: { min: 5, max: 90, step: 5 },
  break: { min: 1, max: 30, step: 1 },
};

// Aviso al terminar el temporizador.
export const ALARM = {
  sound: true,
  vibrate: true,
  vibrationPulses: 4, // golpes de vibración en iPhone
  soundFile: require("../assets/sounds/alarm.wav"),
};

export const SUBJECTS = ["Matemáticas", "Lengua", "Inglés", "Física", "Química", "Biología", "Historia", "Otra"];

export const TASKS = {
  titleMaxLength: 80, // caracteres máximos del título
  maxDaysAhead: 365, // hasta cuántos días en el futuro se puede poner una entrega
};

export const STORAGE_KEYS = {
  tasks: "studypulse:tasks",
  sessions: "studypulse:sessions",
};

// Atajos de fecha de entrega en la pantalla Tareas (días desde hoy).
export const DUE_SHORTCUTS = [
  { label: "Hoy", days: 0 },
  { label: "Mañana", days: 1 },
  { label: "En 3 días", days: 3 },
  { label: "En 1 semana", days: 7 },
];

// Pestañas: título e icono (nombres de Ionicons: https://icons.expo.fyi).
export const TABS = {
  index: { title: "Tareas", icon: "checkbox-outline" },
  pomodoro: { title: "Pomodoro", icon: "timer-outline" },
  summary: { title: "Resumen", icon: "stats-chart-outline" },
} as const;
