<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './styles/index.scss';

export default {
  name: 'App',
  created() {
    this.$socket.init();
  }
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
