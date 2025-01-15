<template>
  <v-row>
    <v-col cols="12">
      <v-card border class="mt-2">
        <v-alert type="success" class="p-0">
          <template v-slot:prepend>
          </template>
          <span>
            Caja Pokemon
          </span>
        </v-alert>
        <div class="pa-4">
          <v-row justify="space-between">
            <v-col>
              <v-select label="Cajas" :items="boxes" item-value="_id" item-title="name"
                        v-model="selected_box"></v-select>
            </v-col>
            <v-col>
              <v-btn @click="pokemon_team_display = true; selected_pokemon = null">Ver Equipo</v-btn>
            </v-col>
            <v-col>
              <span>Caja de {{ trainer_name }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" v-for="(pokemon, index) in box_data.boxes[this.selected_box]" :key="index">
              <PokemonCard :pokemon="pokemon" @click="select_pokemon"/>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="display_box_detail">
    <PokemonDetailPanel :pokemon="selected_pokemon"/>
  </v-dialog>
  <v-dialog v-model="pokemon_team_display">
    <v-row>
      <v-col cols="3">
        <VerticalPokemonTeamList team="you" :data="{team: box_data.team}" @select_pokemon="select_pokemon_team"/>
      </v-col>
      <v-col>
        <PokemonDetailPanel v-if="selected_pokemon" :pokemon="selected_pokemon"/>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import {session} from '@/store'
import PokemonCard from "@/components/basic-comps/PokemonCard";
import PokemonDetailPanel from "@/components/basic-comps/PokemonDetailPanel";
import VerticalPokemonTeamList from "@/components/basic-comps/VerticalPokemonTeamList";

export default {
  name: "PokemonTeamPanel",
  components: {
    VerticalPokemonTeamList,
    PokemonCard,
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
      display_box_detail: false,
      pokemon_team_display: false,
      selected_box: 0,
      selected_pokemon: null,
      box_data: {
        team: [null, null, null, null, null, null],
        boxes: []
      }
    }
  },
  computed: {
    boxes() {
      return [...Array(31).keys()].map((value) => {
        return {
          _id: value,
          name: `PC #${value + 1}`
        }
      })
    }
  },
  created() {
    setInterval(() => {
      // eslint-disable-next-line no-constant-condition
      session.get(`/boxes/${this.trainer_name}`).then((data) => {
        this.box_data = data.data
      }).catch(() => {
      })
    }, 500)
  },
  methods: {
    select_pokemon(pokemon) {
      this.display_box_detail = true;
      this.selected_pokemon = pokemon;
    },
    select_pokemon_team(pokemon) {
      this.selected_pokemon = pokemon;
    },
  },
}
</script>

<style scoped>
</style>