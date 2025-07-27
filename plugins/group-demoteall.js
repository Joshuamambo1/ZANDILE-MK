const { zandile } = require('../zandile');

zandile({
    pattern: "bulkdemote",
    alias: ["massdemote"],
    desc: "Demotes all admins to members (excluding bot & owners)",
    category: "admin",
    react: "🔻",
    filename: __filename
}, async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, isAdmins, isGroup, reply, botNumber2
}) => {
    if (!isGroup) return reply("❌ This command is only for groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this.");
    if (!isBotAdmins) return reply("❌ I must be admin to do that.");

    const members = groupMetadata.participants;
    const owners = ['263716985350', '263738403205', '263716729222']; // edit your owner numbers

    const targets = members.filter(p => (
        groupAdmins.includes(p.id) &&
        !owners.includes(p.id.split('@')[0]) &&
        p.id !== botNumber2
    )).map(p => p.id);

    if (!targets.length) return reply("❌ No admins to demote.");

    reply(`⏳ Demoting ${targets.length} admin(s)...`);

    let success = 0, failed = 0;
    for (const jid of targets) {
        try {
            await conn.groupParticipantsUpdate(from, [jid], 'demote');
            success++;
        } catch {
            failed++;
        }
    }

    reply(`✅ Bulk Demote Complete.\n\n🟢 Demoted: ${success}\n🔴 Failed: ${failed}`);
});
