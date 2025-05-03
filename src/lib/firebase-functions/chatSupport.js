
// Firebase Cloud Function for Chat Support
// This would be deployed to Firebase Functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require('openai');
// admin.initializeApp() is not needed here as it's initialized in the main index.js

exports.chatSupport = functions.https.onCall(async (data, context) => {
  // (Optional) require login
  // if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

  const message = data.message;
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Message must be non-empty');
  }

  // Initialize OpenAI
  const config = new Configuration({ apiKey: functions.config().openai.key });
  const openai = new OpenAIApi(config);

  // Build conversation context (you could persist prior messages)
  const systemMsg = {
    role: "system",
    content: "You are Proverb Digital's AI help assistant. Answer user questions clearly and concisely about using the platform."
  };
  const userMsg = { role: "user", content: message };

  try {
    const resp = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [systemMsg, userMsg],
      temperature: 0.7,
      max_tokens: 300
    });
    const reply = resp.data.choices[0].message.content.trim();
    return { reply };
  } catch (err) {
    console.error("ChatSupportError:", err);
    throw new functions.https.HttpsError('internal', 'Chat service failed');
  }
});
