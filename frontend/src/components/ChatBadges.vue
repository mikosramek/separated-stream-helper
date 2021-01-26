<template>
    <div class='ChatBadges'>
        <!-- body -->
        <span
          v-for="(badge, index) of badgesToShow"
          :key="index"
          class="ChatBadges__badge-container"
        >
          <span class="ChatBadges__badge-flex">
            <img :src="badge" class="ChatBadges__badge-icon" />
          </span>
        </span>
    </div>
</template>

<script>
  // https://badges.twitch.tv/v1/badges/global/display
  const BADGES = {
    'broadcaster' : 'https://cdn.frankerfacez.com/static/badges/twitch/2/broadcaster/1/1.png',
    'moderator' : 'https://cdn.frankerfacez.com/static/badges/twitch/2/moderator/1/1.png',
    'premium' : 'https://cdn.frankerfacez.com/static/badges/twitch/2/premium/1/1.png',
    'staff' : 'https://cdn.frankerfacez.com/static/badges/twitch/2/staff/1/1.png'
  }
  export default {
    name: 'ChatBadges',
    props : {
      badges : {
        type : Object,
        required : true
      }
    },
    computed : {
      badgesToShow() {
        const map = [];
        for (let type in BADGES) {
          if (this.badges[type]) {
            map.push(BADGES[type]);
          }
        }
        return map;
      }
    }
  }
</script>

<style lang='scss'>
  .ChatBadges {
    position: relative;
    display: inline-block;
    &__badge {
      &-container {
        opacity: 1;
        background: $base;
        box-shadow: 0 1px 1px darken($base, 20);
        display: inline-block;
        padding: 4px;
        border-radius: 5px;
        margin-right: 4px;
      }
      &-flex {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-icon {
        width: 15px;
        height: 15px;
        filter: drop-shadow(0 1px 0 darken($base, 20));
      }
    }
  }
</style>