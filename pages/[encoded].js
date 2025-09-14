import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function EncodedPage({ title, image, url, siteKey }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onRecaptchaSuccess = () => {
        window.location.href = url || process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_URL || "/";
      };
    }
  }, [url]);

  return (
    <>
      <Head>
        <title>{title || "Verifikasi untuk melanjutkan"}</title>
        <meta name="robots" content="noindex" />

        {/* Open Graph untuk share */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Verifikasi untuk melanjutkan ke halaman berikutnya." />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        {/* Script reCAPTCHA */}
        <Script src="https://www.google.com/recaptcha/api.js" async defer />

        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}

          {title && (
            <h1 className="text-xl font-semibold text-gray-800 mb-4">{title}</h1>
          )}

          <p className="text-sm text-gray-600 mb-3">
            Silakan centang kotak di bawah untuk melanjutkan
          </p>

          <div
            className="g-recaptcha flex justify-center"
            data-sitekey={siteKey}
            data-callback="onRecaptchaSuccess"
          ></div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  let title = "";
  let image = "";
  let url = "";

  try {
    const decoded = Buffer.from(params.encoded, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    title = parsed.title || "";
    image = parsed.image || "";
    url = parsed.url || "";
  } catch (err) {
    console.error("Decode error:", err);
  }

  return {
    props: {
      title,
      image,
      url,
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
    },
  };
}
