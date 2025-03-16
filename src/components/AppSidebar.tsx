
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  UserRound, 
  LayoutDashboard, 
  Search, 
  Users,
  Upload,
  Globe
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
  SidebarProvider,
  useSidebar
} from "@/components/ui/sidebar";

export const AppSidebarContent = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">GotraBandhus</h2>
            <p className="text-xs text-muted-foreground">Family Tree Manager</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                    <span>Dashboard</span>
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
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Find Your Bandhu">
                  <Link to="#">
                    <Search />
                    <span>Find Your Bandhu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Connect Families">
                  <Link to="#">
                    <Users />
                    <span>Connect Families</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Export">
                  <Link to="#">
                    <Upload />
                    <span>Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/">
              <span>Sign Out</span>
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AppSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useSidebar();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex w-full">
        {state === "expanded" && <AppSidebarContent />}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
