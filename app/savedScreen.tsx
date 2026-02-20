import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { AffirmationItem } from "../data/dataTypes";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

export default function SaveScreen() {
  const router = useRouter();
  const [savedAffirmations, setSavedAffirmations] = React.useState<
    AffirmationItem[]
  >([]);
  const [filtering, setFiltering] = React.useState<
    "none" | "m" | "s" | "r" | "h" | "zh" | "eng"
  >("none");

  React.useEffect(() => {
    const loadSavedAffirmations = async () => {
      try {
        const savedData = await AsyncStorage.getItem("savedAffirmations");
        if (savedData) {
          setSavedAffirmations(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading saved affirmations:", error);
      }
      console.log("Loaded saved affirmations:", savedAffirmations);
    };
    loadSavedAffirmations();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const updated = savedAffirmations.filter((item) => item.id !== id);
      setSavedAffirmations(updated); // update UI immediately
      await AsyncStorage.setItem("savedAffirmations", JSON.stringify(updated)); // persist
      console.log("Removed affirmation:", id);
    } catch (error) {
      console.error("Error removing affirmation:", error);
    }
  };

  const filteredAffirmations = savedAffirmations.filter((item) => {
    if (filtering === "none") return true;

    // Language filters
    if (filtering === "zh") return "hanzi" in item;
    if (filtering === "eng") return "text" in item;

    // Category filters (based on id prefix)
    return item.id.startsWith(filtering);
  });

  const FILTERS = [
    { id: "zh", label: "中文" },
    { id: "eng", label: "English" },
    { id: "m", label: "Motivation" },
    { id: "s", label: "Self Love" },
    { id: "r", label: "Relationships" },
    { id: "h", label: "Heartbreak" },
  ];

  const renderFilter = ({ item }: { item: { id: string; label: string } }) => {
    const active = filtering === item.id;

    return (
      <Pressable
        style={[styles.tabText, active && styles.activeTab]}
        onPress={() => setFiltering(active ? "none" : (item.id as any))}
      >
        <Text style={{ color: active ? "white" : colors.DeepPlum }}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/mainScreen")}>
          <Ionicons name="brush" size={28} color="white" />
        </Pressable>

        <Text style={styles.title}>Saved</Text>

        <Pressable onPress={() => router.push("/settingsScreen")}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </Pressable>
      </View>

      {/* Info */}
      <Text style={styles.introText}>
        Saved quotes and user information will go here.
      </Text>
      <Text style={styles.subText}>
        {savedAffirmations.length} saved affirmations
      </Text>

      {/* Filters */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderFilter}
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          marginTop: spacing.md,
          marginBottom: spacing.lg * 2,
        }}
      />

      {/* Affirmations */}
      <FlatList
        data={filteredAffirmations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
        }}
        renderItem={({ item }) => (
          <View style={styles.affirmationItem}>
            {"hanzi" in item ? (
              <>
                <Text style={styles.affirmationText}>{item.hanzi}</Text>
                <Text style={styles.affirmationText}>{item.pinyin}</Text>
                <Text style={styles.affirmationText}>{item.meaning}</Text>
              </>
            ) : (
              <Text style={styles.affirmationText}>{item.text}</Text>
            )}

            {/* Remove button */}
            <Pressable
              onPress={() => handleRemove(item.id)}
              style={styles.removeButton}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={colors.SoftCoral}
              />
            </Pressable>
          </View>
        )}
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
  tabText: {
    backgroundColor: colors.WarmCream,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    marginRight: spacing.sm,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },

  activeTab: {
    backgroundColor: colors.SoftCoral,
  },
  affirmationItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
    width: 350, // full width of parent (FlatList content)
    minWidth: 200, // caps width so it doesn’t stretch too wide on tablets
  },

  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.sm + 1,
    fontFamily: fonts.roboto,
    textAlign: "center",
    lineHeight: 22,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
