"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { Day, Time } from "../types";
import UploadedFilesList from "../components/files";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc, arrayUnion } from "firebase/firestore";
import next from "next";

const Page = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const attendanceMarker = async (day: string, time: string) => {
    try {
      const attendanceDocRef = doc(db, "attendance", `${day}-${time}`);
      
      // Update the attendance array to include the user's ID or any marker
      await updateDoc(attendanceDocRef, {
        studentId: arrayUnion(userId), // You can use a user ID or any marker
        attendance:"Yes"
      });
  
      console.log("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  

  const [URL, setURL] = useState("https://meet.google.com/icy-vveg-aew");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [studentTimetable, setStudentTimetable] = useState<any>([]);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  // Assume you have a way to get the currently logged-in user's ID
  const loggedInUserId = userId;

  // Replace this with actual logged-in user ID
  console.log(userId);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
      const userRef = doc(db, "users", uid);
      const userDoc = getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            console.log("Document data:", doc.data());
            if (doc.data()?.role !== "Student") {
              router.push("/login");
            }
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      router.push("/login");
    }
  });

  useEffect(() => {
    fetchUserTimetable(loggedInUserId);
  }, [loggedInUserId]);

  const handleFileUpload = (newFile: string) => {
    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const fetchUserTimetable = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData?.role;

        if (userRole === "Student") {
          const timetableRef = collection(db, "timeslots");
          const timetableQuerySnapShot = await getDocs(timetableRef);

          const timetableData: any = [];

          timetableQuerySnapShot.forEach((doc) => {
            const students = doc.data()?.students || [];
            const teachers = doc.data()?.teachers || [];
            const [day, time] = doc.id.split("-");

            // Filter students for the specific userId
            const userStudents = students.filter(
              (student: any) => student.studentId === userId
            );
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
          console.log("User is not a student");
        }
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user timetable:", error);
    }
  };

  const renderTimetable = () => {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Student Timetable</h1>
        {/* Render the fetched student timetable */}
        {studentTimetable.length > 0 ? (
          studentTimetable.map((entry: any, index: any) => (
            <div key={index} className="mb-4">
              {/* Render timetable entry information */}
              <h2 className="text-xl font-semibold mb-2">
                {entry.day} - {entry.time}
              </h2>
              <div className="flex flex-col">
                {/* Render students for each time slot */}
                {entry.students && entry.students.length > 0 ? (
                  entry.students.map((student: any, studentIndex: any) => (
                    <div
                      key={studentIndex}
                      className="border border-gray-300 p-2 mb-2"
                    >
                      {/* Render student details */}
                      <p>Name: {student.name}</p>
                      <p>Subject: {student.subject}</p>
                      <p>Teacher:{student.teacherName}</p>

                      <button onClick={() => attendanceMarker(entry.day, entry.time)}>
                        <a className="text-blue-600 link-secondary" href={URL}>
                          Class Link
                        </a>
                      </button>
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
        <div>
          <UploadedFilesList userId={userId}></UploadedFilesList>
        </div>
      </div>
    );
  };

  return (
    <>{studentTimetable.length > 0 ? renderTimetable() : <p>Loading...</p>}</>
  );
};

export default Page;
//
// const createAllTimeSlots = async () => {
// const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const timings = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
// for (const day of days) {
//   for (const time of timings) {

//       const docRef = await getDocs(collection(db, 'attendance'))
//       docRef.forEach((doc:any) => {
//           console.log(`${doc.id} => ${doc.data()}`);
//         });
//     const data = {
//       attendance: [],
//       "day-time" : `${day}-${time}`,
//     };

//     await setDoc(doc(db, 'attendance', `${day}-${time}`), data);
//   }
// }

// console.log('All timeslots created!');};
