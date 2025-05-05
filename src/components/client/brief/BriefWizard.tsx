
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BriefQuestion, useBriefWizard } from '@/hooks/useBriefWizard';
import BriefWizardProgress from './BriefWizardProgress';
import { Loader, ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const BriefWizard = () => {
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

  // If loading and no current draft
  if (loading && !currentDraft) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Initializing your brief...</span>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, there was an error: {error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Your Brief</CardTitle>
          <CardDescription>
            Our AI assistant will help you create a detailed brief for your project
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <BriefWizardProgress 
            currentCategory={currentCategory} 
            isComplete={isComplete}
          />
          
          <div className="mt-6 space-y-6">
            {currentQuestions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                {question.help_text && (
                  <p className="text-sm text-gray-500 mb-3">{question.help_text}</p>
                )}
                
                {question.field_type === 'text' && (
                  <Input
                    placeholder={question.placeholder}
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="w-full"
                  />
                )}
                
                {question.field_type === 'textarea' && (
                  <Textarea
                    placeholder={question.placeholder}
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
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
                      onClick={() => handleUseSuggestion(question.id)}
                      disabled={isLoadingSuggestions[question.id] || !suggestions[question.id]}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                  
                  <div className="mt-1 text-sm text-blue-800">
                    {isLoadingSuggestions[question.id] ? (
                      <div className="flex items-center text-blue-400">
                        <Loader className="h-3 w-3 mr-2 animate-spin" />
                        Generating suggestion...
                      </div>
                    ) : (
                      suggestions[question.id] || "No suggestion available yet."
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveResponse(question.id)}
                    disabled={!responses[question.id]}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/client-dashboard?tab=briefs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          {isComplete ? (
            <Button onClick={() => setShowSummary(true)}>
              View Summary
            </Button>
          ) : (
            <Button onClick={handleNextCategory}>
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Brief Summary Sheet */}
      <Sheet open={showSummary} onOpenChange={setShowSummary}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>Your Brief Summary</SheetTitle>
            <SheetDescription>
              Review your brief before final submission
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="brief-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Title
                </label>
                <Input
                  id="brief-title"
                  value={briefTitle}
                  onChange={(e) => setBriefTitle(e.target.value)}
                  placeholder="Enter a title for your brief"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="brief-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select 
                  value={briefCategory} 
                  onValueChange={setBriefCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="writing">Writing & Translation</SelectItem>
                    <SelectItem value="video">Video & Animation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Brief Summary</h3>
                <div className="p-4 bg-gray-50 rounded-md border whitespace-pre-wrap">
                  {briefSummary}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                Edit Brief
              </Button>
              <Button 
                onClick={handleSubmitBrief} 
                disabled={isSubmitting || !briefTitle}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Brief'
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BriefWizard;
