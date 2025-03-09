import { StyleSheet, Platform, Pressable, KeyboardAvoidingView, View } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { login } from "@/api/login";
import ShopifyWebview, { SHOPIFY_STORE_URL } from "@/components/shopify";

interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
}

interface CookieMap {
  [key: string]: Cookie;
}

interface WebViewMessage {
  type: 'cookies' | 'error';
  data?: CookieMap;
  message?: string;
}

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
      const res = await login({ email, password });
      setUser(res.user);

      const shopifyLoginJS = `
      // 要素の存在確認
      const emailInput = document.querySelector('#customer\\\\[email\\\\]');
      const passwordInput = document.querySelector('#customer\\\\[password\\\\]');
      const loginForm = document.querySelector('form[name="login"]');
      
      console.log('Debug Elements:', {
        emailInput: emailInput ? 'Found' : 'Not Found',
        passwordInput: passwordInput ? 'Found' : 'Not Found',
        loginForm: loginForm ? 'Found' : 'Not Found'
      });

      if (emailInput && passwordInput && loginForm) {
        emailInput.value = '${email}';
        passwordInput.value = '${password}';
        
        // 値が正しく設定されたか確認
        console.log('Input Values:', {
          email: emailInput.value,
          password: passwordInput.value
        });

        // フォーム送信前の状態確認
        console.log('Form State:', {
          formAction: loginForm.action,
          formMethod: loginForm.method,
          formValid: loginForm.checkValidity()
        });

        loginForm.submit();
        
        // フォーム送信後の確認
        setTimeout(() => {
          console.log('After Submit:', {
            url: window.location.href,
            cookie: document.cookie
          });
        }, 1000);
      }

      true; // WebViewのinjectJavaScriptには戻り値が必要
    `;

      // WebViewにメッセージハンドラを追加
      const onMessage = (event: any) => {
        console.log('WebView Message:', event.nativeEvent.data);
      };

      webviewRef.current?.injectJavaScript(shopifyLoginJS);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
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
          <ShopifyWebview
            ref={webviewRef}
            uri={`${SHOPIFY_STORE_URL}/account/login`}
            style={styles.hiddenWebView}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event: WebViewMessageEvent) => {
              console.log('WebView Message:', event.nativeEvent.data);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

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
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event: WebViewMessageEvent) => {
          console.log('WebView Message:', event.nativeEvent.data);
        }}
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
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
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
    // width: 0,
    // height: 0,
    // position: 'absolute',
    // opacity: 0,
    // zIndex: -1,
  },
});
