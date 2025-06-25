import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/BeitChabadLayout";
import AdminShabbat from "./admin/AdminShabbat";

import CreateNewParasha from "./createParasha/createNewParasha";
import EditParasha from "./editParasha/EditParasha";

import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import ShabatForm from "./BeitHabad/ShabatForm";

import Error from "./Error";
import Aboutkampein from "./kampein/AboutKampein";
import KampeinPage from "./kampein/KampeinPage";
import ChabadDashboard from "./admin/ChabadDashboard";
import AskRabbiPage from "./AskRabbiPage";
import AdminDonation from "./admin/AdminDonation";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import HomePage from "./BeitHabad/HomePage";
import BranchesSection from "./BeitHabad/BranchesSection";
import BeitChabadPage from "./BeitHabad/BeitChabadPage";
import UnderConstruction from "./UnderConstruction";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { index: true, element: <UnderConstruction /> },
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
                path: "admin/donation",
                element: (
                    <ProtectedRouteAdmin>
                        <AdminDonation />
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
         
                        <ChabadDashboard />
                  
                ),
            },
            {
            path: "ask-rabbi",
            element:  <AskRabbiPage />
            },
            {
                path: "about",
                element: <Aboutkampein />,
            },
            
            {
                path: "branches",
                element: <BranchesSection />,
              
            },
            
            {
                path: "beit-chabad",
                element: <BeitChabadPage />,
            },
         
        ],
    },
]);