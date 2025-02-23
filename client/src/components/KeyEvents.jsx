import React, { useState, useEffect } from 'react';
import { Calendar, Check, CalendarPlus } from 'lucide-react';

const getDummyEvents = () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 7);
  
  const urgentDate = new Date(now);
  urgentDate.setDate(now.getDate() + 3);
  
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + 14);
  
  const additionalDate1 = new Date(now);
  additionalDate1.setDate(now.getDate() + 21);

  const additionalDate2 = new Date(now);
  additionalDate2.setDate(now.getDate() + -3);

  return [
    {
      date: pastDate.toISOString().split('T')[0],
      type: 'deadline',
      title: 'Initial Compliance Review',
      description: 'Complete first round of compliance documentation review'
    },
    {
      date: additionalDate2.toISOString().split('T')[0],
      type: 'deadline',
      title: 'Regulatory Filing Deadline',
      description: 'Submit required compliance documents to regulators'
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
    },
    {
      date: additionalDate1.toISOString().split('T')[0],
      type: 'milestone',
      title: 'Annual Compliance Training',
      description: 'Mandatory training session for compliance officers'
    },
  ];
};

const KeyEvents = () => {
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEvents(getDummyEvents());
      setLoading(false);
    }, 7000);
  }, []);

  const getEventStatus = (dateStr) => {
    const now = new Date();
    const today = new Date(now.toISOString().split('T')[0]);
    const eventDate = new Date(dateStr);
    const weekFromToday = new Date(today);
    weekFromToday.setDate(today.getDate() + 7);

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
    
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-100 border-green-500',
          icon: 'text-green-500',
          text: 'text-green-700'
        };
      case 'urgent':
        return {
          circle: 'bg-red-100 border-red-500',
          icon: 'text-red-500',
          text: 'text-red-700'
        };
      default:
        return {
          circle: 'bg-orange-100 border-orange-500',
          icon: 'text-orange-500',
          text: 'text-orange-700'
        };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Key events</h2>
        <button 
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <CalendarPlus className="w-5 h-5" />
          Add all events to calendar
        </button>
      </div>
      
      {loading ? (
        <div className="text-center text-gray-500">Loading events...</div>
      ) : (
        <div className="relative">
          <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-24" />

          <div className="relative flex justify-between">
            {events.map((event, index) => {
              const styles = getEventStyles(event.date);
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col relative cursor-pointer max-w-[250px]"
                  onMouseEnter={() => setHoveredEvent(index)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <div className="absolute top-[88px] left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${styles.circle}`}>
                      <Check className={`w-5 h-5 ${styles.icon}`} />
                    </div>
                  </div>

                  <div className="mb-20">
                    <h3 className={`font-semibold text-lg mb-2 ${styles.text}`}>
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyEvents;
