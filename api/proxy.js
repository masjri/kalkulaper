// File: /api/proxy.js (Versi dengan "Mata-mata")

export default async function handler(request, response) {
  console.log("Proxy function started."); // Log #1: Memastikan fungsi berjalan

  // 1. Ambil kunci API dari Environment Variable
  const apiKeysString = process.env.GEMINI_API_KEYS;
  
  // Log #2: Cek apakah string API key berhasil dibaca dari Vercel
  console.log("Raw GEMINI_API_KEYS string:", apiKeysString ? `(Ditemukan string dengan panjang ${apiKeysString.length})` : "(Variabel tidak ditemukan atau kosong)");

  const apiKeys = (apiKeysString || '').split(',');
  
  if (!apiKeys || apiKeys.length === 0 || apiKeys[0] === '') {
    console.error("Error: API keys tidak dikonfigurasi dengan benar."); // Log #3: Error jika kunci kosong
    return response.status(500).json({ error: 'API keys tidak dikonfigurasi di Vercel.' });
  }

  console.log(`Ditemukan ${apiKeys.length} kunci API.`); // Log #4: Jumlah kunci yang ditemukan

  // Ambil satu kunci secara acak
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  console.log("Menggunakan salah satu kunci API untuk permintaan."); // Log #5: Konfirmasi kunci dipilih

  // 2. Ambil data asli dari aplikasi Anda
  const payload = request.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    console.log("Meneruskan permintaan ke Google AI..."); // Log #6: Sesaat sebelum mengirim
    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log(`Menerima balasan dari Google dengan status: ${googleResponse.status}`); // Log #7: Status balasan dari Google

    if (!googleResponse.ok) {
      const errorBody = await googleResponse.text();
      console.error('Isi Error dari Google API:', errorBody); // Log #8: Mencetak error asli dari Google
      return response.status(googleResponse.status).json({ error: `Error dari Google API: ${googleResponse.statusText}` });
    }

    const data = await googleResponse.json();
    
    console.log("Sukses! Mengirim data kembali ke aplikasi."); // Log #9: Jika semua berhasil
    return response.status(200).json(data);

  } catch (error) {
    console.error('Error di dalam blok catch:', error); // Log #10: Jika ada error lain
    return response.status(500).json({ error: 'Terjadi kesalahan di server perantara.' });
  }
}
