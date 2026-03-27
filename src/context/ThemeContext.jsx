import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext();

// Funções de utilidade exportadas para cálculos de cor
export const getContrastColor = (hexcolor) => {
  if (!hexcolor) return '#ffffff';
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1e1b4b' : '#ffffff';
};

export const getLegibleColor = (color, currentTheme) => {
  if (!color) return currentTheme === 'light' ? '#8b5cf6' : '#ffffff';
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 180 && currentTheme === 'light') return '#1e1b4b';
  if (brightness < 60 && currentTheme !== 'light') return '#ffffff';
  return color;
};

export const hasPoorContrast = (color, currentTheme) => {
  if (!color) return false;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  if (currentTheme === 'light' && brightness > 180) return true;
  if (currentTheme !== 'light' && brightness < 60) return true;
  return false;
};

export const hexToRgb = (hex) => {
  if (!hex) return '139, 92, 246';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('synfonia-theme') || 'dark';
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('synfonia-accent') || '#8b5cf6';
  });

  const [songTitleColor, setSongTitleColor] = useState(() => {
    return localStorage.getItem('synfonia-song-color') || '';
  });

  // Novos estados de Acessibilidade
  const [fontSizeLevel, setFontSizeLevel] = useState(parseInt(localStorage.getItem('synfonia-font-size') || '1'));
  const [reduceMotion, setReduceMotion] = useState(localStorage.getItem('synfonia-reduce-motion') === 'true');
  const [viewMode, setViewMode] = useState(localStorage.getItem('synfonia-view-mode') || 'grid');
  const [queuePosition, setQueuePosition] = useState(localStorage.getItem('synfonia-queue-position') || 'right');

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('synfonia-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--color-brand', accentColor);
    root.style.setProperty('--color-brand-rgb', hexToRgb(accentColor));
    root.style.setProperty('--color-brand-contrast', getContrastColor(accentColor));
    root.style.setProperty('--color-brand-legible', getLegibleColor(accentColor, theme));
    localStorage.setItem('synfonia-accent', accentColor);
  }, [accentColor, theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (songTitleColor) {
      root.style.setProperty('--user-song-color', songTitleColor);
      localStorage.setItem('synfonia-song-color', songTitleColor);
    } else {
      root.style.removeProperty('--user-song-color');
      localStorage.removeItem('synfonia-song-color');
    }
  }, [songTitleColor]);

  // Efeito de Acessibilidade
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--font-size-level', fontSizeLevel);
    localStorage.setItem('synfonia-font-size', fontSizeLevel);
  }, [fontSizeLevel]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-reduce-motion', reduceMotion);
    localStorage.setItem('synfonia-reduce-motion', reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('synfonia-queue-position', queuePosition);
  }, [queuePosition]);

  const toggleTheme = (newTheme, event) => {
    if (newTheme === theme || reduceMotion) {
      setTheme(newTheme);
      return;
    }

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Calcular posição do clique e raio final
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    
    // Distância até o canto mais distante da tela
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.style.setProperty('--x', `${x}px`);
    root.style.setProperty('--y', `${y}px`);
    root.style.setProperty('--end-radius', `${endRadius}px`);

    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  const toggleViewMode = () => {
    const newView = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newView);
    localStorage.setItem('synfonia-view-mode', newView);
  };

  const changeAccentColor = (color) => {
    window.document.documentElement.classList.remove('no-transitions');
    setAccentColor(color);
  };

  const changeSongTitleColor = (color) => {
    window.document.documentElement.classList.remove('no-transitions');
    setSongTitleColor(color);
  };

  const changeFontSizeLevel = (level) => setFontSizeLevel(level);
  const toggleReduceMotion = () => setReduceMotion(!reduceMotion);

  const resetToDefaults = () => {
    setTheme('dark');
    setAccentColor('#8b5cf6');
    setSongTitleColor('');
    setFontSizeLevel(1);
    setReduceMotion(false);
    setViewMode('grid');
    setQueuePosition('right');
    
    localStorage.removeItem('synfonia-theme');
    localStorage.removeItem('synfonia-accent');
    localStorage.removeItem('synfonia-song-color');
    localStorage.removeItem('synfonia-font-size');
    localStorage.removeItem('synfonia-reduce-motion');
    localStorage.removeItem('synfonia-view-mode');
    localStorage.removeItem('synfonia-queue-position');
    
    // Forçar atualização do root
    const root = window.document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('--color-brand', '#8b5cf6');
    root.style.setProperty('--color-brand-rgb', hexToRgb('#8b5cf6'));
    root.style.setProperty('--color-brand-contrast', getContrastColor('#8b5cf6'));
    root.style.setProperty('--color-brand-legible', getLegibleColor('#8b5cf6', 'dark'));
    root.style.removeProperty('--user-song-color');
    root.style.setProperty('--font-size-level', '1');
    root.setAttribute('data-reduce-motion', 'false');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      accentColor, 
      changeAccentColor, 
      songTitleColor, 
      changeSongTitleColor,
      fontSizeLevel,
      changeFontSizeLevel,
      reduceMotion,
      toggleMotion: toggleReduceMotion,
      viewMode,
      toggleViewMode,
      queuePosition,
      setQueuePosition,
      resetToDefaults
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
