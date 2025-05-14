<!--suppress JSUnusedGlobalSymbols -->
<template>
  <PokemonBoxesPanel :api_token="token" :trainer_id="trainer_id"/>
</template>

<script>
import PokemonBoxesPanel from "@/app/vue/components/offline-app/PokemonBoxesPanel";

export default {
  name: 'BoxesPage',
  components: {
    PokemonBoxesPanel
  },
  props: {},
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      trainer_id: parseInt(localStorage.getItem('trainer_id') || 1)
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    }
  }
}

</script>
