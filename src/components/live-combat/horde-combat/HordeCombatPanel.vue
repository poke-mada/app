<template>
  <v-row>
    <v-col cols="4">
      <ShortPokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[0]"
      />
    </v-col>
    <v-col cols="4">
      <ShortPokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[1]"
      />
    </v-col>
    <v-col cols="4">
      <ShortPokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[2]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <ShortPokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[3]"
      />
    </v-col>
    <v-col cols="4">
    </v-col>
    <v-col cols="4">
      <ShortPokemonPanel
          :pokemon="this.selectedPokemon"
          :team="team"
          :team_data="data"
          :enemy_data="enemy_data"
          :pk_slot="this.data.selected_pokemon[4]"
      />
    </v-col>
  </v-row>
</template>

<script>
import ShortPokemonPanel from '@/components/basic-comps/ShortPokemonPanel';

export default {
  name: "CombatPanel",
  components: {
    ShortPokemonPanel,
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