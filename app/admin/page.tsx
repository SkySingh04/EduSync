// classScheduler.js
"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { Day, Time, Teacher, Student, SlotData } from "../types";
import { serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
const Admin = () => {
  const meetingLink="https://meet.google.com/icy-vveg-aew"
  
  const [slotData, setSlotData] = useState<SlotData>({});
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [URL,setURL]=useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [day, setDay] = useState<Day>("Monday");
  const [time, setTime] = useState<Time>("9:00 AM");
  const [usersList, setUsersList] = useState<any[]>([]); // Assuming your user data structure
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const subjectList = ['Maths' , 'Science' , 'English' , 'Hindi' , 'Social Science'];
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
      const userRef = doc(db, "users", uid);
        const userDoc = getDoc(userRef).then((doc) => {
          if (doc.exists()) { 
            console.log("Document data:", doc.data());
            if(doc.data()?.role!=="Admin" ){
              router.push("/login")
            }
          }
        }
        ).catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      router.push("/login")
    }
  });


  useEffect(() => {
    fetchSlotsData();
  }, []);

  useEffect(() => {
    // Fetch all users from your database here
    // Replace this with your actual database call to get users with roles
    const fetchUsers = async () => {
      const userRef = collection(db, "users");
      const userDoc = await getDocs(userRef);
      const userData: any = [];
      userDoc.forEach((doc) => {
        userData.push(doc.data());
      });
      console.log(userData);
      const something: any = userData.filter(
        (user: any) => user.role === "Teacher"
      );
      console.log(something);
      setUsersList(userData);
    };

    fetchUsers();
  }, []);

  const handleSlotClick = (day1: string, time1: string) => {
    console.log(day1, time1);
    setSelectedSlot(`${day1}-${time1}`);
    setDay(day1);
    setTime(time1);
    setURL(meetingLink);
    console.log(selectedSlot);
    console.log(day, time);
    setShowUserList(true);
  };
  


  async function handleButtonClick() {
    if (selectedStudent && selectedTeacher && day && time) {
      const selectedSlot = `${day}-${time}`;
      const timeslotRef = doc(db, "timeslots", selectedSlot);

      try {
        const studentRef = doc(db, "users", selectedStudent);
        const teacherRef = doc(db, "users", selectedTeacher);
        const timeslotDoc = await getDoc(timeslotRef);
        const studentDoc = await getDoc(studentRef);
        const teacherDoc = await getDoc(teacherRef);
        console.log(studentDoc.data());
        console.log(teacherDoc.data());
        if (timeslotDoc.exists() && studentDoc.exists() && teacherDoc.exists()) {
          const existingData = timeslotDoc.data();
            const studentData = studentDoc.data();
            const teacherData = teacherDoc.data();
          const newData = {
            createdAt: serverTimestamp(),
            day,
            students: [
              {
                name: studentData.displayName,
                studentId: selectedStudent,
                subject: selectedSubject,
                meetingLink:URL // You might retrieve this data from somewhere
              },
            ],
            teachers: [
              {
                name: teacherData.displayName,
                teacherId: selectedTeacher,
              },
            ],
            time,
          };

          // Merge existing data with new data
          const updatedData = {
            ...existingData,
            students: [...(existingData.students || []), newData.students[0]],
            teachers: [...(existingData.teachers || []), newData.teachers[0]],
          };

          await setDoc(timeslotRef, updatedData);
          console.log("Timeslot updated successfully!");
          setShowUserList(false);
          window.location.reload();
        } else {
          console.error("Timeslot does not exist.");
        }
      } catch (error) {
        console.error("Error updating timeslot:", error);
      }
    } else {
      console.error("Please select student, teacher, and slot.");
    }
  }



  const fetchSlotsData = async () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timings = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
    ];

    const data: any = {};

    for (const day of days) {
      for (const time of timings) {
        const timeslotRef = doc(db, "timeslots", `${day}-${time}`);
        const timeslotDoc = await getDoc(timeslotRef);

        if (timeslotDoc.exists())


         {
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
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timings = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              {days.map((day, index) => (
                <th key={index} className="text-center font-bold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timings.map((time, idx) => (
              <tr key={idx}>
                <td className="text-center font-bold">{time}</td>
                {days.map((day, index) => (
                  <td
                    key={`${day}-${idx}`}
                    className="border border-black text-black bg-blue-200"
                  >
                    <div className="p-2">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold">Teachers:</h3>
                        <ul>
                          {slotData[`${day}-${time}`]?.teachers?.map(
                            (teacher: Teacher, index) => (
                              <li key={index}>{teacher.name}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Students:</h3>
                        <ul>
                          {slotData[`${day}-${time}`]?.students?.map(
                            (student: Student, index) => (
                              <li key={index}>{student.name}</li>
                            )
                          )}
                        </ul>
                        <button
                          onClick={() => handleSlotClick(day, time)}
                          className="bg-green-400 text-black px-2 py-1 rounded-full mt-2 block mx-auto"
                        >
                          Schedule Class
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {generateTimeSlots()}
      {/* Show user list popup */}
      {/* Your existing code... */}
    </div>
  );
};

export default Admin;