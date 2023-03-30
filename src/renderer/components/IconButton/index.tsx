import { Dispatch, SetStateAction, useEffect } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface IconButtonProps {
  iconName: string;
  iconSize?: number;
  style?: any;
  className?: string;
  onClick?: any;
}

export default function IconButton(props: IconButtonProps) {
  const {
    style={},
    className='',
    iconName,
    iconSize=24,
    onClick=() => {},
  } = props;

  return (
    <div style={style} className={`${className} ${styles.iconWrap}`} onClick={onClick}>
      <Iconfont iconName={iconName} size={iconSize}/>
    </div>
  );
}
