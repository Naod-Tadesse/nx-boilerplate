import * as React from 'react';


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@org/ui';

export function CompanyLogo({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-center group-data-[collapsible=icon]:size-auto! group-data-[collapsible=icon]:p-1!"
        >
          <div className="flex aspect-square size-10 items-center justify-center shrink-0">
            <img
              src="/ekofs.png"
              alt="Ekos Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-lg leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-2xl font-bold text-dark-green-500 dark:text-white">{import.meta.env.VITE_COMPANY_NAME}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
