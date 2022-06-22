<template>
  <ul
    ref="chatbox"
    class="ChatBox"
  >
    <li
      v-for="(message, index) of parsedMessages"
      :key=index
      ref="messages"
      class="ChatBox__message-container"
    >
        <ChatBadges v-if="message.badges" :badges="message.badges" />
      <span :style="message.style" class="ChatBox__message-name">
        {{ message.name }}:
      </span>
      <span class="ChatBox__message-text" v-html="message.parsedMessage" />
    </li>
  </ul>
</template>

<script>
import { EVENTS } from '../../settings';
import ChatBadges from './ChatBadges.vue';

// emotes: {
// 305574557:[
//   0:"18-25"
//   1:"52-59"
//  ]
// }
// `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`

export default {
  components : { ChatBadges },
  data() {
    return {
      messages: []
    };
  },
  computed : {
    parsedMessages() {
      return this.messages.map((message) => {
        const {
          'display-name' : name,
          badges,
          color,
          'user-id' : id,
          emotes
        } = message.context;

        return {
          name,
          badges,
          color,
          id,
          emotes,
          parsedMessage : message.msg,
          style : {
            color,
            opacity : 0.6
          }
        }
      });
    }
  },
  mounted() {
    this.$socket.registerEvent(EVENTS.twitch_message, this.handleMessage);
    // this.createDummyMessages();
  },
  beforeDestroy() {
      this.$socket.clearEvent(EVENTS.twitch_message, this.handleMessage);
  },
  methods : {
    createDummyMessages() {
      for (let i = 0; i < 10; i++) {
        this.handleMessage([{
          msg : 'PogChamp HahaCat PogChamp', //.repeat(ran),
          context : {
            color : '#ff0000',
            'display-name' : 'miko',
            badges : {
              broadcaster : 1,
              moderator : 1
            },
            emotes : {
              301108083 : [
                "9-15"
              ],
              305574557 : [
                "0-7",
                "17-24"
              ]
            }
          }
        }]);
      }
    },
    handleMessage([ message ]) {
      const {
        emotes
      } = message.context;

      const mappedEmotes = [];
      for (let emote in emotes) {
        emotes[emote].forEach((location) => {
            mappedEmotes.push({
              location : location.split('-').map(index => parseInt(index)),
              id : emote
            });
        });
      }

      const sortedEmotes = mappedEmotes.sort((a, b) => {
        if (a.location[0] < b.location[0]) return -1;
        else if (a.location[0] > b.location[0]) return 1;
        else return 0;
      })

      const emoteMap = {};
      let msg = message.msg;
      let offset = 0;

      sortedEmotes.forEach((emote) => {
        const indices = emote.location.map(index => index + offset);
        if (!emoteMap[emote.id]) {
          emoteMap[emote.id] = [indices[0]];
        }
        else {
          emoteMap[emote.id].push(indices[0]);
        }
        const replacement = `<<${emote.id}>>`;
        const emoteLength = msg.substr(indices[0], indices[1] - indices[0] + 1).length;
        offset += replacement.length - emoteLength;
        msg = msg.substr(0, indices[0]) + replacement + msg.substr(indices[1] + 1);
      });

      msg = this.$sanitize(msg);
      
      for(let emote in emoteMap) {
        msg = msg.replace(new RegExp(`&lt;&lt;${emote}*&gt;&gt;`, 'g'), `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${emote}/1.0">`);
      }
      this.messages.push({
        ...message,
        msg
      });
      const { chatbox } = this.$refs;
      chatbox.scrollTop = chatbox.scrollHeight;
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
    &-container {
      color: $black;
      padding: 10px 15px;
      background: rgba($base, 0.3);
      font-family: $font-sans-serif;
      &:nth-of-type(2n) {
        background: rgba($white, 0.6);
      }
    }
    &-name {
      font-weight: bold;
      text-shadow: 0 1px 0 rgba($black, 0.6);
    }
  }
}
</style>