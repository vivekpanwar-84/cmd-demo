// components/layout/menu.ts
import {
  LayoutDashboard,
  Building2,
  UsersRound,
  CreditCard,
  Wallet,
  LayoutGrid,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "organizations",
    label: "Organizations",
    href: "/organizations",
    icon: Building2,
  },
  {
    id: "staff",
    label: "Admin Staff",
    href: "/staff",
    icon: UsersRound,
  },
  {
    id: "Plans",
    label: "Plans",
    href: "/subscriptions",
    icon: CreditCard,
  },
  {
    id: "subscriptions",
    label: "Subcriptions",
    href: "/plans",
    icon: Wallet,
  },
  {
    id: "permissions",
    label: "Permissions",
    href: "/permissions",
    icon: ShieldCheck,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
