import { StyleSheet, Platform, Pressable, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { login } from "@/api/login";
import { SHOPIFY_STORE_URL } from "@/components/shopify";

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
  const [cookies, setCookies] = useState<CookieMap>({});
  const webviewRef = useRef<WebView>(null);

  const getCookiesJS = `
    (function() {
      try {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [name, ...values] = cookie.trim().split('=');
          const value = values.join('=');
          
          if (name) {
            acc[name] = {
              name,
              value: decodeURIComponent(value),
              domain: window.location.hostname,
              path: '/',
              secure: window.location.protocol === 'https:'
            };
          }
          return acc;
        }, {});
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'cookies',
          data: cookies
        }));
      } catch (error) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    })();
    true;
  `;

  const fetchCookies = useCallback(() => {
    webviewRef.current?.injectJavaScript(getCookiesJS);
  }, []);

  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as WebViewMessage;

      if (message.type === 'cookies' && message.data) {
        setCookies(message.data);
      } else if (message.type === 'error') {
        console.error('Cookie fetch error:', message.message);
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  }, []);

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      setUser(res.user);

      const shopifyLoginJS = `
        document.querySelector('input[name="customer[email]"]').value = '${email}';
        document.querySelector('input[name="customer[password]"]').value = '${password}';
        document.querySelector('form[id="customer_login"]').submit();
      `;
      webviewRef.current?.injectJavaScript(shopifyLoginJS);

      setTimeout(fetchCookies, 2000);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.container}>
              <ThemedView style={styles.contentContainer}>
                <ThemedText type="title" style={styles.welcomeText}>
                  Welcome, {user.email}!
                </ThemedText>

                <ThemedView style={styles.cookieContainer}>
                  <ThemedText style={styles.cookieTitle}>Current Cookies:</ThemedText>
                  {Object.entries(cookies).map(([name, cookie]) => (
                    <ThemedView key={name} style={styles.cookieItem}>
                      <ThemedText style={styles.cookieName}>{name}</ThemedText>
                      <ThemedText>Value: {cookie.value}</ThemedText>
                      <ThemedText style={styles.cookieDetails}>
                        Domain: {cookie.domain}
                        {'\n'}Path: {cookie.path}
                        {'\n'}Secure: {cookie.secure ? 'Yes' : 'No'}
                      </ThemedText>
                    </ThemedView>
                  ))}
                  {Object.keys(cookies).length === 0 && (
                    <ThemedText style={styles.noCookies}>
                      No cookies found
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView style={styles.buttonContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.button,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={fetchCookies}>
                    <ThemedText style={styles.buttonText}>
                      Refresh Cookies
                    </ThemedText>
                  </Pressable>

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
            </ThemedView>
          </ScrollView>
          <WebView
            ref={webviewRef}
            source={{ uri: `${SHOPIFY_STORE_URL}/account/login` }}
            style={styles.hiddenWebView}
            onMessage={handleWebViewMessage}
            scrollEnabled={true}
            sharedCookiesEnabled={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
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
      <WebView
        ref={webviewRef}
        source={{ uri: `${SHOPIFY_STORE_URL}/account/login` }}
        style={styles.hiddenWebView}
        onMessage={handleWebViewMessage}
        scrollEnabled={true}
        sharedCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // タブバーの高さ分の余白を追加
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
    justifyContent: 'flex-start', // centerからflex-startに変更
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
    opacity: 0,
    zIndex: -1,
  },
  cookieContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  cookieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cookieItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cookieName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cookieDetails: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  noCookies: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
