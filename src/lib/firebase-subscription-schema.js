
/**
 * Firestore Schema for Subscriptions
 * 
 * This file describes the Firestore schema for the subscription system.
 * It's not meant to be imported or executed, but serves as documentation.
 */

/**
 * Collection: subscriptions
 * Description: Stores user subscription information
 * 
 * Document ID: Auto-generated
 * Fields:
 *   - userId: string (reference to auth.users)
 *   - tier: string ('free', 'basic', 'pro')
 *   - status: string ('active', 'canceled', 'past_due', 'pending')
 *   - stripeCustomerId: string (optional, Stripe customer ID)
 *   - stripeSubscriptionId: string (optional, Stripe subscription ID)
 *   - currentPeriodStart: timestamp
 *   - currentPeriodEnd: timestamp
 *   - cancelAtPeriodEnd: boolean
 *   - paymentMethod: string ('card', 'cash', null)
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 */

/**
 * Collection: paymentHistory
 * Description: Tracks payment history for subscription renewals and one-time purchases
 * 
 * Document ID: Auto-generated
 * Fields:
 *   - userId: string (reference to auth.users)
 *   - subscriptionId: string (reference to subscriptions collection, optional)
 *   - amount: number
 *   - currency: string (default: 'usd')
 *   - status: string ('succeeded', 'pending', 'failed')
 *   - paymentMethod: string ('stripe', 'ecocash', 'zipit', 'innbucks', 'mukuru')
 *   - paymentMethodDetails: object (payment provider specific details)
 *   - createdAt: timestamp
 */

/**
 * Collection: featureUsage
 * Description: Tracks usage of AI features by each user
 * 
 * Document ID: Auto-generated
 * Fields:
 *   - userId: string (reference to auth.users)
 *   - feature: string ('brief-builder', 'image-generation', etc.)
 *   - count: number (number of times used)
 *   - lastUsed: timestamp
 *   - createdAt: timestamp
 */

/**
 * Firestore Security Rules for Subscriptions
 */
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Subscription rules
    match /subscriptions/{subId} {
      allow create: if request.auth.uid == request.resource.data.userId;
      allow read, update: if request.auth.uid == resource.data.userId
                          || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow delete: if false;
    }
    
    // Payment history rules
    match /paymentHistory/{paymentId} {
      // Users can read their own payment history
      allow read: if request.auth != null && 
                  request.auth.uid == resource.data.userId;
      
      // Only admin or system can write payment history
      allow write: if request.auth != null && 
                  (request.auth.token.admin == true || request.auth.token.isSystem == true);
    }
    
    // Feature usage rules
    match /featureUsage/{usageId} {
      // Users can read their own feature usage
      allow read: if request.auth != null && 
                  request.auth.uid == resource.data.userId;
      
      // System can write feature usage
      allow write: if request.auth != null && 
                  (request.auth.token.admin == true || request.auth.token.isSystem == true);
      
      // Users can increment their own usage count
      allow update: if request.auth != null && 
                    request.auth.uid == resource.data.userId &&
                    request.resource.data.count == resource.data.count + 1 &&
                    request.resource.data.lastUsed == request.time &&
                    request.resource.data.userId == resource.data.userId &&
                    request.resource.data.feature == resource.data.feature;
    }
  }
}
*/

