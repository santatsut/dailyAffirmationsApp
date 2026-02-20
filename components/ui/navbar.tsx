import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontSizes, spacing } from "../../styles/theme";
import UpdateStreak from "../streakFunction";

export const Navbar = () => {
  const router = useRouter();
  const [userStreak, setUserStreak] = React.useState(0);

  React.useEffect(() => {
    const loadData = async () => {
      const streak = await UpdateStreak();
      setUserStreak(streak); // assuming you have a userStreak state
    };

    loadData();
  }, []);

  return (
    // Inside your NavBar component
    <View style={styles.navBar}>
      {/* Left: Saved */}
      <Pressable
        onPress={() => router.push("/savedScreen")}
        style={styles.icon}
        hitSlop={15}
      >
        <Ionicons name="book" size={28} color="white" />
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="flame-outline"
          size={20}
          color="white"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.streakText}>Days: {userStreak}</Text>
      </View>

      {/* Right: Settings */}
      <Pressable
        onPress={() => router.push("/settingsScreen")}
        style={styles.icon}
        hitSlop={15}
      >
        <Ionicons name="settings-outline" size={28} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: spacing.lg * 1.5,
    paddingHorizontal: 16,
    paddingVertical: spacing.lg,
  },
  streakText: {
    color: "white",
    fontSize: fontSizes.md,
    fontWeight: "bold",
  },
  icon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Navbar;
