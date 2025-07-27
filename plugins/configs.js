const { zandile, mode } = require("../lib");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const BotVariable = require('../lib/database/botvar');
const config = require('../config');

zandile({
  pattern: 'setvar ?(.*)',
  fromMe: true,
  desc: 'Set a variable and update config.env',
  type: 'tools'
}, async (message, match, client) => {
  if (!match || !match.includes('=')) {
    return await message.reply('Use the format: `.setvar KEY=VALUE`');
  }

  const [key, ...valueParts] = match.split('=');
  const value = valueParts.join('=').trim();
  const envPath = path.join(__dirname, '..', 'config.env');

  BotVariable.upsert({ key: key.trim(), value: value })
    .then(() => {
      config[key.trim()] = value;
      console.log(` ${key.trim()} set to '${value}' successfully.`);

      // Delete config.env
      if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
        console.log(`Deleted existing config.env`);
      }

      // Run prestart to regenerate config.env
      console.log(`Running npm run prestart...`);
      exec('npm run prestart', async (err, stdout, stderr) => {
        if (err) {
          console.error(`Error running prestart:`, err.message);
          return await message.reply('Error updating config.env');
        }

        console.log(`config.env regenerated:\n${stdout}`);
        if (stderr) console.error(`stderr:\n${stderr}`);

        await message.reply(`${key.trim()} set to '${value}'\nconfig.env regenerated.`);
      });
    })
    .catch(async (err) => {
      console.error(`Failed to set ${key.trim()}:`, err.message || err);
      await message.reply(`Failed to set ${key.trim()}: ${err.message}`);
    });
});

zandile({
  pattern: 'allvar',
  fromMe: true,
  desc: 'List all saved environment variables from the database',
  type: 'tools'
}, async (message, match, client) => {
  BotVariable.findAll()
    .then((vars) => {
      if (!vars.length) return message.reply('_No variables found in the database._');

      const msg = vars
        .map(v => `*${v.key}* = \`${v.value}\``)
        .join('\n');

      message.reply(`*Current Bot Variables:*\n\n${msg}`);
    })
    .catch((err) => {
      console.error(err);
      message.reply('Failed to fetch bot variables.');
    });
});

zandile({
  pattern: 'getvar ?(.*)',
  fromMe: true,
  desc: 'Get a specific variable from the database',
  type: 'tools'
}, async (message, match, client) => {
  const key = match.trim();
  if (!key) return await message.reply('Use: `.getvar KEY`');

  BotVariable.findOne({ where: { key } })
    .then((variable) => {
      if (!variable) return message.reply(` Variable *${key}* not found.`);

      message.reply(`*${key}* = \`${variable.value}\``);
    })
    .catch((err) => {
      console.error(err);
      message.reply(`Failed to get variable *${key}*`);
    });
});
