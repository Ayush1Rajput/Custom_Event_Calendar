import React from "react";
import { isToday, format } from "date-fns"; 

const Day = ({ date, isCurrentMonth, events, onDateClick, onEventClick }) => {
  const today = isToday(date); // Highlight if today

  return (
    <div
      className={`day ${isCurrentMonth ? '' : 'other-month'}`}
      onClick={() => onDateClick(date)}
    >
      <div>{format(date, 'd')}</div> {/* Correctly formatted date */}
      {events.map((event) => (
        <div
          key={event.id}
          className="event"
          style={{ backgroundColor: event.backgroundColor }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent day click when clicking event
            onEventClick(event);
          }}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
};

export default Day;
