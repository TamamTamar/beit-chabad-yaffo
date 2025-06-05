import { Tabs } from "flowbite-react";
import { FiBox } from "react-icons/fi";
import AdminParashot from "../admin/AdminParashot";
import AdminDonation from "./AdminDonation";

const ChabadDashboard = () => {
    return (
        <Tabs dir="rtl" aria-label="Tabs with icons" className="tabs">
            <Tabs.Item active title="נתוני פרשות" icon={FiBox}>
                <AdminParashot />
            </Tabs.Item>
            <Tabs.Item title="תרומות" icon={FiBox}>
             <AdminDonation />
            </Tabs.Item>
        </Tabs>
    );
};

export default ChabadDashboard;
