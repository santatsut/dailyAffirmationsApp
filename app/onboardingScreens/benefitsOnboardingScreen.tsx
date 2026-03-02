import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../../styles/theme";

export default function FourthOnboardingScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboardingScreens/dailyOnboardingScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Why Learn Idioms?</Text>

      <Image
        style={styles.logo}
        source={require("../../assets/images/inkFlow.png")}
        alt="idiom icon"
      />

      <View style={styles.featureBox}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 28 }}>📖</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Learn Chinese Idioms</Text>
          <Text style={styles.subtitle}>
            Swipe through beautifully designed idiom cards with hanzi, pinyin,
            and meaning.
          </Text>
        </View>
      </View>

      <View style={styles.featureBox}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 28 }}>📌</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Save Favorites</Text>
          <Text style={styles.subtitle}>
            Bookmark idioms you love to revisit later.
          </Text>
        </View>
      </View>

      <View style={styles.featureBox}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 28 }}>🔥</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Track Your Streak</Text>
          <Text style={styles.subtitle}>
            Stay motivated by keeping a daily learning streak and see your
            progress grow.
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
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  titleText: {
    flex: 1,
    top: spacing.lg * 4,
    color: colors.WarmCream,
    fontSize: fontSizes.xl,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  featureBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: spacing.lg * 2,
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
    marginTop: spacing.lg,
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
    textAlign: "center",
  },
});
