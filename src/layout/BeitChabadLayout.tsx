import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ChabadHeader from "../routes/BeitHabad/ChabadHeader";
import NavChabad from "../routes/BeitHabad/NavBarChabad";

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen">
{/*         <ChabadHeader/>
 */}      \
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Root;
