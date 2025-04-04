import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const ThemeToggle = () => {
  // Initialize with system preference or stored preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // Otherwise use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Toggle 
      pressed={isDarkMode} 
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
