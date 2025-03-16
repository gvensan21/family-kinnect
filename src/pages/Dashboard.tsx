
import React from "react";
import { PanelLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewFamilyTreeFlow from "@/components/FamilyTree";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
  );
};

export default Dashboard;
