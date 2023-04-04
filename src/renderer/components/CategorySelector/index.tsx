

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';
import { Input } from 'antd';

const defaultCategoryList = [{
  id: null,
  name: '未分类',
  CategoryAliases: [],
}];

interface CategorySelectorProps {
  selectedId: null | number
  onUpdateSelector: (id: number | null) => Promise<void>,
}

export default function CategorySelector(props: CategorySelectorProps) {
  const { selectedId, onUpdateSelector } = props;

  // focus input 框
  const inputRef = useRef<any>(null);

  // 获取所有可选项列表
  const [searchText, setSearchText] = useState('');
  const [selectorList, setSelectorList] = useState<any[]>([]);
  const getTotalList = useCallback(async () => {
    const res = await window.electron.dashboard.getFilterListChildren();
    const selectorItems = res.category.map((item: any) => {
      return {
        CategoryAliases: item.CategoryAliases,
        id: item.id,
        name: item.name
      }
    });
    setSelectorList([...defaultCategoryList, ...selectorItems]);
  }, []);

  // 按下回车键
  const handleEnter = useCallback(() => {
    const item = selectorList.find((item) => {
      let nameList = [item.name, ...item.CategoryAliases.map((it: any) => it.name)];
      return nameList.some((it) => {
        return it.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
      });
    });
    if (item) {
      onUpdateSelector(item.id);
    }
  }, [searchText, selectorList]);

  useEffect(() => {
    getTotalList();
    inputRef.current!.focus({
      cursor: 'start',
    });
  }, []);

  return (
    <div className={styles.catetorySelectorWrap}>
      <Input
        ref={inputRef}
        size="small"
        className={styles.inputStyle}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        onPressEnter={handleEnter}
        value={searchText}
        placeholder='输入名称或别名进行搜索'
      />
      <div className={styles.itemWrap}>
        { selectorList.filter((item) => {
            let nameList = [item.name, ...item.CategoryAliases.map((it: any) => it.name)];
            return nameList.some((it) => {
              return it.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
            })
          }).map((item) => {
            const isSelected = item.id === selectedId;
            const selectedColor = isSelected ? '#4772fa' : '';
            return (
              <div
                className={`${styles.selectorItemWrap} ${isSelected ? styles.selectedStyle : ''}`}
                key={item.id}
                onClick={() => !isSelected && onUpdateSelector(item.id)}
              >
                <Iconfont iconName={`icon-${true ? 'view-list' : 'ic24-tag'}`} size={17} className={styles.iconStyle} iconColor={selectedColor}/>
                <div className={styles.textArea} style={{color: selectedColor}}>{item.name}</div>
                { isSelected ? <Iconfont iconName='icon-correct' size={17} className={styles.iconStyle} iconColor={selectedColor}/> : <></>}
              </div>
            )
        })}
      </div>
    </div>
  )
}
