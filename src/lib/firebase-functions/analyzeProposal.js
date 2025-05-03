
// Firebase Cloud Function for Proposal Analysis
// This would be deployed to Firebase Functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require('openai');
// admin.initializeApp() is not needed here as it's initialized in the main index.js

exports.analyzeProposal = functions.firestore
  .document('proposals/{proposalId}')
  .onCreate(async (snap, context) => {
    const proposal = snap.data();
    const text = proposal.message || proposal.proposalText || '';
    if (!text) return null;

    // Build LLM prompt
    const systemMsg = {
      role: "system",
      content: "You are a helpful assistant that scores proposal quality. " +
               "Output JSON with two keys: clarity (0.0–1.0) and enthusiasm (0.0–1.0)."
    };
    const userMsg = {
      role: "user",
      content: `Please analyze this proposal text and return JSON like:
{"clarity":0.85,"enthusiasm":0.70}
Text:
"""${text}"""`
    };

    try {
      // Initialize OpenAI
      const config = new Configuration({ apiKey: functions.config().openai.key });
      const openai = new OpenAIApi(config);
      
      const resp = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [systemMsg, userMsg],
        temperature: 0.0,
        max_tokens: 40
      });
      
      const content = resp.data.choices[0].message.content.trim();
      const parsed = JSON.parse(content);
      
      const scores = {
        clarity: Math.min(1, Math.max(0, parsed.clarity || 0)),
        enthusiasm: Math.min(1, Math.max(0, parsed.enthusiasm || 0))
      };
      
      // Write back to Firestore
      return snap.ref.update({ sentiment: scores });
    } catch (e) {
      console.error("Sentiment analysis error:", e);
      return null;
    }
  });
