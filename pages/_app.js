// pages/_app.js
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Histats */}
      <Script id="histats-script" strategy="afterInteractive">
        {`
          var _Hasync= _Hasync|| [];
          _Hasync.push(['Histats.start', '1,4828760,4,0,0,0,00000000']);
          _Hasync.push(['Histats.fasi', '1']);
          _Hasync.push(['Histats.track_hits', '']);
          (function() {
            var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
            hs.src = ('//s10.histats.com/js15_as.js');
            (document.head || document.body).appendChild(hs);
          })();
        `}
      </Script>

      {/* Noscript fallback */}
      <noscript>
        <a href="/" target="_blank">
          <img
            src="//sstatic1.histats.com/0.gif?4828760&101"
            alt="web stats"
            border="0"
          />
        </a>
      </noscript>

      <Component {...pageProps} />
    </>
  );
}
