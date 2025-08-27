<template>
  <v-container v-if="!isWideEnough" class="h-100 d-flex align-center justify-center">
    <v-card class="pa-8 text-center rounded-xl" elevation="6" max-width="640">
      <h2 style="font-weight:700" class="mb-2">Amplía la ventana</h2>
      <p class="mb-6">
        Para usar la ruleta, aumenta el ancho de la ventana a <strong>1600px</strong> o más.
      </p>
      <p class="text-medium-emphasis">Ancho actual: {{ windowWidth }} px</p>
    </v-card>
  </v-container>
  <template v-else>
    <v-dialog v-show="showWheel">
      <div v-show="showWheel" ref="wheelWrap" class="wheel-wrap d-flex justify-center align-center">
        <RouletteWheel :items="items" :ref="setWheel"
                       @start="onWheelStart(); $refs.spinBtn && $refs.spinBtn.handleStart()"
                       @peak="$refs.spinBtn && $refs.spinBtn.handlePeak()" @done="$refs.spinBtn && $refs.spinBtn.handleDone($event)" />
      </div>
      <CardReveal :ref="setCardReveal" @close="onCardClose" />
    </v-dialog>
    <v-row class="h-100">
      <v-col cols="2" class="h-100 mr-6">
        <div class="panel">
          <div class="stack mt-6">
            <v-img :src="'./icon.png'" aspect-ratio="1/1" height="150px" style="margin-top: -75px" />
            <v-img class="cursor-pointer banner-logo mt-4 mb-8"
              :src="banner.id === selected_banner?.id ? banner.active_banner_logo : banner.banner_logo"
              aspect-ratio="3/111" width="292px" :class="banner.id === selected_banner?.id ? 'force-active ' : ''"
              v-for="banner in banners" :key="banner.id" @click="select_banner(banner)" />
          </div>
        </div>
      </v-col>

      <v-col class="d-flex flex-column justify-center align-items-center ml-16 mt-16" v-if="selected_banner">
        <FloatingRouletteInfoCard :wishes="selected_banner.wishes ?? 0" />

        <v-row class="mt-16 mb-0">
          <v-card class="vcard-pkm" :style="`background: url(${selected_banner.banner_image}); max-width: 90%`">
            <v-container class="d-flex flex-column align-items-start h-100">
              <v-spacer class="mb-16 pb-16"></v-spacer>

              <v-row class="ml-16 actions mt-16 pt-2">
                <v-col>
                  <SpinButton :class="toClass(selected_banner.name)" class="pb-1 pt-1 pl-4 roll-btn" ref="spinBtn" debug
                    max-width="280px" width="280px" max-height="74px" height="74px" :token="api_token"
                    :roulette-id="selected_banner.id" :wheel="wheelRef" :card-reveal="cardRevealRef"
                    @set-items="items = $event" @click="onSpinClick">
                    <template #default>
                      TIRAR
                    </template>
                    <template #append>
                      <v-img :src="'./assets/icons/Vector.png'" class="ml-10" aspect-ratio="1/1" height="24"
                        width="24" />
                    </template>
                  </SpinButton>
                </v-col>
              </v-row>
              <v-spacer></v-spacer>
            </v-container>
          </v-card>
        </v-row>

        <v-row class="mt-0">
          <v-spacer />
          <v-col cols="3">
            <v-btn class="gradient-btn" text="LISTA DE RECOMPENSAS" @click="prizes_list_display = true">
              <template #append>
                <svg-icon type="mdi" :path="chevron_right"></svg-icon>
              </template>
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn class="gradient-btn" text="HISTORIAL" @click="history_display = true">
              <template #append>
                <svg-icon type="mdi" :path="chevron_right"></svg-icon>
              </template>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Dialog original de ganador (no usado por la nueva ruleta, lo dejamos intacto) -->
    <v-dialog v-model="winner" max-width="450">
      <v-row>
        <v-img :src="winner?.image" />
      </v-row>
      <v-row>
        <v-col class="w-100 d-flex flex-row justify-center align-items-center">
          <h2 style="color: black; text-shadow: white 0 0 2px">{{ winner?.name }}</h2>
        </v-col>
      </v-row>
    </v-dialog>

    <v-dialog v-model="prizes_list_display" max-width="600">
      <v-card v-if="selected_banner" class="cardBorderInfo" elevation="6">
        <!-- Encabezado amarillo -->
        <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
          <h2 class="textInfoEvent">
            {{ selected_banner.name || 'Premios' }}
          </h2>
        </v-alert>

        <!-- Contenido: la tabla -->
        <v-card-text class="paddingTable">
          <v-data-table class="yellow-card-table" height="55vh" density="comfortable" hide-default-footer
            items-per-page="20" :items="selected_banner.prize_probability" :headers="headers">
            <template #item="{ item }">
              <tr class="mt-16">
                <td class="pa-0">
                  <v-img
                    :src="`https://para-mada-deploy.s3.us-east-1.amazonaws.com/prod/dedsafio-pokemon/media/${item.image}`"
                    height="48" />
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.probability }}%</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="prizes_list_display = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="history_display" max-width="600">
      <v-card v-if="selected_banner" class="cardBorderInfo" elevation="6">
        <!-- Encabezado amarillo -->
        <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
          <h2 class="textInfoEvent">
            Historial
          </h2>
        </v-alert>

        <!-- Contenido: la tabla -->
        <v-card-text class="pa-0">
          <v-data-table class="yellow-card-table" height="55vh" density="comfortable" hide-default-footer
            items-per-page="20" :items="selected_banner.history" :headers="history_headers" />
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="history_display = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
</template>



