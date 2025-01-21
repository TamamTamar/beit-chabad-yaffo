import { useRouteError } from "react-router-dom";
import "./Error.scss";

type ErrorType = {
    status: number;
    statusText: string;
    data: string;
};

const Error = () => {
    const { data, status, statusText } = useRouteError() as ErrorType;

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{statusText}</i>
            </p>
        </div>
    );
};

export default Error;