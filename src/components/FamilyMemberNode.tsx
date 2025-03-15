
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';

interface FamilyMemberProps {
  data: {
    name: string;
    gender: 'male' | 'female';
    birthYear: number;
    role: string;
  };
  selected: boolean;
}

const FamilyMemberNode = memo(({ data, selected }: FamilyMemberProps) => {
  const genderColor = data.gender === 'male' 
    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
    : 'bg-pink-50 border-pink-300 hover:bg-pink-100';
  
  const selectedStyle = selected 
    ? 'ring-2 ring-offset-2 ring-primary' 
    : '';
  
  return (
    <div className={`p-3 rounded-lg ${genderColor} border-2 ${selectedStyle} transition-colors`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      
      <div className="flex items-center justify-center mb-2">
        <div className={`p-2 rounded-full ${data.gender === 'male' ? 'bg-blue-200' : 'bg-pink-200'}`}>
          <User className={`h-6 w-6 ${data.gender === 'male' ? 'text-blue-700' : 'text-pink-700'}`} />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-medium text-sm">{data.name}</h3>
        <p className="text-xs text-gray-600 mt-1">b. {data.birthYear}</p>
        <div className="mt-1 text-xs inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {data.role}
        </div>
      </div>
    </div>
  );
});

export default FamilyMemberNode;
