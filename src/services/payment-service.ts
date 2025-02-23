// services/paymentService.js
export const sendPaymentDataToServer = async (paymentData) => {
    try {
        const serverResponse = await fetch("https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
        });

        if (!serverResponse.ok) throw new Error("Network response was not ok");

        const responseData = await serverResponse.json();
        return responseData;
    } catch (error) {
        throw new Error("Error sending payment data to server: " + error.message);
    }
};
