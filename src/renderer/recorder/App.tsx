import { SetStateAction, useCallback, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.scss';
import styles from './App.module.scss';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import Header from './components/header';
import RecorderHeader from './components/header';
import RecorderContent from './components/content';

export default function App() {
  const [isActivate, setIsActivate] = useState(true);

  const [curState, setCurState] = useState();

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.framework}>
        <div className={styles.recorderWrap}>
          {/* 头部 */}
          {isActivate && <RecorderHeader />}
          {/* 内容 */}
          <RecorderContent />
        </div>
      </div>
    </ConfigProvider>
  );
}
