import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/BeitChabadLayout";
import ChabadDashboard from "./BeitHabad/ChabadDashboard";
import CreateNewParasha from "./BeitHabad/createNewParasha";
import EditParasha from "./BeitHabad/EditParasha";
import HomePage from "./BeitHabad/HomePage";
import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import Error from "./Error";
import KampeinPage from "./kampein/KampeinPage";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import Aboutkampein from "./kampein/AboutKampein";
import ReservationForm from "./BeitHabad/ReservationForm";
import ShabbatSelector from "./BeitHabad/ShabbatSelector";
import ShabbatNew from "./BeitHabad/ShabbatNew";
import AdminShabbat from "./BeitHabad/AdminShabbat";
import ShabatForm from "./BeitHabad/ShabatForm";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "kampein",
                element: <KampeinPage />,
            },
        {
            path: "shabbat",
            element: <ShabatForm />,
        },
            {
                path: 'registration',
                element: <ShabbatSelector />,
            },
            {
                path: "admin/parasha/create",
                element: (
                    <ProtectedRouteAdmin>
                        <CreateNewParasha />
                    </ProtectedRouteAdmin>
                ),
            },
            {
                path: "admin/parasha/edit/:id",
                element: (
                    <ProtectedRouteAdmin>
                        <EditParasha />
                    </ProtectedRouteAdmin>
                ),
            },
            {
                path: "parasha/:id",
                element: <ParashaDetail />,
            },
            {
                path: "parasha",
                element: <ParashaList />,
            },
            {
                path: "admin",
                element: (
                    <ProtectedRouteAdmin>
                        <ChabadDashboard />
                    </ProtectedRouteAdmin>
                ),
            },
            {
                path: "/about",
                element: <Aboutkampein />,
            },
            {
                path: "/admin/rishum",
                element: <AdminShabbat />,
            }
           

        ],
    },
]);