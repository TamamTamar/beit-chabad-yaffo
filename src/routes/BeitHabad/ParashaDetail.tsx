import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Parasha } from "../../@Types/chabadType";
import { getParashaById } from "../../services/parasha-service";
import './ParashaDetails.scss';

const ParashaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [parasha, setParasha] = useState<Parasha | null>(null);

    useEffect(() => {
        console.log("useEffect triggered with id:", id); // בדיקה שה-id מתקבל
        if (id) {
            getParashaById(id)
                .then(res => {
                    console.log("Response from getParashaById:", res); // בדיקה שהבקשה מצליחה
                    setParasha(res.data);
                })
                .catch(err => {
                    console.error("Error fetching parasha:", err); // בדיקה של השגיאה
                });
        } else {
            console.log("No id provided in useParams"); // במקרה ש-id ריק
        }
    }, [id]);

    if (!parasha) {
        console.log("Parasha not loaded yet, displaying Loading..."); // מוודא מה מציגים כשה-parasha עדיין לא נטען
        return <div>Loading...</div>;
    }

    return (
        <div className="parasha-detail">
             <img
                src={parasha.image.url}
                alt={parasha.alt || "Parasha Image"}
                className="parasha-image"
            />
            <h1>{parasha.title}</h1>
            <div className="parasha-pages">
                {parasha.longText.map((page, index) => (
                    <div key={index} className="parasha-page">
                        <h2>{page.title}</h2>
                        <p>{page.text}</p>
                    </div>
                ))}
            </div>

            <a href="/beitChabad/parasha">לפרשות קודמות</a>
        </div>
    );
};

export default ParashaDetail;
