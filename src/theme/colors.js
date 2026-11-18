// ÚNICO lugar para cambiar los colores de la app (modo claro y oscuro).
// Se usan en clases de NativeWind: bg-primary, text-muted, border-border, bg-primary-soft, etc.
// Estilo neutro: grises limpios con un solo color de acento.
const palette = {
  light: {
    background: "#FAFAFA",
    card: "#FFFFFF",
    input: "#F4F4F5",
    text: "#18181B",
    muted: "#71717A",
    subtle: "#A1A1AA",
    border: "#EBEBED",
    primary: "#18181B",
    "primary-soft": "#F4F4F5",
    "on-primary": "#FFFFFF",
    accent: "#4F6BED",
    success: "#16A34A",
    "success-soft": "#F0FDF4",
    danger: "#E5484D",
    "danger-soft": "#FEF2F2",
    rest: "#3E9B8A",
    "rest-soft": "#EEF7F5",
    track: "#EDEDEF",
  },
  dark: {
    background: "#0A0A0B",
    card: "#141416",
    input: "#1C1C1F",
    text: "#FAFAFA",
    muted: "#A1A1AA",
    subtle: "#63636B",
    border: "#242428",
    primary: "#FAFAFA",
    "primary-soft": "#1C1C1F",
    "on-primary": "#0A0A0B",
    accent: "#7C93FF",
    success: "#4ADE80",
    "success-soft": "#0F2417",
    danger: "#FF6369",
    "danger-soft": "#2A1215",
    rest: "#5EC4B0",
    "rest-soft": "#10221F",
    track: "#232326",
  },
};

module.exports = { palette, tokenNames: Object.keys(palette.light) };
