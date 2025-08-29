<template>
  <v-container class="pa-8">
    <v-row class="mt-2 pl-2 pr-2">
      <v-col cols="6" class="flexCenter">
        <!-- CARD DE NOTICIAS -->
        <v-card class="rounded-xl news-card" max-width="500" elevation="6" style="position: relative;">
          <div class="divCardSup pa-5 d-flex justify-center align-center">
            <v-avatar size="134" style="position: absolute; top: 80%; right: -10%;">
              <v-img src="/assets/img/Home/Pokeball.png"></v-img>
            </v-avatar>
            <h2 class="textNoticias">Noticias</h2>
          </div>

          <v-divider class="mb-3"></v-divider>

          <!-- scrolleable -->
          <div class="pa-6 overflow-y-auto news-body">
            <div v-if="newsletter.length > 0">
              <div v-for="news in newsletter.slice(0, 50)" :key="news.created_on" class="mb-6">
                <div class="d-flex align-start">
                  <v-icon color="#D5048D" class="me-3">
                    <img :src="Showdown" style="width: 100%; height: 100%" />
                  </v-icon>
                  <div>
                    <h3 class="tittleTweet gradient-border mb-1 text-uppercase">Noticias!</h3>
                    <div class="delimitTweet">
                      <p class="p-tweet" v-html="news.message"></p>
                    </div>
                  </div>
                </div>
                <v-divider class="mt-3"></v-divider>
              </div>
            </div>

            <div v-else class="text-center">
              <p class="text-subtitle-1">Aún no hay noticias disponibles.</p>
            </div>
          </div>
        </v-card>

        <!-- CONTADOR DINÁMICO POR HITOS -->
        <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
          <div class="divCardSup pa-5 d-flex justify-center align-center">
            <v-avatar size="134" style="position: absolute; top: 70%; left: -10%;">
              <v-img src="/assets/img/Home/Pokeball3.png"></v-img>
            </v-avatar>
            <h2 class="textNoticias text-center">
              <!-- Encabezado dinámico segun fase -->
              <template v-if="phase === 'done'">
                🎉 ¡EL DEDSAFIO POKÉMON 2 HA TERMINADO!
              </template>
              <template v-else-if="phase === 'transition'">
                {{ currentTransitionLabel }}
              </template>
              <template v-else>
                {{ currentCountdownLabel }}
              </template>
            </h2>
          </div>

          <div class="pa-6">
            <!-- Números solo en fase countdown -->
            <div v-if="phase === 'countdown' && hasCurrentTarget" class="countdown-wrap">
              <v-row class="justify-center align-stretch" dense>
                <v-col cols="12" sm="6" md="3" class="d-flex">
                  <div class="time-box w-100">
                    <div class="time-num">{{ remaining.days }}</div>
                    <div class="time-label">DÍAS</div>
                  </div>
                </v-col>

                <v-col cols="12" sm="6" md="3" class="d-flex">
                  <div class="time-box w-100">
                    <div class="time-num">{{ remaining.hours }}</div>
                    <div class="time-label">HRS</div>
                  </div>
                </v-col>

                <v-col cols="12" sm="6" md="3" class="d-flex">
                  <div class="time-box w-100">
                    <div class="time-num">{{ remaining.minutes }}</div>
                    <div class="time-label">MIN</div>
                  </div>
                </v-col>

                <v-col cols="12" sm="6" md="3" class="d-flex">
                  <div class="time-box w-100">
                    <div class="time-num">{{ remaining.seconds }}</div>
                    <div class="time-label">SEG</div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Mensaje en transición / fin -->
            <div v-else class="text-center">
              <v-icon v-if="phase === 'transition'" size="40" color="pink">mdi-rocket-launch</v-icon>
              <v-icon v-else-if="phase === 'done'" size="40" color="pink">mdi-trophy</v-icon>
              <p class="mt-2 text-subtitle-1">
                <template v-if="phase === 'transition'">{{ currentTransitionLabel }}</template>
                <template v-else-if="phase === 'done'">¡Gracias por acompañarnos!</template>
              </p>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="6" class="flexCenter">
        <v-container class="rounded-xl p-0 m-0" fluid>
          <!-- COMBATE EN VIVO (oculto por ahora) -->
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
                  <v-img class="avatarTeam" src="../../../../assets/img/Home/trainer1.png" width="250px" />
                  <div class="nameTeam1">
                    <p>Maryblog</p>
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
              <v-btn class="btnHome" elevation="0" to="/combat"
                v-if="emulator_on && game_data && game_data.combat_info.combat_type !== 'OFF'">
                <span class="btn-text">VER COMBATE</span>
                <span class="btn-icon">
                  <v-icon class="iconArrow" color="white" size="20">mdi-arrow-right</v-icon>
                </span>
              </v-btn>
            </div>
          </v-card>

          <!-- NOTIFICACIONES -->
          <v-card class="rounded-xl mb-6 notif-card" max-width="500" elevation="6" style="position: relative;">
            <div class="divCardSup pa-5 d-flex justify-center align-center">
              <h2 class="textNoticias">Notificaciones</h2>
            </div>
            <v-divider class="mb-3"></v-divider>
            <v-card-text class="pa-6 notif-body">
              <template v-if="notifications.length > 0">
                <v-data-table density="comfortable" hide-default-footer :items="notifications"
                  :headers="notification_headers">
                  <template #item="{ item }">
                    <tr>
                      <td v-html="item.message"></td>
                    </tr>
                  </template>
                </v-data-table>
              </template>
              <div v-else class="text-center">
                <p class="text-subtitle-1">Aún no hay notificaciones.</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- TU EQUIPO -->
          <v-card class="rounded-xl mb-6" max-width="500" elevation="6" style="position: relative;">
            <div class="divCardSup pa-5 d-flex justify-center align-center">
              <v-avatar size="78" style="position: absolute; top: 70%; right: -5%;">
                <v-img src="/assets/img/Home/Pokeball.png"></v-img>
              </v-avatar>
              <h2 class="textNoticias">
                Tu Equipo <span v-if="profile?.is_coach">({{ profile?.coached_name }})</span>
              </h2>
            </div>

            <div v-if="!loading_team && team.length > 0">
              <v-row class="pa-6">
                <v-col cols="4" v-for="(pokemon, i) in team" :key="i" class="text-center">
                  <div class="position-relative d-inline-block">
                    <PokemonCard :pokemon="pokemon" @click="selectPokemon(pokemon)" />
                    <img class="iconBallPoke" width="22" src="/assets/img/Home/Poké_Ball_icon.png" />
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-else-if="loading_team" class="text-center">
              <v-progress-circular indeterminate color="pink" class="ma-4" />
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

  <!-- MODAL DETALLE POKÉMON -->
  <v-dialog v-model="display">
    <v-row>
      <v-spacer v-on:click="display = false" />
      <v-col>
        <PokemonDetailPanel :pokemon="selected_pokemon" />
      </v-col>
      <v-spacer v-on:click="display = false" />
    </v-row>
  </v-dialog>
