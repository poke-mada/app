<template>
  <div class="floating-card">
    <CoinsComponent />
    <KarmaComponent />
    <ExpComponent class="ml-2"/>
  </div>
</template>

<script>
import CoinsComponent from '@/app/vue/components/offline-app/CoinsComponent'
import KarmaComponent from '@/app/vue/components/app-comps/displays/KarmaComponent'
import ExpComponent from '@/app/vue/components/app-comps/displays/ExpComponent'
import {useGameStore} from "@/stores/app";

export default {
  name: "FloatingInfoCardComponent",
  components: {
    CoinsComponent,
    KarmaComponent,
    ExpComponent
  },
  computed: {
    store() {
      return useGameStore()
    },
    profile() {
      return this.store.profile_data
    },
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
* {
}
</style>