// app/SettingsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

export default function SettingsScreen() {
  const router = useRouter();

  const showPrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "We do not collect personal data. All your progress is saved locally on your device. Notifications are used only for daily idiom reminders.",
    );
  };

  const showTerms = () => {
    Alert.alert(
      "Terms of Service",
      "By using Daily Idiom, you agree to use the app for personal, non-commercial purposes. All idioms are for educational and entertainment purposes only.",
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.replace("/mainScreen")}>
          <Ionicons name="arrow-back" size={26} color={colors.WarmCream} />
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <Text style={styles.appName}>Daily Idiom</Text>

        <Text style={styles.description}>
          Discover one meaningful Chinese idiom each day to inspire reflection,
          growth, and mindfulness.
        </Text>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <Text style={styles.sectionTitle}>Legal</Text>
      <View style={styles.card}>
        <SettingsItem label="Privacy Policy" onPress={showPrivacyPolicy} />
        <Divider />
        <SettingsItem label="Terms of Service" onPress={showTerms} />
              <Divider />
        <SettingsItem
          label="Contact Support"
          onPress={() => Linking.openURL("mailto:support@yourapp.com")}
          />

          </View>

    </View>
  );
}

function SettingsItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.optionRow, pressed && { opacity: 0.6 }]} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.SoftCoral} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DeepPlum,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg * 2,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg * 2,
  },
  title: { color: colors.WarmCream, fontSize: fontSizes.md, fontWeight: "600" },
  sectionTitle: {
    color: colors.SoftCoral,
    fontSize: fontSizes.sm,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  version: {
    color: colors.SoftCoral,
    fontSize: fontSizes.sm,
  },
  appName: { color: colors.WarmCream, fontSize: fontSizes.lg, fontFamily: fonts.playfair, marginBottom: spacing.sm },
  description: { color: colors.WarmCream, fontSize: fontSizes.sm, opacity: 0.8, lineHeight: 20 },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.md },
  optionText: { color: colors.WarmCream, fontSize: fontSizes.md },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
});