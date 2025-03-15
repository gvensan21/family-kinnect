
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Sample family tree data
const sampleFamilyData = {
  id: "1",
  name: "John Doe",
  gender: "male",
  birthYear: 1970,
  children: [
    {
      id: "2",
      name: "Sarah Doe",
      gender: "female",
      birthYear: 1995,
      children: [],
    },
    {
      id: "3",
      name: "Michael Doe",
      gender: "male",
      birthYear: 1998,
      children: [],
    },
  ],
  siblings: [
    {
      id: "4",
      name: "Jane Doe",
      gender: "female",
      birthYear: 1972,
      children: [
        {
          id: "5",
          name: "Robert Doe",
          gender: "male",
          birthYear: 2000,
          children: [],
        },
      ],
    },
  ],
  spouse: {
    id: "6",
    name: "Mary Doe",
    gender: "female",
    birthYear: 1972,
  },
  father: {
    id: "7",
    name: "William Doe",
    gender: "male",
    birthYear: 1945,
  },
  mother: {
    id: "8",
    name: "Elizabeth Doe",
    gender: "female",
    birthYear: 1947,
  },
};

// FamilyMember component
const FamilyMember = ({
  member,
  onSelect,
}: {
  member: any;
  onSelect: (member: any) => void;
}) => {
  const genderColor = member.gender === "male" ? "bg-blue-100 border-blue-300" : "bg-pink-100 border-pink-300";

  return (
    <div
      className={`p-3 rounded-lg ${genderColor} border cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onSelect(member)}
    >
      <h3 className="font-medium">{member.name}</h3>
      <p className="text-xs text-gray-600">b. {member.birthYear}</p>
    </div>
  );
};

// Actual FamilyTree component
const FamilyTree = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  // In Phase 1, this is a simplified representation
  // In later phases, we'll implement a more sophisticated visualization
  return (
    <div className="h-full overflow-auto p-6">
      <Alert className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <AlertTitle>Family Tree Visualization</AlertTitle>
        <AlertDescription>
          This is a simplified visualization for Phase 1. Click on family members
          to view details. In later phases, we'll implement a more sophisticated
          interactive tree based on Family Chart.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Parents</h2>
          <div className="grid grid-cols-2 gap-4">
            <FamilyMember
              member={sampleFamilyData.father}
              onSelect={handleSelectMember}
            />
            <FamilyMember
              member={sampleFamilyData.mother}
              onSelect={handleSelectMember}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">You and Spouse</h2>
          <div className="grid grid-cols-2 gap-4">
            <FamilyMember
              member={sampleFamilyData}
              onSelect={handleSelectMember}
            />
            <FamilyMember
              member={sampleFamilyData.spouse}
              onSelect={handleSelectMember}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Children</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sampleFamilyData.children.map((child) => (
              <FamilyMember
                key={child.id}
                member={child}
                onSelect={handleSelectMember}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Siblings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sampleFamilyData.siblings.map((sibling) => (
              <FamilyMember
                key={sibling.id}
                member={sibling}
                onSelect={handleSelectMember}
              />
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedMember?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2 mt-2">
                <p><strong>Gender:</strong> {selectedMember?.gender}</p>
                <p><strong>Birth Year:</strong> {selectedMember?.birthYear}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <Button variant="outline" asChild>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Edit</Button>
              <AlertDialogAction>View Details</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamilyTree;
