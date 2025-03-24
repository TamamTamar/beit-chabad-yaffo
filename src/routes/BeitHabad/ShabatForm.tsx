import React, { useEffect, useState } from "react";
import "./ShabatForm.scss";

interface Parasha {
  date: string; // תאריך לועזי
  rawDate: string; // תאריך בפורמט ISO לצורך מיון
  parasha: string;
  category: string; // קטגוריה (פרשה/חג)
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

const ParashaCarousel: React.FC = () => {
  const [parashot, setParashot] = useState<Parasha[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedParasha, setSelectedParasha] = useState<Parasha | null>(null);
  const [singleCount, setSingleCount] = useState(0);
  const [coupleCount, setCoupleCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  useEffect(() => {
    fetchParashot().then(setParashot);
  }, []);

  const next = () => {
    if (index + 1 < parashot.length - 2) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const getCustomParashaName = (parasha: string): string => {
    if (parasha === "פסח א׳" || parasha === "Pesach I") {
      return "ליל הסדר";
    }
    if (parasha === "פסח ז׳" || parasha === "Pesach VII") {
      return "שביעי של פסח";
    }
    return parasha;
  };

  const handleParashaClick = (parasha: Parasha) => {
    setSelectedParasha(parasha);
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
    <div className="seuda-form">
      <div className="carousel-container">
        <div className="carousel-row">
          <button className="carousel-button" onClick={prev} disabled={index === 0}>
            ◀
          </button>
          <div className="parasha-list">
            {parashot.slice(index, index + 3).map((parasha) => (
              <div
                className="parasha-box"
                key={parasha.rawDate}
                onClick={() => handleParashaClick(parasha)}
              >
                <h3 className="parasha-title">{getCustomParashaName(parasha.parasha)}</h3>
                <p className="parasha-date">{parasha.date}</p>
              </div>
            ))}
          </div>
          <button
            className="carousel-button"
            onClick={next}
            disabled={index + 3 >= parashot.length}
          >
            ▶
          </button>
        </div>

        {selectedParasha && (
          <div className="registrants-container">
            <h3 className="registrants-title">
              בחר כמות נרשמים עבור {getCustomParashaName(selectedParasha.parasha)}
            </h3>
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
            <p className="registrants-total">סה"כ לתשלום: {calculateTotalPrice()} ש"ח</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParashaCarousel;