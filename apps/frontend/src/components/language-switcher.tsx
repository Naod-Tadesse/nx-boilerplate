import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@org/ui';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'አማ', label: 'አማርኛ', short: 'አማ' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = languages.find((l) => l.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5 px-3 h-9 border-border"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-normal">{currentLang?.short ?? 'EN'}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={i18n.language === lang.code ? 'bg-accent' : ''}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
