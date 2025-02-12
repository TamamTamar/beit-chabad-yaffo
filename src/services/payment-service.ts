import axios from "axios";

const paymentBaseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim";

export const submitPaymentData = async (paymentData) => {
    try {
        const response = await axios.post(paymentBaseUrl, paymentData);
        return response.data;
    } catch (error) {
        throw new Error('Payment submission failed: ' + error.message);
    }
};