import { Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import styles from './index.module.scss';

interface ListCommonFilterProps {
}

export default function ListCommonFilter(props: ListCommonFilterProps) {
  const {
  } = props;

  const { RangePicker } = DatePicker;

  return (
    <div className={styles.ListCommonFilterWrap}>
      <Form>
        <Space>
          <Form.Item label="关键字" name="keyword" style={{marginBottom: 0}}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item label="日期范围" name="dateRange" style={{marginBottom: 0}}>
            <RangePicker size="small" />
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}
