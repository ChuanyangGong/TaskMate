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

interface TaskDetailProps {
  filterParam: FilterParamType;
}

export default function TaskDetail(props: TaskDetailProps) {
  const { filterParam } = props;

  return (
    <div className={styles.detailWrap}>
      aaaa{JSON.stringify(filterParam)}
    </div>
  );
}
