const path = require('path');
const fs = require('fs');
// const TTS = require('../utils/TextToSpeech');

class PlaylistHelper {
    constructor() {
        this.map = [];
        fs.readdir(path.resolve(__dirname, 'playlists'), (err, data) => {
            if (err) throw err;
            this.map.push(...data);
        });
    }
    getPlaylist = (index) => {
        const selection = this.map[index];
        if (selection) {
            // TTS.say(`You have selected ${selection.replace('.xspf', '')}`)
            return path.resolve(__dirname, 'playlists', selection);
        }
        else {
            throw new Error('Index doesn\'t exist!');
        }
    }
}

module.exports = new PlaylistHelper();
