<template>
  <DualPokemonPanel :pk_dex="this.team_data.selected_pokemon[0]" team="you" :team_data="this.team_data" :enemy_data="enemy_data"/>
</template>

<script>
import DualPokemonPanel from '@/components/basic-comps/DualPokemonPanel'

export default {
  name: "CombatPanel",
  components: {
    DualPokemonPanel
  },
  props: {
    team_data: {
      type: Object,
      required: true
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  methods: {
  },
  data() {
    return {
      selectedPokemon: null,
      enemyPokemon: null
    }
  },
}
</script>

<style scoped>

</style>