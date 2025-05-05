
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case 'suggestAnswer':
        return await suggestAnswer(data);
      case 'generateSummary':
        return await generateSummary(data);
      case 'getNextQuestions':
        return await getNextQuestions(data);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in ai-brief function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function suggestAnswer(data: { questionId: string; question: string; previousResponses: Array<{ question: string; response: string }> }) {
  const { questionId, question, previousResponses } = data;
  
  // In a real implementation, we would call an LLM API like OpenAI
  // For demonstration, we'll return simulated suggestions
  const suggestions = {
    'objectives': 'To create a modern, responsive website that showcases our products and drives online sales.',
    'audience': 'Small business owners and entrepreneurs aged 30-45 who are looking to improve their digital presence.',
    'timeline': 'We need this completed within 4 weeks from the project start date.',
    'budget': '$2,000 - $3,500',
    'deliverables': 'A fully responsive website with 5-7 pages, including home, about, products, contact, and blog pages.',
    'skills': 'Web design, UI/UX expertise, and experience with e-commerce functionality.',
    'references': 'We like the clean design of www.example.com and the user experience of www.anotherexample.com.',
    'brand': 'Our brand voice is professional but approachable, using clear language without technical jargon.'
  };

  // Extract the category from the question
  const category = question.toLowerCase().includes('objective') ? 'objectives' :
                   question.toLowerCase().includes('audience') ? 'audience' :
                   question.toLowerCase().includes('timeline') ? 'timeline' :
                   question.toLowerCase().includes('budget') ? 'budget' :
                   question.toLowerCase().includes('deliverables') ? 'deliverables' :
                   question.toLowerCase().includes('skills') ? 'skills' :
                   question.toLowerCase().includes('examples') ? 'references' :
                   question.toLowerCase().includes('brand') ? 'brand' : 'general';

  const suggestedAnswer = suggestions[category as keyof typeof suggestions] || 
    'I suggest providing specific details here to help creators understand your needs better.';

  return new Response(
    JSON.stringify({ 
      questionId, 
      suggestedAnswer 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateSummary(data: { responses: Array<{ question: string; response: string }> }) {
  const { responses } = data;

  // Simulate creating a cohesive brief summary from all the responses
  // In a real implementation, this would use an LLM to create a well-structured brief
  
  let summary = "Project Brief Summary:\n\n";
  
  responses.forEach(item => {
    summary += `${item.question}:\n${item.response}\n\n`;
  });
  
  summary += "This project requires a skilled professional who can deliver high-quality work within the specified timeframe and budget.";

  return new Response(
    JSON.stringify({ summary }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getNextQuestions(data: { currentCategory: string; currentResponses: Array<{ questionId: string; response: string }> }) {
  const { currentCategory, currentResponses } = data;

  // This would typically involve some logic based on previous answers
  // For demonstration, we'll use a simple predefined flow
  const categories = ['objectives', 'audience', 'timeline', 'budget', 'deliverables', 'skills', 'references', 'brand'];
  
  const currentIndex = categories.indexOf(currentCategory);
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;
  
  return new Response(
    JSON.stringify({ 
      nextCategory,
      isComplete: nextCategory === null
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
