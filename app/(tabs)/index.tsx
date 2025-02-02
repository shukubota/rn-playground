import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';

const SHOPIFY_STORE_URL = 'https://bake-the-online.com';

export default function TabTopScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebView
        source={{ uri: `${SHOPIFY_STORE_URL}/account` }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
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
