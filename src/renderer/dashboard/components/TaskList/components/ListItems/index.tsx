import { Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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

  return (
    <div className={styles.ListCommonFilterWrap}>
      {
        taskListItems.map((taskInfo) => {
          return (
            <div
              key={taskInfo.id}
              className={`${styles.taskWrap} ${selectedItemId === taskInfo.id ? styles.taskSelected : ''}`}
              onClick={() => setSelectedItemId(taskInfo.id)}
            >
              <div className={styles.title}>{taskInfo.title}</div>
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
