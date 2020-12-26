import { io } from 'socket.io-client';

class SocketIO {
    init() {
        this.connected = false;
        this.socket = io('localhost:1337');
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
}

export default SocketIO;