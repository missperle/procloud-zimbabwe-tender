
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBriefWizard, BriefQuestion } from '@/hooks/useBriefWizard';

export const useBriefWizardState = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    currentDraft,
    currentCategory,
    getCurrentCategoryQuestions,
    getResponseForQuestion,
    getAISuggestion,
    saveResponse,
    moveToNextCategory,
    startNewDraft,
    generateBriefSummary,
    submitCompletedBrief,
  } = useBriefWizard();

  const [currentQuestions, setCurrentQuestions] = useState<BriefQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefTitle, setBriefTitle] = useState('');
  const [briefCategory, setBriefCategory] = useState('design');
  const [isComplete, setIsComplete] = useState(false);
  const [briefSummary, setBriefSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Get current questions based on category
  useEffect(() => {
    const questions = getCurrentCategoryQuestions();
    setCurrentQuestions(questions);
    
    // Pre-fetch suggestions for each question
    questions.forEach(question => {
      fetchSuggestionForQuestion(question);
    });
  }, [currentCategory, getCurrentCategoryQuestions]);

  // Initialize the form or fetch existing draft
  useEffect(() => {
    if (!currentDraft) {
      startNewDraft();
    } else {
      // Load existing responses
      const respObj: Record<string, string> = {};
      currentQuestions.forEach(question => {
        const response = getResponseForQuestion(question.id);
        if (response && response.response) {
          respObj[question.id] = response.response;
        }

        // If there's an AI suggestion, load it
        if (response && response.ai_suggested_response) {
          setSuggestions(prev => ({
            ...prev,
            [question.id]: response.ai_suggested_response || ''
          }));
        }
      });
      setResponses(respObj);
    }
  }, [currentDraft, currentQuestions, getResponseForQuestion, startNewDraft]);

  // Fetch an AI suggestion for a question
  const fetchSuggestionForQuestion = async (question: BriefQuestion) => {
    setIsLoadingSuggestions(prev => ({
      ...prev,
      [question.id]: true
    }));

    try {
      const suggestion = await getAISuggestion(question.id, question.question);
      if (suggestion) {
        setSuggestions(prev => ({
          ...prev,
          [question.id]: suggestion
        }));
      }
    } finally {
      setIsLoadingSuggestions(prev => ({
        ...prev,
        [question.id]: false
      }));
    }
  };

  // Update the local responses when a user inputs a value
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Save the current response
  const handleSaveResponse = async (questionId: string) => {
    const response = responses[questionId] || '';
    await saveResponse(questionId, response, false, suggestions[questionId]);
  };

  // Use the AI suggestion as the response
  const handleUseSuggestion = async (questionId: string) => {
    const suggestion = suggestions[questionId] || '';
    setResponses(prev => ({
      ...prev,
      [questionId]: suggestion
    }));
    await saveResponse(questionId, suggestion, true, suggestion);
  };

  // Move to the next category of questions
  const handleNextCategory = async () => {
    // Save all responses first
    for (const question of currentQuestions) {
      if (responses[question.id]) {
        await saveResponse(question.id, responses[question.id], false, suggestions[question.id]);
      }
    }

    await moveToNextCategory();
  };

  // Generate a summary and preview the completed brief
  const handleViewSummary = async () => {
    // Save all current responses
    for (const question of currentQuestions) {
      if (responses[question.id]) {
        await saveResponse(question.id, responses[question.id], false, suggestions[question.id]);
      }
    }

    const summary = await generateBriefSummary();
    if (summary) {
      setBriefSummary(summary);
      setIsComplete(true);
      setShowSummary(true);
    }
  };

  // Submit the final brief
  const handleSubmitBrief = async () => {
    if (!briefTitle) {
      alert("Please enter a title for your brief");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitCompletedBrief(briefTitle, briefCategory);
      if (result) {
        navigate('/client-dashboard?tab=briefs');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    error,
    currentDraft,
    currentCategory,
    currentQuestions,
    responses,
    suggestions,
    isLoadingSuggestions,
    isSubmitting,
    briefTitle,
    briefCategory,
    isComplete,
    briefSummary,
    showSummary,
    setBriefTitle,
    setBriefCategory,
    setShowSummary,
    handleResponseChange,
    handleSaveResponse,
    handleUseSuggestion,
    handleNextCategory,
    handleViewSummary,
    handleSubmitBrief
  };
};
