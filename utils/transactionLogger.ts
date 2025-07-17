import { logger } from './logger';

interface TransactionDetails {
  type: 'EXPENSE' | 'INCOME' | 'UNKNOWN';
  amount: number;
  description: string;
  account: string;
  date: string;
  reference: string;
  rawMessage: string;
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  // Convert date from format "09Jul25" to "09 Jul 2025"
  const day = dateStr.slice(0, 2);
  const month = dateStr.slice(2, 5);
  const year = `20${dateStr.slice(5, 7)}`;
  return `${day} ${month} ${year}`;
};

export const printTransactionDetails = (transaction: TransactionDetails) => {
  const formattedAmount = formatAmount(transaction.amount);
  const formattedDate = formatDate(transaction.date);

  // Create a border line
  const borderLine = '='.repeat(50);
  
  // Print formatted transaction details
  console.log('\n' + borderLine);
  console.log('📱 NEW TRANSACTION DETECTED');
  console.log(borderLine);
  
  // Transaction type with emoji
  const typeEmoji = transaction.type === 'EXPENSE' ? '💸' : '💰';
  console.log(`${typeEmoji} Type:        ${transaction.type}`);
  
  // Amount with color based on type
  const amountColor = transaction.type === 'EXPENSE' ? '\x1b[31m' : '\x1b[32m';
  console.log(`💵 Amount:      ${amountColor}${formattedAmount}\x1b[0m`);
  
  // Other details
  console.log(`📝 Description: ${transaction.description}`);
  console.log(`🏦 Account:     ${transaction.account}`);
  console.log(`📅 Date:        ${formattedDate}`);
  console.log(`🔢 Reference:   ${transaction.reference}`);
  
  console.log(borderLine);
  
  // Log to file system as well
  logger.info('TRANSACTION_DETAILS', 'New transaction processed', {
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    account: transaction.account,
    date: formattedDate,
    reference: transaction.reference
  });
}; 