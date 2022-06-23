
module.exports = {
  CHANNEL_NAME: 'magicmiko2',
  EVENTS: {
    receiving: {
      code: 'barcode:code',
      music_current: 'music:current-info-request',
      music_current_forced: 'music:current-info-request--force'
    },
    sending: {
      twitch_message: 'twitch:message',
      twitch_sub: 'twitch:subscription',
      twitch_resub: 'twitch:resubscription',
      twitch_bits: 'twitch:bits',
      twitch_connected: 'twitch:connected',
      music_current: 'music:current-info-response'
    }
  }
}
