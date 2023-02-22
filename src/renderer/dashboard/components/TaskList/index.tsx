import { Dispatch, SetStateAction, useEffect } from 'react';
import ListCommonFilter from './components/ListCommonFilter';
import ListHeader from './components/ListHeader';
import ListItems from './components/ListItems';
import styles from './index.module.scss';


interface TaskListProps {
  hideTaskMenu: boolean;
  setHideTaskMenu: Dispatch<SetStateAction<boolean>>;
  selectedSubId: { id: string; title: string; };
}

export default function TaskList(props: TaskListProps) {
  const {
    hideTaskMenu,
    setHideTaskMenu,
    selectedSubId
  } = props;

  return (
    <div className={styles.menuWrap}>
      <ListHeader
        hideTaskMenu={hideTaskMenu}
        setHideTaskMenu={setHideTaskMenu}
        selectedSubId={selectedSubId}
      />
      <ListCommonFilter />
      <ListItems />
    </div>
  );
}
