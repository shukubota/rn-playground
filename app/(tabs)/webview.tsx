import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import ShopifyWebview, {SHOPIFY_STORE_URL} from "@/components/shopify";

export default function TabWebviewScreen() {
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
