import { CloseOutlined } from '@ant-design/icons';
import { BorderOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
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
import { Button, DatePicker, Form, Input, InputRef, Modal, Popover, TimePicker } from 'antd';
import { convertDateToString, debounce, throttle, timeAligh } from '../../../utils';
import Iconfont from 'renderer/components/Iconfont';
import CategorySelector from 'renderer/components/CategorySelector';

interface TaskDetailProps {
  filterParam: FilterParamType;
  hasTasks: boolean;
  selectedItemId: number;
}

interface infoType {
  duration: string;
  timeRange: string[];
  timeSliceWeight: [boolean, number][];
}

const updateOrCreateTaskApi = throttle(window.electron.dashboard.updateOrCreateTask, 500);
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 21, offset: 3 },
  },
};

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
    if (selectedTaskItem) {
      form.setFieldsValue({
        ...selectedTaskItem,
        planStartAt: selectedTaskItem?.planStartAt ? dayjs(selectedTaskItem.planStartAt) : null,
      });
      titleRef.current?.focus();
    }
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
    getTaskDetail?.(selectedItemId);
  }, [selectedItemId]);

  // 更新任务分类
  const onUpdateSelector = useCallback(async (id: number | null) => {
    if (selectedItemId) {
      await window.electron.dashboard.updateOrCreateTask({id: selectedItemId, categoryId: id, forceUpdateCategory: true});
      await getTaskDetail(selectedItemId);
    }
  }, [selectedItemId]);


  // 显示时长信息的数据
  const timeSliceInfo = useMemo(() => {
    if (selectedTaskItem === null || selectedTaskItem?.duration === null) {
      return null;
    }

    const info: infoType = {
      duration: '',
      timeRange: [
        convertDateToString(selectedTaskItem?.startAt, "YYYY-MM-DD HH:mm"),
        convertDateToString(selectedTaskItem?.endAt, "YYYY-MM-DD HH:mm")
      ],
      timeSliceWeight: []
    };

    // 计算总时长
    let totalSeconds = selectedTaskItem?.duration;
    let timeDetailList = [];
    let hours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds = totalSeconds % (60 * 60);
    let minutes = Math.floor(totalSeconds / (60));
    totalSeconds = totalSeconds % (60);
    if (hours > 0) {
      info.duration = `${timeAligh(hours, 1)} 时 ${timeAligh(minutes)} 分`;
    } else {
      info.duration = `${timeAligh(minutes)} 分 ${timeAligh(totalSeconds)} 秒`;
    }

    // 生成时间分布
    const timeMap = new Map();
    selectedTaskItem?.TimeSlice?.forEach((sliceItem: any) => {
      let startAt = sliceItem.startAt.valueOf();
      let endAt = sliceItem.endAt.valueOf();
      if (!timeMap.has(startAt)) {
        timeMap.set(startAt, 0);
      }
      timeMap.set(startAt, timeMap.get(startAt) + 1);
      if (!timeMap.has(endAt)) {
        timeMap.set(endAt, 0);
      }
      timeMap.set(endAt, timeMap.get(endAt) - 1);
    })
    let timeArray = Array.from(timeMap);
    timeArray.sort((a, b) => a[0] - b[0]);
    let curCounter = 0;
    let lastTimePoint = 0;
    timeArray.forEach((item, idx) => {
      if (idx > 0) {
        info.timeSliceWeight.push([curCounter > 0, (item[0] - lastTimePoint) / 1000]);
      }
      lastTimePoint = item[0];
      curCounter += item[1];
    });

    return info;
  }, [selectedTaskItem]);

  // 编辑任务 time slice
  const [openTimeSliceModal, setOpenTimeSliceModal] = useState(false);
  const [timeSliceForm] = Form.useForm();

  const onShowEdit = useCallback(() => {
    let timeSliceList = selectedTaskItem?.TimeSlice?.map((item: any) => {
      if (item.startAt instanceof Date) {
        return [dayjs(item.startAt), dayjs(item.endAt)];
      }
      return undefined;
    }) || [];
    if (!Array.isArray(timeSliceList) || timeSliceList.length === 0) {
      timeSliceList = [undefined];
    }
    timeSliceForm.setFieldsValue({
      timeSlice: timeSliceList,
    });
    setOpenTimeSliceModal(true);
  }, [selectedTaskItem]);
  const onFinish = useCallback(async () => {
    timeSliceForm.validateFields().then(async () => {
      let duration = 0;
      let startAt = Infinity;
      let endAt = -Infinity;
      let timeSliceList = timeSliceForm.getFieldsValue().timeSlice
        ?.filter((item: any) => Array.isArray(item) && item.length === 2)
        ?.map((item: any) => {
          let curDuration = Math.floor((item[1].valueOf() - item[0].valueOf()) / 1000);
          startAt = Math.min(startAt, item[0].valueOf());
          endAt = Math.max(endAt, item[1].valueOf());
          duration += curDuration;
          return {
            startAt: item[0].toDate(),
            endAt: item[1].toDate(),
            duration: curDuration,
          }
        }) || [];
      await window.electron.dashboard.updateOrCreateTask({
        id: selectedItemId,
        updateTimeSliceList: true,
        timeSliceList,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        duration
      });
      await getTaskDetail(selectedItemId);
      setOpenTimeSliceModal(false);
    }).catch((info) => {});

  }, [timeSliceForm, selectedItemId]);

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
              {/* 任务内容 */}
              <div className={styles.contentWrap}>
                {/* 标题 */}
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
                {/* 时间编辑 */}
                {
                  !isTodo && (
                    <div className={styles.timeSliceWrap}>
                      {/* 编辑按钮 */}
                      <div className={styles.editIcon} onClick={onShowEdit}>
                        <Iconfont iconName='icon-edit' iconColor='#666' size={15}/>
                      </div>
                      <div>总时长：{timeSliceInfo?.duration || "-"}</div>
                      <div>时间范围：{timeSliceInfo?.timeRange?.[0] || "-"} 至 {timeSliceInfo?.timeRange?.[1] || "-"}</div>
                      <div>时间分布：</div>
                      <div className={styles.timeSliceBoxWrap}>
                        {timeSliceInfo?.timeSliceWeight.map((item, idx) => {
                          return (
                            <div key={idx} style={{flexBasis: item[1]}} className={`${styles.timeSliceItem} ${item[0] ? styles.blue : ''}`} />
                          )
                        })}
                      </div>
                    </div>
                  )
                }
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
                    selectedId={selectedTaskItem?.categoryId}
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
      {/* 删除分类、标签 */}
      <Modal
        title={`编辑时间分布`}
        open={openTimeSliceModal}
        mask={false}
        maskClosable={false}
        width={550}
        onCancel={() => setOpenTimeSliceModal(false)}
        onOk={onFinish}
        // confirmLoading={submitting}
      >
        <Form
          name="timeSliceEditor"
          form={timeSliceForm}
          {...formItemLayoutWithOutLabel}
          className={styles.formWrapStyle}
        >
          <Form.List
            name="timeSlice"
            rules={[]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '时间记录' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{required: true, message: "请添加起止时间记录，或删除这一项"}]}
                      noStyle
                    >
                      <DatePicker.RangePicker bordered={false} style={{width: "94%"}} showTime/>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ margin: '0 4px 0 8px'}}
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '92%' }}
                    icon={<PlusOutlined />}
                  >
                    添加时间项
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
