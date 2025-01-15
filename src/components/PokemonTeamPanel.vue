<template>
  <v-row>
    <v-col cols="3">
      <VerticalPokemonTeamList @select_pokemon="select_pokemon" team="you" :data="team_data"/>
    </v-col>
    <v-col>
      <PokemonDetailPanel :pokemon="selected_pokemon" v-if="selected_pokemon"/>
    </v-col>
  </v-row>
</template>

<script>
import VerticalPokemonTeamList from '@/components/basic-comps/VerticalPokemonTeamList';
import PokemonDetailPanel from '@/components/basic-comps/PokemonDetailPanel';
import {session} from "@/store";

export default {
  name: "PokemonTeamPanel",
  components: {
    VerticalPokemonTeamList,
    PokemonDetailPanel
  },
  props: {
    trainer_name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected_pokemon: null,
      team_data: {
        team: [null, null, null, null, null, null]
      },
    }
  },
  methods: {
    select_pokemon(pokemon) {
      this.selected_pokemon = pokemon;
    },
  },
  created() {
    setInterval(() => {
      session.get(`/team_for_coach/${this.trainer_name}`).then((json_res) => {
        this.team_data.team = json_res.data.team;
      }).catch(() => {
      })
    }, 500)
  }
}
</script>

<style scoped>

</style>