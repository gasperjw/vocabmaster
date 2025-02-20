import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Expand Your Vocabulary</h1>
        <p className="subtitle">
          Enhance your reading, learn new words, and test your knowledge with our streamlined approach.
        </p>
        
        <div className="button-container">
          <Link to="/read" className="nav-button reading">
            <span className="icon">📖</span>
            <span className="text">Reading Practice</span>
          </Link>

          <Link to="/flashcards" className="nav-button flashcards">
            <span className="icon">🗂️</span>
            <span className="text">Flashcards</span>
          </Link>

          <Link to="/quiz" className="nav-button quiz">
            <span className="icon">✍️</span>
            <span className="text">Word Quiz</span>
          </Link>
        </div>
      </div>
    </div>
  );
}