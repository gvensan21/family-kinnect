
import f3 from 'family-chart';
import * as d3 from 'd3';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates and configures a family chart
 * @param containerId The ID of the container element
 * @param data The family tree data to display
 * @returns The configured chart or null if there was an error
 */
export const createFamilyChart = (containerId: string, data: any[]) => {
  try {
    // Create the base chart with initial settings
    const f3Chart = f3.createChart(containerId, data)
      .setTransitionTime(1000)
      .setCardXSpacing(250)
      .setCardYSpacing(150)
      .setOrientationVertical()
      .setSingleParentEmptyCard(true, {label: 'ADD'});
  
    // Configure the card display
    const f3Card = f3Chart.setCard(f3.CardHtml)
      .setCardDisplay([["first name"],[]])
      .setCardDim({})
      .setMiniTree(true)
      .setStyle('imageRect')
      .setOnHoverPathToMain();
  
    // Set up the tree editing capability
    const f3EditTree = f3Chart.editTree()
      .fixed(true)
      .setFields(["first name", "gender", "birthday"])
      .setEditFirst(true);
    
    f3EditTree.setEdit();
    
    return { 
      chart: f3Chart, 
      card: f3Card, 
      editTree: f3EditTree 
    };
  } catch (error) {
    console.error("Error creating family chart:", error);
    toast.error("Failed to create family chart", {
      description: "There was an error rendering the family tree visualization."
    });
    return null;
  }
};

/**
 * Initializes the chart display
 * @param chart The f3 chart object
 * @param editTree The edit tree object
 */
export const initializeChartDisplay = (chart: any, editTree: any) => {
  try {
    // Update the tree with initial data
    chart.updateTree({initial: true});
    
    // Open the edit view on the main datum
    editTree.open(chart.getMainDatum());
    
    // Final update to render the tree
    chart.updateTree({initial: true});
    
    console.log("Family tree rendered successfully");
  } catch (error) {
    console.error("Error initializing chart display:", error);
    toast.error("Failed to initialize family tree", {
      description: "There was an error setting up the family tree display."
    });
  }
};

/**
 * Clears any existing chart from the container
 * @param containerRef Reference to the container element
 */
export const clearExistingChart = (containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return;
  d3.select(containerRef.current).selectAll("*").remove();
};

/**
 * Adds a new family member to the tree
 * @param treeData Current tree data
 * @param parentId ID of the parent to attach the new member to
 * @param memberData Data for the new member
 * @param relation Type of relation to add (child, spouse, etc)
 * @returns Updated tree data with the new member
 */
export const addFamilyMember = (treeData: any[], parentId: string, memberData: any, relation: string) => {
  // Create a new member with unique ID
  const newMemberId = uuidv4();
  const newMember = {
    id: newMemberId,
    data: {
      ...memberData
    },
    rels: {}
  };

  // Deep clone the tree data to avoid mutation
  const updatedTreeData = JSON.parse(JSON.stringify(treeData));
  
  // Find the parent node
  const parentNode = updatedTreeData.find((node: any) => node.id === parentId);
  if (!parentNode) {
    toast.error("Parent not found");
    return treeData;
  }
  
  // Set up the relationship based on relation type and gender
  if (relation === 'child') {
    // Add child relation to parent
    if (!parentNode.rels.children) {
      parentNode.rels.children = [];
    }
    parentNode.rels.children.push(newMemberId);
    
    // Add parent relation to child
    newMember.rels.father = memberData.gender === 'F' ? undefined : parentId;
    newMember.rels.mother = memberData.gender === 'F' ? parentId : undefined;
    
    // If parent has spouse, add the spouse as the other parent
    if (parentNode.rels.spouses && parentNode.rels.spouses.length > 0) {
      const spouseId = parentNode.rels.spouses[0];
      if (memberData.gender === 'F') {
        newMember.rels.father = spouseId;
      } else {
        newMember.rels.mother = spouseId;
      }
      
      // Add child to spouse's children
      const spouseNode = updatedTreeData.find((node: any) => node.id === spouseId);
      if (spouseNode) {
        if (!spouseNode.rels.children) {
          spouseNode.rels.children = [];
        }
        spouseNode.rels.children.push(newMemberId);
      }
    }
  } else if (relation === 'spouse') {
    // Add spouse relation
    if (!parentNode.rels.spouses) {
      parentNode.rels.spouses = [];
    }
    parentNode.rels.spouses.push(newMemberId);
    
    // Add reciprocal spouse relation
    newMember.rels.spouses = [parentId];
    
    // If parent has children, add the children to the spouse
    if (parentNode.rels.children && parentNode.rels.children.length > 0) {
      newMember.rels.children = [...parentNode.rels.children];
      
      // Update the children's other parent
      for (const childId of parentNode.rels.children) {
        const childNode = updatedTreeData.find((node: any) => node.id === childId);
        if (childNode) {
          if (memberData.gender === 'F') {
            childNode.rels.mother = newMemberId;
          } else {
            childNode.rels.father = newMemberId;
          }
        }
      }
    }
  }
  
  // Add the new member to the tree
  updatedTreeData.push(newMember);
  
  return updatedTreeData;
};

