const BranchesSection = () => {
  return (
    <section className="branches-section">
      <h2>הסניפים שלנו</h2>
      <p>הכירו את בתי חב״ד ברחבי יפו</p>

      <div className="branch">
        <h3>בית חב״ד מרכזי</h3>
        <p>הרב לוי יצחק תמם</p>
        <img src="/img/center.jpg" alt="בית חב״ד מרכזי" />
        <p>טלפון: 03-1234567 | כתובת: יפו העתיקה</p>
      </div>

      <div className="branch">
        <h3>בית חב״ד בקמפוס</h3>
        <p>שליח: הרב ___ | שליחה: ___</p>
        <img src="/img/campus.jpg" alt="בית חב״ד בקמפוס" />
        <p>טלפון: ___ | כתובת: ___</p>
      </div>

      <div className="branch">
        <h3>בית חב״ד שכונת צהלון</h3>
        <p>שליח: הרב ___ | שליחה: ___</p>
        <img src="/img/zahlon.jpg" alt="בית חב״ד צהלון" />
        <p>טלפון: ___ | כתובת: ___</p>
      </div>

      <div className="branch">
        <h3>בית תמחוי</h3>
        <p>שליח: הרב ___ | שליחה: ___</p>
        <img src="/img/soupkitchen.jpg" alt="בית תמחוי" />
        <p>טלפון: ___ | כתובת: ___</p>
      </div>

      <div className="branch">
        <h3>בתי כנסת ביפו</h3>
        <ul>
          <li>שכונת גבעת העלייה – בית כנסת ___ | שחרית 7:00, מנחה 18:30</li>
          <li>שכונת עג׳מי – בית כנסת ___ | שחרית 8:00, ערבית 19:00</li>
          <li>שכונת צהלון – בית כנסת ___ | שחרית 6:30, מנחה וערבית רצוף</li>
        </ul>
      </div>
    </section>
  );
};

export default BranchesSection;
