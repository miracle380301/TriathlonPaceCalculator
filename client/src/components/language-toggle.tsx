import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {language === 'ko' ? t('english') : t('korean')}
    </Button>
  );
}