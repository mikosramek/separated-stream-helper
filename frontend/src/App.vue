<template>
  <div id="app">
    <router-view v-if="connected"/>
    <!-- could do a v-else loading state? -->
  </div>
</template>

<script>
import './styles/index.scss';

export default {
  name: 'App',
  data() {
    return {
      connected: true
    }
  },
  created() {
    this.$socket.init(() => {
      this.$music.init();
      // this.connected = true;
    });
  },
  beforeDestroy() {
    this.$music.destroy();
  },
}
</script>

<style lang="scss">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
