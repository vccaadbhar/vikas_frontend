import React from 'react';
import AdminQuestionForm from '../components/quiz/AdminQuestionForm';
import QuizBuilder from '../components/quiz/QuizBuilder';

export default function QuizAdmin() {
  return (
    <div className="space-y-8">
      <AdminQuestionForm />
      <QuizBuilder />
    </div>
  );
}
