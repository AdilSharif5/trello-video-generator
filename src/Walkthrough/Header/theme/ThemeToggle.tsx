/**
 * @param {null} props - Unused props
 */
import { useEffect, useState } from "react";

import Button from "../../reusableComponents/button/Button";

interface props {
  isDarkMode: boolean;
}

const ThemeToggle: React.FC<props> = ({ isDarkMode }) => {
  const [theme, changeTheme] = useState("light");

  const toggleTheme = (mode?: string) => {
    const updatedTheme =
      typeof mode === "string" ? mode : theme === "light" ? "dark" : "light";
    changeTheme(updatedTheme);
  };

  useEffect(() => {
    toggleTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    document.querySelector("#my-app")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Button id="theme-toggle" label={`Theme: ${theme}`} onClick={toggleTheme} />
  );
};

export default ThemeToggle;
