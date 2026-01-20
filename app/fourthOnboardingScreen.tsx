import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from '../styles/theme';

export default function FourthOnboardingScreen() {
  const router = useRouter();


  const handleNext = () => {
        router.push('/fifthOnboardingScreen');
  };


    return (
        <View style={styles.container}>
            <Text style={[styles.title, {fontSize: fontSizes.lg, textAlign: 'center', flex: 3}]}>The benefits of daily affirmations!</Text>
            <View style={styles.reduceStressBox}>
                <View style={styles.icon}></View>
                <View>
                    <Text style={styles.title}>
                        Reduce Stress
                    </Text>
                    <Text style={styles.subtitle}>
                        Mindful moments throughout your day helps you stay grounded and manage anxiety better.
                    </Text>
                </View>
            </View>

            <View style={styles.reduceStressBox}>
                <View style={styles.icon}></View>
                <View>
                    <Text style={styles.title}>
                        Increase Positivity
                    </Text>
                    <Text style={styles.subtitle}>
                        Daily affirmations can help rewire your brain to focus on the positive aspects of life.
                    </Text>
                </View>
            </View>

            <View style={styles.reduceStressBox}>
                <View style={styles.icon}></View>
                <View>
                    <Text style={styles.title}>
                        Achieving your Goals
                    </Text>
                    <Text style={styles.subtitle}>
                        Regular and positive self-talk can enhance your self-esteem, overall confidence and performance.
                    </Text>
                </View>
            </View>

            <Pressable 
                style={styles.button} 
                onPress={handleNext}
            >
                <Text onPress={handleNext} style={styles.buttonText}>Next</Text>
            </Pressable>
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
    title: {
        color: colors.WarmCream,
        fontSize: fontSizes.md,
        marginBottom: spacing.sm,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.WarmCream,
        fontSize: fontSizes.sm,
        maxWidth: 250,
        flexWrap: 'wrap',
    },
    buttonText: {
        color: colors.WarmCream,
        fontFamily: fonts.roboto,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    button: {
        marginTop: 24,
        padding: spacing.md,
        backgroundColor: colors.SoftCoral,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
    },
    reduceStressBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.lg,
        flexDirection: 'row',
        flex: 1,
        maxWidth: 350,
    },
    icon: {
        flex: 1,
        width: 50,
        height: 50,
        backgroundColor: colors.SoftCoral,
        borderRadius: 25,
        marginRight: spacing.md,
        alignSelf: 'center',
    },
});