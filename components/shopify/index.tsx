import {WebView} from "react-native-webview";
import {StyleSheet} from "react-native";

type Props = {
  uri: string;
}

export default function ShopifyWebview(props: Props) {
  return (
    <WebView
      source={{ uri: props.uri }}
      style={styles.webview}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});