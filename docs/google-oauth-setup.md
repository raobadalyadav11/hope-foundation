# Google OAuth Setup Guide

## Error: redirect_uri_mismatch

If you're seeing the error "redirect_uri_mismatch" when trying to sign in with Google, it means the redirect URI configured in your Google Cloud Console doesn't match the one your application is using.

## How to Fix

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Click on the OAuth 2.0 Client ID you're using for this application
4. Under "Authorized redirect URIs", add the following URLs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click "Save"

## Complete Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000` (for local development)
   - `https://yourdomain.com` (for production)
8. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
9. Click "Create"
10. Copy the generated Client ID and Client Secret
11. Add them to your `.env.local` file:
    ```
    GOOGLE_CLIENT_ID=your-client-id
    GOOGLE_CLIENT_SECRET=your-client-secret
    ```

## Testing

After making these changes:
1. Restart your development server
2. Try signing in with Google again
3. The redirect should work correctly now

## Common Issues

- Make sure there are no typos in your redirect URIs
- Ensure your application is using the correct NEXTAUTH_URL
- If using a custom domain, make sure it's properly configured
- Changes in Google Cloud Console may take a few minutes to propagate