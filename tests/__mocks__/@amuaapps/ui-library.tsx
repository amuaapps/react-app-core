import React from 'react';

// Mock ui-library components as simple pass-through components
export const Button = ({
  children,
  ...props
}: React.ComponentProps<'button'>) => <button {...props}>{children}</button>;

export const Card = ({ children, ...props }: React.ComponentProps<'div'>) => (
  <div {...props}>{children}</div>
);

export const Input = (props: React.ComponentProps<'input'>) => (
  <input {...props} />
);
