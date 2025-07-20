import React from 'react'


export default function Day() {

    // check the day is from current month or not
    const Day = ({date,isCurrentMonth})=>{
        return (
            <div className={`day-box ${isCurrentMonth ? "current":"faded"}`}>
                {date.getDate()}
            </div>
        )
    }
}
