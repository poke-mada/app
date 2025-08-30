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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import Showdown from '@/icons/Showdown.svg';
</script>

<script>
import {getAxios} from "@/stores";

export default {
  name: "StaffPage",

  data() {
    return {
      newsletter: [],
    };
  },
  mounted() {
    getAxios().get('/api/newsletter/').then(json_data => {
      this.newsletter = json_data.data;
    });
  },
}
</script>

<style scoped>

</style>