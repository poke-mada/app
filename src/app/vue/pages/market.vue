<!--suppress JSUnusedGlobalSymbols -->
<template>
  <PokemonBoxesPanel :api_token="token"/>
</template>

<script>
import PokemonBoxesPanel from "@/app/vue/components/offline-app/PokemonBoxesPanel";

export default {
  name: 'MarketPage',
  components: {
    PokemonBoxesPanel
  },
  props: {},
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      trainer_id: 0
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    },
  },
}

</script>
