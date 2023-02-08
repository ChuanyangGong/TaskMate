import { useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.css';

const Hello = () => {
  return <div>recorder adas</div>;
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
