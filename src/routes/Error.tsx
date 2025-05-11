import { useRouteError } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./Error.scss";
import { ErrorType } from "../@Types/types";



const Error = () => {
    const { data, status, statusText } = useRouteError() as ErrorType;

    return (
        <div className="error-page">
            <div className="error-content">
                <img
                    src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
                    alt="Funny error"
                    className="error-gif"
                />
                <FaExclamationTriangle className="error-icon" />
                <h1>!אופס</h1>
                <h2>משהו השתבש</h2>
                <p className="error-status">שגיאה {status}: {statusText}</p>
                {data && <p className="error-data">{data}</p>}
                <a href="/" className="back-home">חזרה לדף הבית</a>
            </div>
        </div>
    );
};

export default Error;
