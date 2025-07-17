import { API } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
    id: number;
    user: string;
    amount: string;
    transaction_type: 'INCOME' | 'EXPENSE';
    description: string;
    category: string | null;
    date: string;
    is_recurring: boolean;
    recurring_frequency: string | null;
}

interface TransactionsResponse {
    status: 'success' | 'error';
    message: string;
    total_transactions: number;
    data: Transaction[];
}

interface CreateTransactionParams {
    amount: string | number;
    transaction_type: 'INCOME' | 'EXPENSE';
    description?: string;
}

interface APIResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
}

/**
 * Fetches all transactions from the backend
 * @returns Promise with the transactions data
 */
export async function getTransactions(): Promise<TransactionsResponse> {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(API.GET_TRANSACTIONS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        const data: TransactionsResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch transactions');
        }

        return data;
    } catch (error: any) {
        console.error('❌ Error fetching transactions:', error);
        return {
            status: 'error',
            message: error.message || 'An error occurred while fetching transactions',
            total_transactions: 0,
            data: [],
        };
    }
}

/**
 * Creates a new transaction in the backend
 * @param params Transaction parameters
 * @returns Promise with the created transaction data
 */
export async function createTransaction(params: CreateTransactionParams): Promise<APIResponse> {
    try {
        // Get the authentication token
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the API call
        const response = await fetch(API.CREATE_TRANSACTION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({
                amount: String(params.amount), // Ensure amount is sent as string
                transaction_type: params.transaction_type,
                description: params.description || '',
            }),
        });

        const data: APIResponse = await response.json();

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create transaction');
        }

        return data;
    } catch (error: any) {
        console.error('❌ Error creating transaction:', error);
        return {
            status: 'error',
            message: error.message || 'An error occurred while creating the transaction',
        };
    }
} 