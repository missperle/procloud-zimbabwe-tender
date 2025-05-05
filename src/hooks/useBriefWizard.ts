
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BriefQuestion {
  id: string;
  question: string;
  category: string;
  order_in_category: number;
  placeholder?: string;
  help_text?: string;
  field_type: string;
  options?: any;
}

export interface BriefResponse {
  id?: string;
  brief_draft_id: string;
  question_id: string;
  response?: string;
  ai_suggested_response?: string;
  used_suggestion: boolean;
}

export interface BriefDraft {
  id: string;
  client_id: string;
  title?: string;
  current_step: number;
  progress: any;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export function useBriefWizard() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<BriefQuestion[]>([]);
  const [currentDraft, setCurrentDraft] = useState<BriefDraft | null>(null);
  const [responses, setResponses] = useState<BriefResponse[]>([]);
  const [currentCategory, setCurrentCategory] = useState('objectives');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch latest draft if it exists
  useEffect(() => {
    fetchLatestDraft();
  }, []);

  // Load responses when currentDraft changes
  useEffect(() => {
    if (currentDraft) {
      fetchResponses(currentDraft.id);
    }
  }, [currentDraft]);

  // Fetch all questions from the database
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brief_questions')
        .select('*')
        .order('category')
        .order('order_in_category');

      if (error) throw error;
      setQuestions(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching questions",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch the latest in-progress draft for the user
  const fetchLatestDraft = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a brief");
      }

