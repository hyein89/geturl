import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EncodedPage({ siteKey }) {
  const router = useRouter();
  const { encoded } = router.query || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!siteKey) return;
    // load reCAPTCHA script hanya sekali
    if (!document.querySelector('#recaptcha-script')) {
      const s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js';
      s.id = 'recaptcha-script';
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [siteKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ambil token dari widget reCAPTCHA
    const token =
      window.grecaptcha &&
      window.grecaptcha.getResponse &&
      window.grecaptcha.getResponse();

    if (!token) {
      setError('Silakan centang reCAPTCHA terlebih dahulu.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, encoded }),
      });

      const data = await res.json();
      if (res.ok && data.redirectTo) {
        window.location.href = data.redirectTo;
      } else {
        setError(data.message || 'Verifikasi gagal.');
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        fontFamily: 'system-ui,Segoe UI,Roboto',
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <h2>Verifikasi untuk melanjutkan</h2>
      <form onSubmit={handleSubmit}>
        <div className="g-recaptcha" data-sitekey={siteKey}></div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </main>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    },
  };
}
