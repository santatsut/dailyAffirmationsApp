import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AffirmationItem } from "../data/dataTypes";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

export default function ProfileScreen() {
  const [savedAffirmations, setSavedAffirmations] = React.useState<
    AffirmationItem[]
  >([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>
        Saved quotes and user information will go here.
      </Text>
      <Text style={styles.subText}>
        {savedAffirmations.length} saved affirmations
      </Text>
      {savedAffirmations.map((item) => (
        <View key={item.id} style={styles.affirmationItem}>
          <Text style={styles.affirmationText}>{item.hanzi}</Text>
          <Text style={styles.affirmationText}>{item.pinyin}</Text>
          <Text style={styles.affirmationText}>{item.meaning}</Text>
        </View>
      ))}
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
  affirmationItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
    width: "100%",
    maxWidth: 350,
  },
  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.sm,
    fontFamily: fonts.roboto,
    textAlign: "center",
  },
});
