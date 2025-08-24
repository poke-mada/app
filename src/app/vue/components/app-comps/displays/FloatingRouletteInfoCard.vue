<template>
  <div class="floating-card">
    <div class="d-flex flex-row align-items-center justify-center">
      <v-img class="mr-2 mt-1 mb-1" :src="get_asset()" aspect-ratio="1/2" height="32"/>
      <span class="mr-2" style="font-size: 24px; font-family: 'Segoe UI', serif">{{ wishes }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "FloatingRouletteInfoCard",
  props: {
    wishes: {
      type: Number,
      required: true
    }
  },
  methods: {
    get_asset() {
      return './assets/tiro_ruleta.webp'
    },
  },
  components: {},
  computed: {
  }
}
</script>

<style scoped>
* {
  /*border: 1px solid red;*/
}
.floating-card {
  position: relative;
  top: -4rem;
  left: 0;
  background-color: #111;
  min-width: 100px;
  max-width: 100px;
  color: white;
  padding: 10px;
  border-radius: 0 0 10px 10px;
  z-index: 9999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

* {
}
</style>