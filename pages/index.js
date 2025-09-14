export default function Home() {
  return (
    <main style={{
      fontFamily: 'system-ui, Segoe UI, Roboto',
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <h1 style={{
        fontSize: '4rem',
        marginBottom: '16px',
        color: '#333',
        textShadow: '2px 2px #ddd'
      }}>404</h1>
      <p style={{
        fontSize: '1.25rem',
        marginBottom: '24px',
        color: '#555'
      }}>
       Home page is not available
      </p>

    </main>
  );
}


