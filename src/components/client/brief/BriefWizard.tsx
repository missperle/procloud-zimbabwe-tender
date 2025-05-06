
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import BriefWizardProgress from './BriefWizardProgress';
import QuestionsSection from './QuestionsSection';
import BriefSummary from './BriefSummary';
import { useBriefWizardState } from './useBriefWizardState';

const BriefWizard = () => {
  const navigate = useNavigate();
  
  const {
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
  } = useBriefWizardState();

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
          
          <QuestionsSection
            questions={currentQuestions}
            responses={responses}
            suggestions={suggestions}
            isLoadingSuggestions={isLoadingSuggestions}
            onResponseChange={handleResponseChange}
            onSaveResponse={handleSaveResponse}
            onUseSuggestion={handleUseSuggestion}
          />
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
          <BriefSummary 
            briefTitle={briefTitle}
            briefCategory={briefCategory}
            briefSummary={briefSummary}
            isSubmitting={isSubmitting}
            onTitleChange={setBriefTitle}
            onCategoryChange={setBriefCategory}
            onSubmit={handleSubmitBrief}
            onClose={() => setShowSummary(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BriefWizard;
