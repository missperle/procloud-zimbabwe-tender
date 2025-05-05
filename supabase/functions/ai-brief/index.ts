
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface RequestData {
  prompt: string;
  briefDraftId?: string;
  questionId?: string;
  category?: string;
}

serve(async (req) => {
  try {
    // Get the request body
    const requestData: RequestData = await req.json();
    const { prompt, briefDraftId, questionId, category } = requestData;

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // For now, we're mocking the AI response
    // In a real implementation, this would call OpenAI or a similar service
    const aiSuggestions = {
      "design": [
        "A minimalist logo design featuring geometric shapes with a focus on simplicity and scalability.",
        "A vibrant and colorful brand identity that appeals to a younger demographic.",
        "A professional corporate branding package including logo, business cards, and letterhead."
      ],
      "development": [
        "A responsive website with modern UI/UX design principles and optimized for mobile devices.",
        "A cross-platform mobile application with user authentication and data synchronization.",
        "An e-commerce solution with secure payment processing and inventory management."
      ],
      "marketing": [
        "A comprehensive social media campaign targeting Instagram and TikTok users aged 18-25.",
        "A content marketing strategy focused on building thought leadership in your industry.",
        "An email marketing sequence designed to convert leads into customers."
      ],
      "writing": [
        "A persuasive product description highlighting key features and benefits.",
        "A comprehensive blog post exploring industry trends and positioning your brand as an expert.",
        "An engaging website copy that clearly communicates your value proposition."
      ]
    };

    let suggestion = "Based on your requirements, I'd recommend focusing on creating a detailed brief that includes specific deliverables, timeline expectations, and visual examples of styles you like.";

    // Select a suggestion based on the category if available
    if (category && aiSuggestions[category as keyof typeof aiSuggestions]) {
      const categorySuggestions = aiSuggestions[category as keyof typeof aiSuggestions];
      suggestion = categorySuggestions[Math.floor(Math.random() * categorySuggestions.length)];
    }

    // If a briefDraftId and questionId are provided, store the suggestion in the database
    if (briefDraftId && questionId) {
      const { data, error } = await supabase
        .from('brief_responses')
        .upsert({
          brief_draft_id: briefDraftId,
          question_id: questionId,
          ai_suggested_response: suggestion
        }, {
          onConflict: 'brief_draft_id,question_id'
        });

      if (error) {
        console.error("Error storing suggestion:", error);
        return new Response(
          JSON.stringify({ error: "Failed to store suggestion" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Return the AI suggestion
    return new Response(
      JSON.stringify({ suggestion }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
