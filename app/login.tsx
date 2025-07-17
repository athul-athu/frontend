import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { API } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  status: string;
  message: string;
  data?: {
    token: string;
    user_id: string;
    name: string;
    phone_number: string;
    age?: number;
    bank_account_name?: string;
    profile_img?: string | null;
  };
}

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const validateInputs = () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setError('Phone number is required');
      setSnackbarVisible(true);
      return false;
    }
    if (!password || password.trim() === '') {
      setError('Password is required');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      setLoading(true);
      setError('');

      const cleanPhoneNumber = phoneNumber.trim().replace(/[^0-9]/g, '');

      const requestBody = {
        phone_number: cleanPhoneNumber,
        password: password.trim()
      };

      console.log('Sending request:', requestBody);

      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      const data: LoginResponse = await response.json();
      console.log('Response:', data);

      // Check if the response status is success
      if (data.status === 'success') {
        // Store the token and user data
        if (data.data?.token) {
          await AsyncStorage.setItem('userToken', data.data.token);
          
          // Store user data
          await AsyncStorage.setItem('userData', JSON.stringify({
            userId: data.data.user_id,
            name: data.data.name,
            phoneNumber: data.data.phone_number,
            age: data.data.age,
            bankAccountName: data.data.bank_account_name,
            profileImg: data.data.profile_img
          }));
        }
        
        // Navigate to statistics screen on success
        router.replace('/(tabs)/statistics');
      } else {
        // Show error message from API if login was not successful
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const formattedNumber = text.replace(/[^\d\s+-]/g, '');
    setPhoneNumber(formattedNumber);
    if (error) {
      setError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.title}>Welcome Back!</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your expenses and manage your finances with ease
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          style={styles.input}
          keyboardType="phone-pad"
          mode="outlined"
          disabled={loading}
          error={!!error && error.includes('phone')}
          placeholder="Enter your phone number"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
          error={!!error && error.includes('password')}
          placeholder="Enter your password"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading || !phoneNumber || !password}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Button
          mode="text"
          onPress={() => {}}
          style={styles.forgotButton}
        >
          Forgot Password?
        </Button>
      </View>

      <View style={styles.footer}>
        <Text variant="bodyMedium" style={styles.footerText}>
          Don't have an account?
        </Text>
        <Button
          mode="text"
          onPress={() => {}}
          style={styles.signupButton}
        >
          Sign Up
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#4C9A8A',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#4C9A8A',
  },
  loginButtonContent: {
    height: 48,
  },
  forgotButton: {
    marginTop: 8,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
  },
  signupButton: {
    marginTop: 4,
  },
}); 