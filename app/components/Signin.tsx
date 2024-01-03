import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleLogin = async () => {
    const { email, password } = state;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user document from Firestore based on user.uid
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userDoc = userDocSnapshot.data();

        // Redirect based on user role
        switch (userDoc.role) {
          case "Student":
            router.push("/student");
            break;
          case "Admin":
            router.push("/admin");
            break;
          case "Teacher":
            router.push("/teacher");
            break;
          default:
            // Handle other roles or unexpected values
            break;
        }
        toast.success("Logged in successfully");
      } else {
        // Handle the case where the user document doesn't exist
        console.error("User document not found.");
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      toast.error("Invalid email or password");
      setError(errorMessage); // Set the error message
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit} className="loginform bg-customBlue ">
        <h1>Sign in</h1>
        <input
          className="bg-customBeige text-black"
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          className="bg-customBeige text-black"
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <button className="loginbutton bg-customViolet">Sign In</button>
        {/* {error && <p className="text-red-700 border border-black">{error}</p>} */}
      </form>
    </div>
  );
}

export default SignInForm;
