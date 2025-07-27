const axios = require('axios');
const { zandile, commands } = require('../zandile');
const config = require("../settings");
const { setConfig, getConfig } = require("../lib/configdb");

// Default AI state if not set
let AI_ENABLED = "false"; // Default enabled

zandile({
    pattern: "aichat",
    alias: ["chatbot", "malvinbot"],
    desc: "Enable or disable AI chatbot responses",
    category: "settings",
    filename: __filename,
    react: "✅"
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        AI_ENABLED = "true";
        await setConfig("AI_ENABLED", "true");
        return reply("🤖 AI chatbot is now enabled");
    } else if (status === "off") {
        AI_ENABLED = "false";
        await setConfig("AI_ENABLED", "false");
        return reply("🤖 AI chatbot is now disabled");
    } else {
        return reply(`Current AI state: ${AI_ENABLED === "true" ? "ON" : "OFF"}\nUsage: ${prefix}aichat on/off`);
    }
});

// Initialize AI state on startup
(async () => {
    const savedState = await getConfig("AI_ENABLED");
    if (savedState) AI_ENABLED = savedState;
})();

// AI Chatbot 
malvin({
    on: "body"
}, async (conn, m, store, {
    from,
    body,
    sender,
    isGroup,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    try {
        // Check if AI is disabled
        if (AI_ENABLED !== "true") return;

        // Optional: Prevent bot responding to its own messages or commands
        if (!body || m.key.fromMe || body.startsWith(config.PREFIX)) return;

        // Encode message for the query
        const query = encodeURIComponent(body);
        const prompt = encodeURIComponent("you are mildred md whatsapp bot made by MIDKING  ( Joshuamambo1 NetKing). a tech genius in zimbabwe. act smart and enigmatic about personal stuff about him. He is 22 years (2025).Every mesaage you reply put footer \n> ᴘᴏᴡᴇʀᴇᴅ  ©️ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ ᴠ4.2.1👑🫡🇿🇼☑ ");

        // BK9 API Request
        const apiUrl = `https://bk9.fun/ai/BK93?BK9=${prompt}&q=${query}`;

        const { data } = await axios.get(apiUrl);

        if (data && data.status && data.BK9) {
            await conn.sendMessage(from, {
                text: data.BK9
            }, { quoted: m });
        } else {
            reply("⚠️ NetKing AI failed to generate a response.");
        }

    } catch (err) {
        console.error("AI Chatbot Error:", err.message);
        reply("❌ An error occurred while contacting the AI.");
    }
});


