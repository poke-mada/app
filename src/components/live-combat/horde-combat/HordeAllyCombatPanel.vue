<template>
  <DualPokemonPanel pk_slot="0" team="you" :team_data="this.data" :enemy_data="enemy_data"/>
</template>

<script>
import DualPokemonPanel from '@/components/basic-comps/DualPokemonPanel'

export default {
  name: "CombatPanel",
  components: {
    DualPokemonPanel
  },
  props: {
    data: {
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