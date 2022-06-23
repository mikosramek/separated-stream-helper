import SocketMusicHandler from '../utils/SocketMusicHandler';

export default {
  install(Vue) {
    Vue.prototype.$music = new SocketMusicHandler(Vue.prototype.$socket);
  }
};