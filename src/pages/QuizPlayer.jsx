import React, { useState } from 'react';
import TakeQuiz from '../components/quiz/TakeQuiz';

export default function QuizPlayer() {
  const [quizId, setQuizId] = useState('');
  return (
    <div className="p-4 max-w-xl mx-auto space-y-3">
      <h2 className="text-xl font-semibold">Play Quiz</h2>
      <input className="border p-2 rounded w-full" placeholder="Enter Quiz ID" value={quizId} onChange={e=>setQuizId(e.target.value)} />
      {quizId && <TakeQuiz quizId={quizId} />}
    </div>
  );
}
