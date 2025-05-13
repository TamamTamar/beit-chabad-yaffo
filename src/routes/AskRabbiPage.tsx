import React, { useState } from 'react';
import './AskRabbiPage.scss';

const AskRabbiPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // פה את יכולה לשלוח את הנתונים לשרת או ל-EmailJS
    console.log('נשלח:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', question: '' });
  };

  return (
    <div className="ask-rabbi-page">
      <h2>שאל את הרב</h2>
      <p>שלחו שאלה הלכתית או אישית, ונשוב אליכם בהקדם.</p>

      {submitted ? (
        <p className="success-message">השאלה נשלחה בהצלחה! תודה על הפנייה.</p>
      ) : (
        <form onSubmit={handleSubmit} className="ask-rabbi-form">
          <input
            type="text"
            name="name"
            placeholder="שם מלא"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="question"
            placeholder="השאלה שלך"
            value={formData.question}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">שלח שאלה</button>
        </form>
      )}
    </div>
  );
};

export default AskRabbiPage;
