const config = require('../settings');
const { zandile } = require('../zandile');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

zandile({
    pattern: "song",
    alias: ["s"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = `
╭───『 🎧 𝚜𝚘𝚗𝚐 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛 』──
│
│ 📀 𝚃𝙸𝚃𝙻𝙴    : ${title || "Unknown"}
│ ⏱️ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽 : ${timestamp || "Unknown"}
│ 👁️ 𝚅𝙸𝙴𝚆𝚂    : ${views || "Unknown"}
│ 🌍 𝙿𝚄𝙱𝙻𝙸𝚂𝙷𝙴𝙳 : ${ago || "Unknown"}
│ 👤 𝙰𝚄𝚃𝙷𝙾𝚁   : ${author?.name || "Unknown"}
│ 🔗 𝚄𝚁𝙻      : ${url || "Unknown"}
│
╰──────────

╭───⌯ 𝙲𝙷𝙾𝙾𝚂𝙴 𝚃𝚈𝙿𝙴 ⌯───╮
│ 𝟷. 🎵 𝚊𝚞𝚍𝚒𝚘 𝚝𝚢𝚙𝚎 (𝚙𝚕𝚊𝚢)
│ 𝟸. 📁 𝚍𝚘𝚌𝚞𝚖𝚎𝚗𝚝 𝚝𝚢𝚙𝚎 (𝚜𝚊𝚟𝚎)
╰───────────────╯

🔊 𝚁𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 *1* 𝚘𝚛 *2*
> ${config.FOOTER || "𝚙𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ"}`;


        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // Listen for user reply only once!
        conn.ev.on('messages.upsert', async (messageUpdate) => { 
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let userReply = messageType.trim();
                let msg;
                let type;
                let response;
                
                if (userReply === "1") {
                    msg = await conn.sendMessage(from, { text: "⏳ Processing..." }, { quoted: mek });
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };
                    
                } else if (userReply === "2") {
                    msg = await conn.sendMessage(from, { text: "⏳ Processing..." }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };
                    
                } else { 
                    return await reply("❌ Invalid choice! Reply with 1 or 2.");
                }

                await conn.sendMessage(from, type, { quoted: mek });
                await conn.sendMessage(from, { text: '_sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ sᴜᴄᴜssᴇғᴜʟʟʏ ʙʏ ᴢᴀɴᴅɪʟᴇ-ᴍᴋ_ ✅', edit: msg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
                               
