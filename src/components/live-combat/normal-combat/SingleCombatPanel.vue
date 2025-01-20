<template>
  <v-row class="ml-2">
    <v-col cols="8">
      <SinglePokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[0]"
      />
    </v-col>
    <v-col sm cols="4">
      <PokemonTeamList :team="team" :data="this.data" :enemy_data="enemy_data"/>
    </v-col>
  </v-row>
</template>

<script>
import SinglePokemonPanel from '@/components/basic-comps/SinglePokemonPanel';
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    SinglePokemonPanel,
  },
  props: {
    data: {
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
  computed: {
  },
  data() {
    return {
      selectedPokemon: null
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>