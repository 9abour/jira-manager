import type { ReactNode } from 'react';

export interface ButtonTextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  internal?: boolean;
}
