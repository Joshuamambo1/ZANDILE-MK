const config = require('../settings');
const { zandile, commands } = require('../zandile');

Zandile({
    pattern: "ping2",
    alias: ["pong", "ping2", "ping3"],
    use: '.ping',
    desc: "Check bot's response time crd 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺).",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const startTime = Date.now();

        const emojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹', '💎', '🏆', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // React instantly with a random emoji
        await conn.sendMessage(from, {
            react: { text: randomEmoji, key: mek.key }
        });

        const ping = Date.now() - startTime;

        // Speed categorization
        let badge = '🐢 Slow', color = '🔴';
        if (ping <= 150) {
            badge = '🚀 Super Fast';
            color = '🟢';
        } else if (ping <= 300) {
            badge = '⚡ Fast';
            color = '🟡';
        } else if (ping <= 600) {
            badge = '⚠️ Medium';
            color = '🟠';
        }

        // Final response
        await conn.sendMessage(from, {
            text: `> *ᴢᴀɴᴅɪʟᴇ-ᴍᴋ 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺) ʀᴇsᴘᴏɴsᴇ: ${ping} ms ${randomEmoji}*\n> *sᴛᴀᴛᴜs: ${color} ${badge}*\n> *ᴠᴇʀsɪᴏɴ: ${config.version}*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363347365643318@newsletter',
                    newsletterName: "Joshuamambo1 N3tKing Tech",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Error in ping command:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
