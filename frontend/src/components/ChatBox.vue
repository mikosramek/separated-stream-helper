<template>
  <ul
    ref="chatbox"
    class="ChatBox"
  >
    <li
      v-for="(message, index) of messages"
      :key=index
      ref="messages"
      class="ChatBox__message"
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
    messages: [
      {
        msg : 'hi'
      }
    ]
  };
},
mounted() {
  this.$socket.registerEvent(EVENTS.twitch_message, this.handleMessage);
  for (let i = 0; i < 20; i++) {
    const ran = Math.floor(Math.random() * 10) + 1;
    this.messages.push({
      msg : 'hi '.repeat(ran)
    })
  }
},
beforeDestroy() {
  this.$socket.clearEvent(EVENTS.twitch_message, this.handleMessage);
},
methods : {
  handleMessage([ message ]) {
    this.messages.push(message);
    // this.$refs.chatbox.scrollIntoView();
    const { messages } = this.$refs;
    messages[messages.length - 1].scrollIntoView();
  }
}
}
</script>

<style lang="scss">
.ChatBox {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  &__message {
    color: white;
    padding: 10px 15px;
    background: rgba(black, 0.3);
    &:nth-of-type(2n) {
      background: rgba(black, 0.4);
    }
  }
}
</style>