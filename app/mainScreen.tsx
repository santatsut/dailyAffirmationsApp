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
  const [todayCount, setTodayCount] = React.useState(0);

  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const [queue, setQueue] = React.useState<IdiomItem[]>([]);
  const [index, setIndex] = React.useState(0);

  function shuffle(array: IdiomItem[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  React.useEffect(() => {
    const initQueue = async () => {
      const savedData = await AsyncStorage.getItem("savedIdioms");
      const saved: IdiomItem[] = savedData ? JSON.parse(savedData) : [];

      const savedIds = new Set(saved.map((i) => i.id));

      // ONLY unsaved for main flow
      const unsaved = chineseIdioms.filter((i) => !savedIds.has(i.id));

      const shuffled = shuffle(unsaved);
      setQueue(shuffled);

      setIndex(0);
      setIdiom(shuffled[0]);
    };

    initQueue();
  }, []);

  const [recent, setRecent] = React.useState<string[]>([]);

  const nextIdiom = async () => {
    if (queue.length === 0) return;

    // 👇 FILTER OUT RECENTLY SHOWN
    let available = queue.filter((i) => !recent.includes(i.id));

    // 👇 fallback if everything is filtered out
    if (available.length === 0) {
      available = queue;
      setRecent([]); // reset history
    }

    // 👇 pick next (you can keep using index OR random here)
    const nextItem = available[0]; // or random if you prefer

    setIdiom(nextItem);

    // 👇 update recent history (keep last 20)
    setRecent((prev) => {
      const updated = [...prev, nextItem.id];
      return updated.length > 20 ? updated.slice(-20) : updated;
    });

    setTodayCount((prev) => {
      const newCount = prev + 1;
      AsyncStorage.setItem("todayCount", String(newCount));
      return newCount;
    });
  };
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
                toValue: -400,
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

  React.useEffect(() => {
    const loadCount = async () => {
      const stored = await AsyncStorage.getItem("todayCount");
      if (stored) setTodayCount(Number(stored));
    };

    loadCount();
  }, [nextIdiom]);

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
      <Text style={styles.progress}>{todayCount} idioms today</Text>

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
  progress: {
    color: "white",
    fontSize: 18,
    fontWeight: "light",
    fontFamily: "serif",
    marginTop: spacing.md,
    fontStyle: "italic",
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
