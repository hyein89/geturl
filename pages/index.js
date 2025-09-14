import { useEffect, useState } from 'react';

export default function Home() {
  const [dots, setDots] = useState('');

  // Animasi titik-titik loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
        Halaman utama tidak tersedia{dots}
      </p>
      <a href="/dashboard" style={{
        textDecoration: 'none',
        padding: '12px 24px',
        backgroundColor: '#4f46e5',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: '0.3s'
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = '#3730a3'}
      onMouseOut={e => e.currentTarget.style.backgroundColor = '#4f46e5'}>
        Kembali ke Dashboard
      </a>
    </main>
  );
}

export async function getServerSideProps() {
  return {
    notFound: true
  };
}

