import { Popover } from "antd";
import styles from "./index.module.scss";
import CategorySelector from "renderer/components/CategorySelector";
import { useCallback, useState } from "react";
import Iconfont from "renderer/components/Iconfont";

export default function EditorFooter() {
  const [selectedTaskItem, setSelectedTaskItem] = useState<any>(null);

  // 更新任务分类
  const onUpdateSelector = useCallback(async (id: number | null) => {
  }, []);

  return (
    <div className={styles.footerWrap}>
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
            style={{ height: 200 }}
          />
        }
      >
        <Iconfont iconName="icon-move" className={styles.iconStyle}/>
        <div className={styles.textStyle}>{selectedTaskItem?.Category === null ? '未分类' : selectedTaskItem?.Category.name}</div>
      </Popover>
    </div>
  )
}
