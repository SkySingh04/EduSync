'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const getStarted = () => {
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-between p-12 bg-gradient-to-b from-blue-950 to-blue-600 min-h-screen text-white">
      <section className="text-center mb-12">
        <h6 className="text-m md:text-3xl font-extrabold mb-4">
          Unlock Your Potential with Personalized Tutoring
        </h6>
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

      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-4xl">
        {/* Feature Card 1 */}
        <div className="bg-blue-400 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold my-4"> 
          Seamless Ingress Experience 
          </h3>
          <p className="text-white">
          -Effortless navigation for students to peruse and join their class particulars. 
          </p>
          <p className="text-white">
          -Tutors wield facile access to class intricacies, seamlessly initiating scholarly sessions.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-blue-400 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold my-4">Cogitative Class Scheduler</h3>
          <p className="text-white">
          -Intuitive interface empowering students and tutors to delineate preferred temporal epochs.
          </p>
          <p className="text-white">
          -Autonomous generation and dissemination of class calendars, a sublime amalgamation of convenience and precision.  
          </p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-blue-400 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold my-4">Attendance Ascertainment</h3>
          <p className="text-white">
          -Impeccable feature for the scrupulous recording of attendance during each scholarly convocation.
          </p>
          <p className="text-white">
          -Effortless access to attendance records for students and tutors alike.
          </p>
        </div>

        {/* Feature Card 4 */}
        <div className="bg-blue-400 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold my-4">NLP-Pinnacle Chatbot</h3>
          <p className="text-white">
          -NLP eminence enabling students to elegantly requisition class timetables, annul engagements, and seek elucidation on class schedules.
          </p>
          <p className="text-white">
          -NLP eminence empowering tutors to effortlessly peruse their class schedules.
          </p>
        </div>
      </section>
    </main>
  );
}
