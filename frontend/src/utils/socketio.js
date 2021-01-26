import { io } from 'socket.io-client';

class SocketIO {
    init() {
        this.connected = false;
        this.socket = io('192.168.0.149:1337');
        this.socket.on('joined-room', () => {
            this.connected = true;
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