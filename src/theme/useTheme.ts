import { useColorScheme } from "react-native";
import { vars } from "nativewind";
import { palette } from "./colors";

type Colors = typeof palette.light;
export type ColorName = keyof Colors;

const toVars = (c: Colors) => vars(Object.fromEntries(Object.entries(c).map(([k, v]) => [`--${k}`, v])));
const themeVars = { light: toVars(palette.light), dark: toVars(palette.dark) };

/** Colores del tema actual (claro/oscuro según el sistema). */
export function useTheme() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return { scheme, colors: palette[scheme] as Colors, themeVars: themeVars[scheme] };
}
