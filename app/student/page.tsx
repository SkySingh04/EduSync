'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, getDocs, getDoc ,  query,where } from 'firebase/firestore';
import { Day, Time } from '../types';

const Page = () => {
  const [studentTimetable, setStudentTimetable] = useState<any>([]);
  // Assume you have a way to get the currently logged-in user's ID
  const loggedInUserId = 'tPAS3CycNiaMHk8DB6YvsBuClSA3'; // Replace this with actual logged-in user ID

  useEffect(() => {
    fetchUserTimetable(loggedInUserId);
  }, [loggedInUserId]);

  const fetchUserTimetable = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData?.role;
  
        if (userRole === 'Student') {
          const timetableRef = collection(db, 'timeslots');
          const timetableQuerySnapShot = await getDocs(timetableRef);
  
          const timetableData: any = [];
          
          timetableQuerySnapShot.forEach((doc) => {
            const students = doc.data()?.students || [];
            const teachers = doc.data()?.teachers || [];
            const [day, time] = doc.id.split('-');
  
            // Filter students for the specific userId
            const userStudents = students.filter((student: any) => student.studentId === userId);
            console.log(userStudents);
            if (userStudents.length > 0) {
              timetableData.push({
                day,
                time,
                students: userStudents,
              });
            }
          });
  
          setStudentTimetable(timetableData);
        } else {
          console.log('User is not a student');
        }
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user timetable:', error);
    }
  };
  
  

  const renderTimetable = () => {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Student Timetable</h1>
        {/* Render the fetched student timetable */}
        {console.log(studentTimetable)}{ studentTimetable.length > 0 ? (
          studentTimetable.map((entry: any, index:any) => (
            <div key={index} className="mb-4">
              {/* Render timetable entry information */}
              <h2 className="text-xl font-semibold mb-2">{entry.day} - {entry.time}</h2>
              <div className="flex flex-col">
                {/* Render students for each time slot */}
                {entry.students && entry.students.length > 0 ? (
                  entry.students.map((student: any, studentIndex: any) => (
                    <div key={studentIndex} className="border border-gray-300 p-2 mb-2">
                      {/* Render student details */}
                      <p>Name: {student.name}</p>
                      <p>Subject: {student.subject}</p>
                      <p>Teacher:{student.teacherName}</p>
                      {/* Add more details as needed */}
                    </div>
                  ))
                ) : (
                  <p>No students assigned for this slot.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
  

  return (
    <>
      {studentTimetable.length > 0 ? renderTimetable() : <p>Loading...</p>}
    </>
  );
};

export default Page;
