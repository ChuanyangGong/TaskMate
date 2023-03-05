import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import ListCommonFilter from './components/ListCommonFilter';
import ListHeader from './components/ListHeader';
import ListItems from './components/ListItems';
import styles from './index.module.scss';


interface TaskListProps {
  hideTaskMenu: boolean;
  setHideTaskMenu: Dispatch<SetStateAction<boolean>>;
  selectedSubId: { id: string; title: string; };
  filterParam: FilterParamType;
  setFilterParam: Dispatch<SetStateAction<FilterParamType>>;
}

export default function TaskList(props: TaskListProps) {
  const {
    hideTaskMenu,
    setHideTaskMenu,
    selectedSubId,
    filterParam,
    setFilterParam,
  } = props;

  const canDateRangeModify = useMemo(() => {
    const [type, id] = selectedSubId.id.split('|');
    return !(type === 'default' && (['today', 'last-week'].includes(id)));
  }, [selectedSubId]);

  return (
    <div className={styles.menuWrap}>
      <ListHeader
        hideTaskMenu={hideTaskMenu}
        setHideTaskMenu={setHideTaskMenu}
        selectedSubId={selectedSubId}
      />
      <ListCommonFilter
        filterParam={filterParam}
        setFilterParam={setFilterParam}
        canDateRangeModify={canDateRangeModify}
      />
      <ListItems />
    </div>
  );
}
