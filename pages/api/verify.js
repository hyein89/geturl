import fetch from 'node-fetch';
import { decode } from '../../utils/encode';


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });


const { token, encoded } = req.body || {};
if (!token || !encoded) return res.status(400).json({ message: 'Missing token or encoded parameter' });


const secret = process.env.RECAPTCHA_SECRET_KEY;
if (!secret) return res.status(500).json({ message: 'Server recaptcha secret not set' });


// verifikasi ke Google
const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`;
try {
const r = await fetch(verifyUrl, { method: 'POST' });
const json = await r.json();
if (!json.success) return res.status(403).json({ message: 'reCAPTCHA verification failed' });


// decode payload
let decoded;
try {
decoded = decode(String(encoded));
} catch (e) {
return res.status(400).json({ message: 'Invalid encoded parameter' });
}


// format yang diharapkan: title+url_image
const parts = decoded.split('+');
const title = parts.shift();
const url = parts.join('+');


// validasi URL dasar
try {
const parsed = new URL(url);
// opsional: batasi domain, dll.
} catch (e) {
return res.status(400).json({ message: 'Invalid URL in payload' });
}


// redirect (client-side akan menerima redirectTo di JSON)
return res.status(200).json({ redirectTo: url, title });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error verifying reCAPTCHA' });
}
}
