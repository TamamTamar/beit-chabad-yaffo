import { createBrowserRouter } from "react-router-dom";
import BeitChabadLayout from "../layout/BeitChabadLayout";
import ChabadDashboard from "./BeitHabad/ChabadDashboard";
import CreateNewParasha from "./BeitHabad/createNewParasha";
import EditParasha from "./BeitHabad/EditParasha";
import HomePage from "./BeitHabad/HomePage";
import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import Error from "./Error";
import Root from "../layout/BeitChabadLayout";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import KampeinPage from "./kampein/KampeinPage";



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
           

        ],
    },
]);