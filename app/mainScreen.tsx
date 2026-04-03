import { chineseIdioms } from "@/data/chineseIdioms";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { loadSession, saveSession, Session } from "../assets/Session";

import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Navbar from "../components/ui/navbar";
import { IdiomItem } from "../data/dataTypes";
import { colors, spacing } from "../styles/theme";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width - spacing.md * 2;
const CARD_HEIGHT = height * 0.65;

export default function MainScreen() {
  const [isSaved, setIsSaved] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);

  const idiom = session?.queue[session.index] || null;
  const todayCount = session?.count || 0;

  // Animations
  const hanziOpacity = React.useRef(new Animated.Value(0)).current;
  const pinyinOpacity = React.useRef(new Animated.Value(0)).current;
  const meaningOpacity = React.useRef(new Animated.Value(0)).current;

  const hanziY = React.useRef(new Animated.Value(20)).current;
  const pinyinY = React.useRef(new Animated.Value(20)).current;
  const meaningY = React.useRef(new Animated.Value(20)).current;

  const translateY = React.useRef(new Animated.Value(0)).current;

  const idleY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const init = async () => {
      const s = await loadSession(chineseIdioms);
      setSession(s);
    };
    init();
  }, []);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(idleY, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(idleY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const nextIdiom = async () => {
    if (!session) return;

    const newIndex = session.index + 1;
    if (newIndex >= session.queue.length) return;

    const updated: Session = {
      ...session,
      index: newIndex,
      count: session.count + 1,
    };

    setSession(updated);
    await saveSession(updated);
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,

        onPanResponderMove: (_, g) => {
          if (g.dy < 0) {
            translateY.setValue(g.dy);
          }
        },

        onPanResponderRelease: (_, g) => {
          if (g.dy < -80) {
            Animated.timing(translateY, {
              toValue: -height,
              duration: 180,
              useNativeDriver: true,
            }).start(() => {
              nextIdiom();

              translateY.setValue(height);

              Animated.timing(translateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
              }).start();
            });
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [session],
  );

  React.useEffect(() => {
    if (!idiom) return;

    hanziOpacity.setValue(0);
    pinyinOpacity.setValue(0);
    meaningOpacity.setValue(0);

    hanziY.setValue(20);
    pinyinY.setValue(20);
    meaningY.setValue(20);

    Animated.stagger(120, [
      Animated.timing(hanziOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(hanziY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.timing(pinyinOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pinyinY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.timing(meaningOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(meaningY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [idiom]);

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
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <Text style={styles.progress}>{todayCount} idioms today</Text>

      <View style={styles.content}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.idiomContainer,
            {
              transform: [{ translateY }, { translateY: idleY }],
            },
          ]}
        >
          {idiom && (
            <View style={styles.card}>
              <Image
                source={require("../assets/images/ink.jpg")}
                style={styles.bg}
              />

              <Animated.Text
                style={[
                  styles.hanzi,
                  {
                    opacity: hanziOpacity,
                    transform: [{ translateY: hanziY }],
                  },
                ]}
              >
                {idiom.hanzi}
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.pinyin,
                  {
                    opacity: pinyinOpacity,
                    transform: [{ translateY: pinyinY }],
                  },
                ]}
              >
                {idiom.pinyin}
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.meaning,
                  {
                    opacity: meaningOpacity,
                    transform: [{ translateY: meaningY }],
                  },
                ]}
              >
                {idiom.meaning}
              </Animated.Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={styles.lowerRow}>
        <Animated.Text style={styles.swipeText}>Swipe Up ↑</Animated.Text>

        <Pressable style={styles.bookmark} onPress={handleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={36}
            color={isSaved ? "#E6C07B" : "#9CA3AF"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.inkBlack,
    alignItems: "center",
  },

  progress: {
    color: "white",
    fontSize: 18,
    marginTop: spacing.md,
    fontStyle: "italic",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  idiomContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.08,
    borderRadius: 24,
  },

  hanzi: {
    fontSize: 64,
    color: colors.ImperialRed,
    marginVertical: spacing.lg,
  },

  pinyin: {
    fontSize: 24,
    color: colors.slate,
    fontStyle: "italic",
    textAlign: "center",
  },

  meaning: {
    fontSize: 24,
    color: colors.slate,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: spacing.md,
    marginHorizontal: spacing.lg,
  },

  lowerRow: {
    alignItems: "center",
    marginBottom: spacing.lg * 2,
  },

  swipeText: {
    color: "grey",
    marginBottom: spacing.sm,
  },

  bookmark: {
    padding: spacing.md,
  },
});
