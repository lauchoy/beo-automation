import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?error=${error}&error_description=${errorDescription}`, request.url)
    );
  }

  // Validate authorization code
  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(code);

    // TODO: Store tokenData in your database
    // Example: await saveTokenToDatabase(tokenData);
    
    console.log('OAuth successful! Token data:', {
      access_token: tokenData.access_token?.substring(0, 10) + '...',
      refresh_token: tokenData.refresh_token?.substring(0, 10) + '...',
      expires_in: tokenData.expires_in,
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/?success=true', request.url)
    );
  } catch (err) {
    console.error('Token exchange failed:', err);
    return NextResponse.redirect(
      new URL('/?error=token_exchange_failed', request.url)
    );
  }
}
