import { useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../../assets/icon.svg';
import '../App.css';

const Hello = () => {
  const openAnotherWindow = useCallback(() => {
    window.electron.openAnotherWindow();
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <div>
          <button type="button" onClick={openAnotherWindow}>
            <span role="img" aria-label="books">
              📚
            </span>
            Open another window
          </button>
        </div>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
