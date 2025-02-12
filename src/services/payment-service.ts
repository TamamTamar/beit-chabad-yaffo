import axios from "axios";

const paymentBaseUrl = "https://www.matara.pro/nedarimplus/iframe/";

export const submitPaymentData = async (paymentData) => {
    try {
        const response = await axios.post(paymentBaseUrl, paymentData);
        return response;
    } catch (error) {
        console.error("Payment submission error:", error);
        throw error; // throwing the error so it can be caught in the form's onSubmit
    }
};