
import React from "react";
import { Link } from "react-router-dom";
import { 
  UserRound, 
  PlusCircle, 
  Trash2, 
  Upload, 
  Save, 
  Settings,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewFamilyTreeFlow from "@/components/NewFamilyTree";
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
  SidebarTrigger
} from "@/components/ui/sidebar";

const Dashboard1 = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-2 py-4">
              <h2 className="text-lg font-semibold">GotraBandhus</h2>
              <p className="text-xs text-muted-foreground">Family Tree Manager</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Add Family Member">
                      <PlusCircle />
                      <span>Add Family Member</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Delete Member">
                      <Trash2 />
                      <span>Delete Member</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Export Tree">
                      <Upload />
                      <span>Export Tree</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Save Tree">
                      <Save />
                      <span>Save Tree</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profile">
                      <Link to="/profile">
                        <UserRound />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <Link to="/">
                        <Settings />
                        <span>Settings</span>
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
                  <PanelLeft className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Family Tree</h1>
              <p className="text-muted-foreground">Welcome back to GotraBandhus</p>
            </div>
            <SidebarTrigger />
          </header>

          <Card className="h-[calc(100vh-10rem)]">
            <CardHeader>
              <CardTitle>Family Tree Visualization</CardTitle>
              <CardDescription>
                Drag to reposition the tree, zoom with mouse wheel, and click on members to see details
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] p-0">
              <NewFamilyTreeFlow />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard1;
