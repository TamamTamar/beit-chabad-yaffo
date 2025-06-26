import { useNavigate } from 'react-router-dom';
import './Confirmation.scss';

const Confirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="confirmation-container">
            <h1 className="confirmation-title">תודה רבה!</h1>
            <p className="confirmation-message">
                תרומתך התקבלה בהצלחה. אנו מודים לך על תרומתך לבית חב"ד יפו.
            </p>
            <button
                className="confirmation-button"
                onClick={() => navigate('/')}
            >
                חזור לדף הבית
            </button>
        </div>
    );
};

export default Confirmation;