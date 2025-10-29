// src/components/StudentsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentsList({ onBack }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth?role=student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      if (editingStudent) {
        // Update student
        await axios.put(
          `http://localhost:4000/api/auth/${editingStudent._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Student updated!");
      } else {
        // Add student
        await axios.post("http://localhost:4000/api/auth/register", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Student added!");
      }
      setShowForm(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.msg || err.message));
    }
  };

  if (selectedStudent) {
    return (
      <div style={{ padding: "20px" }}>
        <button onClick={() => setSelectedStudent(null)}>⬅ Back</button>
        <h3>📖 Student Dashboard</h3>
        <p><b>Name:</b> {selectedStudent.name}</p>
        <p><b>Email:</b> {selectedStudent.email}</p>
        <p><b>Gender:</b> {selectedStudent.gender}</p>
        <p><b>DOB:</b> {selectedStudent.dob}</p>
        <p><b>Father Name:</b> {selectedStudent.fatherName}</p>
        <p><b>Mother Name:</b> {selectedStudent.motherName}</p>
        <p><b>Aadhaar:</b> {selectedStudent.aadhaarNumber}</p>
        <p><b>Class:</b> {selectedStudent.className}</p>
        <p><b>Section:</b> {selectedStudent.section}</p>
        <p><b>Subjects:</b> {selectedStudent.subjects?.join(", ")}</p>
        <p><b>Phone:</b> {selectedStudent.phone?.join(", ")}</p>
        <p><b>Address:</b> {selectedStudent.address}</p>
        {selectedStudent.photo && (
          <img
            src={`http://localhost:4000${selectedStudent.photo}`}
            alt="student"
            style={{ width: "120px", borderRadius: "8px", marginTop: "10px" }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>
      <h3>👨‍🎓 Students</h3>

      {/* Add/Edit Buttons */}
      <div style={{ margin: "10px 0" }}>
        {!showForm && (
          <button onClick={() => setShowForm(true)}>➕ Add Student</button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} style={{ marginBottom: "20px" }}>
          <h4>{editingStudent ? "✏️ Edit Student" : "➕ New Student"}</h4>
          <input name="role" type="hidden" value="student" />
          <input name="name" placeholder="Full Name" defaultValue={editingStudent?.name} required />
          <input name="gender" placeholder="Gender" defaultValue={editingStudent?.gender} />
          <input name="dob" type="date" defaultValue={editingStudent?.dob} />
          <input name="fatherName" placeholder="Father Name" defaultValue={editingStudent?.fatherName} />
          <input name="motherName" placeholder="Mother Name" defaultValue={editingStudent?.motherName} />
          <input name="aadhaarNumber" placeholder="Aadhaar Number" defaultValue={editingStudent?.aadhaarNumber} />
          <input name="phone" placeholder="Phone" defaultValue={editingStudent?.phone?.join(",")} />
          <input name="email" type="email" placeholder="Email" defaultValue={editingStudent?.email} required />
          <input name="address" placeholder="Address" defaultValue={editingStudent?.address} />
          <input name="className" placeholder="Class" defaultValue={editingStudent?.className} />
          <input name="section" placeholder="Section" defaultValue={editingStudent?.section} />
          <input name="subjects" placeholder="Subjects (comma separated)" defaultValue={editingStudent?.subjects?.join(",")} />
          <input name="password" type="password" placeholder="Password" />
          <input name="photo" type="file" />
          <br />
          <button type="submit">{editingStudent ? "Update" : "Create"}</button>
          <button type="button" onClick={() => { setShowForm(false); setEditingStudent(null); }}>
            Cancel
          </button>
        </form>
      )}

      {/* List */}
      {students.length === 0 && <p>No students found.</p>}
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            <button onClick={() => setSelectedStudent(s)}>
              {s.name} ({s.email})
            </button>
            <button onClick={() => { setEditingStudent(s); setShowForm(true); }} style={{ marginLeft: "10px" }}>
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(s._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsList;
