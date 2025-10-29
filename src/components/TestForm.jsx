import React, { useState } from 'react'
import axios from 'axios'

export default function TestForm({ onCancel, onCreated }){
  const [form, setForm] = useState({ title:'', subject:'General', duration:30 })
  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/api/tests', form, { headers: { Authorization: `Bearer ${token}` } })
      alert('Test created')
      onCreated()
    } catch (e) { console.error(e); alert('Failed to create test') }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 12 }}>
      <h4>Create Test</h4>
      <input placeholder='Title' value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /> <br />
      <input placeholder='Subject' value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /> <br />
      <input placeholder='Duration (mins)' type='number' value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} /> <br />
      <button type='submit'>Create</button>{' '}
      <button type='button' onClick={onCancel}>Cancel</button>
    </form>
  )
}
