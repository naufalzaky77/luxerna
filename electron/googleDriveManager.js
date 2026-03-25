// Google Drive API Manager untuk Luxerna Photobooth
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const { app, shell } = require("electron");

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = path.join(app.getPath("userData"), "drive-token.json");
const CREDENTIALS_PATH = path.join(app.getPath("userData"), "drive-credentials.json");

let authClient = null;

// Authorize dengan existing token 
async function authorize() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("Token belum ada. Lakukan autentikasi terlebih dahulu!");
  }

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("Credentials belum di-setup.");
  }

  try {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    oauth2Client.setCredentials(token);
    authClient = oauth2Client;
    return oauth2Client;
  } catch (err) {
    throw new Error(`Autorisasi gagal: ${err.message}`);
  }
}

// Setup credentials dari user
async function setupCredentials(credentialsData) {
  try {
    // Validate credentials format
    if (!credentialsData.installed || !credentialsData.installed.client_id) {
      throw new Error("Format credentials tidak valid! Pastikan dari Google Console.");
    }

    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentialsData, null, 2));
    console.log("[Google Drive] Credentials disimpan");
    return { success: true, message: "Credentials berhasil disimpan" };
  } catch (err) {
    console.error("[Google Drive] Setup credentials error:", err.message);
    return { success: false, error: err.message };
  }
}

// Authenticate dengan Google (manual OAuth flow)
async function authenticate() {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error("Credentials belum di-setup. Unggah terlebih dahulu.");
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log(`[Google Drive] Buka URL ini di browser: ${authUrl}`);
    
    // Open browser untuk user authorize
    shell.openExternal(authUrl);

    // Return instruction untuk user input auth code
    return {
      success: true,
      message: "Browser terbuka. Silakan authorize dan copy kode di URL.",
      requiresCode: true,
    };
  } catch (err) {
    console.error("[Google Drive] Auth error:", err.message);
    return { success: false, error: err.message };
  }
}

// Handle oauth callback dengan code
async function handleAuthCode(code) {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error("Credentials belum di-setup.");
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save token untuk next time
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    authClient = oauth2Client;

    console.log("[Google Drive] Autentikasi berhasil");
    return { success: true };
  } catch (err) {
    console.error("[Google Drive] Handle auth code error:", err.message);
    return { success: false, error: err.message };
  }
}

// Upload file ke Google Drive folder tertentu
async function uploadFile(filePath, fileName, folderId) {
  try {
    if (!authClient) {
      // Try to authorize dengan existing token
      await authorize();
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File tidak ditemukan: ${filePath}`);
    }

    const drive = google.drive({ version: "v3", auth: authClient });
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: "image/png",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    console.log(`[Google Drive] File "${fileName}" uploaded: ${response.data.id}`);
    return {
      success: true,
      fileId: response.data.id,
      link: response.data.webViewLink,
    };
  } catch (err) {
    console.error("[Google Drive] Unggah error:", err.message);
    return { success: false, error: err.message };
  }
}

// Cari folder di Drive berdasarkan folder ID atau name
async function findFolder(folderIdOrName) {
  try {
    if (!authClient) {
      await authorize();
    }

    const drive = google.drive({ version: "v3", auth: authClient });

    // Cek apakah input adalah folder ID
    try {
      const folder = await drive.files.get({
        fileId: folderIdOrName,
        fields: "id, name, mimeType",
      });

      if (folder.data.mimeType === "application/vnd.google-apps.folder") {
        return { success: true, folderId: folder.data.id, folderName: folder.data.name };
      }
    } catch (err) {
      // Kalau tidak ketemu sebagai ID, lanjut ke search by name
      console.log(`[Google Drive] Folder ID "${folderIdOrName}" tidak ditemukan, coba cari dengan nama...`);
    }

    // Cari folder by name
    const response = await drive.files.list({
      q: `name = "${folderIdOrName}" and mimeType = "application/vnd.google-apps.folder" and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      pageSize: 1,
    });

    if (response.data.files && response.data.files.length > 0) {
      const folder = response.data.files[0];
      return { success: true, folderId: folder.id, folderName: folder.name };
    }

    return { success: false, error: `Folder "${folderIdOrName}" tidak ditemukan di drive Anda` };
  } catch (err) {
    console.error("[Google Drive] Pencarian folder error:", err.message);
    return { success: false, error: err.message };
  }
}

// Check auth status
function isAuthenticated() {
  return authClient !== null && fs.existsSync(TOKEN_PATH);
}

module.exports = {
  setupCredentials,
  authenticate,
  handleAuthCode,
  uploadFile,
  findFolder,
  isAuthenticated,
  CREDENTIALS_PATH,
  TOKEN_PATH,
};

