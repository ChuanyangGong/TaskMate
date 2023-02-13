import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { MenuItem } from 'typings/renderer/dashboard/components/App';
import styles from './index.module.scss';

interface MainMenuProps {
  buttonList: MenuItem[];
  selectedTitle: string;
  setSelectedTitle: Dispatch<SetStateAction<string>>;
}

export default function MainMenu(props: MainMenuProps) {
  const { buttonList, selectedTitle, setSelectedTitle } = props;

  // 初始化被选中的 menu item
  useEffect(() => {
    buttonList.some((item) => {
      if (item.show) {
        setSelectedTitle(item.title);
      }
      return item.show;
    });
  }, [buttonList, setSelectedTitle]);

  const onSelect = useCallback(
    (menuTitle: string) => {
      setSelectedTitle(menuTitle);
    },
    [setSelectedTitle]
  );

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
            onClick={() => onSelect(item.title)}
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
