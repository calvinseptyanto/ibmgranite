import React from 'react';
import PropTypes from 'prop-types';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const KeyEvents = ({ events }) => {
  const getEventTypeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'milestone':
        return 'bg-blue-100 text-blue-800';
      case 'requirement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Key Events</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {events?.map((event, index) => (
            <div
              key={index}
              className="border-l-4 border-primary pl-4 pb-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeStyle(
                    event.type
                  )}`}
                >
                  {event.type}
                </span>
              </div>
              <h4 className="font-medium mb-1">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
KeyEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  )
};

export default KeyEvents;