import Vue from 'vue'
import App from './App.vue'
import socket from './plugins/socket';
import router from './router'

Vue.config.productionTip = false
Vue.use(socket);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
