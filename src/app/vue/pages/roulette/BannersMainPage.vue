<template>
  <v-row class="h-100">
    <v-col cols="2" class="h-100">
      <div class="vertical-tire">
        <v-img class="cursor-pointer banner-logo mt-4 mb-4" :src="banner.banner_logo" aspect-ratio="2/1" height="100px"
               v-for="banner in banners" :key="banner.id" @click="select_banner(banner)"/>
      </div>
    </v-col>
    <v-col class="d-flex flex-column justify-center align-items-center">
      <v-card v-if="selected_banner" class="h-75 rounded-xl vcard-pkm"
              :style="`background: url(${selected_banner.banner_image})`">
        <div class="divCardSup pa-5 d-flex justify-center align-center">
          <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
            <v-img src="/assets/img/Home/Pokeball.png"></v-img>
          </v-avatar>
          <h2 class="textNoticias">{{ selected_banner.name }}</h2>
        </div>
        <ul style="list-style: none" class="ml-4">
          <li v-for="prize in selected_banner.prize_probability" :key="prize.name">
            <span style="color: black; text-shadow: white 0 0 2px">{{ prize.name }} ({{ prize.probability }})</span>
          </li>
        </ul>
        <template #actions>
          <v-btn color="teal" variant="elevated" @click="roll_banner">Tirada</v-btn>
        </template>
      </v-card>
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
</template>

<script>
import {emitter, getAxios} from "@/stores";

export default {
  name: "BannersMainPage",
  data() {
    return {
      banners: [],
      selected_banner: null,
      winner: null
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
    roll_banner() {
      getAxios().post(`/api/roulette/${this.selected_banner.id}/roll/`).then((response) => {
        if (response.status === 200) {
          this.winner = response.data
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

.vertical-tire {
  background: #191919CC;
  height: 100%;
  margin: 0;
}

.banner-logo img {
  border: 2px #2c3e50 solid;
  border-radius: 10%;
}

.vcard-pkm {
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
</style>