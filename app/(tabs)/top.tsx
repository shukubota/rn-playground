import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import { Stack } from 'expo-router';

const SHOPIFY_STORE_URL = 'https://tm8xzz-1m.myshopify.com';
const STORE_PASSWORD = 'eullir';

export default function TabTopScreen() {
  const webViewRef = useRef<WebView | null>(null);
  const [hasInjected, setHasInjected] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebView
        ref={webViewRef}
        source={{ uri: `${SHOPIFY_STORE_URL}/password` }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        onLoadProgress={({ nativeEvent }) => {
          if (nativeEvent.progress === 1 && !hasInjected) {
            setHasInjected(true);
            setTimeout(() => {
              webViewRef.current?.injectJavaScript(`
                const passwordInput = document.querySelector('input[type="password"]');
                const submitButton = document.querySelector('button[type="submit"]');
                if (passwordInput && submitButton) {
                  passwordInput.value = '${STORE_PASSWORD}';
                  submitButton.click();
                }
                true;
              `);
            }, 500);
          }
        }}
        onNavigationStateChange={(navState) => {
          console.log('Nav State:', navState);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
