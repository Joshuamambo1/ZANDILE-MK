const axios = require('axios');
const config = require('../settings');
const { zandile } = require('../zandile');
const moment = require('moment-timezone');

zandile({
  pattern: 'version',
  react: '🚀',
  desc: 'Check current bot version & compare with remote repo',
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const time = moment().tz('Africa/Gweru').format('HH:mm:ss');
    const date = moment().tz('Africa/Gweru').format('DD/MM/YYYY');

    // Local version info
    const localPackage = require('../package.json');
    const currentVersion = localPackage.version;

    // Remote version info from GitHub
    const repoUrl = config.REPO || 'https://github.com/Joshuamambo1/ZANDILE-MK';
    const repoPath = repoUrl.replace('https://github.com/', '');
    const rawUrl = `https://raw.githubusercontent.com/${repoPath}/master/package.json`;

    const { data: remotePackage } = await axios.get(rawUrl);
    const latestVersion = remotePackage.version;

    // Status decision
    const status = currentVersion === latestVersion
      ? '✅ Your bot is *up-to-date*!'
      : '⚠️ *Update Available!*';

    const versionInfo = `
🗂️ *Version Status*

🔖 *Current:* v${currentVersion}
🆕 *Latest:* v${latestVersion}

${status}

📅 *Checked:* ${date}
🕒 *Time:* ${time}

🤖 *Bot:* ${config.BOT_NAME || 'ZANDILE-MK'}
👑 *Developer:* ${config.OWNER_NAME || 'Mr. ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ'}

📦 *Repo:* ${repoUrl}
⭐️ *Star the repo to support!*
`.trim();

    await conn.sendMessage(from, {
      image: {
        url: config.ALIVE_IMG || 'https://files.catbox.moe/jog59s.jpg'
      },
      caption: versionInfo,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363347365643318@newsletter',
          newsletterName: config.BOT_NAME ? `${config.BOT_NAME} Bot` : '『 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error('Version check failed:', e);

    // Safe fallback
    const localVersion = require('../package.json').version;

    const fallback = `
❌ *Version Check Failed!*

📦 *Local Version:* v${localVersion}
🔗 *Repo:* ${config.REPO || 'Not configured'}

Error:
${e.message}
`.trim();

    reply(fallback);
  }
});
