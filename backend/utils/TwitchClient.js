const tmi = require('tmi.js');

class TwitchClient {
  constructor() {
    this.FILE_NAME = 'twitch-client-settings.json'
    this.settings = {
      identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
      },
      channels: [
        'magicmiko2'
      ],
      options : {
        use_Music : false
      }
    }
  }

  getSettings() {
    return this.settings;
  }

  setSettings(settings) {
    this.settings = {
      ...settings
    };
  }

  createConnection () {
    this.client = new tmi.client(this.settings);
    this.client.on('connected', (addr, port) => this.onConnectedHandler(addr, port));
    this.client.on('message', (target, context, msg, self) => this.onMessageHandler(target, context, msg, self));
    this.client.on('cheer', (target, userstate) => this.onCheerHandler(target, userstate));
    this.client.on('subscription', (channel, username) => this.onSubscriptionHandler(channel, username));
    this.client.connect();
  }

  onConnectedHandler (addr, port) {
    console.log(`* connected to ${addr}:${port}`);
    console.log(`* ${this.settings.identity.username} running with these options:`);
    for (const [key, value] of Object.entries(this.settings.options)) {
      console.log(`** ${key.toLowerCase().split('_').join(' ')} : ${value}`)
    }
    console.log('* Bot is active in these channels:');
    this.settings.channels.forEach(channel => { console.log(`** ${channel}`) })
  }
  
  onCheerHandler (target, userstate) {
    this.client.say(target, `Thanks ${userstate.display-name} for the ${userstate.bits} bits!`);
  }
  
  onSubscriptionHandler (channel, username) {
    this.client.say(target, `Thanks ${username} for the subscription!`);
  }
  onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    //Ignore messages from non-broadcasters / moderators
    if(context.badges !== null && (context.badges.broadcaster !== '1' && context.badges.moderator !== '1')) { return; }
    // Remove whitespace from chat message
    const commandParts = msg.split(' ');
    //grab the command
    const commandName = commandParts[0].toLowerCase();
  
    this.client.say(target, `Command received: ${commandName}.`);
  }
}

module.exports = TwitchClient;