import { chineseIdioms } from "@/data/chineseIdioms";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Navbar from "../components/ui/navbar";
import { IdiomItem } from "../data/dataTypes";
import { colors, fonts, spacing } from "../styles/theme";

export default function MainScreen() {
  const [idiom, setIdiom] = React.useState<IdiomItem | null>(null);
  const [isSaved, setIsSaved] = React.useState(false);

  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const nextIdiom = React.useCallback(async () => {
    if (!chineseIdioms.length) return;

    const savedData = await AsyncStorage.getItem("savedIdioms");
    const saved: IdiomItem[] = savedData ? JSON.parse(savedData) : [];

    const savedIds = new Set(saved.map((item) => item.id));

    const unsaved = chineseIdioms.filter((item) => !savedIds.has(item.id));
    const savedOnly = chineseIdioms.filter((item) => savedIds.has(item.id));

    let pool: IdiomItem[];

    // Prefer unsaved idioms
    if (unsaved.length > 0) {
      pool =
        Math.random() < 0.8 ? unsaved : savedOnly.length ? savedOnly : unsaved;
    } else {
      pool = savedOnly;
    }

    let newItem = pool[Math.floor(Math.random() * pool.length)];

    // Avoid repeating the same idiom
    if (idiom && newItem.id === idiom.id && pool.length > 1) {
      const filtered = pool.filter((item) => item.id !== idiom.id);
      newItem = filtered[Math.floor(Math.random() * filtered.length)];
    }

    setIdiom(newItem);
  }, [idiom]);

  // for swipe detection for next Idiom
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,

        onPanResponderMove: (_, gesture) => {
          if (gesture.dy < 0) {
            translateY.setValue(gesture.dy);
          }
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy < -80) {
            Animated.parallel([
              Animated.timing(translateY, {
                toValue: -600,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(async () => {
              await nextIdiom();

              translateY.setValue(600);
              opacity.setValue(0);

              Animated.parallel([
                Animated.timing(translateY, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]).start();
            });
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [nextIdiom],
  );

  // onload it loads the first idiom immediately

  React.useEffect(() => {
    nextIdiom();
  }, [nextIdiom]);

  // on every idiom it checks if it is saved
  React.useEffect(() => {
    const checkSaved = async () => {
      if (!idiom) return;
      const savedData = await AsyncStorage.getItem("savedIdioms");
      const saved: IdiomItem[] = savedData ? JSON.parse(savedData) : [];

      setIsSaved(saved.some((item) => item.id === idiom.id));
    };
    checkSaved();
  }, [idiom]);

  //handles saving an idiom
  const handleSave = async () => {
    if (!idiom) return;

    const savedData = await AsyncStorage.getItem("savedIdioms");
    let saved: IdiomItem[] = savedData ? JSON.parse(savedData) : [];

    const exists = saved.some((item) => item.id === idiom.id);

    if (exists) {
      saved = saved.filter((item) => item.id !== idiom.id);
      setIsSaved(false);
    } else {
      saved.push(idiom);
      setIsSaved(true);
    }

    await AsyncStorage.setItem("savedIdioms", JSON.stringify(saved));
    console.log("saved idiom", JSON.stringify(saved));
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Navbar />

      <View style={styles.content}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.idiomContainer,
            { transform: [{ translateY }], opacity },
          ]}
        >
          {idiom && (
            <>
              <Text style={styles.hanzi}>{idiom.hanzi}</Text>
              <Text style={styles.pinyin}>{idiom.pinyin}</Text>
              <Text style={styles.meaning}>{idiom.meaning}</Text>
            </>
          )}
        </Animated.View>
      </View>

      <View style={styles.lowerRow} pointerEvents="box-none">
        <Text style={styles.swipeText}>Swipe Up</Text>

        <Pressable style={styles.save} onPress={handleSave} hitSlop={20}>
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
    justifyContent: "space-between",
    alignItems: "center",
  },

  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  idiomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg * 6,
  },

  hanzi: {
    fontSize: 48,
    color: colors.WarmCream,
    textAlign: "center",
    marginBottom: spacing.md,
    fontFamily: fonts.playfair,
  },

  pinyin: {
    fontSize: 20,
    color: colors.WarmCream,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontFamily: fonts.playfair,
  },

  meaning: {
    fontSize: 20,
    color: colors.WarmCream,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.playfair,
  },

  lowerRow: {
    bottom: spacing.lg * 4,
    alignItems: "center",
  },

  swipeText: {
    color: "grey",
    marginBottom: spacing.sm,
  },

  save: {
    padding: spacing.md,
  },
});
