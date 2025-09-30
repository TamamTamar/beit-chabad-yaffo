import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaparotDonation.scss";

type CaparotDonationProps = {
    imageSrc?: string;
    title?: string;
    amounts?: number[];
    paymentPath?: string;        // ברירת מחדל: "/donate"
    amountQueryKey?: string;     // ברירת מחדל: "amount"
    minCustom?: number;          // ברירת מחדל: 5
    maxCustom?: number;          // ברירת מחדל: 100000
    step?: number;   
      // ברירת מחדל: 1
};

const DEFAULT_AMOUNTS = [30, 50, 100, 180];

const CaparotDonation: React.FC<CaparotDonationProps> = ({
    imageSrc = "/caparot.jpg",
    title = "פדיון כפרות",
    amounts = DEFAULT_AMOUNTS,
    minCustom = 30,
    maxCustom = 100000,
    step = 1,
}) => {
    const navigate = useNavigate();

    const [selected, setSelected] = useState<number | "custom" | null>(null);
    const [customRaw, setCustomRaw] = useState<string>("");

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
        navigate(`/caparotDonation/${amount}`);
    };


    const handlePreset = (amt: number) => {
        setSelected(amt);
        goToPayment(amt);
    };

    const handleCustomClick = () => {
        setSelected("custom");
    };

    const handleContinue = () => {
        if (selected === "custom" && customValid && customValue !== null) {
            goToPayment(customValue);
        }
    };

    return (
        <section className="caparot-card" dir="rtl" aria-labelledby="caparot-title">
            <h2 id="caparot-title" className="caparot-title">
                {title}
            </h2>

            <div className="amount-grid" role="group" aria-label="בחירת סכום">
                {amounts.slice(0, 4).map((amt) => (
                    <button
                        key={amt}
                        type="button"
                        className={"amount-box" + (selected === amt ? " is-selected" : "")}
                        onClick={() => handlePreset(amt)}
                        aria-pressed={selected === amt}
                    >
                        <span className="amount-number">{amt}</span>
                        <span className="amount-currency">₪</span>
                    </button>
                ))}
            </div>

            <div className="custom-wrapper">
                <button
                    type="button"
                    className={
                        "custom-amount" + (selected === "custom" ? " is-selected" : "")
                    }
                    onClick={handleCustomClick}
                    aria-pressed={selected === "custom"}
                    aria-controls="custom-amount-row"
                    aria-expanded={selected === "custom"}
                >
                    סכום חופשי
                </button>

                {selected === "custom" && (
                    <div className="custom-input-row" id="custom-amount-row">
                        <label className="visually-hidden" htmlFor="custom-amount-field">
                            הקלדת סכום חופשי
                        </label>

                        <div className="input-with-suffix">
                            <input
                                id="custom-amount-field"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min={minCustom}
                                max={maxCustom}
                                step={step}
                                value={customRaw}
                                onChange={(e) => setCustomRaw(e.target.value)}
                                placeholder={`מינ' ${minCustom}₪`}
                                aria-invalid={selected === "custom" ? !customValid : undefined}
                            />
                            <span className="suffix">₪</span>
                        </div>

                        <button
                            type="button"
                            className="continue-btn"
                            onClick={handleContinue}
                            disabled={!customValid}
                            title={!customValid ? `סכום בין ${minCustom} ל-${maxCustom}` : "המשך לתשלום"}
                        >
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
