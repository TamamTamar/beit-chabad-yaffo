import { useContext, useEffect, useState } from "react";
import { settingsService } from "../../services/setting-service";
import { AuthContext } from "../../contexts/AuthContext";

const toDatetimeLocalValue = (date: Date) => {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}:${p(
        date.getSeconds()
    )}`;
};

const SetDateOfBeginning = () => {
    const auth = useContext(AuthContext);
    const token = auth?.token ?? localStorage.getItem("token"); // fallback אם אין קונטקסט
    const [dateInput, setDateInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [serverMeta, setServerMeta] = useState<{ updatedBy?: string; updatedAt?: Date }>({});

    useEffect(() => {
        if (!token) {
            setMessage("צריך להתחבר (אין טוקן).");
            return;
        }
        (async () => {
            try {
                const d = await settingsService.getSettings();
                setDateInput(toDatetimeLocalValue(d));
                setMessage("");
            } catch (e: any) {
                console.error(e?.response?.data || e);
                setMessage(e?.response?.data?.message || "שגיאה בטעינת התאריך מהשרת");
            }
        })();
    }, [token]);

    const handleSave = async () => {
        if (!token) return setMessage("צריך להתחבר (אין טוקן).");
        if (!dateInput) return setMessage("נא לבחור תאריך");

        setSaving(true);
        setMessage("");
        try {
            const res = await settingsService.postSettings(new Date(dateInput));
            setMessage("התאריך נשמר בהצלחה!");
            setServerMeta({ updatedBy: res.updatedBy, updatedAt: res.updatedAt });
            setDateInput(toDatetimeLocalValue(res.value));
        } catch (err: any) {
            console.error(err?.response?.data || err);
            const status = err?.response?.status;
            if (status === 403) setMessage("אין הרשאה (Admins only).");
            else if (status === 400) setMessage(err?.response?.data?.message || "בקשה לא תקינה (בדקי את התאריך).");
            else if (status === 401) setMessage("Token לא תקין / פג.");
            else setMessage("שגיאה בשמירה");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ direction: "rtl", maxWidth: 520 }}>
            <h2>הגדרת תאריך התחלה לתרומות</h2>

            <label htmlFor="donationsStart"><b>תאריך התחלה</b></label>
            <input
                id="donationsStart"
                type="datetime-local"
                step={1}
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={{ display: "block", margin: "8px 0 12px", padding: "6px 8px" }}
            />

            <button onClick={handleSave} disabled={saving || !token} style={{ padding: "6px 12px" }}>
                {saving ? "שומר…" : "שמירה"}
            </button>

            {message && <div style={{ marginTop: 10, color: message.includes("בהצלחה") ? "green" : "crimson" }}>{message}</div>}

            {(serverMeta.updatedAt || serverMeta.updatedBy) && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                    {serverMeta.updatedAt && <>עודכן לאחרונה: {serverMeta.updatedAt.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</>}
                    {serverMeta.updatedBy && <> · ע״י משתמש: {serverMeta.updatedBy}</>}
                </div>
            )}
        </div>
    );
};

export default SetDateOfBeginning;
