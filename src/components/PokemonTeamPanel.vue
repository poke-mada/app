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
import VerticalPokemonTeamList from '@/components/offline-app/api-comps/VerticalPokemonTeamList';
import PokemonDetailPanel from '@/components/offline-app/api-comps/PokemonDetailPanel';
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
    },
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
      this.selected_pokemon = pokemon;
      console.log(pokemon)
    },
  },
  created() {
    session.get(`/trainer/${this.trainer_name}/`).then((response) => {
      this.team_data.team = response.data.current_team.team;
    }).catch(() => {
    })
  },

  mounted() {
    this.interval = setInterval(() => {
      if (!this.active) return;
      session.get(`/trainer/${this.trainer_name}/`).then((response) => {
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