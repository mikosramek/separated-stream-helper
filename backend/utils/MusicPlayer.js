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

const musicStateKeys = ['state', 'random', 'loop', 'repeat', 'time', 'length'];

class MusicPlayer {
    constructor() {
        this.playerHasStarted = true;
        this.currentTrack = null;
        this.oldState = {};
        musicStateKeys.forEach((key) => {
            this.oldState[key] = null;
        })

        EventBus.$on(EVENTS.receiving.code, this.codeHandler);
        EventBus.$on(EVENTS.receiving.music_current, this.pollForSong)
        EventBus.$on(EVENTS.receiving.music_current_forced, () => this.pollForSong(true))
        EventBus.$on(EVENTS.receiving.music_toggle_play, this.togglePlaying)

    }
    emitPlayerStatus(response, forceResponse = false) {
        const xml = parser.parse(response.data)
        const songInfo =_get(xml, 'root.information.category[0].info', [])
        const songAlbum = _get(songInfo, '[5]', '-');
        const songArtist = _get(songInfo, '[8]', '-');
        const songTitle = _get(songInfo, '[7]', '-');
        const currentlyPlaying = `${songTitle} | ${songArtist} | ${songAlbum}`

        
        const updatedState = {};
        let stateIsFresh = this.currentTrack !== currentlyPlaying;
        musicStateKeys.forEach((key) => {
            updatedState[key] = _get(xml, `root.${key}`, null);
            if (updatedState[key] !== this.oldState[key]) {
                stateIsFresh = true;
                this.oldState[key] = updatedState[key]
            }
        })

        if (stateIsFresh || forceResponse) {
            this.currentTrack = currentlyPlaying
            EventBus.$emit(EVENTS.sending.music_current, { currentlyPlaying, ...updatedState })
        }
    }
    togglePlaying = async() => {
        try {
            const response = await sendCommand('pl_pause');
            this.emitPlayerStatus(response, true);
        } catch (error) {
            console.error(error)
        }
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
    pollForSong = async(forceResponse = false) => {
        try {
            const response = await sendCommand('');
            this.emitPlayerStatus(response, forceResponse);
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = MusicPlayer;