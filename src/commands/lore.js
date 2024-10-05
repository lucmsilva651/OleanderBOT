const axios = require("axios");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function mediaWikiToMarkdown(input) {
  input = input.replace(/===(.*?)===/g, '*$1*');
  input = input.replace(/==(.*?)==/g, '*$1*');
  input = input.replace(/=(.*?)=/g, '*$1*');
  input = input.replace(/'''(.*?)'''/g, '**$1**');
  input = input.replace(/''(.*?)''/g, '_$1_');
  input = input.replace(/^\*\s/gm, '- ');
  input = input.replace(/^\#\s/gm, '1. ');
  input = input.replace(/{{Quote(.*?)}}/g, "```\n$1```\n");
  input = input.replace(/\[\[(.*?)\|?(.*?)\]\]/g, (_, link, text) => {
    const sanitizedLink = link.replace(/ /g, '_'); // Substituir espaços por underscores
    return text ? `[${text}](${sanitizedLink})` : `[${sanitizedLink}](${sanitizedLink})`;
  });
  input = input.replace(/\[\[File:(.*?)\|.*?\]\]/g, '![$1](https://themsfightinherds.fandom.com/wiki/File:$1)');

  return input;
}

module.exports = (bot) => {
  bot.command("lore", async (ctx) => {
    const userInput = capitalizeFirstLetter(ctx.message.text.split(' ')[1]);
    const apiUrl = `https://themsfightinherds.fandom.com/index.php?title=${userInput}&action=raw`;
    const response = await axios(apiUrl, { headers: { 'Accept': "text/plain" } });
    
    // Limpa a resposta e remove a infobox
    const convertedResponse = response.data.replace(/<\/?div>/g, "").replace(/{{Infobox.*?}}/s, "");
    
    const result = mediaWikiToMarkdown(convertedResponse).slice(0, 2048);
    
    ctx.reply(result, { parse_mode: 'Markdown', disable_web_page_preview: true, reply_to_message_id: ctx.message.message_id });
  });
};
