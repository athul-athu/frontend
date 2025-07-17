import { StyleSheet, View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, Portal, Modal, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const avatarScale = useRef(new Animated.Value(1)).current;
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
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

  const animateAvatar = () => {
    Animated.sequence([
      Animated.spring(avatarScale, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0];
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setSignOutVisible(false);
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBg}>
        <View style={styles.headerCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={animateAvatar}
            style={{ alignItems: 'center' }}
          >
            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
              {userData?.profileImg ? (
                <Avatar.Image
                  size={110}
                  source={{ uri: userData.profileImg }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={110}
                  label={getInitials(userData?.name || '')}
                  style={styles.avatar}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
          <Text variant="headlineSmall" style={[styles.name,{color:'#4C9A8A'}]}>{userData?.name || 'User'}</Text>
         
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={22} color="#4C9A8A" style={styles.infoIcon} />
            <Text style={styles.infoText}>{userData?.phoneNumber || 'No phone'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Settings</Text>
        <List.Item
          title="Change Password"
          left={() => <MaterialIcons name="security" size={24} color="#4C9A8A" />}
          right={() => <MaterialIcons name="chevron-right" size={24} color="#666" />}
          style={styles.menuItem}
          onPress={() => setChangePasswordVisible(true)}
        />
        <List.Item
          title="Help & Support"
          left={() => <MaterialIcons name="help" size={24} color="#4C9A8A" />}
          right={() => <MaterialIcons name="chevron-right" size={24} color="#666" />}
          style={styles.menuItem}
          onPress={() => {}}
        />
        <List.Item
          title="About"
          left={() => <MaterialIcons name="info" size={24} color="#4C9A8A" />}
          right={() => <MaterialIcons name="chevron-right" size={24} color="#666" />}
          style={styles.menuItem}
          onPress={() => {}}
        />
      </View>
      <List.Item
        title="Sign Out"
        left={() => <MaterialIcons name="logout" size={24} color="#FF5C5C" />}
        style={[styles.menuItem, styles.signOutButton]}
        titleStyle={styles.signOutText}
        onPress={() => setSignOutVisible(true)}
      />

      <Portal>
        <Modal
          visible={signOutVisible}
          onDismiss={() => setSignOutVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>Are you sure you want to sign out?</Text>
          <Button mode="contained" onPress={() => setSignOutVisible(false)} style={styles.modalButton}>
            Cancel
          </Button>
          <Button mode="outlined" onPress={handleSignOut} style={styles.modalButton} textColor="#FF5C5C">
            Sign Out
          </Button>
        </Modal>
        <Modal
          visible={changePasswordVisible}
          onDismiss={() => setChangePasswordVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>Change Password</Text>
          <Text variant="bodyLarge">Password change functionality coming soon.</Text>
          <Button mode="contained" onPress={() => setChangePasswordVisible(false)} style={styles.modalButton}>
            Close
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f5f5f5',
  },
  headerBg: {
    backgroundColor: '#4C9A8A',
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerCard: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    backgroundColor: '#4C9A8A',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F8F7',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  menuItem: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  signOutButton: {
    marginTop: 24,
  },
  signOutText: {
    color: '#FF5C5C',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 12,
    width: 180,
  },
}); 