
const functions = require('firebase-functions');
const { Configuration, OpenAIApi } = require('openai');

exports.generateImages = functions.https.onCall(async (data, context) => {
  // 1) Auth check (optional)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  // 2) Read the prompt
  const prompt = data.prompt;
  if (typeof prompt !== 'string' || prompt.length < 5) {
    throw new functions.https.HttpsError('invalid-argument', 'Prompt must be at least 5 characters');
  }

  // 3) Init OpenAI client
  const config = new Configuration({ apiKey: functions.config().openai.key });
  const openai = new OpenAIApi(config);

  // 4) Call Image API
  try {
    const resp = await openai.createImage({
      prompt,
      n: 4,
      size: "512x512",
      response_format: "url"
    });
    // 5) Extract URLs
    const urls = resp.data.data.map(item => item.url);
    return { images: urls };
  } catch (err) {
    console.error("OpenAI error:", err);
    throw new functions.https.HttpsError('internal', 'Image generation failed');
  }
});
