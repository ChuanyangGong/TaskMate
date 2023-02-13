import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Divider from 'renderer/components/Divider';
import Iconfont from 'renderer/components/Iconfont';
import { DefaultItem } from 'typings/renderer/dashboard/components/App';
import styles from './index.module.scss';

interface TaskMenuProps {
  defaultList: DefaultItem[];
  selectedSubId: string;
  setSelectedSubId: Dispatch<SetStateAction<string>>;
}

const defaultFilterList = [
  {
    name: '分类',
    id: 'category',
    hint: '',
    expand: true,
  },
  {
    name: '标签',
    id: 'tag',
    hint: '',
    expand: false,
  },
];

export default function TaskMenu(props: TaskMenuProps) {
  const { defaultList, selectedSubId, setSelectedSubId } = props;

  // 选择过滤条件
  const onSelected = useCallback(
    (type: string, id: string) => {
      setSelectedSubId(`${type}|${id}`);
    },
    [setSelectedSubId]
  );

  // 过滤器
  const [filterList, setFilterList] = useState(defaultFilterList);

  // 渲染默认选项
  const DefaultItems = useMemo(() => {
    return defaultList.map((item) => {
      return (
        <div
          className={`${styles.commonWrap} ${styles.defaultWrap} ${
            `default|${item.id}` === selectedSubId ? styles.commonSelected : ''
          }`}
          key={item.id}
          onClick={() => onSelected('default', item.id)}
        >
          <Iconfont
            iconName={`icon-${item.icon}`}
            size={18}
            iconColor="#989BA3"
          />
          <span className={styles.title}>{item.title}</span>
        </div>
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
        <div
          key={item.id}
          className={`${styles.commonWrap} ${styles.defaultWrap}} ${styles.filterRoot}`}
          onClick={() => onChangeExpand(item.id)}
        >
          <div
            className={`${styles.iconWrap} ${item.expand ? styles.expand : ''}`}
          >
            <Iconfont iconName="icon-arrow-right" size={12} />
          </div>
          {item.name}
        </div>
      );
    });
  }, [filterList, onChangeExpand]);

  return (
    <div className={styles.menuWrap}>
      {/* 默认框 */}
      {DefaultItems}
      <Divider top={8} />
      {/* 过滤器 */}
      {FilterItems}
    </div>
  );
}
