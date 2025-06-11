import axios from 'axios';

const baseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/payment";

export const paymentService = {
    sendPaymentDataToServer: async (paymentData) => {
        try {
            const response = await axios.post(
                `${baseUrl}/nedarim`,
                paymentData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error("Error sending payment data to server: " + error.message);
        }
    },

    saveTransactionToServer: async (data) => {
        try {
            const response = await axios.post(
                `${baseUrl}/save`,
                data,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log('Transaction saved successfully');
            return response.data;
        } catch (error) {
            console.error('Error saving transaction:', error);
            throw new Error('Failed to save transaction: ' + error.message);
        }
    },
};