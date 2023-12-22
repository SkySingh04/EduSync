// PageComponent.tsx
import { useState, useEffect } from "react";
import { useEdgeStore } from "../lib/edgestore";
import { db } from "../firebase";
import { getDocs, addDoc, collection, DocumentData } from "firebase/firestore";
import toast from "react-hot-toast/headless"

interface User {
  uid: string;
  displayName: string;
  role: string;
}

export default function PageComponent() {
  const [userList, setUsersList] = useState<User[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [teacherID] = useState<string>("CHJ3KL849BSFzv3brprJ62gTVF62");
  const [filename, setFilename] = useState<string>("");
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const userRef = collection(db, "users");
      const userDoc = await getDocs(userRef);
      const userData: User[] = [];
      userDoc.forEach((doc) => {
        userData.push(doc.data() as User);
      });
      setUsersList(userData);
    };

    fetchUsers();
  }, []);

  function handleUserSelect(userId: string) {
    setStudentId(userId);
  }

  return (
    <div className=" justify-center inline">
      <div className="max-w-1/3 p-6 bg-black rounded-md shadow-md mt-20">
        <input
          type="file"
          className="mb-4 p-2 border rounded-md"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <input
          placeholder="Enter File name..."
          className="mb-4 p-2 border rounded-md"
          onChange={(e) => setFilename(e.target.value)}
        />
        <select
          id="studentsDropdown"
          className="mb-4 p-2 border rounded-md"
          onChange={(e) => handleUserSelect(e.target.value)}
        >
          <option value="">Select Student</option>
          {userList
            .filter((user) => user.role === "Student")
            .map((student, index) => (
              <option key={index} value={student.uid}>
                {student.displayName}
              </option>
            ))}
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mx-10"
          onClick={async () => {
            if (file) {
              try {
                const res = await edgestore.publicFiles.upload({
                  file,
                  onProgressChange: (progress) => {
                    console.log(progress);
                  },
                });

                const publicUrl = res.url;

                setDownloadLink(publicUrl);

                const documentsCollection = collection(db, "Files");
                await addDoc(documentsCollection, {
                  FileName: filename,
                  FileLink: publicUrl,
                  StudentID: studentId,
                  TeacherID: teacherID,
                  uploadedTime: new Date(),
                });
                console.log("successfull")
                toast.success("successfully uploaded file")
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            }
          }}
        >
          Upload
        </button>

        {downloadLink && (
          <div className="mt-4 bg-black">
            <p className="mb-2">Download Link:</p>
            <a
              href={downloadLink}
              download={`${filename}.pdf`}
              className="text-blue-500 hover:underline"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