/**
 * Updates an existing family member's data
 * @param treeData Current tree data
 * @param memberId ID of the member to update
 * @param memberData New data for the member
 * @returns Updated tree data
 */
export const updateFamilyMember = (treeData: any[], memberId: string, memberData: any) => {
  // Deep clone the tree data to avoid mutation
  const updatedTreeData = JSON.parse(JSON.stringify(treeData));
  
  // Find and update the member
  const memberIndex = updatedTreeData.findIndex((node: any) => node.id === memberId);
  if (memberIndex === -1) {
    toast.error("Member not found");
    return treeData;
  }
  
  updatedTreeData[memberIndex].data = {
    ...updatedTreeData[memberIndex].data,
    ...memberData
  };
  
  return updatedTreeData;
};

/**
 * Deletes a family member from the tree
 * @param treeData Current tree data
 * @param memberId ID of the member to delete
 * @returns Updated tree data without the member
 */
export const deleteFamilyMember = (treeData: any[], memberId: string) => {
  // Deep clone the tree data to avoid mutation
  const updatedTreeData = JSON.parse(JSON.stringify(treeData));
  
  // Find the member to delete
  const memberToDelete = updatedTreeData.find((node: any) => node.id === memberId);
  if (!memberToDelete) {
    toast.error("Member not found");
    return treeData;
  }
  
  // Remove references from parents
  if (memberToDelete.rels.father) {
    const father = updatedTreeData.find((node: any) => node.id === memberToDelete.rels.father);
    if (father && father.rels.children) {
      father.rels.children = father.rels.children.filter((id: string) => id !== memberId);
    }
  }
  
  if (memberToDelete.rels.mother) {
    const mother = updatedTreeData.find((node: any) => node.id === memberToDelete.rels.mother);
    if (mother && mother.rels.children) {
      mother.rels.children = mother.rels.children.filter((id: string) => id !== memberId);
    }
  }
  
  // Remove references from spouses
  if (memberToDelete.rels.spouses) {
    for (const spouseId of memberToDelete.rels.spouses) {
      const spouse = updatedTreeData.find((node: any) => node.id === spouseId);
      if (spouse && spouse.rels.spouses) {
        spouse.rels.spouses = spouse.rels.spouses.filter((id: string) => id !== memberId);
      }
    }
  }
  
  // Remove references from children
  if (memberToDelete.rels.children) {
    for (const childId of memberToDelete.rels.children) {
      const child = updatedTreeData.find((node: any) => node.id === childId);
      if (child) {
        if (child.rels.father === memberId) {
          delete child.rels.father;
        }
        if (child.rels.mother === memberId) {
          delete child.rels.mother;
        }
      }
    }
  }
  
  // Remove the member from the tree
  return updatedTreeData.filter((node: any) => node.id !== memberId);
};
