import React, { useState } from "react";
import axios from "axios";

function TeacherForm({ onCancel, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    fatherName: "",
    motherName: "",
    dob: "",
    aadharNumber: "",
    phone: "",
    address: "",
    gender: "Male", // ✅ default
    qualification: "",
    graduation: "",
    postGraduation: "",
    specialCourse: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/register", { ...form, role: "teacher" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Teacher registered successfully!");
      onCreated();
    } catch (err) {
      console.error(err);
      alert("Error creating teacher");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px", border: "1px solid #ccc" }}>
      <h3>Add Teacher</h3>
      
      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

      <input type="text" name="fatherName" placeholder="Father Name" value={form.fatherName} onChange={handleChange} />
      <input type="text" name="motherName" placeholder="Mother Name" value={form.motherName} onChange={handleChange} />
      <input type="date" name="dob" value={form.dob} onChange={handleChange} />
      <input type="text" name="aadharnumber" placeholder="Adhar Number" value={form.aadharnumber} onChange={handleChange} required />
     
     {/* ✅ Gender */}
      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />

      <input type="text" name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} />

      <button type="submit">Save Teacher</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default TeacherForm;
