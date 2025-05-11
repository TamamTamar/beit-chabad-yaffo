import { useRouteError } from "react-router-dom";
import { FaExclamationCircle, FaHome } from "react-icons/fa";
import "./Error.scss";

type ErrorType = {
    status: number;
    statusText: string;
    data: string;
};

const Error = () => {
    const { data, status, statusText } = useRouteError() as ErrorType;

    return (
        <div className="error-page">
            <div className="error-container">
                <img
                    src="https://media.giphy.com/media/gX3u0staej6wAnRlcP/giphy.gif"
                    alt="Funny confused animation"
                    className="error-gif"
                />
                <FaExclamationCircle className="error-icon" />
                <h1>אופס!</h1>
                <h2>משהו השתבש, אבל אנחנו כבר מטפלים בזה 😊</h2>
                <p className="error-caption">גם אנחנו לא יודעים איך הגענו לפה 😅</p>
                <p className="error-status">
                    <strong>שגיאה {status}:</strong> {statusText}
                </p>
                {data && <p className="error-data">{data}</p>}
                <a href="/" className="back-home">
                    <FaHome className="home-icon" />
                    חזרה לדף הבית
                </a>
            </div>
        </div>
    );
};

export default Error;
