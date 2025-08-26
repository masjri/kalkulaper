// File: /api/proxy.js (Mode Interogasi)

export default async function handler(request, response) {
  console.log("Proxy function started (DEBUG MODE).");

  const apiKeysString = process.env.GEMINI_API_KEYS;

  if (!apiKeysString || apiKeysString.trim() === '') {
    console.error("--- DEBUG START ---");
    console.error("Error: 'GEMINI_API_KEYS' tidak ditemukan atau kosong.");
    
    // Kita paksa server untuk menunjukkan semua variabel yang dia kenal
    const availableVars = Object.keys(process.env);
    console.log("Variabel yang TERSEDIA di server:", availableVars);
    
    if (availableVars.includes('VERCEL_URL')) {
        console.log("Ini aneh. Variabel default Vercel ada, tapi GEMINI_API_KEYS tidak ada. Ini mengindikasikan masalah linking di Vercel.");
    } else {
        console.log("Ini lebih aneh lagi, bahkan tidak ada variabel default dari Vercel.");
    }
    console.error("--- DEBUG END ---");

    return response.status(500).json({ 
      error: 'API keys tidak dikonfigurasi dengan benar. Cek Vercel Logs untuk detail debug.' 
    });
  }

  // Jika kunci DITEMUKAN, kode di bawah ini akan berjalan
  const apiKeys = apiKeysString.split(',').filter(key => key.trim() !== '');
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  const payload = request.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await googleResponse.json();
    if (!googleResponse.ok) {
      console.error('Google API Error:', data);
      return response.status(googleResponse.status).json(data);
    }
    return response.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ error: 'Terjadi kesalahan di server perantara.' });
  }
}
