<template>
  <div class='Home'>
    <!-- body -->
    <nav class="Home__nav">
      <router-link to="/code" class="Home__link">Code</router-link>
      <router-link to="/chat" class="Home__link">Chat</router-link>
    </nav>
    <main class="Home__dashboard">
      <div class="Home__chat">
        <ChatBox />
      </div>
      <section>
        <div class="Home__song">
          <CurrentMusic />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import ChatBox from '../components/ChatBox.vue';
import CurrentMusic from '../components/CurrentMusic.vue';
export default {
    name: "Home",
    components: { ChatBox, CurrentMusic }
}
</script>

<style lang='scss'>
.Home {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $highlight;
  display: flex;
  flex-direction: column;
  &__nav {
    display: flex;
    justify-content: space-evenly;
  }
  &__link {
    font-family: $font-sans-serif;
    color: $white;
    font-size: 24px;
    padding: 10px;
    flex-grow: 1;
    margin: 2px;
    border: 2px solid $white;
    text-align: center;
    &:hover {
      text-decoration: underline;
    }
  }
  &__dashboard {
    flex-grow: 1;
    display: flex;
  }
  &__chat {
    width: 25%;
    border: 2px solid $white;
    background: rgba($base, 0.5);
    margin: 2px;
  }
  &__song {
    border: 2px solid $white;
    background: rgba($base, 0.2);
    margin: 2px;
    padding: 25px;
  }
}
</style>