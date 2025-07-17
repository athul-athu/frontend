import { StyleSheet, View, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Avatar, List, Portal, Modal, Button, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const KIWI_PRIMARY = '#8CB369';
const KIWI_LIGHT = '#BED8A4';
const KIWI_DARK = '#5B8E31';

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
    <View style={styles.container}>
      <LinearGradient
        colors={[KIWI_DARK, KIWI_PRIMARY, KIWI_LIGHT]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={animateAvatar}>
                <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: avatarScale }] }]}>
                  <Avatar.Text
                    size={120}
                    label={getInitials(userData?.name || 'User')}
                    style={styles.avatar}
                    labelStyle={styles.avatarLabel}
                  />
                </Animated.View>
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{userData?.name || 'User'}</Text>
                <Text style={styles.phoneNumber}>{userData?.phoneNumber || ''}</Text>
              </View>
            </View>
          </View>

          {/* Profile Options */}
          <Surface style={styles.menuContainer}>
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <List.Item
                title="Edit Profile"
                description="Update your personal information"
                left={props => <MaterialIcons name="person" size={24} color={KIWI_PRIMARY} style={styles.menuIcon} />}
                right={props => <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
                style={styles.menuItem}
                onPress={() => {}}
              />
              <List.Item
                title="Change Password"
                description="Update your security credentials"
                left={props => <MaterialIcons name="lock" size={24} color={KIWI_PRIMARY} style={styles.menuIcon} />}
                right={props => <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
                style={styles.menuItem}
                onPress={() => setChangePasswordVisible(true)}
              />
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <List.Item
                title="Notifications"
                description="Manage your alert settings"
                left={props => <MaterialIcons name="notifications" size={24} color={KIWI_PRIMARY} style={styles.menuIcon} />}
                right={props => <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
                style={styles.menuItem}
                onPress={() => {}}
              />
              <List.Item
                title="Privacy Policy"
                description="Read our terms and conditions"
                left={props => <MaterialIcons name="privacy-tip" size={24} color={KIWI_PRIMARY} style={styles.menuIcon} />}
                right={props => <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
                style={styles.menuItem}
                onPress={() => {}}
              />
            </View>

            <View style={styles.menuSection}>
              <List.Item
                title="Sign Out"
                description="Log out from your account"
                left={props => <MaterialIcons name="logout" size={24} color="#ef4444" style={styles.menuIcon} />}
                titleStyle={[styles.menuTitle, { color: '#ef4444' }]}
                descriptionStyle={styles.menuDescription}
                style={styles.menuItem}
                onPress={() => setSignOutVisible(true)}
              />
            </View>
          </Surface>
        </ScrollView>

        {/* Sign Out Modal */}
        <Portal>
          <Modal
            visible={signOutVisible}
            onDismiss={() => setSignOutVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <MaterialIcons name="logout" size={48} color="#ef4444" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalText}>Are you sure you want to sign out from your account?</Text>
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setSignOutVisible(false)}
                style={styles.modalButton}
                textColor={KIWI_PRIMARY}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSignOut}
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]}
              >
                Sign Out
              </Button>
            </View>
          </Modal>
        </Portal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    padding: 3,
  },
  avatar: {
    backgroundColor: KIWI_DARK,
  },
  avatarLabel: {
    fontSize: 48,
    color: '#ffffff',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
    marginTop: 20,
    flex: 1,
    elevation: 4,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginLeft: 16,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
  },
  menuIcon: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    color: '#4b5563',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    marginHorizontal: 8,
    minWidth: 120,
  },
}); 