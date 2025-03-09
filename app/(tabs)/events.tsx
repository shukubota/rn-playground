import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function EventsScreen() {
  return (
    <ThemedView style={styles.container}>
      <WebView
        source={{ uri: 'https://re-katsu.jp/career/event/' }}
        style={styles.webview}
        renderLoading={() => (
          <ActivityIndicator style={styles.loading} color={Colors.light.tint} />
        )}
        startInLoadingState={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
