import React, { useState } from "react";
import Day from "./Day.jsx";
import "../styles/calendar.css";
import { isSameDay, parseISO } from 'date-fns';

// use for getting the name of week days
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1); // here we use new Date(year,month, day) , day=1 means first day of month
  const days = [];

  const firstDayIndex = date.getDay();
  const previousMonthDays = new Date(year, month, 0).getDate();

  // Previous month padding of days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, previousMonthDays - i),
      currentMonth: false,
    });
  }

  // Current month padding of days
  while (date.getMonth() === month) {
    days.push({
      date: new Date(date),
      currentMonth: true,
    });

    date.setDate(date.getDate() + 1);
  }

  // Next month padding of days
  const totalCell = 35; // 5 weeks
  const remaining = totalCell - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      currentMonth: false,
    });
  }

  return days; // return the Array
}

export default function Calendar({ events, onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // There I get the current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getDaysInMonth(year, month); // call the object array of days

  // Function for btn to call previos month
  const callPreviousMonth = () => {
    const previousMonth = new Date(year, month - 1);
    setCurrentDate(previousMonth);
  };

  // Function for btn to call next month
  const callNextMonth = () => {
    const nextMonth = new Date(year, month + 1);
    setCurrentDate(nextMonth);
    // console.log(currentDate.getMonth());
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={callPreviousMonth}>← Previous</button>
        <h2>
         {/* Used to display the current month name in the calendar header */}
         {currentDate.toLocaleString("default", { month: "long" })+"  "} 
          { year}
        </h2>
        <button onClick={callNextMonth}>Next →</button>
      </div>
      <div className="calendar-grid">
        {/* Use this for get the week name */}
        {daysOfWeek.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}

        {/* {days.map((day, index) => (
          <Day key={index} date={day.date} isCurrentMonth={day.currentMonth} />
        ))} */}


        {days.map((day, index) => (
          <Day
            key={index}
            date={day.date}
            isCurrentMonth={day.currentMonth}
            events={events.filter((event) =>
              isSameDay(parseISO(event.start), day.date)
            )}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}
