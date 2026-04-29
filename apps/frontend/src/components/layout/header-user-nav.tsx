import { useState } from 'react';
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ConfirmDialog,
} from "@org/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@org/ui";
import { useNavigate } from '@tanstack/react-router';
import { useLogout } from "@/features/auth/hooks/use-auth";

export function HeaderUserNav({
  user,
}: {
  user: {
    name: string;
    role: string;
    avatar: string;
    organization?: string;
  };
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, isPending: isLoggingOut } = useLogout();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 outline-none hover:bg-accent transition-colors cursor-pointer">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:grid text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.role}
            </span>
            {user.organization && (
              <span className="truncate text-xs text-muted-foreground">
                {user.organization}
              </span>
            )}
          </div>
          <ChevronDown className="hidden md:block size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role}
              </span>
              {user.organization && (
                <span className="truncate text-xs text-muted-foreground">
                  {user.organization}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            {t('upgradeToPro')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
            <BadgeCheck />
            {t('account')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            {t('billing')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            {t('notifications')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLogoutOpen(true)} disabled={isLoggingOut}>
          <LogOut />
          {isLoggingOut ? t('loggingOut') : t('logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title={t('logoutConfirmTitle')}
        description={t('logoutConfirmDescription')}
        confirmLabel={t('logOut')}
        cancelLabel={t('cancel')}
        confirmVariant="destructive"
        onConfirm={() => logout()}
        isPending={isLoggingOut}
      />
    </DropdownMenu>
  );
}
