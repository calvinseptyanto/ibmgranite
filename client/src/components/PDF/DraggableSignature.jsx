import React, { useState } from 'react';
import { X } from 'lucide-react';

export const DraggableSignature = ({ signature, pageRef, onDelete, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    e.preventDefault();
    const pageRect = pageRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pageRect.left - signature.position.x,
      y: e.clientY - pageRect.top - signature.position.y
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;

    const pageRect = pageRef.current.getBoundingClientRect();
    const newX = e.clientX - pageRect.left - dragStart.x;
    const newY = e.clientY - pageRect.top - dragStart.y;

    // Constrain to page boundaries
    const maxX = pageRect.width - signature.size.width;
    const maxY = pageRect.height - signature.size.height;
    const x = Math.max(0, Math.min(newX, maxX));
    const y = Math.max(0, Math.min(newY, maxY));

    onUpdate(signature.id, {
      position: { x, y },
      size: signature.size
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  const handleResize = (position, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = signature.size.width;
    const startHeight = signature.size.height;
    const startLeft = signature.position.x;
    const startTop = signature.position.y;

    const handleMove = (e) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (position.includes('e')) {
        newWidth = Math.max(50, startWidth + deltaX);
      } else if (position.includes('w')) {
        const proposedWidth = Math.max(50, startWidth - deltaX);
        newWidth = proposedWidth;
        newX = startLeft + (startWidth - proposedWidth);
      }

      if (position.includes('s')) {
        newHeight = Math.max(25, startHeight + deltaY);
      } else if (position.includes('n')) {
        const proposedHeight = Math.max(25, startHeight - deltaY);
        newHeight = proposedHeight;
        newY = startTop + (startHeight - proposedHeight);
      }

      const pageRect = pageRef.current.getBoundingClientRect();
      newWidth = Math.min(newWidth, pageRect.width - newX);
      newHeight = Math.min(newHeight, pageRect.height - newY);

      onUpdate(signature.id, {
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight }
      });
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: signature.position.x,
        top: signature.position.y,
        width: signature.size.width,
        height: signature.size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onMouseDown={handleDragStart}
      className="group"
    >
      <img
        src={signature.image}
        alt="Signature"
        style={{ width: '100%', height: '100%' }}
        draggable={false}
      />
      
      {/* Simple hover effect with dotted border */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100" />
      
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(signature.id);
        }}
      >
        <X className="w-3 h-3" />
      </button>

      {/* Resize handles */}
      {['nw', 'ne', 'se', 'sw'].map((pos) => {
        const positionClass = `${pos.includes('n') ? 'top' : 'bottom'}-0 ${pos.includes('w') ? 'left' : 'right'}-0`;
        return (
          <div
            key={pos}
            className={`absolute ${positionClass} w-3 h-3 bg-white border-2 border-blue-400 opacity-0 group-hover:opacity-100 cursor-${pos}-resize`}
            onMouseDown={(e) => handleResize(pos, e)}
          />
        );
      })}
    </div>
  );
};

export default DraggableSignature;