<script>
import { emitter, getAxios } from "@/stores";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowRight, mdiChevronRight } from '@mdi/js';
import FloatingRouletteInfoCard from '@/app/vue/components/app-comps/displays/FloatingRouletteInfoCard';
import { gsap } from 'gsap';
import RouletteWheel from '@/app/vue/pages/roulette/RouletteWheel.vue';
import SpinButton from '@/app/vue/pages/roulette/SpinButton.vue';
import CardReveal from '@/app/vue/pages/roulette/CardReveal.vue';
import { useGameStore } from "@/stores/app";

export default {
  name: "BannersMainPage",
  components: { SvgIcon, FloatingRouletteInfoCard, RouletteWheel, SpinButton, CardReveal },
  data() {
    return {
      // --- NUEVO ---
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,

      wheelRef: null,
      cardRevealRef: null,
      banners: [],
      selected_banner: null,
      winner: null,
      path: mdiArrowRight,
      chevron_right: mdiChevronRight,
      prizes_list_display: false,
      history_display: false,
      headers: [
        { title: '', value: 'sprite_url' },
        { title: 'Nombre', value: 'name' },
        { title: 'Probabilidad', value: 'probability' },
      ],
      history_headers: [{ title: 'Registro', value: 'message' }],
      items: [],
      showWheel: false,
      firstSpinDone: false,
    }
  },
  computed: {
    store() { return useGameStore(); },
    api_token() { return this.store.api_token; },
    // --- NUEVO ---
    isWideEnough() { return this.windowWidth >= 1600; },
  },
  methods: {
    // --- NUEVO ---
    onResize() {
      this.windowWidth = window.innerWidth;
      if (!this.isWideEnough) {
        // por si se hace pequeña mientras está abierta la ruleta
        this.showWheel = false;
        this.firstSpinDone = false;
      }
    },

    async getBanners() {
      const response = await getAxios().get('/api/roulette/');
      this.banners = response.data;
    },
    select_banner(banner) {
      this.selected_banner = banner;
      this.showWheel = false;
      this.firstSpinDone = false;
      this.items = [];
    },
    toClass(name) { return name?.toLowerCase?.().replaceAll(' ', '-') || ''; },
    setWheel(el) { this.wheelRef = el },
    setCardReveal(el) { this.cardRevealRef = el },

    async onSpinClick(e) {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      // --- NUEVO: bloquear spin si ventana chica
      if (!this.isWideEnough) return;

      if (!this.selected_banner) return;
      if (!this.showWheel) this.showWheel = true;

      await this.$nextTick();
      await this.$nextTick();

      if (!this.wheelRef || typeof this.wheelRef.spin !== 'function') {
        await this.$nextTick();
      }
      if (!this.wheelRef || typeof this.wheelRef.spin !== 'function') return;

      this.$refs.spinBtn?.requestAndSpin?.();
    },

    onWheelStart() {
      if (this.firstSpinDone) return;
      this.firstSpinDone = true;
      const wrap = this.$refs.wheelWrap;
      if (wrap) {
        gsap.to(wrap, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' });
      }
    },
    onCardClose() {
      const wrap = this.$refs.wheelWrap;
      if (wrap) {
        gsap.to(wrap, {
          autoAlpha: 0, scale: 0, duration: 0.6, ease: 'power2.in',
          onComplete: () => { this.showWheel = false; this.firstSpinDone = false; }
        });
      } else {
        this.showWheel = false; this.firstSpinDone = false;
      }
    },
  },
  mounted() {
    // --- NUEVO ---
    window.addEventListener('resize', this.onResize);
    this.onResize();

    emitter.on('successful-roll', () => {
      if (this.selected_banner) this.selected_banner.wishes--;
    });
    this.getBanners();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
}
</script>

<style scoped>
* {
  /*border: 1px solid red;*/
}

.ruleta-inicio-dedsafio {
  background-color: #FF46C5;
  color: white;
}

.ruleta-2do-gimnasio {
  background-color: #0060DE;
  color: white;
}

.ruleta-3er-gimnasio {
  background-color: #0060DE;
  color: white;
}

.ruleta-4to-gimnasio {
  background-color: #87FF72;
  color: white;
}

.ruleta-5to-gimnasio {
  background-color: #FFC81F;
  color: white;
}

.ruleta-6to-gimnasio {
  background-color: #EF08A4;
  color: white;
}

.ruleta-7mo-gimnasio {
  background-color: #E153FF;
  color: white;
}

.ruleta-8vo-gimnasio {
  background-color: #CE3E55;
  color: white;
}

.ruleta-lysson {
  background-color: #83B1EB;
  color: white;
}

.ruleta-comodin-tramo-1 {
  background-color: #8266E2;
  color: white;
}

.ruleta-comodin-tramo-2 {
  background-color: #00CB96;
  color: white;
}

.ruleta-comodin-tramo-3 {
  background-color: #00BE57;
  color: white;
}

.ruleta-comodin-tramo-4 {
  background-color: #D5464C;
  color: white;
}

.actions {
  height: 15%;
  max-height: 15%;
  min-height: 15%;
}

.banner-logo:hover {
  filter: brightness(100%);
}

.banner-logo {
  filter: brightness(50%);
}

.force-active {
  filter: brightness(100%);
}

.banner-title {
  font-family: 'Segoe UI', serif;
  font-size: 96px;
  font-weight: 900;
  letter-spacing: normal;
  height: 199px;
  -webkit-text-stroke: 3px white;
  text-transform: uppercase;
  text-shadow: 0 4px 4px black;
}

.banner-container {
  max-width: 75%;
  height: 199px;
}

.roll-btn {
  font-family: 'Segoe UI', serif;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 4px 10px 0 0 #353535;
  border-radius: 50px;
}

.vertical-tire {
  background: #191919CC;
  height: 100%;
  margin: 0;
}

.vcard-pkm {
  background-repeat: no-repeat !important;
  background-size: contain !important;
  height: 75vh;
  width: 65vw;
  box-shadow: none;
}

/* Solo para fondo de la demo */
.panel {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(12px, 3vw, 32px);
}

/* Contenedor de la pila */
.stack {
  --pad: clamp(14px, 2.5vw, 24px);
  /* espacio arriba/abajo de la tira */
  --w: min(298px, 92vw);
  /* ancho máximo responsivo */
  position: relative;
  width: var(--w);
  padding-block: var(--pad);
  min-height: 90vh;
}

/* La TIRA BLANCA detrás (más angosta que las tarjetas) */
.stack::before {
  content: "";
  position: absolute;
  inset: var(--pad)
    /* top/bottom */
    clamp(18px, 8vw, 48px);
  /* left/right => controla qué tan angosta es */
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .25);
  z-index: 0;
  height: 100%;
}

/* Tarjetas */
.card {
  position: relative;
  z-index: 1;
  /* por encima de la tira */
  margin-block: clamp(8px, 1.8vw, 14px);
  padding: clamp(12px, 2.2vw, 18px) clamp(14px, 3vw, 22px);
  border-radius: 16px;
  font: 600 16px/1 system-ui, sans-serif;
  color: #222;
  height: clamp(64px, 14vw, 96px);
  /* alto responsivo (opcional) */
  display: flex;
  align-items: center;
}

/* (Opcional) Haz las tarjetas ligeramente más anchas que el contenedor visual */
.card {
  /* sobresale a la izquierda/derecha para que la tira se vea más angosta */
  width: calc(100% + clamp(12px, 6vw, 64px));
  transform: translateX(calc(clamp(12px, 6vw, 64px) / -2));
}
</style>
<style>

.wheel-wrap {
  will-change: transform, opacity;
  transform-origin: center center;
  position: absolute;
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  margin-left: 125px;
  transform: scale(0);
}

.cardBorderInfo {
  border-radius: 40px !important;
}

.paddingTable {
  padding: 15px;
}
</style>