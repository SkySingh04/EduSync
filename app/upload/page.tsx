"use client";
import * as React from "react";
import { useEdgeStore } from "../lib/edgestore";
import { db } from "../firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";

export default function Page() {
  const [userList, setUsersList]: any = React.useState([]);
  const [studentId, setStudentId]: any = React.useState("");
  const [teacherID, setTeacherID]: any = React.useState(
    "CHJ3KL849BSFzv3brprJ62gTVF62"
  );
  const [filename, setfilename]:any = React.useState("")

  React.useEffect(() => {
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

  function handleUserSelect(role: string, userId: string) {
    setStudentId(userId);
  }

  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  const [downloadLink, setDownloadLink] = React.useState<string | null>(null);

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <select
        id="studentsDropdown"
        onChange={(e) => handleUserSelect("student", e.target.value)}
        className="text-white"
      >
        <option value="">Select Student</option>
        {userList
          .filter((user: any) => user.role === "Student")
          .map((student: any, index: any) => (
            <option key={index} value={student.uid}>
              {student.displayName}
            </option>
          ))}
      </select>
      <input
      placeholder="Enter File name..."
      onChange={(e)=>setfilename(e.target.value)}
      className="text-white"
      
      
      />
      <button
        onClick={async () => {
          if (file) {
            try {
              const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                  // you can use this to show a progress bar
                  console.log(progress);
                },
              });

              // Assuming `res` contains the URL or path in the `url` property
              const publicUrl = res.url;

              // Set the download link
              setDownloadLink(publicUrl);

              const documentsCollection = collection(db, "Files");
              const newDocumentRef = await addDoc(documentsCollection, {
                FileName: filename,
                FileLink: publicUrl,
                StudentID: studentId,
                TeacherID: teacherID,

                uploadedTime: new Date(),
                // Add other relevant information here
              });
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
        }}
      >
        Upload
      </button>

      {downloadLink && (
        <div>
          <p>Download Link:</p>
          <a href={downloadLink} download="filename.pdf">
            Download File
          </a>
        </div>
      )}
    </div>
  );
}
