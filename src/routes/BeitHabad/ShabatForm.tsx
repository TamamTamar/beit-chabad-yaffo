import React, { useEffect, useState } from "react";

interface Parasha {
  date: string; // תאריך בעברית
  rawDate: string; // תאריך בפורמט ISO לצורך מיון
  parasha: string;
  category: string; // קטגוריה (פרשה/חג)
  candleLightingTime: string | null; // זמן הדלקת נרות
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
          (item.category === "parashat") || (item.category === "holiday" && item.yomtov) // סינון עבור ימי טוב בלבד
        )
        .map((item: any) => {
          // אם מדובר בהדלקת נרות, נוסיף שעה וחצי
          let candleLightingTime = null;
          if (item.category === "candles" && item.title && item.title.includes("Candle lighting")) {
            const timeStr = item.title.split(":")[1].trim(); // תופס את הזמן אחרי "Candle lighting:"
            const [hours, minutes] = timeStr.split(":").map((str: string) => parseInt(str, 10));
  
            const time = new Date();
            time.setHours(hours, minutes);
            time.setHours(time.getHours() + 1); // הוספת שעה
            time.setMinutes(time.getMinutes() + 30); // הוספת 30 דקות
            candleLightingTime = time.toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
  
          return {
            rawDate: item.date, // תאריך אמיתי למיון
            date: new Date(item.date).toLocaleDateString("he-IL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }), // תאריך מעוצב להצגה
            parasha: item.hebrew,
            category: item.category, // קטגוריה (פרשה/חג)
            candleLightingTime, // זמן הדלקת נרות אם קיים
          };
        });
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
    if (index + 3 < parashot.length) {
      setIndex(index + 3);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 3);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={prev} disabled={index === 0}>
        ◀
      </button>
      {parashot.slice(index, index + 3).map((parasha) => (
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
          {parasha.candleLightingTime && (
            <p>התחלת הסעודה: {parasha.candleLightingTime}</p>
          )}
        </div>
      ))}
      <button onClick={next} disabled={index + 3 >= parashot.length}>
        ▶
      </button>
    </div>
  );
};

export default ParashaCarousel;
