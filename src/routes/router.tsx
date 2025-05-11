import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/BeitChabadLayout";
import AdminShabbat from "./admin/AdminShabbat";

import CreateNewParasha from "./createParasha/createNewParasha";
import EditParasha from "./editParasha/EditParasha";
import HomePage from "./BeitHabad/HomePage";
import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import ShabatForm from "./BeitHabad/ShabatForm";

import Error from "./Error";
import Aboutkampein from "./kampein/AboutKampein";
import KampeinPage from "./kampein/KampeinPage";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import ChabadDashboard from "./admin/ChabadDashboard";




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