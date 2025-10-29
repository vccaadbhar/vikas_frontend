function ManageClasses({ onBack }) {
  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack}>⬅ Back</button>
      <h2>📚 Manage Classes</h2>
      <p>Here you can add or edit classes (recorded / online).</p>
    </div>
  );
}

export default ManageClasses;   // ✅ important
