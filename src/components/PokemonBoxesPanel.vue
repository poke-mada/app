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
              <v-autocomplete label="Cajas" :items="this.box_data.boxes" item-value="box_number" item-title="box_identifier"
                        v-model="selected_box"></v-autocomplete>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn @click="pokemon_team_display = true; selected_pokemon = null">Ver Equipo</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-autocomplete label="Entrenadores" :items="trainers" item-value="name" item-title="streamer_name"
                        v-model="selected_trainer" @update:modelValue="open_box"></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-if="box_data.boxes[this.selected_box]">
            <v-col cols="2" v-for="(slot, index) in [...Array(30)].keys()" :key="index"
                   style="border: 1px solid #CACACACA">
              <v-row>
                <v-spacer></v-spacer>
                <v-col>
                  <PokemonCard :pokemon="get_slot(slot) ? get_slot(slot).pokemon : null" @click="select_pokemon"/>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
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
import PokemonCard from "@/components/offline-app/api-comps/PokemonCard";
import PokemonDetailPanel from "@/components/offline-app/api-comps/PokemonDetailPanel";
import VerticalPokemonTeamList from "@/components/offline-app/api-comps/VerticalPokemonTeamList";

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
    },
    active: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      selected_trainer: this.trainer_name,
      trainers: [],
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
  updated() {
    session.get('/api/trainers/list_trainers/').then((response) => {
      this.trainers = response.data
    });
  },
  created() {
    session.get('/api/trainers/list_trainers/').then((response) => {
      this.trainers = response.data
    });
    session.get(`/boxes/${this.selected_trainer}/`).then((response) => {
      this.box_data.boxes = response.data
    }).catch(() => {
    })
    session.get(`/trainer/${this.selected_trainer}/`).then((response) => {
      this.box_data.team = response.data.current_team.team
    }).catch(() => {
    })
  },
  methods: {
    open_box() {
      session.get(`/boxes/${this.selected_trainer}/`).then((response) => {
        this.box_data.boxes = response.data
      }).catch(() => {
      })
      session.get(`/trainer/${this.selected_trainer}/`).then((response) => {
        this.box_data.team = response.data.current_team.team
      }).catch(() => {
      })
    },
    select_pokemon(pokemon) {
      if (pokemon) {
        this.display_box_detail = true;
        this.selected_pokemon = pokemon;
      }
    },
    get_box(box_index) {
      return this.box_data.boxes[box_index]
    },
    get_slot(slot) {
      const box = this.get_box(this.selected_box);
      const slots = box.slots;
      const filtered = slots.filter((value) => value.slot === slot);
      if (filtered) {
        return filtered[0];
      }
      return null;
    },
    select_pokemon_team(pokemon) {
      this.selected_pokemon = pokemon;
    },
  },
}
</script>

<style scoped>
</style>