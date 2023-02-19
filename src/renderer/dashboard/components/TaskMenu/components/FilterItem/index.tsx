import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { Button, Dropdown, Form, Input, MenuProps, message, Modal } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { FilterItemChildType, FilterItemFormDataType, FilterItemType } from 'typings/renderer/dashboard/components/TaskMenu';
import styles from './index.module.scss';

interface FilterItemProps {
  itemData: FilterItemType;
  onChangeExpand: (id: string) => void;
  onSelected: (type: string, id: string) => void;
  selectedSubId: string;
  hoveredId: string;
  onEnter: (type: string, id: string) => void;
  onLeave: () => void;
  invokeUpdate: (type?: string) => Promise<void>;
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 20, offset: 4 },
};

export default function FilterItem(props: FilterItemProps) {
  const {
    itemData,
    onChangeExpand,
    onSelected,
    selectedSubId,
    hoveredId,
    onEnter,
    onLeave,
    invokeUpdate,
  } = props;

  // 控制是否显示提示
  const showHint = useMemo(() => {
    return itemData.expand && itemData.children.length === 0;
  }, [itemData.children.length, itemData.expand]);

  // 控制是否显示item
  const showItems = useMemo(() => {
    return itemData.expand && itemData.children.length > 0;
  }, [itemData.children.length, itemData.expand]);

  // 点击编辑
  const onClickEdit = useCallback(async (id: number) => {
    const data = await window.electron.dashboard.getItemDetailByType(itemData.id, id);
    form.setFieldsValue({
      name: data.name,
      shortNames: data.children ?? [],
    });
    setEditItemId(data.id);
  }, []);

  const getSelectionItems = useCallback((item: FilterItemChildType) => {
    const buttons = [{
      key: 'edit',
      label: '编辑',
      onClick: () => onClickEdit(item.id),
    },{
      key: 'archive',
      label: '归档',
      onClick: () => {},
    },{
      key: 'delete',
      label: '删除',
      onClick: () => {setDeletedItem(item)},
    }]
    return buttons.map((bt) => {
      return {
        key: bt.key,
        label: <a onClick={bt.onClick}>
          <div style={{width: 100}} >{bt.label}</div>
        </a>
      }
    });
  }, [onClickEdit]);

  // items 渲染
  const ItemsRender = useMemo(() => {
    return itemData.children.map((item) => {
      const hasBeenSelected = `${itemData.id}|${item.id}` === selectedSubId;
      const hasBeenHovered = `${itemData.id}|${item.id}` === hoveredId;

      return (
        <div
          key={item.id}
          className={`${styles.commonWrap} ${styles.childWrap} ${
            hasBeenSelected ? styles.commonSelected : ''
          }`}
          onClick={() => onSelected(itemData.id, `${item.id}`)}
          onMouseEnter={() => onEnter(itemData.id, `${item.id}`)}
          onMouseLeave={onLeave}
        >
          {/* 排序 icon */}
          <div className={`${styles.iconWrap}`}>
            <Iconfont iconName={`icon-${itemData.id === 'category' ? 'view-list' : 'ic24-tag'}`} size={15} />
          </div>
          {/* 名称 */}
          <span className={styles.title}>{item.name}</span>
          {/* 右侧 */}
          <div className={styles.rightRegion} >
            <Dropdown
              trigger={['click']}
              menu={{ items: getSelectionItems(item) }}
            >
              <Iconfont
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   onClickEdit(item.id);
                // }}
                style={{visibility: hasBeenHovered ? '' : 'hidden'}}
                iconName="icon-ellipsis"
                size={20}
                className={styles.ellipsis}
              />
            </Dropdown>
          </div>
        </div>
      );
    });
  }, [
    hoveredId,
    itemData.children,
    itemData.id,
    onEnter,
    onLeave,
    onSelected,
    selectedSubId,
  ]);

  const collectorHasBeenHovered = useMemo(() => {
    return `collector|${itemData.id}` === hoveredId;
  }, [hoveredId, itemData.id]);

  // 显示添加、编辑 Modal
  const [editItemId, setEditItemId] = useState(-1);  // 添加项为 0，不显示为 -1
  const [form] = Form.useForm();
  const modelInputWidth = '92%';
  const showEditorModal = useMemo(() => editItemId !== -1, [editItemId]);

  // 标签 或 分类
  const typeName = useMemo(() => {
    return itemData.id === 'category' ? '分类' : '标签';
  }, [itemData.id]);

  // 点击添加
  const onClickAdd = useCallback((e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();
    form.resetFields();
    setEditItemId(0);
  }, []);

  // 点击取消
  const onCancel = useCallback(() => {
    setEditItemId(-1);
    setDeletedItem(null);
    setSubmitting(false);
  }, []);

  // 点击提交
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    form.validateFields()
      .then(async () => {
        // 提交数据
        const success = await window.electron.dashboard.saveOrNewItemByType(itemData.id, {
          id: editItemId,
          ...form.getFieldsValue()
        });
        if (success) {
          message.success(`${editItemId === 0 ? '新建' : '编辑'}成功`);
        } else {
          message.error(`出错了！`);
        }
        invokeUpdate();
        onCancel();
      })
      .catch((e) => {
        setSubmitting(false);
      });
  }, [editItemId, itemData.id, invokeUpdate]);

  const validateNoRepeat = (index: number, value: any, callback: (error?: string | undefined) => void) => {
    const shortNames = form.getFieldValue('shortNames');
    shortNames.forEach((shortName: string, idx: number) => {
      if (idx !== index && shortName === value) {
        callback(`${typeName}简称不能重名`);
      }
    });
    callback();
  };

  // 删除 modal 相关
  const [deletedItem, setDeletedItem] = useState<null | FilterItemFormDataType>(null);;
  const showDeleteModal = useMemo(() => {
    return deletedItem !== null;
  }, [deletedItem]);

  // 确认删除
  const doDelete = useCallback(async () => {
    setSubmitting(true);
    const success = await window.electron.dashboard.deleteCategoryOrTagItemByType(itemData.id, deletedItem?.id || -1);
    if (success) {
      message.success(`删除成功`);
    } else {
      message.error(`出错了！`);
    }
    invokeUpdate();
    setSubmitting(false);
    onCancel();
  }, [itemData, deletedItem?.id, invokeUpdate]);

  return (
    <div className={styles.itemWrap}>
      {/* 收缩栏 */}
      <div
        key={itemData.id}
        className={`${styles.commonWrap} ${styles.filterRoot}`}
        onClick={() => onChangeExpand(itemData.id)}
        onMouseEnter={() => onEnter('collector', itemData.id)}
        onMouseLeave={onLeave}
      >
        <div
          className={`${styles.iconWrap} ${
            itemData.expand ? styles.expand : ''
          }`}
        >
          <Iconfont iconName="icon-arrow-right" size={12} />
        </div>
        <div className={styles.title}>{itemData.name}</div>
        <div className={styles.rightRegion}>
          {collectorHasBeenHovered && (
            <Iconfont
              onClick={onClickAdd}
              iconName="icon-add-select"
              size={20}
              className={styles.ellipsis}
            />
          )}
        </div>
      </div>
      {/* 内容 */}
      {showHint && <div className={styles.emptyHint}>{itemData.hint}</div>}
      {showItems && ItemsRender}
      {/* 添加、编辑分类、标签 */}
      <Modal
        title={`${editItemId === 0 ? '添加' : '编辑'}${typeName}`}
        open={showEditorModal}
        mask={false}
        maskClosable={false}
        onOk={onSubmit}
        onCancel={onCancel}
        width={450}
        confirmLoading={submitting}
      >
        <Form
          className={styles.formWrap}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          form={form}
        >
          {/* 名称 */}
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: `请输入${typeName}名称`,
              },
            ]}>
            <Input
              placeholder={`请输入${typeName}名称`}
              size="middle"
              style={{ width: modelInputWidth }}
            />
          </Form.Item>
          {/* 别名 */}
          <Form.List name="shortNames">
            {(fields, { add, remove }, { errors }) => (
              <>
                {(fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '简称' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入一个缩写，或删除该行',
                        },
                        { validator: (_, value, callback) => validateNoRepeat(index, value, callback) }
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={`${typeName}名缩写`}
                        size="middle"
                        style={{ width: modelInputWidth, marginRight: 10 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  </Form.Item>
                )))}
                {fields.length < 3 && (
                  <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: modelInputWidth }}
                      icon={<PlusOutlined />}
                    >
                      添加简称
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      {/* 删除分类、标签 */}
      <Modal
        title={`删除${typeName}`}
        open={showDeleteModal}
        mask={false}
        maskClosable={false}
        width={450}
        onCancel={onCancel}
        onOk={doDelete}
        confirmLoading={submitting}
      >
        {itemData.id === 'category'
          ? (<div>删除后，该分类下的任务会被放进 <strong>所有</strong> 中，确定要删除分类 <strong>{deletedItem?.name} </strong>?</div>)
          : (<div>删除后，标签 <strong>{deletedItem?.name}</strong> 将从所有任务上删除</div>)
        }
      </Modal>
    </div>
  );
}
