// Google Drive API Setup Guide untuk Luxerna Photobooth

## Step-by-Step Setup Google Drive Integration

### 1. Buat Google Cloud Project

- Buka: https://console.cloud.google.com
- Click "Create Project"
- Nama: "Luxerna Photobooth"
- Click CREATE

### 2. Enable Google Drive API

- Dashboard → "Enable APIs and Services"
- Search: "Google Drive API"
- Click "Enable"

### 3. Buat OAuth Credentials

- Go to: https://console.cloud.google.com/apis/credentials
- Click: "Create Credentials" → "OAuth client ID"
- Application type: "Desktop application"
- Name: "Luxerna App"
- Click CREATE

### 4. Download Credentials JSON

- Di credentials list, find yang baru dibuat
- Click download icon (⬇️)
- File akan ter-download sebagai: `client_secret_*.json`

### 5. Setup di Luxerna App

- Di Home screen akan ada tombol "Setup Google Drive"
- Paste credentials JSON content ke sana
- Click "Authenticate"
- Browser akan buka untuk Google OAuth consent
- Approve access
- Selesai!

### 6. Gunakan

- Di Output screen, input folder Google Drive ID atau URL
- Saat klik PROSES, foto akan otomatis terupload ke folder itu

---

## Troubleshooting

**"Credentials invalid"**

- Pastikan JSON dari Google Console, jangan dari file lain
- Format harus: `{ "installed": { "client_id": ..., "client_secret": ... } }`

**"Folder not found"**

- Pastikan folder ID atau URL benar
- Folder harus milik Google account yang di-authorize

**"Upload failed"**

- Check internet connection
- Pastikan folder masih exist dan app punya akses
- Coba re-authenticate

---

Untuk testing, bisa pake folder public : `https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing`
