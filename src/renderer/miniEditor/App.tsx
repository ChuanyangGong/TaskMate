import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../App.scss';
import styles from './App.module.scss';
import { ConfigProvider, Input } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import EditorContent from './components/EditorContent';
import EditorFooter from './components/EditorFooter';
import { TaskDetailItemType } from 'typings/renderer/dashboard/App';

const defaultTaskInfo: TaskDetailItemType = {
  title: '',
  detail: '',
  categoryId: null,
  Category: null,
  forceUpdateCategory: true,
  tagIds: null,
}

export default function App() {
  const [isFocus, setIsFocus] = useState(true);
  const [taskInfo, setTaskInfo] = useState<TaskDetailItemType>(defaultTaskInfo);

  // 处理聚焦、失焦事件
  useEffect(() => {
    window.electron.miniEditor.invokeFocusOrBlur((_: any, value: string) => {
      if (value === 'focus') {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    })
    return () => {
      window.electron.miniEditor.clearInvokeFocusOrBlur();
    }
  }, [])

  // 注册结束计时事件处理
  useEffect(() => {
    window.electron.miniEditor.invokeFinishRecord(async (_: any, timeSlice: [Date, Date][]) => {
      if (timeSlice.length === 0) {
        return;
      }
      // 保存任务
      let duration = 0;
      let startAt = Infinity;
      let endAt = -Infinity;
      let timeSliceList = timeSlice
        ?.filter((item: any) => Array.isArray(item) && item.length === 2)
        ?.map((item: any) => {
          let curDuration = Math.floor((item[1].valueOf() - item[0].valueOf()) / 1000);
          startAt = Math.min(startAt, item[0].valueOf());
          endAt = Math.max(endAt, item[1].valueOf());
          duration += curDuration;
          return {
            startAt: item[0],
            endAt: item[1],
            duration: curDuration,
          }
        }) || [];
      await window.electron.dashboard.updateOrCreateTask({
        ...taskInfo,
        status: 1,
        forceUpdateCategory: true,
        updateTimeSliceList: true,
        timeSliceList,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        duration
      });
      // 清空计时器
      setTaskInfo({
        ...defaultTaskInfo,
        categoryId: taskInfo.categoryId,
        Category: taskInfo.Category,
      })
      window.electron.miniEditor.setRecorderTimeSlice([]);
    })
    return () => {
      window.electron.miniEditor.clearInvokeFinishRecord();
    }
  }, [taskInfo])

  return (
    <ConfigProvider locale={zhCN}>
      <div className={`${styles.framework} ${isFocus ? '' : styles.frameworkBlur}`}>
        {/* 有一个 4x 的透明边框用来做阴影效果 */}
        <div className={styles.recorderWrap}>
          <div className={styles.contentWrap}>
            <EditorContent
              taskInfo={taskInfo}
              setTaskInfo={setTaskInfo}
              isFocus={isFocus}
            />
            <EditorFooter
              taskInfo={taskInfo}
              setTaskInfo={setTaskInfo}
              isFocus={isFocus}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