</template>

<script setup>
import Showdown from '@/icons/Showdown.svg';
</script>

<script>
import PokemonCard from "@/app/vue/components/offline-app/api-comps/PokemonCard";
import { getAxios } from "@/stores";
import PokemonDetailPanel from "@/app/vue/components/offline-app/api-comps/PokemonDetailPanel";
import { useGameStore } from "@/stores/app";

export default {
  name: "MainPage",
  components: { PokemonCard, PokemonDetailPanel },

  data() {
    return {
      newsletter: [],
      team: [],
      selected_pokemon: null,
      display: false,
      notifications: [],
      notification_headers: [],
      loading_team: false,

      // ======= 2 horas =======
      TRANSITION_MS: 2 * 60 * 60 * 1000,

      // Hitos (UTC)
      timeline: [
        { key: "end_tramo_2", labelCountdown: "INICIO DEL TRAMO 2", labelTransition: "🚀 ¡INICIAMOS EL TRAMO 2!", atMs: Date.parse("2025-08-29T06:00:00Z") },
        { key: "stay_tramo_2", labelCountdown: "TRAMO 2", labelTransition: "¡FIN DEL TRAMO 2!", atMs: Date.parse("2025-09-01T06:00:00Z") },
        { key: "start_torneo_2", labelCountdown: "INICIO 2° TORNEO", labelTransition: "🏁 ¡INICIA EL 2° TORNEO!", atMs: Date.parse("2025-09-01T19:00:00Z") },
        { key: "start_tramo_3", labelCountdown: "INICIO DEL TRAMO 3", labelTransition: "🚀 ¡INICIA EL TRAMO 3!", atMs: Date.parse("2025-09-02T06:00:00Z") },
        { key: "stay_tramo_3", labelCountdown: "TRAMO 3", labelTransition: "¡FIN DEL TRAMO 3!", atMs: Date.parse("2025-09-06T06:00:00Z") },
        { key: "end_tramo_3", labelCountdown: "INICIO 3° TORNEO", labelTransition: "🏁 ¡INICIA EL 3° TORNEO!", atMs: Date.parse("2025-09-06T19:00:00Z") },
        { key: "start_tramo_4", labelCountdown: "INICIO DEL TRAMO 4", labelTransition: "🚀 ¡INICIA EL TRAMO 4!", atMs: Date.parse("2025-09-07T06:00:00Z") },
        { key: "stay_tramo_4", labelCountdown: "TRAMO 4", labelTransition: "¡FIN DEL TRAMO 4!", atMs: Date.parse("2025-09-11T06:00:00Z") },
        { key: "end_tramo_4", labelCountdown: "INICIO 4° TORNEO", labelTransition: "🚀 ¡INICIA EL 4° TORNEO!", atMs: Date.parse("2025-09-11T19:00:00Z") },
        { key: "start_tramo_5", labelCountdown: "FINALES DEDSAFIO", labelTransition: "🏁 ¡FINALES INICIADAS!", atMs: Date.parse("2025-09-12T19:00:00Z") },
      ],

      // índice actual y fase
      tlIndex: 0,                        
      phase: 'countdown',               
      transitionUntil: null,             
      tickerId: null,                    
      remainingMs: 0,                    
    };
  },

  computed: {
    store: () => useGameStore(),
    emulator_on() { return this.store ? this.store.emulator_on : null; },
    game_data() { return this.store ? this.store.game_data : null; },
    api_token() { return this.store ? this.store.api_token : null; },
    logged_in() { return this.api_token && this.api_token.length > 0; },
    profile() { return this.store ? this.store.profile_data : null; },

    hasCurrentTarget() {
      return this.tlIndex >= 0 && this.tlIndex < this.timeline.length;
    },

    currentCountdownLabel() {
      if (!this.hasCurrentTarget) return "SIN EVENTOS PENDIENTES";
      return this.timeline[this.tlIndex].labelCountdown;
    },

    currentTransitionLabel() {
      if (!this.hasCurrentTarget) return "¡Gracias por acompañarnos!";
      return this.timeline[this.tlIndex].labelTransition || "🚀 ¡INICIAMOS!";
    },

    remaining() {
      const ms = Math.max(0, this.remainingMs || 0);
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return {
        days,
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      };
    },
  },

  async mounted() {
    this.initTimelinePhase();

    // Empieza el ticker principal (1s)
    this.startTicker();

    const token = this.api_token;
    if (token) {
      this.loading_team = true;
      const config = { headers: { Authorization: `Token ${token}` } };
      try {
        const res = await getAxios().get(`/api/trainers/get_team/`, config);
        this.team = res.data;
      } catch (err) {
        this.team = [];
        console.error("Error al cargar el equipo:", err);
      } finally {
        this.loading_team = false;
      }
    }
    getAxios().get('/api/notifications/').then(r => { this.notifications = r.data; });
    getAxios().get('/api/newsletter/').then(r => { this.newsletter = r.data; });
  },

  beforeUnmount() {
    if (this.tickerId) {
      clearInterval(this.tickerId);
      this.tickerId = null;
    }
  },

  methods: {
    selectPokemon(pokemon) {
      this.selected_pokemon = pokemon;
      this.display = true;
    },

    getTimeLeftMs(atMs) {
      return atMs - Date.now();
    },

    initTimelinePhase() {
      const now = Date.now();
      const idxNext = this.timeline.findIndex(t => t.atMs > now);
      const idxPrev = (idxNext === -1 ? this.timeline.length : idxNext) - 1;

      if (idxPrev >= 0) {
        const prevAt = this.timeline[idxPrev].atMs;
        const until = prevAt + this.TRANSITION_MS;
        if (now >= prevAt && now < until) {
          this.tlIndex = idxPrev;
          this.phase = 'transition';
          this.transitionUntil = until;
          this.remainingMs = 0; 
          return;
        }
      }

      if (idxNext === -1) {
        this.phase = 'done';
        this.tlIndex = this.timeline.length;
        this.remainingMs = 0;
      } else {
        this.phase = 'countdown';
        this.tlIndex = idxNext;
        this.remainingMs = Math.max(0, this.getTimeLeftMs(this.timeline[idxNext].atMs));
      }
    },

    startTicker() {
      if (this.tickerId) clearInterval(this.tickerId);

      const tick = () => {
        if (this.phase === 'done') {
          this.remainingMs = 0;
          return;
        }

        if (!this.hasCurrentTarget) {
          this.phase = 'done';
          this.remainingMs = 0;
          return;
        }

        if (this.phase === 'transition') {
          if (this.transitionUntil !== null && Date.now() >= this.transitionUntil) {
            const next = this.tlIndex + 1;
            if (next >= this.timeline.length) {
              this.tlIndex = next;
              this.phase = 'done';
              this.remainingMs = 0;
            } else {
              this.tlIndex = next;
              this.phase = 'countdown';
              this.transitionUntil = null;
              this.remainingMs = Math.max(0, this.getTimeLeftMs(this.timeline[next].atMs));
            }
          }
          return;
        }

        const targetMs = this.timeline[this.tlIndex].atMs;
        const diff = this.getTimeLeftMs(targetMs);
        this.remainingMs = Math.max(0, diff);

        // Llegó a cero? -> entrar en transición de este hito
        if (diff <= 0) {
          this.phase = 'transition';
          this.transitionUntil = targetMs + this.TRANSITION_MS;
          this.remainingMs = 0;
        }
      };

      // primer cálculo inmediato y luego cada segundo
      tick();
      this.tickerId = setInterval(tick, 1000);
    },
  },
};
</script>

