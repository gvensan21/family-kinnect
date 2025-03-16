
import React, { useEffect, useRef, useState } from "react";
import 'family-chart/styles/family-chart.css';
import 'd3-transition'; // Add d3-transition dependency to make sure transitions work
import { familyTreeData } from '@/data/familyTreeData';
import { 
  createFamilyChart, 
  initializeChartDisplay, 
  clearExistingChart,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember
} from '@/utils/familyChartUtils';
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import FamilyMemberDialog from "./FamilyMemberDialog";
import { toast } from "sonner";

const NewFamilyTreeFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [editTreeInstance, setEditTreeInstance] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [treeData, setTreeData] = useState(familyTreeData);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing chart if any
    clearExistingChart(containerRef);
    
    // Create and configure the family chart
    const chartComponents = createFamilyChart('#FamilyChart', treeData);
    
    // If chart creation was successful, initialize the display
    if (chartComponents) {
      const { chart, editTree, card } = chartComponents;
      setChartInstance(chart);
      setEditTreeInstance(editTree);
      
      // Set up card click handler
      card.setOnCardClick((e: any, d: any) => {
        setSelectedMember(d);
        
        // Default behavior (focus on node)
        if (!editTree.isAddingRelative()) {
          card.onCardClickDefault(e, d);
        }
      });
      
      initializeChartDisplay(chart, editTree);
    }
    
    // Cleanup function to clear the chart when component unmounts
    return () => {
      if (containerRef.current) {
        clearExistingChart(containerRef);
      }
    };
  }, [treeData]);

  const handleAddMember = (relation: string) => {
    if (!selectedMember) {
      toast.error("Please select a family member first");
      return;
    }
    
    setDialogMode('add');
    setIsDialogOpen(true);
  };

  const handleEditMember = () => {
    if (!selectedMember) {
      toast.error("Please select a family member first");
      return;
    }
    
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteMember = () => {
    if (!selectedMember) {
      toast.error("Please select a family member first");
      return;
    }

    if (selectedMember.id === '0') {
      toast.error("Cannot delete the main family member");
      return;
    }

    const updatedData = deleteFamilyMember(treeData, selectedMember.id);
    setTreeData(updatedData);
    setSelectedMember(null);
    toast.success("Family member deleted successfully");
  };

  const handleSaveMember = (memberData: any) => {
    if (dialogMode === 'add') {
      // Add new family member
      const relation = "child"; // Default relation
      const updatedData = addFamilyMember(treeData, selectedMember.id, memberData, relation);
      setTreeData(updatedData);
      toast.success("Family member added successfully");
    } else {
      // Update existing family member
      const updatedData = updateFamilyMember(treeData, selectedMember.id, memberData);
      setTreeData(updatedData);
      toast.success("Family member updated successfully");
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleAddMember} className="flex items-center">
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Member
        </Button>
        <Button size="sm" variant="outline" onClick={handleEditMember} className="flex items-center">
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button size="sm" variant="outline" onClick={handleDeleteMember} className="flex items-center text-red-500 hover:text-red-700">
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>
      
      <div className="f3 f3-cont h-full w-full" id="FamilyChart" ref={containerRef}></div>
      
      <FamilyMemberDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMember}
        mode={dialogMode}
        initialData={dialogMode === 'edit' ? selectedMember?.data : {}}
      />
    </div>
  );
};

export default NewFamilyTreeFlow;
