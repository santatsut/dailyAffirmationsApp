import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../../styles/theme";

const OPTIONS = [
  { id: "1", label: "Female" },
  { id: "2", label: "Male" },
  { id: "3", label: "Other" },
  { id: "4", label: "Prefer not to say" },
];

export default function ThirdOnboardingScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = React.useState("");

  const toggleSelection = (id: string) => {
    if (selectedOption === id) {
      // If already selected, remove it (uncheck)
      setSelectedOption("");
    } else {
      // If not selected, add it (check)
      setSelectedOption(
        OPTIONS.find((option) => option.id === id)?.label || "",
      );
    }
  };

  const handleNext = async () => {
    try {
      console.log(`Selected gender: ${selectedOption}`);
      if (selectedOption) {
        await AsyncStorage.setItem("userGender", selectedOption);
        router.push("./benefitsOnboardingScreen");
      }
    } catch (error) {
      console.error("Error saving gender to AsyncStorage:", error);
    }
  };

  const renderItem = ({ item }: { item: (typeof OPTIONS)[0] }) => {
    const isSelected = selectedOption === item.label;

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
      <Text style={styles.title}>How do you identify?</Text>
      <Text style={styles.subtitle}>Help me understand you better!</Text>
      <FlatList
        data={OPTIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: spacing.lg }}
      />
      <Pressable style={styles.button} onPress={handleNext}>
        <Text onPress={handleNext} style={styles.buttonText}>
          Next
        </Text>
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
  title: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    marginBottom: 24,
    textAlign: "center",
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 2,
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
