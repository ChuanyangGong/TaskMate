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

interface StopButtonProps {
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export default function StopButton(props: StopButtonProps) {
  const {style, className, onClick} = props;

  return (
    <div className={`${styles.StopButtonWrap} ${className ?? ''}`} style={style} onClick={onClick}>
      <div className={styles.line}/>
      <div className={styles.line}/>
    </div>
  );
}
