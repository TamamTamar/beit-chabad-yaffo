import { shabbat } from "../@Types/chabadType";

export const fetchParashot = async (): Promise<shabbat[]> => {
    try {
        const startDate = new Date().toISOString().split("T")[0];
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 4);
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