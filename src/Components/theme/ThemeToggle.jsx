import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsSun, BsMoon } from 'react-icons/bs';

const ThemeToggle = () => {
  // Initialize state with the saved theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

 
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  const handleToggle = () => {
  
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button onClick={handleToggle} variant="outline-light" className="ms-3">
      {theme === 'dark' ? <BsSun /> : <BsMoon />}
    </Button>
  );
};

export default ThemeToggle;
