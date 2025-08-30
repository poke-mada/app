<template>
  <template v-if="!showCreate">
    <!-- lista/detalle de Mis Anuncios -->
    <v-container class="w-100" v-if="!selected_post">
      <!-- Encabezado -->
      <v-row class="font-weight-bold border-bottom py-2">
        <v-col cols="2">IMAGEN</v-col>
        <v-col cols="3">NOMBRE</v-col>
        <v-col cols="3">CANTIDAD/MOTE</v-col>
        <v-col cols="3">Estatus</v-col>
        <v-col cols="3">PROPIETARIO</v-col>
        <v-col cols="1">
          <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
        </v-col>
        <v-divider class="mb-2"/>
      </v-row>

      <!-- Lista -->
      <v-row v-for="post in my_posts" :key="post.id"
             class="d-flex flex-row justify-center align-center border-bottom">
        <v-col cols="2">
          <v-img :src="post.items[0].sprite" max-height="60" aspect-ratio="1/1"/>
        </v-col>
        <v-col cols="3">
          {{ post.items[0].name }}
        </v-col>
        <v-col cols="3">
          {{ post.items[0].mote_or_quantity }}
        </v-col>
        <v-col cols="2">
          {{ post.status_display }}
        </v-col>
        <v-col cols="2">
          <v-btn @click="select_post(post)" class="btn-grad-contact mt-4">
            <span class="btn-text">VER</span>
            <span class="btn-icon">
                      <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="3px" strokeLinecap="round" strokeLinejoin="round"
                              d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
          </v-btn>
        </v-col>
        <v-divider class="mb-2"/>
      </v-row>
      <div class="w-100">
        <v-card-actions class="mt-5 d-flex justify-end align-center">
          <v-btn class="btnColorEvent h-100 pa-3" :to="{ name: 'market-create' }">
            Crear oferta
          </v-btn>
        </v-card-actions>
      </div>
    </v-container>
    <v-container class="w-100" v-if="selected_post">
      <div class="ofertasDivPoke">
        <v-row class="font-weight-bold border-bottom py-2">
          <v-col cols="3" class="d-flex justify-center">IMAGEN</v-col>
          <v-col cols="3" class="d-flex justify-center">NOMBRE</v-col>
          <v-col cols="3" class="d-flex justify-center">CANTIDAD/MOTE</v-col>
          <v-col cols="3" class="d-flex justify-center">PROPIETARIO</v-col>
          <v-divider class="mb-2"/>
        </v-row>
        <v-row v-for="item in selected_post.items" :key="item.id"
               class="d-flex flex-row justify-center align-center border-bottom">
          <v-col cols="3">
            <v-img :src="item.sprite" max-height="60" aspect-ratio="1/1"/>
          </v-col>
          <v-col cols="3" class="d-flex justify-center">
            {{ item.name }}
          </v-col>
          <v-col cols="3" class="d-flex justify-center">
            {{ item.mote_or_quantity }}
          </v-col>
          <v-col cols="3" class="d-flex justify-center">
            {{ selected_post.creator }}
          </v-col>
        </v-row>
      </div>
      <!-- Encabezado -->
      <div>
        <v-container class="tittleColores p-0 mb-5">
          <h1>OFERTAS</h1>
          <v-divider class="mb-2"/>
        </v-container>
        <v-row>
          <v-col cols="4" v-for="offer in selected_post.offers" :key="offer.id">
            <v-card class="rounded-xl" max-width="500"
                    style="position: relative; border: 1px solid var(--pink)">
              <!-- Encabezado PERFIL OFERTA -->
              <div class="divCardSupPurple d-flex justify-center align-center">
                <v-avatar size="50">
                  <v-img :src="offer.profile_picture"></v-img>
                </v-avatar>
                <div class="nameOfertaSection">
                  <h2 class="name">{{ offer.owner_name }}</h2>
                  <p class="textMensaje">"Mensaje del usuario"</p>

                </div>
              </div>
              <!-- OFERTA DE CADA UNO -->
              <div class="paddingCardOferta">
                <v-row v-if="offer.type_offer === 'Object'">
                  <div v-for="item in offer.items" :key="item.id"
                       class="d-flex flex-column justify-center align-items-center w-100">
                    <div class="cardColores d-flex justify-center align-center">
                      <v-img :src="item.sprite" max-width="112"/>
                      <div class="d-flex justify-center align-center flex-column">
                        <p class="text-center bold">{{ item.item_name }}</p>
                        <p class="text-center f-sm"> x{{ item.mote_or_quantity }}</p>
                      </div>
                    </div>
                  </div>
                </v-row>
                <v-row v-if="offer.type_offer != 'Object'">
                  <div v-for="item in offer.items" :key="item.id"
                       class="d-flex flex-column justify-center align-items-center w-100">
                    <div class="cardColores d-flex justify-center align-center">
                      <v-img :src="item.sprite" max-width="112"/>
                      <div class="d-flex justify-center align-center flex-column">
                        <p class="text-center bold">{{ item.mote_or_quantity }}</p>
                        <p class="text-center f-sm">Nv. {{ item.level }}</p>
                        <v-img :src="`./assets/types/Types/${item.type}.png`" width="32" aspect-ratio="1/1"/>
                      </div>
                    </div>
                  </div>
                </v-row>
                <v-card-actions class="mt-5 d-flex justify-center align-center">
                  <v-btn class="btnColorEvent">Aceptar</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </template>
  <template v-else>
    <CreateOffer @cancel="closeCreate" @created="closeCreate"/>
  </template>
</template>

<script>
import {defineAsyncComponent} from 'vue'
import {getAxios} from "@/stores";
export default {
  name: "MyPostsComponent",
  components: {
    CreateOffer: defineAsyncComponent(() => import('@/app/vue/pages/market/create.vue'))
  },
  data() {
    return {
      showCreate: false,
      posts: [],
      selected_post: null,
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    },
  },
  mounted() {
    this.load_my_posts();
    if (this.$route.name === 'market-create' || this.$route.meta?.openCreate) {
      this.tab = 2
      this.showCreate = true
    }
  },
  methods: {
    async select_post(post) {
      this.selected_post = post
      const response = await getAxios().get(`/api/market/${post.id}/`);
      this.offers = response.data.offers;
    },
    openCreate() {
      this.$router.push({name: 'market-create'})
    },
    closeCreate() {
      this.$router.push({name: 'market'})
    },
    async load_my_posts() {
      const response = await getAxios().get('/api/market/list_mine/')
      this.my_posts = response.data;
    }
  }
}
</script>

<style scoped>

</style>