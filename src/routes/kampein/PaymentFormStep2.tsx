import React from "react";

const PaymentFormStep2 = ({ iframeRef, handleBack, handlePayment }) => {
    return (
        <div className="iframe-container">
            <h2 className="payment-title">💳 תשלום</h2>
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
            ></iframe>

            <div className="button-container">
                <button className="back-button" onClick={handleBack}>⬅️ הקודם</button>
                <button className="next-button" onClick={handlePayment}>💵 בצע תשלום</button>
            </div>
        </div>
    );
};

export default PaymentFormStep2;
