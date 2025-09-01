import axios from "axios";

// כתובת הבסיס לאסוף את כל הנתונים
const parashaBaseUrl = "https://node-beit-chabad-yaffo-production.up.railway.app/api/parasha";

// פונקציה לקבלת כל הפרשות
export const getAllParashot = async () => {
    try {
        const response = await axios.get(parashaBaseUrl);
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No parashot found");
            return []; // מחזיר מערך ריק במקרה שאין פרשות
        }
        return data; // מחזיר את הנתונים
    } catch (error) {
        console.error("Error fetching all parashot:", error);
        throw error; // שגיאה במקרה של כשלון
    }
};

export const getLastParasha = async () => {
    try {
        const response = await axios.get(parashaBaseUrl, {
            params: { last: "true" },
        });
        const data = response.data;
        if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
            console.warn("No last parasha found");
            return null; // מחזיר null במקרה שאין פרשה
        }
        return data; // מחזיר את הנתונים
    } catch (error) {
        console.error("Error fetching last parasha:", error);
        throw error; // שגיאה במקרה של כשלון
    }
};


// פונקציה לקבלת הפרשה לפי מזהה
export const getParashaById = (id: string) => axios.get(`${parashaBaseUrl}/${id}`);

// פונקציה לקבלת הפרשה האחרונה


// יצירת פרשה חדשה
export const createNewParasha = (data: FormData) => {
    return axios.post(parashaBaseUrl, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};

// עדכון פרשה
export const updateParasha = (id: string, data: FormData) => {
    return axios.put(`${parashaBaseUrl}/${id}`, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data", // צריך לשנות ל-multipart/form-data כשיש תמונה
        },
    });
};

// מחיקת פרשה לפי מזהה
export const deleteParashaById = (id: string) => {
    return axios.delete(`${parashaBaseUrl}/${id}`, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};

// בקשה לקבלת הפרשה האחרונה (עם מיון)
/* export const getLatestParasha = () => {
    return axios.get(`${parashaBaseUrl}?sort=-createdAt&limit=1`);
}; */
