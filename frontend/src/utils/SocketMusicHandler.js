import { EVENTS } from '../../settings'

class SocketMusicHandler {
    constructor(socketHandler) {
        this.socket = socketHandler;
        this.pollInterval = null;
    }
    init() {
        console.log('initing socket music handler')
        this.pollInterval = setInterval(() => this.pollBackEnd(), 5000); 
        this.pollBackEnd(true);
    }
    destroy() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }
    registerInfoCallback(callback) {
        this.socket.registerEvent(EVENTS.music_current_response, callback);
        return () => this.socket.clearEvent(EVENTS.music_current_response, callback)
    }
    pollBackEnd(forced = false) {
        this.socket.emitEventOnce(forced ? EVENTS.music_current_request_forced : EVENTS.music_current_request);
    }
    togglePlayback() {
        this.socket.emitEventOnce(EVENTS.music_toggle_play);
    }
}

export default SocketMusicHandler