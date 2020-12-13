require('dotenv').config();
const TwitchClient = require('./utils/TwitchClient');
const SettingsIO = require('./utils/SettingsIO');
const SocketClient = require('./utils/SocketClient');

// console.clear();

const myClient = new TwitchClient();

const settingsMap = [
  {
    file : myClient.FILE_NAME,
    set : (settingsFromFile) => { myClient.setSettings(settingsFromFile) },
    defaults : myClient.settings
  }
];


const finalizeConnections = () => {
  myClient.createConnection();
};

SettingsIO.setupSettings(settingsMap, finalizeConnections);


// const socketClient = 
new SocketClient();