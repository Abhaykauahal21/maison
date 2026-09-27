export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  footerNav: {
    title: string;
    items: NavItem[];
  }[];
}

export const navigationConfig: NavigationConfig = {
  mainNav: [],
  footerNav: [],
};
