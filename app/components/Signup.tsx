import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: `${data.get("firstName")} ${data.get("lastName")}`,
        role: data.get("role"),
      };

      // Create a user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userData);

      // Update the user's profile
      await updateProfile(user, {
        displayName: `${data.get("firstName")} ${data.get("lastName")}`,
      });

      router.push(`/`);
    } catch (error: any) {
      const errorMessage = error.message;
      console.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit} className="loginform bg-customBlue p-8 rounded-md">
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

        <select className="input-field" name="role">
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
        </select>

        <button className="loginbutton bg-customViolet mt-4">Sign Up</button>

        {error && <p className="text-red-700 mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default SignUpForm;
