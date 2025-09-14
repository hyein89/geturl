import { useRouter } from 'next/router';
s.src = `https://www.google.com/recaptcha/api.js`;
s.id = 'recaptcha-script';
s.async = true;
s.defer = true;
document.body.appendChild(s);
}
}, [siteKey]);


const submitToken = async (e) => {
e.preventDefault();
setError('');
setLoading(true);


// ambil token dari grecaptcha
const tokenValue = window.grecaptcha && window.grecaptcha.getResponse && window.grecaptcha.getResponse();
if (!tokenValue) {
setError('Silakan centang reCAPTCHA terlebih dahulu.');
setLoading(false);
return;
}


const body = { token: tokenValue, encoded };
const res = await fetch('/api/verify', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body)
});


const data = await res.json();
setLoading(false);
if (res.ok && data.redirectTo) {
window.location.href = data.redirectTo;
} else {
setError(data.message || 'Verifikasi gagal.');
// reset grecaptcha
if (window.grecaptcha && window.grecaptcha.reset) window.grecaptcha.reset();
}
};


return (
<main style={{fontFamily:'system-ui,Segoe UI,Roboto',display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
<h2>Verifikasi untuk melanjutkan</h2>
<form onSubmit={submitToken}>
<div className="g-recaptcha" data-sitekey={siteKey}></div>
<div style={{marginTop:12,display:'flex',justifyContent:'center'}}>
<button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Lanjutkan'}</button>
</div>
</form>
{error && <p style={{color:'crimson'}}>{error}</p>}
</main>
);
}


export async function getServerSideProps(context) {
// ambil site key dari env
return {
props: {
siteKey: process.env.RECAPTCHA_SITE_KEY || ''
}
};
}
