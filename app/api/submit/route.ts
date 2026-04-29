import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
      body.ticket,
      body.serviceName,
      JSON.stringify(body.data),
      body.docs.join(', '),
      body.status,
      body.date,
      new Date().toISOString(),
      body.namaPelapor || body.data?.namaLengkap || body.data?.namaPelapor || '',
      body.nomorHP || body.data?.nomorHP || body.data?.noHp || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Applications!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] }
    });

    return NextResponse.json({ 
      success: true, 
      ticket: body.ticket,
      message: 'Data berhasil disimpan ke Google Sheets'
    });

  } catch (error) {
    console.error('Google Sheets Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal menyimpan ke Google Sheets' 
    }, { status: 500 });
  }
}
