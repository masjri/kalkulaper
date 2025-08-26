// File: /api/proxy.js (Versi Final yang Seharusnya Berfungsi)

export default async function handler(request, response) {
  // 1. Ambil kunci API dari Environment Variable yang sudah Anda simpan di Vercel
  const apiKeysString = process.env.GEMINI_API_KEYS;
  
  if (!apiKeysString) {
    // Jika variabel GEMINI_API_KEYS tidak ada sama sekali
    console.error("Error: Environment Variable 'GEMINI_API_KEYS' tidak ditemukan.");
    return response.status(500).json({ error: 'API keys tidak dikonfigurasi di Vercel.' });
  }

  const apiKeys = apiKeysString.split(',').filter(key => key.trim() !== '');

  if (apiKeys.length === 0) {
    // Jika variabel ada tapi isinya kosong setelah dibersihkan
    console.error("Error: Tidak ada API key yang valid di dalam GEMINI_API_KEYS.");
    return response.status(500).json({ error: 'Tidak ada API key yang valid.' });
  }

  // Ambil satu kunci secara acak
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  // 2. Ambil data asli dari aplikasi Anda
  const payload = request.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    // 3. Teruskan permintaan ke Google AI
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
    
    // 4. Kirim kembali hasilnya ke aplikasi Anda
    return response.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ error: 'Terjadi kesalahan di server perantara.' });
  }
}
