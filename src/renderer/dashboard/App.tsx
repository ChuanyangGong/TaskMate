import { Button } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../../assets/icon.svg';
import '../App.scss';
import styles from './App.module.scss';
import Header from './components/Header';

export default function App() {
  const [winIsMaximum, setWinIsMaximum] = useState(false);
  const dashboardStyle = useMemo(() => {
    if (winIsMaximum) {
      return { width: '100%', height: '100%' };
    }
    return {};
  }, [winIsMaximum]);

  return (
    <div className={styles.framework}>
      <div className={styles.dashboardWrap} style={dashboardStyle}>
        <Header winIsMaximum={winIsMaximum} setWinIsMaximum={setWinIsMaximum} />
      </div>
    </div>
  );
}
