<template>
  <ul
    class="ChatBox"
  >
    <li
      v-for="(message, index) of messages"
      :key=index
    >
      {{ message.msg }}
    </li>
  </ul>
</template>

<script>
import { EVENTS } from '../../settings';

export default {


data() {
  return {
    messages: []
  };
},
mounted() {
  this.$socket.registerEvent(EVENTS.twitch_message, this.handleMessage);
},
methods : {
  handleMessage([ message ]) {
    this.messages.push(message);
  }
}
}
</script>

<style scss>

</style>