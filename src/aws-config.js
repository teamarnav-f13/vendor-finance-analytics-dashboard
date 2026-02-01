/**
 * AWS Amplify Configuration
 * This file configures Amplify to connect to your existing Cognito User Pool
 * 
 * IMPORTANT: Replace the placeholder values with your actual AWS resources
 */

const awsConfig = {
    Auth: {
      Cognito: {
        // Your Cognito User Pool ID (format: us-east-1_xxxxxxxxx)
        userPoolId: 'ap-south-1_9lv5KD19a',
        
        // Your Cognito App Client ID (found in App Integration tab)
        userPoolClientId: '55o0129n1ekjff9nv0564vk5rj',
        
        // AWS Region where your User Pool exists
        region: 'ap-south-1',
        
        // Login mechanisms - allows both username and email
        loginWith: {
          email: true,
          username: true
        },
        
        // User attributes you want to collect during sign-up
        signUpAttributes: ['email'],
        
        // Password policy (should match your Cognito settings)
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true
        }
      }
    }
  };
  
  export default awsConfig;
  
  /**
   * HOW TO GET THESE VALUES:
   * 
   * 1. userPoolId:
   *    - AWS Console → Cognito → User Pools → Click your pool
   *    - Copy "User Pool ID" from the overview
   * 
   * 2. userPoolClientId:
   *    - Same User Pool → App Integration tab → App clients
   *    - Copy "Client ID" from your SPA client
   * 
   * 3. region:
   *    - Check the region dropdown in AWS Console (e.g., us-east-1, eu-west-1)
   */