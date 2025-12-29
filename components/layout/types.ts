import { UserProfile } from "@/lib/types";

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
  onClick?: never;
};

type NavButton = BaseNavItem & {
  onClick: () => void;
  url?: never;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
  onClick?: never;
  defaultOpen?: boolean;
};

type NavItem = NavCollapsible | NavLink | NavButton;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  user: UserProfile;
  teams: Team[];
  navGroups: NavGroup[];
};

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavLink,
  NavButton,
  NavCollapsible,
  Team,
  BaseNavItem,
};
