import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import ShopifyWebview, {SHOPIFY_STORE_URL} from "@/components/shopify";
import {WebView} from "react-native-webview";
import {useRef} from "react";

export default function TabTopScreen() {
  const ref = useRef<WebView>(null);
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ShopifyWebview
        uri={`${SHOPIFY_STORE_URL}/account`}
        ref={ref}
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
