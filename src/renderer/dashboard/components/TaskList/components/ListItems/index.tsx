import { Col, DatePicker, Form, Input, Modal, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';
import emptyPic from '../../../../../../../assets/images/empty_tasks.png';

interface ListItemsProps {
  taskListItems: any[];
  setSelectedItemId: Dispatch<SetStateAction<number>>;
  selectedItemId: number;
}

export default function ListItems(props: ListItemsProps) {
  const {
    taskListItems,
    setSelectedItemId,
    selectedItemId
  } = props;

  const [enterItemId, setEnterItemId] = useState(-1);

  const onHandleDeleteTask = useCallback(async (id: number) => {
    const form = Modal.confirm({
      title: '确定删除该任务吗？',
      content: '删除后将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await window.electron.dashboard.deleteTaskById(id);
        form.destroy();
      }
    });
  }, []);

  return (
    <div className={styles.ListCommonFilterWrap}>
      {
        taskListItems.map((taskInfo) => {
          const hasBeenAboved = taskInfo.id === enterItemId;
          return (
            <div className={styles.taskItemWrap}
              key={taskInfo.id}
              onMouseEnter={() => setEnterItemId(taskInfo.id)}
              onMouseLeave={() => hasBeenAboved && setEnterItemId(-1)}
            >
              <div className={`${styles.prefixAndSuffix}`}>
                {/* {hasBeenAboved && <Iconfont iconName='icon-move1' size={12} />} */}
              </div>
              <div
                key={taskInfo.id}
                className={`${styles.taskWrap} ${selectedItemId === taskInfo.id ? styles.taskSelected : ''}`}
                onClick={() => setSelectedItemId(taskInfo.id)}
              >
                <div className={styles.title}>{taskInfo.title}</div>
              </div>
              <div className={styles.prefixAndSuffix} onClick={() => onHandleDeleteTask(taskInfo.id)}>
                {hasBeenAboved && <Iconfont iconName='icon-ellipsis' size={12} />}
              </div>
            </div>
          )
        })
      }
      {/* 缺省页 */}
      {
        taskListItems.length === 0 && (
          <div className={styles.empty}>
            <img src={emptyPic} width={150} height={150}/>
            <div style={{padding: '10px 0 40px'}}>还没有任务，快添加一个吧</div>
          </div>
        )
      }
    </div>
  );
}
