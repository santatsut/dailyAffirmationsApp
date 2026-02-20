import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../../styles/theme";

export default function FourthOnboardingScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = React.useState("");

  const OPTIONS = [
    { id: "1", label: "English", language: "en" },
    { id: "2", label: "Chinese", language: "zh" },
  ];

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem("userLanguage", selectedOption);
      console.log(`Selected language: ${selectedOption}`);
      router.push("/onboardingScreens/benefitsOnboardingScreen");
    } catch (error) {
      console.error("Error saving language to AsyncStorage:", error);
    }
  };

  const toggleSelection = (language: string) => {
    if (selectedOption === language) {
      setSelectedOption("");
    } else {
      setSelectedOption(language);
    }
  };

  const renderItem = ({ item }: { item: (typeof OPTIONS)[0] }) => {
    const isSelected = selectedOption === item.language;

    return (
      <Pressable
        style={[styles.checkboxContainer, isSelected && styles.selectedBox]}
        onPress={() => toggleSelection(item.id)}
      >
        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
          {item.label}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { fontSize: fontSizes.lg, textAlign: "center", flex: 3 },
        ]}
      >
        Choose your language
      </Text>
      <Image
        style={styles.logo}
        source={require("../../assets/images/inkFlow.png")}
        alt="icon"
      />
      <View
        style={{
          flex: 2,
          width: "100%",
          maxHeight: 200,
          marginTop: spacing.lg,
        }}
      >
        {OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.checkboxContainer,
              selectedOption === option.language && styles.selectedBox,
            ]}
            onPress={() => toggleSelection(option.language)}
          >
            <Text
              style={[
                styles.label,
                selectedOption === option.language && styles.selectedLabel,
              ]}
            >
              {option.label}
            </Text>
            <View
              style={[
                styles.checkbox,
                selectedOption === option.language && styles.checkboxChecked,
              ]}
            >
              {selectedOption === option.language && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </Pressable>
        ))}
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
    alignItems: "center",
  },
  title: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    marginTop: spacing.lg * 3,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    marginBottom: 24,
    textAlign: "center",
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    bottom: 100,
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 24,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "transparent",
    maxWidth: 350,
  },
  selectedBox: {
    borderColor: colors.SoftCoral,
    backgroundColor: "rgba(217, 119, 87, 0.1)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.SoftCoral,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.SoftCoral,
  },
  checkmark: {
    color: colors.WarmCream,
    fontWeight: "bold",
    flex: 1,
  },
  label: {
    color: colors.WarmCream,
    fontSize: 18,
    flex: 1,
    textAlign: "center",
  },
  selectedLabel: {
    fontWeight: "bold",
    color: colors.SoftCoral,
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
    backgroundColor: colors.SoftCoral,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
  },
});
