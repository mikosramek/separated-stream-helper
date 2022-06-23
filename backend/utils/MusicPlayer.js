const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const _get = require('lodash.get')
const EventBus = require('./EventBus');
const { EVENTS } = require('../settings');
const PlaylistHelper = require('./PlaylistHelper');
const FileOpener = require('./FileOpener');

const VLC_AUTH_TOKEN = `Basic ${Buffer.from(`:${process.env.VLC_PASSWORD}`).toString('base64')}`;
const parser = new XMLParser();

function sendCommand(command) {
    return axios({
        method: 'GET',
        url: `http://127.0.0.1:8080/requests/status.xml?command=${command}`,
        headers: {
            Authorization: VLC_AUTH_TOKEN,
            Accept: 'application/xml'
        }
    });
}

class CurrentMusicHandler {
    constructor() {
        this.currentTrack = null
        EventBus.$on(EVENTS.receiving.music_current, this.pollForSong)
        EventBus.$on(EVENTS.receiving.music_current_forced, () => this.pollForSong(true))
    }
    pollForSong = async(forceResponse = false) => {
        try {
            const response = await sendCommand('')
            const xml = parser.parse(response.data)
            const songInfo =_get(xml, 'root.information.category[0].info', [])
            const songAlbum = _get(songInfo, '[5]', 'unknown');
            const songArtist = _get(songInfo, '[8]', 'unknown');
            const songTitle = _get(songInfo, '[7]', 'unknown');
            const infoString = `${songTitle} | ${songArtist} | ${songAlbum}`
            if (this.currentTrack !== infoString || forceResponse) {
                this.currentTrack = infoString
                EventBus.$emit(EVENTS.sending.music_current, infoString)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

class MusicPlayer {
    constructor() {
        EventBus.$on(EVENTS.receiving.code, this.codeHandler);
        this.playerHasStarted = true;
        this.currentMusicHandler = new CurrentMusicHandler();
    }
    clearPlaylist() {
        return sendCommand('pl_empty');
    }
    addPlaylist(filePath) {
        return sendCommand(`in_play&input=${filePath}`);
    }
    codeHandler = async (code) => {
        console.log(`${code} has been scanned in!`);
        try {
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
        } catch (error) {
            console.error(error.message);
        }

    }
}

module.exports = MusicPlayer;