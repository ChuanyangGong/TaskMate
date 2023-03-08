import { CloseOutlined } from '@ant-design/icons';
import { BorderOutlined, MinusOutlined } from '@ant-design/icons/lib/icons';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';
import emptyPic from '../../../../../assets/images/empty_detail.png';

interface TaskDetailProps {
  filterParam: FilterParamType;
  selectedTaskItem: null | any;
  hasTasks: boolean;
}

export default function TaskDetail(props: TaskDetailProps) {
  const { filterParam, selectedTaskItem, hasTasks } = props;

  return (
    <div className={styles.detailWrap}>
      {JSON.stringify(selectedTaskItem)}
      {
        hasTasks && !selectedTaskItem && (
          <div className={styles.empty}>
            <img src={emptyPic} width={140} height={140}/>
            <div style={{padding: '20px 0 60px'}}>选中一个任务，查看详情</div>
          </div>
        )
      }
    </div>
  );
}
