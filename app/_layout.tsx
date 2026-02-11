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
          backgroundColor: colors.DeepPlum, // Sets background for all screens
        },
      }}
    >
      <Stack.Screen name="index" />

      {/* Main and Profile will show headers automatically */}
      <Stack.Screen name="mainScreen" />
      <Stack.Screen name="nameOnboardingScreen" />
      <Stack.Screen name="ageOnboardingScreen" />
      <Stack.Screen name="genderOnboardingScreen" />
      <Stack.Screen name="benefitsOnboardingScreen" />
      <Stack.Screen name="dailyOnboardingScreen" />
      <Stack.Screen name="categoriesOnboardingScreen" />
      <Stack.Screen name="widgetOnboardingScreen" />
      <Stack.Screen name="languageOnboardingScreen" />
      <Stack.Screen name="profileScreen" />
    </Stack>
  );
}
