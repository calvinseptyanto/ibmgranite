import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const getDummyEvents = () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
  // Calculate dates
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 7);
  
  const urgentDate = new Date(now);
  urgentDate.setDate(now.getDate() + 3); // 3 days from now
  
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + 14); // 14 days from now

  console.log('Dummy Dates:', {
    past: pastDate.toISOString().split('T')[0],
    urgent: urgentDate.toISOString().split('T')[0],
    future: futureDate.toISOString().split('T')[0],
    today
  });

  return [
    {
      date: pastDate.toISOString().split('T')[0],
      type: 'deadline',
      title: 'Initial Compliance Review',
      description: 'Complete first round of compliance documentation review'
    },
    {
      date: urgentDate.toISOString().split('T')[0],
      type: 'deadline',
      title: 'Policy Updates Due',
      description: 'Submit updated privacy and data protection policies'
    },
    {
      date: futureDate.toISOString().split('T')[0],
      type: 'milestone',
      title: 'Quarterly Assessment',
      description: 'Conduct quarterly compliance assessment and reporting'
    }
  ];
};

const KeyEvents = () => {
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  useEffect(() => {
    // For testing, just use dummy data directly
    setEvents(getDummyEvents());
  }, []);

  const getEventStatus = (dateStr) => {
    const now = new Date();
    const today = new Date(now.toISOString().split('T')[0]); // Start of today
    const eventDate = new Date(dateStr);
    const weekFromToday = new Date(today);
    weekFromToday.setDate(today.getDate() + 7);

    // console.log('Status Check:', {
    //   date: dateStr,
    //   today: today.toISOString(),
    //   eventDate: eventDate.toISOString(),
    //   weekFromToday: weekFromToday.toISOString(),
    //   isBeforeToday: eventDate < today,
    //   isWithinWeek: eventDate <= weekFromToday && eventDate >= today
    // });

    // Compare dates
    if (eventDate < today) {
      return 'completed';
    }
    if (eventDate <= weekFromToday && eventDate >= today) {
      return 'urgent';
    }
    return 'upcoming';
  };

  const getEventStyles = (date) => {
    const status = getEventStatus(date);
    console.log('Style for date:', date, 'Status:', status);
    
    switch (status) {
      case 'completed':
        return {
          icon: 'bg-green-100',
          iconColor: 'text-green-500',
          badge: 'bg-green-100 text-green-800'
        };
      case 'urgent':
        return {
          icon: 'bg-red-100',
          iconColor: 'text-red-500',
          badge: 'bg-red-100 text-red-800'
        };
      case 'upcoming':
        return {
          icon: 'bg-orange-100',
          iconColor: 'text-orange-500',
          badge: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          icon: 'bg-gray-100',
          iconColor: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Timeline</h2>
      
      <div className="relative">
        <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2" />

        <div className="relative flex justify-between">
          {events.map((event, index) => {
            const styles = getEventStyles(event.date);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center relative"
                onMouseEnter={() => setHoveredEvent(index)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                  transition-all duration-200 hover:scale-110 ${styles.icon}
                `}>
                  <div className={styles.iconColor}>
                    {event.type === 'deadline' ? 
                      <AlertTriangle className="w-5 h-5" /> : 
                      <Flag className="w-5 h-5" />
                    }
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  {formatDate(event.date)}
                </div>

                {hoveredEvent === index && (
                  <div className="absolute bottom-full mb-2 w-48 transform -translate-x-1/2 left-1/2 z-10">
                    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
                      <div className="flex flex-col gap-1">
                        <span className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full self-start
                          ${styles.badge}
                        `}>
                          {event.type}
                        </span>
                        <span className="font-medium">{event.title}</span>
                        <span className="text-gray-300 text-xs">{event.description}</span>
                      </div>
                      
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="border-8 border-transparent border-t-gray-800 h-0 w-0" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KeyEvents;