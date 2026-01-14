import { useRouter } from 'expo-router';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { colors, fontSizes, spacing } from '../styles/theme';

export default function FirstOnboardingScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    // 1. TouchableWithoutFeedback allows clicking outside the input to hide the keyboard
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: colors.DeepPlum }}>
        
        {/* 2. KeyboardAvoidingView slides the content up when the keyboard appears */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>I'd love to get to know you better!</Text>
            
            <TextInput               
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor="rgba(30, 20, 30, 0.4)" // Better visibility
              value={name}
              onChangeText={setName}
              autoFocus={true} // Automatically opens keyboard on mount
            />

            <Pressable 
              style={styles.buttonWrapper} 
              onPress={() => router.push('/mainScreen')}
            >
              <Text style={styles.nextButton}>Next</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: spacing.lg,
    flex: 1,
    justifyContent: 'center', // Keeps content centered vertically
    alignItems: 'center',
  },
  title: {
    color: colors.WarmCream,
    fontSize: fontSizes.lg,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    marginBottom: 24,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: colors.WarmCream,
    color: colors.DeepPlum,
    padding: spacing.md,
    borderRadius: 8,
    width: '100%',
    height: 50,
    marginBottom: spacing.lg, // Reduced this so it doesn't push the button too far
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    color: colors.WarmCream,
    fontSize: fontSizes.md,
    textAlign: 'center',
    padding: spacing.md,    
    backgroundColor: colors.SoftCoral,
    fontWeight: 'bold',
    borderRadius: 24,
    width: '100%', // Flexible width
    maxWidth: 350,
    overflow: 'hidden', // Required for borderRadius on Text components
  },
});