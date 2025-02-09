import { StyleSheet, Platform, Pressable, KeyboardAvoidingView } from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { login } from "@/api/login";
import ShopifyWebview, { SHOPIFY_STORE_URL } from "@/components/shopify";

export default function HomeScreen() {
  const { user, signOut, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = useRef<WebView>(null);

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // App側のログイン
      const res = await login({ email, password });
      setUser(res.user);

      // Shopify WebViewのログイン
      const shopifyLoginJS = `
        document.querySelector('input[name="customer[email]"]').value = '${email}';
        document.querySelector('input[name="customer[password]"]').value = '${password}';
        document.querySelector('form[id="customer_login"]').submit();
      `;
      webviewRef.current?.injectJavaScript(shopifyLoginJS);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ログイン済みの場合はプロフィール画面を表示
  if (user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.contentContainer}>
            <ThemedText type="title" style={styles.welcomeText}>
              Welcome, {user.email}!
            </ThemedText>

            <Pressable
              style={({ pressed }) => [
                styles.signOutButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={signOut}>
              <ThemedText style={styles.signOutButtonText}>
                Sign Out
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        <ShopifyWebview
          ref={webviewRef}
          uri={`${SHOPIFY_STORE_URL}/account/login`}
          style={styles.hiddenWebView}
        />
      </SafeAreaView>
    );
  }

  // 未ログインの場合はログインフォームを表示
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.contentContainer}>
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
                editable={!isLoading}
              />

              <ThemedTextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                editable={!isLoading}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}>
                <ThemedText style={styles.submitButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
      <ShopifyWebview
        ref={webviewRef}
        uri={`${SHOPIFY_STORE_URL}/account/login`}
        style={styles.hiddenWebView}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
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
  signOutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
});
