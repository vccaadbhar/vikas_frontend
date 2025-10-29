import React, { useState } from "react";
import TeacherList from "./TeacherList.jsx";
import StudentManager from "./StudentManager.jsx";
import SchoolRecords from "./SchoolRecords.jsx";
import MakeQuiz from "../pages/MakeQuiz";
import ViewQuiz from "../pages/ViewQuiz";
import ViewResults from "../pages/ViewResults";
import ManageClasses from "./ManageClasses.jsx";
import SendNotification from "./SendNotification.jsx";

function AdminDashboard() {
  const [view, setView] = useState("home");
  const [quizView, setQuizView] = useState("menu");
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Home */}
      {view === "home" && (
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => setView("teachers")} className="px-4 py-2 border rounded">👨‍🏫 Teachers</button>
          <button onClick={() => setView("students")} className="px-4 py-2 border rounded">👨‍🎓 Students</button>
          <button onClick={() => setView("records")} className="px-4 py-2 border rounded">📊 School Records</button>
          <button
            onClick={() => {
              setView("quiz");
              setQuizView("menu");
            }}
            className="px-4 py-2 border rounded"
          >
            📝 Quiz Management
          </button>
          {user?.role === "admin" && (
            <button onClick={() => setView("classes")} className="px-4 py-2 bg-purple-600 text-white rounded">
              📚 Manage Classes
            </button>
          )}
          <button onClick={() => setShowNoticeForm(true)} className="px-4 py-2 bg-yellow-500 text-white rounded">
            📢 Create Notice
          </button>
        </div>
      )}

      {/* Teacher / Student / Records */}
      {view === "teachers" && <TeacherList onBack={() => setView("home")} />}
      {view === "students" && <StudentManager onBack={() => setView("home")} />}
      {view === "records" && <SchoolRecords onBack={() => setView("home")} />}

      {/* Quiz */}
      {view === "quiz" && (
        <div>
          {quizView === "menu" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Quiz Management</h3>
              <button onClick={() => setQuizView("make")} className="px-4 py-2 bg-blue-600 text-white rounded">Make Quiz</button>
              <button onClick={() => setQuizView("view")} className="px-4 py-2 bg-green-600 text-white rounded">View Quiz</button>
              <button onClick={() => setQuizView("results")} className="px-4 py-2 bg-purple-600 text-white rounded">View Results</button>
              <button onClick={() => setView("home")} className="mt-4 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300">
                ← Back to Dashboard
              </button>
            </div>
          )}

          {quizView === "make" && (
            <div>
              <button onClick={() => setQuizView("menu")} className="mb-4 px-3 py-1 border rounded">← Back</button>
              <MakeQuiz />
            </div>
          )}
          {quizView === "view" && (
            <div>
              <button onClick={() => setQuizView("menu")} className="mb-4 px-3 py-1 border rounded">← Back</button>
              <ViewQuiz />
            </div>
          )}
          {quizView === "results" && (
            <div>
              <button onClick={() => setQuizView("menu")} className="mb-4 px-3 py-1 border rounded">← Back</button>
              <ViewResults role="admin" />
            </div>
          )}
        </div>
      )}

      {/* Classes */}
      {view === "classes" && <ManageClasses onBack={() => setView("home")} />}

      {/* Notice Modal */}
      {showNoticeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <SendNotification onClose={() => setShowNoticeForm(false)} />
            <button onClick={() => setShowNoticeForm(false)} className="mt-3 px-4 py-2 bg-gray-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default AdminDashboard;
