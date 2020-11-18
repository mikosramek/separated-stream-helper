require('dotenv').config();
const TwitchClient = require('./utils/TwitchClient');
const SettingsIO = require('./utils/SettingsIO');

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


const http = require('http');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const express = require('express');
const EventBus = require('./utils/EventBus');

const expressApp = express();
const httpServer = http.createServer(expressApp);

expressApp.use(bodyParser.json({ limit: '50mb' }));
expressApp.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
}));

const io = socket(httpServer, { serveClient: false });

io.on('connection', (socket) => {
  socket.join('stream-helper');
});


EventBus.$on('twitch:message', ({ msg, context }) => {
  // console.log(msg);
  // console.log(context);
});