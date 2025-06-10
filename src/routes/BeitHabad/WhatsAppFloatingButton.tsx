
const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://wa.me/9725XXXXXXXX"
      className="whatsapp-button"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
      }}
      aria-label="צור קשר בוואטסאפ"
    >
      📱
    </a>
  );
};

export default WhatsAppFloatingButton;
