import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { affirmations } from "../data/affirmations";
import { colors, fontSizes, spacing } from '../styles/theme';

const categories = ["selfLove", "motivation", "relationships", "heartbreak"] as const;

export default function MainScreen() {
  const router = useRouter();

  const [category, setCategory] = React.useState<typeof categories[number]>("selfLove");
  const [affirmation, setAffirmation] = React.useState("");

  function nextAffirmation() {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const list = affirmations[randomCategory];
    const randomAffirmation =
      list[Math.floor(Math.random() * list.length)];

    setCategory(randomCategory);
    setAffirmation(randomAffirmation);
  }

  // show one on first render
  React.useEffect(() => {
    nextAffirmation();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.navBar}>
            <Text style={styles.navComponents} onPress={() => router.push('./profileScreen')}></Text>
            <Text style={styles.navComponents}></Text>
        </View>
        <Text style={styles.affirmationText} onPress={nextAffirmation}>{affirmation}</Text>
        <View style={styles.lowerRow}>
            <Text style={styles.subText}>Swipe Up</Text>
            <Text style={styles.Heart}>🤍</Text>
            <Text style={styles.Save}>🤍</Text>
        </View>
        <View style={styles.footer}>

        </View>
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
    height: '100%',
  },
  affirmationText: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    textAlign: 'center',
    maxWidth: '75%',
  },
  lowerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '60%',
    justifyContent: 'space-around',
    top: 250,
  },
    subText: {
        width: '100%',
        color: colors.SoftCoral,
        fontSize: fontSizes.md,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    Heart: {
        fontSize: fontSizes.lg,
        textAlign: 'center',
    },
    Save: {
        fontSize: fontSizes.lg,
        textAlign: 'center',
    },
navBar: {
    flex: 1,
    marginTop: spacing.lg,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  navComponents: {
    width: 50,
    height: 50,
    backgroundColor: colors.SoftCoral,
    borderRadius: 25,
    },
});
