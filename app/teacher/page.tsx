// classScheduler.js
"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { Day, Time, Teacher, Student, SlotData } from "../types";
import { serverTimestamp } from "firebase/firestore";
import PageComponent from "../components/UploadForm";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import callAPI from "../emailapi";

const Teacher = () => {
  const [apiResponse, setAPIResponse] = useState<string>("");
  

  const meetingLink = "https://meet.google.com/icy-vveg-aew";
  const [slotData, setSlotData] = useState<SlotData>({});
  const [URL, setURL] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [showUserList, setShowUserList] = useState(false);
  const [day, setDay] = useState<Day>("Monday");
  const [time, setTime] = useState<Time>("9:00 AM");
  const [usersList, setUsersList] = useState<any[]>([]); // Assuming your user data structure
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const subjectList = [
    "Maths",
    "Science",
    "English",
    "Hindi",
    "Social Science",
  ];
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  console.log(userId);
  const currentUserId = "CHJ3KL849BSFzv3brprJ62gTVF62";
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
            if (doc.data()?.role !== "Teacher") {
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
  const filterSlotsByTeacher = (slots: SlotData, teacherId: string) => {
    const filteredSlots: SlotData = {};

    Object.keys(slots).forEach((slotKey) => {
      const slot = slots[slotKey];
      const teachers = slot.teachers || [];
      const teacherExists = teachers.some(
        (teacher: any) => teacher.teacherId === teacherId
      );

      if (teacherExists) {
        filteredSlots[slotKey] = slot;
      }
    });

    return filteredSlots;
  };
  async function handleButtonClick() {
    if (selectedStudent && day && time) {
      const selectedSlot = `${day}-${time}`;
      const timeslotRef = doc(db, "timeslots", selectedSlot);
      const selectedTeacher = "CHJ3KL849BSFzv3brprJ62gTVF62";
      try {
        const studentRef = doc(db, "users", selectedStudent);
        const teacherRef = doc(db, "users", selectedTeacher);
        const timeslotDoc = await getDoc(timeslotRef);
        const studentDoc = await getDoc(studentRef);
        const teacherDoc = await getDoc(teacherRef);
        console.log(studentDoc.data());
        console.log(teacherDoc.data());
        if (
          timeslotDoc.exists() &&
          studentDoc.exists() &&
          teacherDoc.exists()
        ) {
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
                meetingLink: URL, // You might retrieve this data from somewhere
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

        if (timeslotDoc.exists()) {
          const { teachers, students } = timeslotDoc.data();
          data[`${day}-${time}`] = { teachers, students };
        } else {
          data[`${day}-${time}`] = { teachers: [], students: [] };
        }
      }
    }
    const filteredSlots = filterSlotsByTeacher(data, currentUserId);
    console.log("filteredSlots");
    console.log(filteredSlots);
    setSlotData(filteredSlots);
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
                  <ol>
                    {slotData[`${day}-${time}`]?.teachers?.map(
                      (teacher: Teacher, index) => (
                        <li key={index}>
                          {index + 1} : {teacher.name}
                        </li>
                      )
                    )}
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Students:</h3>
                  <ol>
                    {slotData[`${day}-${time}`]?.students?.map(
                      (student: Student, index) => (
                        <li key={index}>
                          {index + 1} : {student.name}
                          <br />
                          Subject :<b> {student.subject}</b>
                          <br></br>
                          <a
                          className="link-hover text-blue-600"
                           href={meetingLink}>Meeting Link</a>
                        </li>
                        
                        
                      )
                    )}
                  </ol>
                  <button
                    onClick={() => handleSlotClick(day, time)}
                    className=" bg-green-400 text-black px-2 py-1 rounded-full"
                  >
                    Add Class
                  </button>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };
  function handleUserSelect(role: string, userId: string) {
    if (role === "student") {
      setSelectedStudent(userId);
    } else if (role === "subject") {
      setSelectedSubject(userId);
    }
  }
  return (
    <div className="">
      {/* <div>
      <button onClick={callAPI}>Call API</button>

      <div>
        <h3>API Response:</h3>
        <pre>{apiResponse}</pre>
      </div>
    </div> */}

      <div className="flex justify-center items-center">
        <div className="w-1/2 p-4">
          <h1 className="text-6xl ml-[95px] font-bold mb-4">
            Teacher Dashboard
          </h1>
        </div>
        <div className="w-1/2 p-4">
          <PageComponent />
        </div>
      </div>

      {generateTimeSlots()}
      {/* Show user list popup */}
      {showUserList && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-black">
            <h2 className="text-xl font-semibold mb-4">Select User</h2>
            {/* Dropdown for selecting students */}
            <div className="mb-4">
              <label htmlFor="studentsDropdown" className="mr-2">
                Students:
              </label>
              <select
                id="studentsDropdown"
                onChange={(e) => handleUserSelect("student", e.target.value)}
                className="text-white"
              >
                <option value="">Select Student</option>
                {usersList
                  .filter((user) => user.role === "Student")
                  .map((student, index) => (
                    <option key={index} value={student.uid}>
                      {student.displayName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="subjectsDropdown" className="mr-2">
                Subjects:
              </label>
              <select
                id="subjectsDropdown"
                onChange={(e) => handleUserSelect("subject", e.target.value)}
                className="text-white"
              >
                <option value="">Select Subject</option>
                {subjectList.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            {/* Dropdown for selecting teachers */}
            {/* Button to trigger onClick function */}
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Schedule Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;

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
