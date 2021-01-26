<template>
  <div class='Code'>
    <label for="num" class="Code__label"></label>
    <input ref="input" id="num" class="Code__input" type="number" v-model="numberInput">
    <p class="Code__last-number">
      {{ previousNumber }}
    </p>
  </div>
</template>

<script>
  import { EVENTS } from '../../settings';
  export default {
    name: 'Code',
    data() {
      return {
        numberInput : '',
        previousNumber : '-'
      }
    },
    watch : {
      numberInput() {
        if (this.forcedUpdate) {
          this.forcedUpdate = false;
          return;
        }
        clearTimeout(this.acceptTimeout);
        this.acceptTimeout = setTimeout(this.acceptNumber, 500);
      }
    },
    mounted() {
      this.$refs.input.focus();
    },
    methods : {
      acceptNumber() {
        this.$socket.emitEventOnce(EVENTS.code, this.numberInput);
        this.previousNumber = this.numberInput;
        this.numberInput = '';
        this.forcedUpdate = true;
      }
    }
  }
</script>

<style lang='scss'>
  .Code {
    position: relative;
    height: 100vh;
    width: 100vw;
    background: $highlight;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: $font-sans-serif;
    
    &__label {
      position: fixed;
      z-index: 2;
      height: 100%;
      width: 100%;
    }
    &__input {
      position: relative;
      z-index: 1;
      font-size: 24px;
      text-align: center;
      padding: 15px 10px;
    }
    &__last-number {
      position: relative;
      z-index: 1;
      margin: 25px 0 0;
      min-height: 18px;
      color: $white;
      font-size: 36px;
    }
  }
</style>