import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const OPTIONS = [
    { id: "self", label: "Self-Love & Confidence" },
    { id: "motivation", label: "Motivation & Discipline" },
    { id: "peace", label: "Calm & Inner Peace" },
    { id: "focus", label: "Focus & Study" },
    { id: "relationships", label: "Love & Relationships" },
    { id: "healing", label: "Healing & Letting Go" },
    { id: "wisdom", label: "Ancient Wisdom & Philosophy" },
    { id: "learning", label: "Learn Chengyu & Culture" },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await AsyncStorage.getItem("userLanguage");
      const savedCategories = await AsyncStorage.getItem("userCategories");
      if (savedCategories) {
        setSelectedCategories(JSON.parse(savedCategories));
      }

      if (savedLang) setLanguage(savedLang);
      console.log(savedLang, savedCategories);
    };
    loadSettings();
  }, []);

  // Change language
  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem("userLanguage", lang);
    console.log("language changed to:" + lang);
  };

  const toggleCategory = async (id: string) => {
    let updated: string[];

    if (selectedCategories.includes(id)) {
      updated = selectedCategories.filter((item) => item !== id);
    } else {
      updated = [...selectedCategories, id];
    }

    setSelectedCategories(updated);
    await AsyncStorage.setItem("userCategories", JSON.stringify(updated));
    console.log(updated);
  };

  const renderCategoryItem = ({ item }: { item: (typeof OPTIONS)[0] }) => {
    const isSelected = selectedCategories.includes(item.id);

    return (
      <Pressable
        style={[styles.checkboxContainer, isSelected && styles.selectedBox]}
        onPress={() => toggleCategory(item.id)}
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
      {/* Navbar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("./mainScreen")}>
          <Ionicons name="brush" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <Pressable onPress={() => router.push("./settingsScreen")}>
          <Ionicons name="book" size={28} color="white" />
        </Pressable>
      </View>

      {/* Language Section */}
      <Text style={styles.introText}>Language</Text>

      <View style={styles.languageRow}>
        <Pressable
          style={[styles.langButton, language === "zh" && styles.activeButton]}
          onPress={() => changeLanguage("zh")}
        >
          <Text style={styles.langText}>中文</Text>
        </Pressable>
        <Pressable
          style={[styles.langButton, language === "en" && styles.activeButton]}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.langText}>English</Text>
        </Pressable>

        <Pressable style={[styles.offButton]}>
          <Text style={styles.langText}>Svenska</Text>
        </Pressable>
      </View>
      <Text style={styles.introText}>Affirmation Categories</Text>
      <FlatList
        data={OPTIONS}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 10, maxHeight: 400 }}
        showsVerticalScrollIndicator={false}
      />
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

  navBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg * 2,
    marginBottom: spacing.md,
  },

  title: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    fontWeight: "bold",
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
  languageRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  langButton: {
    backgroundColor: colors.WarmCream,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  activeButton: {
    backgroundColor: colors.SoftCoral,
  },
  offButton: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  langText: {
    fontFamily: fonts.roboto,
    fontSize: fontSizes.sm,
  },
  categoryContainer: {
    width: "100%",
    marginTop: 10,
    gap: 10,
  },

  categoryButton: {
    backgroundColor: colors.WarmCream,
    padding: spacing.sm,
    borderRadius: 12,
    width: "100%",
  },

  categoryText: {
    fontFamily: fonts.roboto,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 24,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
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
  },

  checkboxChecked: {
    backgroundColor: colors.SoftCoral,
  },

  checkmark: {
    color: colors.WarmCream,
    fontWeight: "bold",
  },

  label: {
    color: colors.WarmCream,
    fontSize: 16,
    flex: 1,
  },

  selectedLabel: {
    fontWeight: "bold",
    color: colors.SoftCoral,
  },
});
