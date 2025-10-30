import { ChevronRight, ShoppingCart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "@/config/constants";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { user } = useSelector((state) => state.auth);

  const handleMenuItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SidebarHeader className="font-semibold flex-col border-b p-4">
        <Link to="/" className="flex gap-2">
          <ShoppingCart className="size-6" />
          Baker Corner
        </Link>
        <span className="text-sm text-muted-foreground">
          {" "}
          Welcome, {user?.name}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {Menu.map((item) =>
              item.subMenus?.length ? (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                  defaultOpen={item.subMenus.some(
                    (sub) => pathname === sub.url
                  )}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={
                          item.subMenus.some((sub) => pathname === sub.url)
                            ? "bg-accent text-accent-foreground font-semibold"
                            : ""
                        }
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subMenus.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            onClick={handleMenuItemClick}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={subItem.url}
                                className={`w-full ${
                                  pathname === subItem.url
                                    ? "bg-accent text-accent-foreground font-semibold"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                              >
                                <span>{subItem.title}</span>
                                {subItem.title === "Inbox" && unseen > 0
                                  ? ` (${unseen})`
                                  : ""}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title} onClick={handleMenuItemClick}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={
                      pathname === item.url
                        ? "bg-accent text-accent-foreground font-semibold"
                        : ""
                    }
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
