import React from 'react';

export const Legend: React.FC = () => (
  <div className="mt-6 flex gap-4 justify-center text-sm">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-green-500 rounded"></div>
      <span>Свободно</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-gray-400 rounded"></div>
      <span>Занято</span>
    </div>
  </div>
);
