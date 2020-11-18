const { v4: uuidv4 } = require('uuid');

class EventBus {
    constructor() {
        this.events = {};
    }
    $on(event, callback) {
        const id = uuidv4();

        if(!this.events[event]) this.events[event] = {};
        
        this.events[event][id] = callback;
        return {
            $off : () => {
                delete this.events[event][id];
                if (this.events[event].length <= 0) {
                    this.events[event] = {};
                }
            }
        };
    }
    $emit(event, arg) {
        if(!this.events[event]) return;
        
        for (const [key, value] of Object.entries(this.events[event])) {
            value(arg);
        }
    }
}

module.exports = new EventBus();
