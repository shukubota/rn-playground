import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';
import ShopifyWebview from "@/components/shopify";

const SHOPIFY_STORE_URL = 'https://bake-the-online.com';

export default function TabTopScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ShopifyWebview uri={`${SHOPIFY_STORE_URL}/account`} />
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
