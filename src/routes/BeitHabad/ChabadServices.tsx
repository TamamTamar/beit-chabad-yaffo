import ServiceCard from "./ChabadServiceCard";
import './ChabadServices.scss'

const OurServiceN = () => {
    return (
        <div className="services-section-heb">
            <div className="title">
                <h2 className="services-title">במה אנו עוסקים

                </h2>
            </div>
            <div className="cards">
                <div className="cards-container-heb">
                    <ServiceCard
                        icon="img/Front-End Development.svg"
                        title="התנדבות עם נזקקים ומבוגרים"
                        description="התנדבות בקהילה הכוללת ביקורים בבתי אבות, ביקורי בית לאנשים הזקוקים לתמיכה, ועזרה בהכנת והפצת אוכל לנזקקים."
                    />
                    <ServiceCard
                        icon="img/Product & Web Design.svg"
                        title="סעודות שבת וחג ואירועים חודשיים"
                        description="ארוחות שבת וחג חמות ומזמינות, המתקיימות מדי שבוע ואירועים חודשיים המיועדים לחיזוק תחושת הקהילה ולחגיגה משותפת."
                    />
                    <ServiceCard
                        icon="img/Back-End Development.svg"
                        title="מכירה ובדיקת מזוזות ותפילין"
                        description="שירותי מכירה ובדיקת מזוזות ותפילין להבטחת הכשרות שלהם והתקנה על פי דרישות ההלכה."
                    />
                    <ServiceCard
                        icon="img/Shopify Store Development.svg"
                        title="שיעורי תורה לגברים ושיעורי תורה לנשים"
                        description="שיעורי תורה שבועיים המותאמים לגברים ונשים, במטרה לחזק את הקשר לרוחניות וליהדות תוך העמקת הידע הדתי."
                    />
                </div>
            </div>
            <div className="button-container">
                <a href="#contactForm" className="gold-button"> אני רוצה לתרום
                    </a>
            </div>
        </div>
    );
};

export default OurServiceN;