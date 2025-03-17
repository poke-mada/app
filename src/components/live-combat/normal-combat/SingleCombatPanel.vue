<template>
  <v-col cols="8">
    <SinglePokemonPanel :team="team" :team_data="team_data" :enemy_data="enemy_data" :pk_slot="this.team_data.selected_pokemon[0]"/>
  </v-col>
  <v-col cols="4">
    <PokemonTeamList :team="team" :data="this.team_data" :enemy_data="enemy_data"/>
  </v-col>
</template>

<script>
import SinglePokemonPanel from '@/components/basic-comps/SinglePokemonPanel';
import PokemonTeamList from '@/components/basic-comps/DetailPokemonTeamList';

export default {
  name: "SingleCombatPanel",
  components: {
    PokemonTeamList,
    SinglePokemonPanel,
  },
  props: {
    team_data: {
      type: Object,
      required: true
    },
    team: {
      type: String,
      required: true
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      selectedPokemon: null
    }
  }
}
</script>

<style scoped>

</style>