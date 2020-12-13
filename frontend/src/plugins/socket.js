import SocketClient from '../utils/socketio';

export default {
  install(Vue) {
    Vue.prototype.$socket = new SocketClient();
  }
};