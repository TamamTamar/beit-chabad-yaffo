import React, { useEffect, useState } from "react";
import './ShabbatSelector.scss';

interface Parasha {
    date: string;
    rawDate: string;
    parasha: string;
    category: string;
}

const fetchParashot = async (): Promise<Parasha[]> => {
    try {
        const startDate = new Date().toISOString().split("T")[0];
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        const endDateStr = endDate.toISOString().split("T")[0];

        const response = await fetch(
            `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&ss=on&s=on&year=now&month=x&geo=geoname&geonameid=293397&start=${startDate}&end=${endDateStr}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch parashot");
        }
        const json = await response.json();

        return json.items
            .filter(
                (item: any) =>
                    item.category === "parashat" || (item.category === "holiday" && item.yomtov)
            )
            .map((item: any) => ({
                rawDate: item.date,
                date: new Date(item.date).toLocaleDateString("en-IL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                parasha: item.hebrew,
                category: item.category,
            }));
    } catch (err) {
        console.error(err);
        return [];
    }
};

const ShabbatSelector: React.FC = () => {
    const [parashot, setParashot] = useState<Parasha[]>([]);
    const [selectedParasha, setSelectedParasha] = useState<Parasha | null>(null);
    const [singleCount, setSingleCount] = useState(0);
    const [coupleCount, setCoupleCount] = useState(0);
    const [childCount, setChildCount] = useState(0);

    useEffect(() => {
        fetchParashot().then(setParashot);
    }, []);

    const getCustomParashaName = (parasha: string): string => {
        if (parasha === "פסח א׳" || parasha === "Pesach I") {
            return "ליל הסדר";
        }
        if (parasha === "פסח ז׳" || parasha === "Pesach VII") {
            return "שביעי של פסח";
        }
        if (parasha === "ראש השנה 5786" || parasha === "Rosh Hashana 5786") {
            return "ראש השנה";
        }
        if (parasha === "ראש השנה ב׳" || parasha === "Rosh Hashana II") {
            return "יום שני של ראש השנה";
        }
        if (parasha === "סוכות א׳" || parasha === "Sukkot I") {
            return "חג ראשון של סוכות";
        }
        return parasha;
    };

    const calculateTotalPrice = (): number => {
        const prices = {
            single: 80,
            couple: 150,
            child: 50,
        };
        return (
            singleCount * prices.single +
            coupleCount * prices.couple +
            childCount * prices.child
        );
    };


    return (
        <>
            <img src="/img/kampein/banner.png" alt="" />
            <div className="shabbat-selector">

                <h2>מתי אתם רוצים להגיע?</h2>

                <select
                    onChange={(e) => {
                        const selected = parashot.find(p => p.rawDate === e.target.value);
                        setSelectedParasha(selected || null);
                    }}
                >
                    <option value="">בחר שבת</option>
                    {parashot
                        .filter(parasha => parasha.parasha !== "פסח ז׳" && parasha.parasha !== "Pesach VII") // סינון פרשות לא רצויות
                        .map((parasha) => (
                            <option key={parasha.rawDate} value={parasha.rawDate}>
                                {getCustomParashaName(parasha.parasha)} - {parasha.date}
                            </option>
                        ))}
                </select>

                {selectedParasha && (
                    <div className="registrants-container">
                        <h3>כמה באים ב{getCustomParashaName(selectedParasha.parasha)}?</h3>
                        <div className="registrants-inputs">
                            <div>
                                <label>יחידים (80 ש"ח):</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={singleCount}
                                    onChange={(e) => setSingleCount(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label>זוגות (150 ש"ח):</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={coupleCount}
                                    onChange={(e) => setCoupleCount(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label>ילדים (50 ש"ח):</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={childCount}
                                    onChange={(e) => setChildCount(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <p>סה"כ לתשלום: {calculateTotalPrice()} ש"ח</p>
                        <button>לתשלום</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShabbatSelector;