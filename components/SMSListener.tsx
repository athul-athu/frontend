import { useEffect } from 'react';
import { Platform, NativeEventEmitter, NativeModules, PermissionsAndroid, Alert } from 'react-native';
import { parseUPITransactionSMS } from '@/utils/smsParser';
import { logger } from '@/utils/logger';

interface SMSListenerProps {
  onTransaction?: (transaction: any) => void;
}

export const SMSListener: React.FC<SMSListenerProps> = ({ onTransaction }) => {
  const requestSMSPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
      ]);

      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert(
          'Permissions Required',
          'This app needs SMS permissions to automatically track your transactions. Please enable them in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // Open app settings
                if (NativeModules.OpenSettings) {
                  NativeModules.OpenSettings.openSettings();
                }
              } 
            }
          ]
        );
      }

      return allGranted;
    } catch (error) {
      logger.error('SMS_LISTENER', 'Error requesting permissions', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  useEffect(() => {
    logger.info('SMS_LISTENER', 'Initializing SMS listener');

    if (Platform.OS === 'ios') {
      logger.debug('SMS_LISTENER', 'Running on iOS platform');
      
      // Set up notification observer for iOS
      const subscription = new NativeEventEmitter(NativeModules.SMSHelper)
        .addListener('onSMSReceived', (event) => {
          logger.debug('SMS_LISTENER', 'Received SMS notification', event);
          
          if (event.message) {
            const transaction = parseUPITransactionSMS(event.message);
            if (transaction && onTransaction) {
              logger.info('SMS_LISTENER', 'Valid transaction parsed', { transaction });
              onTransaction(transaction);
            }
          }
        });

      return () => {
        logger.info('SMS_LISTENER', 'Cleaning up iOS SMS listener');
        subscription.remove();
      };
    } else if (Platform.OS === 'android') {
      logger.debug('SMS_LISTENER', 'Running on Android platform');

      const setupAndroidListener = async () => {
        const hasPermissions = await requestSMSPermissions();
        if (!hasPermissions) {
          logger.warn('SMS_LISTENER', 'SMS permissions not granted on Android');
          return;
        }

        // Set up Android SMS broadcast receiver
        const subscription = new NativeEventEmitter(NativeModules.AndroidSMSListener)
          .addListener('onSMSReceived', (event) => {
            logger.debug('SMS_LISTENER', 'Received Android SMS', event);
            
            if (event.message) {
              const transaction = parseUPITransactionSMS(event.message);
              if (transaction && onTransaction) {
                logger.info('SMS_LISTENER', 'Valid transaction parsed on Android', { transaction });
                onTransaction(transaction);
              }
            }
          });

        return () => {
          logger.info('SMS_LISTENER', 'Cleaning up Android SMS listener');
          subscription.remove();
        };
      };

      setupAndroidListener();
    } else {
      logger.info('SMS_LISTENER', 'Platform not supported', { platform: Platform.OS });
    }
  }, [onTransaction]);

  return null;
};

// Usage example:
/*
import { SMSListener } from './components/SMSListener';
import { logger } from '../utils/logger';

function App() {
  const handleTransaction = (transaction) => {
    logger.info('APP', 'Received new transaction', { transaction });
    
    try {
      // Handle the transaction data:
      // - Save to local storage
      // - Update UI
      // - Send to server
      // etc.
    } catch (error) {
      logger.error('APP', 'Error handling transaction', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transaction
      });
    }
  };

  return (
    <>
      <SMSListener onTransaction={handleTransaction} />
      {/* Rest of your app components *//*}
    </>
  );
}
*/ 