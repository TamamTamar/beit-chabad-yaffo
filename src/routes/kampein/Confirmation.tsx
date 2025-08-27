import './Confirmation.scss';

interface ConfirmationProps {
    title: string;
    message: string;

}

const Confirmation = ({
    title,
    message,

}: ConfirmationProps) => {


    return (
        <div className="confirmation-container">
            <h1 className="confirmation-title">{title}</h1>
            <p className="confirmation-message">{message}</p>
        </div>
    );
};

export default Confirmation;