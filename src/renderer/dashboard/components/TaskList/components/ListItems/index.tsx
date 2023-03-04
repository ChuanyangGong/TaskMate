import { Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface ListItemsProps {
}

const items =
  {
    id: 1,
    title: 'DoM后台：获取年度报告列表API + 获取学生列表 API + 设计了一个好东西呀，啊哈哈哈哈或',
    detail: '',
    category: {
      name: 'Space Cat',
      id: 1,
    },
    tags: [
      {
        name: '外语竞赛',
        id: 1,
      },
      {
        name: 'Space Cat',
        id: 2,
      }
    ],
    duration: 1950,
    timeSlices: []
  };

export default function ListItems(props: ListItemsProps) {
  const {
  } = props;

  const [tasksInfo, setTasksInfo] = useState([]);

  useEffect(() => {
    let newTasksInfo = [];
    for(let i = 1; i < 30; i += 1) {
      newTasksInfo.push({...items, id: i});
    }
    setTasksInfo(newTasksInfo);
  }, []);

  return (
    <div className={styles.ListCommonFilterWrap}>
      {
        tasksInfo.map((taskInfo) => {
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
