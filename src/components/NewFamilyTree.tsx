
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
  deleteFamilyMember,
  exportFamilyTree,
  importFamilyTree
} from '@/utils/familyChartUtils';
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Download, Upload, Trash2 } from "lucide-react";
import FamilyMemberDialog, { FamilyMemberFormData } from "./FamilyMemberDialog";
import { toast } from "sonner";

// Define dialog states
type DialogState = {
  isOpen: boolean;
  title: string;
  mode: "add" | "edit";
  relationshipType?: "child" | "spouse" | "parent";
  selectedMemberId?: string;
  initialData?: Partial<FamilyMemberFormData>;
};

const NewFamilyTreeFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: "",
    mode: "add"
  });
  
  // Load the family chart
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing chart if any
    clearExistingChart(containerRef);
    
    // Create and configure the family chart
    const chartComponents = createFamilyChart('#FamilyChart', familyTreeData);
    
    // If chart creation was successful, initialize the display
    if (chartComponents) {
      const { chart, editTree, card } = chartComponents;
      chartRef.current = chart;
      
      // Add custom event handlers
      card.setOnCardClick((e: any, d: any) => {
        setSelectedNode(d);
        if (editTree.isAddingRelative()) return;
        card.onCardClickDefault(e, d);
      });
      
      initializeChartDisplay(chart, editTree);
    }
    
    // Cleanup function to clear the chart when component unmounts
    return () => {
      if (containerRef.current) {
        clearExistingChart(containerRef);
      }
    };
  }, []);

  // Handle opening the add family member dialog
  const handleOpenAddDialog = (relationshipType: "child" | "spouse" | "parent") => {
    if (!selectedNode) {
      toast.error("Please select a family member first", {
        description: "You need to select a family member before adding a relative."
      });
      return;
    }

    let title = "";
    switch (relationshipType) {
      case "child":
        title = "Add Child";
        break;
      case "spouse":
        title = "Add Spouse";
        break;
      case "parent":
        title = "Add Parent";
        break;
    }

    setDialogState({
      isOpen: true,
      title,
      mode: "add",
      relationshipType,
      selectedMemberId: selectedNode.id,
      initialData: {}
    });
  };

  // Handle opening the edit family member dialog
  const handleOpenEditDialog = () => {
    if (!selectedNode) {
      toast.error("Please select a family member first", {
        description: "You need to select a family member to edit their information."
      });
      return;
    }

    setDialogState({
      isOpen: true,
      title: "Edit Family Member",
      mode: "edit",
      selectedMemberId: selectedNode.id,
      initialData: selectedNode.data
    });
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle saving family member data
  const handleSaveFamilyMember = (data: FamilyMemberFormData) => {
    if (dialogState.mode === "add" && dialogState.relationshipType && dialogState.selectedMemberId) {
      addFamilyMember(
        chartRef.current, 
        dialogState.relationshipType, 
        dialogState.selectedMemberId, 
        data
      );
    } else if (dialogState.mode === "edit" && dialogState.selectedMemberId) {
      updateFamilyMember(
        chartRef.current,
        dialogState.selectedMemberId,
        data
      );
    }
    
    handleCloseDialog();
  };

  // Handle deleting a family member
  const handleDeleteFamilyMember = () => {
    if (dialogState.selectedMemberId) {
      deleteFamilyMember(chartRef.current, dialogState.selectedMemberId);
      setSelectedNode(null);
    }
    
    handleCloseDialog();
  };

  // Handle exporting the family tree
  const handleExportTree = () => {
    if (!chartRef.current) return;
    
    const jsonData = exportFamilyTree(chartRef.current);
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'family-tree.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle importing a family tree
  const handleImportTree = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!chartRef.current || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const jsonData = event.target.result as string;
        importFamilyTree(chartRef.current, jsonData);
        setSelectedNode(null);
      }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset the input
  };

  return (
    <div className="relative h-full w-full">
      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          onClick={handleOpenEditDialog}
          disabled={!selectedNode}
          title="Edit selected member"
        >
          Edit Member
        </Button>
        
        <Button
          size="sm"
          onClick={() => handleOpenAddDialog("child")}
          disabled={!selectedNode}
          title="Add child to selected member"
        >
          <UserPlus className="h-4 w-4 mr-1" /> Child
        </Button>
        
        <Button
          size="sm"
          onClick={() => handleOpenAddDialog("spouse")}
          disabled={!selectedNode}
          title="Add spouse to selected member"
        >
          <UserPlus className="h-4 w-4 mr-1" /> Spouse
        </Button>
        
        <Button
          size="sm"
          onClick={() => handleOpenAddDialog("parent")}
          disabled={!selectedNode}
          title="Add parent to selected member"
        >
          <UserPlus className="h-4 w-4 mr-1" /> Parent
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportTree}
          title="Export family tree as JSON"
        >
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
        
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            title="Import family tree from JSON"
          >
            <Upload className="h-4 w-4 mr-1" /> Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportTree}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>
      
      {/* Family tree visualization */}
      <div className="f3 f3-cont h-full w-full" id="FamilyChart" ref={containerRef}></div>
      
      {/* Family member dialog */}
      <FamilyMemberDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveFamilyMember}
        onDelete={dialogState.mode === "edit" ? handleDeleteFamilyMember : undefined}
        initialData={dialogState.initialData}
        title={dialogState.title}
        mode={dialogState.mode}
        relationshipType={dialogState.relationshipType}
      />
    </div>
  );
};

export default NewFamilyTreeFlow;
