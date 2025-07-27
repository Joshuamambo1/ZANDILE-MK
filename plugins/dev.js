const { zandile } = require('../zandile');

const tinyCaps = (text) => {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

zandile({
  pattern: "dev",
  alias: ["developer", "dev"],
  desc: "Displays the developer info",
  category: "owner",
  react: "👨‍💻",
  filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const name = pushname || "there";

    const caption = `
╭─⌈ *👨‍💻 ${tinyCaps("Zandile-mk developer")}* ⌋─
│
│ 👋 Hello, *${name}*!
│
│ 🤖 I'm *©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ*, the creator & maintainer
│    of this smart WhatsApp bot.
│
│ 👨‍💻 *OWNER INFO:*
│ ───────────────
│ 🧠 Name    : ©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ
│ 🎂 Age     : 22+
│ 📞 Contact : wa.me/263738365135
│ 📺 YouTube : ©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ
│            https://youtube.com/@joshuamambo1
│
╰───────────────

> ⚡ *Powered by 𝗭𝗔𝗡𝗗𝗜𝗟𝗘-𝗠𝗞*
`.trim();

    await conn.sendMessage(
      from,
      {
        image: { url: 'https://files.catbox.moe/dnjqau.jpg' },
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363347365643318@newsletter',
            newsletterName: '🪀『 ©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ 』🪀',
            serverMessageId: 143
          },
          externalAdReply: {
            title: "ZANDILE-MK Bot",
            body: "Created with ❤️ by ©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ",
            thumbnailUrl: 'https://files.catbox.moe/jog59s.jpg',
            mediaType: 1,
            renderSmallerThumbnail: true,
            showAdAttribution: true,
            mediaUrl: "https://youtube.com/@joahuamambo1",
            sourceUrl: "https://youtube.com/@joshuamambo2"
          }
        }
      },
      { quoted: mek }
    );
  } catch (e) {
    console.error("Error in .owner command:", e);
    return reply(`❌ Error: ${e.message || e}`);
  }
});
