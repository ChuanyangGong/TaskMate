import { Button, ConfigProvider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DefaultItemType, FilterParamType, MenuItem, selectedSubIdType, TaskDetailItemType } from 'typings/renderer/dashboard/App';
import '../App.scss';
import zhCN from 'antd/locale/zh_CN';
import styles from './App.module.scss';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';
import TaskMenu from './components/TaskMenu';
import TaskDetail from './components/TaskDetail';
import dayjs from 'dayjs';
import CONST from '../const';
import { TaskRecord } from 'main/database/models/TaskRecord';

const buttonList: MenuItem[] = [
  {
    icon: 'sun',
    iconColor: '#008D8E',
    title: '已做列表',
    show: true,
    taskStatus: 1,
  },
  {
    icon: 'todo',
    iconColor: 'rgba(59, 138, 191, 0.9)',
    title: '待做清单',
    show: true,
    taskStatus: 0,
  },
  {
    icon: 'data06',
    iconColor: '#E47215',
    title: '数据报表',
    show: true,
    taskStatus: 1,
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
  });

  // 当前悬浮的菜单
  const [hoveredId, setHoveredId] = useState('');

  // Task menu 收缩状态
  const [hideTaskMenu, setHideTaskMenu] = useState(false);

  // 任务列表数据
  const [filterParam, setFilterParam] = useState<FilterParamType>({
    taskStatus: 1,
    keyword: '',
    dateRange: null
  });
  const [taskListItems, setTaskListItems] = useState<any[]>([]);

  // 切换 taskMenu，修改过滤器参数
  const doSetSelectedSubId = useCallback((newSelectedSubId: selectedSubIdType) => {
    const [type, id] = newSelectedSubId.id.split('|');
    const { taskStatus } = filterParam;
    const newFilterParam: FilterParamType = {taskStatus, keyword: '', dateRange: null};
    if (type === 'default') {
      const now = dayjs();
      const lastWeek = now.subtract(6, 'day');

      if(id === 'today') {
        newFilterParam.dateRange = [now, now];
      } else if (id === 'last-week') {
        newFilterParam.dateRange = [lastWeek, now];
      }
    } else if (type === 'category') {
      newFilterParam.categoryId = parseInt(id);
    } else if (type === 'tag') {
      newFilterParam.tagId = parseInt(id);
    }
    setFilterParam(newFilterParam);
    setSelectedSubId(newSelectedSubId);
  }, [setSelectedSubId, filterParam]);

  // 处理数据库返回的数据
  const processData = useCallback((datas: any) => {
    return datas.map((item: any) => {
      return {
        ...item,
        tagIds: (item?.Tags || []).map((tag: any) => tag.id),
        dirtyData: false,
      }
    });
  }, []);

  // 当前选中的任务项
  const [selectedItemId, setSelectedItemId] = useState(-1);
  const selectedTaskItem = useMemo(() => {
    return taskListItems.find((item) => item.id === selectedItemId);
  }, [taskListItems, selectedItemId]);

  // 获取数据
  const doGetTaskListData = useCallback(async (reSetSelectedId = true) => {
    // 处理日期
    const newFilterParam: FilterParamType = {...filterParam, dateRangeString: null};
    if (Array.isArray(newFilterParam.dateRange)) {
      newFilterParam.dateRangeString = [
        newFilterParam.dateRange[0].set('second', 0).set('minute', 0).set('hour', 0).format('YYYY-MM-DD HH:mm:ss'),
        newFilterParam.dateRange[1].set('second', 59).set('minute', 59).set('hour', 23).format('YYYY-MM-DD HH:mm:ss'),
      ]
    }
    const data = await window.electron.dashboard.getTaskListData(newFilterParam);
    const processedData = processData(data);
    setTaskListItems(processedData);
    if (reSetSelectedId){
      setSelectedItemId(-1);
    }
  }, [filterParam]);

  useEffect(() => {
    doGetTaskListData();
  }, [doGetTaskListData]);

  // 刷新表单
  useEffect(() => {
      window.electron.dashboard.invokeRefreshTaskList(() => {
        doGetTaskListData(false);
      })
      return () => {
          window.electron.dashboard.clearInvokeRefreshTaskList()
      }
  }, [doGetTaskListData])

  // 添加新任务
  const onClickAddTask = useCallback(async () => {
    let taskDetail: TaskDetailItemType = {
      id: null,
      title: '',
      detail: null,
      planStartAt: null,
      planEndAt: null,
      startAt: null,
      endAt: null,
      duration: null,
      status: filterParam.taskStatus,
      categoryId: null,
      tagIds: [],
      updateTagList: false,
      updateTimeSliceList: false,
      timeSliceList: null,
    }
    if (filterParam?.categoryId) {
      taskDetail.categoryId = filterParam.categoryId;
    }
    if (filterParam?.tagId) {
      taskDetail.tagIds = [filterParam.tagId];
    }
    if (filterParam?.taskStatus === 0 && filterParam?.dateRange) {
      taskDetail.planStartAt = filterParam.dateRange[0].toDate();
      taskDetail.planEndAt = filterParam.dateRange[1].toDate();
    }
   const newTaskId = await window.electron.dashboard.updateOrCreateTask(taskDetail);
   setSelectedItemId(newTaskId);
  }, [filterParam, selectedSubId]);

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
              setFilterParam={setFilterParam}
              filterParam={filterParam}
            />
            <TaskMenu
              defaultList={defultSelectionList}
              selectedSubId={selectedSubId}
              doSetSelectedSubId={doSetSelectedSubId}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              hideTaskMenu={hideTaskMenu}
              setHideTaskMenu={setHideTaskMenu}
            />
            <TaskList
              hideTaskMenu={hideTaskMenu}
              setHideTaskMenu={setHideTaskMenu}
              selectedSubId={selectedSubId}
              filterParam={filterParam}
              setFilterParam={setFilterParam}
              taskListItems={taskListItems}
              setSelectedItemId={setSelectedItemId}
              selectedItemId={selectedItemId}
              onClickAddTask={onClickAddTask}
            />
            <TaskDetail
              filterParam={filterParam}
              selectedItemId={selectedItemId}
              hasTasks={taskListItems.length > 0}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
