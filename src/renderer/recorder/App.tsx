import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.scss';
import styles from './App.module.scss';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import RecorderHeader from './components/header';
import RecorderContent from './components/content';

export default function App() {
  const [isFocus, setIsFocus] = useState(true);
  const [curState, setCurState] = useState();

  // 处理聚焦、失焦事件
  useEffect(() => {
    window.electron.recorder.invokeFocusOrBlur((_: any, value: string) => {
      if (value === 'focus') {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    })
    return () => {
      window.electron.recorder.clearInvokeFocusOrBlur();
    }
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <div className={`${styles.framework} ${isFocus ? '' : styles.frameworkBlur}`}>
        <div className={styles.recorderWrap}>
          {/* 头部 */}
          <RecorderHeader />
          {/* 内容 */}
          <RecorderContent />
        </div>
      </div>
    </ConfigProvider>
  );
}
