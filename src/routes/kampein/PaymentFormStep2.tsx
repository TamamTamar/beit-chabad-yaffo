import React from "react";

const PaymentFormStep2 = ({ iframeRef, handleBack }) => {
    return (
        <div className="iframe-container">
            <h2 className="payment-title">תשלום</h2>
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
            ></iframe>
            <button className="back-button" onClick={handleBack}>הקודם</button>
        </div>
    );
};

export default PaymentFormStep2;