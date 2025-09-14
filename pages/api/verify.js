export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, encoded } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token reCAPTCHA tidak ada' });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ message: 'Verifikasi reCAPTCHA gagal' });
    }

    // decode dari base64 ke JSON
    let redirectTo = '/';
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);
      if (parsed.url) {
        redirectTo = parsed.url;
      }
    } catch (err) {
      console.error('Gagal decode:', err);
    }

    return res.status(200).json({ redirectTo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
