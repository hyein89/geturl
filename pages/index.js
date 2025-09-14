import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [dots, setDots] = useState("");

  // Animasi titik-titik setelah pesan
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>404 — Page Not Found</title>
        <link rel="icon" href="/icons/425.png" type="image/png" />
        <meta name="description" content="The home page is not available." />
      </Head>

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
          fontSize: '5rem',
          marginBottom: '16px',
          color: '#333',
          textShadow: '2px 2px #ddd',
          animation: 'pulse 1.5s infinite'
        }}>404</h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '24px',
          color: '#555',
          animation: 'fadeIn 2s infinite alternate'
        }}>
          Home page is not available{dots}
        </p>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
