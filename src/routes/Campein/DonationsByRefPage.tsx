// src/routes/Campein/DonationsByRefPage.tsx
import { FC, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AggregatedDonation, Donation } from "../../@Types/chabadType";
import "./DonationList.scss";
import { getDonationsByRef } from "../../services/donation-service";
import { settingsService } from "../../services/setting-service";

const DonationsByRefPage: FC = () => {
    const [searchParams] = useSearchParams();
    const ref = (searchParams.get("ref") || "").trim();

    const [goal, setGoal] = useState<number>(0);
    const [refName, setRefName] = useState<string>(""); // שם ידידותי ל-ref
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    const ils = useMemo(
        () => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }),
        []
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!ref) {
                setError("לא נבחר ref");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);

                // מביאים במקביל: תרומות + יעד + שם (עם fallback אם אחד נופל)
                const [donRes, goalRes, nameRes] = await Promise.allSettled([
                    getDonationsByRef(ref),
                    settingsService.getRefGoal(ref),
                    settingsService.getRefName(ref),
                ]);

                const rawDonations: Donation[] =
                    donRes.status === "fulfilled" && Array.isArray(donRes.value) ? donRes.value : [];

                const goalVal: number =
                    goalRes.status === "fulfilled" ? Number(goalRes.value) || 0 : 0;

                const nameVal: string =
                    nameRes.status === "fulfilled" ? String(nameRes.value || "") : "";


                // בניית כרטיסים
                const agg: AggregatedDonation[] = rawDonations.map((item) => {
                    const name = [item.FirstName, item.LastName].filter(Boolean).join(" ") || "—";
                    const pastTotal = (item.Amount ?? 0) * (item.Tashlumim ?? 1);
                    return {
                        name,
                        pastTotal,
                        futureTotal: 0,
                        combinedTotal: pastTotal,
                        lizchut: (item.lizchut || "").toString().trim(),
                        comment: (item.Comments || "").toString().trim(),
                    };
                });

                if (!mounted) return;
                setDonations(agg);
                setGoal(goalVal);
                setRefName(nameVal);
            } catch (e: any) {
                console.error("[DonationsByRefPage] error:", e?.message || e);
                if (!mounted) return;
                setError("נכשלה טעינת תרומות או היעד לפי ref");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [ref]);

    // סכומים/אחוז/מונה
    const totals = useMemo(() => {
        const amount = donations.reduce((s, d) => s + (d.combinedTotal || 0), 0);
        const remaining = Math.max((goal || 0) - amount, 0);
        const percent = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0;
        return { amount, count: donations.length, goal, remaining, percent };
    }, [donations, goal]);

    const visibleDonations = useMemo(
        () => donations.slice(0, visibleCount),
        [donations, visibleCount]
    );

    return (
        <div className="donation-list-cards">
            {loading ? (
                <p className="donor-message">טוען…</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">
                                {refName ? `השותפים של ${refName}` : "השותפים שלנו"}
                            </h2>



                            <div className="donation-total">
                                <span className="donation-total-title">סה״כ נתרם:</span>{" "}
                                <strong>{ils.format(totals.amount)}</strong>{" "}
                                {goal > 0 && (
                                    <>
                                        <span className="donation-total-sep">מתוך</span>{" "}
                                        <strong>{ils.format(goal)}</strong>{" "}
                                        <span className="donation-total-sep">•</span>{" "}
                                        <span>חסר {ils.format(totals.remaining)}</span>{" "}
                                        <span className="donation-total-sep">•</span>{" "}
                                        <span>{totals.percent.toFixed(1)}%</span>{" "}
                                    </>
                                )}
                                <span className="donation-total-sep">•</span>{" "}
                                <span className="don">{totals.count} תורמים</span>
                            </div>
                            {/* ← כפתור חזרה לדף הבית */}
                            <Link to="/" className="back-home-btn" aria-label="לכל השותפים">
                                לכל השותפים
                            </Link>
                        </div>



                        {donations.length === 0 ? (
                            <p className="donor-message">
                                {goal > 0 ? `נתרם 0 מתוך ${ils.format(goal)}` : `לא הוגדר יעד`}
                            </p>
                        ) : (
                            <>
                                {visibleDonations.map((d, idx) => (
                                    <div className="donation-card" key={`${d.name}-${d.combinedTotal}-${idx}`}>
                                        <div className="donation-card-content">
                                            <div className="donor-row">
                                                <span className="donor-name">{d.name}</span>
                                                <span className="donor-amount">{ils.format(d.combinedTotal)}</span>
                                            </div>
                                            {d.lizchut && <div className="donor-message">לזכות: {d.lizchut}</div>}
                                        </div>
                                    </div>
                                ))}

                                {visibleCount < donations.length && (
                                    <button
                                        className="show-more-btn"
                                        onClick={() => setVisibleCount((v) => Math.min(v + 4, donations.length))}
                                        aria-label="הצג עוד תרומות"
                                    >
                                        הצג עוד
                                    </button>
                                )}

                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationsByRefPage;
