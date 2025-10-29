import React, { useState } from 'react'
import axios from 'axios'

export default function StudentForm({ onCancel, onCreated }){
  const [form, setForm] = useState({ name:'', email:'', password:'Admin@123', class:'', section:'' })
  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:4000/api/students', form, { headers: { Authorization: `Bearer ${token}` } })
      alert('Student created')
      onCreated(res.data)
    } catch (e) { console.error(e); alert('Failed to create student') }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 12 }}>
      <h4>Add Student</h4>
      <input placeholder='Name' value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /> <br />
      <input placeholder='Email' type='email' value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /> <br />
      <input placeholder='Password' type='text' value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /> <br />
      <input placeholder='Class' value={form.class} onChange={e => setForm({...form, class: e.target.value})} /> <br />
      <input placeholder='Section' value={form.section} onChange={e => setForm({...form, section: e.target.value})} /> <br />
      <button type='submit'>Save</button>{' '}
      <button type='button' onClick={onCancel}>Cancel</button>
    </form>
  )
}
