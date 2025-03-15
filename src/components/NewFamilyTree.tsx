
import React, { useEffect, useRef } from "react";
import 'family-chart/styles/family-chart.css';
import 'd3-transition'; // Add d3-transition dependency to make sure transitions work
import { familyTreeData } from '@/data/familyTreeData';
import { createFamilyChart, initializeChartDisplay, clearExistingChart } from '@/utils/familyChartUtils';

const NewFamilyTreeFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing chart if any
    clearExistingChart(containerRef);
    
    // Create and configure the family chart
    const chartComponents = createFamilyChart('#FamilyChart', familyTreeData);
    
    // If chart creation was successful, initialize the display
    if (chartComponents) {
      const { chart, editTree } = chartComponents;
      initializeChartDisplay(chart, editTree);
    }
    
    // Cleanup function to clear the chart when component unmounts
    return () => {
      if (containerRef.current) {
        clearExistingChart(containerRef);
      }
    };
  }, []);

  return <div className="f3 f3-cont h-full w-full" id="FamilyChart" ref={containerRef}></div>;
};

export default NewFamilyTreeFlow;
