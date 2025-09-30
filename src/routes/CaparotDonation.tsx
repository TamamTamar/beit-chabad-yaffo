import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaparotDonation.scss";

type CaparotDonationProps = {
    imageSrc?: string;
    title?: string;
    amounts?: number[];
    minCustom?: number;
    maxCustom?: number;
    step?: number;
};

const DEFAULT_AMOUNTS = [30, 50, 100, 180];

const CaparotDonation: React.FC<CaparotDonationProps> = ({
    imageSrc = "/caparot.jpg",
    title = "פדיון כפרות בית חב״ד יפו",
    amounts = DEFAULT_AMOUNTS,
    minCustom = 0,
    maxCustom = 100000,
    step = 1,
}) => {
    const navigate = useNavigate();

    const [selected, setSelected] = useState<number | "custom" | null>(null);
    const [customRaw, setCustomRaw] = useState<string>("");

    // 🔹 מטבע לסכום החופשי בלבד
    const [customCurrency, setCustomCurrency] = useState<1 | 2>(1);

    const customValue = useMemo(() => {
        const n = Number(customRaw.replace(/[^\d.]/g, ""));
        return Number.isNaN(n) ? null : n;
    }, [customRaw]);

    const customValid =
        selected === "custom" &&
        customValue !== null &&
        customValue >= minCustom &&
        customValue <= maxCustom;

    const goToPayment = (amount: number) => {
        navigate(`/caparotDonation/${customCurrency}/${amount}`);
    };


    const handlePreset = (amt: number) => {
        setSelected(amt);
        goToPayment(amt);
    };

    const handleCustomClick = () => setSelected("custom");
    const handleContinue = () => {
        if (selected === "custom" && customValid && customValue !== null) {
            goToPayment(customValue);
        }
    };

    return (
        <section className="caparot-card" aria-labelledby="caparot-title">
            <h2 id="caparot-title" className="caparot-title">{title}</h2>
            <img className="logo" src="/logo-nav.jpg" alt="logo" />

            {/* כפתורי סכומים קבועים — תמיד ₪ */}
            <div className="amount-grid" role="group" aria-label="בחירת סכום">
                {amounts.slice(0, 4).map((amt) => (
                    <button
                        key={amt}
                        type="button"
                        className={"amount-box" + (selected === amt ? " is-selected" : "")}
                        onClick={() => handlePreset(amt)}
                        aria-pressed={selected === amt}
                    >
                        <span className="amount-currency">₪</span>
                        <span className="amount-number">{amt}</span>
                    </button>
                ))}
            </div>

            {/* סכום חופשי */}
            <div className="custom-wrapper">
                <button
                    type="button"
                    className={"custom-amount" + (selected === "custom" ? " is-selected" : "")}
                    onClick={handleCustomClick}
                    aria-pressed={selected === "custom"}
                    aria-controls="custom-amount-row"
                    aria-expanded={selected === "custom"}
                >
                    סכום חופשי
                </button>

                {selected === "custom" && (
                    <div className="custom-input-row" id="custom-amount-row">
                        <div className="free-amount-group">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="free-amount-input"
                                placeholder="0"
                                value={customRaw}
                                onChange={(e) => setCustomRaw(e.target.value.replace(/[^0-9]/g, ""))}
                            />
                            <select
                                className="currency-select"
                                aria-label="בחר/י מטבע"
                                value={customCurrency}
                                onChange={(e) => setCustomCurrency(Number(e.target.value) as 1 | 2)}
                            >
                                <option value={1}>ILS ₪</option>
                                <option value={2}>USD $</option>
                            </select>
                        </div>

                        <button type="button" className="continue-btn" onClick={handleContinue} disabled={!customValid}>
                            המשך לתשלום
                        </button>
                    </div>
                )}

            </div>

            <div className="caparot-image-wrap">
                <img src={imageSrc} alt="פדיון כפרות" className="caparot-image" />
            </div>
        </section>
    );
};

export default CaparotDonation;
