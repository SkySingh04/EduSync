// classScheduler.js
'use client'
import React from 'react';

const Page = () => {
  // Function to generate time slots from 9:00 AM to 4:00 PM
  const generateTimeSlots = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timings = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    return (
      <React.Fragment>
        {/* Days */}
        <div className="col-span-1"></div>
        {days.map((day, index) => (
          <div key={index} className="col-span-1 text-center font-bold h-10">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {timings.map((time, idx) => (
          <React.Fragment key={idx}>
            <div className="col-span-1 text-center font-bold h-10">{time}</div>
            {days.map((day, index) => (
              <div
                key={`${day}-${idx}`}
                className="col-span-1 bg-blue-200 cursor-pointer"
                onClick={() => handleSlotClick(day, time)}
              >
                {/* Content for the slot */}
              </div>
            ))}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  // Function to handle slot selection
  const handleSlotClick = (day: string, time:string) => {
    console.log(`Selected slot: ${day}, ${time}`);
    // Further actions on slot selection
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Class Scheduler</h1>

      <div className="grid grid-cols-6 gap-4">
        {/* Days and Time slots */}
        {generateTimeSlots()}
      </div>
    </div>
  );
};

export default Page;
