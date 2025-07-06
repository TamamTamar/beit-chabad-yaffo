import { Tabs } from "flowbite-react";
import { FiBox, FiUsers } from "react-icons/fi";
import AdminParashot from "../admin/AdminParashot";
import AdminDonation from "./AdminDonation";
import AdminRefSummary from "./AdminRefSummary"; // ודא שהנתיב נכון

const ChabadDashboard = () => {
    return (
        <Tabs dir="rtl" aria-label="Tabs with icons" className="tabs">
            <Tabs.Item active title="נתוני פרשות" icon={FiBox}>
                <AdminParashot />
            </Tabs.Item>
            <Tabs.Item title="תרומות" icon={FiBox}>
                <AdminDonation />
            </Tabs.Item>
            <Tabs.Item title="מתרימים" icon={FiUsers}>
                <AdminRefSummary />
            </Tabs.Item>
        </Tabs>
    );
};

export default ChabadDashboard;