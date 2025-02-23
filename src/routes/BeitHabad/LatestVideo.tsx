import { useEffect, useState } from 'react';
import axios from 'axios';
import './LatestVideo.scss';

const API_URL = 'https://node-tandt-shop.onrender.com/api/v1/videos/latest-video';

function LatestVideo() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // פונקציה להמרת URL לפורמט Embed
  const getEmbedUrl = (url: string) => {
    if (url && url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return null; // החזר null אם הפורמט שגוי
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(API_URL);
        const videoUrl = response.data.videoUrl;

        // בדיקת פורמט ה-URL
        if (videoUrl && videoUrl.includes('watch?v=')) {
          setVideoUrl(videoUrl);
        } else {
          setError("Invalid video URL format.");
        }
      } catch (error) {
        setError("Failed to load the latest video. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  return (
    <div className="latest-video-container">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : videoUrl ? (
        <iframe
          src={getEmbedUrl(videoUrl) || ""}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No video available at the moment.</p>
      )}
    </div>
  );
}

export default LatestVideo;