const tmi = require('tmi.js');
const EventBus = require('./EventBus');
const TTS = require('./TextToSpeech');
const { EVENTS } = require('../settings');
const SettingsIO = require('./SettingsIO');

class TwitchClient {
  constructor() {
    this.FILE_NAME = 'twitch-client-settings.json'
    this.identity = {
      username: process.env.BOT_USERNAME,
      password: process.env.OAUTH_TOKEN
    }
    this.settings = {
      channels: [],
      options : {
        use_Music : false
      },
      commandKey : '~',
      commands : {}
    }

    this.messageMap = {
      connected : 'onConnectedHandler',
      message : 'onMessageHandler',
      subscription : 'onSubscriptionHandler'
    };

    this.commandMap = {
      add : 'addCommand',
      say : 'say',
      alert : 'say'
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

  saveSettings() {
    SettingsIO.updateSettings(this.FILE_NAME, this.settings);
  }

  createConnection () {
    this.client = new tmi.client({
      identity : this.identity,
      channels : this.settings.channels
    });

    for (let [message, handler] of Object.entries(this.messageMap)) {
      this.client.on(message, (...args) => {
        this[handler](args);
      });
    }

    this.client.connect();
  }

  onConnectedHandler ([ addr, port ]) {
    console.log(`* connected to ${addr}:${port}`);
    console.log(`* ${this.identity.username} running with these options:`);
    for (const [key, value] of Object.entries(this.settings.options)) {
      console.log(`** ${key.toLowerCase().split('_').join(' ')} : ${value}`);
    }
    console.log('* Bot is active in these channels:');
    this.settings.channels.forEach(channel => { console.log(`** ${channel}`) });
    EventBus.$emit(EVENTS.TWITCH_CONNECTED, true);
  }
  
  onCheerHandler ([ target, userstate ]) {
    EventBus.$emit(EVENTS.TWITCH_BITS, { userstate });
    this.client.say(target, `Thanks ${userstate.display-name} for the ${userstate.bits} bits!`);
  }
  
  onSubscriptionHandler ([ username ]) {
    EventBus.$emit(EVENTS.TWITCH_SUB, { username });
    this.client.say(target, `Thanks ${username} for the subscription!`);
  }
  onMessageHandler ([ target, context, msg, self ]) {
    EventBus.$emit(EVENTS.TWITCH_MESSAGE, { msg, context });
    if (self) { return; } // Ignore messages from the bot
    //Ignore messages from non-broadcasters / moderators
    if(context.badges === null && !context.badges.broadcaster && !context.badges.moderator) { return; }
    // Remove whitespace from chat message
    const commandParts = msg.split(' ');
    //grab the command
    const commandName = commandParts[0].toLowerCase();
    
    if(commandName[0] !== this.settings.options.commandKey) return;

    const commandSlug = commandName.slice(1);
    
    const command = this.commandMap[commandSlug];

    if (command) {
      const response = this[command](commandParts[1], commandParts.slice(2));
      if (!response) return;
      this.client.say(target, response);
    }
    else {
      const customCommand = this.settings.options.commands[commandSlug];
      if (customCommand) {
        let message = customCommand.msg;
        console.log('customCommand', customCommand, 'TwitchClient@107');
        if (customCommand.count !== undefined) {
          customCommand.count += 1;
          message = message.replace(/%c/g, customCommand.count);
          this.saveSettings();
        }
        if (!message) return;
        this.client.say(target, message);
      }
    }
  }


  // ~add docs Go here to access my docs: https://www.notion.so/hamgames/Separated-Stream-Help-9502d9e9baad47e6b3eebb640031d183
  addCommand(newCommand, rest) {
    const message = rest.join(' ');
    const { commands } = this.settings.options;
    if (commands[newCommand]) return 'Command already exists!';
    commands[newCommand] = {
      msg : message
    };
    if (/%c/g.test(message)) commands[newCommand].count = 0;
    this.saveSettings();
    return `New command '${newCommand}' added!`
  }

  say(text, rest) {
    const words = `${text} ${rest.join(' ')}`
    TTS.say(words);
  }

}

module.exports = TwitchClient;