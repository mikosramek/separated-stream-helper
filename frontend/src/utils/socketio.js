import { io } from 'socket.io-client';

class SocketIO {
    init(callback) {
        this.connected = false;
        this.socket = io(process.env.VUE_APP_BACKEND_SERVER);
        this.socket.on('joined-room', () => {
            this.connected = true;
            callback();
        });
    }
    registerEvent = (event, callback) => {
        this.socket.on(event, callback);
    }
    clearEvent = (event, callback) => {
        this.socket.off(event, callback);
    }
    emitEventOnce = (event, data) => {
        this.socket.emit(event, data);
    }
}

export default SocketIO;