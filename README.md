# StudyPulse: Planificador de Tareas y Sesiones de Estudio para Estudiantes

## Problema
Problema concreto: Los estudiantes de bachillerato pierden el control de sus tareas, fechas de entrega y tiempo de estudio porque usan apuntes dispersos o apps genéricas, y se les acumulan los pendientes antes de cada evaluación.
Personas beneficiarias: Estudiantes de bachillerato que deben organizar tareas de varias materias. Ellos mismos usarán la aplicación en su teléfono, de forma individual.
Evidencia inicial: Es una situación habitual entre estudiantes: las tareas se anotan en cuadernos, chats o notas sueltas y a veces se recuerda una entrega el mismo día. No incluyo estadísticas; comprobaré la utilidad de la app con pruebas con estudiantes (apartado 11).

## Solución
Descripción de la solución: Crearé una aplicación móvil con Expo y React Native (solo móvil, sin versión web) que reúna las tareas por materia con su fecha de entrega, un temporizador Pomodoro de 25/5 minutos con notificación local y un resumen semanal de tareas completadas y minutos estudiados. Todo se guardará en el dispositivo.
Funcionalidades principales: 1. Tareas por materia — Agregar, completar y borrar tareas con materia y fecha de entrega.
2. Temporizador Pomodoro — Iniciar un ciclo de 25/5 minutos y recibir una notificación local al terminar.
3. Resumen semanal — Ver las tareas completadas y los minutos estudiados en la semana.
Recorrido de uso: 1. Abre la aplicación y entra a la pantalla Tareas.
2. Agrega una tarea con su materia y fecha de entrega.
3. Va a la pantalla Pomodoro, inicia un ciclo de 25 minutos y estudia.
4. Al terminar recibe una notificación local y marca la tarea como completada.
5. Abre el Resumen y ve las tareas completadas y los minutos estudiados de la semana.
Pantallas previstas: Tareas: Ver, agregar, completar y borrar tareas por materia y fecha.
Pomodoro: Iniciar, pausar y reiniciar el temporizador de estudio y descanso.
Resumen semanal: Consultar tareas completadas y minutos estudiados en la semana.
Diferenciación: A diferencia de las apps genéricas de listas de tareas o de Pomodoro por separado, StudyPulse une ambas en un solo flujo pensado para estudiantes: tareas por materia, sesiones de estudio y resumen semanal, sin cuentas, sin internet y sin funciones que distraigan.
Comprobaciones: Cuando el usuario agrega una tarea con materia y fecha y cierra y vuelve a abrir la app, entonces la tarea debe seguir en la lista y poder marcarse como completada.
Cuando el usuario completa un ciclo Pomodoro, entonces la app debe mostrar una notificación local y sumar los minutos al resumen semanal. En una prueba con 5 estudiantes, al menos 4 deben crear una tarea e iniciar un ciclo en menos de 2 minutos sin ayuda.
Resumen: Quiero resolver la desorganización de tareas y tiempo de estudio de los estudiantes de bachillerato mediante una app móvil hecha con Expo que reúna tareas por materia, un temporizador Pomodoro y un resumen semanal. La primera versión permitirá agregar, completar y borrar tareas guardadas en el dispositivo, usar el temporizador con notificación local y ver un resumen básico, sin backend ni cuentas.
Mejora posterior: Objetivos y viabilidad: fijé la plataforma solo móvil con Expo y definí una métrica concreta (4 de 5 estudiantes crean una tarea e inician un ciclo en menos de 2 minutos), usando solo librerías con documentación oficial, para que los objetivos sean comprobables y el alcance realista.

## Objetivos
- Tareas: agregar, completar y borrar una tarea, y que los datos sigan ahí tras cerrar y reabrir Expo Go; comprobado con 5 pruebas manuales sin fallos.
- Pomodoro: que la notificación local llegue al terminar un ciclo de 25 minutos en 3 de 3 pruebas, con un margen máximo de 10 segundos.
- Resumen semanal (lunes a domingo): que las tareas completadas y los minutos estudiados coincidan 100% con un conteo manual de datos de prueba cargados en la app.
- Usabilidad: que 4 de 5 estudiantes creen una tarea e inicien un ciclo Pomodoro en menos de 2 minutos y sin ayuda, en una sola sesión de prueba.

## Habilidades
- React Native con Expo
- Componentes reutilizables
- Props tipadas
- Estado local
- Hooks (useState / custom hooks)
- Navegación entre pantallas (Expo Router)
- Estilos,
- Temas
- Diseño adaptable

## Alcance inicial
Sí incluiré en el MVP: Tres pantallas en Expo Go: lista de tareas por materia (agregar, completar y borrar, guardadas con AsyncStorage), temporizador Pomodoro funcional con notificación local y un resumen semanal básico.
No incluiré todavía: Backend, cuentas de usuario, sincronización en la nube, versión web, hardware externo, IA, pagos y servicios de terceros. Se probará solo en Expo Go.

## Restricciones
- Riesgo y plan: Programar notificaciones locales (permisos y tiempos) y calcular la semana para el resumen. Plan: leer la documentación oficial de Expo, probar primero una notificación de 10 segundos en un caso mínimo, integrarla al temporizador y guardar las fechas como texto ISO para el resumen.

---

## Cómo ejecutar

```bash
npm install
npx expo start
```

- **Celular:** escanea el QR con Expo Go (Expo SDK 58).
- **PC:** presiona `w` en la terminal o ejecuta `npm run web`.

## Dónde cambiar cada cosa (una sola línea)

| Quiero cambiar…                         | Archivo                 |
| --------------------------------------- | ----------------------- |
| Minutos de estudio / descanso           | `src/config.ts` → `POMODORO` |
| Largo máximo del título, días límite    | `src/config.ts` → `TASKS` |
| Lista de materias                       | `src/config.ts` → `SUBJECTS` |
| Atajos de fecha de entrega              | `src/config.ts` → `DUE_SHORTCUTS` |
| Nombre o icono de las pestañas          | `src/config.ts` → `TABS` (iconos: https://icons.expo.fyi) |
| Colores (modo claro y oscuro)           | `src/theme/colors.js` |
| Estilo de botones, tarjetas, campos     | `src/components/ui.tsx` |

## Estructura

```
src/
  app/            Pantallas (Expo Router): (tabs)/index = Tareas, (tabs)/pomodoro, (tabs)/summary = Resumen, new-task = Crear tarea
  components/     Componentes reutilizables (ui.tsx, TaskItem.tsx, DueDatePicker.tsx, ProgressRing.tsx)
  data/           Estado compartido de tareas y sesiones (guardado con AsyncStorage)
  hooks/          useStoredState, usePomodoro
  lib/            Fechas, almacenamiento, notificaciones y confirmaciones
  theme/          Colores y tema claro/oscuro
  config.ts       Ajustes generales
```

Estilos con NativeWind (clases de Tailwind como `bg-primary`, `text-muted`).
