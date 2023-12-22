"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const getStarted = () => {
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-between p-12 bg-gradient-to-b from-blue-950 to-blue-600 min-h-screen text-white">
      <section className="text-center">
        <h1 className="text-2xl md:text-6xl font-extrabold mb-4">
          Unlock Your Potential with Personalized Tutoring
        </h1>
        <p className="text-lg mb-8">
          Connect with experienced tutors for one-to-one learning.
        </p>
        <button
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-200"
          onClick={getStarted}
        >
          Get Started
        </button>
      </section>
    </main>
  );
}
