import React from 'react';

export type IconComponentProps = {
  component: React.ComponentType<any>;
  className?: string;
};

export default function Icon(props: IconComponentProps) {
  const { component: Cmp, className } = props;
  return <Cmp className={className} />;
}

