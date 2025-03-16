
import React, { useEffect, useRef } from "react";
import f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import * as d3 from 'd3';
import { FamilyMember } from "@/services/api";

// Add d3-transition dependency to make sure transitions work
import 'd3-transition';

interface FamilyTreeProps {
  initialData?: FamilyMember[];
}

const NewFamilyTreeFlow = ({ initialData = [] }: FamilyTreeProps) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing chart if any
    d3.select(containerRef.current).selectAll("*").remove();
    
    // Transform the FamilyMember[] data to the format expected by family-chart
    const transformedData = initialData.map(member => {
      return {
        id: member.id,
        data: {
          "first name": member.name,
          gender: member.gender,
          birthday: member.dateOfBirth,
          avatar: "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg"
        },
        rels: {
          father: member.parentId || undefined,
          spouses: member.spouseId ? [member.spouseId] : [],
          children: member.children || []
        }
      };
    });
    
    // Use the transformed data or an empty array if none is provided
    const data = transformedData.length > 0 ? transformedData : [];
    
    try {
      const f3Chart = f3.createChart('#FamilyChart', data)
        .setTransitionTime(1000)
        .setCardXSpacing(250)
        .setCardYSpacing(150)
        .setOrientationVertical()
        .setSingleParentEmptyCard(true, {label: 'ADD'});
    
      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name"],[]])
        .setCardDim({})
        .setMiniTree(true)
        .setStyle('imageRect')
        .setOnHoverPathToMain();
    
      const f3EditTree = f3Chart.editTree()
        .fixed(true)
        .setFields(["first name"])
        .setEditFirst(true);
      
      f3EditTree.setEdit();
      
      f3Card.setOnCardClick((e, d) => {
        f3EditTree.open(d);
        if (f3EditTree.isAddingRelative()) return;
        f3Card.onCardClickDefault(e, d);
      });
    
      f3Chart.updateTree({initial: true});
      
      if (data.length > 0) {
        f3EditTree.open(f3Chart.getMainDatum());
        f3Chart.updateTree({initial: true});
      }
      
      console.log("Family tree rendered successfully");
    } catch (error) {
      console.error("Error rendering family tree:", error);
    }
  }, [initialData]);

  return <div className="f3 f3-cont h-full w-full" id="FamilyChart" ref={containerRef}></div>;
};

export default NewFamilyTreeFlow;
