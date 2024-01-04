import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const userCredential: any = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("user created");
        console.log(user);
        console.log(data.get("role"))
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: `${data.get("firstName")} ${data.get("lastName")}`,
          role: data.get("role"),
        };
  
        // Create a user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        try{setDoc(userDocRef, userData);}
        catch(e){
          console.log(e);
        }
  
        // Update the user's profile
         updateProfile(userCredential.user, {
          displayName: `${data.get("firstName")} ${data.get("lastName")}`,
        });
        toast.success("Signed up successfully");
  
        router.push(`/${data.get("role")?.toString().toLowerCase()}`);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        toast.error(error.message);
      });
    
      
    } catch (error: any) {
      const errorMessage = error.message;
      console.error(errorMessage);
      toast.error("Invalid email or password");
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form
        onSubmit={handleSubmit}
        className="loginform bg-customBlue p-8 rounded-md"
      >
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        <div className="">
          <input
            className="input-field"
            type="text"
            name="firstName"
            placeholder="First Name"
          />
          <input
            className="input-field"
            type="text"
            name="lastName"
            placeholder="Last Name"
          />
        </div>

        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email"
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
        />

        <select className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 input-field" name="role" >
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
        </select>

        <button className="loginbutton bg-customViolet mt-4">Sign Up</button>

        {/* {error && <p className="text-red-700 mt-2">{error}</p>} */}
      </form>
    </div>
  );
}

export default SignUpForm;
