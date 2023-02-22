import { Dispatch, SetStateAction, useEffect } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface ListHeaderProps {
  hideTaskMenu: boolean;
  setHideTaskMenu: Dispatch<SetStateAction<boolean>>;
  selectedSubId: { id: string; title: string; };
}

export default function ListHeader(props: ListHeaderProps) {
  const {
    hideTaskMenu,
    setHideTaskMenu,
    selectedSubId,
  } = props;

  return (
    <div
      className={styles.ListHeaderWrap}
    >
      <div className={styles.iconWrap} onClick={() => {setHideTaskMenu(!hideTaskMenu)}}>
        <Iconfont iconName={`icon-${hideTaskMenu ? 'zhankai' : 'shouqi'}`} size={26}/>
      </div>
      <div className={styles.listHeaderName}>{selectedSubId.title}</div>
    </div>
  );
}
