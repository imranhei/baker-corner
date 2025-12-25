import {
  Package,
  LayoutDashboard,
  PackagePlus,
  Settings,
  Truck,
  BarChart3,
  Boxes,
} from "lucide-react";

export const Menu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Items",
    url: "/items",
    icon: Boxes,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Package,
  },
  {
    title: "Receive",
    url: "/receive",
    icon: PackagePlus,
  },
  {
    title: "Stock",
    url: "/stock",
    icon: Package,
  },
  {
    title: "Sales",
    url: "/dispatch",
    icon: Truck,
  },
  {
    title: "Summary",
    url: "/summary",
    icon: BarChart3,
  },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  //   subMenus: [
  //     {
  //       title: "Profile",
  //       url: "/admin/profile",
  //     },
  //     {
  //       title: "Users",
  //       url: "/admin/users",
  //     },
  //     {
  //       title: "Change Password",
  //       url: "/admin/change-password",
  //     },
  //   ],
  // },
];
