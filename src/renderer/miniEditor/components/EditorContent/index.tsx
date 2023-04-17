import { Input, InputRef } from 'antd';
import styles from './index.module.scss';
import { useRef } from 'react';


interface EditorContentProps {

}

export default function EditorContent(props: EditorContentProps) {
  const inputRef = useRef<InputRef>(null);

  return (
    <div className={styles.contentWrap}>
      {/* 标题 */}
      <div className={styles.titleWrap}>
        <Input.TextArea
          className={styles.titleArea}
          bordered={false}
          placeholder={`准备做什么？`}
          autoSize
        />
      </div>
      <div className={styles.descWrap}>
        <Input.TextArea
          ref={inputRef}
          className={styles.detailArea}
          bordered={false}
          placeholder={`描述`}
          autoSize
        />
      </div>
      <div className={styles.focus} onClick={() => inputRef.current!.focus({cursor: 'end'}) } />
    </div>
  )

}
