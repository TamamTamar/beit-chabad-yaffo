import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Parasha } from "../../@Types/chabadType";
import './ParashaList.scss';
import { getAllParashot } from "../../services/parasha-service";

const ParashaList = () => {
  const [parashot, setParashot] = useState<Parasha[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllParashot()
      .then(res => {
        console.log('Fetched data all parashot:', res);
        const data = Array.isArray(res) ? res : [];
        setParashot(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching parashot:", err);
        setError("An error occurred while fetching the data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

    return (
      <div className="parasha-list">
          <h1>All Parashot</h1>
          {parashot.length === 0 ? (
              <p>No Parashot available at the moment.</p>
          ) : (
              parashot.map(parasha => (
                  <div key={parasha._id} className="parasha-item">
                      <h2>{parasha.title}</h2>
                      <p>{parasha.miniText}</p>
                      {parasha.image?.url && ( // הצגת תמונה רק אם יש URL
                          <img 
                              src={parasha.image.url} 
                              alt={parasha.image.alt || parasha.title} 
                              className="parasha-image" 
                          />
                      )}
                      <Link to={`/beitChabad/parasha/${parasha._id}`}>Read More</Link>
                  </div>
              ))
          )}
      </div>
  );
  
};

export default ParashaList;
