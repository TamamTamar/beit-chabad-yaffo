import axios from "axios";

const paymentBaseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim";

export const submitPaymentData = async (paymentData: any) => {
    try {
        const response = await axios.post(paymentBaseUrl, paymentData);
        return response;
    } catch (error) {
        console.error("Error during API request:", error);
        throw error;
    }
};