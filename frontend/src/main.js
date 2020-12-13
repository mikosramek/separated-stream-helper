import Vue from 'vue'
import App from './App.vue'
import socket from './plugins/socket';

Vue.config.productionTip = false
Vue.use(socket);

new Vue({
  render: h => h(App),
}).$mount('#app')
