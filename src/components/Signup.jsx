// src/components/Signup.jsx
import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);
      formData.append("role", role);

      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Signup successful!");
      console.log(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: 20, maxWidth: 600, margin: "auto" }}
    >
      <h2>Signup as {role}</h2>

      {/* ✅ Only Student + Parent visible */}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
      </select>

      {/* Common fields */}
      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <select name="gender" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input name="dob" type="date" onChange={handleChange} />
      <input name="aadhaarNumber" placeholder="Aadhaar Number" onChange={handleChange} />
      <input name="phone" placeholder="Phone (comma separated)" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} />

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      {/* Student fields */}
      {role === "student" && (
        <>
          <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
          <input name="motherName" placeholder="Mother Name" onChange={handleChange} />
          <input name="className" placeholder="Class" onChange={handleChange} />
          <input name="section" placeholder="Section" onChange={handleChange} />
          <input
            name="subjects"
            placeholder="Subjects (comma separated)"
            onChange={handleChange}
          />
        </>
      )}

      {/* Parent fields */}
      {role === "parent" && (
        <>
          <input name="childName" placeholder="Son/Daughter Name" onChange={handleChange} />
          <input name="childDob" type="date" onChange={handleChange} />
          <input
            name="childAadhaar"
            value={form.childAadhaar || ""}
            onChange={handleChange}
            placeholder="Child Aadhaar Number"
            required
          />
        </>
      )}

      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
