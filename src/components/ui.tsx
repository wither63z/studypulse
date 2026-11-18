// Componentes base reutilizables. Cambia el estilo aquí y se actualiza en toda la app.
import type { ComponentProps, ReactNode } from "react";
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { haptics } from "@/lib/haptics";
import { useTheme, type ColorName } from "@/theme/useTheme";

export type IconName = ComponentProps<typeof Ionicons>["name"];

/** Icono que usa los colores del tema: <Icon name="trash-outline" color="danger" />. */
export function Icon({ name, color = "text", size = 20 }: { name: IconName; color?: ColorName; size?: number }) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={colors[color]} />;
}

/** Contenedor de pantalla: centrado y con ancho máximo para que se vea bien en PC. */
export function Screen({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="w-full max-w-2xl self-center gap-4 px-4 pb-10 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-end justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-3xl font-semibold tracking-tight text-text">{title}</Text>
            {subtitle ? <Text className="text-base text-muted">{subtitle}</Text> : null}
          </View>
          {right}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <View className={`gap-3 rounded-2xl border border-border bg-card p-4 ${className}`}>{children}</View>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-semibold text-text">{children}</Text>
      {right}
    </View>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text className="text-sm font-medium text-text">{children}</Text>;
}

export function Badge({ label, tone = "primary" }: { label: string | number; tone?: "primary" | "success" | "danger" }) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  };
  return <Text className={`overflow-hidden rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{label}</Text>;
}

const buttonVariants = {
  primary: { box: "bg-primary", text: "text-on-primary", icon: "on-primary" },
  secondary: { box: "border border-border bg-card", text: "text-text", icon: "text" },
  rest: { box: "bg-rest", text: "text-on-primary", icon: "on-primary" },
  ghost: { box: "", text: "text-muted", icon: "muted" },
} as const;

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: keyof typeof buttonVariants;
  icon?: IconName;
  disabled?: boolean;
  className?: string;
};

export function Button({ label, onPress, variant = "primary", icon, disabled, className = "" }: ButtonProps) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={() => { haptics.light(); onPress(); }}
      disabled={disabled}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-5 active:opacity-80 ${v.box} ${disabled ? "opacity-40" : ""} ${className}`}
    >
      {icon ? <Icon name={icon} color={v.icon} size={18} /> : null}
      <Text className={`text-base font-semibold ${v.text}`}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, color = "muted", disabled }: { icon: IconName; label: string; onPress: () => void; color?: ColorName; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => { haptics.tap(); onPress(); }}
      disabled={disabled}
      hitSlop={8}
      className={`h-10 w-10 items-center justify-center rounded-full active:bg-input ${disabled ? "opacity-30" : ""}`}
    >
      <Icon name={icon} color={color} />
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => { if (!selected) haptics.tap(); onPress(); }}
      className={`rounded-full border px-3.5 py-2 active:opacity-80 ${selected ? "border-text bg-text" : "border-border bg-card"}`}
    >
      <Text className={`text-sm font-medium ${selected ? "text-background" : "text-muted"}`}>{label}</Text>
    </Pressable>
  );
}

export function ChipGroup<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o.value} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)} />
      ))}
    </View>
  );
}

/** Segmentos tipo iOS (dos o tres opciones excluyentes). */
export function Segmented<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return (
    <View className="flex-row rounded-xl bg-input p-1">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => { if (!selected) haptics.tap(); onChange(o.value); }}
            className={`flex-1 items-center rounded-lg border py-2 ${selected ? "border-border bg-card" : "border-transparent"}`}
          >
            <Text className={`text-sm font-semibold ${selected ? "text-text" : "text-muted"}`}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  const { colors } = useTheme();
  return (
    <View className="gap-1.5">
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor={colors.subtle}
        className="min-h-12 rounded-xl border border-border bg-input px-4 text-base text-text focus:border-text web:outline-none"
        {...props}
      />
      {hint ? <Text className="self-end text-xs text-subtle">{hint}</Text> : null}
    </View>
  );
}

type EmptyStateProps = { icon: IconName; title: string; text?: string; action?: { label: string; onPress: () => void } };

export function EmptyState({ icon, title, text, action }: EmptyStateProps) {
  return (
    <View className="items-center gap-2 py-10">
      <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-input">
        <Icon name={icon} color="muted" size={22} />
      </View>
      <Text className="text-base font-semibold text-text">{title}</Text>
      {text ? <Text className="max-w-xs text-center text-sm text-muted">{text}</Text> : null}
      {action ? <Button label={action.label} icon="add" variant="secondary" onPress={action.onPress} className="mt-3 min-h-10" /> : null}
    </View>
  );
}

export function StatCard({ icon, value, label }: { icon: IconName; value: string | number; label: string }) {
  return (
    <Card className="min-w-24 flex-1 gap-2">
      <View className="flex-row items-center gap-1.5">
        <Icon name={icon} color="subtle" size={14} />
        <Text className="text-xs font-medium text-muted">{label}</Text>
      </View>
      <Text className="text-3xl font-semibold tracking-tight text-text">{value}</Text>
    </Card>
  );
}

/** Aviso en línea (por ejemplo, permisos de notificación denegados). */
export function Notice({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View className="flex-row items-start gap-2 rounded-xl border border-border bg-input p-3">
      <Icon name={icon} color="muted" size={18} />
      <Text className="flex-1 text-sm text-muted">{text}</Text>
    </View>
  );
}

type StepperProps = {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

/** Control − valor + para ajustar un número dentro de un rango. */
export function Stepper({ label, value, unit, min, max, step = 1, disabled, onChange }: StepperProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base text-text">{label}</Text>
      <View className={`flex-row items-center gap-1 rounded-xl bg-input px-1 ${disabled ? "opacity-50" : ""}`}>
        <IconButton icon="remove" label={`Menos ${label}`} onPress={() => onChange(value - step)} disabled={disabled || value <= min} color="text" />
        <Text className="min-w-16 text-center text-base font-medium text-text" style={{ fontVariant: ["tabular-nums"] }}>
          {value} {unit}
        </Text>
        <IconButton icon="add" label={`Más ${label}`} onPress={() => onChange(value + step)} disabled={disabled || value >= max} color="text" />
      </View>
    </View>
  );
}
