<template>
  <div class="d-flex flex-row align-items-center">
    <img class="mr-2 mt-1 mb-1" :src="get_asset()" height="16" width="16" />
    <span class="mr-2">{{ karma }}</span>
  </div>
</template>

<script>
export default {
  name: "KarmaComponent",
  data() {
    return {
      karma: 1
    }
  },
  methods: {
    get_asset() {
      return './assets/karma.png'
    },
  },
  async mounted() {
    const streamer_name = localStorage.getItem('streamer_name');
    const dataSocket = new WebSocket(`wss://pokemon.para-mada.com/ws/data/${streamer_name}`);
    dataSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = JSON.parse(message.message);

      if (data.type === 'karma') {
        this.karma = data.data;
      }

    };
  },
}
</script>

<style scoped>

</style>