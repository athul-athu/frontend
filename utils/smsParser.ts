import { logger } from './logger';

interface TransactionDetails {
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  description: string;
  date: string;
  referenceNumber: string;
  account: string;
  beneficiary?: string;
}

/**
 * Parses UPI transaction SMS messages to extract transaction details
 * @param message The SMS message content
 * @returns Parsed transaction details or null if message format doesn't match
 */
export function parseUPITransactionSMS(message: string): TransactionDetails | null {
  logger.debug('SMS_PARSER', 'Starting to parse SMS message', { message });

  // Match SBI UPI debit message pattern
  const debitPattern = /Dear UPI user A\/C [X\d]+(\d{4}) debited by (\d+\.?\d*) on date (\d{2}[A-Za-z]{3}\d{2}) trf to ([A-Za-z\s]+) Refno (\d+)/i;
  
  // Match SBI UPI credit message pattern
  const creditPattern = /Dear UPI user A\/C [X\d]+(\d{4}) credited by (\d+\.?\d*) on date (\d{2}[A-Za-z]{3}\d{2}) rcvd from ([A-Za-z\s]+) Refno (\d+)/i;

  let match = message.match(debitPattern);
  let type: 'EXPENSE' | 'INCOME' = 'EXPENSE';

  if (!match) {
    logger.debug('SMS_PARSER', 'Message did not match debit pattern, trying credit pattern');
    match = message.match(creditPattern);
    type = 'INCOME';
  }

  if (!match) {
    logger.warn('SMS_PARSER', 'Message format not recognized', { message });
    return null;
  }

  try {
    const [, accountLast4, amount, date, beneficiary, refNo] = match;
    
    logger.debug('SMS_PARSER', 'Successfully extracted message components', {
      accountLast4,
      amount,
      date,
      beneficiary,
      refNo
    });

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      logger.error('SMS_PARSER', 'Failed to parse amount', { amount });
      return null;
    }

    const formattedDate = formatDate(date);
    if (!formattedDate) {
      logger.error('SMS_PARSER', 'Failed to parse date', { date });
      return null;
    }

    const transaction: TransactionDetails = {
      amount: parsedAmount,
      type,
      description: `${type === 'EXPENSE' ? 'Payment to' : 'Received from'} ${beneficiary}`,
      date: formattedDate,
      referenceNumber: refNo,
      account: `XXXX${accountLast4}`,
      beneficiary
    };

    logger.info('SMS_PARSER', 'Successfully parsed transaction details', transaction);
    return transaction;

  } catch (error) {
    logger.error('SMS_PARSER', 'Error parsing message components', {
      error: error instanceof Error ? error.message : 'Unknown error',
      message
    });
    return null;
  }
}

/**
 * Formats date from SMS format (09Jul25) to ISO string (2025-07-09)
 */
function formatDate(dateStr: string): string | null {
  logger.debug('SMS_PARSER', 'Formatting date', { dateStr });

  try {
    const months: { [key: string]: string } = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };

    const day = dateStr.slice(0, 2);
    const monthStr = dateStr.slice(2, 5).toLowerCase();
    const month = months[monthStr];
    
    if (!month) {
      logger.error('SMS_PARSER', 'Invalid month in date string', { monthStr });
      return null;
    }

    const year = `20${dateStr.slice(5, 7)}`;
    const formattedDate = `${year}-${month}-${day}`;

    logger.debug('SMS_PARSER', 'Date formatted successfully', {
      input: dateStr,
      output: formattedDate
    });

    return formattedDate;
  } catch (error) {
    logger.error('SMS_PARSER', 'Error formatting date', {
      error: error instanceof Error ? error.message : 'Unknown error',
      dateStr
    });
    return null;
  }
} 