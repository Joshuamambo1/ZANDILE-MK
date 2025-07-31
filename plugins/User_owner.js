/*
🔧 Project      : ZANDILE-MK
👑 Creator      : ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ (MIDKING01 TECH)
📦 Repository   : https://github.com/Joshuamambo1/ZANDILE-MK
📞 Support      : https://wa.me/263738403205
*/

const { zandile } = require('../zandile');
const config = require('../settings');

zandile({
  pattern: "owner",
  react: "📞",
  desc: "Send bot owner's contact",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const ownerName = config.OWNER_NAME || "Joshuamambo1 N3tKing";
    const ownerNumber = config.OWNER_NUMBER || "263738403205";

    // Build vCard contact
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${ownerName}`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      "END:VCARD"
    ].join('\n');

    // Send vCard contact
    await conn.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    });

    // Send image + caption
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/jog59s.jpg' },
      caption: `
╭── ❍ 『 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ 』 ❍
│ ✦ 𝙽𝚊𝚖𝚎   : *${ownerName}*
│ ✦ 𝙽𝚞𝚖𝚋𝚎𝚛 : *${ownerNumber}*
│ ✦ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : *${config.version || 'Unknown'}*
╰───────────────⭓
> Stay connected for 🔥 updates!`,
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363347365643318@newsletter',
          newsletterName: 'User Owner',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error in .owner command:", error);
    reply(`⚠️ An error occurred: ${error.message}`);
  }
});
