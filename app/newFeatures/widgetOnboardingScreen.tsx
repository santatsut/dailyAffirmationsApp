import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../../styles/theme";

export default function WidgetOnboardingScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/mainScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Widget to Your Home Screen</Text>

      <View style={styles.featureBox}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 28 }}>📌</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Daily Idiom at a Glance</Text>
          <Text style={styles.subtitle}>
            See a new Chinese idiom each day without opening the app. Stay
            motivated and learn effortlessly.
          </Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DeepPlum,
    padding: spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    color: colors.WarmCream,
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: spacing.lg * 2,
  },
  featureBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: spacing.md,
    borderRadius: 16,
    marginVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.SoftCoral,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.WarmCream,
    fontSize: fontSizes.sm,
    flexWrap: "wrap",
  },
  button: {
    marginBottom: spacing.lg * 2,
    padding: spacing.md,
    backgroundColor: colors.SoftCoral,
    borderRadius: 24,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  buttonText: {
    color: colors.WarmCream,
    fontFamily: fonts.roboto,
    fontSize: 16,
    fontWeight: "600",
  },
});
