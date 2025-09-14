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
        {/* Meta Open Graph biar tampil saat share */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Silakan verifikasi reCAPTCHA untuk melanjutkan."
        />
      </Head>

      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <main>
        <h1>
          {title || "How To Add Google Recaptcha To Our Website"}
        </h1>

        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-callback="onRecaptchaSuccess"
        ></div>

        <p className="note">Centang kotak di atas untuk melanjutkan</p>
      </main>

      <style jsx>{`
        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #fff;
          padding: 20px;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          font-weight: bold;
          color: #1a56db; /* biru */
          margin-bottom: 30px;
        }
        @media (min-width: 768px) {
          h1 {
            font-size: 32px;
          }
        }
        .note {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }
      `}</style>
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
