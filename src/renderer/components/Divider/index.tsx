import { useEffect } from 'react';
import styles from './index.module.scss';

interface DividerProps {
  top?: number;
  bottom?: number;
}

export default function Divider(props: DividerProps) {
  const { top, bottom } = props;
  return (
    <div
      className={styles.dividerWrap}
      style={{
        marginTop: top,
        marginBottom: bottom,
      }}
    />
  );
}

Divider.defaultProps = {
  top: 10,
  bottom: 10,
};
