import Iconfont from 'renderer/components/Iconfont';
import { DefaultItemType } from 'typings/renderer/dashboard/App';
import styles from './index.module.scss';

interface DefaultItemProps {
  itemData: DefaultItemType;
  selectedSubId: { id: string; title: string; };
  onSelected: (type: string, id: string, title: string) => void;
}

export default function DefaultItem(props: DefaultItemProps) {
  const { itemData, selectedSubId, onSelected } = props;

  return (
    <div
      className={`${styles.commonWrap} ${styles.defaultWrap} ${
        `default|${itemData.id}` === selectedSubId.id ? styles.commonSelected : ''
      }`}
      key={itemData.id}
      onClick={() => onSelected('default', itemData.id, itemData.title)}
    >
      <Iconfont
        iconName={`icon-${itemData.icon}`}
        size={18}
        iconColor="#989BA3"
      />
      <span className={styles.title}>{itemData.title}</span>
    </div>
  );
}
