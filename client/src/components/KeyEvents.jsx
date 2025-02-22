import React, { useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';

const KeyEvents = ({ events }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'milestone':
        return <Flag className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Timeline</h2>
      
      <div className="relative">
        {/* Horizontal Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2" />

        {/* Events Container */}
        <div className="relative flex justify-between">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center relative"
              onMouseEnter={() => setHoveredEvent(index)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              {/* Circle with Icon */}
              <div className={`
                relative z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                transition-all duration-200 hover:scale-110
                ${event.type.toLowerCase() === 'deadline' ? 'bg-red-100' : 'bg-blue-100'}
              `}>
                {getEventIcon(event.type)}
              </div>

              {/* Simple Date */}
              <div className="mt-2 text-sm text-gray-600">
                {formatDate(event.date)}
              </div>

              {/* Hover Tooltip */}
              {hoveredEvent === index && (
                <div className="absolute bottom-full mb-2 w-48 transform -translate-x-1/2 left-1/2">
                  <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
                    {/* Tooltip Content */}
                    <div className="flex flex-col gap-1">
                      <span className={`
                        text-xs font-semibold px-2 py-0.5 rounded-full self-start
                        ${event.type.toLowerCase() === 'deadline' 
                          ? 'bg-red-500/20 text-red-200' 
                          : 'bg-blue-500/20 text-blue-200'
                        }
                      `}>
                        {event.type}
                      </span>
                      <span className="font-medium">{event.title}</span>
                      <span className="text-gray-300 text-xs">{event.description}</span>
                    </div>
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="border-8 border-transparent border-t-gray-800 h-0 w-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyEvents;