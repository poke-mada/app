<template>
  <div class="d-flex flex-row align-items-center">
    <img class="mr-2 mt-1 mb-1" :src="get_asset()" height="16" width="16" />
    <span class="mr-2">{{ karma }}</span>
  </div>
</template>

<script>
import {emitter} from "@/stores";

export default {
  name: "KarmaComponent",
  data() {
    return {
      karma: 0
    }
  },
  methods: {
    get_asset() {
      return './assets/karma.png'
    },
  },
  async mounted() {
    emitter.on('karma_updated', (data) => {
      this.karma = data
    })
  },
}
</script>

<style scoped>

</style>