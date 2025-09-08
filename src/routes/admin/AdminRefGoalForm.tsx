// src/components/admin/AdminRefGoalForm.tsx
import { FC, useEffect, useMemo, useState } from "react";
import "./AdminRefGoalForm.scss";
import { settingsService } from "../../services/setting-service";

const toNumber = (v: string) => {
    const n = Number(v.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : NaN;
};

const AdminRefGoalForm: FC = () => {
    const [refInput, setRefInput] = useState("");

    // goal
    const [goalInput, setGoalInput] = useState("");
    const [currentGoal, setCurrentGoal] = useState<number | null>(null);
    const [savingGoal, setSavingGoal] = useState(false);

    // name
    const [nameInput, setNameInput] = useState("");
    const [currentName, setCurrentName] = useState<string>("");
    const [savingName, setSavingName] = useState(false);

    // ui
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    // דומיין ציבורי לקישור (אפשר לקנפג דרך Vite env)
    const baseUrl =
        (import.meta as any).env?.VITE_PUBLIC_SITE_URL || "https://www.chabadyafo.org";

    const refNorm = useMemo(() => refInput.trim(), [refInput]);
    const canFetch = refNorm.length > 0;

    const canSaveGoal = useMemo(() => {
        const n = toNumber(goalInput);
        return canFetch && Number.isFinite(n) && n >= 0 && !savingGoal;
    }, [goalInput, canFetch, savingGoal]);

    const canSaveName = useMemo(() => {
        return canFetch && nameInput.trim().length > 0 && !savingName;
    }, [nameInput, canFetch, savingName]);

    // מחולל קישור – תמיד מוצג (גם כשאין ref עדיין)
    const linkUrl = useMemo(
        () => `${baseUrl}/?ref=${encodeURIComponent(refNorm)}`,
        [baseUrl, refNorm]
    );

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setMsg("הועתק ✅");
        } catch {
            setErr("נכשל להעתיק ללוח");
        }
    };

    // שליפת יעד + שם ל-ref
    const fetchMeta = async () => {
        if (!canFetch) {
            setCurrentGoal(null);
            setCurrentName("");
            return;
        }
        try {
            setErr(null);
            setMsg(null);
            setLoadingMeta(true);

            const [goalRes, nameRes] = await Promise.allSettled([
                settingsService.getRefGoal(refNorm),
                settingsService.getRefName(refNorm),
            ]);

            if (goalRes.status === "fulfilled") setCurrentGoal(goalRes.value);
            else setCurrentGoal(null);

            if (nameRes.status === "fulfilled") {
                setCurrentName(nameRes.value || "");
                // ממלא את השדה לעריכה בפעם הראשונה אם אין ערך
                if (!nameInput) setNameInput(nameRes.value || "");
            } else {
                setCurrentName("");
            }
        } catch (e: any) {
            setErr(e?.response?.data?.error || e?.message || "שגיאה בטעינת נתונים");
            setCurrentGoal(null);
            setCurrentName("");
        } finally {
            setLoadingMeta(false);
        }
    };

    // שמירת יעד
    const onSaveGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSaveGoal) return;
        try {
            setErr(null);
            setMsg(null);
            setSavingGoal(true);
            const n = toNumber(goalInput);
            await settingsService.setRefGoal(refNorm, n);
            setCurrentGoal(n);
            setGoalInput("");              // ← מנקה את שדה היעד אחרי שמירה
            setMsg("היעד נשמר בהצלחה");
        } catch (e: any) {
            setErr(e?.response?.data?.error || e?.message || "שגיאה בשמירת יעד");
        } finally {
            setSavingGoal(false);
        }
    };

    // שמירת שם
    const onSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSaveName) return;
        try {
            setErr(null);
            setMsg(null);
            setSavingName(true);
            await settingsService.setRefName(refNorm, nameInput.trim());
            setCurrentName(nameInput.trim());
            setNameInput("");              // ← מנקה את שדה השם אחרי שמירה
            setMsg("השם נשמר בהצלחה");
        } catch (e: any) {
            setErr(e?.response?.data?.error || e?.message || "שגיאה בשמירת שם");
        } finally {
            setSavingName(false);
        }
    };

    // טען מטא (יעד+שם) 400ms אחרי שינוי ה-ref
    useEffect(() => {
        const id = setTimeout(fetchMeta, 400);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refNorm]);

    // העלם הודעת הצלחה אחרי 2.5 שניות
    useEffect(() => {
        if (!msg) return;
        const id = setTimeout(() => setMsg(null), 2500);
        return () => clearTimeout(id);
    }, [msg]);

    return (
        <div className="admin-ref-goal-form">
            <h3 className="title">ניהול מתרים לפי Ref</h3>

            {/* שדה ref */}
            <label className="label">
                <span>Ref</span>
                <input
                    dir="ltr"
                    placeholder="למשל: Dl"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    onBlur={fetchMeta}
                    className="input"
                />
            </label>

            {/* בלוק שם */}
            <form onSubmit={onSaveName} className="form">
                <div className="current-goal">
                    שם נוכחי: {loadingMeta ? "טוען…" : currentName ? currentName : "—"}
                </div>

                <label className="label">
                    <span>שם חדש</span>
                    <input
                        dir="rtl"
                        placeholder="לדוגמה: דני לוי"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="input"
                    />
                </label>

                <button type="submit" disabled={!canSaveName} className="btn">
                    {savingName ? "שומר…" : "שמור שם"}
                </button>
            </form>

            {/* בלוק יעד */}
            <form onSubmit={onSaveGoal} className="form">
                <div className="current-goal">
                    יעד נוכחי:{" "}
                    {loadingMeta
                        ? "טוען…"
                        : currentGoal != null
                            ? currentGoal.toLocaleString("he-IL")
                            : "—"}
                </div>

                <label className="label">
                    <span>יעד חדש (₪)</span>
                    <input
                        dir="ltr"
                        placeholder="לדוגמה: 50000"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        className="input"
                    />
                </label>

                <button type="submit" disabled={!canSaveGoal} className="btn">
                    {savingGoal ? "שומר…" : "שמור יעד"}
                </button>
            </form>

            {/* מחולל קישור – תמיד מוצג */}
            <div className="link-box">
                <div className="link-row">
                    <input className="link-input" value={linkUrl} readOnly dir="ltr" />
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => copyToClipboard(linkUrl)}
                    >
                        העתק קישור
                    </button>
                    <a className="btn" href={linkUrl} target="_blank" rel="noopener noreferrer">
                        פתח קישור
                    </a>
                </div>
                <small className="hint">
                    * שמות ויעדים נשמרים לפי ref (נרמול לאותיות קטנות), לדוגמה: <code>dl</code>
                </small>
            </div>

            {msg && <div className="msg success">{msg}</div>}
            {err && <div className="msg error">{err}</div>}
        </div>
    );
};

export default AdminRefGoalForm;
