const axios = require('axios');
const EventBus = require('./EventBus');
const { EVENTS } = require('../settings');
const PlaylistHelper = require('../data/musicIndex');
const FileOpener = require('./FileOpener');

class Barcode {
    constructor() {
        EventBus.$on(EVENTS.receiving.code, this.codeHandler);
        this.playerHasStarted = true;
        this._authorization = `Basic ${Buffer.from(`:miko`).toString('base64')}`;
    }
    sendCommand(command) {
        return axios({
            method: 'GET',
            url : `http://127.0.0.1:8080/requests/status.xml?command=${command}`,
            headers : {
                Authorization: this._authorization
            }
        });
    }
    clearPlaylist() {
        return this.sendCommand('pl_empty');
    }
    addPlaylist(filePath) {
        return this.sendCommand(`in_play&input=${filePath}`);
    }
    codeHandler = async (code) => {
        console.log(`${code} has been scanned in!`);
        const filePath = PlaylistHelper.getPlaylist(code);
        try {
            if (this.playerHasStarted) {
                await this.clearPlaylist();
                await this.addPlaylist(filePath);
            }
            else {
                this.playerHasStarted=true;
                FileOpener.openFile(filePath);
            }
        } catch (error) {
            console.error(error.message);
            if (error.code === 'ECONNREFUSED') {
                this.playerHasStarted=true;
                FileOpener.openFile(filePath);
            }
        }
    }
}

module.exports = Barcode;