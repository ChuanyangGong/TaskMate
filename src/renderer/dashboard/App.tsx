import { Button } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  DefaultItem,
  MenuItem,
} from 'typings/renderer/dashboard/components/App';
import icon from '../../../assets/icon.svg';
import '../App.scss';
import styles from './App.module.scss';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';
import TaskMenu from './components/TaskMenu';

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

const defultSelectionList: DefaultItem[] = [
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
  const [selectedSubId, setSelectedSubId] = useState(
    `default|${defultSelectionList[0].id}`
  );

  return (
    <div className={styles.framework}>
      <div className={styles.dashboardWrap} style={dashboardStyle}>
        <Header winIsMaximum={winIsMaximum} setWinIsMaximum={setWinIsMaximum} />
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
          />
          <TaskList />
        </div>
      </div>
    </div>
  );
}
