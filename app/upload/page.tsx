// import axios from 'axios';

// // Replace YOUR_CLOUD_NAME with your Cloudinary cloud name

// // async function uploadPdfToCloudinary(pdfFile: File) {
// //   // Generate a timestamp in seconds

// // }

// // Example usage:
// // const pdfFile = /* Get the PDF file to upload */;
// // uploadPdfToCloudinary(pdfFile);

// "use client";








// import React, { useRef } from 'react';

// const UploadButton: React.FC = () => {
//  const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/pdf/upload'; 
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = () => {
//     if (fileInputRef.current?.files) {
//       const pdfFile = fileInputRef.current.files[0];
//       uploadPdfToCloudinary(pdfFile);
//     }
//   };

//   const uploadPdfToCloudinary = async (pdfFile: File) => {
//     // Your upload logic here (reuse the code from the previous example)
//     const timestamp = Math.floor(Date.now() / 1000);

//     // Replace with your Cloudinary API key and API secret
//     const apiKey = 'process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY';
//     const apiSecret = 'process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET';
  
//     // Construct the signature
//     const signature = generateSignature(timestamp, apiSecret);
  
//     // Create form data for the POST request
//     const formData = new FormData();
//     formData.append('file', pdfFile);
//     formData.append('api_key', apiKey);
//     formData.append('timestamp', timestamp.toString());
//     formData.append('signature', signature);
  
//     try {
//       // Make the authenticated POST request to Cloudinary
//       const response = await axios.post(cloudinaryUploadUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       // Handle the response from Cloudinary
//       console.log('Upload successful:', response.data);
//     } catch (error:any) {
//       console.error('Error uploading to Cloudinary:', error.message);
//     }
//   }
  
//   function generateSignature(timestamp: number, apiSecret: string): string {
//     // Construct the string to sign
//     const signaturePayload = `timestamp=${timestamp}${apiSecret}`;
  
//     // Use a cryptographic library or function to generate the signature (e.g., HMAC-SHA256)
//     // Replace the following line with the actual signature generation logic
//     const signature = /* Generate the signature using HMAC-SHA256 or another secure method */ '';
  
//     return signature;
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".pdf"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//       />
//       <button onClick={() => fileInputRef.current?.click()}>Upload PDF</button>
//     </div>
//   );
// };

// export default UploadButton;

