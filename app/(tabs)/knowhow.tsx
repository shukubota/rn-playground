import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { Header } from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const HIDE_HEADER_SCRIPT = `
  document.querySelector('header')?.remove();
  true;
`;

export default function KnowhowScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header 
        title="就活ノウハウ" 
        showLogo={true}
      />
      <View style={styles.webviewContainer}>
        <WebView
          injectedJavaScript={HIDE_HEADER_SCRIPT}
          source={{ uri: 'https://re-katsu.jp/career/knowhow/' }}
          style={styles.webview}
          renderLoading={() => (
            <ActivityIndicator style={styles.loading} color={Colors.light.tint} />
          )}
          startInLoadingState={true}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});
