
import React from 'react';
import BriefQuestion from './BriefQuestion';
import { BriefQuestion as BriefQuestionType } from '@/hooks/useBriefWizard';

interface QuestionsSectionProps {
  questions: BriefQuestionType[];
  responses: Record<string, string>;
  suggestions: Record<string, string>;
  isLoadingSuggestions: Record<string, boolean>;
  onResponseChange: (questionId: string, value: string) => void;
  onSaveResponse: (questionId: string) => void;
  onUseSuggestion: (questionId: string) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  responses,
  suggestions,
  isLoadingSuggestions,
  onResponseChange,
  onSaveResponse,
  onUseSuggestion,
}) => {
  return (
    <div className="mt-6 space-y-6">
      {questions.map((question) => (
        <BriefQuestion
          key={question.id}
          question={question}
          response={responses[question.id] || ''}
          suggestion={suggestions[question.id]}
          isLoadingSuggestion={isLoadingSuggestions[question.id] || false}
          onResponseChange={(value) => onResponseChange(question.id, value)}
          onSaveResponse={() => onSaveResponse(question.id)}
          onUseSuggestion={() => onUseSuggestion(question.id)}
        />
      ))}
    </div>
  );
};

export default QuestionsSection;
