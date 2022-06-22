const http = require('http');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const express = require('express');
const EventBus = require('./EventBus');
const { EVENTS } = require('../settings');


class SocketClient {
    constructor() {
        // setup express app with socketio listening on it
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.expressApp.use(bodyParser.json({ limit: '50mb' }));
        this.expressApp.use(bodyParser.urlencoded({
            extended: true,
            limit: '50mb',
        }));

        this.io = socket(
            this.httpServer,
            { serveClient: false, cors: { origin: '*' } }
        );

        this.io.on('connection', (socket) => {
            socket.join('stream-helper');
            socket.emit('joined-room');
            for (const [_key, value] of Object.entries(EVENTS.receiving)) {
                socket.on(value, (data) => {
                    EventBus.$emit(value, data);
                })
            }
        });
        
        // register events that we'll want to send to our socket server
        for (const [_key, value] of Object.entries(EVENTS.sending)) {
            this.registerSendingEvent(value);
        }

        this.httpServer.listen({
            host: '0.0.0.0',
            port: '1337'
        });
    }

    registerSendingEvent = (event) => {
        EventBus.$on(event, (...args) => {
            this.io.to('stream-helper').emit(event, args);
        });
    }
}

module.exports = SocketClient;