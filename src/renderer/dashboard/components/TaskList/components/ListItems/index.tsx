import { Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface ListItemsProps {
  taskListItems: any[];
}

export default function ListItems(props: ListItemsProps) {
  const {
    taskListItems,
  } = props;

  return (
    <div className={styles.ListCommonFilterWrap}>
      {
        taskListItems.map((taskInfo) => {
          return (
            <div key={taskInfo.id} className={styles.taskWrap}>
              <div className={styles.title}>{taskInfo.title}</div>
            </div>
          )
        })
      }
    </div>
  );
}
