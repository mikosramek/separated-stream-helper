require('dotenv').config();
const TwitchClient = require('./utils/TwitchClient');
const SettingsIO = require('./utils/SettingsIO');

// console.clear();

const myClient = new TwitchClient();

// I check for a file.
// If that file exists, I grab it, and put it into the client
SettingsIO.checkForFolder();
// const settings = SettingsIO.getSettings(myClient.FILE_NAME);

const settingFiles = [
  {
    file : myClient.FILE_NAME,
    set : (settings) => { myClient.setSettings(settings) },
    defaults : myClient.settings
  }
];
const allSettingPromises = settingFiles.map((settings) => SettingsIO.getSettings(settings.file));

Promise.all(allSettingPromises).then((values) => {
  values.forEach((settings, i) => {
    const sFile = settingFiles[i];
    if (!settings) {
      // write default settings
      SettingsIO.writeFileSettings(sFile.file, sFile.defaults);
    } 
    else {
      // grab them
      sFile.set(settings);
    }
  });
  finalizeConnections();
});

// If the file doesn't exist, I create the file
// Grab the settings from the client
// and put them into the new file
// Then I can Throw an error, stating the file location and the need for it to be filled out

// console.log(myClient.settings);

// 

const finalizeConnections = () => {
  myClient.createConnection();
};



// import http from 'http';
// import socket from 'socket.io';
// import bodyParser from 'body-parser';

// const expressApp = express();
// const httpServer = http.createServer(expressApp);

// expressApp.use(bodyParser.json({ limit: '50mb' }));
// expressApp.use(bodyParser.urlencoded({
//   extended: true,
//   limit: '50mb',
// }));

// const io = socket(httpServer, { serveClient: false });

// io.on('connection', (socket) => {
//   socket.join(this.roomCode);
// })
