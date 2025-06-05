<template>
  <v-layout>
    <v-main>
      <v-container class="pa-8">
        <v-row class="mt-2 pl-2 pr-2">
          <v-col cols="6" class="flexCenter">
            <!-- CARD DE NOTICIAS -->
            <v-card class="rounded-xl" max-width="500" elevation="6" style="position: relative;">
              <!-- Encabezado con ícono flotante -->
              <div class="divCardSup pa-5 d-flex justify-center align-center">
                <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
                  <v-img src="/assets/img/Home/Pokeball.png"></v-img>
                </v-avatar>
                <h2 class="textNoticias">Noticias</h2>
              </div>

              <!-- Lista de noticias -->
              <v-divider class="mb-3"></v-divider>
              <div class="pa-6">
                <div v-for="i in 3" :key="i" class="mb-6 ">
                  <div class="d-flex align-start">
                    <v-icon color="#D5048D" class="me-3">mdi-twitter</v-icon>
                    <div>
                      <h3 class="tittleTweet gradient-border mb-1 text-uppercase">
                        Lorem Ipsum
                      </h3>
                      <p class="p-tweet">
                        <strong>DEDsafio Pokémon</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in.
                      </p>
                    </div>
                  </div>
                  <v-divider class="mt-3"></v-divider>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" class="flexCenter">
            <v-container class="rounded-xl p-0 m-0" fluid>
              <!-- COMBATE EN VIVO -->
              <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
                <div class="divCardSup pa-5 d-flex justify-center align-center">
                  <h2 class="textNoticias">Combate en Vivo</h2>
                </div>
                <v-avatar size="102" style="position: absolute; top: 75%; left: -7%;">
                  <v-img src="/assets/img/Home/Pokeball3.png"></v-img>
                </v-avatar>
                <v-row no-gutters class="sectionVS">
                  <v-avatar size="50" class="avatarVS elevation-6">
                    <v-img width="48" src="/assets/img/Home/IconoBatalla.png"></v-img>
                  </v-avatar>
                  <v-col cols="6" class="d-flex align-center justify-center team1">
                    <div class="text-center">
                      <v-img class="avatarTeam" src="../../../../assets/img/Home/trainer1.png" width="250px" />
                      <div class="nameTeam1">
                        <p>
                          Maryblogs
                        </p>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="6" class="d-flex align-center justify-center team2">
                    <div class="text-center">
                      <v-img class="avatarTeam" src="../../../../assets/img/Home/trainer2.png" width="250" />
                      <div class="nameTeam2">
                        <p>JuanSGuarnizo</p>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <div class="flexCenter ma-6">
                  <v-btn class="btnHome" elevation="0">
                    <span class="btn-text">VER COMBATE</span>
                    <span class="btn-icon">
                      <v-icon class="iconArrow" color="white" size="20">mdi-arrow-right</v-icon>
                    </span>
                  </v-btn>
                </div>
              </v-card>

              <!-- TU EQUIPO -->
              <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
                <div class="divCardSup pa-5 d-flex justify-center align-center">
                  <v-avatar size="78" style="position: absolute; top: 80%; right: -5%;">
                    <v-img src="/assets/img/Home/Pokeball.png"></v-img>
                  </v-avatar>
                  <h2 class="textNoticias">Tu Equipo</h2>
                </div>

                <div v-if="team.length > 0">
                  <v-row class="pa-6">
                    <v-col cols="4" v-for="(pokemon, i) in team" :key="i" class="text-center">
                      <div class="position-relative d-inline-block">
                        <!-- Imagen principal del Pokémon -->
                        <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)" />
                        <img class="iconBallPoke" width="22" src="/assets/img/Home/Poké_Ball_icon.png" />

                        <!-- Badge solo si tiene held_item -->
                        <img v-if="pokemon.held_item_name && pokemon.held_item_name !== ''"
                          src="/assets/img/Home/itemPoke.png" width="22" class="custom-badge" />
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <div v-else class="text-center">
                  <v-progress-circular indeterminate color="pink" class="ma-4" />
                  <p class="text-subtitle-1">Cargando tu equipo...</p>
                </div>
              </v-card>
              <v-dialog v-model="display" max-width="600">
                <PokemonDetailPanel :pokemon="selected_pokemon" />
              </v-dialog>

            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import PokemonCard from "@/app/vue/components/basic-comps/PokemonCard";
import { session } from "@/stores";
import PokemonDetailPanel from "@/app/vue/components/basic-comps/PokemonDetailPanel";


export default {
  name: "MainAppPage",
  emits: ["pokemonSelected"],
  components: {
    PokemonCard,
    PokemonDetailPanel
  },
  data() {
    return {
      team: [],
      selected_pokemon: null,
      display: false
    };
  },
  async mounted() {
    const token = localStorage.getItem("api_token");

    if (token) {
      const config = {
        headers: { Authorization: `Token ${token}` },
      };

      try {
        const res = await session.get(`/api/trainers/get_team/`, config);
        this.team = res.data;
        console.log("Tu equipo cargado:", this.team);
      } catch (err) {
        console.error("Error al cargar el equipo:", err);
      }
    }
  },
  methods: {
    selectPokemon(pokemon) {
      this.selected_pokemon = pokemon;
      this.display = true;
    },
  },
};
</script>
