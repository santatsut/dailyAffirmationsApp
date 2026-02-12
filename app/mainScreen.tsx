import { chineseAffirmations } from "@/data/chineseAffirmations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { affirmations } from "../data/englishAffirmations";
import { colors, fontSizes, spacing } from "../styles/theme";

type Category = (typeof categories)[number];

type AffirmationItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

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

  const [userOptions, setUserOptions] = React.useState<UserOption[]>([]);
  const [userLanguage, setUserLanguage] = React.useState("chinese");

  const [category, setCategory] = React.useState<Category>("selfLove");
  const [affirmation, setAffirmation] = React.useState<AffirmationItem | null>(
    null,
  );

  // Step: 0 = show hanzi only, 1 = show pinyin, 2 = show meaning
  const [step, setStep] = React.useState(0);

  // Animation values
  const pinyinAnim = React.useRef(new Animated.Value(0)).current;
  const meaningAnim = React.useRef(new Animated.Value(0)).current;

  const nextAffirmation = () => {
    const isChinese = userLanguage.toLowerCase() === "chinese";

    const effectiveOptions = userOptions.length > 0 ? userOptions : ["self"];
    const randomUserOption =
      effectiveOptions[Math.floor(Math.random() * effectiveOptions.length)];
    const mappedCategory = userOptionToCategoryMap[randomUserOption];

    const list: AffirmationItem[] = isChinese
      ? chineseAffirmations[mappedCategory]
      : affirmations[mappedCategory];

    const randomItem = list[Math.floor(Math.random() * list.length)];

    setCategory(mappedCategory);
    setAffirmation(randomItem);

    // Reset step and animations
    setStep(0);
    pinyinAnim.setValue(0);
    meaningAnim.setValue(0);
  };

  React.useEffect(() => {
    const loadOptions = async () => {
      const saved = await AsyncStorage.getItem("userOptions");
      const savedLanguage = await AsyncStorage.getItem("userLanguage");
      if (savedLanguage) setUserLanguage(savedLanguage);
      if (saved) setUserOptions(JSON.parse(saved));
    };

    loadOptions();
  }, []);

  React.useEffect(() => {
    nextAffirmation();
  }, [userLanguage]);

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

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text
          style={styles.navComponents}
          onPress={() => router.push("./savedScreen")}
        >
          💭
        </Text>
        <Text style={styles.userName}>加油！</Text>
        <Text style={styles.navComponents}>⚙️</Text>
      </View>

      <Pressable style={styles.affirmationContainer} onPress={handlePress}>
        {affirmation && (
          <>
            <Text style={styles.affirmationText}>{affirmation.hanzi}</Text>

            <Animated.Text
              style={[
                styles.affirmationText,
                {
                  opacity: pinyinAnim,
                  transform: [
                    {
                      translateY: pinyinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {affirmation.pinyin}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.affirmationText,
                {
                  opacity: meaningAnim,
                  transform: [
                    {
                      translateY: meaningAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {affirmation.meaning}
            </Animated.Text>
          </>
        )}
      </Pressable>

      <View style={styles.lowerRow}>
        <Text style={styles.Save}>📜</Text>
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
  navBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg * 2,
  },
  navComponents: {
    width: 50,
    height: 50,
    fontSize: 24,
  },
  userName: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  affirmationContainer: {
    flex: 1, // takes the remaining space
    justifyContent: "center", // vertically center the text
    alignItems: "center",
    width: "100%",
  },
  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    maxWidth: "80%",
    textAlign: "center",
    lineHeight: 20, // add some spacing between lines
    height: 50, // to prevent layout shift when text appears
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
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
});
