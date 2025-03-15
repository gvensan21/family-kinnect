import React, { useEffect, useRef } from "react";
import f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import * as d3 from 'd3';

// Add d3-transition dependency to make sure transitions work
import 'd3-transition';

const NewFamilyTreeFlow = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing chart if any
    d3.select(containerRef.current).selectAll("*").remove();
    
    const data = [
      {
        "id": "0",
        "rels": {
          "father": "8c1d55e9-c48d-43be-b506-b0ed068534f8",
          "mother": "d086f8a8-a24d-45ef-afda-50c366e5873d",
          "spouses": [
            "d54828d1-a032-45cc-b60b-42ff73b1d154"
          ],
          "children": [
            "3ac4a373-795b-4fa1-b378-e7ea0acae579",
            "6bed0dfe-9240-4326-b0e1-a2f1293ce387"
          ]
        },
        "data": {
          "first name": "GV",
          "last name": "Surname",
          "birthday": 1970,
          "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
          "gender": "M"
        }
      },
      {
        "id": "8c1d55e9-c48d-43be-b506-b0ed068534f8",
        "data": {
          "gender": "M",
          "first name": "KV"
        },
        "rels": {
          "children": [
            "0",
            "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7"
          ],
          "spouses": [
            "d086f8a8-a24d-45ef-afda-50c366e5873d"
          ]
        }
      },
      {
        "id": "d086f8a8-a24d-45ef-afda-50c366e5873d",
        "data": {
          "gender": "F",
          "first name": "VV"
        },
        "rels": {
          "children": [
            "0",
            "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7"
          ],
          "spouses": [
            "8c1d55e9-c48d-43be-b506-b0ed068534f8"
          ]
        }
      },
      {
        "id": "d54828d1-a032-45cc-b60b-42ff73b1d154",
        "data": {
          "gender": "F",
          "first name": "AS"
        },
        "rels": {
          "spouses": [
            "0"
          ],
          "children": [
            "3ac4a373-795b-4fa1-b378-e7ea0acae579",
            "6bed0dfe-9240-4326-b0e1-a2f1293ce387"
          ],
          "father": "8e7852d8-0ee2-41f8-9b5a-44d737824831",
          "mother": "6bb9ed14-d4fd-4527-9de4-6d18a0d00e8e"
        }
      },
      {
        "id": "3ac4a373-795b-4fa1-b378-e7ea0acae579",
        "data": {
          "gender": "F",
          "first name": "SiV"
        },
        "rels": {
          "father": "0",
          "mother": "d54828d1-a032-45cc-b60b-42ff73b1d154"
        }
      },
      {
        "id": "6bed0dfe-9240-4326-b0e1-a2f1293ce387",
        "data": {
          "gender": "F",
          "first name": "SaV"
        },
        "rels": {
          "father": "0",
          "mother": "d54828d1-a032-45cc-b60b-42ff73b1d154"
        }
      },
      {
        "id": "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7",
        "data": {
          "gender": "M",
          "first name": "PV"
        },
        "rels": {
          "father": "8c1d55e9-c48d-43be-b506-b0ed068534f8",
          "mother": "d086f8a8-a24d-45ef-afda-50c366e5873d",
          "spouses": [
            "5e2d6f9f-5011-4aa4-a266-574e5fcf9b46"
          ],
          "children": [
            "0c808443-2e52-4b81-a950-7e436aca66b0",
            "102f0ded-e7c6-46ba-96eb-cbcb48e2dce5"
          ]
        }
      },
      {
        "id": "5e2d6f9f-5011-4aa4-a266-574e5fcf9b46",
        "data": {
          "gender": "F",
          "first name": "SP"
        },
        "rels": {
          "spouses": [
            "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7"
          ],
          "children": [
            "0c808443-2e52-4b81-a950-7e436aca66b0",
            "102f0ded-e7c6-46ba-96eb-cbcb48e2dce5"
          ]
        }
      },
      {
        "id": "0c808443-2e52-4b81-a950-7e436aca66b0",
        "data": {
          "gender": "M",
          "first name": "HP"
        },
        "rels": {
          "father": "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7",
          "mother": "5e2d6f9f-5011-4aa4-a266-574e5fcf9b46"
        }
      },
      {
        "id": "102f0ded-e7c6-46ba-96eb-cbcb48e2dce5",
        "data": {
          "gender": "M",
          "first name": "AP"
        },
        "rels": {
          "father": "e2a17bbb-15a9-497d-a18d-c1df6ef43cd7",
          "mother": "5e2d6f9f-5011-4aa4-a266-574e5fcf9b46"
        }
      },
      {
        "id": "8e7852d8-0ee2-41f8-9b5a-44d737824831",
        "data": {
          "gender": "M",
          "first name": "VS"
        },
        "rels": {
          "children": [
            "d54828d1-a032-45cc-b60b-42ff73b1d154",
            "75a23c75-03b6-4f8f-932a-a4af1e8106e1",
            "53352ef8-d478-43c6-b852-3abdb9d4a368"
          ],
          "spouses": [
            "6bb9ed14-d4fd-4527-9de4-6d18a0d00e8e"
          ]
        }
      },
      {
        "id": "6bb9ed14-d4fd-4527-9de4-6d18a0d00e8e",
        "data": {
          "gender": "F",
          "first name": "JS"
        },
        "rels": {
          "children": [
            "d54828d1-a032-45cc-b60b-42ff73b1d154",
            "75a23c75-03b6-4f8f-932a-a4af1e8106e1",
            "53352ef8-d478-43c6-b852-3abdb9d4a368"
          ],
          "spouses": [
            "8e7852d8-0ee2-41f8-9b5a-44d737824831"
          ]
        }
      },
      {
        "id": "75a23c75-03b6-4f8f-932a-a4af1e8106e1",
        "data": {
          "gender": "M",
          "first name": "RS"
        },
        "rels": {
          "father": "8e7852d8-0ee2-41f8-9b5a-44d737824831",
          "mother": "6bb9ed14-d4fd-4527-9de4-6d18a0d00e8e"
        }
      },
      {
        "id": "53352ef8-d478-43c6-b852-3abdb9d4a368",
        "data": {
          "gender": "F",
          "first name": "SS"
        },
        "rels": {
          "father": "8e7852d8-0ee2-41f8-9b5a-44d737824831",
          "mother": "6bb9ed14-d4fd-4527-9de4-6d18a0d00e8e",
          "spouses": [
            "c8e9fa3e-39c3-42d3-bf86-8e2758ba80a3"
          ],
          "children": [
            "4fa5a17f-815e-437f-a405-1c6e013c3443",
            "890a059a-2c3e-4a11-ad1e-c657cd203f74"
          ]
        }
      },
      {
        "id": "c8e9fa3e-39c3-42d3-bf86-8e2758ba80a3",
        "data": {
          "gender": "M",
          "first name": "SN"
        },
        "rels": {
          "spouses": [
            "53352ef8-d478-43c6-b852-3abdb9d4a368"
          ],
          "children": [
            "4fa5a17f-815e-437f-a405-1c6e013c3443",
            "890a059a-2c3e-4a11-ad1e-c657cd203f74"
          ]
        }
      },
      {
        "id": "4fa5a17f-815e-437f-a405-1c6e013c3443",
        "data": {
          "gender": "M",
          "first name": "MN"
        },
        "rels": {
          "father": "53352ef8-d478-43c6-b852-3abdb9d4a368",
          "mother": "c8e9fa3e-39c3-42d3-bf86-8e2758ba80a3"
        }
      },
      {
        "id": "890a059a-2c3e-4a11-ad1e-c657cd203f74",
        "data": {
          "gender": "F",
          "first name": "SN"
        },
        "rels": {
          "father": "53352ef8-d478-43c6-b852-3abdb9d4a368",
          "mother": "c8e9fa3e-39c3-42d3-bf86-8e2758ba80a3"
        }
      }
    ];
    
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
      f3EditTree.open(f3Chart.getMainDatum());
    
      f3Chart.updateTree({initial: true});
      
      console.log("Family tree rendered successfully");
    } catch (error) {
      console.error("Error rendering family tree:", error);
    }
  }, []);

  return <div className="f3 f3-cont h-full w-full" id="FamilyChart" ref={containerRef}></div>;
};

export default NewFamilyTreeFlow;
