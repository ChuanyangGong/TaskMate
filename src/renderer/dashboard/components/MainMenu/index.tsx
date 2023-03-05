import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { FilterParamType, LoadTaskListFuncType, MenuItem } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';

interface MainMenuProps {
  buttonList: MenuItem[];
  selectedTitle: string;
  setSelectedTitle: Dispatch<SetStateAction<string>>;
  setFilterParam: Dispatch<SetStateAction<FilterParamType>>;
  filterParam: FilterParamType;
}

export default function MainMenu(props: MainMenuProps) {
  const { buttonList, selectedTitle, setSelectedTitle, setFilterParam, filterParam } = props;

  const onSelect = useCallback(
    (menuItem: MenuItem) => {
      setSelectedTitle(menuItem.title);
      setFilterParam({...filterParam, taskStatus: menuItem.taskStatus});
    },
    [setSelectedTitle, setFilterParam]
  );

  // 初始化被选中的 menu item
  useEffect(() => {
    buttonList.some((item) => {
      if (item.show) {
        onSelect(item);
      }
      return item.show;
    });
  }, []);

  // 渲染 menu item
  const MenuItemButton = useMemo(() => {
    return buttonList
      .filter((item) => item.show)
      .map((item) => {
        return (
          <div
            key={item.title}
            className={`${styles.MenuItemWrap} ${
              item.title === selectedTitle ? styles.selected : ''
            }`}
            onClick={() => onSelect(item)}
          >
            <Iconfont
              iconName={`icon-${item.icon}`}
              size={20}
              iconColor={item.iconColor}
            />
            <span className={styles.title}>{item.title}</span>
          </div>
        );
      });
  }, [buttonList, onSelect, selectedTitle]);

  return (
    <div className={styles.menuWrap}>
      {/* 头像 */}
      <div className={styles.userInfoWrap} />
      {/* 一级列表 */}
      {MenuItemButton}
    </div>
  );
}
