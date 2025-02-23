import React from 'react';

const ResizeHandle = ({ position, onResize }) => {
    const cursorClass = `cursor-${position}-resize`;
    const positionClass = `${position.includes('n') ? 'top' : 'bottom'}-0 ${position.includes('w') ? 'left' : 'right'}-0`;
  
    return (
      <div
        className={`absolute ${positionClass} w-4 h-4 opacity-0 group-hover:opacity-100 ${cursorClass}`}
        onMouseDown={onResize}
      />
    );
  };

export default ResizeHandle;