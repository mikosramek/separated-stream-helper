<template>
    <p class="CurrentMusic__info" v-html="parsedSongName" />
</template>
<script>
export default {
    props: {
        linebreak: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentMusic: '- | - | -'
        }
    },
    computed: {
        parsedSongName() {
            if (this.currentMusic.length < 70 || !this.linebreak) return this.currentMusic
            return this.currentMusic.replace(/\|/gi, '<br />')
        }
    },
    mounted() {
        this.destroyListener = this.$music.registerInfoCallback(this.handleMusicResponse);
        this.$music.pollBackEnd(true);
    },
    beforeDestroy() {
        this.destroyListener();
    },
    methods: {
        handleMusicResponse([ { currentlyPlaying } ]) {
            this.currentMusic = currentlyPlaying;
        },
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