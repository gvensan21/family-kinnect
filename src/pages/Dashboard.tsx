
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewFamilyTreeFlow from "@/components/FamilyTree";
import { useQuery } from "@tanstack/react-query";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { FamilyMember } from "@/types/user";
import { useAuth } from "@clerk/clerk-react";

const Dashboard = () => {
  const { userId } = useAuth();
  const { getFamilyTree } = useFamilyTree();

  const { data: familyData, isLoading, error } = useQuery({
    queryKey: ['familyTree', userId],
    queryFn: getFamilyTree,
    enabled: !!userId,
  });

  return (
    <div className="container mx-auto px-4 py-8 fixed top-0">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Family Tree</h1>
          <p className="text-muted-foreground">Welcome back to GotraBandhus</p>
        </div>
      </header>

      <Card className="h-[calc(100vh-10rem)]">
        <CardHeader>
          <CardTitle>Family Tree Visualization</CardTitle>
          <CardDescription>
            Drag to reposition the tree, zoom with mouse wheel, and click on members to see details
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              Loading your family tree...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-destructive">
              Error loading family tree data
            </div>
          ) : !familyData || familyData.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col gap-4">
              <p>Your family tree is empty</p>
              <p className="text-muted-foreground">Complete your profile to get started</p>
            </div>
          ) : (
            <NewFamilyTreeFlow initialData={familyData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
