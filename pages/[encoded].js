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
        {/* Background blur */}
        {image && (
          <div
            className="bg-blur"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}

        <div className="card">
          {/* Logo/Gambar */}
          {image && <img src={image} alt={title} className="preview" />}

          {/* Judul */}
          <h1>{title || "Verification Required"}</h1>

          <p>Please check the captcha box to proceed to the destination page. </p>

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
            className={verified ? "btn btn-primary btn-captcha active" : "btn disabled"}
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
          overflow: hidden;
        }

        main {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Muli", sans-serif;
        }

        /* Background blur */
        .bg-blur {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(18px);
          transform: scale(1.1);
          z-index: 0;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.95);
          padding: 25px 20px;
          text-align: center;
          z-index: 1;
        }

        .preview {
          width: 100%;
          max-height: 160px;
          object-fit: cover;
          margin-bottom: 15px;
        }

        h1 {
          font-family: "Montserrat", sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #111;
          margin: 0 0 10px 0;
        }

        p {
          font-size: 14px;
          color: #444;
          margin-bottom: 18px;
        }

        .recaptcha-box {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }

.btn-box-tool {
    padding: 5px;
    font-size: 12px;
    background: transparent;
    color: #97a0b3;
}

 .btn-box-tool,
.btn-box-tool:hover {
    color: #606c84;
}

.btn-box-tool.btn:active {
    box-shadow: none;
}

        .btn.disabled {
          background: #ccc;
          color: #fff;
          cursor: not-allowed;
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
