import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function EncodedPage({ title, image, url, siteKey, defaultRedirect }) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onRecaptchaSuccess = () => {
        setVerified(true); // aktifkan tombol
      };
    }
  }, []);

  const handleContinue = () => {
    window.location.href = url || defaultRedirect || "/";
  };

  return (
    <>
      <Head>
        <title>{title || "Verification Page"}</title>
        <meta name="robots" content="noindex" />

        {/* Google Fonts */}
        <link
          href="//fonts.googleapis.com/css?family=Montserrat:400,700%7CMuli:300,300i,400"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link
          href="https://skidrowtorrentgame.com/wp-content/uploads/2023/01/425.png"
          type="image/x-icon"
          rel="icon"
        />

        {/* Meta OG biar tampil saat share */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
      </Head>

      {/* Script reCAPTCHA */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <main>
        <div className="container">
          {/* Gambar di atas */}
          {image && <img src={image} alt={title} className="preview" />}

          {/* Judul */}
          <h1>{title || "Verification Required"}</h1>

          {/* Instruksi */}
          <p>Please check the captcha box to proceed to the destination page.</p>

          {/* reCAPTCHA box */}
          <div
            className="g-recaptcha recaptcha-box"
            data-sitekey={siteKey}
            data-callback="onRecaptchaSuccess"
          ></div>

          {/* Tombol Continue */}
          <button
            onClick={handleContinue}
            disabled={!verified}
            className={verified ? "btn active" : "btn disabled"}
          >
            Click here to continue
          </button>
        </div>
      </main>

      <style jsx>{`
        main {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #fff;
          font-family: "Muli", sans-serif;
          padding: 20px;
        }
        .container {
          width: 100%;
          max-width: 420px;
          text-align: center;
        }
        .preview {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          margin-bottom: 20px;
        }
        h1 {
          font-family: "Montserrat", sans-serif;
          font-weight: 700;
          font-size: 20px;
          margin-bottom: 10px;
          color: #222;
        }
        p {
          font-size: 14px;
          color: #555;
          margin-bottom: 20px;
        }
        .recaptcha-box {
          display: flex;
          justify-content: center;
          margin: 0 auto 20px auto;
          width: 100%;
        }
        .btn {
          display: block;
          width: 100%;
          padding: 12px 18px;
          border: none;
          font-size: 15px;
          font-weight: bold;
          background: #ccc;
          color: #fff;
          cursor: not-allowed;
        }
        .btn.active {
          background: #3b82f6;
          cursor: pointer;
        }
        .btn.active:hover {
          background: #2563eb;
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
