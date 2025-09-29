import { FC, useEffect, useMemo, useState } from "react";
import "./DonationList.scss";
import {
    getAllDonationsView,
    formatByCurrency,
    AggWithCurrency,
} from "../../services/payment-service";

const BIG_DONOR_THRESHOLD_ILS = 10000;

const DonationList: FC = () => {
    const [donations, setDonations] = useState<AggWithCurrency[]>([]);
    const [uniqueDonorsCount, setUniqueDonorsCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const { donations, uniqueDonorsCount } = await getAllDonationsView();
                if (!mounted) return;
                setDonations(donations);
                setUniqueDonorsCount(uniqueDonorsCount);
            } catch (err: any) {
                console.error("[DonationList]", err?.message || err);
                if (!mounted) return;
                setError("נכשלה טעינת התרומות");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const isBigDonor = (d: AggWithCurrency) => {
        const normIls = (d as any).combinedTotalILS;
        if (typeof normIls === "number") return normIls >= BIG_DONOR_THRESHOLD_ILS;
        if (d.currency === 1) return d.combinedTotal >= BIG_DONOR_THRESHOLD_ILS;
        return d.combinedTotal >= BIG_DONOR_THRESHOLD_ILS;
    };

    const getEpoch = (d: AggWithCurrency): number => {
        const raw =
            (d as any).lastDonationAt ??
            (d as any).lastChargeAt ??
            (d as any).createdAt ??
            (d as any).updatedAt ??
            (d as any).date;
        const t = raw ? new Date(raw).getTime() : 0;
        return Number.isFinite(t) ? t : 0;
    };

    const { bigDonors, regularDonors } = useMemo(() => {
        const big: AggWithCurrency[] = [];
        const rest: AggWithCurrency[] = [];
        for (const d of donations) {
            if (isBigDonor(d)) big.push(d);
            else rest.push(d);
        }
        return { bigDonors: big, regularDonors: rest };
    }, [donations]);

    const regularSortedByDate = useMemo(
        () => [...regularDonors].sort((a, b) => getEpoch(b) - getEpoch(a)),
        [regularDonors]
    );

    const visibleRegular = useMemo(
        () => regularSortedByDate.slice(0, visibleCount),
        [regularSortedByDate, visibleCount]
    );

    return (
        <div className="donation-list-cards">
            {loading ? (
                <p className="donor-message">טוען…</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : donations.length === 0 ? (
                <p className="donor-message">בואו תהיו הראשונים</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">
                                {uniqueDonorsCount.toLocaleString("he-IL")} השותפים שלנו
                            </h2>
                        </div>

                        {/* --- VIP BAR --- */}
                        {bigDonors.length > 0 && (
                            <section
                                className="vip-donors-bar"
                                aria-label="תורמים מעל 10,000 ש״ח"
                            >
                                <div className="vip-donors-bar-header">
                                    <span className="vip-donors-bar-title">שותפים מיוחדים</span>
                                </div>

                                {/* שימי לב לשינוי שם הקלאס כאן */}
                                <div className="vip-donors-bar-chips" role="list">
                                    {bigDonors.map((d, idx) => (
                                        <button
                                            key={`vip-${d.name}-${d.combinedTotal}-${idx}`}
                                            className="vip-chip"
                                            role="listitem"
                                            type="button"
                                            aria-label={`תורם VIP ${d.name} סכום ${formatByCurrency(
                                                d.combinedTotal,
                                                d.currency
                                            )}`}
                                        >
                                            <span className="vip-chip-name">{d.name}</span>
                                            <span className="vip-chip-amount">
                                                {formatByCurrency(d.combinedTotal, d.currency)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* --- כרטיסים רגילים (מסודרים לפי תאריך) --- */}
                        {visibleRegular.map((d, idx) => (
                            <div
                                className="donation-card"
                                key={`reg-${d.name}-${getEpoch(d)}-${idx}`}
                            >
                                <div className="donation-card-content">
                                    <div className="donor-row">
                                        <span className="donor-name">{d.name}</span>
                                        <span className="donor-amount">
                                            {formatByCurrency(d.combinedTotal, d.currency)}
                                        </span>
                                    </div>
                                    {d.lizchut && (
                                        <div className="donor-message">{d.lizchut}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {visibleCount < regularSortedByDate.length && (
                            <button
                                className="show-more-btn"
                                onClick={() =>
                                    setVisibleCount((v) =>
                                        Math.min(v + 4, regularSortedByDate.length)
                                    )
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

export default DonationList;
