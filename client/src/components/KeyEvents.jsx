import React from 'react';
import { Calendar, Clock, AlertTriangle, Flag } from 'lucide-react';

const KeyEvents = ({ events }) => {
  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'milestone':
        return <Flag className="w-5 h-5 text-blue-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800'
        };
      case 'milestone':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Key Events</h2>
      
      <div className="space-y-6">
        {events.map((event, index) => {
          const styles = getEventStyles(event.type);
          
          return (
            <div 
              key={index}
              className={`
                relative pl-6 pb-6
                ${index !== events.length - 1 ? 'border-l-2 border-gray-200' : ''}
              `}
            >
              {/* Event Dot */}
              <div className="absolute -left-2 p-1 bg-white rounded-full">
                <div className={`w-4 h-4 rounded-full ${styles.bg} border-2 ${styles.border}`} />
              </div>

              {/* Event Content */}
              <div className={`
                p-4 rounded-lg ${styles.bg} border ${styles.border}
                ml-4 transition-all duration-200 hover:shadow-md
              `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    <span className={`
                      text-sm font-semibold px-2 py-1 rounded-full
                      ${styles.badge}
                    `}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-lg font-semibold mb-2 ${styles.text}`}>
                  {event.title}
                </h3>
                <p className="text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyEvents;