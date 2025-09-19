import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from './ThemedView';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showLogo?: boolean;
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({ title, showLogo = false, leftItem, rightItem, style }: HeaderProps) {
  return (
    <SafeAreaView style={{ backgroundColor: Colors.light.background }}>
      <ThemedView style={[styles.container, style]}>
        <View style={styles.leftContainer}>
          {leftItem}
        </View>
        {showLogo ? (
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <View style={styles.rightContainer}>
          {rightItem}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  leftContainer: {
    position: 'absolute',
    left: 16,
    justifyContent: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text,
  },
  logo: {
    width: 120,
    height: 32,
  },
});
