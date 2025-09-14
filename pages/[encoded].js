import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function EncodedPage({ title, image, url, siteKey, defaultRedirect }) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onRecaptchaSuccess = () => {
        setVerified(true);
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
        <link href="/icons/425.png" type="image/x-icon" rel="icon" />

        {/* Meta OG */}
        {title && <meta property="og:title" content={title} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="website" />
      </Head>

      {/* reCAPTCHA Script */}
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <main>
        {/* Background blur pakai image */}
        {image && (
          <div
            className="bg-blur"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}

        <div className="container">
          {/* Gambar utama */}
          {image && <img src={image} alt={title} className="preview" />}

          {/* Judul */}
          <h1>{title || "Verification Required"}</h1>

          {/* Instruksi */}
          <p>Please check the captcha box to proceed to the destination page.</p>

          {/* reCAPTCHA */}
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
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden; /* hilangkan scroll */
        }

        main {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Muli", sans-serif;
          padding: 20px;
          overflow: hidden;
        }

        /* Background blur */
        .bg-blur {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(15px);
          transform: scale(1.1);
          z-index: 0;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 400px;
          text-align: center;
          z-index: 1;
          background: rgba(255, 255, 255, 0.9);
          padding: 20px;
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
          color: #111;
        }

        p {
          font-size: 14px;
          color: #333;
          margin-bottom: 20px;
        }

        .recaptcha-box {
          display: flex;
          justify-content: center;
          margin: 0 auto 15px auto;
          width: 100%;
        }

        .btn {
          display: block;
          width: 100%;
          padding: 12px 18px;
          font-size: 15px;
          font-weight: bold;
          background: #ccc;
          color: #fff;
          cursor: not-allowed;
          font-family: "Montserrat", sans-serif;
          border-radius: 6px;
          border: none;
          transition: background 0.3s;
        }

        .btn.active {
          background: #22c55e; /* green */
          cursor: pointer;
        }

        .btn.active:hover {
          background: #16a34a; /* darker green */
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
    const parts = decoded.split("+"); // format: Title+ImageUrl+RedirectUrl
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
