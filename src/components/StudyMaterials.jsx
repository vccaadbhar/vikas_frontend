import React, { useState, useEffect } from "react";
import axios from "axios";

function StudyMaterials({ onBack }) {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("pdf");
  const [url, setUrl] = useState("");

  const token = localStorage.getItem("token");

  // Load all materials
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMaterials(res.data));
  }, []);

  // Add new material
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/materials",
        { title, type, url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials([...materials, res.data]);
      setTitle("");
      setUrl("");
    } catch (err) {
      alert("Failed to add material");
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/materials/${id}`, updates, { headers: { Authorization: `Bearer ${token}` } });
      setMaterials(materials.map(m => m._id === id ? res.data : m));
    } catch (err) { alert('Failed to update material') }
  }
      <table>
        <thead>
          <tr><th>Title</th><th>Type</th><th>URL</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m._id}>
              <td>{m.title}</td>
              <td>{m.type}</td>
              <td><a href={m.url} target="_blank" rel="noreferrer">Open</a></td>
              <td>
                <button onClick={() => {
                  const newTitle = prompt('Title', m.title);
                  if (newTitle === null) return;
                  const newUrl = prompt('URL', m.url);
                  if (newUrl === null) return;
                  handleEdit(m._id, { title: newTitle, url: newUrl });
                }}>✏️ Edit</button>
                {' '}
                <button onClick={() => handleDelete(m._id)} style={{ color: "red" }}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>
      <h3>📘 Study Materials</h3>

      {/* Add form */}
      <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Material Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="link">Link</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          placeholder="Material URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">➕ Add</button>
      </form>

      {/* Material list */}
      <ul>
        {materials.map((m) => (
          <li key={m._id}>
            <b>{m.title}</b> ({m.type}) -{" "}
            <a href={m.url} target="_blank" rel="noreferrer">
              Open
            </a>
            {"  "}
            <button onClick={() => handleDelete(m._id)} style={{ color: "red" }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudyMaterials;
