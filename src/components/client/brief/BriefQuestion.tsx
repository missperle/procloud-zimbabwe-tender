
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Loader, Save } from 'lucide-react';
import { BriefQuestion as BriefQuestionType } from '@/hooks/useBriefWizard';

interface BriefQuestionProps {
  question: BriefQuestionType;
  response: string;
  suggestion?: string;
  isLoadingSuggestion: boolean;
  onResponseChange: (value: string) => void;
  onSaveResponse: () => void;
  onUseSuggestion: () => void;
}

const BriefQuestion: React.FC<BriefQuestionProps> = ({
  question,
  response,
  suggestion,
  isLoadingSuggestion,
  onResponseChange,
  onSaveResponse,
  onUseSuggestion,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-2">{question.question}</h3>
      {question.help_text && (
        <p className="text-sm text-gray-500 mb-3">{question.help_text}</p>
      )}
      
      {question.field_type === 'text' && (
        <Input
          placeholder={question.placeholder}
          value={response || ''}
          onChange={(e) => onResponseChange(e.target.value)}
          className="w-full"
        />
      )}
      
      {question.field_type === 'textarea' && (
        <Textarea
          placeholder={question.placeholder}
          value={response || ''}
          onChange={(e) => onResponseChange(e.target.value)}
          className="w-full min-h-[100px]"
        />
      )}
      
      {/* AI Suggestion Section */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-blue-700">AI Suggestion:</h4>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 h-7"
            onClick={onUseSuggestion}
            disabled={isLoadingSuggestion || !suggestion}
          >
            <Check className="h-3 w-3 mr-1" />
            Use This
          </Button>
        </div>
        
        <div className="mt-1 text-sm text-blue-800">
          {isLoadingSuggestion ? (
            <div className="flex items-center text-blue-400">
              <Loader className="h-3 w-3 mr-2 animate-spin" />
              Generating suggestion...
            </div>
          ) : (
            suggestion || "No suggestion available yet."
          )}
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveResponse}
          disabled={!response}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default BriefQuestion;
