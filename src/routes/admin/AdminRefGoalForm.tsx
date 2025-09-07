import { FC, useEffect, useMemo, useState } from "react";
import "./AdminRefGoalForm.scss";
import { settingsService } from "../../services/setting-service";

const toNumber = (v: string) => {
    const n = Number(v.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : NaN;
};

const AdminRefGoalForm: FC = () => {
    const [refInput, setRefInput] = useState("");
    const [goalInput, setGoalInput] = useState("");
    const [currentGoal, setCurrentGoal] = useState<number | null>(null);
    const [loadingGoal, setLoadingGoal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    // ניתן לקבוע דומיין דרך ENV (VITE_PUBLIC_SITE_URL) או להשתמש בברירת מחדל
    const baseUrl =
        (import.meta as any).env?.VITE_PUBLIC_SITE_URL || "https://www.chabadyafo.org";

    const canFetch = useMemo(() => refInput.trim().length > 0, [refInput]);
    const canSave = useMemo(() => {
        const n = toNumber(goalInput);
        return canFetch && Number.isFinite(n) && n >= 0 && !saving;
    }, [goalInput, canFetch, saving]);

    // קישור מוכן להעתקה/פתיחה
    const linkUrl = useMemo(() => {
        const r = refInput.trim();
        return r ? `${baseUrl}/?ref=${encodeURIComponent(r)}` : "";
    }, [refInput, baseUrl]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setMsg("הועתק ✅");
        } catch {
            setErr("נכשל להעתיק ללוח");
        }
    };

    const fetchGoal = async () => {
        if (!canFetch) return;
        try {
            setErr(null);
            setMsg(null);
            setLoadingGoal(true);
            const g = await settingsService.getRefGoal(refInput.trim());
            setCurrentGoal(g);
        } catch (e: any) {
            setErr(e?.response?.data?.error || e?.message || "שגיאה בשליפת יעד");
            setCurrentGoal(null);
        } finally {
            setLoadingGoal(false);
        }
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        try {
            setErr(null);
            setMsg(null);
            setSaving(true);
            const n = toNumber(goalInput);
            await settingsService.setRefGoal(refInput.trim(), n);
            setMsg("היעד נשמר בהצלחה");
            setCurrentGoal(n);
        } catch (e: any) {
            setErr(e?.response?.data?.error || e?.message || "שגיאה בשמירת יעד");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!refInput.trim()) {
            setCurrentGoal(null);
            return;
        }
        const id = setTimeout(fetchGoal, 400);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refInput]);

    return (
        <div className="admin-ref-goal-form">
            <h3 className="title">יעד לפי Ref</h3>

            <form onSubmit={onSave} className="form">
                <label className="label">
                    <span>Ref</span>
                    <input
                        dir="ltr"
                        placeholder="למשל: Dl"
                        value={refInput}
                        onChange={(e) => setRefInput(e.target.value)}
                        onBlur={fetchGoal}
                        className="input"
                    />
                </label>

                <div className="current-goal">
                    יעד נוכחי: {loadingGoal ? "טוען…" : currentGoal != null ? currentGoal.toLocaleString("he-IL") : "—"}
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

                <button type="submit" disabled={!canSave} className="btn">
                    {saving ? "שומר…" : "שמור יעד"}
                </button>

          
                {linkUrl && (
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
                            <a
                                className="btn"
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                פתח קישור
                            </a>
                        </div>
                    </div>
                )}

                {msg && <div className="msg success">{msg}</div>}
                {err && <div className="msg error">{err}</div>}
            </form>
        </div>
    );
};

export default AdminRefGoalForm;
