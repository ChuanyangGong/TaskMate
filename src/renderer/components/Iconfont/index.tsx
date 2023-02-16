import React, { MouseEventHandler, ReactElement } from 'react';

interface IconProps {
  iconName: string;
  className?: string;
  size?: number;
  iconColor?: string;
  onClick?: MouseEventHandler<HTMLSpanElement> | undefined;
  style?: object;
}

const Iconfont = (props: IconProps): ReactElement => {
  const {
    iconName,
    className,
    size: fontSize,
    iconColor: color,
    onClick,
    style,
  } = props;
  return (
    <span
      className={className}
      onClick={onClick}
      style={{ height: '100%', display: 'flex', alignItems: 'center' }}
    >
      <i
        className={`iconfont ${iconName}`}
        style={{ fontSize, color, ...style }}
      />
    </span>
  );
};

Iconfont.defaultProps = {
  className: undefined,
  size: 16,
  iconColor: undefined,
  onClick: undefined,
  style: {},
};

export default Iconfont;
