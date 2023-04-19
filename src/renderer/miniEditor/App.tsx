import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.scss';
import styles from './App.module.scss';
import { ConfigProvider, Input } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import EditorContent from './components/EditorContent';
import EditorFooter from './components/EditorFooter';

export default function App() {
  const [isFocus, setIsFocus] = useState(true);
  const [curState, setCurState] = useState();

  // 处理聚焦、失焦事件
  useEffect(() => {
    window.electron.miniEditor.invokeFocusOrBlur((_: any, value: string) => {
      if (value === 'focus') {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    })
    return () => {
      window.electron.miniEditor.clearInvokeFocusOrBlur();
    }
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <div className={`${styles.framework} ${isFocus ? '' : styles.frameworkBlur}`}>
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
