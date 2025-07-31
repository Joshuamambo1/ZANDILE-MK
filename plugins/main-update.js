const { zandile } = require("../zandile");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const config = require('../settings');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

// GitHub Token for private repo access
const GITHUB_TOKEN = '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'; // 🔐 Keep secure!

// Database setup
const dbPath = path.join(__dirname, '../lib/update.db');
const db = new sqlite3.Database(dbPath);

// Promisify db methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

// Initialize update table
(async function () {
  try {
    await dbRun(`CREATE TABLE IF NOT EXISTS updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT UNIQUE,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      changes TEXT
    )`);
  } catch (e) {
    console.error('Database init error:', e);
  }
})();

async function getVersionInfo() {
  try {
    let localVersion = "unknown";
    try {
      const pkg = require('../package.json');
      localVersion = pkg.version;
    } catch {}

    if (localVersion === "unknown" && fs.existsSync(path.join(__dirname, '../.git'))) {
      try {
        const head = fs.readFileSync(path.join(__dirname, '../.git/HEAD'), 'utf8').trim();
        if (head.startsWith('ref: ')) {
          const ref = head.substring(5);
          const refPath = path.join(__dirname, `../.git/${ref}`);
          if (fs.existsSync(refPath)) {
            localVersion = fs.readFileSync(refPath, 'utf8').trim().substring(0, 7);
          }
        } else {
          localVersion = head.substring(0, 7);
        }
      } catch {}
    }

    if (localVersion === "unknown") {
      const row = await dbGet("SELECT version FROM updates ORDER BY update_date DESC LIMIT 1");
      localVersion = row?.version || "unknown";
    }

    return localVersion;
  } catch (e) {
    console.error('Version check error:', e);
    return "unknown";
  }
}

zandile({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: '🚀',
  desc: "Update the bot to the latest version",
  category: "system",
  filename: __filename
}, async (client, message, args, { from, reply, sender, isOwner }) => {
  if (!isOwner) return reply("❌ Owner only command!");

  try {
    const repoUrl = config.REPO || "https://github.com/Joshuamambo1/ZANDILE-MK";
    const repoApiUrl = repoUrl.replace('github.com', 'api.github.com/repos');

    const localVersion = await getVersionInfo();
    await reply(`🔍 Current version: ${localVersion}`);

    await reply("Checking for updates...");

    let latestVersion;
    let changes = "Manual update";

    try {
      const releaseResponse = await axios.get(`${repoApiUrl}/releases/latest`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        },
        timeout: 10000
      });
      latestVersion = releaseResponse.data.tag_name;
      changes = releaseResponse.data.body || "No changelog";

      if (latestVersion === localVersion) {
        return reply(`✅ Already on latest release: ${localVersion}`);
      }
    } catch (err) {
      const commitResponse = await axios.get(`${repoApiUrl}/commits/main`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        },
        timeout: 10000
      });
      latestVersion = commitResponse.data.sha.substring(0, 7);
      changes = commitResponse.data.commit.message || "Main branch update";

      if (latestVersion === localVersion) {
        return reply(`✅ Already on latest commit: ${localVersion}`);
      }
    }

    await reply(`📥 New version found: ${latestVersion}\n\nChanges:\n${changes}\n\nDownloading update...`);

    const zipUrl = `https://api.github.com/repos/${repoUrl.replace('https://github.com/', '')}/zipball/main`;
    const zipResponse = await axios.get(zipUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw'
      },
      timeout: 30000
    });

    const zip = new AdmZip(zipResponse.data);
    const zipEntries = zip.getEntries();
    const basePath = zipEntries[0].entryName.split('/')[0] + '/';
    const protectedFiles = ["settings.js", "app.json", "data", "lib/update.db", "package-lock.json"];

    await reply("🔄 Applying updates...");

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      const relativePath = entry.entryName.replace(basePath, '');
      const destPath = path.join(__dirname, '..', relativePath);
      if (protectedFiles.some(f => destPath.includes(f))) continue;

      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      zip.extractEntryTo(entry, dir, false, true, entry.name);
    }

    await dbRun("INSERT OR IGNORE INTO updates (version, changes) VALUES (?, ?)", [latestVersion, changes]);
    await reply(`✅ Update to ${latestVersion} applied successfully! Restarting...`);
    setTimeout(() => process.exit(0), 2000);

  } catch (err) {
    console.error("Update failed:", err);
    reply(`❌ Update failed: ${err.message}\n\nPlease update manually from: ${config.REPO}`);
  }
});
