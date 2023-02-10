import React, { ReactElement, useState } from 'react';

interface IconProps {
  iconName: string;
  className?: string;
  size?: number;
}

const Iconfont = (props: IconProps): ReactElement => {
  const { iconName, className, size } = props;
  return (
    <span className={className}>
      <i className={`iconfont ${iconName}`} style={{ fontSize: size }} />
    </span>
  );
};

Iconfont.defaultProps = {
  className: undefined,
  size: 16,
};

export default Iconfont;
