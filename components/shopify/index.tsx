// components/shopify.tsx
import { WebView, WebViewProps } from 'react-native-webview';
import React, { forwardRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export const SHOPIFY_STORE_URL = 'https://bake-the-online.com';

export type ShopifyWebviewProps = Omit<WebViewProps, 'source'> & {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

const ShopifyWebview = forwardRef<WebView, ShopifyWebviewProps>(({uri, style, ...props　}, ref) => {
  const defaultStyle: StyleProp<ViewStyle> = { flex: 1 };

  return (
    <WebView
      ref={ref}
      source={{ uri }}
      style={[defaultStyle, style]}
      sharedCookiesEnabled={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      {...props}
    />
  );
});

export default ShopifyWebview;
