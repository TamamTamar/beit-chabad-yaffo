import React from "react";
import { Link } from "react-router-dom";
import "./ThankYouPage.scss";

const ThankYouPage: React.FC = () => {
    return (
        <div className="thank-you-page" dir="rtl">
            <div className="thank-you-card">
                <h1>תודה רבה!</h1>
                <p>תרומתך התקבלה בהצלחה 🙏</p>
                <p>שנה טובה ומתוקה 🍎🍯</p>
                <Link to="/caparot" className="home-link">
                    חזרה לדף הבית
                </Link>
            </div>
        </div>
    );
};

export default ThankYouPage;
