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

    </div>
  )
}
