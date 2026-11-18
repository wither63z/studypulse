import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme, type ColorName } from "@/theme/useTheme";

type Props = {
  progress: number; // 0 a 1
  size?: number;
  stroke?: number;
  color?: ColorName;
  children?: ReactNode;
};

/** Anillo de progreso circular con contenido centrado. */
export function ProgressRing({ progress, size = 260, stroke = 12, color = "primary", children }: Props) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors[color]}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${length} ${length}`}
          strokeDashoffset={length * (1 - p)}
        />
      </Svg>
      {children}
    </View>
  );
}
