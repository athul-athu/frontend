import { useEffect } from 'react';
import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { parseUPITransactionSMS } from '@/utils/smsParser';

interface TransactionDetails {
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  description: string;
}

interface SMSListenerProps {
  onTransaction?: (transaction: TransactionDetails) => void;
}

export const SMSListener: React.FC<SMSListenerProps> = ({ onTransaction }) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        console.log('📱 Setting up SMS listener...');
        
        const eventEmitter = new NativeEventEmitter(NativeModules.AndroidSMSListener);
        
        const subscription = eventEmitter.addListener('onSMSReceived', (event: { message: string }) => {
          console.log('\n📬 NEW SMS RECEIVED');
          console.log('------------------------------------------');
          
          const parsedTransaction = parseUPITransactionSMS(event.message);

          if (parsedTransaction) {
            // Print transaction details in a clean format
            console.log('\n💳 TRANSACTION DETAILS');
            console.log('------------------------------------------');
            console.log(`💰 Amount: ₹${parsedTransaction.amount}`);
            console.log(`📊 Type: ${parsedTransaction.type}`);
            console.log(`📝 Description: ${parsedTransaction.description}`);
            console.log('------------------------------------------\n');

            if (onTransaction) {
              onTransaction(parsedTransaction);
            }
          }
        });

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error('❌ Error setting up SMS listener:', error);
      }
    }
  }, [onTransaction]);

  return null;
}; 