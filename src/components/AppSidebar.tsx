
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  UserRound, 
  LayoutDashboard, 
  Search, 
  Users,
  Upload,
  Globe,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";

export const AppSidebarContent = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/">
          <div className={`px-2 py-4 flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
            <Globe className="h-5 w-5" />
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold">GotraBandhus</h2>
                <p className="text-xs text-muted-foreground">Family Tree Manager</p>
              </div>
            )}
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Dashboard"
                  isActive={location.pathname === "/dashboard"}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    {!isCollapsed && <span>Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Profile"
                  isActive={location.pathname === "/profile"}
                >
                  <Link to="/profile">
                    <UserRound />
                    {!isCollapsed && <span>Profile</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Find Your Bandhu">
                  <Link to="#">
                    <Search />
                    {!isCollapsed && <span>Find Your Bandhu</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Connect Families">
                  <Link to="#">
                    <Users />
                    {!isCollapsed && <span>Connect Families</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Export">
                  <Link to="#">
                    <Upload />
                    {!isCollapsed && <span>Export</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={`px-2 py-2 ${isCollapsed ? "flex justify-center" : ""}`}>
          <Button variant="outline" className={`${isCollapsed ? "p-2 h-9 w-9" : "w-full justify-start"}`} asChild>
            <Link to="/">
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AppSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex w-full">
      <AppSidebarContent />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
