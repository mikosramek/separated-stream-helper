<template>
    <div class='Chat'>
        <ChatBox class="Chat__chatbox"/>
    </div>
</template>

<script>
import ChatBox from '../components/ChatBox.vue'
export default {
  components: { ChatBox },
    name: 'Chat',
}
</script>

<style lang='scss'>
.Chat {
    position: relative;
    background: rgba($highlight, 0.2);
    height: 100vh;
}
</style>