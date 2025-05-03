
const functions = require('firebase-functions');
const { OpenAI } = require('openai');
const admin = require('firebase-admin');

// Ensure admin is initialized
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

// Callable function to draft a proposal from bullets
exports.draftProposal = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  const { bullets, jobTitle } = data;
  if (!Array.isArray(bullets) || bullets.length === 0 || !jobTitle) {
    throw new functions.https.HttpsError('invalid-argument',
      'Provide jobTitle and at least one bullet point.');
  }

  const openai = new OpenAI({ 
    apiKey: functions.config().openai.key 
  });

  const prompt = `
You are a professional copywriter. Given this job title and bullet-point notes, draft a concise, persuasive proposal in 2–3 paragraphs.

Job Title: ${jobTitle}
Notes:
${bullets.map((b, i) => `${i+1}. ${b}`).join('\n')}
  
Return only the proposal text.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You write clear, client‑focused proposals." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });
    
    const proposal = response.choices[0].message.content.trim();
    return { proposal };
  } catch (err) {
    console.error("DraftProposalError:", err);
    throw new functions.https.HttpsError('internal', 'Proposal drafting failed');
  }
});
