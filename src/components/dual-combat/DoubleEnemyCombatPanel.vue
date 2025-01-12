<template>
  <v-row>
    <v-col sm cols="8">
      <DualPokemonPanel pk_slot="0" team="enemy" :team_data="this.data" :enemy_data="enemy_data"/>
      <DualPokemonPanel pk_slot="1" team="enemy" :team_data="this.data" :enemy_data="enemy_data"/>
    </v-col>
    <v-col sm cols="4">
      <PokemonTeamList team="enemy" :data="this.data" :enemy_data="enemy_data"/>
    </v-col>
  </v-row>
</template>

<script>
import DualPokemonPanel from '@/components/basic-comps/DualPokemonPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
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