
import f3 from 'family-chart';
import * as d3 from 'd3';
import { toast } from 'sonner';

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
      .setFields(["first name"])
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
