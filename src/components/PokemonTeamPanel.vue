<template>
  <v-row>
    <v-col md="4" sm="12" xs="12" lg="2">
      <VerticalPokemonTeamList @select_pokemon="select_pokemon" team="you" :data="team_data"/>
    </v-col>
    <v-col md="8" sm="12" xs="12" lg="10">
      <PokemonDetailPanel :pokemon="selected_pokemon" v-if="selected_pokemon"/>
    </v-col>
  </v-row>
</template>

<script>
import VerticalPokemonTeamList from '@/components/offline-app/api-comps/VerticalPokemonTeamList';
import PokemonDetailPanel from '@/components/offline-app/api-comps/PokemonDetailPanel';
import {session} from "@/stores";

export default {
  name: "PokemonTeamPanel",
  components: {
    VerticalPokemonTeamList,
    PokemonDetailPanel
  },
  props: {
    active: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      interval: 0,
      selected_pokemon: null,
      team_data: {
        team: [null, null, null, null, null, null]
      },
    }
  },
  methods: {
    select_pokemon(pokemon) {
      this.selected_pokemon = this.team_data.team[pokemon];
    },
  },
  mounted() {
    session.get(`/api/trainers/get_trainer/`).then((response) => {
      this.team_data.team = response.data.current_team.team;
    }).catch(() => {
    })
    this.interval = setInterval(() => {
      if (!this.active) return;
      session.get(`/api/trainers/get_trainer/`).then((response) => {
        this.team_data.team = response.data.current_team.team;
      }).catch(() => {
      })
    }, 5000)
  },
  unmounted() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>
