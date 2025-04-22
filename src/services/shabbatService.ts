import axios from "axios";
import { RishumShabbatType, shabbat } from "../@Types/chabadType";

const baseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/rishum";

export const fetchParashot = async (): Promise<shabbat[]> => {
    try {
        const startDate = new Date().toISOString().split("T")[0];
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
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

// פונקציה להתאמה אישית של שם הפרשה
export const getCustomParashaName = (parasha: string): string => {
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

export const newRishum = async (data: RishumShabbatType) => {
 return axios.post(`${baseUrl}/`, data,);
}

//get all registrations
export const getAllRishum = async () => {
    try {
        const response = await axios.get(`${baseUrl}/register`);
        return response.data;
    } catch (error) {
        console.error("Error fetching registrations:", error);
        throw error;
    }
}
