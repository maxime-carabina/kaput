import { Link } from 'react-router-dom';

import KaputLogo from '@/assets/kaput.png';
import { ThemeToggle } from '@/components';

interface HeaderProps {
  onSetTheme?: (theme: 'dark' | 'light') => void;
}

export function Header(props: HeaderProps) {
  const { onSetTheme } = props;

  return (
    <header
      className={`absolute top-0 left-0 w-full py-3 px-8 flex justify-between items-center text-primary`}
    >
      <Link to="/">
        <img src={KaputLogo} alt="Kaput Logo" className="w-16 h-16" />
      </Link>
      <ThemeToggle onSetTheme={onSetTheme} />
    </header>
  );
}
