import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { google } = await import('googleapis');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderName = formData.get('folderName') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const drive = google.drive({ version: 'v3', auth });
    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    // 1. Cari atau buat folder
    let folderId = await findOrCreateFolder(drive, folderName, parentFolderId);

    // 2. Upload file ke folder
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: buffer,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    return NextResponse.json({
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
      folderName: folderName
    });

  } catch (error) {
    console.error('Google Drive Upload Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal upload ke Google Drive' 
    }, { status: 500 });
  }
}

async function findOrCreateFolder(drive: any, folderName: string, parentFolderId: string | undefined): Promise<string> {
  if (!parentFolderId) {
    throw new Error('GOOGLE_DRIVE_PARENT_FOLDER_ID tidak ditemukan di .env.local');
  }

  // Cari folder yang sudah ada
  const searchResponse = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    return searchResponse.data.files[0].id;
  }

  // Buat folder baru
  const createResponse = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  });

  return createResponse.data.id;
}
