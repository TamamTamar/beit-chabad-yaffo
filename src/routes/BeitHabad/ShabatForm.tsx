import React, { useEffect, useState } from "react";
import { fetchShabbatData } from "../../services/shabbatService";

interface ShabbatData {
  candles: string; // זמן הדלקת נרות
  havdalah: string; // זמן הבדלה
  parasha: string; // פרשת השבוע
  date: string; // תאריך
  parashot: Parasha[]; // רשימת פרשות וחגים
}

interface Parasha {
  date: string; // תאריך בעברית
  rawDate: string; // תאריך בפורמט ISO
  parasha: string; // שם הפרשה או החג
  category: string; // קטגוריה (פרשה/חג)
}

const ShabbatForm: React.FC = () => {
  const [shabbatData, setShabbatData] = useState<ShabbatData | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchShabbatData().then(setShabbatData);
  }, []);

  const next = () => {
    if (shabbatData && index + 3 < shabbatData.parashot.length) {
      setIndex(index + 3);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 3);
    }
  };

  if (!shabbatData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>פרשת השבוע: {shabbatData.parasha}</h2>
      <p>תאריך: {shabbatData.date}</p>
     
      <p>זמן הבדלה: {shabbatData.havdalah}</p>

      <div>
        <button onClick={prev} disabled={index === 0}>
          ◀
        </button>
        {shabbatData.parashot.slice(index, index + 3).map((parasha) => (
          <div
            key={parasha.rawDate}
            style={{
              display: "inline-block",
              margin: "10px",
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "5px",
            }}
          >
            <h3>{parasha.parasha}</h3>
            <p>{parasha.date}</p>
            <p>{parasha.category === "holiday" ? "Yom Tov" : "Parasha"}</p>
            <p>זמן כניסת שבת: {shabbatData.candles}</p>
          </div>
        ))}
        <button
          onClick={next}
          disabled={shabbatData.parashot && index + 3 >= shabbatData.parashot.length}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ShabbatForm;