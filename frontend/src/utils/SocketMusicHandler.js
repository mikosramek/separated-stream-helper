import { EVENTS } from '../../settings'

class SocketMusicHandler {
    constructor(socketHandler) {
        this.socket = socketHandler;
        this.pollInterval = null;
        this.currentEventListeners = 0;
    }
    init() {
        this.pollInterval = setInterval(() => {
            if (this.currentEventListeners > 0) {
                this.pollBackEnd();
            }
        }, 5000); 
        this.pollBackEnd(true);
    }
    destroy() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        this.currentEventListeners = 0;
    }
    registerInfoCallback(callback) {
        this.socket.registerEvent(EVENTS.music_current_response, callback);
        this.currentEventListeners += 1;
        return () => {
            this.currentEventListeners -= 1;
            this.socket.clearEvent(EVENTS.music_current_response, callback);
        }
    }
    pollBackEnd(forced = false) {
        this.socket.emitEventOnce(forced ? EVENTS.music_current_request_forced : EVENTS.music_current_request);
    }
    togglePlayback() {
        this.socket.emitEventOnce(EVENTS.music_toggle_play);
    }
}

export default SocketMusicHandler