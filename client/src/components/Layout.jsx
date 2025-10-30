import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileSpreadsheet, LogOut } from "lucide-react";
import { toast } from "sonner";
// import { resetTokenAndCredentials } from "../redux/auth-slice";
import { useDispatch, useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = () => {
  const dispatch = useDispatch();
  //   const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(FileSpreadsheet);

  const handleLogout = () => {
    // dispatch(resetTokenAndCredentials());
    toast.success("Logout successful");
  };

  return (
    <SidebarProvider>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarInset className="flex flex-col w-full overflow-hidden">
        <header className="flex justify-between h-[57px] shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger
            className="-ml-1"
            onClick={() => setSidebarOpen((prev) => !prev)}
          />
          <div className="flex items-center gap-2">
            <LogOut
              className="size-8 p-2 bg-gray-100 rounded cursor-pointer"
              onClick={handleLogout}
            />
            {/* <Avatar className="size-8">
              <AvatarImage
                src={user?.pro_pic || ""}
                alt="User"
                className="object-cover"
              />
              <AvatarFallback className="text-sm">
                {user?.name?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar> */}
          </div>
        </header>

        {/* This part ensures scrollable content without horizontal overflow */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
