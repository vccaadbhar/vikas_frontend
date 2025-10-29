import React, { useEffect, useState } from "react";
import axios from "axios";

function TeacherDetails({ teacherId, onBack }) {
  const [teacher, setTeacher] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/auth/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTeacher(res.data))
      .catch((err) => console.error("Error loading teacher:", err));
  }, [teacherId]);

  if (!teacher) return <p>Loading teacher details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack}>⬅ Back</button>
      <h2>👨‍🏫 Teacher Details</h2>
      <img
        src={teacher.photo || ""}
        alt={teacher.name}
        style={{ width: "100px", borderRadius: "50%", marginBottom: "10px" }}
      />
      <p><b>Name:</b> {teacher.name}</p>
      <p><b>Father's Name:</b> {teacher.fatherName}</p>
      <p><b>Mother's Name:</b> {teacher.motherName}</p>
      <p><b>DOB:</b> {new Date(teacher.dob).toDateString()}</p>
      <p><b>Phone:</b> {teacher.phone1}, {teacher.phone2}</p>
      <p><b>Email:</b> {teacher.email}</p>
      <p><b>Address:</b> {teacher.address}</p>

      <h3>🎓 Qualifications</h3>
      <p>Graduation: {teacher.graduation?.subject} ({teacher.graduation?.year})</p>
      <p>Post Graduation: {teacher.postGraduation?.subject} ({teacher.postGraduation?.year})</p>
      <p>Special Course: {teacher.specialCourse || "N/A"}</p>

      <h3>📑 Bank Details</h3>
      <p>Account No: {teacher.bankDetails?.accountNumber}</p>
      <p>IFSC: {teacher.bankDetails?.ifsc}</p>
      <p>Bank Name: {teacher.bankDetails?.bankName}</p>
      <p>Branch: {teacher.bankDetails?.branch}</p>

      <h3>💰 Payments</h3>
      {teacher.payments?.length > 0 ? (
        <ul>
          {teacher.payments.map((p) => (
            <li key={p._id}>
              ₹{p.amount} - {p.status} ({new Date(p.date).toDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No payments recorded.</p>
      )}
    </div>
  );
}

export default TeacherDetails;