      const { data, error } = await supabase
        .from('brief_drafts')
        .select('*')
        .eq('client_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCurrentDraft(data[0]);
        setCurrentCategory(data[0].progress.currentCategory || 'objectives');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching your draft brief",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch responses for a draft
  const fetchResponses = async (draftId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brief_responses')
        .select('*')
        .eq('brief_draft_id', draftId);

      if (error) throw error;
      setResponses(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching responses",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Start a new brief draft
  const startNewDraft = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a brief");
      }

      const { data, error } = await supabase
        .from('brief_drafts')
        .insert([
          {
            client_id: user.id,
            current_step: 1,
            progress: { currentCategory: 'objectives' },
            completed: false
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCurrentDraft(data[0]);
        setCurrentCategory('objectives');
        setResponses([]);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error creating new brief",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get AI suggestion for a question
  const getAISuggestion = async (questionId: string, question: string) => {
    try {
      const previousResponses = responses.map(r => {
        const q = questions.find(q => q.id === r.question_id);
        return {
          question: q?.question || '',
          response: r.response || ''
        };
      });

      const { data, error } = await supabase.functions.invoke('ai-brief', {
        body: {
          action: 'suggestAnswer',
          data: {
            questionId,
            question,
            previousResponses
          }
        }
      });

      if (error) throw error;
      return data.suggestedAnswer;
    } catch (err: any) {
      toast({
        title: "Error getting AI suggestion",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Save a response to a question
  const saveResponse = async (questionId: string, response: string, usedSuggestion: boolean = false, aiSuggestion?: string) => {
    if (!currentDraft) return;

    try {
      // Check if there's an existing response to update
      const existingResponse = responses.find(r => r.question_id === questionId);
      
      if (existingResponse) {
        const { error } = await supabase
          .from('brief_responses')
          .update({
            response,
            used_suggestion: usedSuggestion,
            ai_suggested_response: aiSuggestion || existingResponse.ai_suggested_response
          })
          .eq('id', existingResponse.id);

        if (error) throw error;
      } else {
        // Create a new response
        const { error } = await supabase
          .from('brief_responses')
          .insert([
            {
              brief_draft_id: currentDraft.id,
              question_id: questionId,
              response,
              used_suggestion: usedSuggestion,
              ai_suggested_response: aiSuggestion
            }
          ]);

        if (error) throw error;
      }

      // Refresh responses
      await fetchResponses(currentDraft.id);
      
      toast({
        title: "Response saved",
        description: "Your answer has been saved successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error saving response",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Move to the next category of questions
  const moveToNextCategory = async () => {
    if (!currentDraft) return;

    try {
      const currentResponses = responses.map(r => ({
        questionId: r.question_id,
        response: r.response || ''
      }));

      const { data, error } = await supabase.functions.invoke('ai-brief', {
        body: {
          action: 'getNextQuestions',
          data: {
            currentCategory,
            currentResponses
          }
        }
      });

      if (error) throw error;
      
      if (data.isComplete) {
        // We've completed all categories
        return completeWizard();
      }

      // Update the current draft with the new category
      const { error: updateError } = await supabase
        .from('brief_drafts')
        .update({
          current_step: currentDraft.current_step + 1,
          progress: {
            ...currentDraft.progress,
            currentCategory: data.nextCategory
          }
        })
        .eq('id', currentDraft.id);

      if (updateError) throw updateError;

      // Update local state
      setCurrentCategory(data.nextCategory);
      await fetchLatestDraft(); // Refresh the draft data
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error moving to next step",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Generate a summary of all responses for the brief
  const generateBriefSummary = async () => {
    if (!currentDraft) return null;

    try {
      const formattedResponses = responses.map(r => {
        const q = questions.find(q => q.id === r.question_id);
        return {
          question: q?.question || '',
          response: r.response || ''
        };
      });

      const { data, error } = await supabase.functions.invoke('ai-brief', {
        body: {
          action: 'generateSummary',
          data: {
            responses: formattedResponses
          }
        }
      });

      if (error) throw error;
      return data.summary;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error generating brief summary",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Complete the wizard and submit the brief
  const completeWizard = async () => {
    if (!currentDraft) return false;

    try {
      const summary = await generateBriefSummary();
      
      if (!summary) {
        throw new Error("Failed to generate brief summary");
      }

      // Mark the draft as completed
      const { error } = await supabase
        .from('brief_drafts')
        .update({
          completed: true,
          progress: {
            ...currentDraft.progress,
            completed: true,
            summary
          }
        })
        .eq('id', currentDraft.id);

      if (error) throw error;

      toast({
        title: "Brief completed",
        description: "Your brief has been successfully completed and is ready for submission.",
      });

      // Refresh the draft to reflect completion
      await fetchLatestDraft();
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error completing brief",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Finalize and submit the brief to the official briefs table
  const submitCompletedBrief = async (title: string, category: string) => {
    if (!currentDraft) return false;

    try {
      const summary = currentDraft.progress.summary;
      
      if (!summary) {
        throw new Error("Brief summary is missing");
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to submit a brief");
      }

      // Extract budget from responses
      const budgetResponse = responses.find(r => {
        const question = questions.find(q => q.id === r.question_id);
        return question?.category === 'budget';
      });

      // Extract timeline/deadline from responses
      const timelineResponse = responses.find(r => {
        const question = questions.find(q => q.id === r.question_id);
        return question?.category === 'timeline';
      });

      // Create a new brief in the client_briefs table
      const { data, error } = await supabase
        .from('client_briefs')
        .insert([
          {
            client_id: user.id,
            title,
            original_description: summary,
            budget: budgetResponse?.response || 'To be determined',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days
            category
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: "Brief submitted successfully",
        description: "Your brief has been submitted and will be reviewed by our team.",
      });

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error submitting brief",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    error,
    questions,
    currentDraft,
    responses,
    currentCategory,
    startNewDraft,
    getAISuggestion,
    saveResponse,
    moveToNextCategory,
    generateBriefSummary,
    completeWizard,
    submitCompletedBrief,
    // Helper methods to get filtered questions
    getCurrentCategoryQuestions: () => questions.filter(q => q.category === currentCategory)
                                          .sort((a, b) => a.order_in_category - b.order_in_category),
    getResponseForQuestion: (questionId: string) => responses.find(r => r.question_id === questionId)
  };
}
