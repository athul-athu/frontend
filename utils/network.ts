import { API } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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