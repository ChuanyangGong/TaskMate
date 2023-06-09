import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Divider from 'renderer/components/Divider';
import { DefaultItemType, selectedSubIdType } from 'typings/renderer/dashboard/App';
import { FilterItemType } from 'typings/renderer/dashboard/components/TaskMenu';
import DefaultItem from './components/DefaultItem';
import FilterItem from './components/FilterItem';
import styles from './index.module.scss';

interface TaskMenuProps {
  defaultList: DefaultItemType[];
  selectedSubId: { id: string; title: string; };
  doSetSelectedSubId: (newSelectedSubId: selectedSubIdType) => void;
  hoveredId: string;
  setHoveredId: Dispatch<SetStateAction<string>>;
  hideTaskMenu: boolean;
  setHideTaskMenu: Dispatch<SetStateAction<boolean>>;
}

const defaultFilterList: FilterItemType[] = [
  {
    name: '分类',
    id: 'category',
    hint: '对任务进行划分',
    expand: true,
    children: [],
  },
  {
    name: '标签',
    id: 'tag',
    hint: '以标签的形式对任务进行进一步划分',
    expand: false,
    children: [],
  },
];

export default function TaskMenu(props: TaskMenuProps) {
  const {
    defaultList,
    selectedSubId,
    doSetSelectedSubId,
    hoveredId,
    setHoveredId,
    hideTaskMenu,
    setHideTaskMenu,
  } = props;

  // 选择过滤条件
  const onSelected = useCallback(
    (type: string, id: string, title: string) => {
      doSetSelectedSubId({
        id: `${type}|${id}`,
        title
      });
    },
    [doSetSelectedSubId]
  );

  // 初始化默认选择所有
  useEffect(() => {
    doSetSelectedSubId({
      id: `default|${defaultList[0].id}`,
      title: '所有',
    })
  }, []);

  // hover
  const onEnter = useCallback(
    (type: string, id: string) => {
      setHoveredId(`${type}|${id}`);
    },
    [setHoveredId]
  );

  const onLeave = useCallback(() => {
    setHoveredId('');
  }, [setHoveredId]);

  // 过滤器
  const [filterList, setFilterList] = useState(defaultFilterList);

  // 更新下拉列表数据
  const getFilterListChildren = useCallback(
    async () => {
      const data = await window.electron.dashboard.getFilterListChildren();
      const newFilterList = filterList.map((item) => {
        item.children = data[item.id];
        return item;
      })
      setFilterList(newFilterList);
    },
    [filterList]
  );

  useEffect(() => {
    getFilterListChildren();
  }, []);

  // 渲染默认选项
  const DefaultItems = useMemo(() => {
    return defaultList.map((item) => {
      return (
        <DefaultItem
          key={item.id}
          itemData={item}
          selectedSubId={selectedSubId}
          onSelected={onSelected}
        />
      );
    });
  }, [defaultList, onSelected, selectedSubId]);

  // 缩放过滤选项
  const onChangeExpand = useCallback(
    (id: string) => {
      const newFilterList = filterList.map((item) => {
        if (item.id === id) {
          item.expand = !item.expand;
        }
        return item;
      });
      setFilterList(newFilterList);
    },
    [filterList]
  );

  // 渲染过滤选项
  const FilterItems = useMemo(() => {
    return filterList.map((item) => {
      return (
        <FilterItem
          key={item.id}
          itemData={item}
          onChangeExpand={onChangeExpand}
          selectedSubId={selectedSubId}
          onSelected={onSelected}
          hoveredId={hoveredId}
          onEnter={onEnter}
          onLeave={onLeave}
          invokeUpdate={getFilterListChildren}
        />
      );
    });
  }, [
    filterList,
    hoveredId,
    onChangeExpand,
    onEnter,
    onLeave,
    onSelected,
    selectedSubId,
  ]);

  return (
    <div className={styles.menuWrap} style={hideTaskMenu ? {width: 0, padding: 0, border: 'none'} : {}}>
      {/* 默认框 */}
      {DefaultItems}
      <Divider top={8} />
      {/* 过滤器 */}
      {FilterItems}
    </div>
  );
}
