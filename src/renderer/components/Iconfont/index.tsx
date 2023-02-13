import React, { ReactElement, useState } from 'react';

interface IconProps {
  iconName: string;
  className?: string;
  size?: number;
  iconColor?: string;
}

const Iconfont = (props: IconProps): ReactElement => {
  const { iconName, className, size: fontSize, iconColor: color } = props;
  return (
    <span className={className}>
      <i className={`iconfont ${iconName}`} style={{ fontSize, color }} />
    </span>
  );
};

Iconfont.defaultProps = {
  className: undefined,
  size: 16,
  iconColor: '',
};

export default Iconfont;
