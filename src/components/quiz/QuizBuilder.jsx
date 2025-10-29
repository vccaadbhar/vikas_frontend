import React, { useEffect, useState } from 'react';
import { listQuestions, createQuiz } from '../../services/quizApi';

export default function QuizBuilder() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationSeconds: 0,
    attemptLimit: 0,
    isImmediateFeedback: true
  });
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      const data = await listQuestions();
      setQuestions(data);
    })();
  },[]);

  const toggle = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    const questionIds = Object.entries(selected).filter(([,v])=>v).map(([k])=>k);
    if (questionIds.length === 0) return setMsg('Select at least 1 question');
    try {
      const quiz = await createQuiz({ ...form, questionIds });
      setMsg('Quiz created ✅ ID: ' + quiz._id);
      setSelected({});
      setForm({ title:'', description:'', durationSeconds:0, attemptLimit:0, isImmediateFeedback:true });
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Quiz</h2>
      <form onSubmit={onCreate} className="space-y-2 mb-6">
        <input className="border p-2 rounded w-full" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <textarea className="border p-2 rounded w-full" rows={2} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" className="border p-2 rounded" placeholder="Duration (seconds, 0=no limit)" value={form.durationSeconds} onChange={e=>setForm({...form, durationSeconds:Number(e.target.value)})} />
          <input type="number" min="0" className="border p-2 rounded" placeholder="Attempt limit (0=unlimited)" value={form.attemptLimit} onChange={e=>setForm({...form, attemptLimit:Number(e.target.value)})} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isImmediateFeedback} onChange={e=>setForm({...form, isImmediateFeedback:e.target.checked})} />
          Immediate feedback like Telegram quiz
        </label>
        <button className="px-4 py-2 rounded bg-black text-white">Create Quiz</button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>

      <div className="border rounded">
        <div className="p-2 font-medium bg-gray-50">Select Questions</div>
        <div className="p-2 max-h-[400px] overflow-auto space-y-2">
          {questions.map(q=>(
            <label key={q._id} className="flex items-start gap-2 border p-2 rounded">
              <input type="checkbox" checked={!!selected[q._id]} onChange={()=>toggle(q._id)} />
              <div>
                <div className="font-medium">{q.text}</div>
                <ul className="list-disc pl-5 text-sm">
                  {q.options.map((o,i)=>(<li key={i}>{o.text}</li>))}
                </ul>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
