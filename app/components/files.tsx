// components/UploadedFilesList.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
interface UploadedFilesListProps {
  userId: string;
}
const UploadedFilesList: React.FC<UploadedFilesListProps> = ({userId}) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const currentStudentId = userId;

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      const filesRef = collection(db, "Files");
      const filesDoc = await getDocs(filesRef);

      const allFiles: any[] = [];

      filesDoc.forEach((doc) => {
        const fileData = doc.data();
        // console.log(fileData);
        // console.log(fileData.StudentID);
        if (fileData.StudentID == currentStudentId) {
        //   console.log("hehe");
        //   console.log(fileData);
          allFiles.push(fileData);
        }
      });
console.log(allFiles)
      setUploadedFiles(allFiles);
      
    } catch (error) {
      console.error("Error fetching all files:", error);
    }
  };

  return (
<div className="p-8">
  <h1 className="text-3xl font-bold mb-6">All Uploaded Files</h1>
  {uploadedFiles.length > 0 ? (
    uploadedFiles.map((file, index) => (
      <div key={index} className="bg-blue-200 rounded-lg p-4 shadow-md mb-6 max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl text-black font-semibold">{file.FileName}</h2>
          <a
            href={file.FileLink}
            className="text-blue-900 hover:underline"
          >
            Download File
          </a>
        </div>
        {/* Add more file details as needed */}
      </div>
    ))
  ) : (
    <p className="text-gray-500">No uploaded files found.</p>
  )}
</div>



  );
};

export default UploadedFilesList;
