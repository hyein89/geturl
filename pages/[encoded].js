import Script from 'next/script';

export default function EncodedPage({ siteKey }) {
  return (
    <main style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Script src="https://www.google.com/recaptcha/api.js" async defer />
      <h2>Verifikasi untuk melanjutkan</h2>
      <form>
        <div className="g-recaptcha" data-sitekey={siteKey}></div>
        <button type="submit" style={{ marginTop: 12 }}>Lanjutkan</button>
      </form>
    </main>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    },
  };
}
