import { Popover } from "antd";
import styles from "./index.module.scss";
import CategorySelector from "renderer/components/CategorySelector";
import { useCallback, useEffect, useState } from "react";
import Iconfont from "renderer/components/Iconfont";
import { TaskDetailItemType } from "typings/renderer/dashboard/App";


interface EditorFooterProps {
  taskInfo: TaskDetailItemType;
  setTaskInfo: (value: TaskDetailItemType) => void;
  isFocus: boolean;
}

export default function EditorFooter(props: EditorFooterProps) {
  const { taskInfo, setTaskInfo, isFocus } = props;
  const [openPopover, setOpenPopover] = useState(false);

  // 更新任务分类
  const onUpdateSelector = useCallback(async (id: number | null) => {
    const category = await window.electron.dashboard.getCategoryDetail(id);
    setTaskInfo({
      ...taskInfo,
      categoryId: id,
      Category: category,
      forceUpdateCategory: true,
    })
  }, [taskInfo, setTaskInfo]);

  useEffect(() => {
    if (!isFocus) {
      setOpenPopover(false);
    }
  }, [isFocus])

  return (
    <div className={styles.footerWrap}>
      {/* 左边的分类 icon button */}
      <Popover
        className={styles.footerButtonWrap}
        arrow={false}
        placement="topLeft"
        trigger="click"
        destroyTooltipOnHide={true}
        open={openPopover}
        onOpenChange={(open) => setOpenPopover(open)}
        content={
          <CategorySelector
            selectedId={taskInfo?.categoryId || null}
            onUpdateSelector={onUpdateSelector}
            style={{ height: 200 }}
          />
        }
      >
        <Iconfont iconName="icon-move" className={styles.iconStyle}/>
        <div className={styles.textStyle}>{taskInfo?.Category !== null ? taskInfo?.Category?.name : '未分类'}</div>
      </Popover>
    </div>
  )
}
