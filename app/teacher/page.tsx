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
import toast from "react-hot-toast";

const Teacher = () => {
  const [slotData, setSlotData] = useState<SlotData>({});
  const [showUserList, setShowUserList] = useState(false);
  const [day, setDay] = useState<Day>("Monday");
  const [time, setTime] = useState<Time>("9:00 AM");
  const [usersList, setUsersList] = useState<any[]>([]);
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
  const currentUserId = "rE1uFj99RNVkFoGSrdE97RikP5b2";
  const auth = getAuth();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const userRef = collection(db, "users");
      const userDoc = await getDocs(userRef);
      const userData: any = [];
      userDoc.forEach((doc) => {
        userData.push(doc.data());
      });
      setUsersList(userData);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchSlotsData();
  }, []);

  const handleSlotClick = (day1: string, time1: string) => {
    setDay(day1);
    setTime(time1);
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

          const updatedData = {
            ...existingData,
            students: [...(existingData.students || []), newData.students[0]],
            teachers: [...(existingData.teachers || []), newData.teachers[0]],
          };

          await setDoc(timeslotRef, updatedData);
          toast.success("Class scheduled successfully");
          setShowUserList(false);
          fetchSlotsData();
        } else {
          toast.error("Timeslot does not exist.");
        }
      } catch (error:any) {
        console.error("Error updating timeslot:", error);
        toast.error(error.message);
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
    setSlotData(filteredSlots);
  };

  function handleUserSelect(role: string, userId: string) {
    if (role === "student") {
      setSelectedStudent(userId);
    } else if (role === "subject") {
      setSelectedSubject(userId);
    }
  }

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
                        <ul className="list-disc pl-4">
                          {slotData[`${day}-${time}`]?.teachers?.map(
                            (teacher: Teacher, index) => (
                              <li key={index}>{teacher.name}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Students:</h3>
                        <ul className="list-disc pl-4">
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
    <div className="">
      <div className="flex justify-center flex-col lg:flex-row">
        <div className="w-full lg:w-full lg:hidden p-4">
          <h1 className="text-6xl ml-[95px] font-bold mb-4">
            Teacher Dashboard
          </h1>
          <PageComponent />
        </div>
        <div className="hidden lg:block w-full lg:w-1/2 p-4 mb-4 lg:mb-0">
          <h1 className="text-6xl ml-[95px] font-bold mb-4">
            Teacher Dashboard
          </h1>
          <PageComponent />
        </div>
        <div className="w-full lg:w-1/2 p-4">
          {generateTimeSlots()}
        </div>
      </div>

      {showUserList && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-black">
            <h2 className="text-xl font-semibold mb-4">Select User</h2>
            <div className="mb-4">
              <label htmlFor="studentsDropdown" className="mr-2">
                Students:
              </label>
              <select
                id="studentsDropdown"
                className="text-white"
                onChange={(e) => handleUserSelect("student", e.target.value)}
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
                className="text-white"
                onChange={(e) => handleUserSelect("subject", e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjectList.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
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
