/*
Project Name : ZANDILE MK
Creator      : Joshuamambo1 N3tKing ( 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺) )
Repo         : https://github.com/Joshuamambo1/ZANDILE-MK
Support      : wa.me/263716985350
*/

const config = require('../settings');
const { zandile } = require('../zandile');
const { runtime } = require('../lib/functions');

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

zandile({
    pattern: "support",
    alias: ["follow", "links"],
    desc: "Display support and follow links",
    category: "main",
    react: "📡",
    filename: __filename
}, 
async (conn, mek, m, {
    from, reply, pushname
}) => {
    try {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const uptimeFormatted = runtime(process.uptime());

        const message = `
╭─『 *𝗭𝗔𝗡𝗗𝗜𝗟𝗘 𝗠𝗞 - 𝗦𝗨𝗣𝗣𝗢𝗥𝗧* 』─
│ 👤 *Developer* : Mr 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺) 🇿🇼
│ ⚙️ *Mode*      : ${config.MODE}
│ ⏱️ *Uptime*    : ${uptimeFormatted}
│ 💠 *Prefix*    : ${config.PREFIX}
│ 🔖 *Version*   : ${config.version}
│ 🕰️ *Time*      : ${currentTime}
╰─────────────

📢 *Follow & Support ZANDILE MK* ${readMore}

🔔 *Official WhatsApp Channel*
🔗 https://whatsapp.com/channel/0029VaraMtfFcowAKRdDdp1T

🎬 *YouTube Channel*
🔗 https://youtube.com/@joshuamambo1

👨‍💻 *Developer Contact*
🔗 wa.me/263716729222?text=Hi%20𝚉𝙰𝙽𝙳𝙸𝙻𝙴-𝙼𝙺,%20I%20need%20support!

> 💡 Powered by *𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺)*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: 'https://i.postimg.cc/4NdSqms8/MidKing.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363347365643318@newsletter',
                    newsletterName: '🤖『 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ 』™️🇿🇼🇿🇦🫡👑🥰🇿🇲🇳🇬',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Support Cmd Error:", e);
        reply(`⚠️ An error occurred:\n${e.message}`);
    }
});
