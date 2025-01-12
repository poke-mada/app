<template>
  <v-row class="ml-2">
    <v-col cols="8">
      <SinglePokemonPanel :pokemon="this.selectedPokemon" team="enemy" :team_data="data" :enemy_data="enemy_data" pk_slot="0"/>
    </v-col>
    <v-col sm cols="4">
      <PokemonTeamList team="enemy" :data="this.data" :enemy_data="enemy_data"/>
    </v-col>
  </v-row>
</template>

<script>
import SinglePokemonPanel from '@/components/basic-comps/SinglePokemonPanel'
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';

export default {
  name: "CombatPanel",
  components: {
    PokemonTeamList,
    SinglePokemonPanel
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
  data() {
    return {
      selectedPokemon: null,
      enemyPokemon: null
    }
  },
  created() {
    window.electron.onDataReceived('selected_enemy', (event, data) => {
      this.selectedPokemon = data.pokemon;
    })

    window.electron.onDataReceived('end_combat', () => {
      this.selectedPokemon = null;
      this.enemyPokemon = null;
    })
  },
  mounted() {
    this.emitter.on('select-pokemon-ally', (pokemon) => {
      this.enemyPokemon = pokemon;
    });
  },
  methods: {}
}
</script>

<style scoped>

</style>