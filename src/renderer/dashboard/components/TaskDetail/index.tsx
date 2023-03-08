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
import Iconfont from 'renderer/components/Iconfont';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';
import emptyPic from '../../../../../assets/images/empty_detail.png';
import { DatePicker, Form, Input } from 'antd';

interface TaskDetailProps {
  filterParam: FilterParamType;
  selectedTaskItem: null | any;
  hasTasks: boolean;
}

export default function TaskDetail(props: TaskDetailProps) {
  const { filterParam, selectedTaskItem, hasTasks } = props;

  const isTodo = useMemo(() => {
    return filterParam.taskStatus === 0;
  }, [filterParam.taskStatus]);

  useEffect(() => {
    console.log(selectedTaskItem);
    console.log(filterParam);
  }, [filterParam, selectedTaskItem])

  return (
    <div className={styles.detailWrap}>
      {
        selectedTaskItem && (
          <>
            <Form className={styles.formWrap}>
              {/* 设置准备做的日期 */}
              <Form.Item name="planStartAt" className={`${styles.timePicker} ${!isTodo ? '' : styles.hideBorder}`}>
                {!isTodo && <DatePicker bordered={false} style={{width: 120, marginLeft: -5}} />}
              </Form.Item>
              {/* 标题 */}
              <div className={styles.titleWrap}>
                <Form.Item name="title" noStyle>
                  <Input.TextArea
                    className={styles.titleArea}
                    bordered={false}
                    placeholder={`${isTodo ? '准备做' : '做了'}什么？`}
                    autoSize
                  />
                </Form.Item>
                <div className={styles.startButton}>

                </div>
              </div>
              {/* 描述 */}
              <Form.Item name="detail" noStyle>
                  <Input.TextArea
                    className={styles.detailArea}
                    bordered={false}
                    placeholder={`描述`}
                    autoSize
                  />
              </Form.Item>
            </Form>
            <div className={styles.footer}>
              aaa
            </div>
          </>
        )
      }
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
