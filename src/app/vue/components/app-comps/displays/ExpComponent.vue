<template>
  <div class="d-flex flex-row align-items-center justify-center">
    <img class="mr-2 mt-1 mb-1" :src="get_asset()" height="32" width="32" />
  </div>
</template>

<script>
import {emitter} from "@/stores";

export default {
  name: "ExpComponent",
  data() {
    return {
      experience: 0
    }
  },
  methods: {
    get_asset() {
      switch (this.experience) {
        case 4:
        case 3.5:
        case 3:
          return './assets/shields/shield-poke.png'
        case 2.5:
        case 2:
          return './assets/shields/shield-super.png'
        case 1.5:
        case 1:
        case 0.5:
          return './assets/shields/shield-ultra.png'
        case 0:
          return './assets/shields/shield-master.png'
      }
      return './assets/shields/shield-poke.png'
    },
  },
  async mounted() {
    emitter.on('exp_updated', (data) => {
      this.experience = data
    })
  },
}
</script>

<style scoped>
</style>