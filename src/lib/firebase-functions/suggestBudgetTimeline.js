
const functions = require('firebase-functions');
const { OpenAI } = require('openai');

// Callable function to suggest budget & timeline
exports.suggestBudgetTimeline = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { title, description } = data;
  if (!title || !description) {
    throw new functions.https.HttpsError('invalid-argument',
      'Please provide both title and description');
  }

  // Init OpenAI with the latest SDK
  const openai = new OpenAI({
    apiKey: functions.config().openai.key
  });

  const prompt = `
You are a project estimator. Given a project brief title and description, suggest:
1. A realistic budget range in USD (low–high).
2. A realistic timeline in days.
Return JSON like:
{"budget": "100–200", "timeline": "7–10 days"}.
Project:
Title: ${title}
Description: ${description}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You provide concise budget & timeline estimates." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 100
    });
    
    const text = response.choices[0].message.content.trim();
    // parse JSON
    const result = JSON.parse(text);
    return { budget: result.budget, timeline: result.timeline };
  } catch (err) {
    console.error("BudgetEstimateError:", err);
    throw new functions.https.HttpsError('internal', 'Estimate generation failed');
  }
});
