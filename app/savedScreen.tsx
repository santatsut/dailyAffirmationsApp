import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { IdiomItem } from "../data/dataTypes";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { LayoutAnimation } from "react-native";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width - spacing.lg * 2;
const CARD_HEIGHT = height;

export default function SaveScreen() {
  const router = useRouter();
  const [savedIdioms, setSavedIdioms] = useState<IdiomItem[]>([]);
  const sorted = [...savedIdioms].reverse();

  useFocusEffect(
    useCallback(() => {
      const loadSavedIdioms = async () => {
        const savedData = await AsyncStorage.getItem("savedIdioms");
        if (savedData) setSavedIdioms(JSON.parse(savedData));
      };

      loadSavedIdioms();
    }, []),
  );

  const handleRemove = async (id: string) => {
    LayoutAnimation.easeInEaseOut();

    const updated = savedIdioms.filter((item) => item.id !== id);
    setSavedIdioms(updated);
    await AsyncStorage.setItem("savedIdioms", JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/mainScreen")}>
          <Ionicons name="arrow-back" size={26} color={colors.WarmCream} />
        </Pressable>

        <Text style={styles.title}>Collection</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Info */}
      <View style={{ alignItems: "center" }}>
        {savedIdioms.length > 0 ? (
          <Text style={styles.introText}>Your saved idioms ✨</Text>
        ) : (
          <>
            <Text style={styles.introText}>No saved idioms yet</Text>
            <Text style={styles.subText}>
              Tap the bookmark icon to save your favorites ✨
            </Text>
          </>
        )}
      </View>

      <Text style={styles.subText}>{savedIdioms.length} saved idioms</Text>

      {/* Idioms List */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.idiomItem}>
            <Text style={styles.hanzi}>{item.hanzi}</Text>
            <Text style={styles.pinyin}>{item.pinyin}</Text>
            <Text style={styles.meaning}>{item.meaning}</Text>

            <Pressable
              onPress={() => handleRemove(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={20} color={colors.WarmCream} />
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
    backgroundColor: colors.inkBlack,
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
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    fontFamily: fonts.roboto,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  filterButton: {
    backgroundColor: colors.WarmCream,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.lg,
  },
  idiomItem: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 24,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    width: CARD_WIDTH,
    alignItems: "center",
  },

  hanzi: {
    color: colors.ImperialRed,
    fontSize: 44,
    fontFamily: fonts.playfair,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  pinyin: {
    color: colors.slate, // softer
    fontSize: fontSizes.md,
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  meaning: {
    color: colors.WarmCream,
    fontSize: fontSizes.md + 1,
    textAlign: "center",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
