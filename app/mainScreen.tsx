import { chineseAffirmations } from "@/data/chineseAffirmations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { affirmations } from "../data/englishAffirmations";
import { colors, fontSizes, spacing } from "../styles/theme";

type Category = (typeof categories)[number];

type AffirmationItem = {
  id: string;
  chengyu?: string;
};

const categories = [
  "selfLove",
  "motivation",
  "relationships",
  "heartbreak",
] as const;

export default function MainScreen() {
  const router = useRouter();

  const [userName, setUserName] = React.useState("Friend");
  const [userLanguage, setUserLanguage] = React.useState("chinese");

  const [category, setCategory] = React.useState<Category>("selfLove");
  const [affirmation, setAffirmation] = React.useState<AffirmationItem | null>(
    null,
  );

  function nextAffirmation() {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const isChinese = userLanguage.toLowerCase() === "chinese";

    const list: AffirmationItem[] = isChinese
      ? chineseAffirmations[randomCategory]
      : affirmations[randomCategory];

    const randomItem = list[Math.floor(Math.random() * list.length)];

    setCategory(randomCategory);
    setAffirmation(randomItem);
  }

  React.useEffect(() => {
    nextAffirmation();
  }, [userLanguage]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedName = await AsyncStorage.getItem("userName");
        const savedLanguage = await AsyncStorage.getItem("userLanguage");

        setUserName(savedName || "Friend");
        setUserLanguage(savedLanguage || "english");
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text
          style={styles.navComponents}
          onPress={() => router.push("./profileScreen")}
        />
        <Text style={styles.userName}>Welcome back, {userName}!</Text>
        <Text style={styles.navComponents} />
      </View>

      <Text style={styles.affirmationText} onPress={nextAffirmation}>
        {affirmation?.chengyu}
      </Text>

      <View style={styles.lowerRow}>
        <Text style={styles.subText}>Swipe Up</Text>
        <Text style={styles.Heart}>🤍</Text>
        <Text style={styles.Save}>🤍</Text>
      </View>

      <View style={styles.footer} />
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
    height: "100%",
  },
  userName: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    textAlign: "center",
    marginTop: spacing.md,
  },
  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    textAlign: "center",
    maxWidth: "75%",
    marginTop: spacing.lg,
    lineHeight: 40,
  },
  subText: {
    color: colors.SoftCoral,
    fontSize: fontSizes.sm,
  },
  lowerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "60%",
    justifyContent: "space-around",
    top: 250,
  },
  Heart: {
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
  Save: {
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
  navBar: {
    flex: 1,
    marginTop: spacing.lg,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  navComponents: {
    width: 50,
    height: 50,
    backgroundColor: colors.SoftCoral,
    borderRadius: 25,
  },
});
