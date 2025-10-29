import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherDashboard from "./TeacherDashboard.jsx";
import TeacherForm from "./TeacherForm.jsx";

const TeacherList = ({ onBack }) => {   // ✅ define function properly
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading teachers:",  err.response?.data || err.message);
    }
  };

  if (selectedTeacher) {
    return (
      <TeacherDashboard
        teacher={selectedTeacher}
        onBack={() => setSelectedTeacher(null)}
      />
    );
  }

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>
      <h3>👨‍🏫 Teachers</h3>

      {!showForm && (
        <button onClick={() => setShowForm(true)}>➕ Add Teacher</button>
      )}
      {showForm && <TeacherForm onCancel={() => setShowForm(false)} onCreated={load} />}

      {teachers.length === 0 && <p>No teachers found.</p>}
      <ul>
        {teachers.map((t) => (
         <li key={t._id}>
          <button onClick={() => setSelectedTeacher(t)}>
           {t.name} ({t.email}) - {t.gender} - {t.phone?.join(", ")}
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};

// ✅ now TeacherList is defined and exported
export default TeacherList;
