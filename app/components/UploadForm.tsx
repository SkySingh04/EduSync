// // components/UploadForm.tsx
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { uploadDocument } from '../utils/api'; // Create this function in the next step

// const UploadForm: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const router = useRouter();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFile) {
//       const documentUrl = await uploadDocument(selectedFile);
//       // Save documentUrl in Firebase
//       // Example: firebase.database().ref('documents').push({ url: documentUrl });
//       router.push('/');
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload Document</button>
//     </div>
//   );
// };

// export default UploadForm;
