const fs = require('fs');
const path = require('path');
const config = require('../settings')
const {zandile , commands} = require('../zandile')


// Composing (Auto Typing)
malvin({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});
