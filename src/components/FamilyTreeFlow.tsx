
import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
  Panel,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { PlusCircle, ZoomIn, ZoomOut, User, Users } from 'lucide-react';
import FamilyMemberNode from './FamilyMemberNode';

// Define custom node types
const nodeTypes: NodeTypes = {
  familyMember: FamilyMemberNode,
};

// Generate initial family tree data
const generateFamilyTree = () => {
  const nodes = [
    {
      id: '1',
      type: 'familyMember',
      data: { 
        name: 'John Doe', 
        gender: 'male', 
        birthYear: 1970,
        role: 'self'
      },
      position: { x: 250, y: 250 },
    },
    {
      id: '2',
      type: 'familyMember',
      data: { 
        name: 'Mary Doe', 
        gender: 'female', 
        birthYear: 1972,
        role: 'spouse'
      },
      position: { x: 450, y: 250 },
    },
    {
      id: '3',
      type: 'familyMember',
      data: { 
        name: 'William Doe', 
        gender: 'male', 
        birthYear: 1945,
        role: 'father'
      },
      position: { x: 150, y: 100 },
    },
    {
      id: '4',
      type: 'familyMember',
      data: { 
        name: 'Elizabeth Doe', 
        gender: 'female', 
        birthYear: 1947,
        role: 'mother'
      },
      position: { x: 350, y: 100 },
    },
    {
      id: '5',
      type: 'familyMember',
      data: { 
        name: 'Sarah Doe', 
        gender: 'female', 
        birthYear: 1995,
        role: 'daughter'
      },
      position: { x: 200, y: 400 },
    },
    {
      id: '6',
      type: 'familyMember',
      data: { 
        name: 'Michael Doe', 
        gender: 'male', 
        birthYear: 1998,
        role: 'son'
      },
      position: { x: 400, y: 400 },
    },
  ];

  const edges = [
    // Marriage edge
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'straight',
      style: { stroke: '#FF9999', strokeWidth: 2 },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#FF9999'
      },
      label: 'Spouse',
      labelStyle: { fill: '#888', fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
    },
    // Parent edges
    {
      id: 'e3-1',
      source: '3',
      target: '1',
      type: 'smoothstep',
      style: { stroke: '#9999FF', strokeWidth: 2 },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#9999FF'
      },
      label: 'Parent',
      labelStyle: { fill: '#888', fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
    },
    {
      id: 'e4-1',
      source: '4',
      target: '1',
      type: 'smoothstep',
      style: { stroke: '#9999FF', strokeWidth: 2 },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#9999FF'
      },
      label: 'Parent',
      labelStyle: { fill: '#888', fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
    },
    // Children edges
    {
      id: 'e1-5',
      source: '1',
      target: '5',
      type: 'smoothstep',
      style: { stroke: '#99FF99', strokeWidth: 2 },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#99FF99'
      },
      label: 'Child',
      labelStyle: { fill: '#888', fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
    },
    {
      id: 'e1-6',
      source: '1',
      target: '6',
      type: 'smoothstep',
      style: { stroke: '#99FF99', strokeWidth: 2 },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#99FF99'
      },
      label: 'Child',
      labelStyle: { fill: '#888', fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
    },
  ];

  return { nodes, edges };
};

const FamilyTreeFlow = () => {
  const initialData = generateFamilyTree();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const addFamilyMember = (relation: string) => {
    const newId = (nodes.length + 1).toString();
    const gender = relation === 'son' || relation === 'father' || relation === 'brother' ? 'male' : 'female';
    const year = relation === 'father' || relation === 'mother' ? 1950 : 2000;
    
    let positionX = 0;
    let positionY = 0;
    
    // Position based on relation
    switch(relation) {
      case 'father':
      case 'mother':
        positionX = relation === 'father' ? 150 : 350;
        positionY = 50;
        break;
      case 'son':
      case 'daughter':
        positionX = relation === 'son' ? 450 : 600;
        positionY = 400;
        break;
      case 'brother':
      case 'sister':
        positionX = relation === 'brother' ? 50 : 650;
        positionY = 250;
        break;
    }
    
    // Create new node
    const newNode = {
      id: newId,
      type: 'familyMember',
      data: { 
        name: `New ${relation}`, 
        gender,
        birthYear: year,
        role: relation
      },
      position: { x: positionX, y: positionY },
    };
    
    // Create edge based on relation
    let newEdge;
    if (relation === 'father' || relation === 'mother') {
      newEdge = {
        id: `e${newId}-1`,
        source: newId,
        target: '1', // Connect to main person
        type: 'smoothstep',
        style: { stroke: '#9999FF', strokeWidth: 2 },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#9999FF'
        },
        label: 'Parent',
        labelStyle: { fill: '#888', fontWeight: 700 },
        labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
      };
    } else if (relation === 'son' || relation === 'daughter') {
      newEdge = {
        id: `e1-${newId}`,
        source: '1', // Main person
        target: newId,
        type: 'smoothstep',
        style: { stroke: '#99FF99', strokeWidth: 2 },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#99FF99'
        },
        label: 'Child',
        labelStyle: { fill: '#888', fontWeight: 700 },
        labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
      };
    } else {
      // For siblings, connect to parents
      newEdge = {
        id: `e3-${newId}`,
        source: '3', // Father
        target: newId,
        type: 'smoothstep',
        style: { stroke: '#9999FF', strokeWidth: 2 },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#9999FF'
        },
        label: 'Parent',
        labelStyle: { fill: '#888', fontWeight: 700 },
        labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' }
      };
    }
    
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div className="h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.2}
        maxZoom={1.5}
        className="bg-gray-50"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        
        <Panel position="top-left" className="bg-white p-3 rounded-md shadow-md">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-bold mb-2">Add Family Member</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('father')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Father
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('mother')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Mother
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('son')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Son
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('daughter')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Daughter
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('brother')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Brother
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFamilyMember('sister')} className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Sister
              </Button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FamilyTreeFlow;
