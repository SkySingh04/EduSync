// classScheduler.js
'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDoc, doc } from 'firebase/firestore';
import{Day, Time , Teacher , Student ,SlotData} from '../types';


const ClassScheduler = () => {
  const [slotData, setSlotData] = useState<SlotData>({});

  useEffect(() => {
    fetchSlotsData();
  }, []);

  const fetchSlotsData = async () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timings = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    const data : any= {};

    for (const day of days) {
      for (const time of timings) {
        const timeslotRef = doc(db, 'timeslots', `${day}-${time}`);
        const timeslotDoc = await getDoc(timeslotRef);

        if (timeslotDoc.exists()) {
          const { teachers, students } = timeslotDoc.data();
          data[`${day}-${time}`] = { teachers, students };
        } else {
          data[`${day}-${time}`] = { teachers: [], students: [] };
        }
      }
    }

    setSlotData(data);
  };

  const generateTimeSlots = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timings = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    return (
      <div className="grid grid-cols-6 gap-4">
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
                className="col-span-1 bg-blue-200 p-2 border border-gray-400 text-black"
              >
                {/* Display teachers and students in the slot */}
                <div>
                  <h3 className="text-lg font-semibold">Teachers:</h3>
                  <ul>
                    {slotData[`${day}-${time}`]?.teachers?.map((teacher: Teacher, index) => (
                      <li key={index}>{teacher.name} - {teacher.subject}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Students:</h3>
                  <ul>
                    {slotData[`${day}-${time}`]?.students?.map((student: Student, index) => (
                      <li key={index}>{student.name} - {student.subject}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {generateTimeSlots()}
    </div>
  );
};

export default ClassScheduler;


// const createAllTimeSlots = async () => {
    //   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    //   const timings = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    // //   const timeslotsRef = collection(db, 'timeslots');
    
    //   for (const day of days) {
    //     for (const time of timings) {
            
    //         const docRef = await getDocs(collection(db, 'timeslots'))
    //         docRef.forEach((doc:any) => {
    //             console.log(`${doc.id} => ${doc.data()}`);
    //           });
    //       const data = {
    //         day,
    //         time,
    //         teachers: [],
    //         students: [],
    //         createdAt: Timestamp.now(), // Optionally include a createdAt timestamp
    //       };
    
    //       await setDoc(doc(db, 'timeslots', `${day}-${time}`), data);
    //     }
    //   }
    
    //   console.log('All timeslots created!');
    // };