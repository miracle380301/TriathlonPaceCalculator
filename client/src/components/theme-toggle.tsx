import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">
        {theme === 'light' ? t('darkMode') : t('lightMode')}
      </span>
    </Button>
  );
}