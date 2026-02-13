import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

export default function Home() {
  const router = useRouter();
  const [setupProcessed, setSetupProcessed] = React.useState(false);

  const handleOnboardingStart = () => {
    if (setupProcessed) {
      router.push("./mainScreen");
    } else {
      router.push("./onboardingScreen/languageOnboardingScreen");
    }
  };

  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        "hasCompletedOnboarding",
      );
      if (hasCompletedOnboarding === "true") {
        setSetupProcessed(true);
      }
    };
    checkOnboardingStatus();
  }, []);

  React.useEffect(() => {
    if (setupProcessed) {
      router.push("./mainScreen");
    }
  }, [setupProcessed, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>Daily Affirmations</Text>
      <Text style={styles.subText}>This is the first step to healing!</Text>

      {/* Modern way to navigate to /main */}
      <Pressable style={styles.button} onPress={handleOnboardingStart}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DeepPlum,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  introText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    fontFamily: fonts.playfair,
    margin: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  subText: {
    color: colors.SoftCoral,
    fontSize: fontSizes.md,
    fontFamily: fonts.roboto,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonText: {
    color: colors.WarmCream,
    fontFamily: fonts.roboto,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    marginTop: 24,
    padding: spacing.md,
    borderRadius: 24,
    width: 250,
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: colors.WarmTerracotta,
    color: colors.WarmCream,
    fontFamily: fonts.roboto,
    fontSize: 16,
    boxShadow: "0 8px 24px rgba(217, 119, 87, 0.4)",
  },
});
