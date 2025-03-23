import { HebcalData } from "../@Types/chabadType";

interface ShabbatData {
  candles: string;
  havdalah: string;
  parasha: string;
  date: string;
  parashot: Parasha[];
}

interface Parasha {
  date: string; // תאריך בעברית
  rawDate: string; // תאריך בפורמט ISO לצורך מיון
  parasha: string;
  category: string; // קטגוריה (פרשה/חג)
}

export const fetchShabbatData = async (): Promise<ShabbatData | null> => {
  try {
    // Fetch candle lighting times and parasha
    const shabbatResponse = await fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=293397&M=on"
    );
    if (!shabbatResponse.ok) {
      throw new Error("Failed to fetch candle lighting times");
    }
    const shabbatJson: HebcalData = await shabbatResponse.json();

    const candles = shabbatJson.items.find((item) => item.category === "candles");
    const havdalah = shabbatJson.items.find((item) => item.category === "havdalah");
    const parasha = shabbatJson.items.find((item) => item.category === "parashat");

    if (!candles || !havdalah || !parasha) {
      throw new Error("Missing Shabbat data");
    }

    // Fetch parashot and holidays
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    const endDateStr = endDate.toISOString().split("T")[0];

    const parashaResponse = await fetch(
      `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&ss=on&s=on&year=now&month=x&geo=geoname&geonameid=293397&start=${startDate}&end=${endDateStr}`
    );
    if (!parashaResponse.ok) {
      throw new Error("Failed to fetch parashot");
    }
    const parashaJson = await parashaResponse.json();

    console.log("Fetched parashot and holidays:", parashaJson);

    const parashot = parashaJson.items
      .filter(
        (item: any) =>
          item.category === "parashat" || (item.category === "holiday" && item.yomtov)
      )
      .map((item: any) => ({
        rawDate: item.date,
        date: new Date(item.date).toLocaleDateString("he-IL", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        parasha: item.hebrew,
        category: item.category,
      }));

    return {
      date: new Date(candles.date).toLocaleDateString("he-IL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      parasha: parasha.hebrew,
      candles: candles.title.split(": ")[1],
      havdalah: havdalah.title.split(": ")[1],
      parashot,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};