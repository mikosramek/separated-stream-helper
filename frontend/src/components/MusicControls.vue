<template lang="">
    <div>
        <button @click="togglePlaybackState">{{state}}</button>
        <button @click="togglePlaybackState">{{`shuffle: ${random ? 'on' : 'off'}`}}</button>
        <button @click="togglePlaybackState">{{`loop: ${loop ? 'on' : 'off'}`}}</button>
        <button @click="togglePlaybackState">{{`repeat: ${repeat ? 'on' : 'off'}`}}</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            state: 'playing',
            random: false,
            loop: false,
            repeat: false,
            time: 0,
            length: 0
        }
    },
    mounted() {
        this.destroyListener = this.$music.registerInfoCallback(this.handleMusicResponse);
    },
    beforeDestroy() {
        this.destroyListener();
    },
    methods: {
        handleMusicResponse([{ state, random, loop, repeat, time, length }]) {
            this.state = state;
            this.random = random;
            this.loop = loop;
            this.repeat = repeat;
            this.time = time;
            this.length = length;
        },
        togglePlaybackState() {
            this.$music.togglePlayback();
        }
    },
}
</script>
<style lang="scss">
    
</style>