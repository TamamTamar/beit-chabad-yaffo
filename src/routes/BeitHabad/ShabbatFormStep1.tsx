import { useEffect, useState } from 'react';
import { fetchParashot, getCustomParashaName } from '../../services/shabbatService';

const ShabbatFormStep1 = ({ setStep, setSelectedShabbat }) => {
    const [parashot, setParashot] = useState([]);
    const [selectedParasha, setSelectedParasha] = useState(null);

    useEffect(() => {
        fetchParashot().then(setParashot);
    }, []);

    const handleParashaSelection = () => {
        if (selectedParasha) {
            console.log("Selected Parasha:", selectedParasha);
            setSelectedShabbat(selectedParasha);
            setStep(2);
        }
    };

    return (
        <div className="shabbat-selection">
            <h2 className="shabbat-selection-title">בחר פרשה</h2>
            <select
                className="select-shabbat"
                onChange={(e) => {
                    const selected = parashot.find(p => p.rawDate === e.target.value);
                    setSelectedParasha(selected || null);
                }}
            >
                <option className="select-shabbat-option" value="">בחר שבת</option>
                {parashot
                    .filter(parasha => parasha.parasha !== "פסח ז׳" && parasha.parasha !== "Pesach VII")
                    .map((parasha) => (
                        <option
                            key={parasha.rawDate}
                            value={parasha.rawDate}
                            className="select-shabbat-option"
                        >
                            {getCustomParashaName(parasha.parasha)} - {parasha.date}
                        </option>
                    ))}
            </select>
            <button
                className="shabbat-selection-button"
                onClick={handleParashaSelection}
                disabled={!selectedParasha}
            >
                המשך
            </button>
        </div>
    );
};

export default ShabbatFormStep1;