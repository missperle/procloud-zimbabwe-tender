
/**
 * Firebase Cloud Function to match freelancers with new job postings
 * using OpenAI to rank the most suitable candidates
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

// Initialize Firebase if not already initialized
try {
  admin.initializeApp();
} catch (error) {
  // App already initialized
}

const db = admin.firestore();

/**
 * This function is triggered when a new job document is created.
 * It finds relevant freelancers and uses AI to match them with the job.
 */
exports.matchProposals = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snap, context) => {
    const job = snap.data();
    const jobId = context.params.jobId;
    
    console.log(`Processing job matching for new job: ${jobId} - ${job.title}`);

    // 1) Gather candidate freelancers (limited to active ones with relevant skills)
    try {
      const usersSnap = await db.collection('users')
        .where('role', '==', 'freelancer')
        .where('status', '==', 'active') // Only consider active freelancers
        .limit(50) // Limit for performance
        .get();
      
      if (usersSnap.empty) {
        console.log('No active freelancers found to match with this job');
        return snap.ref.update({ 
          recommendations: [],
          matchingCompleted: true,
          matchingError: 'No active freelancers found'
        });
      }
      
      const freelancers = usersSnap.docs.map(d => ({
        id: d.id,
        name: d.data().name || 'Unknown',
        skills: d.data().skills || [],
        rating: d.data().rating || 0,
        completedJobs: d.data().completedJobs || 0
      }));
      
      console.log(`Found ${freelancers.length} potential freelancers for matching`);

      // 2) Build a prompt for ranking
      const systemPrompt = `
You are an expert matchmaker for a freelancing platform. Given a job brief and a list of freelancers, rank the top 10 freelancers most suited for this job based on skill match, experience, and rating. Output ONLY a JSON array of freelancer IDs ordered by suitability, like this: ["freelancer1id", "freelancer2id", ...]. Do not include any explanations or other text.
      `;
      
      const userPrompt = `
Job Title: ${job.title}
Description: ${job.description || 'No description provided'}
Required Skills: ${job.skills ? job.skills.join(', ') : 'Not specified'}
Budget: ${job.budget || 'Not specified'}

Freelancers:
${freelancers.map(f => `${f.id}: name=${f.name}; skills=${f.skills.join(',')}; rating=${f.rating}; completed jobs=${f.completedJobs}`).join('\n')}
      `;

      // 3) Call OpenAI with modern SDK
      const openai = new OpenAI({
        apiKey: functions.config().openai.key
      });
      
      let recommendations = [];
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // Using the current up-to-date model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 500
        });
        
        const text = completion.choices[0].message.content.trim();
        console.log(`OpenAI response: ${text}`);
        
        try {
          recommendations = JSON.parse(text).slice(0, 10);
        } catch (parseError) {
          console.error("Error parsing OpenAI response:", parseError);
          recommendations = [];
        }
      } catch (apiError) {
        console.error("Error calling OpenAI API:", apiError);
        return snap.ref.update({ 
          matchingCompleted: true,
          matchingError: 'Failed to rank freelancers: API error'
        });
      }

      // 4) Write back to the job document
      console.log(`Updating job ${jobId} with ${recommendations.length} recommendations`);
      return snap.ref.update({ 
        recommendations,
        matchingCompleted: true,
        matchingTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
    } catch (error) {
      console.error("Error in matchProposals function:", error);
      return snap.ref.update({ 
        matchingCompleted: true,
        matchingError: error.message
      });
    }
  });

// Add OpenAI package to package.json if it's not already there
// yarn add openai@^4.0.0 or npm install openai@^4.0.0
