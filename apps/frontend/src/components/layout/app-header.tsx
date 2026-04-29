import { Bell, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from '@tanstack/react-router';
// import { HeaderUserNav } from '@/components/layout/header-user-nav';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@org/ui';
import { Button } from '@org/ui';
import { Separator } from '@org/ui';
import { SidebarTrigger } from '@org/ui';
// import { UserType } from '@/types/enums';
import React from 'react';

const segmentToKey: Record<string, string> = {
  'user-management': 'userManagement',
  'staffs': 'staffs',
  'customers': 'customers',
  'applications': 'applications',
  'all-applications': 'allApplications',
  'roles': 'roles',
  'permissions': 'permissions',
  'organizations': 'organizations',
  'create': 'create',
  'edit': 'edit',
  'insurance-settings': 'insuranceSettings',
  'product-subtypes': 'productSubtypes',
  'bank-settings': 'bankSettings',
  'product-configs': 'productConfigs',
  'bank-configs': 'bankConfigs',
  'payments': 'payments',
  'billing-accounts': 'billingAccounts',
  'deposits': 'deposits',
  'disbursements': 'disbursements',
  'policies': 'policies',
  'premium-payments': 'premiumPayments',
  'profile': 'myProfile',
};

function segmentLabel(segment: string, t: (key: string) => string): string {
  const key = segmentToKey[segment];
  if (key) return t(key);
  // Dynamic params like UUIDs — skip translation
  return segment;
}

function isParamSegment(segment: string): boolean {
  // UUIDs or other dynamic params — don't render as breadcrumb
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(segment);
}

export function AppHeader() {
  const { t } = useTranslation();
  // const { data: authUser } = useCurrentUser();
  const location = useLocation();

 

  // Build breadcrumb items from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems: { label: string; to: string }[] = [
    { label: t('dashboard'), to: '/' },
  ];

  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    if (isParamSegment(segment)) continue;
    breadcrumbItems.push({
      label: segmentLabel(segment, t),
      to: currentPath,
    });
  }

  return (
    <div className="bg-background sticky top-0 z-10 px-2 py-1">
    <header className="bg-sidebar flex h-20 shrink-0 items-center justify-between gap-4 rounded-lg border px-6 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      {/* Left: Sidebar trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <React.Fragment key={item.to}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className={index === 0 ? "text-base font-semibold text-foreground" : "text-sm text-muted-foreground"}>
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.to} className={index === 0 ? "text-base font-semibold text-foreground" : "text-sm text-muted-foreground"}>
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Search + Lang + Bell + User */}
      <div className="flex items-center gap-3">
      

        <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-muted/80">
          <MessageCircle className="size-5 text-muted-foreground" />
          <span className="sr-only">{t('messages')}</span>
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-muted/80">
          <Bell className="size-5 text-muted-foreground" />
          <span className="sr-only">{t('notifications')}</span>
        </Button>

        <LanguageSwitcher />

        {/* <HeaderUserNav user={user} /> */}
      </div>
    </header>
    </div>
  );
}
