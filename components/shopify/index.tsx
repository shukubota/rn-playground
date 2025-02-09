import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { forwardRef } from "react";

type Props = {
  uri: string;
  style?: any;
}

export const SHOPIFY_STORE_URL = 'https://bake-the-online.com';

const ShopifyWebview = forwardRef<WebView, Props>((props, ref) => {
  const { uri, style } = props;

  return (
    <WebView
      ref={ref}
      source={{ uri }}
      style={[styles.webview, style]}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
    />
  );
});

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default ShopifyWebview;
