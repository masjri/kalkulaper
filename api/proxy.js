// File: /api/proxy.js

export default async function handler(request, response) {
  // 1. Ambil kunci API dari Environment Variable yang sudah Anda simpan di Vercel
  // Kode ini memanggil "nama panggilan" dari brankas API key Anda di Vercel.
  const apiKeys = (process.env.GEMINI_API_KEYS || '').split(',');
  
  if (!apiKeys || apiKeys.length === 0 || apiKeys[0] === '') {
    return response.status(500).json({ error: 'API keys tidak dikonfigurasi dengan benar di Vercel.' });
  }

  // Ambil satu kunci secara acak untuk setiap permintaan agar tidak membebani satu kunci saja.
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  // 2. Ambil data asli (payload) dari aplikasi KalkuLaper
  const payload = request.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    // 3. Teruskan permintaan ke Google AI menggunakan kunci rahasia dari server
    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Jika Google merespons dengan error, teruskan error tersebut
    if (!googleResponse.ok) {
      const errorBody = await googleResponse.text();
      console.error('Google API Error:', errorBody);
      return response.status(googleResponse.status).json({ error: `Error dari Google API: ${googleResponse.statusText}` });
    }

    const data = await googleResponse.json();
    
    // 4. Kirim kembali hasilnya ke aplikasi KalkuLaper Anda
    return response.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ error: 'Terjadi kesalahan di server perantara.' });
  }
}
