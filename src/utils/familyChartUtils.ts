
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
      .setCardDisplay([["first name", "last name"], ["birthday"]])
      .setCardDim({})
      .setMiniTree(true)
      .setStyle('imageRect')
      .setOnHoverPathToMain();
  
    // Set up the tree editing capability
    const f3EditTree = f3Chart.editTree()
      .fixed(true)
      .setFields(["first name", "last name", "birthday", "gender"])
      .setEditFirst(true);
    
    f3EditTree.setEdit();
    
    // Handle card click events
    f3Card.setOnCardClick((e, d) => {
      f3EditTree.open(d);
      if (f3EditTree.isAddingRelative()) return;
      f3Card.onCardClickDefault(e, d);
    });

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
 * @param chart The family chart instance
 * @param relation The relation type (e.g., child, spouse, parent)
 * @param parentId The parent node ID (if adding a child)
 * @param initialData Initial data for the new member
 * @returns The ID of the newly created member
 */
export const addFamilyMember = (chart: any, relation: 'child' | 'spouse' | 'parent', parentId: string, initialData: any = {}) => {
  try {
    const newId = uuidv4();
    const defaultData = {
      id: newId,
      data: {
        "first name": "",
        "last name": "",
        gender: "M",
        ...initialData
      },
      rels: {}
    };

    if (relation === 'child') {
      // Get parent data
      const parentNode = chart.data().find((d: any) => d.id === parentId);
      if (!parentNode) {
        throw new Error("Parent node not found");
      }

      // Add child relation to parent
      if (!parentNode.rels.children) {
        parentNode.rels.children = [];
      }
      parentNode.rels.children.push(newId);

      // Add parent relation to child
      defaultData.rels.father = parentNode.data.gender === 'M' ? parentId : undefined;
      defaultData.rels.mother = parentNode.data.gender === 'F' ? parentId : undefined;
    } else if (relation === 'spouse') {
      // Get person data
      const personNode = chart.data().find((d: any) => d.id === parentId);
      if (!personNode) {
        throw new Error("Person node not found");
      }

      // Add spouse relation to person
      if (!personNode.rels.spouses) {
        personNode.rels.spouses = [];
      }
      personNode.rels.spouses.push(newId);

      // Add spouse relation to new person
      defaultData.rels.spouses = [parentId];
      
      // Set opposite gender for spouse by default
      defaultData.data.gender = personNode.data.gender === 'M' ? 'F' : 'M';
    } else if (relation === 'parent') {
      // Get child data
      const childNode = chart.data().find((d: any) => d.id === parentId);
      if (!childNode) {
        throw new Error("Child node not found");
      }

      // Determine if adding father or mother based on initialData or default to father
      const parentType = initialData.gender === 'F' ? 'mother' : 'father';
      
      // Add parent relation to child
      childNode.rels[parentType] = newId;

      // Add child relation to parent
      defaultData.rels.children = [parentId];
    }

    // Add the new person to the data array
    chart.data().push(defaultData);
    chart.updateTree();
    
    toast.success("Family member added", {
      description: `A new ${relation} has been added to the family tree.`
    });
    
    return newId;
  } catch (error) {
    console.error("Error adding family member:", error);
    toast.error("Failed to add family member", {
      description: "There was an error adding a new member to the family tree."
    });
    return null;
  }
};

/**
 * Updates a family member's data
 * @param chart The family chart instance
 * @param memberId The ID of the member to update
 * @param newData The new data to apply
 */
export const updateFamilyMember = (chart: any, memberId: string, newData: any) => {
  try {
    const memberNode = chart.data().find((d: any) => d.id === memberId);
    if (!memberNode) {
      throw new Error("Family member not found");
    }

    // Update the member's data
    memberNode.data = {
      ...memberNode.data,
      ...newData
    };

    chart.updateTree();
    
    toast.success("Family member updated", {
      description: "The family member's information has been updated."
    });
    
    return true;
  } catch (error) {
    console.error("Error updating family member:", error);
    toast.error("Failed to update family member", {
      description: "There was an error updating the family member's information."
    });
    return false;
  }
};

/**
 * Deletes a family member from the tree
 * @param chart The family chart instance
 * @param memberId The ID of the member to delete
 */
export const deleteFamilyMember = (chart: any, memberId: string) => {
  try {
    const dataArray = chart.data();
    const memberIndex = dataArray.findIndex((d: any) => d.id === memberId);
    
    if (memberIndex === -1) {
      throw new Error("Family member not found");
    }

    const memberToDelete = dataArray[memberIndex];

    // Remove references from other nodes
    dataArray.forEach((node: any) => {
      // Remove from children arrays
      if (node.rels.children && node.rels.children.includes(memberId)) {
        node.rels.children = node.rels.children.filter((id: string) => id !== memberId);
        if (node.rels.children.length === 0) {
          delete node.rels.children;
        }
      }
      
      // Remove from spouse arrays
      if (node.rels.spouses && node.rels.spouses.includes(memberId)) {
        node.rels.spouses = node.rels.spouses.filter((id: string) => id !== memberId);
        if (node.rels.spouses.length === 0) {
          delete node.rels.spouses;
        }
      }
      
      // Remove as father or mother
      if (node.rels.father === memberId) {
        delete node.rels.father;
      }
      
      if (node.rels.mother === memberId) {
        delete node.rels.mother;
      }
    });

    // Remove the node itself
    dataArray.splice(memberIndex, 1);
    
    chart.updateTree();
    
    toast.success("Family member removed", {
      description: "The family member has been removed from the family tree."
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting family member:", error);
    toast.error("Failed to delete family member", {
      description: "There was an error removing the family member from the tree."
    });
    return false;
  }
};

/**
 * Exports the family tree data to JSON
 * @param chart The family chart instance
 * @returns The family tree data as a JSON string
 */
export const exportFamilyTree = (chart: any) => {
  try {
    const treeData = chart.data();
    return JSON.stringify(treeData, null, 2);
  } catch (error) {
    console.error("Error exporting family tree:", error);
    toast.error("Failed to export family tree", {
      description: "There was an error exporting the family tree data."
    });
    return null;
  }
};

/**
 * Imports family tree data from JSON
 * @param chart The family chart instance
 * @param jsonData The JSON data to import
 */
export const importFamilyTree = (chart: any, jsonData: string) => {
  try {
    const treeData = JSON.parse(jsonData);
    
    // Replace the current data with the imported data
    const currentData = chart.data();
    currentData.length = 0; // Clear the array
    treeData.forEach((node: any) => currentData.push(node));
    
    chart.updateTree({initial: true});
    
    toast.success("Family tree imported", {
      description: "The family tree data has been successfully imported."
    });
    
    return true;
  } catch (error) {
    console.error("Error importing family tree:", error);
    toast.error("Failed to import family tree", {
      description: "There was an error importing the family tree data. Please check the format."
    });
    return false;
  }
};
