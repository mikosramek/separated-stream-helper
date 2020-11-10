require('dotenv').config();
const TwitchClient = require('./utils/TwitchClient');

const myClient = new TwitchClient();

// I check for a file.
// If that file exists, I grab it, and put it into the client
myClient.setSettings({
  channels: [
    'magicmiko2'
  ]
});

// If the file doesn't exist, I create the file
// Grab the settings from the client
// and put them into the new file
// Then I can Throw an error, stating the file location and the need for it to be filled out

myClient.createConnection();



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
