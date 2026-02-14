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

import GestureRecognizer from "react-native-swipe-gestures";

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
  const [userLanguage, setUserLanguage] = React.useState("chinese");
  const [isSaved, setIsSaved] = React.useState(false);
  const [userStreak, setUserStreak] = React.useState(0);

  const [category, setCategory] = React.useState<Category>("selfLove");
  const [affirmation, setAffirmation] = React.useState<AffirmationItem | null>(
    null,
  );

  const [step, setStep] = React.useState(0);

  // Animation values
  const pinyinAnim = React.useRef(new Animated.Value(0)).current;
  const meaningAnim = React.useRef(new Animated.Value(0)).current;

  const [saving, setSaving] = React.useState(false);

  // for swiping
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 60,
  };

  const onSwipeUp = () => {
    console.log("swiped up");
    nextAffirmation();
  };

  const nextAffirmation = () => {
    pinyinAnim.setValue(0);
    meaningAnim.setValue(0);
    setStep(0);

    const isChinese = userLanguage.toLowerCase() === "zh";

    const effectiveOptions: UserOption[] =
      userCategories.length > 0 ? userCategories : ["self"];

    const randomUserOption =
      effectiveOptions[Math.floor(Math.random() * effectiveOptions.length)];

    const mappedCategory: Category = userOptionToCategoryMap[randomUserOption];

    const list: AffirmationItem[] = isChinese
      ? chineseAffirmations[mappedCategory]
      : affirmations[mappedCategory];

    if (!list || list.length === 0) {
      const fallback = affirmations.selfLove;
      setAffirmation(fallback[Math.floor(Math.random() * fallback.length)]);
      return;
    }

    const randomItem = list[Math.floor(Math.random() * list.length)];

    setCategory(mappedCategory);
    setAffirmation(randomItem);
  };

  React.useEffect(() => {
    try {
      AsyncStorage.setItem("hasCompletedOnboarding", "true");
      console.log("Onboarding completion status set to true");
    } catch (error) {
      console.error("Error setting onboarding completion status:", error);
    }
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
    if (loaded) nextAffirmation();
  }, [loaded, userLanguage, userCategories]);

  const handlePress = () => {
    if (step === 0) {
      setStep(1);
      Animated.timing(pinyinAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else if (step === 1) {
      setStep(2);
      Animated.timing(meaningAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else if (step === 2) {
      nextAffirmation();
    }
  };

  const animatedStyle1 = {
    opacity: pinyinAnim,
    transform: [
      {
        translateY: pinyinAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const animatedStyle2 = {
    opacity: meaningAnim,
    transform: [
      {
        translateY: meaningAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

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

      <GestureRecognizer onSwipeUp={() => onSwipeUp()} config={config}>
        <Pressable style={styles.affirmationContainer} onPress={handlePress}>
          {affirmation && (
            <>
              <Text
                style={[
                  styles.affirmationText,
                  "text" in affirmation && styles.engText,
                ]}
              >
                {"hanzi" in affirmation ? affirmation.hanzi : affirmation.text}
              </Text>

              {"pinyin" in affirmation && (
                <Animated.Text style={[styles.affirmationText, animatedStyle1]}>
                  {affirmation.pinyin}
                </Animated.Text>
              )}

              {"meaning" in affirmation && (
                <Animated.Text style={[styles.affirmationText, animatedStyle2]}>
                  {affirmation.meaning}
                </Animated.Text>
              )}
            </>
          )}
        </Pressable>
      </GestureRecognizer>
      <View style={styles.lowerRow}>
        <Pressable onPress={handleSave} style={styles.Save}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={36}
            color={colors.WarmCream}
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
    padding: spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },
  affirmationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg * 1.2,
    textAlign: "center",
    justifyContent: "center",
    bottom: spacing.lg * 3,
    lineHeight: 25, // add some spacing between lines
    height: 75, // to prevent layout shift when text appears
  },
  engText: {
    lineHeight: 40,
  },
  subText: {
    color: colors.SoftCoral,
    fontSize: fontSizes.sm,
  },
  lowerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    bottom: 150,
  },
  Save: {
    textAlign: "center",
    bottom: spacing.lg * 4,
  },
});
