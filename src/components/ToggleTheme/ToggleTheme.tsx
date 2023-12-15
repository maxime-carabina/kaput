import { useState } from 'react';

import { Moon, Sun } from 'lucide-react';

import { useLocalStorage } from '@/custom/useLocalStorage';

interface ThemeToggleProps {
  onSetTheme?: (theme: 'dark' | 'light') => void;
}

export function ThemeToggle(props: ThemeToggleProps) {
  const { onSetTheme } = props;

  const [storedTheme, setStoredTheme] = useLocalStorage<string>(
    'kaput-theme',
    'light',
  );
  const [theme, setTheme] = useState(storedTheme || 'light');

  function handleClick() {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    setStoredTheme(newTheme);

    onSetTheme?.(newTheme);
  }

  const themeIcons = {
    dark: <Sun className="h-8 w-8" />,
    light: <Moon className="h-8 w-8" />,
  };

  return (
    <button
      data-testid="theme-mode"
      className={`text-f-primary cursor-pointer rounded-lg w-12 h-12
                  hover:bg-secondary/10
                  active:bg-secondary/30`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center">
        {themeIcons[theme as keyof typeof themeIcons]}
      </div>
    </button>
  );
}
