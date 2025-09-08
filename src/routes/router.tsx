import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/BeitChabadLayout";
import CreateNewParasha from "./createParasha/createNewParasha";
import EditParasha from "./editParasha/EditParasha";
import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import ShabatForm from "./BeitHabad/ShabatForm";
import AdminDonation from "./admin/AdminDonation";
import ChabadDashboard from "./admin/ChabadDashboard";
import AskRabbiPage from "./AskRabbiPage";
import BeitChabadPage from "./BeitHabad/BeitChabadPage";
import BranchesSection from "./BeitHabad/BranchesSection";
import AboutCampein from "./Campein/AboutCampein";
import CampeinPage from "./Campein/CampeinPage";
import Error from "./Error";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import Login from "./Login";
import SetDateOfBeginning from "./Campein/SetDateOfBeginning";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { index: true, element: <CampeinPage /> },
      
            {
                path: "Login",
                element: <Login />,
            },
            {
                path: "dates",
                element:(
                    <ProtectedRouteAdmin>
                        <SetDateOfBeginning />
                    </ProtectedRouteAdmin>
                ) 
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
                element: <AskRabbiPage />
            },
            {
                path: "about",
                element: <AboutCampein />,
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