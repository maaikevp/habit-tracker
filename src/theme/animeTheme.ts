import { MD3LightTheme } from "react-native-paper";

export const animePalette = {
  sky: "#eef8ff",
  cloud: "#ffffff",
  ink: "#24324a",
  inkSoft: "#5f6f8c",
  sakura: "#ff9a66",
  //   sakuraDeep: "#f05a28",
  peach: "#ffd9b8",
  mint: "#c4f2e2",
  cyan: "#7ad7f0",
  danger: "#ef5d60",
  sakuraDeep: "#d18e8f",
  success: "#4ec9a7",
};

export const animePaperTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: animePalette.sakuraDeep,
    onPrimary: "#ffffff",
    secondary: animePalette.cyan,
    background: animePalette.sky,
    surface: animePalette.cloud,
    onSurface: animePalette.ink,
    outline: "#d7e8f5",
  },
};
