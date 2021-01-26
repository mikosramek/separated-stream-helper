
module.exports = {
  CHANNEL_NAME : 'magicmiko2',
  EVENTS : {
    receiving: {
      code : 'barcode:code',
    },
    sending : {
      twitch_message : 'twitch:message',
      twitch_sub : 'twitch:subscription',
      twitch_resub : 'twitch:resubscription',
      twitch_bits : 'twitch:bits',
      twitch_connected : 'twitch:connected',
    }
  }
}
