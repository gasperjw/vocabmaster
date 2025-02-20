import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

function Reading() {
  const navigate = useNavigate();
  const [passages, setPassages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContext, setShowContext] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  // Fisher-Yates shuffle function
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load CSV data using Papa.parse
  useEffect(() => {
    Papa.parse('/passages.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const headersMap = {
          'Literary Anylasis': 'LiteraryAnalysis'
        };
        return headersMap[header] || header.replace(/\s+/g, '');
      },
      complete: (results) => {
        if (results.errors.length) {
          setError('Error parsing CSV file');
        } else {
          const shuffledPassages = shuffleArray(results.data);
          setPassages(shuffledPassages);
        }
        setLoading(false);
      },
      error: (err) => {
        setError('Failed to load CSV file');
        setLoading(false);
      }
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // Include passages in dependency to avoid errors if data isn't loaded yet
  }, [currentIndex, passages]);

  // Swipe handling
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();   // Swipe left
    if (diff < -50) handlePrevious(); // Swipe right
  };

  const handleNext = () => {
    if (!passages.length) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % passages.length);
    resetViews();
  };

  const handlePrevious = () => {
    if (!passages.length) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + passages.length) % passages.length);
    resetViews();
  };

  const resetViews = () => {
    setShowContext(false);
    setShowAnalysis(false);
  };

  // Loading and error states
  if (loading) {
    return <div className="loading">Loading passages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!passages.length) {
    return <div className="error">No passages found</div>;
  }

  // Main UI
  return (
    <div
      className="reading-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className="passage-meta">
        <h2>{passages[currentIndex].Book}</h2>
        <h3>by {passages[currentIndex].Author}</h3>
      </div>

      <div className="passage-content">
        <div className="passage-text">
          {passages[currentIndex].Passage}
        </div>

        {showContext && (
          <div className="context-box">
            <h4>Context</h4>
            <p>{passages[currentIndex].Context}</p>
          </div>
        )}

        {showAnalysis && (
          <div className="analysis-box">
            <h4>Literary Analysis</h4>
            <p>{passages[currentIndex].LiteraryAnalysis}</p>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrevious}>← Previous</button>
        <span>{currentIndex + 1} / {passages.length}</span>
        <button onClick={handleNext}>Next →</button>
      </div>

      <div className="toggle-controls">
        <button 
          onClick={() => setShowContext(!showContext)}
          className={`toggle-button ${showContext ? 'active' : ''}`}
        >
          {showContext ? 'Hide Context' : 'Show Context'}
        </button>

        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className={`toggle-button ${showAnalysis ? 'active' : ''}`}
        >
          {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
        </button>
      </div>
    </div>
  );
}

export default Reading;