<style scoped>
.news-card {
  min-width: 500px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
}

.news-body {
  max-height: 320px;
}

.news-body::-webkit-scrollbar {
  width: 8px;
}

.news-body::-webkit-scrollbar-thumb {
  background: rgba(213, 4, 141, .35);
  border-radius: 8px;
}

.textNoticias {
  text-transform: uppercase;
}

.news-body {
  max-height: 40vh;
}

@media (min-width: 960px) {
  .news-body {
    max-height: 30vh;
  }
}

.notif-card {
  display: flex;
  flex-direction: column;
}

.notif-body {
  min-height: 230px;
  max-height: 230vh;
  overflow-y: auto;
}

.notif-body::-webkit-scrollbar {
  width: 8px;
}

.notif-body::-webkit-scrollbar-thumb {
  background: rgba(213, 4, 141, .35);
  border-radius: 8px;
}

.countdown-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.time-box {
  flex: 1;
  text-align: center;
  padding: 8px 6px;
  border-radius: 12px;
  border: 1px solid var(--pink, #D5048D);
}

.time-num {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.time-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  letter-spacing: 1px;
}

.sep {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  margin: 0 4px;
  opacity: 0.7;
}

.flex {
  display: flex;
  gap: 10px;
}

.colorWhite {
  color: white;
}
</style>