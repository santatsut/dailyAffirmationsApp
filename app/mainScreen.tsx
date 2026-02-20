import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, spacing } from "../styles/theme";

import { chineseAffirmations } from "@/data/chineseAffirmations";
import { AffirmationItem, Category } from "../data/dataTypes";
import { affirmations } from "../data/englishAffirmations";

import Navbar from "../components/ui/navbar";

import { PanResponder } from "react-native";

type UserOption =
  | "self"
  | "motivation"
  | "peace"
  | "focus"
  | "relationships"
  | "healing"
  | "wisdom"
  | "learning";

const userOptionToCategoryMap: Record<UserOption, Category> = {
  self: "selfLove",
  motivation: "motivation",
  peace: "heartbreak",
  focus: "motivation",
  relationships: "relationships",
  healing: "heartbreak",
  wisdom: "selfLove",
  learning: "motivation",
};

const categories = [
  "selfLove",
  "motivation",
  "relationships",
  "heartbreak",
] as const;

export default function MainScreen() {
  const router = useRouter();
  const [loaded, setLoaded] = React.useState(false);

  const [userCategories, setuserCategories] = React.useState<UserOption[]>([]);
  const [userLanguage, setUserLanguage] = React.useState<string | null>(null);
  const [isSaved, setIsSaved] = React.useState(false);
  const [userStreak, setUserStreak] = React.useState(0);

  const [category, setCategory] = React.useState<Category>("selfLove");
  const [affirmation, setAffirmation] = React.useState<AffirmationItem | null>(
    null,
  );

  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const nextAffirmation = React.useCallback(() => {
    const isChinese = userLanguage === "zh";
    const effectiveOptions =
      userCategories.length > 0 ? userCategories : ["self"];
    const randomUserOption =
      effectiveOptions[Math.floor(Math.random() * effectiveOptions.length)];
    const mappedCategory = userOptionToCategoryMap[randomUserOption];
    const list = isChinese
      ? chineseAffirmations[mappedCategory]
      : affirmations[mappedCategory];

    if (!list || list.length === 0) return;

    let newItem = list[Math.floor(Math.random() * list.length)];
    while (affirmation && newItem.id === affirmation.id) {
      newItem = list[Math.floor(Math.random() * list.length)];
    }

    setAffirmation(newItem);
  }, [userLanguage, userCategories, affirmation]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 5,

        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            translateY.setValue(gestureState.dy);
          }
        },

        onPanResponderRelease: (_, gestureState) => {
          const { dy } = gestureState;

          if (dy < -120) {
            // Animate swipe up
            Animated.parallel([
              Animated.timing(translateY, {
                toValue: -600,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0, // fade out
                duration: 400,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // After swipe up finishes
              nextAffirmation();

              // Reset position and opacity for new affirmation
              translateY.setValue(700); // start below screen
              opacity.setValue(0); // invisible

              // Animate new affirmation in
              Animated.parallel([
                Animated.timing(translateY, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 1, // fade in
                  duration: 750,
                  useNativeDriver: true,
                }),
              ]).start();
            });
          }
        },
      }),
    [nextAffirmation],
  );

  React.useEffect(() => {
    const setOnboarding = async () => {
      const alreadySet = await AsyncStorage.getItem("hasCompletedOnboarding");
      if (alreadySet === "true") return; // skip if already set

      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      console.log("Onboarding completion status set to true");
    };

    setOnboarding();
  }, []);

  React.useEffect(() => {
    const checkIfSaved = async () => {
      if (!affirmation) return;
      const savedData = await AsyncStorage.getItem("savedAffirmations");
      const saved: AffirmationItem[] = savedData ? JSON.parse(savedData) : [];
      setIsSaved(saved.some((item) => item.id === affirmation.id));
    };

    checkIfSaved();
  }, [affirmation]);

  React.useEffect(() => {
    const loadOptions = async () => {
      const saved = await AsyncStorage.getItem("userCategories");
      const savedLanguage = await AsyncStorage.getItem("userLanguage");

      if (savedLanguage) setUserLanguage(savedLanguage);
      if (saved) setuserCategories(JSON.parse(saved));

      setLoaded(true);
    };

    loadOptions();
  }, []);

  React.useEffect(() => {
    if (loaded && userLanguage) {
      nextAffirmation();
    }
  }, [loaded, userLanguage, userCategories]);

  const handleSave = async () => {
    if (!affirmation) return;

    try {
      // Load existing saved affirmations
      const savedData = await AsyncStorage.getItem("savedAffirmations");
      let saved: AffirmationItem[] = savedData ? JSON.parse(savedData) : [];

      const exists = saved.some((item) => item.id === affirmation.id);

      if (exists) {
        // REMOVE bookmark
        saved = saved.filter((item) => item.id !== affirmation.id);
        setIsSaved(false);
        console.log("Affirmation removed from saved:", affirmation.id);
      } else {
        // ADD bookmark
        saved.push(affirmation);
        setIsSaved(true);
        console.log("Affirmation saved:", affirmation.id);
      }

      await AsyncStorage.setItem("savedAffirmations", JSON.stringify(saved));
    } catch (error) {
      console.error("Error updating saved affirmations:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.affirmationContainer,
            {
              transform: [{ translateY }],
              opacity: opacity,
            },
          ]}
        >
          {affirmation && (
            <View>
              <Text
                style={[
                  styles.affirmationText,
                  "text" in affirmation && styles.engText,
                ]}
              >
                {"hanzi" in affirmation ? affirmation.hanzi : affirmation.text}
              </Text>
              <Text style={styles.affirmationText}>{affirmation.pinyin}</Text>
              <Text style={styles.affirmationText}>{affirmation.meaning}</Text>
            </View>
          )}
        </Animated.View>
      </View>
      <View style={styles.lowerRow}>
        <Text style={{ fontSize: fontSizes.sm, color: "grey" }}>Swipe Up</Text>
        <Pressable style={styles.Save} onPress={handleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={36}
            color={colors.WarmCream}
            hitSlop={10}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DeepPlum,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  affirmationContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    flex: 1,
    zIndex: 1000,
    paddingBottom: spacing.lg * 6,
  },

  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg * 1.2,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    lineHeight: 28,
    fontFamily: "serif",
  },

  engText: {
    lineHeight: 40,
  },
  lowerRow: {
    position: "absolute",
    bottom: spacing.lg * 6,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  Save: {
    padding: spacing.md,
  },
});
