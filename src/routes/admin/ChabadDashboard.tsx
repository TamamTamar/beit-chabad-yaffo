import { Tabs } from "flowbite-react";
import { FiBox, FiUsers } from "react-icons/fi";
import AdminParashot from "../admin/AdminParashot";
import AdminDonation from "./AdminDonation";
import AdminRefSummary from "./AdminRefSummary"; // ודא שהנתיב נכון
import AdminSetting from "./AdminSetting";
import AdminRefGoalForm from "./AdminRefGoalForm";

const ChabadDashboard = () => {
    return (
        <Tabs dir="rtl" aria-label="Tabs with icons" className="tabs">\
            <Tabs.Item title="שגרירים" icon={FiUsers}>
                <AdminRefGoalForm />
            </Tabs.Item>
            <Tabs.Item title="תרומות" icon={FiBox}>
                <AdminDonation />
            </Tabs.Item>
            <Tabs.Item title="מתרימים" icon={FiUsers}>
                <AdminRefSummary />
            </Tabs.Item>
            <Tabs.Item title="הגדרות" icon={FiUsers}>
                <AdminSetting />
            </Tabs.Item>

        </Tabs>
    );
};

export default ChabadDashboard;