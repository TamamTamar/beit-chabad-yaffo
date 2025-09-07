import { FC, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AggregatedDonation, Donation } from "../../@Types/chabadType";

import { settingsService } from "../../services/setting-service";
import "./DonationList.scss";
import { getDonationsByRef } from "../../services/donation-service";

const DonationsByRefPage: FC = () => {
    const [searchParams] = useSearchParams();
    const ref = (searchParams.get("ref") || "").trim();

    const [dateOfBeggining, setDateOfBeggining] = useState<string>("");
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    // פורמט כספי עקבי: he-IL + ILS (₪)
    const ils = useMemo(
        () =>
            new Intl.NumberFormat("he-IL", {
                style: "currency",
                currency: "ILS",
                maximumFractionDigits: 0,
            }),
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

                const [dateOfBegginingDate, rawData] = await Promise.all([
                    settingsService.getSettings(),
                    getDonationsByRef(ref), // קריאה לשרת רק עבור ref מסוים
                ]);

                const dateStr =
                    dateOfBegginingDate instanceof Date
                        ? dateOfBegginingDate.toISOString().slice(0, 10)
                        : String(dateOfBegginingDate || "").slice(0, 10);

                const fromTimestamp = dateStr
                    ? new Date(`${dateStr}T00:00:00Z`).getTime()
                    : 0;

                const filtered = (rawData || []).filter((d: Donation) => {
                    const ts = d?.createdAt ? new Date(d.createdAt).getTime() : 0;
                    return Number.isFinite(ts) && ts >= fromTimestamp;
                });

                const aggregated: AggregatedDonation[] = filtered.map((item) => {
                    const name =
                        [item.FirstName, item.LastName].filter(Boolean).join(" ") || "—";
                    const monthly = item.Amount ?? 0;
                    const monthsPaid = item.Tashlumim ?? 1;
                    const pastTotal = monthly * monthsPaid;

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
                setDateOfBeggining(dateStr);
                setDonations(aggregated);
                setError(null);
            } catch (err) {
                console.error("שגיאה בטעינת תרומות לפי ref:", err);
                if (!mounted) return;
                setError("נכשלה טעינת תרומות לפי ref");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [ref]);

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
            ) : donations.length === 0 ? (
                <p className="donor-message">אין עדיין תרומות עבור {ref}</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">
                                השותפים שלנו
                            </h2>
                        </div>

                        {visibleDonations.map((d, idx) => (
                            <div
                                className="donation-card"
                                key={`${d.name}-${d.combinedTotal}-${idx}`}
                            >
                                <div className="donation-card-content">
                                    <div className="donor-row">
                                        <span className="donor-name">{d.name}</span>
                                        <span className="donor-amount">
                                            {ils.format(d.combinedTotal)}
                                        </span>
                                    </div>
                                    {d.lizchut && (
                                        <div className="donor-message">לזכות: {d.lizchut}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {visibleCount < donations.length && (
                            <button
                                className="show-more-btn"
                                onClick={() =>
                                    setVisibleCount((v) => Math.min(v + 4, donations.length))
                                }
                                aria-label="הצג עוד תרומות"
                            >
                                הצג עוד
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationsByRefPage;
