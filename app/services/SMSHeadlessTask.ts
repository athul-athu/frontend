import { AppRegistry } from 'react-native';
import { createTransaction } from '../../utils/network';

interface SMSData {
    message: string;
    from: string;
    timestamp: number;
}

interface Transaction {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    recipient: string;
    refNo: string;
    date: string;
    accountNumber: string;
}

/**
 * Parse SBI transaction SMS
 * Examples:
 * Credit: "Dear SBI User, your A/c X3752-credited by Rs.2000 on 29Jun25 transfer from RAGITHA ANILKUMAR Ref No 518010153507 -SBI"
 * Debit: "Dear UPI user A/C X3752 debited by 10.0 on date 15Jul25 trf to G MANICHANDANA Refno 519687801122"
 */
function parseTransaction(message: string): Transaction | null {
    try {
        // Extract account number
        const accountMatch = message.match(/A[/]?c\s+([X0-9]+)/i);
        const accountNumber = accountMatch ? accountMatch[1] : '';

        // Extract amount
        const amountMatch = message.match(/Rs\.?(\d+\.?\d*)|by\s+(\d+\.?\d*)/i);
        const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2]) : 0;

        // Determine transaction type
        const isDebit = message.toLowerCase().includes('debited');
        const type = isDebit ? 'EXPENSE' : 'INCOME';

        // Extract date
        const dateMatch = message.match(/on\s+(?:date\s+)?(\d{2}[A-Za-z]{3}\d{2})/i);
        const date = dateMatch ? dateMatch[1] : '';

        // Extract reference number
        const refMatch = message.match(/Ref(?:no|[\s#])\s*(\d+)/i);
        const refNo = refMatch ? refMatch[1] : '';

        // Extract recipient/sender
        let recipient = '';
        if (isDebit) {
            const toMatch = message.match(/trf to\s+([^.]+?)(?=\s+Ref|\s*$)/i);
            recipient = toMatch ? toMatch[1].trim() : '';
        } else {
            const fromMatch = message.match(/transfer from\s+([^.]+?)(?=\s+Ref|\s*$)/i);
            recipient = fromMatch ? fromMatch[1].trim() : '';
        }

      

        return {
            amount,
            type,
            recipient,
            refNo,
            date,
            accountNumber
        };
    } catch (error) {
        console.error('❌ Error parsing transaction:', error);
        return null;
    }
}

/**
 * Headless task for processing SMS messages in the background
 * This will run even when the app is not in the foreground
 */
async function smsProcessingTask(data: SMSData) {
    console.log('📱 Processing SMS in background:', data);

    try {
        const transaction = parseTransaction(data.message);
        
        if (transaction) {
            console.log('💳 Parsed transaction:', transaction);
            
            try {
                // Create transaction in the backend
                const response = await createTransaction({
                    amount: transaction.amount,
                    transaction_type: transaction.type,
                    description: transaction.recipient, // Using recipient as description
                });
                
                console.log('✅ Transaction created successfully:', response);
            } catch (error) {
                console.error('❌ Failed to create transaction:', error);
            }
        } else {
            console.warn('⚠️ Could not parse transaction from message:', data.message);
        }

    } catch (error) {
        console.error('❌ Error processing SMS:', error);
    }
}

// Register the headless task
AppRegistry.registerHeadlessTask('SmsProcessingTask', () => smsProcessingTask); 