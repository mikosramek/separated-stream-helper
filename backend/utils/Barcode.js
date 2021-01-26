const EventBus = require('./EventBus');
const TTS = require('./TextToSpeech');
const { EVENTS } = require('../settings');

class Barcode {
    constructor() {
        EventBus.$on(EVENTS.receiving.code, this.codeHandler);
    }
    codeHandler(code) {
        console.log(`${code} has been scanned in!`);
    }
}

module.exports = Barcode;