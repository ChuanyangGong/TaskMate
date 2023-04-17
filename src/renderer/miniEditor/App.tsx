import { SetStateAction, useCallback, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.scss';
import styles from './App.module.scss';
import { ConfigProvider, Input } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import EditorContent from './components/EditorContent';
import EditorFooter from './components/EditorFooter';

export default function App() {
  const [isActivate, setIsActivate] = useState(true);

  const [curState, setCurState] = useState();

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.framework}>
        {/* 有一个 4x 的透明边框用来做阴影效果 */}
        <div className={styles.recorderWrap}>
          <div className={styles.contentWrap}>
            <EditorContent />
            <EditorFooter />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
