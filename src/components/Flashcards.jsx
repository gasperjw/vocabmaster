import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Flashcards.css';

// Flashcard data array
const flashcardsData = [
  {
    id: 1,
    word: "Serendipity",
    phonetics: "/ˌserənˈdɪpəti/",
    definition: "The occurrence of events by chance in a happy or beneficial way",
    example: "Through serendipity, they met at the airport when their flights were delayed.",
    pos: "Noun",
    image: "https://images.pexels.com/photos/20787/pexels-photo.jpg"
  },
  {
    id: 2,
    word: "Ephemeral",
    phonetics: "/ɪˈfemərəl/",
    definition: "Lasting for a very short time",
    example: "The beauty of cherry blossoms is ephemeral.",
    pos: "Adjective",
    image: "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg"
  }
  // Add more flashcards as needed
];

const Flashcards = () => {
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // For swipe detection
  const touchStartX = useRef(null);

  const currentCard = flashcardsData[currentCardIndex];

  const handleNextCard = () => {
    if (currentCardIndex < flashcardsData.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setShowDetails(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setShowDetails(false);
    }
  };

  // Handle keyboard events for desktop users (optional)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      } else if (e.key === ' ') {
        // Prevent the page from scrolling when pressing space
        e.preventDefault();
        setShowDetails((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCardIndex]);

  // Touch events to detect swipes on mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;

    // Adjust threshold as needed
    const swipeThreshold = 50;

    if (diffX > swipeThreshold) {
      // Swiped right
      handlePrevCard();
    } else if (diffX < -swipeThreshold) {
      // Swiped left
      handleNextCard();
    }

    touchStartX.current = null;
  };

  // Calculate progress
  const progressPercentage = ((currentCardIndex + 1) / flashcardsData.length) * 100;

  return (
    <>
      {/* Back (ack) button is now OUTSIDE the main container */}
      <button className="fc-back-btn" onClick={() => navigate('/')}>← Back</button>

      <div className="fc-container">
        <div className="fc-header">
          <h1>Learn Today’s Words</h1>
          <p>Expand your vocabulary with a new word every day</p>
        </div>

        <div className="fc-progress-container">
          <div className="fc-progress-bar">
            <div className="fc-progress" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="fc-progress-text">
            {currentCardIndex + 1}/{flashcardsData.length} Complete
          </div>
        </div>

        {/* 
          Add touch listeners to the card so that swiping left or right triggers 
          prev/next card. We also attach onClick to the card background so that 
          tapping/clicking toggles the word details.
        */}
        <div
          className="fc-card"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="fc-card-background"
            style={{ backgroundImage: `url(${currentCard.image})` }}
            onClick={() => setShowDetails((prev) => !prev)}
          />
          <div className="fc-card-overlay">
            <span className="fc-pos-badge">{currentCard.pos}</span>
            <h2 className="fc-word">{currentCard.word}</h2>

            {showDetails && (
              <>
                <p className="fc-phonetics">{currentCard.phonetics}</p>
                <p className="fc-definition">{currentCard.definition}</p>
                <p className="fc-example">
                  <em>{currentCard.example}</em>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="fc-actions">
          <button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
            ← Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcardsData.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
};

export default Flashcards;
