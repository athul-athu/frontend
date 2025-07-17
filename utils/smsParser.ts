import { logger } from './logger';

interface TransactionDetails {
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  description: string;
}

/**
 * Parses UPI transaction SMS messages to extract essential details
 */
export function parseUPITransactionSMS(message: string): TransactionDetails | null {
  console.log('\n🔍 Parsing SMS...');
  
  try {
    // Match amount and type
    const amountPattern = /(debited|credited) by (\d+\.?\d*)/i;
    const amountMatch = message.match(amountPattern);
    
    if (!amountMatch) {
      console.log('❌ No amount pattern found');
      return null;
    }

    const type = amountMatch[1].toLowerCase() === 'debited' ? 'EXPENSE' : 'INCOME';
    const amount = parseFloat(amountMatch[2]);

    // Match beneficiary
    const beneficiaryPattern = /(trf to|rcvd from) ([A-Za-z\s]+) Refno/i;
    const beneficiaryMatch = message.match(beneficiaryPattern);
    
    if (!beneficiaryMatch) {
      console.log('❌ No beneficiary pattern found');
      return null;
    }

    const description = `${type === 'EXPENSE' ? 'Payment to' : 'Received from'} ${beneficiaryMatch[2].trim()}`;

    const transaction: TransactionDetails = {
      amount,
      type,
      description
    };

    console.log('✅ Parsed transaction:', {
      amount: `₹${amount}`,
      type,
      description
    });

    return transaction;
  } catch (error) {
    console.error('❌ Parser Error:', error);
    return null;
  }
} 