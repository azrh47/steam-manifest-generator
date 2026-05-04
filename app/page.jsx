export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #00ff88, #0099ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Nerai Manifest Generator
        </h1>
        
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#00ff88'
          }}>
            Discord Bot
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            Generate Steam manifest templates and Lua scripts with real Steam data
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: '#2a2a2a',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#0099ff', marginBottom: '0.5rem' }}>
                Hosted on Render
              </h3>
              <p style={{ margin: '0', color: '#ccc' }}>
                24/7 Discord bot service
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#2a2a2a',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                Status
              </h3>
              <p style={{ margin: '0', color: '#4ade80' }}>
                🟢 Online
              </p>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
              How to Use
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6',
              margin: '0',
              color: '#ccc'
            }}>
              Join Discord and use the command:<br/>
              <code style={{
                backgroundColor: '#1e1e1e',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                color: '#00ff88',
                fontFamily: 'monospace'
              }}>
                /manifest &lt;appid&gt;
              </code>
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://discord.com" 
              target="_blank"
              style={{
                backgroundColor: '#5865f2',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.155-4.155A19.791 19.791 0 0012.172 19.791 19.791 19.791 0 00-4.155 4.155 19.791 19.791 0 004.155 4.155 19.791 19.791 0 004.155-4.155A19.791 19.791 0 0020.317 4.37zM12.172 20.946a19.791 19.791 0 004.155 4.155 19.791 19.791 0 004.155-4.155A19.791 19.791 0 0020.317 4.37zM12.172 3.651a19.791 19.791 0 004.155 4.155 19.791 19.791 0 004.155-4.155 19.791 19.791 0 00-4.155 4.155z"/>
              </svg>
              Join Discord
            </a>
            
            <a 
              href="/api" 
              style={{
                backgroundColor: '#1a1a1a',
                color: '#00ff88',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                border: '1px solid #00ff88'
              }}
            >
              API Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
