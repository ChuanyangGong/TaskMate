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

interface RecorderHeaderProps {
  className?: string;
}

export default function RecorderHeader(props: RecorderHeaderProps) {
  const {className = ''} = props;

  return (
    <div className={styles.headerWrap}>
      <div className={styles.dragArea} />
      <div className={styles.buttonArea}>
        <Iconfont iconName="icon-24gl-minimization" size={10} />
      </div>
      <div className={styles.buttonArea} style={{marginRight: 9}}>
        <Iconfont iconName="icon-24gl-cross" size={10} />
      </div>
    </div>
  );
}
