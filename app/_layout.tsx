import { Stack } from "expo-router";
import { colors, fonts } from "../styles/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // This applies your theme colors to the header of every screen
        headerShown: false,

        headerStyle: {
          backgroundColor: colors.DeepPlum,
        },
        headerTintColor: colors.WarmCream,
        headerTitleStyle: {
          fontFamily: fonts.playfair,
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: colors.DeepPlum,
        },
      }}
    ></Stack>
  );
}
