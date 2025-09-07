import { useEffect, useMemo, useState } from "react";

import "./AdminSetting.scss";
import { settingsService } from "../../services/setting-service";

type SavingState = "idle" | "saving";
type LoadState = "idle" | "loading" | "loaded" | "error";

function toDatetimeLocalValue(date: Date): string {
    // ממיר Date לפורמט שמקובל ב-<input type="datetime-local">
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

function fromDatetimeLocalValue(v: string): Date | null {
    // מחרוזת כמו 2025-07-01T00:00:00 -> Date (לפי אזור מקומי)
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}

export default function AdminSetting() {
    const [loadState, setLoadState] = useState<LoadState>("idle");
    const [saving, setSaving] = useState<SavingState>("idle");
    const [serverDate, setServerDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState<string>(""); // datetime-local

    const canSave = useMemo(() => !!fromDatetimeLocalValue(inputValue), [inputValue]);

    useEffect(() => {
        const run = async () => {
            setLoadState("loading");
            try {
                const d = await settingsService.getDonationsStart();
                setServerDate(d);
                setInputValue(toDatetimeLocalValue(d));
                setLoadState("loaded");
            } catch (err) {
                console.error("Failed to fetch donations start date", err);
                setLoadState("error");
            }
        };
        run();
    }, []);

    const handleSetToday = () => {
        const now = new Date();
        setInputValue(toDatetimeLocalValue(now));
    };

    const handleResetEpoch = () => {
        if (!confirm("לאפס את תאריך ההתחלה ל־1970-01-01?")) return;
        const epoch = new Date("1970-01-01T00:00:00");
        setInputValue(toDatetimeLocalValue(epoch));
    };

    const handleSave = async () => {
        if (!canSave || saving === "saving") return;
        const d = fromDatetimeLocalValue(inputValue);
        if (!d) return;
        setSaving("saving");
        try {
            const res = await settingsService.postSettings(d);
            setServerDate(res.value);
            // מנתקף לערך שנשמר (עם העיגול של השרת אם יש)
            setInputValue(toDatetimeLocalValue(res.value));
        } catch (err: any) {
            // 403 בדרך כלל אומר שאין הרשאת אדמין
            if (err?.response?.status === 403) alert("אין הרשאה (Admin בלבד).");
            else alert("שגיאה בשמירה. בדקי לוגים/קונסול.");
            console.error("Failed to save donations start date", err);
        } finally {
            setSaving("idle");
        }
    };

    return (
        <section className="admin-setting">
            <header className="admin-setting__header">
                <h2>הגדרות תרומות – תאריך התחלה</h2>
                <p className="admin-setting__subtitle">
                    תאריך זה קובע מאיזה זמן נספרות תרומות בדוחות/גרפים.
                </p>
            </header>

            {loadState === "loading" && <div className="admin-setting__loading">טוען…</div>}
            {loadState === "error" && (
                <div className="admin-setting__error">שגיאה בטעינה. רענני את הדף או בדקי הרשאות.</div>
            )}

            {loadState === "loaded" && (
                <div className="admin-setting__body">
                    <div className="admin-setting__row">
                        <label htmlFor="donationsStart" className="admin-setting__label">
                            תאריך התחלה
                        </label>
                        <input
                            id="donationsStart"
                            className="admin-setting__input"
                            type="datetime-local"
                            step={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className="admin-setting__actions">
                        <button className="btn" type="button" onClick={handleSetToday}>
                            קבע ל־היום
                        </button>
                        <button className="btn btn--muted" type="button" onClick={handleResetEpoch}>
                            איפוס ל־1970
                        </button>
                        <button
                            className="btn btn--primary"
                            type="button"
                            onClick={handleSave}
                            disabled={!canSave || saving === "saving"}
                        >
                            {saving === "saving" ? "שומר…" : "שמירה"}
                        </button>
                    </div>

                    <div className="admin-setting__meta">
                        <div>
                            <span className="meta__label">תאריך שנשמר בשרת:</span>{" "}
                            <span className="meta__value">
                                {serverDate ? serverDate.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }) : "—"}
                            </span>
                        </div>
                        <small className="meta__hint">
                            טיפ: אם קיבלת 403 – ודאי שהחשבון מחובר עם Token של אדמין.
                        </small>
                    </div>
                </div>
            )}
        </section>
    );
}
