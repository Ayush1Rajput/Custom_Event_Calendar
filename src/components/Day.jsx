import React from "react";
import { isToday } from "date-fns";

const Day = ({ date, isCurrentMonth }) => {
  const today = isToday(date); // Highlight if today

  return (
    <div
      className={`day-cell ${!isCurrentMonth ? "not-current-month" : ""} ${
        today ? "today-highlight" : ""
      }`}
    >
      <div className="day-number">{date.getDate()}</div>
    </div>
  );
};

export default Day;
