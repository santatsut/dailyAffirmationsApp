import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../styles/theme";


export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.introText}>
                Profile Screen
            </Text>
            <Text style={styles.subText}>
                User information and settings will go here.
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.DeepPlum,
        padding: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    introText: {
        color: colors.WarmCream,
        fontSize: fontSizes.lg,
        fontFamily: fonts.playfair,
        margin: 16, 
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subText: {
        color: colors.SoftCoral,
        fontSize: fontSizes.md,
        fontFamily: fonts.roboto,
        marginBottom: 32,
        textAlign: 'center',
    },
});