// import { v2 as cloudinary } from 'cloudinary';

// interface ImageUploadResponse {
//   secure_url: string;
//   // Add more properties based on your needs
// }

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
//   api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || '',
// });

// export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     cloudinary.uploader.upload(
//       file, // Pass the file directly
//       { folder: 'your-upload-folder', resource_type: 'auto' },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result as ImageUploadResponse);
//         }
//       }
//     );
//   });
// };
