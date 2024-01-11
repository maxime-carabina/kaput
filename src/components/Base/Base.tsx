import { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { KaputLayout } from '@/components';
import { Toaster } from '@/components/ui/toaster';
import { useLocalStorage } from '@/custom/useLocalStorage';
import { useConfigStore } from '@/store/store';

export function Base() {
  const navigate = useNavigate();

  // Hooks
  const [theme, setThemeStorage] = useLocalStorage<string>(
    'kaput-theme',
    'light',
  );

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  // Store
  const setThemeStore = useConfigStore((s) => s.setTheme);

  // Functions
  function handleSetTheme() {
    const toggledTheme = theme === 'dark' ? 'light' : 'dark';

    setThemeStorage(toggledTheme);
    setThemeStore(toggledTheme);
  }

  return (
    <div className={theme}>
      <KaputLayout onSetTheme={handleSetTheme} storedTheme={theme}>
        <Outlet />
        <Toaster />
      </KaputLayout>
    </div>
  );
}
