import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function EncodedPage({ siteKey, title, image, url }) {
  const router = useRouter();

  // inject callback global untuk reCAPTCHA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onRecaptchaSuccess = async (token) => {
        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, encoded: router.query.encoded }),
          });
          const data = await res.json();
          if (res.ok && data.redirectTo) {
            window.location.href = data.redirectTo;
          } else {
            alert(data.message || 'Verifikasi gagal.');
            if (window.grecaptcha && window.grecaptcha.reset) {
              window.grecaptcha.reset();
            }
          }
        } catch (err) {
          alert('Terjadi kesalahan koneksi.');
        }
      };
    }
  }, [router.query.encoded]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      {/* reCAPTCHA script */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 flex flex-col items-center text-center">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        )}
        {title && <h1 className="text-xl font-bold mb-4">{title}</h1>}

        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-callback="onRecaptchaSuccess"
        ></div>

        <p className="text-sm text-gray-500 mt-4">
          Centang kotak di atas untuk melanjutkan ke halaman penawaran.
        </p>
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  let title = '';
  let image = '';
  let url = '';

  try {
    const decoded = Buffer.from(params.encoded, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    title = parsed.title || '';
    image = parsed.image || '';
    url = parsed.url || '';
  } catch (err) {
    console.error('Decode error:', err);
  }

  return {
    props: {
      siteKey: process.env.RECAPTCHA_SITE_KEY || '',
      title,
      image,
      url,
    },
  };
}
