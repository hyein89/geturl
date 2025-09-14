import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function EncodedPage({ title, image, url, siteKey, defaultRedirect }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // callback global untuk reCAPTCHA
      window.onRecaptchaSuccess = () => {
        window.location.href = url || defaultRedirect || "/";
      };
    }
  }, [url, defaultRedirect]);

  return (
    <>
      <Head>
        <title>{title || "Verifikasi reCAPTCHA"}</title>
        <meta name="robots" content="noindex" />

        {/* Open Graph untuk share */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Silakan verifikasi reCAPTCHA untuk melanjutkan."
        />
      </Head>

      {/* load script reCAPTCHA */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
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
            Centang kotak di bawah untuk melanjutkan
          </p>

          <div
            className="g-recaptcha"
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
    // Format: Title+ImageUrl+RedirectUrl
    const parts = decoded.split("+");
    title = parts[0] || "";
    image = parts[1] || "";
    url   = parts[2] || "";
  } catch (err) {
    console.error("Decode error:", err);
  }

  return {
    props: {
      title,
      image,
      url,
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
      defaultRedirect: process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_URL || "",
    },
  };
}
