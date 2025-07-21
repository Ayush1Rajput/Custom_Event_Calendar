import React from "react";
import { isToday, format } from "date-fns";

const Day = ({ date, isCurrentMonth, events, onDateClick, onEventClick, onEventDrop }) => {
  const today = isToday(date);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedEventId = e.dataTransfer.getData("text/plain");
    if (droppedEventId) {
      onEventDrop(droppedEventId, date);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={`day ${isCurrentMonth ? '' : 'other-month'} ${today ? 'today' : ''}`}
      onClick={() => onDateClick(date)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div>{format(date, "d")}</div>
      {events.map((event) => (
        <div
          key={event.id}
          className="event"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", event.id)}
          style={{ backgroundColor: event.backgroundColor }}
          onClick={(e) => {
            e.stopPropagation();
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
