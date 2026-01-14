import React from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text>Diary</Text>
      <Text>Problems</Text>
      <Text>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#51b9ffff",
    width: "100%",
    marginBottom: 24,
  },
});