import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, spacing } from '../styles/theme';

export default function FifthOnboardingScreen() {
  const router = useRouter();

  // You can eventually get the actual day of the week dynamically
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = 'Wed'; // This is the day that will "light up"

  const handleNext = () => {
    router.push('/sixthOnboardingScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Build your daily affirmation habits!</Text>

      <View style={styles.streakBox}>
        <View style={styles.daysRow}>
          {days.map((day) => {
              const isActive = day === currentDay;
              return (
                  <View key={day} style={styles.dayColumn}>
                <Text style={[styles.dayText, isActive && styles.activeText]}>
                  {day}
                </Text>
                <View style={[
                    styles.circle, 
                    isActive ? styles.activeCircle : styles.inactiveCircle
                ]} />
              </View>
            );
        })}
        </View>
        <Text style={styles.streakNote}>You're on a 3-day streak!</Text>
      </View>

        <Text style={[styles.subtitleText, {fontSize: fontSizes.sm, marginTop: spacing.md}]}>Consistency is key to healing and personal growth.</Text>
      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    fontSize: fontSizes.lg,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitleText: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  streakBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: spacing.lg,
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: colors.WarmCream,
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.6,
  },
  activeText: {
    opacity: 1,
    fontWeight: 'bold',
    color: colors.SoftCoral,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  activeCircle: {
    backgroundColor: colors.SoftCoral,
    borderColor: colors.SoftCoral,
    // Add a glow effect
    shadowColor: colors.SoftCoral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  inactiveCircle: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  streakNote: {
    color: colors.WarmCream,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 40,
    padding: spacing.md,
    backgroundColor: colors.SoftCoral,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.WarmCream,
    fontWeight: 'bold',
    fontSize: 16,
  },
});