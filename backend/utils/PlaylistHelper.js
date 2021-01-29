const path = require('path');
const fs = require('fs');
// const TTS = require('../utils/TextToSpeech');

class PlaylistHelper {
    constructor() {
        this.map = [];
        fs.readdir(path.resolve(__dirname, '..', 'data', 'playlists'), (err, data) => {
            if (err) throw err;
            this.map.push(...data);
            this.map = this.map.filter(file => file.includes('.xspf'));
        });
    }
    getPlaylist = (index) => {
        const selection = this.map[index];
        if (selection) {
            // TTS.say(`You have selected ${selection.replace('.xspf', '')}`)
            return path.resolve(__dirname, '..', 'data', 'playlists', selection);
        }
        else {
            throw new Error('Index doesn\'t exist!');
        }
    }
}

module.exports = new PlaylistHelper();
