import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { namaPelapor, nomorHP, serviceName, ticket } = body;

    const message = `Halo *${namaPelapor}*,

Pengajuan *${serviceName}* Anda berhasil!

📌 *Nomor Tiket:* ${ticket}
📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID')}

Silakan cek status pengajuan di:
https://simpel.go.id

Terima kasih telah menggunakan layanan SIMPEL.

*Tim Pelayanan Digital*`;

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.FONNTE_TOKEN!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: nomorHP,
        message: message,
        countryCode: '62',
        delay: 1
      })
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Notifikasi WhatsApp terkirim',
      result: result
    });

  } catch (error) {
    console.error('Fonnte Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal mengirim notifikasi WhatsApp' 
    }, { status: 500 });
  }
}
