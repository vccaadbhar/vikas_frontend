import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TestForm from './TestForm'
import { Link } from 'react-router-dom'

export default function TestsList({ onBack }){
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:4000/api/tests', { headers: { Authorization: `Bearer ${token}` } })
      setTests(res.data)
    } catch (e) { console.error(e); alert('Failed to load tests') } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return
    try {
      await axios.put(`http://localhost:4000/api/tests/${id}`, { deleted: true }, { headers: { Authorization: `Bearer ${token}` } })
      load()
    } catch (e) { alert('Failed to delete test') }
  }

  const onCreated = () => { setShowForm(false); load() }

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>
      <h3>🧾 Tests</h3>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowForm(true)}>➕ Create Test</button>
      </div>

      {showForm && <TestForm onCancel={() => setShowForm(false)} onCreated={onCreated} />}

      {loading ? <p>Loading tests...</p> : (
        tests.length === 0 ? <p>No tests found.</p> : (
          <ul>
            {tests.map(t => (
                <li key={t._id}>
                  <Link to={`/admin/tests/${t._id}`}><b>{t.title}</b></Link> ({t.subject}) — {t.questions?.length || 0} questions
                  {' '}
                  <button onClick={() => handleDelete(t._id)} style={{ color: 'red' }}>Archive</button>
                </li>
              ))}
          </ul>
        )
      )}
    </div>
  )
}
