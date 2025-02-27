import { Link as TanstackLink, LinkPropsType } from '@tanstack/react-location';
import { FC } from 'react';

export const Link: FC<LinkPropsType> = ({ to, children, ...props }) => {
  if (typeof to === 'string' && to.startsWith('http')) {
    if (typeof children === 'function') {
      return (
        <a target="_blank" rel="noreferrer" href={to} {...props}>
          {children({ isActive: false })}
        </a>
      );
    }
    return (
      <a target="_blank" rel="noreferrer" href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <TanstackLink to={to} {...props}>
      {children}
    </TanstackLink>
  );
};
