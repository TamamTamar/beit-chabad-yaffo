import React from 'react';
import './WhatsAppButton.scss'; // Ensure you have the appropriate styles for the button

const WhatsAppButton = ({
    phoneNumber = '+972535248877',
    message = 'שלום, ראיתי את האתר של בית חב״ד יפו ורציתי לשאול.'
}) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


    return (
        <div className="whatsapp-button">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <img src="img/whatsapp.svg" alt="WhatsApp Icon" />
            </a>
        </div>
    );
};

export default WhatsAppButton;