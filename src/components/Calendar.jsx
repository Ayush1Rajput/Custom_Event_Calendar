import React, { useState } from 'react'

// use for getting the name of week days
const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];



export default function Calendar() {

  const [currentDate, setCurrentDate] = useState(new Date());

  // There I get the current month and year
  const year = currentDate.getFullYear();
  const month  = currentDate.getMonth();

  return (
    <div className='calendar'>
      <div className="calendar-header">
        <button>← Previous</button>
        <h2>Month Year</h2>
        <button>Next →</button>
      </div>
      <div className="calendar-grid">

      {/* Use this for get the week name */}
      {daysOfWeek.map((day)=>{
        <div key={day} className='day-name'>{day}</div>
      })}

      </div>
    </div>
  )
}
