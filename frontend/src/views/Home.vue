<template>
  <div class='Home'>
    <!-- body -->
    <router-link to="/code" class="Home__link">Code</router-link>
    <router-link to="/chat" class="Home__link">Chat</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style lang='scss'>
.Home {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  width: 100vw;
  background: $highlight;
  &__link {
    font-family: $font-sans-serif;
    color: $white;
    font-size: 24px;
    padding: 25px 0;
  }
}
</style>