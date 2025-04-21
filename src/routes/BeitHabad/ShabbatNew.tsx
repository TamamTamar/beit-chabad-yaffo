import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shabbat } from '../../@Types/chabadType';
import { fetchParashot, getCustomParashaName } from '../../services/shabbatService'; // ייבוא הפונקציה
import './ShabbatNew.scss';

const ShabbatNew = () => {
    const [parashot, setParashot] = useState<shabbat[]>([]);
    const [selectedParasha, setSelectedParasha] = useState<shabbat | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchParashot().then(setParashot);
    }, []);

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