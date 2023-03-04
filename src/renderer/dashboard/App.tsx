import { Button, ConfigProvider } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { DefaultItemType, MenuItem } from 'typings/renderer/dashboard/App';
import '../App.scss';
import zhCN from 'antd/locale/zh_CN';
import styles from './App.module.scss';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';
import TaskMenu from './components/TaskMenu';
import TaskDetail from './components/TaskDetail';

const buttonList: MenuItem[] = [
  {
    icon: 'sun',
    iconColor: '#008D8E',
    title: '已做列表',
    show: true,
  },
  {
    icon: 'todo',
    iconColor: 'rgba(59, 138, 191, 0.9)',
    title: '待做清单',
    show: true,
  },
  {
    icon: 'data06',
    iconColor: '#E47215',
    title: '数据报表',
    show: true,
  },
];

const defultSelectionList: DefaultItemType[] = [
  {
    icon: 'archive',
    title: '所有',
    id: 'all',
  },
  {
    icon: 'today',
    title: '今天',
    id: 'today',
  },
  {
    icon: 'bx-calendar-week',
    title: '最近7天',
    id: 'last-week',
  },
];

export default function App() {
  // 设置外框大小
  const [winIsMaximum, setWinIsMaximum] = useState(false);
  const dashboardStyle = useMemo(() => {
    if (winIsMaximum) {
      return { width: '100%', height: '100%' };
    }
    return {};
  }, [winIsMaximum]);

  // 当前选中的菜单
  const [selectedTitle, setSelectedTitle] = useState('');

  // 当前选中的子菜单
  const [selectedSubId, setSelectedSubId] = useState({
    id: `default|${defultSelectionList[0].id}`,
    title: '所有',
  }
  );

  // 当前悬浮的菜单
  const [hoveredId, setHoveredId] = useState('');

  // Task menu 收缩状态
  const [hideTaskMenu, setHideTaskMenu] = useState(false);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.framework}>
        <div className={styles.dashboardWrap} style={dashboardStyle}>
          <Header
            winIsMaximum={winIsMaximum}
            setWinIsMaximum={setWinIsMaximum}
          />
          {/* dashboard content */}
          <div className={styles.dashboardContentWrap}>
            <MainMenu
              buttonList={buttonList}
              selectedTitle={selectedTitle}
              setSelectedTitle={setSelectedTitle}
            />
            <TaskMenu
              defaultList={defultSelectionList}
              selectedSubId={selectedSubId}
              setSelectedSubId={setSelectedSubId}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              hideTaskMenu={hideTaskMenu}
              setHideTaskMenu={setHideTaskMenu}
            />
            <TaskList
              hideTaskMenu={hideTaskMenu}
              setHideTaskMenu={setHideTaskMenu}
              selectedSubId={selectedSubId}
            />
            <TaskDetail />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
