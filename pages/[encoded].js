import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function EncodedPage({ title, image, url, siteKey, defaultRedirect }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
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

        {/* Meta Open Graph biar muncul saat share */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Silakan verifikasi reCAPTCHA untuk melanjutkan." />
      </Head>

      {/* Script reCAPTCHA */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      {/* Tampilan sederhana */}
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-6">
          How To Add Google Recaptcha To Our Website
        </h1>

        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-callback="onRecaptchaSuccess"
        ></div>
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
    // format: Title+ImageUrl+RedirectUrl
    const parts = decoded.split("+");
    title = parts[0] || "";
    image = parts[1] || "";
    url = parts[2] || "";
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
