import { Settings, Users, Home, LayoutDashboard } from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    id: "123",
    name: "Loading...",
    email: "loading...",
    avatar: "",
    role: "staff",
  },
  teams: [],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Home",
          url: "/home",
          icon: Home,
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Settings",
          icon: Settings,
          url: "/settings",
        },
      ],
    },
  ],
};
