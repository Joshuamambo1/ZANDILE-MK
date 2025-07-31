const axios = require("axios");
const { zandile } = require("../zandile");

zandile({
  pattern: "quote",
  alias: ["quotes", "motivate"],
  desc: "Get a random inspiring quote.",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  try {
    // Try primary API
    let res = await axios.get("https://api.quotable.io/random");
    let { content, author } = res.data;

    if (!content) {
      // Fallback API if response is empty
      res = await axios.get("https://zenquotes.io/api/random");
      content = res.data[0].q;
      author = res.data[0].a;
    }

    const formatted = `
╭───『 💭 𝚚𝚞𝚘𝚝𝚎 𝚘𝚏 𝚝𝚑𝚎 𝚍𝚊𝚢 』───╮
│
│  📜 *"${content}"*
│  — ${author || "Unknown"}
│
╰────⚡ 𝗠𝗜𝗟𝗗𝗥𝗘𝗗-𝗫𝗠𝗗 𝗡𝗘𝗧𝗞𝗜𝗡𝗚 ───╯`.trim();

    reply(formatted);
    
  } catch (e) {
    console.error("❌ Quote Fetch Error:", e.message);
    reply("⚠️ _𝚞𝚗𝚊𝚋𝚕𝚎 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚚𝚞𝚘𝚝𝚎. 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛._");
  }
});
