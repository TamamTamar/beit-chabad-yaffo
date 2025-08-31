import React, { useState } from "react";
import "./CampeinVideo.scss";
import PaymentForm from "./paymentForm/PaymentForm";

const CampeinVideo = () => {
     const [showPaymentForm, setShowPaymentForm] = useState(false);
    return (
        <div className="campein-video">
            <h2 className="campein-video-title">יחד בונים בית חב״ד יפו</h2>

            <div className="campein-video-frame">
                <video className="campein-video-video" controls poster="/images/video-thumbnail.jpg">
                    <source
                        className="campein-video-source"
                        src="video.mp4"
                        type="video/mp4"
                    />
                    <p className="campein-video-fallback">הדפדפן שלך לא תומך בנגן וידאו.</p>
                </video>
            </div>

            <div className="campein-video-button-wrapper">
                <button
                    className="campein-video-button"
                    onClick={() => setShowPaymentForm(true)}
                >
                    תרמו עכשיו
                </button>
            </div>
            {showPaymentForm && (
                <div className="overlay" onClick={() => setShowPaymentForm(false)}>
                    <div
                        className="payment-form-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={() => setShowPaymentForm(false)}
                            aria-label="סגור טופס תרומה"
                        >
                            <img src="/img/Campein/x.svg" alt="סגור חלון" />
                        </button>
                        <PaymentForm monthlyAmount={0} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampeinVideo;
