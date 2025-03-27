import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shabbat } from '../../@Types/chabadType';
import { fetchParashot } from '../../services/shabbatService';
import './ShabbatNew.scss';

const ShabbatNew = () => {
    const [parashot, setParashot] = useState<shabbat[]>([]);
    const [selectedParasha, setSelectedParasha] = useState<shabbat | null>(null);
    const navigate = useNavigate();

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
        if (parasha === "יום כפור" || parasha === "Yom Kippur") {
            return "יום כיפור - סעודה מפסקת";
        }
        if (parasha === "סוכות א׳" || parasha === "Sukkot I") {
            return "חג ראשון של סוכות";
        }
        return parasha;
    };

    const handleRegistration = () => {
        if (selectedParasha) {
            navigate(`/registration`, { state: { parasha: selectedParasha } });
        }
    };

    return (
        <div className="shabbat-section">
            <h1 className='shabbat-title'>הרשמה לשבת וחג בבית חב"ד יפו</h1>
            <h3 className='shabbat-subtitle'>למתי תרצו להירשם?</h3>

            <select
                className='select-shabbat'
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

            <button onClick={handleRegistration} disabled={!selectedParasha}>
                להרשמה
            </button>
        </div>
    );
};

export default ShabbatNew;