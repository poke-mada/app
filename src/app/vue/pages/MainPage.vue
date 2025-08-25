<template>
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
        <div class="pa-6" style="min-width: 500px">
          <!-- Si HAY noticias -->
          <div v-if="newsletter.length > 0">
            <div v-for="news in newsletter.slice(0, 5)" :key="news.created_on" class="mb-6">
              <div class="d-flex align-start">
                <v-icon color="#D5048D" class="me-3">
                  <img :src="Showdown" style="width: 100%; height: 100%"/>
                </v-icon>
                <div>
                  <h3 class="tittleTweet gradient-border mb-1 text-uppercase">
                    Noticias!
                  </h3>
                  <div class="delimitTweet">
                    <p class="p-tweet" v-html="news.message"></p>
                  </div>
                </div>
              </div>
              <v-divider class="mt-3"></v-divider>
            </div>
          </div>

          <!-- Si NO HAY noticias -->
          <div v-else class="text-center">
            <p class="text-subtitle-1">Aún no hay noticias disponibles.</p>
          </div>
        </div>
        </v-card>
      </v-col>
      <v-col cols="6" class="flexCenter">
        <v-container class="rounded-xl p-0 m-0" fluid>
          <!-- COMBATE EN VIVO -->
          <v-card v-if="false" class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
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
                  <v-img class="avatarTeam" src="../../../../assets/img/Home/trainer1.png" width="250px"/>
                  <div class="nameTeam1">
                    <p>
                      Maryblog
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="6" class="d-flex align-center justify-center team2">
                <div class="text-center">
                  <v-img class="avatarTeam" src="../../../../assets/img/Home/trainer2.png" width="250"/>
                  <div class="nameTeam2">
                    <p>JuanSGuarnizo</p>
                  </div>
                </div>
              </v-col>
            </v-row>

            <div class="flexCenter ma-6">
              <v-btn class="btnHome" elevation="0" to="/combat"
                     v-if="emulator_on && game_data && game_data.combat_info.combat_type !== 'OFF'">
                <span class="btn-text">VER COMBATE</span>
                <span class="btn-icon">
                      <v-icon class="iconArrow" color="white" size="20">mdi-arrow-right</v-icon>
                    </span>
              </v-btn>
            </div>
          </v-card>
          <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
            <!-- Encabezado con ícono flotante -->
            <div class="divCardSup pa-5 d-flex justify-center align-center">
              <h2 class="textNoticias">Notificaciones</h2>
            </div>

            <!-- Lista de notificaciones -->
            <v-divider class="mb-3"></v-divider>
            <div class="pa-6" style="min-width: 500px">
              <!-- Si HAY notificaciones -->
              <v-data-table
                  v-if="notifications.length > 0"
                  height="40vh"
                  density="comfortable"
                  hide-default-footer
                  items-per-page="20"
                  :items="notifications"
                  :headers="notification_headers"
              >
                <template #item="{item}">
                  <tr class="mt-16">
                    <td v-html="item.message"></td>
                  </tr>
                </template>
              </v-data-table>

              <!-- Si NO HAY notificaciones -->
              <div v-else class="text-center">
                <p class="text-subtitle-1">Aún no hay notificaciones.</p>
              </div>
            </div>
          </v-card>
          <!-- TU EQUIPO -->
          <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
            <div class="divCardSup pa-5 d-flex justify-center align-center">
              <v-avatar size="78" style="position: absolute; top: 80%; right: -5%;">
                <v-img src="/assets/img/Home/Pokeball.png"></v-img>
              </v-avatar>
              <h2 class="textNoticias">Tu Equipo <span v-if="profile?.is_coach">({{ profile?.coached_name }})</span>
              </h2>
            </div>

            <div v-if="!loading_team && team.length > 0">
              <v-row class="pa-6">
                <v-col cols="4" v-for="(pokemon, i) in team" :key="i" class="text-center">
                  <div class="position-relative d-inline-block">
                    <!-- Imagen principal del Pokémon -->
                    <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)"/>
                    <img class="iconBallPoke" width="22" src="/assets/img/Home/Poké_Ball_icon.png"/>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-else-if="loading_team" class="text-center">
              <v-progress-circular indeterminate color="pink" class="ma-4"/>
              <p class="text-subtitle-1">Cargando tu equipo...</p>
            </div>
            <div v-else-if="!loading_team && team.length === 0" class="text-center">
              <p class="text-subtitle-1">Sin equipo</p>
            </div>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="display">
    <v-row>
      <v-spacer v-on:click="display = false"/>
      <v-col>
        <PokemonDetailPanel :pokemon="selected_pokemon"/>
      </v-col>
      <v-spacer v-on:click="display = false"/>
    </v-row>
  </v-dialog>
</template>

<script setup>
import Showdown from '@/icons/Showdown.svg';
</script>

<script>
import PokemonCard from "@/app/vue/components/offline-app/api-comps/PokemonCard";
import {getAxios} from "@/stores";
import PokemonDetailPanel from "@/app/vue/components/offline-app/api-comps/PokemonDetailPanel";
import {useGameStore} from "@/stores/app";

export default {
  name: "MainPage",
  components: {
    PokemonCard,
    PokemonDetailPanel
  },

  data() {
    return {
      newsletter: [],
      team: [],
      selected_pokemon: null,
      display: false,
      notifications: [],
      notification_headers: [
      ],
      loading_team: false,
    };
  },
  computed: {
    store: () => {
      return useGameStore();
    },
    emulator_on() {
      return this.store ? this.store.emulator_on : null
    },
    game_data() {
      return this.store ? this.store.game_data : null;
    },
    api_token() {
      return this.store ? this.store.api_token : null;
    },
    logged_in() {
      return this.api_token && this.api_token.length > 0;
    },
    profile() {
      return this.store ? this.store.profile_data : null;
    }
  },
  async mounted() {
    const token = this.api_token;

    if (token) {
      this.loading_team = true;
      const config = {
        headers: {Authorization: `Token ${token}`},
      };

      try {
        const res = await getAxios().get(`/api/trainers/get_team/`, config);
        this.team = res.data;
        this.loading_team = false;
      } catch (err) {
        this.loading_team = false;
        this.team = [];
        console.error("Error al cargar el equipo:", err);
      }
    }
    getAxios().get('/api/notifications/').then(response => {
      this.notifications = response.data;
    })
    getAxios().get('/api/newsletter/').then(response => {
      this.newsletter = response.data;
    });
  },
  methods: {
    selectPokemon(pokemon) {
      this.selected_pokemon = pokemon;
      console.log(pokemon)
      this.display = true;
    },
  },
}
</script>

<style scoped>
.textNoticias {
  text-transform: uppercase;
}
</style>