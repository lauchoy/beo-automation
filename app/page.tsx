export default function Home() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const airtableClientId = process.env.AIRTABLE_CLIENT_ID;
  
  const airtableAuthUrl = airtableClientId
    ? `https://airtable.com/oauth2/v1/authorize?client_id=${airtableClientId}&redirect_uri=${appUrl}/api/auth/airtable/callback&response_type=code&scope=data.records:read data.records:write schema.bases:read`
    : null;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>BEO Automation</h1>
      <p>Business Entity Operations Automation System</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Status</h2>
        <p>✅ Next.js application is running</p>
        <p>✅ OAuth callback endpoint configured</p>
        
        {airtableAuthUrl ? (
          <div style={{ marginTop: '1rem' }}>
            <a 
              href={airtableAuthUrl}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0070f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              Connect to Airtable
            </a>
          </div>
        ) : (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <p>⚠️ Airtable OAuth not configured. Set AIRTABLE_CLIENT_ID in your environment variables.</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Next Steps</h2>
        <ol>
          <li>Configure Airtable OAuth credentials in .env.local</li>
          <li>Register OAuth callback URL in Airtable: <code>{appUrl}/api/auth/airtable/callback</code></li>
          <li>Test the OAuth flow by clicking "Connect to Airtable"</li>
        </ol>
      </div>
    </div>
  );
}
