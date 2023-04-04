import { CloseOutlined } from '@ant-design/icons';
import { BorderOutlined, MinusOutlined } from '@ant-design/icons/lib/icons';
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';
import emptyPic from '../../../../../assets/images/empty_detail.png';
import { DatePicker, Form, Input, InputRef, Popover } from 'antd';
import { debounce, throttle } from '../../../utils';
import Iconfont from 'renderer/components/Iconfont';
import CategorySelector from 'renderer/components/CategorySelector';

interface TaskDetailProps {
  filterParam: FilterParamType;
  hasTasks: boolean;
  selectedItemId: number;
}

const updateOrCreateTaskApi = throttle(window.electron.dashboard.updateOrCreateTask, 500);

export default function TaskDetail(props: TaskDetailProps) {
  const { filterParam, hasTasks, selectedItemId } = props;
  const [form] = Form.useForm();

  const inputRef = useRef<InputRef>(null);
  const titleRef = useRef<InputRef>(null);
  const [selectedTaskItem, setSelectedTaskItem] = useState<any>(null);

  // 判断是否是待办任务
  const isTodo = useMemo(() => {
    return filterParam.taskStatus === 0;
  }, [filterParam.taskStatus]);

  // 处理表单变化
  const handleChange = useCallback((changedValues: any, allValues: any) => {
    const newData = {
      ...selectedTaskItem,
      ...allValues,
    }
    if (newData.planStartAt && !(newData.planStartAt instanceof Date)) {
      newData.planStartAt = newData.planStartAt.toDate();
    }
    updateOrCreateTaskApi(newData);
  }, [selectedTaskItem]);

  // 根据任务详情设置表单值
  useEffect(() => {
    form.setFieldsValue({
      ...selectedTaskItem,
      planStartAt: selectedTaskItem?.planStartAt ? dayjs(selectedTaskItem.planStartAt) : null,
    });
    titleRef.current?.focus();
  }, [selectedTaskItem])

  // 获取任务详情
  const getTaskDetail = useCallback(async (id: number) => {
    if (id > 0) {
      const taskItem = await window.electron.dashboard.getTaskDetailById(id);
      setSelectedTaskItem(taskItem);
    } else {
      setSelectedTaskItem(null);
    }
  }, []);

  useEffect(() => {
    getTaskDetail(selectedItemId);
  }, [selectedItemId]);

  // 更新任务分类
  const onUpdateSelector = useCallback(async (id: number | null) => {
    if (selectedItemId) {
      await window.electron.dashboard.updateOrCreateTask({id: selectedItemId, categoryId: id, forceUpdateCategory: true});
      await getTaskDetail(selectedItemId);
    }
  }, [selectedTaskItem]);


  return (
    <div className={styles.detailWrap}>
      {
        selectedTaskItem && (
          <>
            <Form
              className={styles.formWrap}
              form={form}
              onValuesChange={handleChange}
            >
              {/* 设置准备做的日期 */}
              <Form.Item name="planStartAt" className={`${styles.timePicker} ${!isTodo ? '' : styles.hideBorder}`}>
                {isTodo && <DatePicker bordered={false} style={{width: 120, marginLeft: -5}} />}
              </Form.Item>
              {/* 标题 */}
              <div className={styles.contentWrap}>
                <div className={styles.titleWrap}>
                  <Form.Item name="title" noStyle>
                    <Input.TextArea
                      ref={titleRef}
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
                    ref={inputRef}
                    className={styles.detailArea}
                    bordered={false}
                    placeholder={`描述`}
                    autoSize
                  />
                </Form.Item>
                <div className={styles.focus} onClick={() => inputRef.current!.focus({cursor: 'end'}) } />
              </div>
            </Form>
            <div className={styles.footer}>
              {/* 左边的分类 icon button */}
              <Popover
                className={styles.footerButtonWrap}
                arrow={false}
                placement="topLeft"
                trigger="click"
                destroyTooltipOnHide={true}
                content={
                  <CategorySelector
                    selectedId={selectedTaskItem.categoryId}
                    onUpdateSelector={onUpdateSelector}
                  />
                }
              >
                <Iconfont iconName="icon-move" className={styles.iconStyle}/>
                <div className={styles.textStyle}>{selectedTaskItem.Category === null ? '未分类' : selectedTaskItem.Category.name}</div>
              </Popover>
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
