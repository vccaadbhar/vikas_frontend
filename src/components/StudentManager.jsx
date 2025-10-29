import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentManager({ onBack }) {
  const [view, setView] = useState("home"); // home | add | list | fee
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    aadhaarNumber: "",
    phone1: "",
    phone2: "",
    email: "",
    address: "",
    class: "",   // ✅ backend expects "class"
    section: "",
    subject: "",
    photo: null,
    password: "",
  });

  const token = localStorage.getItem("token");

  // Fetch students
  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading students:", err.response?.data || err.message);
    }
  };

  // Add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      await axios.post("http://localhost:4000/api/students", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Student added successfully");
      resetForm();
      setView("home");
      loadStudents();
    } catch (err) {
      console.error("Add student error:", err.response?.data || err.message);
      alert("❌ Failed to add student: " + (err.response?.data?.error || err.message));
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Student deleted");
      loadStudents();
    } catch (err) {
      alert("❌ Failed to delete student: " + (err.response?.data?.error || err.message));
    }
  };

  // Update student
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      await axios.put(
        `http://localhost:4000/api/students/${selectedStudent._id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Student updated");
      setSelectedStudent(null);
      setView("list");
      loadStudents();
    } catch (err) {
  console.error("Error loading students:", err.response?.data || err.message);
  alert("❌ Failed to load students: " + (err.response?.data?.error || err.message));
}};

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      fatherName: "",
      motherName: "",
      dob: "",
      aadhaarNumber: "",
      phone1: "",
      phone2: "",
      email: "",
      address: "",
      class: "",
      section: "",
      subject: "",
      photo: null,
      password: "",
    });
  };

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>
      <h2>👨‍🎓 Student Manager</h2>

      {/* Home Menu */}
      {view === "home" && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setView("add")}>➕ Add Student</button>
          <button
            onClick={() => {
              setView("list");
              loadStudents();
            }}
          >
            📋 Student List
          </button>
          <button onClick={() => setView("fee")}>💰 Fee Records</button>
        </div>
      )}

      {/* Add Student Form */}
      {view === "add" && (
        <form onSubmit={handleAddStudent} style={{ maxWidth: "500px" }}>
          <h3>Add Student</h3>
          <input name="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input name="fatherName" placeholder="Father Name" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} />
          <input name="motherName" placeholder="Mother Name" value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} />
          <input type="date" name="dob" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
          <input name="aadhaarNumber" placeholder="Aadhaar Number" value={form.aadhaarNumber} onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })} />
          <input name="phone1" placeholder="Phone 1" value={form.phone1} onChange={(e) => setForm({ ...form, phone1: e.target.value })} />
          <input name="phone2" placeholder="Phone 2" value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input name="address" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input name="class" placeholder="Class" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} />
          <input name="section" placeholder="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
          <input name="subject" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <input type="file" name="photo" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <br />
          <button type="submit">✅ Save</button>
          <button type="button" onClick={() => setView("home")}>❌ Cancel</button>
        </form>
      )}

      {/* Student List */}
      {view === "list" && !selectedStudent && (
        <div>
          <h3>📋 Student List</h3>
          <input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul>
            {students
              .filter((s) =>
                s.name?.toLowerCase().includes(search.toLowerCase())
              )
              .map((stu) => (
                <li key={stu._id}>
                  {stu.name} ({stu.class}-{stu.section})
                  <button onClick={() => setSelectedStudent(stu)}>👁 Show</button>
                  <button
                    onClick={() => {
                      setForm(stu);
                      setSelectedStudent(stu);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(stu._id)}>❌ Delete</button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Show or Edit Student */}
      {selectedStudent && (
        <div>
          {form._id === selectedStudent._id ? (
            <form onSubmit={handleUpdateStudent}>
              <h3>Edit Student</h3>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} />
              <input value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} />
              <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
              <button type="submit">💾 Save</button>
              <button type="button" onClick={() => setSelectedStudent(null)}>⬅ Back</button>
            </form>
          ) : (
            <div>
              <h3>👁 Student Details</h3>
              <p><b>Name:</b> {selectedStudent.name}</p>
              <p><b>Father:</b> {selectedStudent.fatherName}</p>
              <p><b>Mother:</b> {selectedStudent.motherName}</p>
              <p><b>Class:</b> {selectedStudent.class}</p>
              <p><b>Section:</b> {selectedStudent.section}</p>
              <h4>💰 Fee Records</h4>
              {selectedStudent.fees?.length ? (
                <ul>
                  {selectedStudent.fees.map((f) => (
                    <li key={f._id}>
                      {f.month} → ₹{f.amount} ({f.status})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No fees</p>
              )}
              <button onClick={() => setSelectedStudent(null)}>⬅ Back</button>
            </div>
          )}
        </div>
      )}

      {/* Fee Records */}
      {view === "fee" && (
        <div>
          <h3>💰 Fee Records</h3>
          {students.map((s) => (
            <div key={s._id}>
              <b>{s.name}</b>
              <ul>
                {s.fees?.map((f) => (
                  <li key={f._id}>
                    {f.month}: ₹{f.amount} ({f.status})
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => setView("home")}>⬅ Back</button>
        </div>
      )}
    </div>
  );
}

export default StudentManager;
