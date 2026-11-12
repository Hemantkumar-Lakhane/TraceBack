import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  palette: 'luxury',
  isLuxury: true,
  toggleTheme: () => {},
  togglePalette: () => {},
  setPalette: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tb_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Default to the luxury Brown + Cream + Baby Blue palette from Instagram reel
  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem('tb_palette');
    if (saved === 'luxury' || saved === 'classic') return saved;
    return 'luxury';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    root.setAttribute('data-palette', palette);
    localStorage.setItem('tb_theme', theme);
    localStorage.setItem('tb_palette', palette);
  }, [theme, palette]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const togglePalette = () => {
    setPalette(prev => (prev === 'luxury' ? 'classic' : 'luxury'));
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    palette,
    isLuxury: palette === 'luxury',
    toggleTheme,
    togglePalette,
    setPalette
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
