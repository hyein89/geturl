import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function EncodedPage({ title, image, url }) {
  const router = useRouter();

  useEffect(() => {
    // callback global reCAPTCHA v2
    if (typeof window !== 'undefined') {
      window.onRecaptchaSuccess = () => {
        // sukses → langsung redirect
        window.location.href = url || '/';
      };
    }
  }, [url]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      {/* load script reCAPTCHA */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <div className="bg-white rounded-2xl shadow-md max-w-md w-full p-6 text-center">
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
          data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          data-callback="onRecaptchaSuccess"
        ></div>

        <p className="text-sm text-gray-500 mt-4">
          Centang kotak di atas untuk melanjutkan.
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
    props: { title, image, url },
  };
}
