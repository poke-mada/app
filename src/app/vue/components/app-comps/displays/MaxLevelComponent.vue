<template>
  <div class="d-flex flex-row align-items-center">
    <span class="mr-2 mr-1 font-weight-bold">Max Level:</span>
    <span class="mr-2">{{ max_level }}</span>
  </div>
</template>

<script>
import {session} from "@/stores";

export default {
  name: "MaxLevelComponent",
  data() {
    return {
      max_level: 1
    }
  },
  async mounted() {
    let trainer_response = await session.get(`/api/trainers/get_profile/`);

    const streamer_name = trainer_response.data.name;
    const dataSocket = new WebSocket(`wss://pokemon.para-mada.com/ws/data/${streamer_name}`);
    dataSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = JSON.parse(message.message);

      if (data.type === 'level_cap') {
        this.max_level = data.data;
      }

    };
  },
}
</script>

<style scoped>

</style>