const tmi = require('tmi.js');
const EventBus = require('./EventBus');
const TTS = require('./TextToSpeech');
const { EVENTS } = require('../settings');
const SettingsIO = require('./SettingsIO');

const SETTINGS_FILE_NAME = 'twitch-client-settings.json'

class TwitchClient {
  constructor() {
    // auth for client
    this.identity = {
      username: process.env.BOT_USERNAME,
      password: process.env.OAUTH_TOKEN
    }
    // base settings object
    this.settings = {
      channels: [],
      options: {
        use_Music: false
      },
      commandKey: '~',
      commands: {}
    }

    // key: event from twitch
    // value: class function to handle event
    this.messageMap = {
      connected: (args) => this.onConnectedHandler(args),
      message: (args) => this.onMessageHandler(args),
      subscription: (args) => this.onSubscriptionHandler(args)
    };

    // key: command from chat, ie ~add
    // value: class function to handle command
    this.commandMap = {
      add: 'addCommand',
      say: 'say',
      alert: 'say',
      update: 'updateCommand',
      delete: 'deleteCommand'
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
    SettingsIO.updateSettings(SETTINGS_FILE_NAME, this.settings);
  }

  createConnection () {
    this.client = new tmi.client({
      identity: this.identity,
      channels: this.settings.channels
    });

    for (let [message, handler] of Object.entries(this.messageMap)) {
      this.client.on(message, (...args) => {
        handler(args);
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
    EventBus.$emit(EVENTS.sending.twitch_connected, true);
  }
  
  onCheerHandler ([ target, userstate ]) {
    EventBus.$emit(EVENTS.sending.twitch_bits, { userstate });
    this.client.say(target, `Thanks ${userstate.display-name} for the ${userstate.bits} bits!`);
  }
  
  onSubscriptionHandler ([ username ]) {
    EventBus.$emit(EVENTS.sending.twitch_sub, { username });
    this.client.say(target, `Thanks ${username} for the subscription!`);
  }
  onMessageHandler ([ target, context, msg, self ]) {
    EventBus.$emit(EVENTS.sending.twitch_message, { msg, context });
    if (self) { return; } // Ignore messages from the bot
    //Ignore messages from non-broadcasters / moderators
    if(context.badges === null && !context.badges.broadcaster && !context.badges.moderator) { return; }
    // Remove whitespace from chat message
    const commandParts = msg.split(' ');
    //grab the command
    const commandName = commandParts[0].toLowerCase();
    
    // validate the commandkey (ie ~ or !)
    if(commandName[0] !== this.settings.options.commandKey) return;

    // get the rest of the command
    const commandSlug = commandName.slice(1);
    
    // see if the command is a premade one (ie ~add) this will be a function
    const command = this.commandMap[commandSlug];

    if (command) {
      // call the function passing in the rest of the command parts
      const response = this[command](commandParts[1], commandParts.slice(2));
      if (!response) return;
      this.client.say(target, response);
    }
    else {
      // if it isn't a predefined command, look to see if we have it as a custom added one
      const customCommand = this.settings.options.commands[commandSlug];
      if (customCommand) {
        let message = customCommand.msg;
        console.log('customCommand', customCommand, 'TwitchClient@107');
        if (!message) return;
        // if the command has a variable count (%c) add one to it and insert it into the message
        if (customCommand.count !== undefined) {
          customCommand.count += 1;
          message = message.replace(/%c/g, customCommand.count);
          this.saveSettings();
        }
        this.client.say(target, message);
      }
    }
  }

  get commandKey() {
    return this.settings.options.commandKey
  }

  // ~add
  addCommand(newCommand, rest) {
    const message = rest.join(' ');
    const { commands } = this.settings.options;
    if (!newCommand || !message) return `${this.commandKey}add requires a name + message`;
    if (commands[newCommand]) return `Command already exists! Try ${this.commandKey}update instead`;
    commands[newCommand] = {
      msg : message
    };
    if (/%c/g.test(message)) commands[newCommand].count = 0;
    this.saveSettings();
    return `${this.commandKey}${newCommand} added!`;
  }


  // ~update
  updateCommand(commandToUpdate, rest) {
    const message = rest.join(' ');
    const { commands } = this.settings.options;
    if (!commandToUpdate || !message) return `${this.commandKey}add requires a name + message`;
    if (!commands[commandToUpdate]) return `${this.commandKey}${commandToUpdate} doesn't exist`;
    commands[commandToUpdate].msg = message;
    this.saveSettings();
    return `${this.commandKey}${commandToUpdate} updated!`;
  }

  // ~delete
  deleteCommand(commandToDelete) {
    const { commands } = this.settings.options;
    if (!commandToDelete) return `${this.commandKey}delete requires a command name`;
    if (!commands[commandToDelete]) return `${this.commandKey}${commandToDelete} doesn't exist`;
    delete commands[commandToDelete];
    this.saveSettings();
    return `${this.commandKey}${commandToDelete} removed`
  }

  // ~say ~alert
  say(text, rest) {
    const words = `${text} ${rest.join(' ')}`
    TTS.say(words);
  }

}

module.exports = {
  TwitchClient,
  SETTINGS_FILE_NAME
};