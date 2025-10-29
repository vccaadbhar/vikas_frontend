import React, { useState } from 'react';
import { createQuestion } from '../../services/quizApi';

export default function AdminQuestionForm() {
  const [form, setForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    subject: '',
    className: '',
    chapter: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const setOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm({ ...form, options: opts });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        text: form.text,
        options: form.options.filter(Boolean).map(t => ({ text: t })),
        correctIndex: Number(form.correctIndex),
        explanation: form.explanation || undefined,
        subject: form.subject || undefined,
        className: form.className || undefined,
        chapter: form.chapter || undefined,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()) : []
      };
      await createQuestion(payload);
      setMsg('Question saved ✅');
      setForm({ text:'', options:['','','',''], correctIndex:0, explanation:'', subject:'', className:'', chapter:'', tags:'' });
    } catch (err) {
      setMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add MCQ</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea className="w-full border p-2 rounded" rows={3} placeholder="Question text" value={form.text} onChange={e=>setForm({...form, text:e.target.value})} required />
        {form.options.map((opt, i)=>(
          <input key={i} className="w-full border p-2 rounded" placeholder={`Option ${i+1}`} value={opt} onChange={e=>setOption(i, e.target.value)} />
        ))}
        <div className="grid grid-cols-2 gap-2">
          <select className="border p-2 rounded" value={form.correctIndex} onChange={e=>setForm({...form, correctIndex:e.target.value})}>
            {[0,1,2,3,4,5].map(i=>(<option key={i} value={i}>Correct is Option {i+1}</option>))}
          </select>
          <input className="border p-2 rounded" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Class" value={form.className} onChange={e=>setForm({...form, className:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Chapter" value={form.chapter} onChange={e=>setForm({...form, chapter:e.target.value})} />
          <input className="border p-2 rounded col-span-2" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
        </div>
        <textarea className="w-full border p-2 rounded" rows={3} placeholder="Explanation (optional)" value={form.explanation} onChange={e=>setForm({...form, explanation:e.target.value})} />
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white">{saving?'Saving...':'Save Question'}</button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </div>
  );
}
