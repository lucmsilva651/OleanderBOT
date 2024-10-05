const { getStrings } = require('../plugins/checklang.js');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.reply(Strings.botWelcome, { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
  });
};