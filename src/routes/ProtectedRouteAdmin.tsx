import { Navigate } from "react-router-dom";
import { DecodedToken, FCC } from "../@Types/types";
import { jwtDecode } from "jwt-decode";


const ProtectedRouteAdmin: FCC = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to={"/"} replace />;
    }

    const decodedToken = jwtDecode<DecodedToken>(token); // שימוש נכון ב-jwtDecode
    const admin = decodedToken.isAdmin;

    if (!admin) {
        return <Navigate to={"/"} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRouteAdmin;