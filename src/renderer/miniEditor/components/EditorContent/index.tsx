import { Input, InputRef } from 'antd';
import styles from './index.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import { TaskDetailItemType } from 'typings/renderer/dashboard/App';


interface EditorContentProps {
  taskInfo: TaskDetailItemType;
  setTaskInfo: (value: TaskDetailItemType) => void;
  isFocus: boolean;
}

export default function EditorContent(props: EditorContentProps) {
  const inputRef = useRef<InputRef>(null);
  const titleRef = useRef<InputRef>(null);
  const { taskInfo, setTaskInfo, isFocus } = props;

  const onValuesChange = useCallback((newValue: string, key: string) => {
    setTaskInfo({
      ...taskInfo,
      [key]: newValue,
    })
  }, [taskInfo, setTaskInfo]);

  useEffect(() => {
    if (isFocus) {
      titleRef.current!.focus({cursor: 'end'});
    }
  }, [isFocus])

  return (
    <div className={styles.contentWrap}>
      {/* 标题 */}
      <div className={styles.titleWrap}>
        <Input.TextArea
          ref={titleRef}
          className={styles.titleArea}
          bordered={false}
          placeholder={`准备做什么？`}
          value={taskInfo?.title || ''}
          onChange={(e) => onValuesChange(e.currentTarget.value, 'title')}
          autoSize
        />
      </div>
      <div className={styles.descWrap}>
        <Input.TextArea
          ref={inputRef}
          className={styles.detailArea}
          bordered={false}
          placeholder={`描述`}
          value={taskInfo?.detail || ''}
          onChange={(e) => onValuesChange(e.currentTarget.value, 'detail')}
          autoSize
        />
      </div>
      <div className={styles.focus} onClick={() => inputRef.current!.focus({cursor: 'end'}) } />
    </div>
  )
}
