import { Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';

interface ListCommonFilterProps {
  filterParam: FilterParamType;
  canDateRangeModify: boolean;
  setFilterParam: Dispatch<SetStateAction<FilterParamType>>;
}

export default function ListCommonFilter(props: ListCommonFilterProps) {
  const {
    filterParam,
    canDateRangeModify,
    setFilterParam,
  } = props;

  const { RangePicker } = DatePicker;

  const [form] = Form.useForm();

  const onChange = useCallback((changedValues: any, allValues: any) => {
    setFilterParam({...filterParam, ...changedValues});
  }, [filterParam, setFilterParam]);

  useEffect(() => {
    form.setFieldsValue({
      dateRange: filterParam.dateRange,
      keyword: filterParam.keyword
    });
  }, [form, filterParam.keyword, filterParam.dateRange]);

  return (
    <div className={styles.ListCommonFilterWrap}>
      <Form onValuesChange={onChange} form={form}>
        <Space>
          <Form.Item label="关键字" name="keyword" style={{marginBottom: 0}}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item label="日期范围" name="dateRange" style={{marginBottom: 0}}>
            <RangePicker size="small" disabled={!canDateRangeModify}/>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}
