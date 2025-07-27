const { zandile } = require('../zandile');

zandile({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, q, isGroup, sender, botNumber, isBotAdmins, isAdmins, reply
}) => {

    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to promote someone.");

    let number;

    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.match(/^\d+$/)) {
        number = q;
    } else if (q.includes("@")) {
        number = q.replace(/[@\s+]/g, '');
    } else {
        return reply("❌ Please reply to a message or provide a number to promote.");
    }

    if (number === botNumber.split('@')[0]) return reply("❌ I can't promote myself.");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");

        // Use conn.sendMessage for mentions
        await conn.sendMessage(from, {
            text: `✅ Successfully promoted @${number} to *admin*.`,
            mentions: [jid]
        }, { quoted: mek });

    } catch (error) {
        console.error("Promote command error:", error);
        reply("❌ Failed to promote the member. Make sure the number is in the group.");
    }
});
