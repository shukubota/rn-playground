import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function BluetoothScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [devices] = useState([
    { id: '1', name: 'iPhone Pro Max', rssi: -45 },
    { id: '2', name: 'AirPods Pro', rssi: -32 },
    { id: '3', name: 'MacBook Air', rssi: -67 },
  ]);
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Bluetooth</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statusSection}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#FF5722' }]} />
          <ThemedText type="subtitle" style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </ThemedText>
          <Pressable
            style={[styles.toggleButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => setIsConnected(!isConnected)}
          >
            <ThemedText style={styles.buttonText}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.devicesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby Devices</ThemedText>
          {devices.map((device) => (
            <View key={device.id} style={[styles.deviceItem, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}>
              <View style={styles.deviceInfo}>
                <ThemedText type="defaultSemiBold">{device.name}</ThemedText>
                <ThemedText style={styles.rssiText}>RSSI: {device.rssi} dBm</ThemedText>
              </View>
              <View style={[styles.signalStrength, { backgroundColor: device.rssi > -50 ? '#4CAF50' : device.rssi > -60 ? '#FF9800' : '#FF5722' }]} />
            </View>
          ))}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  deviceInfo: {
    flex: 1,
  },
  rssiText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  signalStrength: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});