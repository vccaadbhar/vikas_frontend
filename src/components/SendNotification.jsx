import React, { useState } from "react";
import axios from "axios";

export default function SendNotification() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    student: "",
    className: "",
    section: "",
    link: "",
    type: "text",
  });
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });
      if (file) data.append("file", file);

      await axios.post("http://localhost:4000/api/notifications", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("✅ Notification sent!");
      setForm({ title: "", message: "", audience: "all", student: "", className: "", section: "", link: "", type: "text" });
      setFile(null);
    } catch (err) {
      alert("❌ Failed to send");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded max-w-lg">
      <h2 className="text-xl font-semibold mb-3">📢 Send Notification</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full mb-2"
        required
      />

      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <select
        value={form.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
        className="border p-2 w-full mb-2"
      >
        <option value="all">All</option>
        <option value="student">Students</option>
        <option value="parent">Parents</option>
        <option value="staff">Staff</option>
        <option value="teacher">Teachers</option>
      </select>

      {/* Targeting options */}
      <input
        placeholder="Student ID (optional)"
        value={form.student}
        onChange={(e) => setForm({ ...form, student: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <div className="flex gap-2 mb-2">
        <input
          placeholder="Class (e.g. 10)"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          className="border p-2 flex-1"
        />
        <input
          placeholder="Section (e.g. A)"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="border p-2 flex-1"
        />
      </div>

      <input
        placeholder="Link (YouTube/Zoom/etc)"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />

      <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded w-full">
        Send
      </button>
    </form>
  );
}
