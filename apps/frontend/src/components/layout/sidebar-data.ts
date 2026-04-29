import {
  LayoutGrid,
  UserCheck,
  DollarSign,
  Command,
  type LucideIcon,
} from 'lucide-react';

export interface NavSubItem {
  titleKey: string;
  url: string;
  icon?: LucideIcon;
  requiredPermission?: string;
}

export interface NavItem {
  titleKey: string;
  url: string;
  icon?: LucideIcon;
  items?: NavSubItem[];
  requiredPermission?: string;
}

export interface TeamItem {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export const teams: TeamItem[] = [
  {
    name: 'SIMS',
    logo: Command,
    plan: 'Free',
  },
];

export const navMain: NavItem[] = [
  {
    titleKey: 'dashboard',
    url: '/',
    icon: LayoutGrid,
  },

  {
    titleKey: 'payments',
    url: '#',
    icon: DollarSign,
    items: [
      {
        titleKey: 'repayments',
        url: '/payments/billing-accounts',
        icon: UserCheck,
        requiredPermission: 'billing-account:list',
      }
    ],
  },

 
];
