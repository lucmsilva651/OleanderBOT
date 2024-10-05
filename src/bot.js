const { Telegraf } = require('telegraf');
const Config = require('./props/config.json');
const bot = new Telegraf(Config.botToken);

const maxRetries = 5;
let restartCount = 0;

const loadCommands = () => {
  const fs = require('fs');
  const path = require('path');
  const commandsPath = path.join(__dirname, 'commands');

  fs.readdirSync(commandsPath).forEach((file) => {
    const command = require(path.join(commandsPath, file));
    if (typeof command === 'function') {
      command(bot);
    };
  });
};

const startBot = async () => {
  try {
    await bot.launch();
    console.log('Bot is running...');
    restartCount = 0;
  } catch (error) {
    console.error('Failed to start bot:', error.message);
    if (restartCount < maxRetries) {
      restartCount++;
      console.log(`Retrying to start bot... Attempt ${restartCount}`);
      setTimeout(startBot, 5000);
    } else {
      console.error('Maximum retry attempts reached. Exiting.');
      process.exit(1);
    }
  }
};

const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Stopping bot...`);
  bot.stop(signal);
};

process.once('SIGINT', () => handleShutdown('SIGINT'));
process.once('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

loadCommands();
startBot();
