<template>
  <div class="floating-card">
    <CoinsComponent :coins="this.coins" />
  </div>
</template>

<script>
import CoinsComponent from '@/app/vue/components/offline-app/CoinsComponent'
import {emitter} from "@/stores";

export default {
  name: "FloatingInfoCardComponent",
  components: {
    CoinsComponent,
  },
  methods: {
    async refresh_wildcard_count() {
      if (!localStorage.getItem('api_token')) {
        return;
      }
    }
  },
  computed: {
  },
  async mounted() {
    await this.refresh_wildcard_count();
    emitter.on('coins_updated', (data) => {
      console.log(data)
      this.coins = data
    })
  },
  data() {
    return {
      coins: parseInt(localStorage.getItem('coins')),
      wildcard_count: 0
    }
  }
}
</script>

<style scoped>
.floating-card {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #111;
  color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  pointer-events: none;
}
</style>