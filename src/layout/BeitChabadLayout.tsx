import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import ChabadHeader from "../components/header/ChabadHeader";
import NavChabad from "../routes/BeitHabad/NavBarChabad";

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen">

            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Root;
