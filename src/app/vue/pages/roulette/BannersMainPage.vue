<template>
  <v-row class="h-100">
    <v-col cols="2" class="h-100 mr-6">
      <div class="panel">
        <div class="stack mt-6">
          <v-img :src="'./icon.png'" aspect-ratio="1/1" height="150px" style="margin-top: -75px"/>
          <v-img class="cursor-pointer banner-logo mt-4 mb-8" :src="banner.id === selected_banner?.id ? banner.active_banner_logo : banner.banner_logo" aspect-ratio="3/111"
                 width="292px" :class="banner.id === selected_banner?.id ? 'force-active ' : ''"
                 v-for="banner in banners" :key="banner.id" @click="select_banner(banner)"/>
        </div>
      </div>
    </v-col>
    <v-col class="d-flex flex-column justify-center align-items-center ml-16 mt-16" v-if="selected_banner">
      <FloatingRouletteInfoCard :wishes="selected_banner.wishes ?? 0"/>
      <v-row class="mt-16 mb-0">
        <v-card class="vcard-pkm" :style="`background: url(${selected_banner.banner_image}); max-width: 90%`">
          <v-container class="d-flex flex-column align-items-start h-100">
            <v-spacer class="mb-16 pb-16"></v-spacer>
            <v-row class="ml-16 actions mt-16 pt-2">
              <v-col>
                <v-btn :class="toClass(selected_banner.name)" variant="elevated" max-width="280px" width="280px" max-height="74px" height="74px" class="pb-1 pt-1 pl-4 roll-btn" @click="roll_banner">
                  <template #default>
                    TIRAR
                  </template>
                  <template #append>
                    <v-img :src="'./assets/icons/Vector.png'" class="ml-10" aspect-ratio="1/1" height="24" width="24"/>
                  </template>
                </v-btn>
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
          </v-container>
        </v-card>
      </v-row>
      <v-row class="mt-0">
        <v-spacer/>
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
  <v-dialog v-model="winner" max-width="450">
    <v-row>
      <v-img :src="winner.image"/>
    </v-row>
    <v-row>
      <v-col class="w-100 d-flex flex-row justify-center align-items-center">
        <h2 style="color: black; text-shadow: white 0 0 2px">{{ winner.name }}</h2>
      </v-col>
    </v-row>
  </v-dialog>
  <v-dialog v-model="prizes_list_display" max-width="450">
    <v-card>
      <v-data-table
          height="55vh"
          density="comfortable"
          hide-default-footer
          items-per-page="20"
          :items="selected_banner.prize_probability"
          :headers="headers">
        <template #item="{item}">
          <tr class="mt-16">
            <td class="pa-0">
              <v-img :src="`https://para-mada-deploy.s3.us-east-1.amazonaws.com/prod/dedsafio-pokemon/media/${item.image}`" height="48"/>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.probability }}%</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
  <v-dialog v-model="history_display" max-width="450">
    <v-card>
      <v-data-table
          height="55vh"
          density="comfortable"
          hide-default-footer
          items-per-page="20"
          :items="selected_banner.history"
          :headers="history_headers">
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
import {emitter, getAxios} from "@/stores";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowRight, mdiChevronRight } from '@mdi/js';
import FloatingRouletteInfoCard from '@/app/vue/components/app-comps/displays/FloatingRouletteInfoCard'

export default {
  name: "BannersMainPage",
  components: {
    SvgIcon,
    FloatingRouletteInfoCard
  },
  data() {
    return {
      banners: [],
      selected_banner: null,
      winner: null,
      path: mdiArrowRight,
      chevron_right: mdiChevronRight,
      prizes_list_display: false,
      history_display: false,
      headers: [
        {title: '', value: 'sprite_url'},
        {title: 'Nombre', value: 'name'},
        {title: 'Probabilidad', value: 'probability'},
      ],
      history_headers: [
        {title: 'Registro', value: 'message'},
      ]
    }
  },
  methods: {
    async getBanners() {
      const response = await getAxios().get('/api/roulette/');
      this.banners = response.data;
    },
    select_banner(banner) {
      this.selected_banner = banner;
    },
    toClass(name) {
      return name.toLowerCase().replaceAll(' ', '-')
    },
    roll_banner() {
      getAxios().post(`/api/roulette/${this.selected_banner.id}/roll/`).then((response) => {
        if (response.status === 200) {
          this.winner = response.data
          this.selected_banner.wishes--;
        }
      }).catch(error => {
        if (error.status === 400) {
          emitter.emit('action-notification', {
            type: 'error',
            title: '¡Error!',
            message: error.response.data,
          });
        } else if (error.status === 500 && error.response.data.detail === 'contact_paramada') {
          emitter.emit('custom-dialog', {
            title: '¡Error!',
            message: `Ha ocurrido un error, contacta a soporte y mandales este numero: ${error.response.data.error_id}`,
          });
        }
      });
    }
  },
  mounted() {
    this.getBanners();
  }
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
  background-color: #0060DE;
  color: white;
}

.ruleta-7mo-gimnasio {
  background-color: #0060DE;
  color: white;
}

.ruleta-8vo-gimnasio {
  background-color: #0060DE;
  color: white;
}

.ruleta-lysson {
  background-color: #0060DE;
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
  --pad: clamp(14px, 2.5vw, 24px); /* espacio arriba/abajo de la tira */
  --w: min(298px, 92vw); /* ancho máximo responsivo */
  position: relative;
  width: var(--w);
  padding-block: var(--pad);
  min-height: 90vh;
}

/* La TIRA BLANCA detrás (más angosta que las tarjetas) */
.stack::before {
  content: "";
  position: absolute;
  inset: var(--pad) /* top/bottom */ clamp(18px, 8vw, 48px); /* left/right => controla qué tan angosta es */
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .25);
  z-index: 0;
  height: 100%;
}

/* Tarjetas */
.card {
  position: relative;
  z-index: 1; /* por encima de la tira */
  margin-block: clamp(8px, 1.8vw, 14px);
  padding: clamp(12px, 2.2vw, 18px) clamp(14px, 3vw, 22px);
  border-radius: 16px;
  font: 600 16px/1 system-ui, sans-serif;
  color: #222;
  height: clamp(64px, 14vw, 96px); /* alto responsivo (opcional) */
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