import { AppRegistry } from 'react-native';

interface SMSData {
    message: string;
    from: string;
    timestamp: number;
}

/**
 * Headless task for processing SMS messages in the background
 * This will run even when the app is not in the foreground
 */
async function smsProcessingTask(data: SMSData) {
    console.log('📱 Processing SMS in background:', data);

    try {
        // Extract transaction details
        const message = data.message;
        
        // Basic UPI transaction parsing
        const amount = message.match(/(?:debited|credited) by (\d+\.?\d*)/i)?.[1];
        const date = message.match(/date (\d{2}\w{3}\d{2})/i)?.[1];
        const refNo = message.match(/Refno (\d+)/i)?.[1];
        const recipient = message.match(/trf to ([^.]+)/i)?.[1];
        const type = message.toLowerCase().includes('debited') ? 'debit' : 'credit';

        const transaction = {
            amount: amount ? parseFloat(amount) : null,
            date,
            refNo,
            recipient,
            type,
            rawMessage: message,
            timestamp: data.timestamp,
            sender: data.from
        };

        console.log('💳 Parsed transaction:', transaction);

        // TODO: Store the transaction in your database or state management system
        // You can use AsyncStorage, a local database, or make an API call here
        
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Error processing SMS:', error);
        return Promise.reject(error);
    }
}

// Register the headless task
AppRegistry.registerHeadlessTask('SmsProcessingTask', () => smsProcessingTask); 