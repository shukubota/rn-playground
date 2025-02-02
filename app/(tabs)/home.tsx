import { useState } from 'react';
import { StyleSheet, Platform, Pressable, KeyboardAvoidingView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('submit', { email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Login</ThemedText>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <ThemedTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Login</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#A1CEDC',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
