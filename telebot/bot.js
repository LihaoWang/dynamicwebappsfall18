const TeleBot = require('telebot');
const bot = new TeleBot('659101762:AAH2EkRouw5QbPOCk8QLaI873B8ddSzqZ0c');
bot.on('text', (msg) => msg.reply.text(msg.text));
bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));
bot.start();