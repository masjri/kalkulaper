// File: /api/proxy.js (Versi Tes Paling Sederhana)

export default async function handler(request, response) {
  // Satu-satunya tujuan kode ini adalah untuk mengirim pesan "Halo Dunia"
  // Jika ini berhasil, berarti file dan konfigurasinya sudah benar.
  
  console.log("Proxy function started successfully!");
  
  response.status(200).json({ message: "Halo dari server proxy!" });
}
