import Icon from '@ant-design/icons/lib/components/Icon';
import { useCallback, useEffect, useMemo } from 'react';
import Iconfont from 'renderer/components/Iconfont';
import { FilterItemType } from 'typings/renderer/dashboard/components/TaskMenu';
import styles from './index.module.scss';

interface FilterItemProps {
  itemData: FilterItemType;
  onChangeExpand: (id: string) => void;
  onSelected: (type: string, id: string) => void;
  selectedSubId: string;
  hoveredId: string;
  onEnter: (type: string, id: string) => void;
  onLeave: () => void;
}

export default function FilterItem(props: FilterItemProps) {
  const {
    itemData,
    onChangeExpand,
    onSelected,
    selectedSubId,
    hoveredId,
    onEnter,
    onLeave,
  } = props;

  // 控制是否显示提示
  const showHint = useMemo(() => {
    return itemData.expand && itemData.children.length === 0;
  }, [itemData.children.length, itemData.expand]);

  // 控制是否显示item
  const showItems = useMemo(() => {
    return itemData.expand && itemData.children.length > 0;
  }, [itemData.children.length, itemData.expand]);

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
            <Iconfont iconName="icon-view-list" size={15} />
          </div>
          {/* 名称 */}
          <span className={styles.title}>{item.name}</span>
          {/* 右侧 */}
          <div className={styles.rightRegion}>
            {hasBeenHovered && (
              <Iconfont
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                iconName="icon-ellipsis"
                size={20}
                className={styles.ellipsis}
              />
            )}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
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
    </div>
  );
}
