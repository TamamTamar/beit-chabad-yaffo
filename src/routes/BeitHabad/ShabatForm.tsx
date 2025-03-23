import React, { useEffect, useState } from "react";
import './ShabatForm.scss';

interface Parasha {
  date: string; // תאריך לועזי
  rawDate: string; // תאריך בפורמט ISO לצורך מיון
  parasha: string;
  category: string; // קטגוריה (פרשה/חג)
  hdate: string; // תאריך עברי
}

const fetchParashot = async (): Promise<Parasha[]> => {
  try {
    const startDate = new Date().toISOString().split("T")[0]; // התאריך של היום בפורמט YYYY-MM-DD
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // הוסף שנה מהיום
    const endDateStr = endDate.toISOString().split("T")[0]; // תאריך סיום בפורמט YYYY-MM-DD

    const response = await fetch(
      `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&ss=on&s=on&year=now&month=x&geo=geoname&geonameid=293397&start=${startDate}&end=${endDateStr}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch parashot");
    }
    const json = await response.json();

    console.log("Fetched parashot and holidays:", json);

    return json.items
      .filter((item: any) =>
        item.category === "parashat" || (item.category === "holiday" && item.yomtov) // סינון עבור ימי טוב בלבד
      )
      .map((item: any) => ({
        rawDate: item.date, // תאריך אמיתי למיון
        date: new Date(item.date).toLocaleDateString("en-IL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }), // תאריך לועזי בפורמט dd/mm/yyyy
        hdate: item.hdate.split(" ").slice(0, 2).join(" "), // תאריך עברי ללא השנה
        parasha: item.hebrew,
        category: item.category, // קטגוריה (פרשה/חג)
      }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const ParashaCarousel: React.FC = () => {
  const [parashot, setParashot] = useState<Parasha[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchParashot().then(setParashot);
  }, []);

  const next = () => {
    if (index + 1 < parashot.length - 2) {
      setIndex(index + 1); // זז פרשה אחת קדימה
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1); // זז פרשה אחת אחורה
    }
  };

  const getCustomParashaName = (parasha: string): string => {
    if (parasha === "פסח א׳" || parasha === "Pesach I") {
      return "ליל הסדר";
    }
    if (parasha === "פסח ז׳" || parasha === "Pesach VII") {
      return "שביעי של פסח";
    }
    return parasha; // אם אין התאמה, מחזיר את השם המקורי
  };

 return (
  <div className="carousel-container">
    <button className="carousel-button" onClick={prev} disabled={index === 0}>
    ▶
    
    </button>
    {parashot.slice(index, index + 3).map((parasha) => (
      <div className="parasha-box" key={parasha.rawDate}>
        <h3 className="parasha-title">{getCustomParashaName(parasha.parasha)}</h3>
        <p className="parasha-date">{parasha.date}</p>
      </div>
    ))}
    <button
      className="carousel-button"
      onClick={next}
      disabled={index + 3 >= parashot.length}
    >
      ◀
    </button>
  </div>
);
};

export default ParashaCarousel;