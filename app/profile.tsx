import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, IconButton, Avatar, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        {userData?.profileImg ? (
          <Avatar.Image
            source={{ uri: userData.profileImg }}
            size={100}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            label={(userData?.name?.substring(0, 2) || 'U').toUpperCase()}
            size={100}
            style={styles.avatar}
          />
        )}
        <Text variant="headlineSmall" style={styles.name}>
          {userData?.name || 'User'}
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>Phone Number</Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {userData?.phoneNumber || 'Not set'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>Age</Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {userData?.age || 'Not set'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>Bank Account</Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {userData?.bankAccountName || 'Not set'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>User ID</Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {userData?.userId || 'Not set'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.menuSection}>
        <Button
          icon="shield-check"
          mode="outlined"
          onPress={() => {}}
          style={styles.menuButton}
        >
          Security Settings
        </Button>

        <Button
          icon="bank"
          mode="outlined"
          onPress={() => {}}
          style={styles.menuButton}
        >
          Bank Details
        </Button>

        <Button
          icon="logout"
          mode="contained"
          onPress={handleLogout}
          style={[styles.menuButton, styles.logoutButton]}
          textColor="#fff"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    backgroundColor: '#4C9A8A',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    margin: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    color: '#666',
    flex: 1,
  },
  infoValue: {
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  menuSection: {
    padding: 16,
  },
  menuButton: {
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#FF5C5C',
    marginTop: 24,
  },
}); 