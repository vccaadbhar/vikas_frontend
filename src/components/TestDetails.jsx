import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export default function TestDetails(){
  const { id } = useParams()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [questionForm, setQuestionForm] = useState({ subject:'', chapter:'', topic:'', questionText:'', options: ['', '', '', ''], correctAnswer: 0, explanation:'' })
  const token = localStorage.getItem('token')
  const nav = useNavigate()

  useEffect(()=>{ load() }, [id, showForm])

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:4000/api/tests/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setTest(res.data)
    } catch (e) { alert('Failed to load test') }
    finally { setLoading(false) }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    try {
      const optionsArr = questionForm.options.map(opt => opt.trim()).filter(Boolean)
      const qRes = await axios.post('http://localhost:4000/api/questions', { ...questionForm, options: optionsArr, correctAnswer: Number(questionForm.correctAnswer) }, { headers: { Authorization: `Bearer ${token}` } })
      // attach to test
      await axios.put(`http://localhost:4000/api/tests/${id}`, { questions: [...(test.questions||[]), qRes.data._id] }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Question added')
      setQuestionForm({ subject:'', chapter:'', topic:'', questionText:'', options: ['', '', '', ''], correctAnswer: 0, explanation:'' })
      setShowForm(false)
      load()
    } catch (e) { console.error(e); alert('Failed to add question') }
  }

  if (loading) return <p>Loading...</p>
  if (!test) return <p>Test not found</p>

  return (
    <div>
      <button onClick={() => nav(-1)}>⬅ Back</button>
      <h3>{test.title} — {test.subject}</h3>
      <p>Duration: {test.duration} minutes</p>

      <h4>Questions ({test.questions?.length || 0})</h4>
      <ul>
        {test.questions?.map(q => (
          <li key={q._id || q}><b>{q.questionText}</b> ({q.options.join(', ')})</li>
        ))}
      </ul>

      <button onClick={() => setShowForm(true)}>➕ Add Question</button>

      {showForm && (
        <form onSubmit={handleAddQuestion} style={{ border: '1px solid #ddd', padding: 10, margin: 10 }}>
          <input placeholder='Subject' value={questionForm.subject} onChange={e => setQuestionForm({...questionForm, subject: e.target.value})} required /> <br />
          <input placeholder='Chapter' value={questionForm.chapter} onChange={e => setQuestionForm({...questionForm, chapter: e.target.value})} /> <br />
          <input placeholder='Topic' value={questionForm.topic} onChange={e => setQuestionForm({...questionForm, topic: e.target.value})} /> <br />
          <textarea placeholder='Question Text' value={questionForm.questionText} onChange={e => setQuestionForm({...questionForm, questionText: e.target.value})} required /> <br />
          {questionForm.options.map((opt, i) => (
            <input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={e => {
              const opts = [...questionForm.options]; opts[i] = e.target.value;
              setQuestionForm({ ...questionForm, options: opts });
            }} required />
          ))}
          <br />
          <input type='number' min='0' max='3' value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: Number(e.target.value)})} required /> Correct Option Index (0-3)<br />
          <textarea placeholder='Explanation' value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} /> <br />
          <button type='submit'>Add Question</button>
          <button type='button' onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  )
}
