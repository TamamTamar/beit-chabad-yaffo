import React, { useEffect, useState } from 'react';
import { fetchParashot, getCustomParashaName } from '../../services/shabbatService';

const ShabbatFormStep1 = ({ setStep, setSelectedShabbat }) => {
    const [parashot, setParashot] = useState([]);
    const [selectedParasha, setSelectedParasha] = useState(null);

    useEffect(() => {
        fetchParashot().then(setParashot);
    }, []);

    const handleParashaSelection = () => {
        if (selectedParasha) {
            setSelectedShabbat(selectedParasha); // מעדכן את הפרשה שנבחרה בקומפוננטת האב
            setStep(2); // מעביר לשלב 2
        }
    };

    return (
        <div className="shabbat-selection">
            <h2>בחר פרשה</h2>
            <select
                className="select-shabbat"
                onChange={(e) => {
                    const selected = parashot.find(p => p.rawDate === e.target.value);
                    setSelectedParasha(selected || null);
                }}
            >
                <option value="">בחר שבת</option>
                {parashot
                    .filter(parasha => parasha.parasha !== "פסח ז׳" && parasha.parasha !== "Pesach VII")
                    .map((parasha) => (
                        <option key={parasha.rawDate} value={parasha.rawDate}>
                            {getCustomParashaName(parasha.parasha)} - {parasha.date}
                        </option>
                    ))}
            </select>
            <button onClick={handleParashaSelection} disabled={!selectedParasha}>
                המשך
            </button>
        </div>
    );
};

export default ShabbatFormStep1;