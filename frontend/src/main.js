import Vue from 'vue';
import App from './App.vue';
import socket from './plugins/socket';
import router from './router';

import VueSanitize from "vue-sanitize";
let defaults = VueSanitize.defaults;

defaults.allowedTags = defaults.allowedTags.filter(t => {
  return t !== 'strong';
});

const defaultOptions = {
  allowedTags: [],
  allowedAttributes: {}
};

Vue.use(VueSanitize, defaultOptions);

Vue.config.productionTip = false
Vue.use(socket);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
