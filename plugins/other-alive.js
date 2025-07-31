const config = require('../settings');
const axios = require('axios');
const { zandile, commands } = require('../zandile');

zandile({
  pattern: "live",
  desc: "Check if the bot is alive.",
  category: "main",
  react: "🟢",
  filename: __filename
},
async (conn, mek, m, {
  from, sender, pushname, reply
}) => {
  try {
    const caption = `
*👋 Hello ${pushname}! I'm alive and running...*

╭── 〘 𝗭𝗔𝗡𝗗𝗜𝗟𝗘-𝗠𝗞 〙
│✨ *Name* : Zandile-MK
│👑 *Creator* : 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺)
│⚙️ *Version* : ${config.version}
│📂 *Script Type* : Plugins
╰─────────────⭑

🧠 I’m an automated WhatsApp assistant that helps you get data, search, and more – all inside WhatsApp!

*❗ Please follow the rules:*
1. 🚫 No spam
2. 🚫 Don’t call the bot
3. 🚫 Don’t call the owner
4. 🚫 Don’t spam the owner

🔖 Type *.menu* to explore all commands.

© 2025 𝗭𝗔𝗡𝗗𝗜𝗟𝗘-𝗠𝗞
    `.trim();

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/jog59s.jpg' },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363347365643318@newsletter',
          newsletterName: '𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err}`);
  }
});
