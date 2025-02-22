import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flag, RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const KeyEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await ConTrackAPI.getKeyEvents();
      setEvents(response);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'deadline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Flag className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Timeline</h2>
          <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
        <div className="flex justify-center items-center h-24">
          <span className="text-gray-400">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Timeline</h2>
        <button 
          onClick={fetchEvents}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
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
                ${event.type?.toLowerCase() === 'deadline' ? 'bg-red-100' : 'bg-blue-100'}
              `}>
                {getEventIcon(event.type)}
              </div>

              {/* Simple Date */}
              <div className="mt-2 text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </div>

              {/* Hover Tooltip */}
              {hoveredEvent === index && (
                <div className="absolute bottom-full mb-2 w-48 transform -translate-x-1/2 left-1/2">
                  <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
                    {/* Tooltip Content */}
                    <div className="flex flex-col gap-1">
                      <span className={`
                        text-xs font-semibold px-2 py-0.5 rounded-full self-start
                        ${event.type?.toLowerCase() === 'deadline' 
                          ? 'bg-red-500/20 text-red-200' 
                          : 'bg-blue-500/20 text-blue-200'
                        }
                      `}>
                        {event.type || 'Event'}
                      </span>
                      <span className="font-medium">{event.event}</span>
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