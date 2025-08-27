import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service";
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLastParasha()
      .then(res => {
        setLastParasha(res);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load the last Parasha. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="latest-parasha">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : lastParasha ? (
        <Link to={`/beitChabad/parasha/${lastParasha._id}`} className="parasha-link">
          <div className="parasha-card">
            {lastParasha.image?.url && (
              <div className="parasha-image-wrapper">
                <img
                  src={lastParasha.image.url}
                  alt={lastParasha.image.alt || lastParasha.title}
                  className="parasha-image"
                />
              </div>
            )}
            <div className="parasha-details">
              <h2 className="parasha-title">{lastParasha.title}</h2>
              <p className="parasha-mini-text">{lastParasha.miniText}</p>
              <p className="parasha-source">{lastParasha.source}</p>
            </div>
          </div>
        </Link>
      ) : (
        <p className="error">No last Parasha available at the moment.</p>
      )}
    </div>
  );
};

export default LastParasha;