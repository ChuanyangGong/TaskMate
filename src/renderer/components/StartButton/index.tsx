import {} from 'react';
import styles from './index.module.scss';

interface StartButtonProps {
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export default function StartButton(props: StartButtonProps) {
  const {onClick, style} = props;

  return (
    <div className={styles.startButton} onClick={onClick} style={style}/>
  );
}
