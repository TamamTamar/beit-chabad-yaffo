// src/routes/Campein/DonationsByRefPage.tsx
import { FC, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./DonationList.scss";
import {
    getDonationsByRefView,
    formatByCurrency,
    formatILS,
    AggWithCurrency,
    Totals,
} from "../../services/payment-service";

const DonationsByRefPage: FC = () => {
    const [sp] = useSearchParams();
    const ref = (sp.get("ref") || "").trim();

    const [refName, setRefName] = useState<string>("");
    const [donations, setDonations] = useState<AggWithCurrency[]>([]);
    const [totals, setTotals] = useState<Totals | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!ref) {
                    setError("לא נבחר ref");
                    setLoading(false);
                    return;
                }
                setLoading(true);
                setError(null);

                const res = await getDonationsByRefView(ref); // ← כל המידע בקריאה אחת
                if (!mounted) return;

                setDonations(res.donations);
                setRefName(res.refName);
                setTotals(res.totals);
            } catch (e: any) {
                console.error("[DonationsByRefPage]", e?.message || e);
                if (!mounted) return;
                setError("נכשלה טעינת תרומות/יעד לפי ref");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [ref]);

    const visibleDonations = useMemo(
        () => donations.slice(0, visibleCount),
        [donations, visibleCount]
    );

    if (!ref) return <p className="error">לא נבחר ref</p>;

    return (
        <div className="donation-list-cards">
            {loading ? (
                <p className="donor-message">טוען…</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : !totals ? (
                <p className="error">חסרים נתונים</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">
                                {refName ? `השותפים של ${refName}` : "השותפים שלנו"}
                            </h2>

                            <div className="donation-total">
                                <span className="donation-total-title">סה״כ נתרם:</span>{" "}
                                <strong>{formatILS(totals.amount)}</strong>{" "}
                                {totals.goal > 0 && (
                                    <>
                                        <span className="donation-total-sep">מתוך</span>{" "}
                                        <strong>{formatILS(totals.goal)}</strong>{" "}
                                        <span className="donation-total-sep">•</span>{" "}
                                        <span>חסר {formatILS(totals.remaining)}</span>{" "}
                                        <span className="donation-total-sep">•</span>{" "}
                                        <span>{totals.percent.toFixed(1)}%</span>{" "}
                                    </>
                                )}
                                <span className="donation-total-sep">•</span>{" "}
                                <span className="don">{totals.count} תורמים</span>
                                <Link to="/" className="back-home-btn" aria-label="לכל השותפים">
                                    לכל השותפים
                                </Link>
                            </div>
                        </div>

                        {donations.length === 0 ? (
                            <p className="donor-message">
                                {totals.goal > 0
                                    ? `נתרם 0 מתוך ${formatILS(totals.goal)}`
                                    : `לא הוגדר יעד`}
                            </p>
                        ) : (
                            <>
                                {visibleDonations.map((d, idx) => (
                                    <div className="donation-card" key={`${d.name}-${d.combinedTotal}-${idx}`}>
                                        <div className="donation-card-content">
                                            <div className="donor-row">
                                                <span className="donor-name">{d.name}</span>
                                                <span className="donor-amount">
                                                    {formatByCurrency(d.combinedTotal, d.currency)}
                                                </span>
                                            </div>
                                            {d.lizchut && <div className="donor-message">{d.lizchut}</div>}
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
