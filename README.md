# 🚀 SIMPEL - Sistem Pelayanan Digital (Next.js 15 + Google Sheets API)

**Project SIMPEL** adalah sistem pelayanan publik modern, futuristik, dan profesional untuk instansi pemerintah. Dibangun sebagai **full one-page website** dengan desain glassmorphism + neon cyan glow yang premium.

## ✨ Fitur Utama

- **6 Layanan Digital** lengkap (KTP, KK, Akta Lahir, Pindah Domisili, IUMK, Pengaduan)
- **Setiap layanan**: 7–9 input form + 5 kolom dokumen upload (bisa diedit via Admin)
- **Filter + Search + Status** real-time pada riwayat pengajuan
- **Nomor Tiket Otomatis** (format: SIM-YYYYMMDD-XXX)
- **Status Update oleh Admin** via interface (Pending → Diproses → Selesai)
- **8 Tombol Akses Cepat** (Microsite s.id style) — **bisa ditambah, diedit, dihapus** langsung di Admin Panel
- **Simulasi Google Sheets** (localStorage + console log) — siap integrasi penuh
- **Desain Futuristik**: Glassmorphism, neon glow cyan/purple, smooth animations (Framer Motion)

## 🛠 Teknologi

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animasi premium)
- **Lucide React** (ikon modern)
- **Google Sheets API v4** (siap diintegrasikan dengan Service Account Editor)

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

**Password Admin Demo**: `simpel2026`

## 🔐 Integrasi Google Sheets API (Production Ready)

### Langkah 1: Persiapan Google Cloud
1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Google Sheets API** + **Google Drive API** (opsional untuk file)
3. Buat **Service Account** → Download JSON key (`service-account.json`)
4. Buat Google Sheet baru → Bagikan dengan email Service Account (akses **Editor**)

### Langkah 2: Setup Environment
Buat file `.env.local` di root project:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

### Langkah 3: Implementasi API Routes (Contoh)

Buat folder `app/api/submit/route.ts`:

```ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function POST(request: Request) {
  const body = await request.json();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Applications!A:J',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        body.ticket,
        body.serviceName,
        JSON.stringify(body.data),
        body.docs.join(', '),
        body.status,
        body.date,
        new Date().toISOString()
      ]]
    }
  });

  return NextResponse.json({ success: true, ticket: body.ticket });
}
```

**Update Status** di `app/api/update-status/route.ts` dengan `sheets.spreadsheets.values.update`.

### Struktur Sheet yang Direkomendasikan
- Sheet 1: `Applications` (Ticket | Service | Data JSON | Docs | Status | Date | Timestamp)
- Sheet 2: `QuickLinks` (untuk menyimpan tombol akses cepat)
- Sheet 3: `ServicesConfig` (opsional untuk dynamic service fields)

## 📁 Struktur Project

```
app/
├── layout.tsx          # Metadata + font
├── page.tsx            # Full one-page SIMPEL (semua fitur)
├── globals.css         # Glassmorphism + Neon styles
└── api/                # (Buat sendiri untuk integrasi Sheets)
public/
└── (favicon opsional)
```

## 🎨 Desain Highlights

- **Glassmorphism**: `backdrop-blur-2xl bg-white/5 border border-white/10`
- **Neon Cyan Glow**: `shadow-[0_0_30px_#00f9ff]`
- **Microsite s.id style**: 8 kartu besar dengan hover scale + glow
- **Timeline Status**: Visual stepper modern
- **Admin Panel**: Password protected + live status update + manage quick links

## 📌 Catatan Penting

- Saat ini menggunakan **localStorage** sebagai simulasi database (data tersimpan di browser)
- Semua aksi Admin (update status, tambah/hapus tombol) langsung tersimpan & sinkron
- Untuk production: Ganti semua `console.log` dan localStorage dengan **fetch ke API Routes** yang memanggil Google Sheets
- File upload saat ini hanya menyimpan nama file (simulasi). Untuk produksi, integrasikan **Google Drive API** + simpan link di Sheets.

---

**Dibuat oleh Senior Web Developer & Google Sheets API Expert**  
Siap deploy ke Vercel dalam 5 menit. Cocok untuk instansi pemerintah yang ingin pelayanan digital premium.

**Hubungi untuk customisasi lebih lanjut** (menambah layanan, integrasi Drive, notifikasi WA, dll).