const { zandile, commands } = require('../zandile');
const { exec } = require('child_process');
const config = require('../settings');
const { sleep } = require('../lib/functions');

// 1. Shutdown Bot
zandile({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑🌀📴🔄",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply("🛑🔄♻️ Shutting down ZANDILE-MK... Bye!").then(() => process.exit());
});

// 2. Broadcast Message to All Groups
zandile({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
        await sleep(300); // throttle broadcast
    }
    reply("📢 Message successfully broadcasted to all groups.");
});

// 3. Set Profile Picture (Fixed)
zandile({
    pattern: "pp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const stream = await conn.downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        await conn.updateProfilePicture(conn.user.id, buffer);
        reply("🖼️ Bot profile picture updated successfully!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Failed to update profile picture: ${error.message}`);
    }
});

// 4. Clear All Chats
zandile({
    pattern: "clearchats",
    desc: "Clear all chats from the 𝗟𝗗𝗞 (𝗟𝗶𝗴𝗵𝘁 𝗗𝗲𝘀𝗸 𝗧𝗲𝗮𝗺) bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        const chats = Object.keys(conn.chats);
        for (const jid of chats) {
            await conn.modifyChat(jid, 'delete');
            await sleep(300);
        }
        reply("🧹 All chats cleared successfully!");
    } catch (error) {
        console.error("Error clearing chats:", error);
        reply(`❌ Error clearing chats: ${error.message}`);
    }
});

// 5. Group JIDs List
zandile({
    pattern: "gjid",
    desc: "List all group JIDs the bot is in.",
    category: "owner",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).map((jid, i) => `${i + 1}. ${jid}`).join('\n');
    reply(`📝 *Group JIDs List:*

${groupJids}`);
});

// 6. Delete Replied Message
zandile({
    pattern: "delete",
    alias: ["del"],
    desc: "Delete replied message (group or private)",
    category: "group",
    use: ".del (as reply)",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, {
    quoted, isGroup, isAdmins, isBotAdmins, isOwner, reply
}) => {
    if (!m.quoted) return reply("⚠️ Please reply to the message you want to delete.");
    if (isGroup && !isOwner && !isAdmins) return reply("🚫 Only *group admins* can use this command.");
    if (isGroup && !isBotAdmins) return reply("🤖 I need *admin rights* to delete messages.");

    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.quoted.id,
                participant: m.quoted.sender
            }
        });
    } catch (e) {
        console.error("Delete failed:", e);
        reply("❌ Couldn't delete the message. It might be too old or already deleted.");
    }
});
