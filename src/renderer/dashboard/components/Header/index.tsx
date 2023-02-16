import { CloseOutlined } from '@ant-design/icons';
import { BorderOutlined, MinusOutlined } from '@ant-design/icons/lib/icons';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface HeaderProps {
  winIsMaximum: boolean;
  setWinIsMaximum: Dispatch<SetStateAction<boolean>>;
}

export default function Header(props: HeaderProps) {
  const { winIsMaximum, setWinIsMaximum } = props;
  const fontSize = 11;

  const onRevertWinSize = useCallback(async () => {
    const newWinIsMaximum = await window.electron.common.revertWindowSize(
      !winIsMaximum
    );
    setWinIsMaximum(newWinIsMaximum);
  }, [setWinIsMaximum, winIsMaximum]);

  const onCloseWindow = useCallback(() => {
    window.electron.common.closeWindow();
  }, []);

  const onMinimizeWindow = useCallback(() => {
    window.electron.common.minimizeWindow();
  }, []);

  return (
    <div className={styles.headerWrap}>
      <div
        className={`${styles.dragArea} ${winIsMaximum ? '' : styles.canDrag}`}
      />
      <div className={styles.buttonArea} onClick={onMinimizeWindow}>
        <Iconfont iconName="icon-24gl-minimization" size={fontSize} />
      </div>
      <div className={styles.buttonArea} onClick={onRevertWinSize}>
        <Iconfont
          iconName={`icon-24gl-${winIsMaximum ? 'minimize2' : 'square'}`}
          size={fontSize}
        />
      </div>
      <div
        className={`${styles.buttonArea} ${styles.closeArea}`}
        onClick={onCloseWindow}
      >
        <Iconfont iconName="icon-24gl-cross" size={fontSize} />
      </div>
    </div>
  );
}
