<template>
    <div class='Song'>
        <CurrentMusic />
    </div>
</template>

<script>
import CurrentMusic from '../components/CurrentMusic.vue';
export default {
  components: { CurrentMusic },
    name: 'Song',
}
</script>

<style lang='scss'>
.Song {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100vh;
    padding: 0 15px;
}
</style>