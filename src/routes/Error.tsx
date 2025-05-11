import { useRouteError } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import "./Error.scss";
import { ErrorType } from "../@Types/types";


const Error = () => {
    const { data, status, statusText } = useRouteError() as ErrorType;

    return (
        <div className="error-page">
            <div className="error-container">
                <img
                    src="https://media.giphy.com/media/hEc4k5pN17GZq/giphy.gif"
                    alt="Error animation"
                    className="error-gif"
                />
                <FaExclamationCircle className="error-icon" />
                <h1>אופס!</h1>
                <h2>משהו השתבש, אבל אנחנו עובדים על זה 😊</h2>
                <p className="error-status">
                    <strong>שגיאה {status}:</strong> {statusText}
                </p>
                {data && <p className="error-data">{data}</p>}
                <a href="/" className="back-home">חזרה לדף הבית</a>
            </div>
        </div>
    );
};

export default Error;
