<!--suppress JSUnresolvedVariable -->
<template>
  <div class="noticiasSection d-flex align-items-center justify-center align-center">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <div class="divCardSup pa-5 d-flex justify-center align-center">
        <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
          <v-img src="/assets/img/Home/Pokeball.png"></v-img>
        </v-avatar>
        <h2 class="textNoticias">Cajas</h2>
      </div>

      <div class="pa-4">
        <v-row justify="space-between" class="custom-row">
          <!-- Select Caja -->
          <v-col cols="3">
            <v-autocomplete class="custom-select" variant="solo" hide-details flat :items="box_data.selectable_boxes"
              item-value="box_number" item-title="box_identifier" v-model="selected_box" @update:modelValue="open_box">
              <template #selection="{ item }">
                <span class="select-text">{{ item.box_identifier || 'CAJA' }}</span>
              </template>
              <template #append-inner>
                <div class="divSelectIcon">
                  <v-icon class="select-icon">mdi-chevron-down</v-icon>
                </div>
              </template>
            </v-autocomplete>
          </v-col>
          <v-spacer></v-spacer>
          <!-- Select Entrenadores -->
          <v-col cols="6">
            <v-autocomplete class="custom-select" variant="solo" hide-details flat :items="trainers" item-value="id"
              item-title="streamer_name" v-model="selected_trainer" @update:modelValue="selected_box = 0; open_box();">
              <template #selection="{ item }">
                <span class="select-text">{{ item.streamer_name || 'SELECCIONAR PARTICIPANTE' }}</span>
              </template>
              <template #append-inner>
                <div class="divSelectIcon">
                  <v-icon class="select-icon">mdi-chevron-down</v-icon>
                </div>
              </template>
            </v-autocomplete>
          </v-col>
          <!-- Botón Ver Equipo -->
          <v-col cols="3">
            <v-btn class="gradient-btn" @click="pokemon_team_display = true; selected_pokemon = null">
              VER EQUIPO
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="loading_box" class="w-100 h-100" justify="center" align="center">
          <v-col>
            <v-progress-linear indeterminate height="25">
              Loading...
            </v-progress-linear>
          </v-col>
        </v-row>
        <v-row v-if="box_data.box && !loading_box">
          <v-col cols="2" v-for="(slot, index) in [...Array(30)].keys()" :key="index"
            style="border: 1px solid #CACACACA">
            <v-row>
              <v-spacer></v-spacer>
              <v-col>
                <PokemonCard :pokemon="get_slot(slot) ? get_slot(slot).pokemon : null" @click="select_pokemon" />
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
  <v-dialog v-model="display_box_detail">
    <v-row>
      <v-spacer @click="display_box_detail = false" />
      <v-col>
        <PokemonDetailPanel :pokemon="selected_pokemon" />
      </v-col>
      <v-spacer @click="display_box_detail = false" />
    </v-row>
  </v-dialog>
  <v-dialog v-model="pokemon_team_display">
    <v-row>
      <v-col cols="3">
        <VerticalPokemonTeamList team="you" :data="{ team: this.box_data.team }"
          @select_pokemon="select_pokemon_team" />
      </v-col>
      <v-col>
        <PokemonDetailPanel v-if="selected_pokemon" :pokemon="selected_pokemon" />
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import { session } from '@/stores'
import PokemonCard from "@/app/vue/components/offline-app/api-comps/PokemonCard";
import PokemonDetailPanel from "@/app/vue/components/offline-app/api-comps/PokemonDetailPanel";
import VerticalPokemonTeamList from "@/app/vue/components/offline-app/api-comps/VerticalPokemonTeamList";

export default {
  name: "PokemonTeamPanel",
  components: {
    VerticalPokemonTeamList,
    PokemonCard,
    PokemonDetailPanel,
  },
  props: {
    api_token: {
      type: String,
      required: false
    },
    trainer_name: {
      type: String,
      required: false
    },
    active: {
      type: Boolean,
      required: false
    }
  },
  data() {
    const token = this.api_token || localStorage.getItem('api_token');
    let config = {
      headers: {
        Authorization: `Token ${token}`
      }
    }

    return {
      config: config,
      loading_box: true,
      selected_trainer: 0,
      trainers: [],
      display_box_detail: false,
      pokemon_team_display: false,
      selected_box: 0,
      selected_pokemon: null,
      box_data: {
        selectable_boxes: [],
        team: [null, null, null, null, null, null],
      }
    }
  },
  updated() {
    session.get('/api/trainers/list_trainers/', this.config).then((response) => {
      this.trainers = response.data
    });
  },
  async mounted() {
    const response = await session.get('/api/trainers/get_trainer')
    this.selected_trainer = response.data.id;
    await this.load_trainers();
    await this.open_box();
  },
  methods: {
    async load_trainer_team() {
      const response = await session.get(`/api/trainers/${this.selected_trainer}/`, this.config);
      this.box_data.team = response.data.current_team.team
    },
    async load_trainers() {
      const response = await session.get('/api/trainers/list_trainers/', this.config);
      this.trainers = response.data;
    },
    async load_boxes() {
      const response = await session.get(`/api/trainers/${this.selected_trainer}/list_boxes/`, this.config);
      this.box_data.selectable_boxes = response.data;
    },
    async open_box() {
      this.loading_box = true;
      const config = {
        params: {
          box: this.selected_box
        },
        headers: this.config.headers
      };
      const response = await session.get(`/api/trainers/${this.selected_trainer}/box/`, config);

      this.box_data.box = response.data;
      this.loading_box = false;
      await this.load_trainer_team();
      await this.load_boxes();
    },
    select_pokemon(pokemon) {
      if (pokemon) {
        this.display_box_detail = true;
        this.selected_pokemon = pokemon;
      }
    },
    get_box() {
      return this.box_data.box;
    },
    get_slot(slot) {
      const box = this.get_box();
      const slots = box.slots;
      const filtered = slots.filter((value) => value.slot === slot);
      if (filtered) {
        return filtered[0];
      }
      return null;
    },
    select_pokemon_team(pokemon) {
      this.selected_pokemon = this.box_data.team[pokemon];
    },
  },
}
</script>

<style scoped></style>
