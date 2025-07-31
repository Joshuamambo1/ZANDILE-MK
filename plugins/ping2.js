const config = require('../settings');
const { zandile } = require('../zandile');
const moment = require('moment-timezone');

zandile({
    pattern: "ping",
    alias: ["speed", "pong"],
    desc: "Check 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺) bot's response time and status",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        // Emojis and styles
        const emojiSets = {
            reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
            bars: [
                '▰▰▰▰▰▰▰▰▰▰',
                '▰▱▱▱▱▱▱▱▱▱',
                '▰▰▱▱▱▱▱▱▱▱',
                '▰▰▰▱▱▱▱▱▱▱',
                '▰▰▰▰▱▱▱▱▱▱'
            ],
            status: ['🟢 ONLINE', '🔵 ACTIVE', '🟣 RUNNING', '🟡 RESPONDING']
        };

        const reactionEmoji = emojiSets.reactions[Math.floor(Math.random() * emojiSets.reactions.length)];
        const statusText = emojiSets.status[Math.floor(Math.random() * emojiSets.status.length)];
        const loadingBar = emojiSets.bars[Math.floor(Math.random() * emojiSets.bars.length)];

        // React with emoji
        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        // Time info
        const responseTime = (Date.now() - start) / 1000;
        const time = moment().tz('Africa/Gweru').format('HH:mm:ss');
        const date = moment().tz('Africa/Gweru').format('DD/MM/YYYY');

        // Owner & bot name
        const ownerName = config.OWNER_NAME || "JMz MIDKING TECH";
        const botName = config.BOT_NAME || "ZANDILE-MK";
        const repoLink = config.REPO || "https://github.com/Joshuamambo1/ZANDILE-MK";

        // Final output
        const pingMsg = `

*${statusText}*

⚡ \`Response Time:\` ${responseTime.toFixed(2)}s
⏰ \`Time:\` ${time}
📅 \`Date:\` ${date}

💻 \`Developer:\` ${ownerName}
🤖 \`Bot Name:\` ${botName}

🌟 Don't forget to *star* & *fork* the repo!
🔗 ${repoLink}

${loadingBar}
`.trim();

        await conn.sendMessage(from, {
            text: pingMsg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363347365643318@newsletter',
                    newsletterName: "🚀 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ 🚀",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Ping command error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
