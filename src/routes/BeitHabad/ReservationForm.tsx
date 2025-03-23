import React, { useState } from "react";

interface ReservationData {
  date: string;
  guests: number;
  meals: number;
}

const availableDates = [
  { label: "פרשת פקודי", date: "2025-03-28", time: "18:40" },
  { label: "פרשת ויקרא", date: "2025-04-04", time: "18:45" },
  { label: "פרשת צו", date: "2025-04-11", time: "18:45" },
];

const ReservationForm: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [guests, setGuests] = useState(1);
  const [meals, setMeals] = useState(0);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % availableDates.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + availableDates.length) % availableDates.length);
  };

  const handleSubmit = async () => {
    const reservation: ReservationData = {
      date: availableDates[selectedIndex].date,
      guests,
      meals,
    };
    
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });
      
      if (!response.ok) throw new Error("Failed to submit reservation");
      alert("Reservation successful!");
    } catch (error) {
      console.error(error);
      alert("Error submitting reservation");
    }
  };

  return (
    <div className="reservation-form">
      <button onClick={handlePrev}>⬅️</button>
      <div>
        <h3>{availableDates[selectedIndex].label}</h3>
        <p>{availableDates[selectedIndex].time} | {availableDates[selectedIndex].date}</p>
      </div>
      <button onClick={handleNext}>➡️</button>

      <label>
        כמה באים?
        <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} min={1} />
      </label>
      <label>
        סעודת שבת בבוקר?
        <input type="number" value={meals} onChange={(e) => setMeals(Number(e.target.value))} min={0} />
      </label>
      
      <button onClick={handleSubmit}>המשך</button>
    </div>
  );
};

export default ReservationForm;
