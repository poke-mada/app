<template>
  <v-layout>
    <v-main>
      <v-container class="pa-8">
        <v-row class="mt-2 pl-2 pr-2">
          <v-col cols="6">
            <v-card class="pa-6 rounded-xl" max-width="500" elevation="6">
              <!-- Encabezado con ícono flotante -->
              <div class="d-flex justify-center align-center mb-6" style="position: relative;">
                <v-avatar size="50" color="primary" class="elevation-6" style="position: absolute; top: -30px;">
                  <span class="text-h6 text-white">A</span>
                </v-avatar>
                <h2 class="text-center w-100 font-title">Noticias</h2>
              </div>

              <!-- Lista de noticias -->
              <v-divider class="mb-3"></v-divider>
              <div v-for="i in 3" :key="i" class="mb-6">
                <div class="d-flex align-start">
                  <v-icon color="primary" class="me-3">mdi-twitter</v-icon>
                  <div>
                    <h3 class="mb-1 text-uppercase font-weight-bold"
                      style="color: #D5048D; border-bottom: 2px solid #0600FF; display: inline-block;">
                      Lorem Ipsum
                    </h3>
                    <p>
                      <strong>DEDsafio Pokémon</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in.
                    </p>
                  </div>
                </div>
                <v-divider class="mt-3"></v-divider>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-container class="py-8" fluid>
              <!-- COMBATE EN VIVO -->
              <v-card class="pa-4 mb-6 rounded-xl" elevation="6">
                <div class="text-center mb-4 bg-pink text-white py-2 rounded">
                  <h2 class="font-title">Combate en Vivo</h2>
                </div>

                <v-row no-gutters>
                  <v-col cols="6" class="d-flex align-center justify-center" style="background-color: #ec3db4;">
                    <div class="text-center">
                      <v-img src="../../../../assets/img/Home/trainer1.png" width="100" />
                      <div class="rounded-pill bg-white px-3 py-1 mt-2 d-inline-block">Maryblogs</div>
                    </div>
                  </v-col>

                  <v-col cols="6" class="d-flex align-center justify-center" style="background-color: #0600ff;">
                    <div class="text-center">
                      <v-img src="../../../../assets/img/Home/trainer2.png" width="100" />
                      <div class="rounded-pill bg-white px-3 py-1 mt-2 d-inline-block">JuanSGuarnizo</div>
                    </div>
                  </v-col>
                </v-row>

                <div class="text-center mt-4">
                  <v-btn color="pink" variant="outlined" append-icon="mdi-arrow-right">
                    Ver Combate
                  </v-btn>
                </div>
              </v-card>

              <!-- TU EQUIPO -->
              <v-card class="pa-4 rounded-xl" elevation="6">
                <div class="text-center mb-4 bg-pink text-white py-2 rounded">
                  <h2 class="font-title">Tu Equipo</h2>
                </div>

                <div v-if="team.length > 0">
                  <v-row>
                    <v-col cols="4" v-for="(pokemon, i) in team" :key="i" class="text-center">
                      <v-img :src="pokemon.sprite_url" width="70" />
                      <p class="mt-1">{{ pokemon.species }}</p>
                    </v-col>
                  </v-row>
                </div>

                <div v-else class="text-center">
                  <v-progress-circular indeterminate color="pink" class="ma-4" />
                  <p class="text-subtitle-1">Cargando tu equipo...</p>
                </div>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
// import PokemonCard from "@/app/vue/components/basic-comps/PokemonCard";
import { session } from "@/stores";
// import LiveCombatPanel from "@/app/vue/components/page-comps/LiveCombatPanel";

export default {
  name: "MainAppPage",
  data() {
    return {
      team: [],
      selected_pokemon: null
    };
  },
  async mounted() {
    const token = localStorage.getItem("api_token");
    const trainerId = localStorage.getItem("trainer_id");

    if (token && trainerId) {
      const config = {
        headers: { Authorization: `Token ${token}` },
      };

      try {
        const res = await session.get(`/api/trainers/${trainerId}/`, config);
        this.team = res.data.current_team.team;
        console.log("Tu equipo cargado:", this.team);
      } catch (err) {
        console.error("Error al cargar el equipo:", err);
      }
    }
  },
  methods: {
    selectPokemon(pokemon) {
      this.selected_pokemon = pokemon;
    },
  },
};
</script>
