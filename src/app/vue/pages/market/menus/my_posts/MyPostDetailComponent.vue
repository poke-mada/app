<template>
  <div class="ofertasDivPoke">
    <v-row class="font-weight-bold border-bottom py-2">
      <v-col cols="3" class="d-flex justify-center">IMAGEN</v-col>
      <v-col cols="3" class="d-flex justify-center">NOMBRE</v-col>
      <v-col cols="3" class="d-flex justify-center">CANTIDAD/MOTE</v-col>
      <v-col cols="3" class="d-flex justify-center">PROPIETARIO</v-col>
      <v-divider class="mb-2"/>
    </v-row>
    <v-row class="d-flex flex-row justify-center align-center border-bottom">
      <v-col cols="3">
        <v-img :src="post.items[0].sprite" max-height="60" aspect-ratio="1/1"/>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        {{ post.items[0].name }}
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        {{ post.items[0].mote_or_quantity }}
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        {{ post.creator }}
      </v-col>
    </v-row>
  </div>
  <!-- Encabezado -->
  <div>
    <v-container class="tittleColores p-0 mb-5">
      <v-row>
        <v-col cols="10">
          <h1>OFERTAS</h1>
        </v-col>
      </v-row>
      <v-divider class="mb-2"/>
    </v-container>
    <v-row>
      <v-col cols="4" v-for="offer in offers" :key="offer.id">
        <v-card class="rounded-xl" max-width="500" style="position: relative; border: 1px solid var(--pink)">
          <!-- Encabezado PERFIL OFERTA -->
          <div class="divCardSupPurple d-flex justify-center align-center">
            <v-avatar size="50">
              <v-img :src="offer.creator_photo"></v-img>
            </v-avatar>
            <div class="nameOfertaSection">
              <h2 class="name">{{ offer.creator }}</h2>
            </div>
          </div>
          <!-- OFERTA DE CADA UNO -->
          <div class="paddingCardOferta">
            <div v-for="item in offer.items" :key="item.id"
                 class="d-flex flex-column justify-center align-items-center w-100">
              <div class="cardColores d-flex justify-center align-center">
                <v-img :src="item.sprite" max-width="112"/>
                <div class="d-flex justify-center align-center flex-column">
                  <p class="text-center bold">{{ item.name }}</p>
                  <p class="text-center f-sm"> x{{ item.mote_or_quantity }}</p>
                </div>
              </div>
            </div>
          </div>

          <v-row class="d-flex flex-row-reverse">
            <v-col cols="4" class="mb-2">
              <v-btn class="gradient-btn" text="ACEPTAR"/>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {getAxios} from "@/stores";

export default {
  name: "PostDetailComponent",
  props: {
    post: {
      required: true,
      type: Object
    },
    allow_offer: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      offers: []
    }
  },
  async mounted() {
    const response = await getAxios().get(`/api/market/${this.post.id}/`);
    this.offers = response.data.offers;
  }
}
</script>

<style scoped>

</style>