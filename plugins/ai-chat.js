const { zandile } = require('../zandile');
const axios = require('axios');

// AI Command
zandile({
    pattern: "ai",
    alias: ["bot", "xd", "gpt", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react: doReact }) => {
    try {
        if (!q) return reply("Please provide a message for the AI made by Joshuamambo1.\nExample: `.ai Hello`");

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await doReact("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`🤖 *AI Response:*\n\n${data.message}`);
        await doReact("✅");
    } catch (e) {
        console.error("Error in AI command:", e);
        await doReact("❌");
        reply("An error occurred while communicating with the AI.");
    }
});

// OpenAI Command
malvin({
    pattern: "openai",
    alias: ["chatgpt", "gpt3", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react: doReact }) => {
    try {
        if (!q) return reply("Please provide a message for OpenAI.\nExample: `.openai Hello`");

        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
            await doReact("❌");
            return reply("OpenAI failed to respond. Please try again later.");
        }

        await reply(`🧠 *OpenAI Response:*\n\n${data.result}`);
        await doReact("✅");
    } catch (e) {
        console.error("Error in OpenAI command:", e);
        await doReact("❌");
        reply("An error occurred while communicating with OpenAI.");
    }
});

// DeepSeek Command
malvin({
    pattern: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react: doReact }) => {
    try {
        if (!q) return reply("Please provide a message for DeepSeek AI.\nExample: `.deepseek Hello`");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
            await doReact("❌");
            return reply("DeepSeek AI failed to respond. Please try again later.");
        }

        await reply(`🧠 *DeepSeek AI Response:*\n\n${data.answer}`);
        await doReact("✅");
    } catch (e) {
        console.error("Error in DeepSeek AI command:", e);
        await doReact("❌");
        reply("An error occurred while communicating with DeepSeek AI.");
    }
});
