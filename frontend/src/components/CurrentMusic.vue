<template>
    <p class="CurrentMusic__info">{{ currentMusic }}</p>
</template>
<script>
import { EVENTS } from '../../settings';
export default {
    data() {
        return {
            currentMusic: ''
        }
    },
    mounted() {
        this.$socket.registerEvent(EVENTS.music_current_response, this.handleMusicResponse);
        this.$socket.emitEventOnce(EVENTS.music_current_request_forced);
        this.pollInterval = setInterval(this.pollBackEnd, 5000);
    },
    beforeDestroy() {
        this.$socket.clearEvent(EVENTS.music_current_response, this.handleMusicResponse);
        if (this.pollInterval) clearInterval(this.pollInterval)
    },
    methods: {
        handleMusicResponse([ currentMusic ]) {
            this.currentMusic = currentMusic;
        },
        pollBackEnd() {
            console.log('polling...')
            this.$socket.emitEventOnce(EVENTS.music_current_request);
        }
    },
}
</script>
<style lang="scss">
    .CurrentMusic {
        &__info {
            font-family: $font-sans-serif;
            margin: 0;
            color: $white;
            font-size: 24px;
        }
    }
</style>