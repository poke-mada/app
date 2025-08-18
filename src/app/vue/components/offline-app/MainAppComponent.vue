<template>
  <PokemonTeamPanel/>
</template>

<script>
import PokemonTeamPanel from '@/app/vue/components/PokemonTeamPanel';

export default {
  name: "MainAppComponent",
  components: {
    PokemonTeamPanel,
  },
  props: {
    api_token: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      interval: 0,
      trainer_data: {
      },
    }
  },
  mounted() {
  },
  unmounted() {
    clearInterval(this.interval)
  },
  updated() {
    this.disable_displays()
  },
}
</script>

<style scoped>
.disabled {
  color: #9e9e9e;
  box-shadow: none;
}

.disabled:hover {
  color: #9e9e9e;
  background: none;
}
</style>
