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
interface RecorderContentProps {
}

export default function RecorderContent(props: RecorderContentProps) {
  const [recorderStatus, setRecorderStatus] = useState(CONST.RECORDER_STATE_READY);
  const [timeSlice, setTimeSlice] = useState<[Date, Date | null][]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [intervalHandler, setIntervalHandler] = useState(0);

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
      let newTotalSeconds = 0;
      timeRecords.forEach((timeRecord) => {
        let [startTime, endTime] = timeRecord;
        if (endTime === null) {
          endTime = new Date();
        }
        newTotalSeconds += (endTime.getTime() - startTime.getTime()) / 1000;
      });
      setTotalSeconds(newTotalSeconds);
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
      // todo: 保存数据

      setTimeSlice([]);
      setTotalSeconds(0);
      setRecorderStatus(CONST.RECORDER_STATE_READY);
    }
  }, [recorderStatus]);

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
  }, [recorderStatus])

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
