import { CloseOutlined } from '@ant-design/icons';
import { BorderOutlined, MinusOutlined } from '@ant-design/icons/lib/icons';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './index.module.scss';
import StopButton from 'renderer/components/StopButton';
import CONST from '../../../const';
import { TaskDetailItemType } from 'typings/renderer/dashboard/App';
import { TaskRecord } from 'main/database/models/TaskRecord';
interface RecorderContentProps {
}

export default function RecorderContent(props: RecorderContentProps) {
  const [recorderStatus, setRecorderStatus] = useState(CONST.RECORDER_STATE_READY);
  const [timeSlice, setTimeSlice] = useState<[Date, Date | null][]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [intervalHandler, setIntervalHandler] = useState(0);

  const calcTotalSeconds = useCallback((timeRecords: [Date, Date | null][]) => {
    let newTotalSeconds = 0;
    timeRecords.forEach((timeRecord) => {
      let [startTime, endTime] = timeRecord;
      if (endTime === null) {
        endTime = new Date();
      }
      newTotalSeconds += (endTime.getTime() - startTime.getTime()) / 1000;
    });
    return newTotalSeconds;
  }, []);

  // 注册计时器修改函数
  useEffect(() => {
    window.electron.recorder.setRecorderStatus((_: any, timeSlice: [Date, Date][]) => {
      setRecorderStatus(
        timeSlice.length > 0 ? CONST.RECORDER_STATE_STOP : CONST.RECORDER_STATE_READY
      );
      setTimeSlice(timeSlice);
      setTotalSeconds(calcTotalSeconds(timeSlice));
    })
    return () => {
      window.electron.recorder.clearSetRecorderStatus();
    }
  }, [])

  // 通过当前时间计算小时字符数
  const timeString = useMemo(() => {
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let second = Math.floor(totalSeconds - hour * 3600 - minute * 60);
    let resultStr = `${hour.toString().padStart(1, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    return resultStr;
  }, [totalSeconds]);

  // 启动定时任务
  const startInterval = useCallback((timeRecords: [Date, Date | null][]) => {
    const handler = window.setInterval(() => {
      setTotalSeconds(calcTotalSeconds(timeRecords));
    }, 90)
    if (intervalHandler !== null) {
        window.clearInterval(intervalHandler)
    }
    setIntervalHandler(handler)
  }, [intervalHandler]);

  // 点击开始按钮
  const onClickStart = useCallback(() => {
    if (recorderStatus !== CONST.RECORDER_STATE_RECORDING) {
      let newTimeSlice = [...timeSlice];
      newTimeSlice.push([ new Date(), null ]);
      setTimeSlice(newTimeSlice);
      setRecorderStatus(CONST.RECORDER_STATE_RECORDING);
      startInterval(newTimeSlice)
    }
  }, [recorderStatus, timeSlice, startInterval]);

  // 点击暂停按钮
  const onClickStop = useCallback(() => {
    if (recorderStatus === CONST.RECORDER_STATE_RECORDING) {
      let newTimeSlice = [...timeSlice];
      timeSlice[timeSlice.length - 1][1] = new Date();
      setTimeSlice(newTimeSlice);

      // 清楚定时器
      if (intervalHandler !== null) {
        window.clearInterval(intervalHandler)
      }
      setRecorderStatus(CONST.RECORDER_STATE_STOP);
    }
  }, [recorderStatus, timeSlice, intervalHandler]);

  // 点击结束按钮
  const onClickFinish = useCallback(() => {
    if (recorderStatus === CONST.RECORDER_STATE_STOP) {
      // 保存数据
      window.electron.recorder.handleRecorderFinish(timeSlice);
    }
  }, [recorderStatus, timeSlice]);

  // 处理快捷键事件
  useEffect(() => {
    window.electron.recorder.invokeAccelerator((_: any, action: string) => {
      if (action === 'startOrPause') {
        if (recorderStatus === CONST.RECORDER_STATE_RECORDING) {
          onClickStop();
        } else {
          onClickStart();
        }
      } else {
        onClickFinish();
      }
    })
    return () => {
      window.electron.recorder.clearInvokeAccelerator();
    }
  }, [recorderStatus, onClickFinish, onClickStart, onClickStop])

  // 曲线救国在 invokeContinueTask 里 onClickStart
  const [clickStartTime, setClickStartTime] = useState(false);
  useEffect(() => {
    if (clickStartTime) {
      onClickStart();
      setClickStartTime(false);
    }
  }, [clickStartTime, onClickStart])

  // 处理继续任务事件
  useEffect(() => {
    window.electron.recorder.invokeContinueTask((_: any, task: any) => {
      if (recorderStatus === CONST.RECORDER_STATE_READY) {
        if (Array.isArray(task.TimeSlice)) {
          let newTimeSlice = task.TimeSlice.map((timeSliceItem: any) => {
            return [timeSliceItem.startAt, timeSliceItem?.endAt || null];
          })
          setTimeSlice(newTimeSlice);
          setTotalSeconds(calcTotalSeconds(newTimeSlice));
          setRecorderStatus(CONST.RECORDER_STATE_STOP);
          window.electron.miniEditor.invokeSetTaskInfo({
            id: task.id,
            title: task.title,
            detail: task.detail,
            categoryId: task.categoryId,
            Category: task.Category,
            forceUpdateCategory: false,
            tagIds: Array.isArray(task.Tags) ? task.Tags.map((tag: any) => tag.id) : [],
          });
          setClickStartTime(true);
        }
      } else {
        window.electron.dashboard.handleSendMessage('请先结束当前任务', 'error');
      }
    })
    return () => {
      window.electron.recorder.clearInvokeContinueTask();
    }
  }, [recorderStatus, setTimeSlice, clickStartTime])

  return (
    <div className={styles.recorderContentWrap}>
      {/* 左半时钟部分 */}
      <div className={styles.timerWrap}>
        {timeString}
      </div>
      {/* 右半按钮部分 */}
      { recorderStatus !== CONST.RECORDER_STATE_RECORDING && (
        <div className={styles.startButton} onClick={onClickStart}/>
      )}
      { recorderStatus === CONST.RECORDER_STATE_STOP && (
        <div className={styles.endButton} onClick={onClickFinish}/>
      ) }
      { recorderStatus === CONST.RECORDER_STATE_RECORDING && (
        <StopButton onClick={onClickStop}/>
      )}
    </div>
  );
}
