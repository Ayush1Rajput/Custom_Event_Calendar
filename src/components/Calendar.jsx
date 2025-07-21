import React, { useState } from "react";
import Day from "./Day.jsx";
import "../styles/calendar.css";
import { isSameDay, parseISO } from 'date-fns';
import { RRule } from "rrule";

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

// Function to expand recurring events using rrule
function getOccurrences(events, rangeStart, rangeEnd) {
  const expanded = [];

  for (const event of events) {
    if (event.recurrence && event.recurrence !== "none") {
      const start = new Date(event.start);
      const recurrenceEnd = event.recurrenceEnd
        ? new Date(event.recurrenceEnd)
        : new Date(rangeEnd);

      const options = {
        dtstart: start,
        until: recurrenceEnd,
      };

      switch (event.recurrence) {
        case "daily":
          options.freq = RRule.DAILY;
          break;
        case "weekly":
          options.freq = RRule.WEEKLY;
          break;
        case "monthly":
          options.freq = RRule.MONTHLY;
          break;
        default:
          continue;
      }

      const rule = new RRule(options);
      const allDates = rule.all();

      // Only include dates within current calendar month range
      allDates.forEach((date) => {
        if (date >= rangeStart && date <= rangeEnd) {
          expanded.push({ ...event, start: date.toISOString() });
        }
      });

    } else {
      expanded.push(event);
    }
  }

  return expanded;
}

export default function Calendar({ events, onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // There I get the current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getDaysInMonth(year, month); // call the object array of days

  // Define the visible range to generate recurring events within it
  const rangeStart = new Date(year, month, 1);
  const rangeEnd = new Date(year, month + 1, 0);
  const expandedEvents = getOccurrences(events, rangeStart, rangeEnd);

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
            events={expandedEvents.filter((event) =>
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
