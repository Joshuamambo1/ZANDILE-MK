const fs = require('fs');
const path = require('path');
const config = require('../settings')
const {malvin , commands} = require('../zandile')


//auto recording
zandile({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {       
 if (config.AUTO_RECORDING === 'true') {
                await conn.sendPresenceUpdate('recording', from);
            }
         } 
   );
