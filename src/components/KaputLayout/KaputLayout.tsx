import { ReactNode } from 'react';

import { Header } from '@/components';

interface KaputLayoutProps {
  onSetTheme?: (theme: 'dark' | 'light') => void;
  storedTheme?: string;
  children: ReactNode;
}

export function KaputLayout(props: KaputLayoutProps) {
  const { onSetTheme, children } = props;

  return (
    <div className="min-h-screen bg-primary">
      <Header onSetTheme={onSetTheme} />
      {children}
    </div>
  );
}
